import {
    ErrorEvent,
    DeltaErrorCode,
    LionWebId,
    AdditionalInfo,
    ErrorResponse,
    MessageFromClient, isDeltaCommand
} from "@lionweb/server-delta-shared"
import { ParticipationInfo } from "./queries/index.js"

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
    participation: ParticipationInfo | undefined,
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
        data: [ { key: "node", value: nodeid}]
    }
}
export function affectedPartitionMessage(nodeid: LionWebId): AdditionalInfo {
    return {
        kind: "AffectedPartition",
        message: `Partition ${nodeid} has a delta change`,
        data: [ { key: "node", value: nodeid}]
    }
}

export function queryData(query: string, queryResult: unknown): AdditionalInfo[] {
    return [
        {
            kind: "QueryInfo",
            message: "The following queryt was incorrect",
            data: [
                {
                    key: "Query",
                    value: query
                },
                {
                    key: "QueryResult",
                    value: JSON.stringify(queryResult)
                }
            ]
        }
    ]
}
