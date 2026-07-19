import { LionWebVersionType, toJsonString } from "@lionweb/server-shared"
import { dbLogger, queryLogger, requestLogger, traceLogger } from "@lionweb/server-logging"
import pgPromise from "pg-promise"
import { IClient } from "pg-promise/typescript/pg-subset.js"
import { Pool } from "pg"
import { LionWebTask } from "./LionWebTask.js"
import { addRepositorySchema, RepositoryData } from "./Repositories.js"

/**
 * All database queries will go through an instance of this class.
 * This enables logging, but also tweaking queries  when needed.
 * Current tweak: add the repository schema for each query
 */
export class DbConnection {
    postgresConnection: pgPromise.IDatabase<object, IClient>
    pgDatabaseConnection: pgPromise.IDatabase<object, IClient>
    private _pgp: pgPromise.IMain<object, IClient>
    pgPool: Pool
    transactionMode: object

    set pgp(value: pgPromise.IMain<object, IClient>) {
        this._pgp = value
    }

    get pgp() {
        return this._pgp
    }

    static instance: DbConnection
    static getInstance(): DbConnection {
        if (DbConnection.instance === undefined) {
            DbConnection.instance = new DbConnection()
        }
        return DbConnection.instance
    }
    private constructor() {}

    async queryWithoutRepository(query: string) {
        traceLogger.info("DbConnection.queryWithoutRepository")
        // requestLogger.info(`DbConnection.queryWithoutRepository ${query}`)
        return await this.pgDatabaseConnection.query(query)
    }

    /**
     * @see  pgPromise.IDatabase.none
     * @param repositoryData
     * @param query
     */
    async none(repositoryData: RepositoryData, query: string) {
        traceLogger.info("DbConnection.none")
        query = addRepositorySchema(query, repositoryData)
        queryLogger.info(`DbConnection.none ${query}`)
        return await this.pgDatabaseConnection.none(query)
    }

    /**
     * @see  pgPromise.IDatabase.query
     * @param repositoryData
     * @param query
     */
    async query(repositoryData: RepositoryData, query: string) {
        traceLogger.info("DbConnection.query")
        query = addRepositorySchema(query, repositoryData)
        dbLogger.debug({ query: query.split("\n", 500) })
        queryLogger.info(`DbConnection.query ${query}`)
        return await this.pgDatabaseConnection.query(query)
    }

    /**
     * @see  pgPromise.IDatabase.multi
     * @param repositoryData
     * @param query
     */
    async multi(repositoryData: RepositoryData, query: string) {
        traceLogger.info("DbConnection.multi")
        query = addRepositorySchema(query, repositoryData)
        queryLogger.info(`DbConnection.multi ${query}`)
        const multiResult = await this.pgDatabaseConnection.multi(query)
        // Remove first two elements since these are the result of the inserted search_path and schema existence check
        multiResult.shift()
        multiResult.shift()
        return multiResult
    }

    /**
     * @see  pgPromise.IDatabase.one
     * @param repositoryData
     * @param query
     */
    async one(repositoryData: RepositoryData, query: string) {
        traceLogger.info("DbConnection.one")
        query = addRepositorySchema(query, repositoryData)
        dbLogger.debug({ query: query.split("\n", 500) })
        queryLogger.info(`DbConnection.one ${query}`)
        return await this.pgDatabaseConnection.one(query)
    }

    /**
     * @see  pgPromise.IDatabase.one
     * @param repositoryData
     * @param query
     */
    async manyOrNone(repositoryData: RepositoryData, query: string) {
        traceLogger.info("DbConnection.one")
        query = addRepositorySchema(query, repositoryData)
        dbLogger.debug({ query: query.split("\n", 500) })
        queryLogger.info(`DbConnection.manyOrNone ${query}`)
        return await this.pgDatabaseConnection.manyOrNone(query)
    }

    /**
     * @see  IBaseProtocol.tx
     */
    async tx<T>(body: (tsk: LionWebTask) => Promise<T>): Promise<T> {
        dbLogger.debug("DbConnection.tx start with mode " + toJsonString(this.transactionMode))
        try {
            return await this.pgDatabaseConnection.tx({ mode: this.transactionMode as never }, async task => {
                const lionwebTask = new LionWebTask(task)
                traceLogger.info("DbConnection.tx return ")
                return await body(lionwebTask)
            })
        } catch (e) {
            dbLogger.error("DbConnection.tx TRANSACTION ERROR " + toJsonString(e))
            throw e
        }
    }
}
