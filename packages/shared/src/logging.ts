import { getFileSink } from "@logtape/file"
import {
    configure,
    getConsoleSink,
    getJsonLinesFormatter,
    getLogger,
    getLogLevels,
    LoggerConfig,
    LogLevel,
    LogRecord
} from "@logtape/logtape"
import { getPrettyFormatter, prettyFormatter } from "@logtape/pretty"
import { ServerConfig } from "./ServerConfig.js"

export function verbosity(level: LogLevel, defaultValue: LogLevel): LogLevel {
    if (level !== undefined && getLogLevels().includes(level)) {
        return level as LogLevel
    } else {
        return defaultValue
    }
}

function queryFilter(config: LogRecord): boolean {
    return config.message.includes("aa")
}

await configure<"console" | "file", string>({
    filters: { queryFilter },
    sinks: {
        file: getFileSink("./sink.jsonl", {
            formatter: getJsonLinesFormatter({
                categorySeparator: " > ",
                message: "rendered",
                properties: "flatten"
            })
        }),
        console: getConsoleSink({
            // formatter: prettyFormatter
            // formatter: jsonLinesFormatter,
            formatter: getPrettyFormatter({
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
                    depth: 3, // Show 3 levels of nesting
                    colors: true, // Disable value syntax highlighting
                    compact: true, // Use compact object display
                },
            }),
        })
    },
    loggers: [
        { category: "query", lowestLevel: ServerConfig.getInstance().queryLog() as LogLevel, sinks: ["console", "file"] },
        { category: "request", lowestLevel: ServerConfig.getInstance().requestLog() as LogLevel, sinks: ["console", "file"] },
        { category: "delta", lowestLevel: ServerConfig.getInstance().deltaLog() as LogLevel, sinks: ["console", "file"] },
        { category: "bulk", lowestLevel: ServerConfig.getInstance().bulkLog() as LogLevel, sinks: ["console", "file"] },
        { category: "express", lowestLevel: ServerConfig.getInstance().expressLog() as LogLevel, sinks: ["console", "file"] },
        { category: "trace", lowestLevel: ServerConfig.getInstance().traceLog() as LogLevel, sinks: ["console", "file"] },
        { category: "database", lowestLevel: ServerConfig.getInstance().databaseLog() as LogLevel, sinks: ["console", "file"], filters: ["queryFilter"] },
        { category: "message", lowestLevel: ServerConfig.getInstance().messageLog() as LogLevel, sinks: ["console", "file"] }
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

