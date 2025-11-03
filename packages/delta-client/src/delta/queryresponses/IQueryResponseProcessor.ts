import WebSocket from 'ws';
import {
    GetAvailableIdsResponse,
    ListPartitionsResponse,
    ReconnectResponse,
    SignOffResponse,
    SignOnResponse,
    SubscribeToChangingPartitionsResponse,
    SubscribeToPartitionContentsResponse,
    UnsubscribeFromPartitionContentsResponse
} from "@lionweb/server-delta-shared"

export interface IResponseProcessor {
    SubscribeToChangingPartitionsResponseFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsResponse): void

    SubscribeToPartitionContentsResponseFunction(socket: WebSocket, msg: SubscribeToPartitionContentsResponse): void

    UnsubscribeFromPartitionContentsResponseFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsResponse): void

    SignOnResponseFunction(socket: WebSocket, msg: SignOnResponse): void

    SignOffResponseFunction(socket: WebSocket, msg: SignOffResponse): void

    ListPartitionsResponseFunction(socket: WebSocket, msg: ListPartitionsResponse): void

    GetAvailableIdsResponseFunction(socket: WebSocket, msg: GetAvailableIdsResponse): void

    ReconnectResponseFunction(socket: WebSocket, msg: ReconnectResponse): void
}
