import { LogLevel } from "@logtape/logtape"
import fs from "node:fs"
import { expressLogger, verbosity } from "./logging.js"

// Define the possible values of database creation both as a type, and as an array of strings and a type
const CreationValues = ["always", "never", "if-not-exists"] as const
export type CreationType = (typeof CreationValues)[number]

export function isCreationType(v: string): v is CreationType {
    const s: readonly string[] = CreationValues
    return s.includes(v)
}

const LionWebVersionValues = ["2023.1", "2024.1", "2026.1"] as const
type LionWebVersionType = (typeof LionWebVersionValues)[number]

function isLionWebVersion(v: string): v is LionWebVersionType {
    const s: readonly string[] = LionWebVersionValues
    return s.includes(v)
}

export type RepositoryConfig = {
    create: CreationType
    name?: string
    history?: boolean
    lionWebVersion?: LionWebVersionType
}

export type ServerConfigJson = {
    server: {
        serverPort?: number
        expectedToken?: string
        bodyLimit?: string
    }
    startup?: {
        createDatabase?: CreationType
        createRepositories?: RepositoryConfig[]
    }
    logging?: {
        request?: LogLevel
        trace?: LogLevel
        database?: LogLevel
        query?: LogLevel
        express?: LogLevel
        delta?: LogLevel
        bulk?: LogLevel
        message?: LogLevel
    }
    postgres: {
        database: {
            host?: string
            user?: string
            db?: string
            maintenanceDb?: string
            password?: string
            port?: number
        }
        certificates?: {
            rootcert?: string
            rootcertcontent?: string
        }
    }
}

/**
 * Class for accessing all configuration properties of the server.
 */
export class ServerConfig {
    // Default values
    private readonly PG_HOST = "127.0.0.1"
    private readonly PG_USER = "postgres"
    private readonly PG_DB = "lionweb"
    private readonly PG_MAINTENANCEDB = "postgres"
    private readonly PG_PASSWORD = "lionweb"
    private readonly SERVER_PORT = 3005
    private readonly CREATE_DATABASE_DEFAULT = "if-not-exists"
    private readonly BODY_LIMIT = "50mb"
    private readonly PG_PORT = 5432

    static instance: ServerConfig

    static getInstance(): ServerConfig {
        if (ServerConfig.instance === undefined) {
            ServerConfig.instance = new ServerConfig()
        }
        return ServerConfig.instance
    }

    config: ServerConfigJson

    private constructor() {
        this.readConfigFile()
    }

    /**
     * Reads the config file and assumes that the file contains JSON structured as ServerConfigJson
     */
    readConfigFile(): void {
        let configFile = "./server-config.json"
        const configFlagIndex = process.argv.indexOf("--config")
        if (configFlagIndex > -1) {
            const configParam = process.argv[configFlagIndex + 1]
            if (configParam !== undefined) {
                configFile = configParam
            } else {
                // This is not ideal, but because of how `npm run dev` works I could not think of another solution
                // that works conveniently both to run the server specifying the configuration path and not specifying
                // it
                console.warn(`--config <filename> is missing <filename>, using default path ${configFile})`)
            }
        }
        if( !fs.existsSync(configFile) ) {
            configFile = "/local/server-config.json"
        }
        if (fs.existsSync(configFile)) {
            console.log(`Reading configuration from file ${configFile}`)
            const stats = fs.statSync(configFile)
            if (stats.isFile()) {
                try {
                    this.config = JSON.parse(fs.readFileSync(configFile).toString()) as ServerConfigJson
                    console.log(`Config: ${JSON.stringify(this.config)}`)
                } catch (e) {
                    console.error(`Error parsing JSON file ${configFile}: ${(e as Error).message}`)
                    process.exit(1)
                }
            } else {
                expressLogger.error(`Config file ${configFile} is not a file`)
                process.exit(1)
            }
        } else {
            if (configFlagIndex > -1) {
                // --config option used, given config file should exist
                console.error(`Config file ${configFile} does not exist`)
                process.exit(1)
            } else {
                console.warn("No --config parameter found, no config file found ")
            }
        }
    }
    createDatabase(): CreationType {
        const result = this?.config?.startup?.createDatabase
        if (typeof result === "string") {
            if (isCreationType(result)) {
                return result
            }
        }
        return this.CREATE_DATABASE_DEFAULT
    }

