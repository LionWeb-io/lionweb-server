import { TableHelpers } from "../main.js"
import { sqlArrayFromNodeIdArray } from "./index.js"
import { RepositoryData } from "../database/DbConnection.js"
import { LionWebTask } from "../database/LionWebTask.js"
import { NODES_TABLE, RESERVED_IDS_TABLE } from "../database/TableNames.js"
import { ReservedIdRecord } from "../database/TableTypes.js"

/**
 * Retrieve all reserved `id`s from `nodeIdList` which are not reserved by `repositoryData.clientId`
 * @param repositoryData
 * @param nodeIdList
 */
function retrieveReservedNodesFromIdListSQL(repositoryData: RepositoryData, nodeIdList: string[]): string {
    const sqlArray = sqlArrayFromNodeIdArray(nodeIdList)
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
function retrieveNodeIdsInUseSQL(nodeIdList: string[]): string {
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
function insertReservedNodeIdsSQL(repositoryData: RepositoryData, nodeIdList: string[]): string {
    const insertReservation: ReservedIdRecord[] = nodeIdList.map(id => ({
        node_id: id,
        client_id: repositoryData.clientId
    }))
    if (insertReservation.length !== 0) {
        return TableHelpers.pgp.helpers.insert(insertReservation, TableHelpers.RESERVED_IDS_COLUMN_SET) + ";\n"
    }

    return ""
}

async function nodeIdsInUseDB(task: LionWebTask, repositoryData: RepositoryData, nodeIds: string[]): Promise<{ id: string }[]> {
    if (nodeIds.length > 0) {
        const query = retrieveNodeIdsInUseSQL(nodeIds)
        const result = (await task.query(repositoryData, query)) as { id: string }[]
        return result
    } else {
        return []
    }
}

async function reservedNodeIdsByOtherClientDB(
    task: LionWebTask,
    repositoryData: RepositoryData,
    addedNodes: string[]
): Promise<ReservedIdRecord[]> {
    if (addedNodes.length > 0) {
        const query = retrieveReservedNodesFromIdListSQL(repositoryData, addedNodes)
        const result = (await task.query(repositoryData, query)) as ReservedIdRecord[]
        return result
    } else {
        return []
    }
}

export const RESERVED_IDS_SQL = {
    insertReservedNodeIdsSQL,
    retrieveReservedNodesFromIdListSQL,
    retrieveNodeIdsInUseSQL,
}

export const RESERVED_IDS_DB = {
    reservedNodeIdsByOtherClientDB,
    nodeIdsInUseDB
}

// export async function makeNodeIdsReservation(
//     task: LionWebTask,
//     repositoryData: RepositoryData,
//     idsAdded: string[]
// ): Promise<QueryReturnType<LionwebResponse>> {
//     if (idsAdded.length > 0) {
//     const query = insertReservedNodeIdsSQL(repositoryData, idsAdded)
//     await task.query(repositoryData, query)
//     return {
//         status: HttpSuccessCodes.Ok,
//         query: query,
//         queryResult: {
//             success: true,
//             messages: []
//         }
//     }
// }
// }
