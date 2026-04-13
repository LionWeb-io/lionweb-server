import { queryLogger, traceLogger } from "@lionweb/server-shared"
import pgPromise from "pg-promise"
import { addRepositorySchema, RepositoryData } from "./DbConnection.js"

/**
 * All database transactions will go through an instance of this class.
 * This enables logging, but also tweaking queries when needed.
 * Current tweak: add the repository schema for each query
 *
 * This is a wrapper for a pg-promise task.
 * @see pgPromise.ITask
 */
export class LionWebTask {
    task: pgPromise.ITask<object> & object

    /**
     * Create a LionWebTask wrapped around a pg-promise task
     * @param task The pg-promise task that is doing the actual work
     */
    constructor(task: pgPromise.ITask<object> & object) {
        this.task = task
    }

    /**
     * @see IBaseProtocol.query
     * @param repositoryData
     * @param query
     */
    async query(repositoryData: RepositoryData, query: string) {
        queryLogger.info(`LionWebTask.query ${query} for repository ${repositoryData.repository.repository_name}`)
        query = addRepositorySchema(query, repositoryData)
        const result = await this.task.query(query)
        queryLogger.info(`   LionWebTask.query result ${JSON.stringify(result)}`)
        return result
    }

    async queryWithoutRepository(query: string) {
        queryLogger.info(`LionWebTask.queryWithoutRepository ${query}`)
        return await this.task.query(query)
    }

    /**
     * @see IBaseProtocol.many
     * @param repositoryData
     * @param query
     */
    async many(repositoryData: RepositoryData, query: string) {
        queryLogger.info(`LionWebTask.many ${query} for repository ${repositoryData.repository.repository_name}`)
        query = addRepositorySchema(query, repositoryData)
        return await this.task.many(query)
    }

    /**
     * @see IBaseProtocol.manyOrNone
     * @param repositoryData
     * @param query
     */
    async manyOrNone(repositoryData: RepositoryData, query: string) {
        traceLogger.info("LionWebTask.manyOrNone")
        query = addRepositorySchema(query, repositoryData)
        queryLogger.info(`LionWebTask.manyOrNone ${query}`)
        return await this.task.manyOrNone(query)
    }

    /**
     * @see IBaseProtocol.multi
     * @param repositoryData
     * @param query
     */
    async multi(repositoryData: RepositoryData, query: string) {
        traceLogger.info("LionWebTask.multi")
        query = addRepositorySchema(query, repositoryData)
        queryLogger.info(`LionWebTask.multi ${query}`)
        const multiResult = await this.task.multi(query)
        // Remove first two elements since these are the result of the inserted search_path and schema existence check
        multiResult.shift()
        multiResult.shift()
        return multiResult
    }
}
