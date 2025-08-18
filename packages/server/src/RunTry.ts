import { asError, deltaLogger } from "@lionweb/server-common";
import { Job, requestQueue } from "@lionweb/server-common/dist/apiutil/RequestQueue.js";
import { CommandType, QueryRequestType } from "@lionweb/server-delta-shared";
import { request } from "express";
import WebSocket from "ws";
import { deltaProcessor } from "./DeltaProcessor.js";

let index = 0

/**
 * Catch-all wrapper function to handle exceptions for any api call.
 * And put the request function in the request queue.
 * @param func
 */
export async function runWithTryDelta(socket: WebSocket, delta: CommandType | QueryRequestType): Promise<void> {
    console.log(`Run with try ${delta.messageKind}`)
    const myIndex = index++
    const deltaFunction = async () => {
        try {
            await deltaProcessor.processDelta(socket, delta)
        } catch (e) {
            const error = asError(e)
            deltaLogger.error(`Exception ${myIndex} while serving delta for ${request.url}: ${error.message}`)
            deltaLogger.error(error)
        }
    }
    console.log(`queue ${delta.messageKind}`)
    requestQueue.add(new Job("delta-" + myIndex, deltaFunction))
    
}
