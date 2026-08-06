import { LionwebResponse } from "@lionweb/server-shared"
import { bulkLogger } from "@lionweb/server-logging"
import { Response } from "express"
import { JsonStreamStringify } from "json-stream-stringify"

/**
 * Indicates the configuration of an existing repository.
 */
export interface RepositoryConfiguration {
    name: string
    lionweb_version: string
    history: boolean
}

export const EMPTY_SUCCES_RESPONSE: LionwebResponse = {
    success: true,
    messages: []
}

export const EMPTY_FAIL_RESPONSE: LionwebResponse = {
    success: false,
    messages: []
}

export type QueryReturnType<T> = {
    status: number
    query: string
    queryResult: T
}

export function lionwebResponse<T extends LionwebResponse>(response: Response, status: number, body: T): void {
    response.status(status)
    bulkLogger.info(`<< response: status: ${status} body: {body}`, {body})
    new JsonStreamStringify(body).pipe(response)
}
