// import { getFileSink } from "@logtape/file"
import {
    configure,
    getConsoleSink,
    getLogger,
    getLogLevels,
    LogLevel,
    LogRecord
} from "@logtape/logtape"
import { getPrettyFormatter } from "@logtape/pretty"
import { ServerConfig } from "./ServerConfig.js"

export function verbosity(level: LogLevel, defaultValue: LogLevel): LogLevel {
    if (level !== undefined && getLogLevels().includes(level)) {
        return level as LogLevel
    } else {
        return defaultValue
    }
}

function queryFilter(config: LogRecord): boolean {
    return true
}


await configure<"console", string>({
    filters: { queryFilter },
    sinks: {
        console: getConsoleSink({
            // formatter: prettyFormatter
            // formatter: jsonLinesFormatter,
            formatter: getPrettyFormatter({
                wordWrap: false,
                timestamp: "none",
                // Control colors
                colors: true,
                messageColor: "black",
                messageStyle: null,
                categoryWidth: 10,
                icons: {
                    info: "📘",
                    error: "🔥",
                },
                properties: false,
                inspectOptions: {
                    depth: 6, // Show 3 levels of nesting
                    colors: true, // Disable value syntax highlighting
                    compact: true, // Use compact object display
                }, 
            }),
            
        })
    },
    loggers: [
        { category: "query", lowestLevel: ServerConfig.getInstance().queryLog() as LogLevel, sinks: ["console"] },
        { category: "request", lowestLevel: ServerConfig.getInstance().requestLog() as LogLevel, sinks: ["console"] },
        { category: "delta", lowestLevel: ServerConfig.getInstance().deltaLog() as LogLevel, sinks: ["console"] },
        { category: "bulk", lowestLevel: ServerConfig.getInstance().bulkLog() as LogLevel, sinks: ["console"] },
        { category: "express", lowestLevel: ServerConfig.getInstance().expressLog() as LogLevel, sinks: ["console"] },
        { category: "trace", lowestLevel: ServerConfig.getInstance().traceLog() as LogLevel, sinks: ["console"] },
        { category: "database", lowestLevel: ServerConfig.getInstance().databaseLog() as LogLevel, sinks: ["console"], filters: ["queryFilter"] },
        { category: "message", lowestLevel: ServerConfig.getInstance().messageLog() as LogLevel, sinks: ["console"] }
    ]
})

export const bulkLogger = getLogger("bulk")
export const requestLogger = getLogger("request")
export const expressLogger = getLogger("express")
export const dbLogger = getLogger("database")
export const queryLogger = getLogger("query")
export const traceLogger = getLogger("trace")
export const deltaLogger = getLogger("delta")
export const messageLogger = getLogger("message")

