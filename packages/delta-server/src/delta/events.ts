import {
    ErrorEvent,
    DeltaErrorCode,
    LionWebId,
    AdditionalInfo,
    ErrorResponse,
    MessageFromClient, isDeltaCommand
} from "@lionweb/server-delta-shared"
import { Participation } from "./participation/index.js"

export type ErrorDelta = ErrorEvent | ErrorResponse

export function isErrorEvent(object: unknown): object is ErrorEvent {
    return (object as ErrorEvent).messageKind === "ErrorEvent"
}
export function isErrorResponse(object: unknown): object is ErrorResponse {
    return (object as ErrorResponse).messageKind === "ErrorResponse"
}

export const newErrorDelta = (
    errorCode: DeltaErrorCode,
    message: string,
    delta: MessageFromClient,
    participation: Participation | undefined,
    data?: Partial<ErrorEvent>
): ErrorEvent | ErrorResponse => {
    if (isDeltaCommand(delta)) {
        return {
            messageKind: "ErrorEvent",
            errorCode: errorCode,
            message: message,
            additionalInfos: data?.additionalInfos ?? [],
            originCommands: [
                {
                    commandId: delta.commandId,
                    participationId: participation?.participationId ?? "<no-participation>"
                }
            ],
            sequenceNumber: 0
        } as ErrorEvent
    } else {
        // Response or AdminResponse
        return {
            messageKind: "ErrorResponse",
            errorCode: errorCode,
            message: message,
            additionalInfos: data?.additionalInfos ?? [],
            queryId: delta.queryId
        } as ErrorResponse
    }
}

export function affectedNodeMessage(nodeid: LionWebId): AdditionalInfo {
    return {
        kind: "AffectedNode",
        message: `Node ${nodeid} has been changed`,
        data: { node: nodeid}
    }
}
export function affectedPartitionMessage(nodeid: LionWebId): AdditionalInfo {
    return {
        kind: "AffectedPartition",
        message: `Partition ${nodeid} has a delta change`,
        data: { node: nodeid}
    }
}

export function queryData(query: string, queryResult: unknown): AdditionalInfo[] {
    return [
        {
            kind: "QueryInfo",
            message: "The following queryt was incorrect",
            data: {
                Query: query,
                QueryResult: JSON.stringify(queryResult)
            }
        }
    ]
}
