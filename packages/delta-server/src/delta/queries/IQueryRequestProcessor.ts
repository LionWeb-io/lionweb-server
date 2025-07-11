import {
    GetAvailableIdsRequest,
    ListPartitionsRequest,
    ReconnectRequest,
    SignOffRequest,
    SignOnRequest,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import WebSocket from 'ws';

export interface IQueryRequestProcessor {
    SubscribeToChangingPartitionsRequestFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsRequest): void

    SubscribeToPartitionContentsRequestFunction(socket: WebSocket, msg: SubscribeToPartitionContentsRequest): void

    UnsubscribeFromPartitionContentsRequestFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsRequest): void

    SignOnRequestFunction(socket: WebSocket, msg: SignOnRequest): void

    SignOffRequestFunction(socket: WebSocket, msg: SignOffRequest): void

    ListPartitionsRequestFunction(socket: WebSocket, msg: ListPartitionsRequest): void

    GetAvailableIdsRequestFunction(socket: WebSocket, msg: GetAvailableIdsRequest): void

    ReconnectRequestFunction(socket: WebSocket, msg: ReconnectRequest): void
}
