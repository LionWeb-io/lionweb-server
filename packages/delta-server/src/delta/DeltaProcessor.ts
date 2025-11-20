import { deltaLogger, isInternalQueryError, retrieveParentsDB } from "@lionweb/server-common";
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import { ErrorEvent, DeltaRequest, isDeltaResponse, DeltaCommand, DeltaEvent } from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import WebSocket from 'ws';
import { DeltaContext } from "./DeltaContext.js"
import {
    childFunctions,
    DeltaFunction,
    MessageFromClient,
    MessageFunction,
    partitionFunctions,
    propertyFunctions
} from "./commands/index.js"
import { activeSockets } from "./DeltaClientAdmin.js"
import { isErrorEvent, newErrorEvent } from "./events.js"
import { ParticipationInfo, requestFunctions } from "./queries/index.js"

export function isQueryRequestType(object: MessageFromClient): object is DeltaRequest {
    const messageKind = object.messageKind
    return [
        "ReconnectRequest", "ListPartitionsRequest", "GetAvailableIdsRequest", "SignOffRequest",
        "SignOnRequest", "UnsubscribeFromPartitionContentsRequest", "SubscribeToPartitionContentsRequest", "SubscribeToChangingPartitionsRequest"
    ].includes(messageKind)
}

class DeltaProcessor {
    processingFunctions: Map<string, MessageFunction> = new Map<string, MessageFunction>() 
    deltaValidator = new DeltaValidator(new ValidationResult())
    context: DeltaContext | undefined

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

    /**
     * Validate the delta, and if it is a correct delta, call the processing function for the specific delta.
     * @param socket
     * @param delta
     */
    processDelta = async (socket: WebSocket, delta: MessageFromClient): Promise<void> => {
        // first try to get the `messageKind`
        deltaLogger.info(`processDelta messageKind ${delta?.messageKind}`)
        const messageKind = delta.messageKind
        if (typeof messageKind !== "string") {
            deltaLogger.error(`processDelta 1: messageKind should be a string but is a '${typeof messageKind}'`)
            return
        }
        //  Next, get the processing function for the `messageKind`
        const func = this.processingFunctions.get(messageKind)
        if (func === undefined) {
            deltaLogger.error(`processDelta 2: no processor function found for ${messageKind}`)
            const response: ErrorEvent = {
                errorCode: "MessageKindUnknown",
                messageKind: "ErrorEvent",
                message: `Cannot perform delta request: message of kind '${messageKind}' is unknown`,
                sequenceNumber: 0,
                originCommands: [{
                    participationId: activeSockets.get(socket)?.participationId ?? "<unknown-participation-id>",
                    commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>"
                }],
                protocolMessages: []
            }
            socket.send(JSON.stringify(response))
            return
        }
        // Now validate the all the properties of the full JSON message
        this.deltaValidator.validationResult.reset()
        this.deltaValidator.validate(delta, messageKind)
        if (this.deltaValidator.validationResult.hasErrors()) {
            deltaLogger.error(`Validation errors:`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                deltaLogger.error(issue.errorMsg())
            })
            const response: ErrorEvent = {
                errorCode: "MessageSyntaxError",
                messageKind: "ErrorEvent",
                message: "Validation errors",
                sequenceNumber: 0,
                originCommands: [{
                    participationId: "none",
                    commandId: "??" //msg.queryId
                }],
                protocolMessages: this.deltaValidator.validationResult.issues.map(issue => {
                    return {
                        kind: issue.issueType,
                        message: issue.errorMsg(),
                        data: []
                    }
                })
            }
            socket.send(JSON.stringify(response))
            return
        }
        // Check participation status
        const participation = activeSockets.get(socket)
        const errorEvent = this.validateParticipation(delta, participation)
        if (errorEvent !== undefined) {
            deltaLogger.error(`error event ${JSON.stringify(errorEvent)}`)
            socket.send(JSON.stringify(errorEvent))
            return
        }

