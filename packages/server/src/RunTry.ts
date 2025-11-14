import { deltaProcessor } from "@lionweb/delta-server"
import { asError, deltaLogger, Job, requestQueue } from "@lionweb/server-common";
import { DeltaCommand, DeltaRequest } from "@lionweb/server-delta-shared";
import WebSocket from "ws";

let index = 0

/**
 * Catch-all wrapper function to handle exceptions for any api call.
 * And put the request function in the request queue.
 * @param func
 */
export async function runWithTryDelta(socket: WebSocket, delta: DeltaCommand | DeltaRequest): Promise<void> {
    deltaLogger.info(`Run with try ${delta.messageKind}`)
    const myIndex = index++
    const deltaFunction = async () => {
        try {
            await deltaProcessor.processDelta(socket, delta)
        } catch (e) {
            const error = asError(e)
            deltaLogger.error(`Exception ${myIndex} while serving delta for ${delta?.messageKind}: ${error.message}`)
            deltaLogger.error(error)
        }
    }
    console.log(`queue ${delta.messageKind}`)
    requestQueue.add(new Job("delta-" + myIndex, deltaFunction))
    
}