    createRepositories(): RepositoryConfig[] {
        const result = this?.config?.startup?.createRepositories
        if (result !== undefined && result !== null && Array.isArray(result)) {
            return result
        } else {
            return []
        }
    }

    requestLog(): LogLevel {
        const result = this?.config?.logging?.request
        return verbosity(result, "error")
    }

    bulkLog(): LogLevel {
        const result = this?.config?.logging?.bulk
        return verbosity(result, "info")
    }

    traceLog(): LogLevel {
        const result = this?.config?.logging?.trace
        return verbosity(result, "warning")
    }

    databaseLog(): LogLevel {
        const result = this.config?.logging?.database
        return verbosity(result, "error")
    }

    queryLog(): LogLevel {
        const result = this.config?.logging?.query
        return verbosity(result, "error")
    }

    expressLog(): LogLevel {
        const result = this?.config?.logging?.express
        return verbosity(result, "info")
    }

    deltaLog(): LogLevel {
        const result = this.config?.logging?.delta
        return verbosity(result, "info")
    }
    messageLog(): LogLevel {
        const result = this.config?.logging?.message
        return verbosity(result, "error")
    }

    pgHost(): string {
        const PGHOST = process.env.PGHOST
        const result = this?.config?.postgres?.database?.host
        return PGHOST ?? result ?? this.PG_HOST
    }

    pgUser(): string {
        const PGUSER = process.env.PGUSER
        const result = this?.config?.postgres?.database?.user
        return PGUSER ?? result ?? this.PG_USER
    }

    pgDb(): string {
        const PGDB = process.env.PGDB
        const result = this?.config?.postgres?.database?.db
        return PGDB ?? result ?? this.PG_DB
    }

    pgMaintenanceDb(): string {
        const PGMAINTENANCE = process.env.PGMAINTENANCE
        const result = this?.config?.postgres?.database?.maintenanceDb
        return PGMAINTENANCE ?? result ?? this.PG_MAINTENANCEDB
    }

    pgPassword(): string {
        const PGPASSWORD = process.env.PGPASSWORD
        const result = this?.config?.postgres?.database?.password
        return PGPASSWORD ?? result ?? this.PG_PASSWORD
    }

    pgPort(): number {
        let PGPORT = Number.parseInt(process.env.PGPORT)
        if (Number.isNaN(PGPORT)) {
            PGPORT = undefined
        }
        const result = this.config?.postgres?.database?.port
        return PGPORT ?? result ?? this.PG_PORT
    }
    pgRootcert(): string {
        const PGROOTCERT = process.env.PGROOTCERT
        const result = this?.config?.postgres?.certificates?.rootcert
        return PGROOTCERT ?? result
    }

    pgRootcertcontents(): string {
        const PGROOTCERTCONTENTS = process.env.PGROOTCERTCONTENTS
        const result = this?.config?.postgres?.certificates?.rootcertcontent
        return PGROOTCERTCONTENTS ?? result
    }

    serverPort(): number {
        const result = this?.config?.server?.serverPort
        if (result !== undefined && result !== null && typeof result === "number") {
            return result
        }
        return this.SERVER_PORT
    }

    bodyLimit(): string {
        const result = this?.config?.server?.bodyLimit
        if (result !== undefined && result !== null && typeof result === "string") {
            return result
        }
        return this.BODY_LIMIT // default
    }

    expectedToken(): string {
        const result = this?.config?.server?.expectedToken
        if (result !== undefined && result !== null && typeof result === "string") {
            return result
        }
        return null
    }
}
