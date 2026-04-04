/**
 * Our own implementation replacing Pino Logger, as the Pino Logger does not work in docker.
 */

// Need to copy from pino, as we cannot check a string value against a type in TS
export const PINO_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace", "silent"]
// The type for the tagged union property, derived from the above array
export type LevelWithSilent = (typeof PINO_LEVELS)[number];


export class PinoLogger {
    level: LevelWithSilent = "silent"
    name: string

    constructor(child: { type: string }) {
        this.name = child.type
    }

    info(msg: string | object, _msg2?: string) {
        if (!this.isEnabled("info")) {
            return
        }
        console.log(`info ${JSON.stringify(msg)}`)
    }
    warn(msg: string) {
        if (!this.isEnabled("warn")) {
            return
        }
        console.log(`info ${msg}`)
    }
    debug(msg: string | object) {
        if (!this.isEnabled("debug")) {
            return
        }
        console.log(`info ${JSON.stringify(msg)}`)
    }
    trace(msg: string) {
        if (!this.isEnabled("trace")) {
            return
        }
        console.log(`trace ${msg}`)
    }
    error(msg: string | Error) {
        if (!this.isEnabled("error")) { return }
        console.error(`info ${msg}`)
    }
    isLevelEnabled(level: LevelWithSilent): boolean {
        return level === this.level
    }
    
    levelVal: Map<LevelWithSilent, number> = new Map<LevelWithSilent, number>([
        ["trace", 10],
        ["debug", 20],
        ["info", 30],
        ["warn", 40],
        ["error", 50],
        ["fatal", 60],
        ["silent", 600],
    ])
    
    isEnabled(level: LevelWithSilent): boolean {
        return this.levelVal.get(level) >= this.levelVal.get(this.level)
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

