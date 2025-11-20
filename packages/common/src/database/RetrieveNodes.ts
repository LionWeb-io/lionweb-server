import { LionWebJsonNode } from "@lionweb/json"
import { KeyValuePair } from "@lionweb/server-delta-shared"
import { deltaLogger } from "../apiutil/index.js"
import {
    InternalQueryError,
    is_NodesForQueryQuery_ResultType,
    retrieveFullNodesFromQuerySQL,
    sqlArrayFromNodeIdArray
} from "../queries/index.js"
import { DbConnection, RepositoryData } from "./DbConnection.js"
import { LionWebTask } from "./LionWebTask.js"
import { NODES_TABLE } from "./TableNames.js"

/**
 * Query for retrieving all nodes in `nodeid` including their children up until a depth of `depthLimit`.
 * @param nodeid        A list of all node id's that need to be retrieved
 * @param depthLimit    The depth of the subtree that needs to be retrived
 */
export const retrieveNodesSQL = (nodeid: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeid)
    return retrieveFullNodesFromQuerySQL(`--
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
export const retrieveNodesDB = async (
    con: DbConnection | LionWebTask,
    repoData: RepositoryData,
    nodeid: string[],
    depthLimit: number
): Promise<LionWebJsonNode[]> => {
    const query = retrieveNodesSQL(nodeid, depthLimit)
    deltaLogger.info(`-========================= retrieve query ${query}`)
    const result = await con.multi(repoData, query)
    if (!is_NodesForQueryQuery_ResultType(result[0])) {
        const data: KeyValuePair[] = [
            {
                key: "query",
                value: retrieveFullNodesFromQuerySQL(query)
            },
            {
                key: "queryResult",
                value: JSON.stringify(result)
            }
        ]
        deltaLogger.info(`==========================================  Query returns incorrect type for ${nodeid}`)
        deltaLogger.info(`${JSON.stringify(query, null, 2)}`)
        deltaLogger.info(`==========================================  Query returns incorrect result`)
        deltaLogger.info(`Query returns incorrect type: ${JSON.stringify(result, null, 2)}`)
        deltaLogger.info(`=======================================================================`)

        throw InternalQueryError("Query returned incorrect type", data)
    }
    return result[0]
}

/**
 * Query to return the parent chain from node with id is `nodeid` untile its partition.
 * @param nodeid
 */
export const retrieveParentsSQL = (nodeid: string): string => {
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

export type NodeWithParent = {
    id: string
    parent: string
}

function isNodeWithParent(o: unknown): o is NodeWithParent {
    return (o as NodeWithParent).id !== undefined &&
        (o as NodeWithParent).parent !== undefined
    
}
/**
 * Return the parent chain from node with id is `nodeid` untile its partition.
 * @param nodeid
 */
export const retrieveParentsDB = async (db: DbConnection, repoData: RepositoryData, nodeid: string): Promise<NodeWithParent[]> => {
    const result = await db.multi(repoData, retrieveParentsSQL(nodeid))
    deltaLogger.info(`Parents of '${nodeid} are '${JSON.stringify(result)}'`)
    if (Array.isArray(result[0]) && result[0].every(n => isNodeWithParent(n))) {
        return result[0] as NodeWithParent[]
    }  else {
        return []
    } 
}
