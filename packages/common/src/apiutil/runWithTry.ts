import { HttpServerErrors } from "@lionweb/server-shared"
import { requestLogger } from "@lionweb/server-logging"
import { isInternalQueryError } from "../queries/GuardFunctions.js"
import { asError } from "./functions.js"
import { lionwebResponse } from "./LionwebResponse.js"
import { Request, Response } from "express"
import { Job, requestQueue } from "./RequestQueue.js"

/**
 * Number of requests handled since start
 */
let index = 1

/**
 * Catch-all wrapper function to handle exceptions for any api call.
 * And put the request function in the request queue.
 * @param func
 */
export function runWithTry(func: (request: Request, response: Response) => void): (request: Request, response: Response) => void {
    return async function (request: Request, response: Response): Promise<void> {
        const myIndex = index++
        const requestFunction = async () => {
            try {
                await func(request, response)
            } catch (e) {
                if (isInternalQueryError(e)) {
                    requestLogger.error(`Exception ${myIndex} while serving request for ${request.url}: ${e.message}`)
                    requestLogger.error({e})
                    lionwebResponse(response, HttpServerErrors.InternalServerError, {
                        success: false,
                        messages: [{ kind: e.name, message: `Exception while serving request for ${request.url}: ${JSON.stringify(e)}` }]
                    })
                } else {
                    const error = asError(e)
                    requestLogger.error(`Exception ${myIndex} while serving request for ${request.url}: {e}`, {e})
                    requestLogger.error(error)
                    lionwebResponse(response, HttpServerErrors.InternalServerError, {
                        success: false,
                        messages: [{ kind: error.name, message: `Exception while serving request for ${request.url}: ${JSON.stringify(e)}` }]
                    })
                }
            }
        }
        requestQueue.add(new Job("request-" + myIndex, requestFunction))
    }
}
