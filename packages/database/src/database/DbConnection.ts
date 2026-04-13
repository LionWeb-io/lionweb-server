import { dbLogger, LionWebVersionType, queryLogger, requestLogger, toJsonString, traceLogger } from "@lionweb/server-shared"
import pgPromise from "pg-promise"
import { IClient } from "pg-promise/typescript/pg-subset.js"
import { Pool } from "pg"
import { LionWebTask } from "./LionWebTask.js"

/**
 * Data determining the repository and user for which a command should be executed.
 */
export type RepositoryData = {
    clientId: string
    repository: RepositoryInfo
}

/**
 * Indicates the configuration of a repository that may have yet to be created.
 */
export type RepositoryInfo = {
    repository_name: string
    schema_name: string
    history: boolean
    lionweb_version: LionWebVersionType
    created?: string
}

/**
 * Adds a SET search_path in from of the query to make it work in the context of the schema of the repository requested.
 * Also checks whether the required schema exists by calling the PSQL `existsschema` function.
 * @param query             The query to adapt
 * @param repositoryData    The data of the repository on which the query should work
 * @returns                 The original query preceded by the set path and exits schema queries
 */
export function addRepositorySchema(query: string, repositoryData: RepositoryData) {
    if (!query.startsWith("SET search_path TO")) {
        query =
            `SET search_path TO '${repositoryData.repository.schema_name}', 'public';
                select public.existsschema('${repositoryData.repository.schema_name}'::text);\n` + query
    }
    return query
}

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
        console.log("DbConnection.tx start with mode " + toJsonString(this.transactionMode))
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
