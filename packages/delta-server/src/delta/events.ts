import { ParticipationInfo } from "@lionweb/delta-server"
import {
    ErrorEvent,
    DeltaCommand
} from "@lionweb/server-delta-shared"

export const newErrorEvent = (errorCode: string, message: string, msg: DeltaCommand, participation: ParticipationInfo, data: any): ErrorEvent => {
    return {
        messageKind: "ErrorEvent",
        errorCode: errorCode,
        message: message,
        protocolMessages: [
            {
                kind: "Info",
                message: JSON.stringify(data),
                data: []
            }
        ],
        originCommands: [
            {
                commandId: msg.commandId,
                participationId: participation.participationId
            }
        ],
        sequenceNumber: participation.eventSequenceNumber
    }  
}

export const ALL = {
}

