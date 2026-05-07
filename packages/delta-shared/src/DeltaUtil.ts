
import {
    AdditionalInfo,
    DeltaAdminRequest,
    DeltaAdminResponse,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    DeltaResponse, ErrorEvent, ErrorResponse
} from "./types/index.js"

export type MessageFromClient = DeltaCommand | DeltaRequest | DeltaAdminRequest
export type MessageToClient = DeltaEvent | DeltaResponse | DeltaAdminResponse

export function findDistributableInfos(delta: MessageFromClient | MessageToClient): AdditionalInfo[] {
    return delta.additionalInfos.filter(info => info.distribute)
}

export type ErrorDelta = ErrorEvent | ErrorResponse

export function isErrorEvent(object: unknown): object is ErrorEvent {
    return (object as ErrorEvent).messageKind === "ErrorEvent"
}
export function isErrorResponse(object: unknown): object is ErrorResponse {
    return (object as ErrorResponse).messageKind === "ErrorResponse"
}
    
