import {
    activeSockets,
    childFunctions,
    DeltaFunction,
    MessageFromClient,
    MessageFunction,
    ParticipationInfo,
    partitionFunctions,
    propertyFunctions2,
    requestFunctions
} from "@lionweb/delta-server"
import { deltaLogger } from "@lionweb/server-common";
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import {
    ErrorEvent, 
    DeltaRequest
} from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import WebSocket from 'ws';

export function isQueryRequestType(object: MessageFromClient): object is DeltaRequest {
    const messageKind = object.messageKind
    return [
        "ReconnectRequest", "ListPartitionsRequest", "ReconnectRequest", "GetAvailableIdsRequest", "SignOffRequest",
        "SignOnRequest", "UnsubscribeFromPartitionContentsRequest", "SubscribeToPartitionContentsRequest", "SubscribeToChangingPartitionsRequest"
    ].includes(messageKind)
}

class DeltaProcessor {
    processingFunctions: Map<string, MessageFunction> = new Map<string, MessageFunction>() 
    deltaValidator = new DeltaValidator(new ValidationResult())

    constructor(pfs: DeltaFunction[][]) {
        this.initialize(pfs)
    }

    initialize(pfs: DeltaFunction[][]) {
        pfs.forEach(pf => {
            pf.forEach( f => {
                this.processingFunctions.set(f.messageKind, f.processor)
            })
        })
    }

    processDelta = async (socket: WebSocket, delta: MessageFromClient): Promise<void> => {
        // first try to get the `messageKind`
        deltaLogger.info(`processDelta messageKind ${delta?.messageKind}`)
        const type = delta.messageKind
        if (typeof type !== "string") {
            deltaLogger.error(`1 processDelta: messageKind is not a string but a ${typeof type}`)
            return
        }
        //  Next, get the processing function for the `messageKind`
        const func = this.processingFunctions.get(type)
        if (func === undefined) {
            deltaLogger.error(`2 processDelta: no processor found for ${type}`)
            const response: ErrorEvent = {
                errorCode: "invalidParticipation",
                messageKind: "ErrorEvent",
                message: "Cannot perform delta request because there is no participation",
                sequenceNumber: 0,
                originCommands: [{
                    participationId: "none",
                    commandId: "??" //msg.queryId
                }],
                protocolMessages: []
            }
            socket.send(JSON.stringify(response))
            return
        }
        // Now validate the full JSON message
        this.deltaValidator.validationResult.reset()
        this.deltaValidator.validate(delta, type)
        if (this.deltaValidator.validationResult.hasErrors()) {
            deltaLogger.error(`Validation errors:`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                deltaLogger.error(issue.errorMsg())
            })
            const response: ErrorEvent = {
                errorCode: "generic",
                messageKind: "ErrorEvent",
                message: "Validation errors",
                sequenceNumber: 0,
                originCommands: [{
                    participationId: "none",
                    commandId: "??" //msg.queryId
                }],
                protocolMessages: []
            }
            socket.send(JSON.stringify(response))
            return
        }
        // Check participation status
        const participationInfo = activeSockets.get(socket)
        const errorEvent = this.validatePinfo(delta, participationInfo)
        if (errorEvent !== undefined) {
            deltaLogger.error(`error event ${JSON.stringify(errorEvent)}`)
            socket.send(JSON.stringify(errorEvent))
            return
        }

        // Finally ok, process the delta and send the response
        const response = func(socket, delta)
        for (const pInfo of activeSockets.values()) {
            response.sequenceNumber = pInfo.eventSequenceNumber++
            deltaLogger.info(`Sending ${JSON.stringify(response)} to ${pInfo.clientId}`)
            pInfo.socket.send(JSON.stringify(response))
        }

    }

    validatePinfo = (msg: MessageFromClient, participationInfo: ParticipationInfo | undefined): ErrorEvent | undefined => {
        if (msg.messageKind === "SignOn") {
            return undefined
        }
        if (participationInfo === undefined) {
            const response: ErrorEvent = {
                errorCode: "invalidParticipation",
                messageKind: "ErrorEvent",
                message: "Cannot perform delta request because there is no participation",
                sequenceNumber: 0,
                originCommands: [{
                    participationId: "none",
                    commandId: "??", //msg.queryId
                }],
                protocolMessages: []
            }
            return response
        }
        if (participationInfo.participationStatus !== "signedOn") {
            const response: ErrorEvent = {
                errorCode: "invalidParticipation",
                messageKind: "ErrorEvent",
                message: `Cannot perform ListPartitions request because participation status is ${participationInfo.participationStatus}`,
                sequenceNumber: participationInfo.eventSequenceNumber++,
                originCommands: [{
                    participationId: participationInfo.participationId,
                    commandId: "??" // msg.queryId
                }],
                protocolMessages: [ {
                    kind: "reason",
                    message: "Participation status incorrect",
                    data: [{
                        key: "participationStatus",
                        value: participationInfo.participationStatus
                    }
                    ]
                }]
            }
            return response
        }
        return undefined
    }
}

// Status: connected + activeParticipation(s)
//         connected + noParticipation

export const deltaProcessor = new DeltaProcessor([childFunctions, partitionFunctions, propertyFunctions2, requestFunctions])
