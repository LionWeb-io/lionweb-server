import { deltaLogger } from "@lionweb/server-common";
import { ResponseMessage } from "@lionweb/server-shared";
import WebSocket from 'ws';
import { activeSockets } from "../DeltaClientAdmin.js"
import {
    CommandType,
    ErrorEvent, EventType,
    GetAvailableIdsRequest, ListPartitionsQueryResponse,
    ListPartitionsRequest, QueryRequestType, QueryResponseType,
    ReconnectRequest,
    SignOffRequest,
    SignOnRequest, SignOnResponse,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import { IQueryRequestProcessor } from "./IQueryRequestProcessor.js"

/**
 * Allowed state transitions:
 * START     => connected
 * connected => signedOn
 * signedOn  => signedOff    NB should this not be "connected again?
 * signedOff => signedOn
 * 
 * connected => disconnected
 * signedOn  => dicponnected
 * signedOff => disconnected */
export type ParticipationStatus = "connected" | "signedOn" | "signedOff" | "disconnected"

export type ParticipationInfo = {
    /**
     * The socket which created thos participation
     */
    socket: WebSocket,
    /**
     * The unique id of the participation
     */
    participationId: string,
    /**
     * The repository for this participation.
     */
    repository: string,
    /**
     * The LionWeb delta protocol version
     */
    deltaProtocolVersion: string,
    /**
     * The client id as given by the client
     */
    clientId: string,
    /**
     * The first available number for the next event.
     */
    eventSequenceNumber: number,
    /**
     * The state of this participation.
     */
    participationStatus: ParticipationStatus 
}
export class QueryRequestProcessor implements IQueryRequestProcessor {
    currentParticipationId: number = 1
    activeSockets: Map<WebSocket, ParticipationInfo> = new Map<WebSocket, ParticipationInfo>()
    
    SubscribeToChangingPartitionsRequestFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsRequest): EventType | QueryResponseType {
        console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    SubscribeToPartitionContentsRequestFunction(socket: WebSocket, msg: SubscribeToPartitionContentsRequest): EventType | QueryResponseType {
        console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    UnsubscribeFromPartitionContentsRequestFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsRequest): EventType  | QueryResponseType{
        console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    SignOnRequestFunction = (socket: WebSocket, msg: SignOnRequest): EventType | QueryResponseType => {
        deltaLogger.info("Called SignOnRequestFunction " + msg.messageKind)
        const repositoryInfo = msg.protocolMessages?.find(p => p.kind === "repository");
        // if (repositoryInfo === undefined) {
        //     const response: ErrorEvent = {
        //         messageKind: "ErrorEvent",
        //         errorCode: "RepositoryMissing",
        //         message: "SignOnRequest is missing repository name in the protocol message",
        //         sequenceNumber: 0,
        //         originCommands: [ {participationId: "unknown", commandId: msg.queryId} ],
        //         protocolMessages: []
        //     }
        //     const pInfo = activeSockets.get(socket)
        //     pInfo!.participationStatus = "signedOn"
        //     socket.send(JSON.stringify(response))
        // } else {
        //     const repositoryName = repositoryInfo.data.find( d => d.key === "repository")
        // }
        const pInfo = activeSockets.get(socket)
        pInfo!.participationStatus = "signedOn"
        pInfo!.clientId = msg.clientId
        const response: SignOnResponse = {
            messageKind: "SignOnResponse",
            participationId: `pid-${this.currentParticipationId++}`,
            queryId: msg.queryId,
            protocolMessages: [ { data: [], kind: "Info", message: "SignOnRequest received"}]
        }
        return response
    }

    SignOffRequestFunction(socket: WebSocket, msg: SignOffRequest): EventType | QueryResponseType {
        deltaLogger.info("Called SignOffRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ListPartitionsRequestFunction(socket: WebSocket, msg: ListPartitionsRequest): EventType | QueryResponseType {
        deltaLogger.info("Called ListPartitionsRequestFunction " + msg.messageKind)
        const response: ListPartitionsQueryResponse = {
            messageKind: "ListPartitions",
            partitions: {  nodes: [] },
            queryId: msg.queryId
        }
        return response
    }

    GetAvailableIdsRequestFunction(socket: WebSocket, msg: GetAvailableIdsRequest): EventType | QueryResponseType {
        deltaLogger.info("Called GetAvailableIdsRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ReconnectRequestFunction(socket: WebSocket, msg: ReconnectRequest): EventType | QueryResponseType {
        deltaLogger.info("Called ReconnectRequestFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    errorEvent = (msg: QueryRequestType): ErrorEvent => (
        {
            message: `${msg.messageKind}: Not implemented yet`,
            sequenceNumber: 0,
            originCommands: [ { commandId: msg.queryId, participationId: "error"}],
            errorCode: "generic",
            messageKind: "ErrorEvent"
        }
    )
}


