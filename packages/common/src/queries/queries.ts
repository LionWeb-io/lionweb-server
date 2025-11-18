import pkg from "pg-promise"
import { NODES_TABLE } from "../database/index.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"
import { retrieveFullNodesFromQuerySQL } from "./QueryNode.js"
const { PreparedStatement } = pkg

// NOT USED
export const retrieveNodeId = new PreparedStatement({ name: "retrieveNodeId", text: `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id = '/id/')`}) 
/**
 * Retrieve a node from the nodes tabel in the database whose id is `id`.
 * @param idList
 */
export const retrieveNodeSQL = (id: string): string => {
    const query = `SELECT * FROM ${NODES_TABLE} nt WHERE nt.id = '${id}'`
    return query
}

/**
 * select a node from the database whose id is `id`.
 * @param idList
 */
export const retrieveNodeWithPropertiesSQL = (id: string): string => {
    const query = retrieveFullNodesFromQuerySQL(retrieveNodeSQL(id))
    // const exists = await this.ctx.postgresConnection.one(query)
    return query
}

export const retrieveNodeListSQL = (idList: string[]): string => {
    const sqlList = sqlArrayFromNodeIdArray(idList)
    const query = `SELECT id FROM ${NODES_TABLE} WHERE ${NODES_TABLE}.id IN ${sqlList};`
    return query
}
