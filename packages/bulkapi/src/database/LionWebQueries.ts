import { SQL_insertNodeArray } from "@lionweb/server-common/dist/queries/InsertNodeArry.js"
import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import {
    CreatePartitionsResponse,
    StoreResponse,
    HttpSuccessCodes,
    HttpClientErrors,
    DeletePartitionsResponse
} from "@lionweb/server-shared"
import { dbLogger } from "@lionweb/server-logging"
import {
    QueryReturnType,
    UNLIMITED_DEPTH,
    DbChanges,
    MetaPointersTracker,
    DB_reservedNodeIdsByOtherClient,
    DB_retrieveNodeTree,
    DB_retrieveFullNodesFromIdList,
    versionResultToResponse,
    SQL_currentRepoVersion,
    SQL_nextRepoVersion,
    SQL_deleteFullNodes
} from "@lionweb/server-common"
import { LionWebJsonChunkWrapper, NodeUtils, JsonContext } from "@lionweb/json-utils"
import { LionWebJsonChunk, LionWebJsonNode } from "@lionweb/json"
import {
    PropertyValueChanged,
    ReferenceChange,
    AnnotationAdded,
    AnnotationRemoved,
    ChildOrderChanged,
    NodeAdded,
    ChildAdded,
    ChildRemoved,
    LionWebJsonDiff,
    ParentChanged,
    AnnotationOrderChanged,
    NodeRemoved
} from "@lionweb/json-diff"

import { BulkApiContext } from "../main.js"

function createDummyNode(nodeId: string): LionWebJsonNode {
    return {
        id: nodeId,
        classifier: { language: "", version: "", key: "" },
        properties: [],
        containments: [],
        references: [],
        annotations: [],
        parent: null
    }
}

export type NodeTreeResultType = {
    id: string
    parent: string
    depth: number
}

/**
 * Database functions.
 */
export class LionWebQueries {
    constructor(private context: BulkApiContext) {}

    /**
     * Get all partitions: this returns all nodes that have parent set to null or undefined
     */


    /**
     * Get the current version of the repo.
     * Should only be used by non-changing queries, as otherwise the _nextRepoVersion_ function should be used..
     */
    DB_currentRepoVersion = async (task: LionWebTask, repositoryData: RepositoryData): Promise<number> => {
        const v = await task.query(repositoryData, SQL_currentRepoVersion())
        return Number.parseInt(v.value)
    }

