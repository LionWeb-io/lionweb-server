import { LionWebJsonNode } from "@lionweb/json"
import { KeyValuePair } from "@lionweb/server-delta-shared"
import { asError, dbLogger } from "../apiutil/index.js"
import {
    InternalQueryError,
    SQL,
    sqlArrayFromNodeIdArray
} from "./index.js"
import { DbConnection, RepositoryData } from "../database/DbConnection.js"
import { LionWebTask } from "../database/LionWebTask.js"
import { NODES_TABLE } from "../database/TableNames.js"

/**
 * Query for retrieving all full nodes [id, classifier, parent]  in `nodeid`,
 * Recursively: including their children up until a depth of `depthLimit`.
 * @param nodeid        A list of all node id's that need to be retrieved
 * @param depthLimit    The depth of the subtree that needs to be retrived
 */
const retrieveFullNodesRecursiveSQL = (nodeid: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeid)
    // Now query the full nodes, based on the list
    return SQL.retrieveFullNodesFromQuerySQL(`--
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
const retrieveFullNodesRecursiveDB = async (
    con: DbConnection | LionWebTask,
    repoData: RepositoryData,
    nodeid: string[],
    depthLimit: number
): Promise<LionWebJsonNode[]> => {
    const query = retrieveFullNodesRecursiveSQL(nodeid, depthLimit)
    const result = await con.multi(repoData, query)
    if (!SQL.is_NodesForQueryQuery_ResultType(result[0])) {
        const data: KeyValuePair[] = [
            {
                key: "query",
                value: dbLogger.isLevelEnabled("debug") ? SQL.retrieveFullNodesFromQuerySQL(query) : "no debug logging"
            },
            {
                key: "queryResult",
                value: dbLogger.isLevelEnabled("debug") ? JSON.stringify(result) : "no debug logging"
            }
        ]
        throw InternalQueryError("Query returned incorrect type", data)
    }
    return result[0]
}

export type NodeWithParent = {
    id: string
    parent: string
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
const retrieveParentsSQL = (nodeid: string): string => {
    // const sqlArray = sqlArrayFromNodeIdArray(nodeid)
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
const retrieveParentsDB = async (db: DbConnection, repoData: RepositoryData, nodeid: string): Promise<NodeWithParent[]> => {
    const result = await db.multi(repoData, retrieveParentsSQL(nodeid))
    dbLogger.info(`Parents of '${nodeid} are '${JSON.stringify(result)}'`)
    if (Array.isArray(result[0]) && result[0].every(n => isNodeWithParent(n))) {
        return result[0] as NodeWithParent[]
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
const retrieveNodeTreeForIdListSQL = (nodeidlist: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeidlist)
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
async function retrieveNodeTreeDB(
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
        query = retrieveNodeTreeForIdListSQL(nodeIdList, depthLimit)
        return await task.query(repositoryData, query)
    } catch (e) {
        const error = asError(e)
        dbLogger.error(error)
        dbLogger.debug(query)
        throw error
    }
}

export const RETRIEVE_NODES_SQL = {
    retrieveParentsSQL,
    retrieveFullNodesRecursiveSQL,
    retrieveNodeTreeForIdListSQL
}

export const RETRIEVE_NODES_DB = {
    retrieveNodeTreeDB,
    retrieveParentsDB,
    retrieveFullNodesRecursiveDB
}
