import { LionWebJsonChunk } from "@lionweb/json"
import { LionWebJsonChunkWrapper } from "@lionweb/json-utils"
import { CommandType } from "@lionweb/server-delta-shared"
import fs from "fs"

export function readModel(filename: string): LionWebJsonChunk | null {
    if (fs.existsSync(filename)) {
        const stats = fs.statSync(filename)
        if (stats.isFile()) {
            const chunk: LionWebJsonChunk = JSON.parse(fs.readFileSync(filename).toString())
            return chunk
        }
    }
    return null
}

export function readDelta(filename: string): CommandType | null {
    if (fs.existsSync(filename)) {
        const stats = fs.statSync(filename)
        if (stats.isFile()) {
            const cmd: CommandType = JSON.parse(fs.readFileSync(filename).toString())
            return cmd
        }
    }
    return null
}

export function printChunk(chunk: LionWebJsonChunk): void {
    const wrapper = new LionWebJsonChunkWrapper(chunk)
    console.log(wrapper.asString())
}
