import { LionWebJsonNode } from "@lionweb/json"
import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { KeyValuePair } from "@lionweb/server-delta-shared"
import { dbLogger } from "@lionweb/server-shared"
import { asError } from "../apiutil/functions.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"
import { InternalQueryError } from "./GuardFunctions.js"
import { is_NodesForQueryQuery_ResultType, SQL_retrieveFullNodesFromQuery } from "./QueryNode.js"
import { NODES_TABLE } from "../database/TableNames.js"

/**
 * Query for retrieving all full nodes [id, classifier, parent]  in `nodeid`,
 * Recursively: including their children up until a depth of `depthLimit`.
 * @param nodeid        A list of all node id's that need to be retrieved
 * @param depthLimit    The depth of the subtree that needs to be retrived
 */
export const SQL_retrieveFullNodesRecursive = (nodeid: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeid)
    // Now query the full nodes, based on the list
    // language=SQL
    return SQL_retrieveFullNodesFromQuery(`--
            WITH RECURSIVE tmp AS (
                SELECT id, parent, 0 as depth
                FROM ${NODES_TABLE}
                WHERE id IN ${sqlArray}    
                UNION
                    SELECT nn.id, nn.parent, tmp.depth + 1
                    FROM ${NODES_TABLE} as nn
                    INNER JOIN tmp ON tmp.id = nn.parent
                    WHERE tmp.depth < ${depthLimit}
            )
            SELECT * FROM ${NODES_TABLE} as nodesTable
            WHERE nodesTable.id IN (SELECT id FROM tmp)
    `)
}

/**
 *
 */
export const DB_retrieveFullNodesRecursive = async (
    task: LionWebTask,
    repoData: RepositoryData,
    nodeid: string[],
    depthLimit: number
): Promise<LionWebJsonNode[]> => {
    const query = SQL_retrieveFullNodesRecursive(nodeid, depthLimit)
    const result = await task.multi(repoData, query)
    if (!is_NodesForQueryQuery_ResultType(result[0])) {
        const data: KeyValuePair[] = [
            {
                key: "query",
                value: dbLogger.isEnabledFor("debug") ? SQL_retrieveFullNodesFromQuery(query) : "no debug logging"
            },
            {
                key: "queryResult",
                value: dbLogger.isEnabledFor("debug") ? JSON.stringify(result) : "no debug logging"
            }
        ]
        throw InternalQueryError("Query returned incorrect type", data)
    }
    return result[0]
}

export type NodeWithParent = {
    id: string
    parent: string | null
}

function isNodeWithParent(o: unknown): o is NodeWithParent {
    return (o as NodeWithParent).id !== undefined &&
        (o as NodeWithParent).parent !== undefined

}

/**
 * Query to return the parent chain from node with id is `nodeid` until its partition.
 * @returns Query resulting in Nodes-table rows: {id, classifier, parent}[] 
 * @param nodeid
 */
const SQL_retrieveParents = (nodeid: string): string => {
    // const sqlArray = sqlArrayFromNodeIdArray(nodeid)
    // language=SQL
    return `--
            WITH RECURSIVE tmp AS (
                SELECT id, parent
                FROM ${NODES_TABLE}
                WHERE id = '${nodeid}'    
                UNION
                    SELECT nn.id, nn.parent
                    FROM ${NODES_TABLE} as nn
                    INNER JOIN tmp ON tmp.parent = nn.id
            )
            SELECT * FROM tmp
    `
}

/**
 * Return the parent chain from node with id is `nodeid` untile its partition.
 * @param nodeid
 * @returns Nodes-table rows: {id, classifier, parent}[] 
 */
export const DB_retrieveParents = async (task: LionWebTask, repoData: RepositoryData, nodeid: string): Promise<NodeWithParent[]> => {
    const result = await task.manyOrNone(repoData, SQL_retrieveParents(nodeid))
    if (Array.isArray(result) && result.every(n => isNodeWithParent(n))) {
        // deltaLogger.info(`found parent`)
        return result as NodeWithParent[]
    }  else {
        return []
    } 
}

export type NodeTreeResultType = {
    id: string
    parent: string
    depth: number
}

/**
 * Query that will recursively get all child (ids) of all nodes in _nodeIdList_
 * Note that annotations are also considered children for this method.
 * This works ok because we use the _parent_ column to find the children, not the containment or annotation.
 * @param nodeidlist
 * @param depthLimit
 */
const SQL_retrieveNodeTreeForIdList = (nodeidlist: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeidlist)
    // language=SQL
    return `-- Recursively retrieve node tree
            WITH RECURSIVE tmp AS (
                SELECT id, parent, 0 as depth
                FROM ${NODES_TABLE}
                WHERE id IN ${sqlArray}    
                UNION
                    SELECT nn.id, nn.parent, tmp.depth + 1
                    FROM ${NODES_TABLE} as nn
                    INNER JOIN tmp ON tmp.id = nn.parent
                    WHERE tmp.depth < ${depthLimit} -- AND nn.id NOT in ${"otherArray"}
            )
            SELECT * FROM tmp;
    `
}

/**
 * Get recursively the ids of all children/annotations of _nodeIdList_ with depth `depthLimit`
 * @param nodeIdList
 * @param depthLimit
 */
export async function DB_retrieveNodeTree(
    task: LionWebTask,
    repositoryData: RepositoryData,
    nodeIdList: string[],
    depthLimit: number
): Promise<NodeTreeResultType[]> {
    let query = ""
    try {
        // no need for a query if there are no nodes to be found
        if (nodeIdList.length === 0) {
            return []
        }
        query = SQL_retrieveNodeTreeForIdList(nodeIdList, depthLimit)
        return await task.query(repositoryData, query)
    } catch (e) {
        const error = asError(e)
        dbLogger.error(error)
        dbLogger.debug(query)
        throw error
    }
}

