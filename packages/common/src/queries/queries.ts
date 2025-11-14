import pkg from "pg-promise"
import { NODES_TABLE } from "../database/index.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"
import { nodesForQueryQuery } from "./QueryNode.js"
const { PreparedStatement } = pkg

// NOT USED
export const retrieveNodeId = new PreparedStatement({ name: "retrieveNodeId", text: `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id = '/id/')`}) 
/**
 * select a node from the database whose id is `id`.
 * @param idList
 */
export const retrieveNode = (id: string): string => {
    const query = `SELECT * FROM ${NODES_TABLE} nt WHERE nt.id = '${id}'`
    return query
}

/**
 * select a node from the database whose id is `id`.
 * @param idList
 */
export const retrieveNodeWithProperties = (id: string): string => {
    const query = nodesForQueryQuery(retrieveNode(id))
    // const exists = await this.ctx.postgresConnection.one(query)
    return query
}

export const retrieveNodeList = (idList: string[]): string => {
    const sqlList = sqlArrayFromNodeIdArray(idList)
    const query = `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id IN ${sqlList};`
    return query
}
