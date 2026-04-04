import { LionWebJsonNode } from "@lionweb/json"
import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { dbLogger } from "@lionweb/server-shared"
import { NODES_TABLE } from "../database/index.js"
import { SQL } from "./index.js"

export type NodeListAndVersion = {
    nodes: LionWebJsonNode[],
    version: number
}

/**
 * Get all partitions: this returns all nodes that have parent set to null or undefined
 */
export const retrievePartitionNodes = async (task: LionWebTask, repositoryData: RepositoryData): Promise<NodeListAndVersion> => {
    dbLogger.info("PartitionQueries.retrievePartitionNodes")
    let query = SQL.currentRepoVersionSQL()
    query += SQL.retrieveFullNodesFromQuerySQL(`SELECT * FROM ${NODES_TABLE} WHERE parent is null`)
    const [versionResult, result] = await task.multi(repositoryData, query)
    dbLogger.info(`VERSION typeof ${typeof versionResult[0].currentrepoversion} JSON '${JSON.stringify(versionResult)}'`)
    return {
        nodes: result as LionWebJsonNode[],
        version: (versionResult[0].currentrepoversion) as number
    }
}
