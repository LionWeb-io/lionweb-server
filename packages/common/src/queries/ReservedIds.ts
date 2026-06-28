import { LionWebId } from "@lionweb/json"
import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { TableHelpers } from "../main.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"
import { NODES_TABLE, RESERVED_IDS_TABLE } from "../database/TableNames.js"
import { ReservedIdRecord } from "../database/TableTypes.js"

/**
 * Retrieve all reserved `id`s from `nodeIdList` which are not reserved by `repositoryData.clientId`
 * @param repositoryData
 * @param nodeIdList
 */
export function SQL_retrieveReservedNodesFromIdList(repositoryData: RepositoryData, nodeIdList: string[]): string {
    const sqlArray = sqlArrayFromNodeIdArray(nodeIdList)
    // language=SQL
    return `-- Retrieve node tree
            SELECT node_id, client_id
            FROM ${RESERVED_IDS_TABLE}
            WHERE node_id IN ${sqlArray}  AND client_id != '${repositoryData.clientId}'   
    `
}

/**
 * Return the subset of _nodeIdList_ that are currently in use in the repository.
 * @param nodeIdList The list of node is's to be checked.
 */
export function SQL_retrieveNodeIdsInUse(nodeIdList: string[]): string {
    // This works ok as along as you don't mix old (deleted) nodes with newer node,
    // because it allows node id's to be reused.
    const sqlArray = sqlArrayFromNodeIdArray(nodeIdList)
    return `-- Retrieve node tree
            SELECT id
            FROM ${NODES_TABLE}
            WHERE id IN ${sqlArray}   
    `
}

/**
 * Insert all ids in `nodeIdList` as being reserved by the client in `repositoryData`.
 * @param repositoryData
 * @param nodeIdList
 */
export function SQL_insertReservedNodeIds(repositoryData: RepositoryData, nodeIdList: string[]): string {
    const insertReservation: ReservedIdRecord[] = nodeIdList.map(id => ({
        node_id: id,
        client_id: repositoryData.clientId
    }))
    if (insertReservation.length !== 0) {
        return TableHelpers.pgp.helpers.insert(insertReservation, TableHelpers.RESERVED_IDS_COLUMN_SET) + ";\n"
    }

    return ""
}

export async function DB_nodeIdsInUse(task: LionWebTask, repositoryData: RepositoryData, nodeIds: string[]): Promise<LionWebId[]> {
    if (nodeIds.length > 0) {
        const query = SQL_retrieveNodeIdsInUse(nodeIds)
        const result = (await task.query(repositoryData, query)) as { id: string }[]
        return result.map(obj => obj.id)
    } else {
        return []
    }
}

export async function DB_reservedNodeIdsByOtherClient(
    task: LionWebTask,
    repositoryData: RepositoryData,
    addedNodes: string[]
): Promise<ReservedIdRecord[]> {
    if (addedNodes.length > 0) {
        const query = SQL_retrieveReservedNodesFromIdList(repositoryData, addedNodes)
        const result = (await task.query(repositoryData, query)) as ReservedIdRecord[]
        return result
    } else {
        return []
    }
}

