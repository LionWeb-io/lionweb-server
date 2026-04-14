import { dbLogger, ServerConfig, toJsonString } from "@lionweb/server-shared"
import pgPromise from "pg-promise"
import dotenv from "dotenv"
import pg from "pg"
import { CREATE_CONFIG, pgSSLConf, PostgresConfig } from "./database.js"

// Initialize and export the database connection with configuration from _env_

dotenv.config()

export const config: PostgresConfig = {
    database: ServerConfig.getInstance().pgDb(),
    host: ServerConfig.getInstance().pgHost(),
    port: ServerConfig.getInstance().pgPort(),
    user: ServerConfig.getInstance().pgUser(),
    password: ServerConfig.getInstance().pgPassword(),
    ssl: pgSSLConf
}

dbLogger.info("POSTGRES CONFIG: " + toJsonString(config, 2))

export const pgp = pgPromise()
// TODO
export type PgPromiseType = ReturnType<typeof pgp>

/**
 * Connection to a specific database, which needs to exist.
 */
export const postgresConnectionWithDatabase = pgp(config)
/**
 * Connection to postgres, without having a database.
 * Used for queries that create the actual database.
 */
export const postgresConnectionWithoutDatabase = pgp(CREATE_CONFIG)

export const postgresPool = new pg.Pool(config)
