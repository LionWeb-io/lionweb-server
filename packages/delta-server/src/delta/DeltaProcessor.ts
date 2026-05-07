import { LionWebJsonChunkWrapper } from "@lionweb/json-utils"
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import { isInternalQueryError } from "@lionweb/server-common"
import {
    ErrorEvent,
    isDeltaResponse,
    isDeltaAdminResponse,
    isDeltaAdminRequest,
    isDeltaEvent,
    isDeltaCommand,
    isDeltaRequest,
    findDistributableInfos,
    MessageToClient,
    ErrorResponse,
    AddPartitionCommand,
    PartitionAddedEvent,
    ReconnectRequest,
    LionWebId,
    PartitionDeletedEvent,
    CompositeCommand,
    DeltaEvent,
    CompositeEvent,
    DeltaCommand
} from "@lionweb/server-delta-shared"
import { MessageFromClient } from "@lionweb/server-delta-shared"
import { deltaLogger, toJsonString } from "@lionweb/server-shared"
import { ValidationResult } from "@lionweb/validation"
import WebSocket from 'ws';
import { adminRequestFunctions } from "./adminrequests/AdminFunctions.js"
import { DeltaContext } from "./DeltaContext.js"
import {
    annotationFunctions,
    childFunctions,
    DeltaFunction, errorEvent,
    issuesToProtocolMessages,
    MessageFunction,
    miscFunctions,
    partitionFunctions,
    propertyFunctions,
    referenceFunctions
} from "./commands/index.js"
import { affectedPartitionMessage, isErrorEvent, isErrorResponse, newErrorDelta } from "./events.js"
import { requestFunctions } from "./queries/index.js"
import { Participation, PARTICIPATIONS } from "./participation/index.js"
import { CompositeEventBufferStack } from "./CompositeEventBuffer.js"

class DeltaProcessor {
    processingFunctions: Map<string, MessageFunction> = new Map<string, MessageFunction>()
    deltaValidator = new DeltaValidator(new ValidationResult())
    context: DeltaContext | undefined

    constructor(pfs: DeltaFunction[][]) {
        this.initialize(pfs)
    }

