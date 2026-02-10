import { deltaLogger, isInternalQueryError, DB, notNullOrUndefined } from "@lionweb/server-common";
import { NodeWithParent } from "@lionweb/server-common/dist/queries/RetrieveNodes.js"
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import {
    ErrorEvent,
    DeltaRequest,
    isDeltaResponse,
    DeltaCommand,
    isDeltaAdminResponse,
    isDeltaAdminRequest,
    DeltaAdminRequest,
    isDeltaEvent,
    isDeltaCommand,
    isDeltaRequest,
    findDistributableInfos,
    MessageToClient,
    ErrorResponse
} from "@lionweb/server-delta-shared"
import { MessageFromClient } from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import WebSocket from 'ws';
import { adminRequestFunctions } from "./adminrequests/AdminFunctions.js"
import { DeltaContext } from "./DeltaContext.js"
import {
    annotationFunctions,
    childFunctions,
    DeltaFunction,
    issuesToProtocolNessages,
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
            deltaLogger.error(`processDelta 2: no processor function found for ${messageKind}`)
            const response = newErrorDelta("MessageKindUnknown", `Cannot perform delta request: message of kind '${messageKind}' is unknown`,
                delta, participation)
            this.sendDelta(socket, participation, delta, response)
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
            const response = newErrorDelta("MessageSyntaxError","Validation errors", delta, participation,
                { additionalInfo: issuesToProtocolNessages(this.deltaValidator.validationResult.issues) })
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
            const response = await func(participation!, delta, this.context!)
            // Errors and responses to requests only need to be sent to the client that sent the message
            if (response.messageKind === "ErrorEvent" || isDeltaResponse(response) || isDeltaAdminResponse(response)) {
                deltaLogger.info(`Sending Error Event or response ${JSON.stringify(response)}`)
                this.sendDelta(socket, participation, delta, response)
            } else {
                // To whom needs this Event (yes, it's an Event now) need to be sent.
                // For most/all events, we need to know whether the others are subscribed to the partition wjhre changes took place
                // TODO: Add the changed partitions to the result of the processing function, so we know to whom to send.
                deltaLogger.debug(`looking for affected nodes in ${response}`)
                const affectedNodeData = response.additionalInfo.find(m => m.kind == "AffectedNode")
                const affectedNode = affectedNodeData?.data?.find(kv => kv.key === "node")
                if (affectedNode === undefined) {
                    deltaLogger.debug("No affected node found, not sending delta's")
                } else {
                    // TODO The parent is retrieved outside the transaction, could already be changed by another delta.
                    const parentChain = await DB.retrieveParentsDB(this.context!.dbConnection, participation!.repositoryData!, affectedNode.value)
                    if (parentChain === undefined) {
                        throw new Error("PARENT CHAIN UNDEFINED")
                    } else {
                        deltaLogger.info(`PARENT CHAIN IS ${JSON.stringify(parentChain)}`)
                    }
                    const affectedPartition = parentChain[parentChain.length-1] ?? { id: affectedNode.value, parent: null } as NodeWithParent
                    if (affectedPartition !== undefined) {
                        deltaLogger.info(`affectedPartition ${JSON.stringify(affectedPartition)}`)
                        response.additionalInfo.push(affectedPartitionMessage(affectedPartition.id))
                        for (const participationInfo of activeSockets.values()) {
                            deltaLogger.info(`Participant ${participationInfo.repositoryData?.clientId} subscribed to '${JSON.stringify(participationInfo.subscribedPartitions)}'`)
                            if (participationInfo.subscribedPartitions.includes(affectedPartition.id)) {
                                deltaLogger.info(`Subscribed Sending ${JSON.stringify(response)} to ${participationInfo.repositoryData!.clientId}`)
                                this.sendDelta(participationInfo.socket, participationInfo, delta, response)
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
            if (isErrorEvent(e) || isErrorResponse(e)) {
                this.sendDelta(socket, participation, delta, e)
            } else if (isInternalQueryError(e)) {
                const errorDelta = newErrorDelta('query error' + e.name, e.message, delta, participation!, {
                    additionalInfo: [ {
                        data: e.data,
                        kind: "InternalQueryError",
                        message:"Additional data"
                    }]
                })
                this.sendDelta(socket, participation, delta, errorDelta)
            } else if (e instanceof Error) {
                console.log(e.stack)
                const errorDelta = newErrorDelta("Exception", e.message, delta, participation!,
                    { 
                        additionalInfo: [{
                            kind: "Extra",
                            message: "stacktrace",
                            data: [{key: "TRACE", value: e.stack ?? "NO TRACE"}]
                        }]
                    })
                this.sendDelta(socket, participation, delta, errorDelta)
            }
        }
    }

    validateParticipation = (delta: MessageFromClient, participation: ParticipationInfo | undefined): ErrorEvent | ErrorResponse | undefined => {
        if (delta.messageKind === "SignOnRequest") {
            return undefined
        }
        if (participation === undefined) {
            return newErrorDelta("invalidParticipation", "Cannot perform delta request because there is no participation", delta, participation)
        } else if ( isDeltaAdminRequest(delta)) {
            // Always ok, does not have tom be signedOn
            return undefined
        } else if (participation.participationStatus !== "signedOn") {
            return newErrorDelta("invalidParticipation",`Cannot perform ListPartitions request because participation status is ${participation.participationStatus}`,
                delta, participation, {
                additionalInfo: [ {
                    kind: "reason",
                    message: "Participation status incorrect, should be SignedOn",
                    data: [{
                        key: "participationStatus",
                        value: participation.participationStatus
                    }]
                }]
            })
        }
        return undefined
    }
    
    sendDelta(socket: WebSocket, participation: ParticipationInfo | undefined, originalMessage: MessageFromClient, responseOrEvent: MessageToClient) {
        if (isDeltaEvent(responseOrEvent) && isDeltaCommand(originalMessage)) {
            responseOrEvent.originCommands.forEach(cmd => cmd.commandId = originalMessage.commandId)
            responseOrEvent.additionalInfo.push(...findDistributableInfos(originalMessage))
            if (notNullOrUndefined(participation)) {
                responseOrEvent.sequenceNumber = participation.nextSequenceNumber()
            }
        } else if (isDeltaRequest(originalMessage) && isDeltaResponse(responseOrEvent)) {
            responseOrEvent.queryId = originalMessage.queryId
        } else {
            // TODO INTERNAL ERROR
        }
        socket.send(JSON.stringify(responseOrEvent))
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
