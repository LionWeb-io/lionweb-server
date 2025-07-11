import WebSocket from 'ws';
import {
    GetAvailableIdsResponse,
    ListPartitionsQueryResponse,
    ReconnectResponse,
    SignOffResponse,
    SignOnResponse,
    SubscribeToChangingPartitionsResponse,
    SubscribeToPartitionContentsResponse,
    UnsubscribeFromPartitionContentsResponse
} from "@lionweb/server-delta-shared"
import { IQueryResponseProcessor } from "./IQueryResponseProcessor.js"

export class QueryResponseProcessor implements IQueryResponseProcessor {
    SubscribeToChangingPartitionsResponseFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsResponse): void {
        console.log("Called SubscribeToChangingPartitionsResponseFunction " + msg.messageKind)
    }

    SubscribeToPartitionContentsResponseFunction(socket: WebSocket, msg: SubscribeToPartitionContentsResponse): void {
        console.log("Called SubscribeToPartitionContentsResponseFunction " + msg.messageKind)
    }

    UnsubscribeFromPartitionContentsResponseFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsResponse): void {
        console.log("Called UnsubscribeFromPartitionContentsResponseFunction " + msg.messageKind)
    }

    SignOnResponseFunction(socket: WebSocket, msg: SignOnResponse): void {
        console.log("Called SignOnResponseFunction " + msg.messageKind)
    }

    SignOffResponseFunction(socket: WebSocket, msg: SignOffResponse): void {
        console.log("Called SignOffResponseFunction " + msg.messageKind)
    }

    ListPartitionsResponseFunction(socket: WebSocket, msg: ListPartitionsQueryResponse): void {
        console.log("Called ListPartitionsResponseFunction " + msg.messageKind)
    }

    GetAvailableIdsResponseFunction(socket: WebSocket, msg: GetAvailableIdsResponse): void {
        console.log("Called GetAvailableIdsResponseFunction " + msg.messageKind)
    }

    ReconnectResponseFunction(socket: WebSocket, msg: ReconnectResponse): void {
        console.log("Called ReconnectResponseFunction " + msg.messageKind)
    }
}