        // Finally ok, process the delta and send the response
        try {
            const response = await func(participation!, delta, this.context!)
            // Errors and responses to requests only need to be sent to the client that sent the message
            if (response.messageKind === "ErrorEvent" || isDeltaResponse(response)) {
                socket.send(JSON.stringify(response))
            } else {
                // To whom needs this Event (yes, it's an Event now) need to be sent.
                // For most/all events, we need to know whether the others are subscribed to the partition wjhre changes took place
                // TODO: Add the changed partitions to the result of the processing function, so we know to whom to send.
                deltaLogger.info(`looking foir affected nodes in ${response}`)
                const affectedNodeData = response.protocolMessages.find(m => m.kind == "AffectedNode")
                const affectedNode = affectedNodeData?.data?.find(kv => kv.key === "node")
                if (affectedNode === undefined) {
                    deltaLogger.info("No affected node found, not sending delta's")
                } else {
                    const parentChain = await retrieveParentsDB(this.context!.dbConnection, participation!.repositoryData!, affectedNode.value)
                    if (parentChain === undefined) {
                        throw new Error("PARENTCHAIN UNDEFINED")
                    } else {
                        deltaLogger.info(`PARENT CHAIN IS ${parentChain.map(p => `${p.id} parent ${p.parent} | `)}`)
                    }
                    const affectedPartition = parentChain[parentChain.length-1]
                    if (affectedPartition !== undefined) {
                        for (const participationInfo of activeSockets.values()) {
                            if (participationInfo.subscribedPartitions.includes(affectedPartition.id)) {
                                response.sequenceNumber = participationInfo.eventSequenceNumber++
                                deltaLogger.info(`Subscribed Sending ${JSON.stringify(response)} to ${participationInfo.repositoryData!.clientId}`)
                                participationInfo.socket.send(JSON.stringify(response))
                            } else {
                                deltaLogger.info(`NOT Subscribed ${participationInfo.repositoryData!.clientId}`)

                            }
                        }
                    } else {
                        deltaLogger.info(`NO Subscribed no affected node`)
                    }
                }
            }
        } catch (e: unknown) {
            if (isErrorEvent(e)) {
                socket.send(JSON.stringify(e))
            } else if (isInternalQueryError(e)) {
                const errorEvent: ErrorEvent = newErrorEvent('query error' + e.name, e.message, delta, participation!, {
                    originCommands: [
                        {
                            commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>",
                            participationId: participation!.participationId
                        }
                    ],
                    protocolMessages: [ {
                        data: e.data,
                        kind: "Internal",
                        message:"Additional data"
                    }]
                })
                socket.send(JSON.stringify(errorEvent))
            } else if (e instanceof Error) {
                console.log(e.stack)
                const errorEvent: ErrorEvent = newErrorEvent("Exception", e.message, delta, participation!,
                    { originCommands: [
                            {
                                commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>",
                                participationId: participation!.participationId
                            }
                        ],
                        protocolMessages: [{
                            kind: "Extra",
                            message: "stacktrace",
                            data: [{
                                key: "TRACE",
                                value: e.stack ?? "NO TRACE"
                            }]
                        }]
                    })
                socket.send(JSON.stringify(errorEvent))
            }
        }
    }

    validateParticipation = (delta: MessageFromClient, participation: ParticipationInfo | undefined): ErrorEvent | undefined => {
        if (delta.messageKind === "SignOn") {
            return undefined
        }
        if (participation === undefined) {
            const response: ErrorEvent = {
                errorCode: "invalidParticipation",
                messageKind: "ErrorEvent",
                message: "Cannot perform delta request because there is no participation",
                sequenceNumber: 0,
                originCommands: [{
                    participationId: "<unknown-participation-id>",
                    commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>"
                }],
                protocolMessages: []
            }
            return response
        }
        if (participation.participationStatus !== "signedOn") {
            const response: ErrorEvent = {
                errorCode: "invalidParticipation",
                messageKind: "ErrorEvent",
                message: `Cannot perform ListPartitions request because participation status is ${participation.participationStatus}`,
                sequenceNumber: participation.eventSequenceNumber++,
                originCommands: [{
                    participationId: participation.participationId,
                    commandId: (delta as DeltaCommand).commandId ?? (delta as DeltaRequest).queryId ?? "<unknown-command-or-query>"
                }],
                protocolMessages: [ {
                    kind: "reason",
                    message: "Participation status incorrect, should be SignedOn",
                    data: [{
                        key: "participationStatus",
                        value: participation.participationStatus
                    }]
                }]
            }
            return response
        }
        return undefined
    }
}

// Status: connected + activeParticipation(s)
//         connected + noParticipation

export const deltaProcessor = new DeltaProcessor([childFunctions, partitionFunctions, propertyFunctions, requestFunctions])
