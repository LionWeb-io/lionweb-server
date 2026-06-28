import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { LionWebId } from "@lionweb/server-delta-shared"
import { requestLogger } from "@lionweb/server-shared"
import { createId } from "../apiutil/index.js"
import { SQL_insertReservedNodeIds } from "./ReservedIds.js"
import { DB_nodeIdsInUse, DB_reservedNodeIdsByOtherClient } from "./ReservedIds.js"
/**
 * Return _count_ free id's for _clientId_ and reserve these ids for this client only.
 * @param clientId
 * @param count
 */
export const DB_getAvailableIds = async (task: LionWebTask, repositoryData: RepositoryData, count: number): Promise<LionWebId[]> => {
    requestLogger.info("getAvailableIds Count ids " + count + " for " + repositoryData.clientId)
    const result: string[] = []
    // Create a bunch of ids, they are probably all free
    let done = false
    while (!done) {
        for (let i = 0; i < count; i++) {
            const id = createId(repositoryData.clientId)
            result.push(id)
        }
        // Check for already used or reserved ids and remove them if needed
        const reservedByOtherClient = await DB_reservedNodeIdsByOtherClient(task, repositoryData, result)
        if (reservedByOtherClient.length > 0) {
            reservedByOtherClient.forEach(reservedId => {
                const index = result.indexOf(reservedId.node_id)
                result.splice(index, 1)
            })
        }
        // Remove ids that are already in use
        const usedIds = await DB_nodeIdsInUse(task, repositoryData, result)
        if (usedIds.length > 0) {
            usedIds.forEach(usedId => {
                const index = result.indexOf(usedId)
                result.splice(index, 1)
            })
        }
        if (result.length > 0) {
            done = true
        }
    }
    await makeNodeIdsReservation(task, repositoryData, result)

    return result
}

async function makeNodeIdsReservation(task: LionWebTask, repositoryData: RepositoryData, idsAdded: string[]): Promise<void> {
    if (idsAdded.length > 0) {
        const query = SQL_insertReservedNodeIds(repositoryData, idsAdded)
        await task.query(repositoryData, query)
    }
}
