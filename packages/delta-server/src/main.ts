import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset.js"
import { DbConnection, requestLogger } from "@lionweb/server-common"
import { DeltaContext } from "./delta/index.js"

/**
 * Register all api methods with the _app_
 * @param app           The app to which the api is registered
 * @param dbConnection  The database connection to be used by this API
 * @param pgp           The pg-promise object to gain access to the pg helpers
 */
export function registerDeltaProcessor(dbConnection: DbConnection, pgp: pgPromise.IMain<object, pg.IClient>) {
    requestLogger.info("Registering Delta Server")
    // Create all objects
    new DeltaContext(dbConnection, pgp)
}
