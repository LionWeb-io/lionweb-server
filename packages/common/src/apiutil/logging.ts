// import { pino, LevelWithSilent } from "pino"
import { ServerConfig } from "./ServerConfig.js"

// Need to copy from pino, as we cannot check a string value against a type in TS
export const PINO_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace", "silent"]
// The type for the tagged union property, derived from the above array
export type LevelWithSilent = (typeof PINO_LEVELS)[number];

export function verbosity(level: string, defaultValue: LevelWithSilent): LevelWithSilent {
    if (level !== undefined && PINO_LEVELS.includes(level)) {
        return level as LevelWithSilent
    } else {
        return defaultValue
    }
}

// const transport = pino.transport({
//     targets: [
        // {
        //     target: "pino/file",
        //     options: { destination: `./server-log.jsonl` }
        // },
        // {
        //     target: "pino/file" // default destination is console
        // },
        // {
        //     target: "pino-pretty",
        //     options: {
        //         colorize: true,
        //         ignore: "pid,hostname,level-label,type,query,chunk"
        //     }
        // }
    // ]
// })

export class PinoLogger {
    level: LevelWithSilent = "silent"
    name: string

    constructor(child: { type: string }) {
        this.name = child.type
    }

    info(msg: string | object, _msg2?: string) {
        console.log(`info ${JSON.stringify(msg)}`)
    }
    warn(msg: string) {
        console.log(`info ${msg}`)
    }
    debug(msg: string | object) {
        console.log(`info ${JSON.stringify(msg)}`)
    }
    trace(msg: string) {
        console.log(`info ${msg}`)
    }
    error(msg: string | Error) {
        console.error(`info ${msg}`)
    }
    isLevelEnabled(level: LevelWithSilent): boolean {
        return level === this.level
    }
}
export class MainLogger {
    level: LevelWithSilent = "silent"
    children: PinoLogger[] = []
    
    child(child: {type: string}): PinoLogger {
        const logger = new PinoLogger(child)
        this.children.push(logger)
        return logger
    }
}

function pino( _props: { level: LevelWithSilent, formatters: object, timestamp: unknown}): MainLogger {
    const result = new MainLogger()
    result.level = _props.level
    return result
}

const pinoLogger = pino(
    {
        level: "silent",
        formatters: {
            // level: (label: string) => {
            //     return { level: label.toUpperCase() }
            // },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // bindings: () => {
            //     return {}
            // }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        timestamp: undefined
    },
    // transport
)

export const bulkLogger = pinoLogger.child({ type: "bulk" })
export const requestLogger = pinoLogger.child({ type: "request" })
export const expressLogger = pinoLogger.child({ type: "express" })
export const dbLogger = pinoLogger.child({ type: "database" })
export const queryLogger = pinoLogger.child({ type: "query" })
export const traceLogger = pinoLogger.child({ type: "trace" })
export const deltaLogger = pinoLogger.child({ type: "delta" })
export const messageLogger = pinoLogger.child({ type: "message" })

bulkLogger.level = ServerConfig.getInstance().bulkLog()
requestLogger.level = ServerConfig.getInstance().requestLog()
traceLogger.level = ServerConfig.getInstance().traceLog()
expressLogger.level = ServerConfig.getInstance().expressLog()
dbLogger.level = ServerConfig.getInstance().databaseLog()
queryLogger.level = ServerConfig.getInstance().queryLog()
deltaLogger.level = ServerConfig.getInstance().deltaLog()
messageLogger.level = ServerConfig.getInstance().messageLog()
