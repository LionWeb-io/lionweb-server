import { ErrorEvent, DeltaCommand, DeltaRequest, ProtocolMessage } from "@lionweb/server-delta-shared"
import { ParticipationInfo } from "./queries/index.js"

export function isErrorEvent(object: unknown): object is ErrorEvent {
    return (object as ErrorEvent).messageKind === "ErrorEvent"
}

export const newErrorEvent = (
    errorCode: string,
    message: string,
    delta: DeltaCommand | DeltaRequest,
    participation: ParticipationInfo,
    data?: Partial<ErrorEvent>
): ErrorEvent => {
    return {
        messageKind: "ErrorEvent",
        errorCode: errorCode,
        message: message,
        protocolMessages: data?.protocolMessages ?? [],
        originCommands: [
            {
                commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>",
                participationId: participation.participationId
            }
        ],
        sequenceNumber: participation.eventSequenceNumber
    }
}

export function queryData(query: string, queryResult: unknown): ProtocolMessage[] {
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
