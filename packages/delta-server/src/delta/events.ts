import {
    ErrorEvent,
    DeltaCommand,
    DeltaRequest,
    ProtocolMessage,
    LionWebJsonNode,
    KeyValuePair,
    LionWebId
} from "@lionweb/server-delta-shared"
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

export function affectedNodeMessage(node: LionWebJsonNode): ProtocolMessage {
    return {
        kind: "AffectedNode",
        message: `Node ${node.id} has been changed`,
        data: [ { key: "node", value: node.id}]
    }
}
export function affectedPartitionMessage(nodeid: LionWebId): ProtocolMessage {
    return {
        kind: "AffectedPartition",
        message: `Partition ${nodeid} has a delta change`,
        data: [ { key: "node", value: nodeid}]
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
