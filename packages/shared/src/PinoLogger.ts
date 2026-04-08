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

    private out(level: string, msg: string | object) {
        if (typeof msg === "string") {
            console.log(`${level} ${msg}`)
        } else {
            console.log(`${level} ${JSON.stringify(msg)}`)
        }
    }

    info(msg: string | object, _msg2?: string) {
        if (!this.isEnabled("info")) {
            return
        }
        this.out("info", msg)
    }
    warn(msg: string) {
        if (!this.isEnabled("warn")) {
            return
        }
        this.out("warn", msg)
    }
    debug(msg: string | object) {
        if (!this.isEnabled("debug")) {
            return
        }
        this.out("debug", msg)
    }
    trace(msg: string) {
        if (!this.isEnabled("trace")) {
            return
        }
        this.out("trace", msg)
    }
    error(msg: string | Error) {
        if (!this.isEnabled("error")) {
            return
        }
        this.out("error", msg)
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
        ["silent", 600]
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