    createPartitions = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        partitions: LionWebJsonChunk
    ): Promise<QueryReturnType<CreatePartitionsResponse>> => {
        dbLogger.info("LionWebQueries.createPartitions repo {repositoryData}", {repositoryData})
        let query = SQL_nextRepoVersion(repositoryData.clientId)
        const metaPointersTracker = new MetaPointersTracker(repositoryData)
        await metaPointersTracker.populateFromNodes(partitions.nodes, task)
        query += SQL_insertNodeArray(partitions.nodes, metaPointersTracker)
        dbLogger.info(query)
        const [versionresult] = await task.multi(repositoryData, query)
        return {
            status: HttpSuccessCodes.Ok,
            query: query,
            queryResult: {
                success: true,
                messages: [versionResultToResponse(versionresult)]
            }
        }
    }

    /**
     * Store all nodes in the `nodes` collection in the nodes table.
     *
     * @param toBeStoredChunk
     */
    store = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        toBeStoredChunk: LionWebJsonChunk
    ): Promise<QueryReturnType<StoreResponse>> => {
        dbLogger.info("LionWebQueries.store")
        if (toBeStoredChunk === null || toBeStoredChunk === undefined) {
            return {
                status: HttpClientErrors.PreconditionFailed,
                query: "",
                queryResult: {
                    success: false,
                    messages: [{ kind: "NullChunk", message: "null chunk not stored" }]
                }
            }
        }
        // const toBeStoredChunkWrapper = new LionWebJsonChunkWrapper(toBeStoredChunk)
        const tbsNodeIds = toBeStoredChunk.nodes.map(node => node.id)
        const tbsContainedChildIds = this.getContainedIds(toBeStoredChunk.nodes)
        const tbsNodeAndChildIds = [...tbsNodeIds, ...tbsContainedChildIds.filter(cid => !tbsNodeIds.includes(cid))]
        dbLogger.info("tbsNodeAndChildIds ", { tbsNodeAndChildIds: tbsNodeAndChildIds })
        // Retrieve nodes for all id's that exist
        const databaseChunk = await this.context.bulkApiWorker.bulkRetrieve(task, repositoryData, tbsNodeAndChildIds, 0)
        const databaseChunkWrapper = new LionWebJsonChunkWrapper(databaseChunk.queryResult.chunk)
        dbLogger.info("database chunk", { chunk: databaseChunkWrapper.jsonChunk }, )

        // Check whether there are new nodes without a parent
        const newNodesWithoutParent = toBeStoredChunk.nodes
            .filter(node => node.parent === null)
            .filter(node => databaseChunkWrapper.getNode(node.id) === undefined)
        if (newNodesWithoutParent.length !== 0) {
            return {
                status: HttpClientErrors.PreconditionFailed,
                query: "",
                queryResult: {
                    success: false,
                    messages: [
                        { kind: "ParentMissing", message: `Cannot create new nodes ${newNodesWithoutParent.map(n => n.id)} without parent` }
                    ]
                }
            }
        }

        const diff = new LionWebJsonDiff()
        diff.diffLwChunk(databaseChunkWrapper.jsonChunk, toBeStoredChunk)
        dbLogger.info("STORE.CHANGES")
        dbLogger.info(diff.diffResult.changes.map(ch => "    " + ch.changeMsg()).join("\n"))

        const toBeStoredNewNodes = diff.diffResult.changes.filter((ch): ch is NodeAdded => ch.changeType === "NodeAdded")
        const addedChildren: ChildAdded[] = diff.diffResult.changes.filter((ch): ch is ChildAdded => ch instanceof ChildAdded)
        const removedChildren = diff.diffResult.changes.filter((ch): ch is ChildRemoved => ch.changeType === "ChildRemoved")
        const childrenOrderChanged = diff.diffResult.changes.filter((ch): ch is ChildOrderChanged => ch instanceof ChildOrderChanged)
        const parentChanged = diff.diffResult.changes.filter((ch): ch is ParentChanged => ch.changeType === "ParentChanged")
        const propertyChanged = diff.diffResult.changes.filter((ch): ch is PropertyValueChanged => ch.changeType === "PropertyValueChanged")
        const targetsChanged = diff.diffResult.changes.filter((ch): ch is ReferenceChange => ch instanceof ReferenceChange)
        const addedAnnotations = diff.diffResult.changes.filter((ch): ch is AnnotationAdded => ch instanceof AnnotationAdded)
        const removedAnnotations = diff.diffResult.changes.filter((ch): ch is AnnotationRemoved => ch instanceof AnnotationRemoved)
        const annotationOrderChanged = diff.diffResult.changes.filter(
            (ch): ch is AnnotationOrderChanged => ch instanceof AnnotationOrderChanged
        )

        // Only children that already exist in the database
        const databaseChildrenOfNewNodes = this.getContainedIds(toBeStoredNewNodes.map(ch => ch.node)).flatMap(id => {
            const node = databaseChunkWrapper.getNode(id)
            return node !== undefined ? [node] : []
        })

        // Orphans
        const removedAndNotAddedChildren = removedChildren.filter(removed => {
            return (
                addedChildren.find(added => added.childId === removed.childId) === undefined &&
                databaseChildrenOfNewNodes.find(child => child.id === removed.childId) === undefined
            )
        })
        // Orphaned annotations
        const removedAndNotAddedAnnotations = removedAnnotations.filter(removed => {
            return (
                addedAnnotations.find(added => added.annotationId === removed.annotationId) === undefined &&
                databaseChildrenOfNewNodes.find(child => child.id === removed.annotationId) === undefined
            )
        })
        // Now get all children of the orphans
        const orphansContainedChildren = await DB_retrieveNodeTree(task, repositoryData, removedAndNotAddedChildren.map(rm => rm.childId), UNLIMITED_DEPTH)
        const orphansContainedChildrenOrphans = orphansContainedChildren.filter(contained => {
            return (
                addedChildren.find(added => added.childId === contained.id) === undefined &&
                databaseChildrenOfNewNodes.find(child => child.id === contained.id) === undefined
            )
        })

        // remove child: from old parent
        const addedAndNotRemovedChildren = addedChildren.filter(added => {
            return removedChildren.find(removed => removed.childId === added.childId) === undefined
        })
        // Child node itself needs updating its parent
        // Existing nodes that have moved parent without the node being in the TBS chunk.
        const addedAndNotParentChangedChildren = addedChildren.filter(added => {
            return (
                parentChanged.find(parentChange => parentChange.node.id === added.childId) === undefined &&
                toBeStoredNewNodes.find(nodeAdded => nodeAdded.node.id === added.childId) === undefined
            )
        })

        // implicit child remove, find all parents
        const implicitlyRemovedChildNodes = await this.context.bulkApiWorker.bulkRetrieve(
            task,
            repositoryData,
            addedAndNotRemovedChildren.map(ch => ch.childId),
            0
        )
        const parentsOfImplicitlyRemovedChildNodes = await this.context.bulkApiWorker.bulkRetrieve(
            task,
            repositoryData,
            implicitlyRemovedChildNodes.queryResult.chunk.nodes.map(node => node.parent),
            0
        )
        // Now all changes are turned into queries.
        const dbCommands = new DbChanges(this.context.pgp)
        let queries = ""
        dbCommands.addChanges(propertyChanged)
        dbCommands.addChanges([...addedChildren, ...removedChildren, ...childrenOrderChanged])
        dbCommands.addChanges(parentChanged)
        this.makeQueriesForImplicitParentChanged(dbCommands, addedAndNotParentChangedChildren, databaseChunkWrapper)
        dbCommands.addChanges(targetsChanged)
        dbCommands.addChanges([...addedAnnotations, ...removedAnnotations, ...annotationOrderChanged])
        // Now deletions
        dbCommands.addChanges(
            orphansContainedChildrenOrphans.map(oc => {
                // Create dummy node to avoid lookup, we only need the _id_ of the node
                const dummyNode = createDummyNode(oc.id)
                return new NodeRemoved(new JsonContext(null, ["implicit_orphan"]), dummyNode)
            })
        )
        dbCommands.addChanges(
            removedAndNotAddedAnnotations.map(oc => {
                // Create dummy node to avoid lookup, we only need the _id_ of the node
                const dummyNode2 = createDummyNode(oc.annotationId)
                return new NodeRemoved(new JsonContext(null, ["implicit_orphan"]), dummyNode2)
            })
        )
        this.dbCommandsForImplicitlyRemovedChildNodes(
            dbCommands,
            implicitlyRemovedChildNodes.queryResult.chunk,
            parentsOfImplicitlyRemovedChildNodes.queryResult.chunk
        )
        const metaPointersTracker = new MetaPointersTracker(repositoryData)
        await dbCommands.populateMetaPointersFromDbChanges(
            metaPointersTracker,
            toBeStoredNewNodes.map(ch => (ch as NodeAdded).node),
            task
        )
        queries += dbCommands.createPostgresQuery(metaPointersTracker)

        // Check whether new node ids are not reserved for another client
        const reservedIds = await DB_reservedNodeIdsByOtherClient(
            task,
            repositoryData,
            toBeStoredNewNodes.map(ch => ch.node.id)
        )
        if (reservedIds !== undefined && reservedIds.length > 0) {
            return {
                status: HttpClientErrors.PreconditionFailed,
                query: "",
                queryResult: {
                    success: false,
                    messages: [
                        {
                            kind: "ReservedId",
                            message: `The following id's are reserved by other client(s): ${reservedIds
                                .map(id => `{ node id ${id.node_id} by client ${id.client_id}`)
                                .join(", ")}.`
                        }
                    ]
                }
            }
        }
        queries += SQL_insertNodeArray(
            toBeStoredNewNodes.map(ch => (ch as NodeAdded).node),
            metaPointersTracker
        )
        // And run them on the database
        if (queries !== "") {
            queries = SQL_nextRepoVersion(repositoryData.clientId) + queries
            const [multiResult] = await task.multi(repositoryData, queries)
            return {
                status: HttpSuccessCodes.Ok,
                query: queries,
                queryResult: {
                    success: true,
                    messages: [
                        versionResultToResponse(multiResult),
                        { kind: "query", message: dbLogger.isEnabledFor("debug") ? queries : "no debug log" }
                    ]
                }
            }
        } else {
            // Nothing to change, empty query
            const version = await this.DB_currentRepoVersion(task, repositoryData)
            return {
                status: HttpSuccessCodes.Ok,
                query: queries,
                queryResult: {
                    success: true,
                    messages: [
                        {
                            kind: "RepoVersion",
                            message: "RepositoryVersion at end of Transaction",
                            data: { version: `${version}` }
                        },
                        {
                            kind: "RepoVersion",
                            message: "Nothing to store",
                            data: { version: `${version}` }
                        },
                        { kind: "query", message: dbLogger.isEnabledFor("debug") ? queries : "no debug level" }
                    ]
                }
            }
        }
    }

    private dbCommandsForImplicitlyRemovedChildNodes(
        dbCommands: DbChanges,
        implicitlyRemovedChildNodes: LionWebJsonChunk,
        parentsOfImplicitlyRemovedChildNodes: LionWebJsonChunk
    ) {
        implicitlyRemovedChildNodes.nodes.forEach(child => {
            const previousParentNode = parentsOfImplicitlyRemovedChildNodes.nodes.find(p => (p.id = child.parent))
            const changedContainment = NodeUtils.findContainmentContainingChild(previousParentNode.containments, child.id)
            const index = changedContainment.children.indexOf(child.id)
            const newChildren = [...changedContainment.children]
            newChildren.splice(index, 1)
            // Make a deep copy of the old parent node so we can change the children in there and create a Change object,
            const parentCopy: LionWebJsonNode = structuredClone(previousParentNode)
            // replace the containment with the removed child with a copy that does not have the child
            const changedContainmentCopy = NodeUtils.findContainmentContainingChild(parentCopy.containments, child.id)
            const indexCopy = changedContainmentCopy.children.indexOf(child.id)
            changedContainmentCopy.children.splice(indexCopy, 1)
            const change = new ChildRemoved(
                new JsonContext(null, ["implictlyRemovedChild"]),
                parentCopy,
                changedContainmentCopy.containment,
                changedContainmentCopy,
                child.id
            )
            dbCommands.addChanges([change])
        })
    }

    /**
     * Creates a set of ParentChanged diff objects, which are converted by DatabaseChanges to SQL.
     * @param addedAndNotParentChangedChildren
     * @param databaseChunkWrapper
     * @private
     */
    private makeQueriesForImplicitParentChanged(
        dbCommands: DbChanges,
        addedAndNotParentChangedChildren: ChildAdded[],
        databaseChunkWrapper: LionWebJsonChunkWrapper
    ) {
        const changes: ParentChanged[] = []
        addedAndNotParentChangedChildren.forEach(added => {
            const node = databaseChunkWrapper.getNode(added.childId)
            if (node !== undefined) {
                dbLogger.info("FOUND CHILD PARENT {node}", {node})
                changes.push(new ParentChanged(new JsonContext(null, ["implicitParentChange"]), node, node.parent, added.parentNode.id))
            } else {
                dbLogger.info("MISSING CHILD " + added.childId)
                throw new Error("MISSING CHILD " + added.childId + " in makeQueriesForImplicitParentChanged(...)")
            }
        })
        dbCommands.addChanges(changes)
    }

    /**
     * 
     * @param task
     * @param repositoryData
     * @param idList
     */
    // TODO Does three separate queries to Postgress, should be combined into one for performance
    async deletePartitions(
        task: LionWebTask,
        repositoryData: RepositoryData,
        idList: string[]
    ): Promise<QueryReturnType<DeletePartitionsResponse>> {
        dbLogger.info("LionWebQueries.deletePartitions: " + idList)
        // TODO combine in one query
        const partitions = await DB_retrieveFullNodesFromIdList(task, repositoryData, idList)
        // Validate that the nodes are partitions
        partitions.forEach(part => {
            if (part.parent !== null) {
                return {
                    status: HttpClientErrors.PreconditionFailed,
                    query: "",
                    result: `Node with id "${part.id}" is not a partition, it has parent with id "${part.parent}"`
                }
            }
        })
        // Remove the partition nodes and all children/annotations
        const removedNodes = (await DB_retrieveNodeTree(task, repositoryData, idList, UNLIMITED_DEPTH)).map(n => n.id)
        let query = SQL_nextRepoVersion(repositoryData.clientId)
        query += SQL_deleteFullNodes(removedNodes)
        dbLogger.debug("DELETE PARTITIONS QUERY: " + query)
        const [versionResult] = await task.multi(repositoryData, query)
        return {
            status: HttpSuccessCodes.Ok,
            query: query,
            queryResult: {
                success: true,
                messages: [versionResultToResponse(versionResult)]
            }
        }
    }

    /**
     * Recursively get all directly contained child ids in _nodes_, including annotation children.
     * @param nodes
     * @private
     */
    private getContainedIds(nodes: LionWebJsonNode[]) {
        return nodes
            .flatMap(node =>
                node.containments.flatMap(c => {
                    return c.children
                })
            )
            .concat(nodes.flatMap(node => node.annotations))
    }
}

export function printMap(map: Map<string, string>): string {
    let result = ""
    for (const entry of map.entries()) {
        result += `[${entry[0]} => ${entry[1]}]`
    }
    return result
}
