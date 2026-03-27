import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset.js"
import { DbConnection } from "@lionweb/server-common"
import { deltaProcessor } from "./DeltaProcessor.js"

/**
 * Object containing 'global' contextual objects for this API.
 * Avoids using glocal variables, as they easily get mixed up between the various API packages.
 */
export class DeltaContext {
    dbConnection: DbConnection
    pgp: pgPromise.IMain<object, pg.IClient>

    /**
     * Create the object and initialize all its members.
     * @param dbConnection  The database connection to be used by this API.
     * @param pgp           The pg-promise object to gain access to the pg helpers.
     */
    constructor(dbConnection: DbConnection, pgp: pgPromise.IMain<object, pg.IClient>) {
        this.dbConnection = dbConnection
        this.pgp = pgp
        deltaProcessor.context = this
    }
}
