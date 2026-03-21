import { LionWebJsonChunkWrapper } from "@lionweb/json-utils"
import { deltaLogger, isInternalQueryError, notNullOrUndefined } from "@lionweb/server-common"
import { DeltaValidator } from "@lionweb/server-delta-definitions"
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
    LionWebId, PartitionDeletedEvent, CompositeCommand, DeltaEvent
} from "@lionweb/server-delta-shared"
import { MessageFromClient } from "@lionweb/server-delta-shared"
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
import { activeSockets } from "./DeltaClientAdmin.js"
import { affectedPartitionMessage, isErrorEvent, isErrorResponse, newErrorDelta } from "./events.js"
import { ParticipationInfo, requestFunctions } from "./queries/index.js"

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
        for (const participationInfo of activeSockets.values()) {
            deltaLogger.info(
                `Participation ${participationInfo.repositoryData?.clientId} subscibed partitions ${Array.from(participationInfo.subscribedPartitions).map(n => n)}`
            )
            if (participationInfo.partitionChangesSubscription !== undefined) {
                deltaLogger.info(
                    `              ${participationInfo.partitionChangesSubscription.creation} - ${participationInfo.partitionChangesSubscription.deletion}`
                )
            }
        }
        // first try to get the `messageKind`
        deltaLogger.debug(`processDelta messageKind ${delta?.messageKind}`)
        const participation = activeSockets.get(socket)
        const messageKind = delta.messageKind
        if (typeof messageKind !== "string") {
            deltaLogger.error(`processDelta 1: messageKind should be a string but is a '${typeof messageKind}'`)
            return
        }
        //  Next, get the processing function for the `messageKind`
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
            deltaLogger.error(`Validation errors for delta: ${JSON.stringify(delta)}`)
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
            deltaLogger.error(`error event/response ${JSON.stringify(errorDelta)}`)
            this.sendDelta(socket, participation, delta, errorDelta)
            return
        }

        // Finally ok, process the delta and send the response
        try {
            const response = await func(participation!, delta, this.context!, socket)
            // Errors and responses to requests only need to be sent to the client that sent the message
            if (response.messageKind === "ErrorEvent" || isDeltaResponse(response) || isDeltaAdminResponse(response)) {
                deltaLogger.info(`Sending Error Event or response ${JSON.stringify(response)}`)
                this.sendDelta(socket, participation, delta, response)
            } else {
                // To whom needs this Event (yes, it's an Event now) needs to be sent.
                deltaLogger.info(`looking for affected partitions in ${response}`)
                const affectedPartitionData = response.additionalInfos.find(m => m.kind == "AffectedPartition")
                // TODO can be more than one affected partition
                const affectedPartition = affectedPartitionData?.data?.find(kv => kv.key === "node")?.value
                if (affectedPartition === undefined) {
                    deltaLogger.info("No affected partition found, not sending delta's")
                } else {
                    // First check for new/deleted partitions, then for partition subscriptions
                    if (response.messageKind === "PartitionAdded") {
                        deltaLogger.info("DeltaProcessor.PartitionAdded")
                        this.sendPartitionAddedEvents(socket, delta as AddPartitionCommand, response as PartitionAddedEvent, affectedPartition)
                    } else if (response.messageKind === "PartitionDeleted") {
                        this.sendPartitionDeletedEvents(delta, response as PartitionDeletedEvent)
                    } else {
                        this.sendToSubscribers(delta, response, affectedPartition)
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
                            data: e.data,
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
                            data: [{ key: "TRACE", value: e.stack ?? "NO TRACE" }]
                        }
                    ]
                })
                this.sendDelta(socket, participation, delta, errorDelta)
            }
        }
    }

    CompositeCommandFunction = (
        participation: ParticipationInfo,
        msg: CompositeCommand,
        _ctx: DeltaContext,
        socket?: WebSocket
    ): DeltaEvent => {
        deltaLogger.info("Called CompositeCommandFunction " + msg.messageKind)
        const store = []
        this.sendDelta = (
            socket: WebSocket,
            participation: ParticipationInfo | undefined,
            originalMessage: MessageFromClient,
            responseOrEvent: MessageToClient
        ): void => {
            const call = { socket: socket, part: participation, orig: originalMessage, responseOrEvent: responseOrEvent }
            store.push(call)
            
        }
        for(const cmd of msg.parts) {
            this.processDelta(socket!, cmd)
        }
        return errorEvent(msg)
    }

    /**
     * Check whether the `participation` is correct for executing the `delta` command/request.
     * @param delta
     * @param participation
     */
    validateParticipation = (
        delta: MessageFromClient,
        participation: ParticipationInfo | undefined
    ): ErrorEvent | ErrorResponse | undefined => {
        if (delta.messageKind === "SignOnRequest") {
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
                            data: [
                                {
                                    key: "participationStatus",
                                    value: participation.participationStatus
                                }
                            ]
                        }
                    ]
                }
            )
        }
        return undefined
    }

    sendDelta(
        socket: WebSocket,
        participation: ParticipationInfo | undefined,
        originalMessage: MessageFromClient,
        responseOrEvent: MessageToClient
    ) {
        deltaLogger.info(`Send delta ${responseOrEvent.messageKind} to ${participation?.repositoryData?.clientId}`)
        if (isDeltaEvent(responseOrEvent) && isDeltaCommand(originalMessage)) {
            responseOrEvent.originCommands.forEach(cmd => (cmd.commandId = originalMessage.commandId))
            responseOrEvent.additionalInfos.push(...findDistributableInfos(originalMessage))
            if (notNullOrUndefined(participation)) {
                responseOrEvent.sequenceNumber = participation.nextSequenceNumber()
            }
        } else if (isDeltaRequest(originalMessage) && isDeltaResponse(responseOrEvent)) {
            responseOrEvent.queryId = originalMessage.queryId
        } else if (isDeltaAdminRequest(originalMessage) && isDeltaAdminResponse(responseOrEvent)) {
            responseOrEvent.queryId = originalMessage.queryId
        } else {
            // TODO Ok for admin events, but otherwise this should be impossible
        }
        socket.send(JSON.stringify(responseOrEvent))
    }

    /**
     * Send thye PartitionAdded event to all participations that are subscribed
     * @param socket
     * @param delta
     * @param response
     */
    sendPartitionAddedEvents(socket: WebSocket, delta: AddPartitionCommand, response: PartitionAddedEvent, affectedPartition: string): void {
        deltaLogger.info(`DeltaProcessor.sendPartitionAddedEvents for ${activeSockets.size}`)
        for (const participationInfo of activeSockets.values()) {
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
                        response.newPartition = {
                            nodes: delta.newPartition.nodes
                        }
                        this.sendDelta(participationInfo.socket, participationInfo, delta, response)
                    } else {
                        const chunk = LionWebJsonChunkWrapper.fromNodesArray(delta.newPartition.nodes)
                        const depthChunk =  chunk.getSubtreeWithDepth(affectedPartition, participationInfo.partitionChangesSubscription.depth)
                        response.newPartition = { nodes: depthChunk }
                        this.sendDelta(participationInfo.socket, participationInfo, delta, response)
                    }
                } else if (participationInfo.socket === socket) {
                    // not subscribed but send event to originating client
                    deltaLogger.info(
                        "DeltaProcessor.sendPartitionAddedEvents to originating 1: " + participationInfo.repositoryData?.clientId
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
        for (const participationInfo of activeSockets.values()) {
            console.log("DeltaProcessor.PartitionDeleted next socket " + participationInfo.repositoryData?.clientId)
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
        for (const participationInfo of activeSockets.values()) {
            deltaLogger.info(
                `Participant ${participationInfo.repositoryData?.clientId} subscribed to '${JSON.stringify(
                    participationInfo.subscribedPartitions
                )}'`
            )
            if (participationInfo.subscribedPartitions.has(partition)) {
                deltaLogger.info(`Subscribed Sending ${JSON.stringify(response)} to ${participationInfo.repositoryData?.clientId}`)
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