    initialize(pfs: DeltaFunction[][]) {
        pfs.forEach(pf => {
            pf.forEach(f => {
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
        deltaLogger.debug(`processDelta messageKind ${delta?.messageKind}`)
        const messageKind = delta.messageKind
        if (typeof messageKind !== "string") {
            deltaLogger.error(`processDelta 1: messageKind should be a string but is a '${typeof messageKind}'`)
            return
        }
        //  Next, get the processing function for the `messageKind`
        const participation = PARTICIPATIONS.getParticipation(socket)
        const func = this.processingFunctions.get(messageKind)
        if (func === undefined) {
            deltaLogger.error(`DeltaProcessor.processDelta: no processing function found for ${messageKind}`)
            const response = newErrorDelta(
                "messageKindUnknown",
                `Cannot perform delta request/command: message of kind '${messageKind}' is unknown`,
                delta,
                participation
            )
            this.sendDelta(socket, participation, delta, response)
            return
        }
        // Now validate the all the properties of the full JSON message
        this.deltaValidator.validationResult.reset()
        this.deltaValidator.validate(delta, messageKind)
        if (this.deltaValidator.validationResult.hasErrors()) {
            deltaLogger.error(`Validation errors for delta: ${toJsonString(delta)}`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                deltaLogger.error(issue.errorMsg())
            })
            const response = newErrorDelta("messageSyntaxIncorrect", "Validation errors", delta, participation, {
                additionalInfos: issuesToProtocolMessages(this.deltaValidator.validationResult.issues)
            })
            this.sendDelta(socket, participation, delta, response)
            return
        }
        // Check participation status
        const errorDelta = this.validateParticipation(delta, participation)
        if (errorDelta !== undefined) {
            deltaLogger.error(`error event/response ${toJsonString(errorDelta)}`)
            this.sendDelta(socket, participation, delta, errorDelta)
            return
        }

        // Finally ok, process the delta and send the response
        try {
            if (delta.messageKind === "CompositeCommand") {
                await this.CompositeCommandFunction(participation!, delta as CompositeCommand, this.context!, socket)
            } else {
                const response = await func(participation!, delta, this.context!, socket)
                // Errors and responses to requests only need to be sent to the client that sent the message
                if (response.messageKind === "ErrorEvent" || isDeltaResponse(response) || isDeltaAdminResponse(response)) {
                    deltaLogger.info(`Sending Error Event or Response: ${toJsonString(response)}`)
                    if (response.messageKind === "ReconnectResponse") {
                        // TODO Should be done inside processing function, but the socket is not known there
                        PARTICIPATIONS.reconnect(socket, PARTICIPATIONS.findOldParticipation((delta as ReconnectRequest).participationId)!)
                    }
                    this.sendDelta(socket, participation, delta, response)
                
                } else {
                    // To whom needs this Event (yes, it's an Event now) needs to be sent.
                    deltaLogger.info(`looking for affected partitions in ${response}`)
                    const affectedPartitionData = response.additionalInfos.find(m => m.kind == "AffectedPartition")
                    // TODO can be more than one affected partition
                    const affectedPartition = (affectedPartitionData?.data as {[key: string]: string})["node"]
                    // const affectedPartition = (affectedPartitionData?.data as any)?.["node"]
                    if (affectedPartition === undefined) {
                        deltaLogger.info("No affected partition found, not sending delta's")
                    } else {
                        // First check for new/deleted partitions, then for partition subscriptions
                        if (response.messageKind === "PartitionAdded") {
                            deltaLogger.info("DeltaProcessor.PartitionAdded")
                            this.sendPartitionAddedEvents(
                                socket,
                                delta as AddPartitionCommand,
                                response as PartitionAddedEvent,
                                affectedPartition
                            )
                        } else if (response.messageKind === "PartitionDeleted") {
                            this.sendPartitionDeletedEvents(delta, response as PartitionDeletedEvent)
                        } else {
                            this.sendToSubscribers(delta, response, affectedPartition)
                        }
                    }
                }
            }
        } catch (e: unknown) {
            if (isErrorEvent(e) || isErrorResponse(e)) {
                this.sendDelta(socket, participation, delta, e)
            } else if (isInternalQueryError(e)) {
                const errorDelta = newErrorDelta("queryError", e.message, delta, participation!, {
                    additionalInfos: [
                        {
                            data: e.data ?? {},
                            kind: e.name,
                            message: "Additional data"
                        }
                    ]
                })
                this.sendDelta(socket, participation, delta, errorDelta)
            } else if (e instanceof Error) {
                console.log(e.stack)
                const errorDelta = newErrorDelta("generic", e.message, delta, participation!, {
                    additionalInfos: [
                        {
                            kind: "Extra",
                            message: "stacktrace",
                            data: { TRACE: e.stack }
                        }
                    ]
                })
                this.sendDelta(socket, participation, delta, errorDelta)
            }
        }
    }

    eventBuffers: CompositeEventBufferStack = new CompositeEventBufferStack() 
    
     CompositeCommandFunction = async (
        participation: Participation,
        msg: CompositeCommand,
        _ctx: DeltaContext,
        socket?: WebSocket
    ): Promise<DeltaEvent> => {
        deltaLogger.info(`Called CompositeCommandFunction ${msg.parts.map(p => p.messageKind).join(", ")}`)
        this.eventBuffers.startComposite(participation, msg)
        for (const cmd of msg.parts) {
            deltaLogger.info(`   processing part ${cmd.messageKind}`)
            await this.processDelta(socket!, cmd)
            deltaLogger.info(`   finished processing part ${cmd.messageKind}`)
        }
        // NOW build the actual composite events
        const activeBuffer = this.eventBuffers.activeBuffer()
        this.eventBuffers.endComposite()
        for (const participationInfo of PARTICIPATIONS.allParticipations()) {
            deltaLogger.info("Composite for " + participationInfo.repositoryData?.clientId)
            const toSend = activeBuffer?.events.filter(evt => evt.participation === participationInfo)
            if (toSend !== undefined && toSend!.length > 0) {
                // buid composite event and send
                const event: CompositeEvent = {
                    messageKind: "CompositeEvent",
                    // TODO the sequence number now comes after the parts, should be before.
                    // Hars! as we do not even know that there will be a composite for each participation.
                    sequenceNumber: 0,
                    additionalInfos: [],
                    originCommands: [
                        {
                            commandId: msg.commandId,
                            participationId: participation.participationId
                        }
                    ],
                    parts: toSend.map(tos => tos.responseOrEvent)
                }
                this.sendDelta(participationInfo.socket, participationInfo, msg, event)
            }
        }
        // ensure originationg client will get the response
        return errorEvent(msg)
    }

    /**
     * Check whether the `participation` is correct for executing the `delta` command/request.
     * @param delta
     * @param participation
     */
    validateParticipation = (
        delta: MessageFromClient,
        participation: Participation | undefined
    ): ErrorEvent | ErrorResponse | undefined => {
        if (delta.messageKind === "SignOnRequest" || delta.messageKind === "ReconnectRequest") {
            return undefined
        }
        if (participation === undefined) {
            return newErrorDelta(
                "invalidParticipation",
                "Cannot perform delta request because there is no participation",
                delta,
                participation
            )
        } else if (isDeltaAdminRequest(delta)) {
            // Always ok, does not have tom be signedOn
            return undefined
        } else if (participation.participationStatus !== "signedOn" && delta.messageKind !== "SignOffRequest") {
            return newErrorDelta(
                "invalidParticipation",
                `Cannot perform ${delta.messageKind} command/request because participation status is ${participation.participationStatus}`,
                delta,
                participation,
                {
                    additionalInfos: [
                        {
                            kind: "reason",
                            message: "Participation status incorrect, should be SignedOn",
                            data: {
                                participationStatus: participation.participationStatus
                            }
                            
                        }
                    ]
                }
            )
        }
        return undefined
    }
    
    sendDelta(
        socket: WebSocket,
        participation: Participation | undefined,
        originalMessage: MessageFromClient,
        responseOrEvent: MessageToClient
    ) {
        deltaLogger.info(`Send delta ${responseOrEvent.messageKind} to ${participation?.repositoryData?.clientId}`)
        if (responseOrEvent.messageKind === "ErrorEvent") {
            deltaLogger.info(`Sending ERROR message ${toJsonString(responseOrEvent)}`)
        }
        if (isDeltaEvent(responseOrEvent) && isDeltaCommand(originalMessage)) {
            responseOrEvent.originCommands.forEach(cmd => (cmd.commandId = originalMessage.commandId))
            responseOrEvent.additionalInfos.push(...findDistributableInfos(originalMessage))
        } else if (isDeltaRequest(originalMessage) && isDeltaResponse(responseOrEvent)) {
            responseOrEvent.queryId = originalMessage.queryId
        } else if (isDeltaAdminRequest(originalMessage) && isDeltaAdminResponse(responseOrEvent)) {
            responseOrEvent.queryId = originalMessage.queryId
        } else {
            // TODO Ok for admin events, but otherwise this should be impossible
        }
        // Buffer send events in case of composite command
        if (this.eventBuffers.shouldBuffer()) {
            deltaLogger.info(`    buffering event ${responseOrEvent.messageKind}`)
            this.eventBuffers.activeBuffer().addEvent(participation!, (originalMessage as DeltaCommand), responseOrEvent as DeltaEvent)
        } else {
            deltaLogger.info(`    sending event/response ${JSON.stringify(responseOrEvent)}`)
            this.applySequenceNumbers(participation!, responseOrEvent)
            socket.send(JSON.stringify(responseOrEvent))
        }
    }

    /**
     * Add sequence numbers to events is done just before actually sending the event, to ensure the numbers can de
     * addedc correctly for Compoite Events.
     * @param participation
     * @param responseOrEvent
     */
    applySequenceNumbers(participation: Participation, responseOrEvent: MessageToClient): void {
        if (isDeltaEvent(responseOrEvent)) {
            responseOrEvent.sequenceNumber = participation.nextSequenceNumber()
            if (responseOrEvent.messageKind === "CompositeEvent") {
                for(const part of (responseOrEvent as CompositeEvent).parts) {
                    this.applySequenceNumbers(participation, part)
                }                
            }
        }
    }

    /**
     * Send the PartitionAdded event to all participations that are subscribed.
     * To make things complex,  each subscriber may get a different subset of tghe new partition's nodes.
     *
     * @param socket  The socket through which the AddPartition command was received.
     * @param delta     The original AddPartition command
     * @param response  The response event, with only the root partition node.
     */
    sendPartitionAddedEvents(
        socket: WebSocket,
        delta: AddPartitionCommand,
        response: PartitionAddedEvent,
        affectedPartition: string
    ): void {
        deltaLogger.info(`DeltaProcessor.sendPartitionAddedEvents`)
        for (const participationInfo of PARTICIPATIONS.allParticipations()) {
            deltaLogger.info("DeltaProcessor.sendPartitionAddedEvents for " + participationInfo.repositoryData?.clientId)
            if (participationInfo.partitionChangesSubscription !== undefined) {
                deltaLogger.info(
                    "DeltaProcessor.sendPartitionAddedEvents subscription for " +
                        participationInfo.repositoryData?.clientId +
                        " => " +
                        participationInfo.partitionChangesSubscription.creation
                )

                // Subscribed?
                if (participationInfo.partitionChangesSubscription.creation === true) {
                    if (participationInfo.partitionChangesSubscription.autoSubscribe) {
                        // autosubscribe, so send full partition nodes
                        const adaptedResponse = structuredClone(response)
                        adaptedResponse.newPartition = {
                            nodes: delta.newPartition.nodes
                        }
                        this.sendDelta(participationInfo.socket, participationInfo, delta, adaptedResponse)
                    } else {
                        // No subscribe send requested depht limit nodes
                        const chunk = LionWebJsonChunkWrapper.fromNodesArray(delta.newPartition.nodes)
                        const depthChunk = chunk.getSubtreeWithDepth(
                            affectedPartition,
                            participationInfo.partitionChangesSubscription.depth
                        )
                        deltaLogger.info(`chunk has ${depthChunk.length} nodes`)
                        const adaptedResponse = structuredClone(response)
                        adaptedResponse.newPartition.nodes = depthChunk
                        this.sendDelta(participationInfo.socket, participationInfo, delta, adaptedResponse)
                    }
                } else if (participationInfo.socket === socket) {
                    // not subscribed but send event to originating client
                    deltaLogger.info(
                        `DeltaProcessor.sendPartitionAddedEvents to originating 1: ${participationInfo.repositoryData?.clientId}`
                    )
                    this.sendDelta(socket, participationInfo, delta, response)
                } else {
                    deltaLogger.info("    Not sending event ...")
                }
            } else if (participationInfo.socket === socket) {
                deltaLogger.info("DeltaProcessor.sendPartitionAddedEvents to originating: " + participationInfo.repositoryData?.clientId)
                // noty subscribed but send event to originating client
                this.sendDelta(socket, participationInfo, delta, response)
            }
        }
    }

    sendPartitionDeletedEvents(delta: MessageFromClient, response: PartitionDeletedEvent): void {
        // Find out which nodes to send to whom
        for (const participationInfo of PARTICIPATIONS.allParticipations()) {
            deltaLogger.debug("DeltaProcessor.PartitionDeleted next socket " + participationInfo.repositoryData?.clientId)
            const needsToSend: boolean =
                (participationInfo.partitionChangesSubscription !== undefined && participationInfo.partitionChangesSubscription.deletion) ||
                participationInfo.subscribedPartitions.has(response.deletedPartition)
            if (needsToSend) {
                this.sendDelta(participationInfo.socket, participationInfo, delta, response)
            }
        }
    }

    sendToSubscribers(delta: MessageFromClient, response: MessageToClient, partition: LionWebId): void {
        deltaLogger.debug(`affectedPartition ${partition}`)
        response.additionalInfos.push(affectedPartitionMessage(partition))
        for (const participationInfo of PARTICIPATIONS.allParticipations()) {
            deltaLogger.info(
                `Participant ${participationInfo.repositoryData?.clientId} subscribed to '${toJsonString(
                    participationInfo.subscribedPartitions
                )}'`
            )
            if (participationInfo.subscribedPartitions.has(partition)) {
                deltaLogger.info(`Subscribed Sending ${toJsonString(response)} to ${participationInfo.repositoryData?.clientId}`)
                this.sendDelta(participationInfo.socket, participationInfo, delta, response)
            } else {
                // deltaLogger.info(`NOT Subscribed ${participationInfo.repositoryData?.clientId}`)
            }
        }
    }
}

// Status: connected + activeParticipation(s)
//         connected + noParticipation

export const deltaProcessor = new DeltaProcessor([
    childFunctions,
    requestFunctions,
    referenceFunctions,
    annotationFunctions,
    partitionFunctions,
    propertyFunctions,
    adminRequestFunctions,
    miscFunctions
])
