
import {
    CommandId,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    DeltaResponse,
    ErrorEvent,
    ProtocolMessage
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"

export type MessageFromClient = DeltaCommand | DeltaRequest

export type CommandOrRequest = {
    commandId: CommandId;
    messageKind: string;
    protocolMessages: ProtocolMessage[];

}
export type MessageFunction =  (participation: ParticipationInfo, msg: MessageFromClient, ctx: DeltaContext) => (DeltaEvent | DeltaResponse)

export type DeltaFunction = {
    messageKind: string;
    processor: MessageFunction;
}

export const errorEvent = (msg: DeltaCommand): ErrorEvent => ({
    message: `${msg.messageKind}: Not implemented yet`,
    sequenceNumber: 0,
    originCommands: [{ commandId: msg.commandId, participationId: "error" }],
    errorCode: "generic",
    messageKind: "ErrorEvent",
    protocolMessages: []
})

export const errorRequestEvent = (msg: DeltaRequest): ErrorEvent => (
    {
        message: `${msg.messageKind}: Not implemented yet`,
        sequenceNumber: 0,
        originCommands: [ { commandId: msg.queryId, participationId: "error"}],
        errorCode: "generic",
        messageKind: "ErrorEvent",
        protocolMessages: []
    }
)

