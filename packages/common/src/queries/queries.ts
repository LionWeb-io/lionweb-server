import { CONTAINMENTS_TABLE, LionWebTask, NODES_TABLE, PROPERTIES_TABLE, REFERENCES_TABLE, RepositoryData } from "../database/index.js"
import { InternalQueryError } from "./GuardFunctions.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"
import { is_NodesForQueryQuery_ResultType, NodesForQueryQuery_ResultType, retrieveFullNodesFromQuerySQL } from "./QueryNode.js"

// import pkg from "pg-promise"
// const { PreparedStatement } = pkg

// NOT USED
// export const retrieveNodeId = new PreparedStatement({ name: "retrieveNodeId", text: `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id = '/id/')`}) 
/**
 * Retrieve a node from the nodes tabel in the database whose id is `id`.
 * @param idList
 */
const retrieveSingleNodeSQL = (id: string): string => {
    const query = `SELECT * FROM ${NODES_TABLE} nt WHERE nt.id = '${id}'`
    return query
}

/**
 * select a node from the database whose id is `id`.
 * @param idList
 */
const retrieveSingleFullNodeSQL = (id: string): string => {
    const query = retrieveFullNodesFromQuerySQL(retrieveSingleNodeSQL(id))
    return query
}

/**
 * Retrieve a single full node from the database whose id is `id`.
 * @param idList
 */
const retrieveSingleFullNodeDB = async (task: LionWebTask, repo: RepositoryData, id: string): Promise<NodesForQueryQuery_ResultType> => {
    const query = retrieveFullNodesFromQuerySQL(retrieveSingleNodeSQL(id))
    const queryResult = await task.query(repo, query)
    if (is_NodesForQueryQuery_ResultType(queryResult)) {
        return queryResult
    } else {
        throw InternalQueryError(`retrieveSingleFullNodeDB() returns type incorrect, expected NodesForQueryQuery_ResultType`,
            [{
                key: "query",
                value: retrieveFullNodesFromQuerySQL(query)
            },
                {
                    key: "queryResult",
                    value: JSON.stringify(queryResult)
                }
            ])
    }

}

// export const retrieveNodeListSQL = (idList: string[]): string => {
//     const sqlList = sqlArrayFromNodeIdArray(idList)
//     const query = `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id IN ${sqlList};`
//     return query
// }

/**
 * Delete all nodes with id in `nodeIds`, including all of their features
 * @param nodeIds
 */ function deleteFullNodesSQL(nodeIds: string[]) {
    if (nodeIds.length === 0) {
        return ""
    }
    const sqlIds = sqlArrayFromNodeIdArray(nodeIds)
    return `-- Remove nodes 
                DELETE FROM ${NODES_TABLE} n
                WHERE n.id IN ${sqlIds};
                
                DELETE FROM ${PROPERTIES_TABLE} p
                WHERE p.node_id IN ${sqlIds};

                DELETE FROM ${CONTAINMENTS_TABLE} c
                WHERE c.node_id IN ${sqlIds};

                DELETE FROM ${REFERENCES_TABLE} r
                WHERE r.node_id IN ${sqlIds};
                `
}

export const QUERIES_SQL = {
    deleteFullNodesSQL,
    retrieveSingleFullNodeSQL,
    retrieveFullNodesFromQuerySQL
}

export const QUERIES_DB = {
     retrieveSingleFullNodeDB
}
