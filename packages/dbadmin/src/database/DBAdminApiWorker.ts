import { cleanGlobalPointersMap, QueryReturnType, removeNewlinesBetween$$ } from "@lionweb/server-common"
import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { bulkLogger, requestLogger, ServerConfig } from "@lionweb/server-logging"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { DbAdminApiContext } from "../main.js"
import { CREATE_DATABASE_SQL, CREATE_GLOBALS_SQL, dropSchema, initSchemaWithHistory, initSchemaWithoutHistory } from "../tools/index.js"

export type ListRepositoriesResult = {
    schema_name: string
}[]

/**
 * Implementations of the additional non-LionWeb methods for DB Administration.
 */
export class DBAdminApiWorker {
    done: boolean = false

    constructor(private ctx: DbAdminApiContext) {}

    async queryWithoutRepository(query: string) {
        return this.ctx.dbConnection.queryWithoutRepository(query)
    }

    async deleteRepository(task: LionWebTask, repositoryData: RepositoryData): Promise<QueryReturnType<string>> {
        requestLogger.info(`deleteRepository`)
        const queryResult = await task.queryWithoutRepository(dropSchema(repositoryData.repository.schema_name))
        // requestLogger.info(`cleanMetaPointers`)
        // requestLogger.info(`${JSON.stringify(queryResult)}`)
        cleanGlobalPointersMap(repositoryData.repository.repository_name)
        // requestLogger.info(`return`)
        return {
            status: HttpSuccessCodes.Ok,
            query: dropSchema(repositoryData.repository.schema_name),
            queryResult: JSON.stringify(queryResult)
        }
    }

    async createRepository(task: LionWebTask, repositoryData: RepositoryData): Promise<QueryReturnType<string>> {
        requestLogger.info("createRepository worker")
        cleanGlobalPointersMap(repositoryData.repository.repository_name)
        const schemaSql = repositoryData.repository.history
            ? initSchemaWithHistory(repositoryData.repository.schema_name)
            : initSchemaWithoutHistory(repositoryData.repository.schema_name)
        const sql = removeNewlinesBetween$$(schemaSql)
        const queryResult = await task.queryWithoutRepository(sql)
        return {
            status: HttpSuccessCodes.Ok,
            query: "",
            queryResult: JSON.stringify(queryResult)
        }
    }

    async addRepositoryToTable(task: LionWebTask, repositoryData: RepositoryData): Promise<unknown> {
        return await task.queryWithoutRepository(
            `SELECT public.createRepositoryInfo('${repositoryData.repository.repository_name}'::text, '${repositoryData.repository.schema_name}'::text, '${repositoryData.repository.lionweb_version}'::text, '${repositoryData.repository.history}'::boolean);\n`
        )
    }

    async createDatabase(): Promise<QueryReturnType<string>> {
        bulkLogger.info(`createDatabase: ${CREATE_DATABASE_SQL}`)
        const sql = CREATE_DATABASE_SQL
        if (!this.done) {
            // When using PGlite the "postgres" database is used for lionweb, as PGlite only supports one database.
            // Therefore no need to create a lionweb database, it's there already.
            if (ServerConfig.getInstance().pgDb() !== "postgres") {
                bulkLogger.info(`Creating new database ${ServerConfig.getInstance().pgDb()} with password ${ServerConfig.getInstance().pgPassword()}`)
                // split the file into separate statements
                const statements = sql.split(/;\s*$/m)
                for (const statement of statements) {
                    if (statement.length > 3) {
                        // execute each of the statements
                        console.log(`create ${statement}`)
                        await this.ctx.postgresConnection.none(statement)
                    }
                }
            }
            // Add the global functions to the public schema
            bulkLogger.info(`globals start`)
            // split the file into separate statements
            const global_statements = CREATE_GLOBALS_SQL.split(/--%\s*$/m)
            for (const statement of global_statements) {
                if (statement.length > 3) {
                    console.log(`globals ${statement}`)
                    // execute each of the statements
                    // TODO execute inside lionweb instead of postgres database
                    await this.ctx.dbConnection.queryWithoutRepository(statement)
                }
            }
            bulkLogger.info(`globals done`)
            return {
                status: HttpSuccessCodes.Ok,
                query: sql,
                queryResult: "{}"
            }
        } else {
            return {
                status: HttpSuccessCodes.Ok,
                query: sql,
                queryResult: "{}"
            }
        }
    }

    async databaseExists(): Promise<QueryReturnType<boolean>> {
        const dbName = ServerConfig.getInstance().pgDb()
        const query = `select exists(SELECT datname FROM pg_catalog.pg_database WHERE '${dbName}' = datname);`
        const exists = await this.ctx.postgresConnection.one(query)
        return {
            status: HttpSuccessCodes.Ok,
            query: query,
            queryResult: exists.exists as boolean
        }
    }
}
