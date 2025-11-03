import {
    CommandId,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    ErrorEvent,
    ProtocolMessage
} from "@lionweb/server-delta-shared"
import WebSocket from "ws"

export type MessageFromClient = DeltaCommand | DeltaRequest

export type CommandOrRequest = {
    commandId: CommandId;
    messageKind: string;
    protocolMessages: ProtocolMessage[];

}
export type MessageFunction =  (socket: WebSocket, msg: MessageFromClient) => DeltaEvent

export type DeltaFunction = {
    messageKind: string;
    processor: MessageFunction;
}

export const errorEvent = (msg: DeltaCommand): ErrorEvent => (
    {
        message: `${msg.messageKind}: Not implemented yet`,
        sequenceNumber: 0,
        originCommands: [ { commandId: msg.commandId, participationId: "error"}],
        errorCode: "generic",
        messageKind: "ErrorEvent",
        protocolMessages: []
    }
)
