import { LionWebJsonNode } from "@lionweb/json"
import { dbLogger, deltaLogger } from "../apiutil/index.js"
import { LionWebTask, NODES_TABLE, RepositoryData } from "../database/index.js"
import { SQL } from "./index.js"

export type NodeListAndVersion = {
    nodes: LionWebJsonNode[],
    version: number
}

/**
 * Get all partitions: this returns all nodes that have parent set to null or undefined
 */
export const retrievePartitionsFromDB = async (task: LionWebTask, repositoryData: RepositoryData): Promise<NodeListAndVersion> => {
    dbLogger.info("PartitionQueries.retrievePartitionsFromDB")
    let query = SQL.currentRepoVersionSQL()
    query += SQL.retrieveFullNodesFromQuerySQL(`SELECT * FROM ${NODES_TABLE} WHERE parent is null`)
    const [versionResult, result] = await task.multi(repositoryData, query)
    deltaLogger.info(`VERSION typeof ${typeof versionResult[0].currentrepoversion} JSON '${JSON.stringify(versionResult)}'`)
    return {
        nodes: result as LionWebJsonNode[],
        version: (versionResult[0].currentrepoversion) as number
    }
}
