import WebSocket from 'ws';
import {
    GetAvailableIdsRequest,
    ListPartitionsRequest,
    ReconnectRequest,
    SignOffRequest,
    SignOnRequest, SignOnResponse,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import { IQueryRequestProcessor } from "./IQueryRequestProcessor.js"

export type ParticipationInfo = {
    socket: WebSocket,
    participationId: string
}
export class QueryRequestProcessor implements IQueryRequestProcessor {
    currentParticipationId: number = 1
    activeSockets: Map<WebSocket, ParticipationInfo> = new Map<WebSocket, ParticipationInfo>()
    
    SubscribeToChangingPartitionsRequestFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsRequest): void {
        console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
    }

    SubscribeToPartitionContentsRequestFunction(socket: WebSocket, msg: SubscribeToPartitionContentsRequest): void {
        console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
    }

    UnsubscribeFromPartitionContentsRequestFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsRequest): void {
        console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
    }

    SignOnRequestFunction(socket: WebSocket, msg: SignOnRequest): void {
        console.log("Called SignOnRequestFunction " + msg.messageKind)
        const response: SignOnResponse = {
            messageKind: "SignOnResponse",
            participationId: `pid-${this.currentParticipationId++}`,
            queryId: msg.queryId
        }
        this.activeSockets.set(socket, { socket: socket, participationId: response.participationId})
        socket.send(JSON.stringify(response))
    }

    SignOffRequestFunction(socket: WebSocket, msg: SignOffRequest): void {
        console.log("Called SignOffRequestFunction " + msg.messageKind)
    }

    ListPartitionsRequestFunction(socket: WebSocket, msg: ListPartitionsRequest): void {
        console.log("Called ListPartitionsRequestFunction " + msg.messageKind)
    }

    GetAvailableIdsRequestFunction(socket: WebSocket, msg: GetAvailableIdsRequest): void {
        console.log("Called GetAvailableIdsRequestFunction " + msg.messageKind)
    }

    ReconnectRequestFunction(socket: WebSocket, msg: ReconnectRequest): void {
        console.log("Called ReconnectRequestFunction " + msg.messageKind)
    }
}
