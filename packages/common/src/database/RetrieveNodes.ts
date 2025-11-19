import { LionWebJsonNode } from "@lionweb/json"
import { DeltaCommand, DeltaRequest } from "@lionweb/server-delta-shared"
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
    const result = await con.multi(repoData, query)
    if (!is_NodesForQueryQuery_ResultType(result)) {
        throw InternalQueryError("Query returned incorrect type", [
            {
                key: "query",
                value: retrieveFullNodesFromQuerySQL(query)
            },
            {
                key: "queryResult",
                value: JSON.stringify(result)
            }
        ])
    }
    return result
}
