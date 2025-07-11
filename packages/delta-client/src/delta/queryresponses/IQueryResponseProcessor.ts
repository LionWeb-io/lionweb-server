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

export interface IQueryResponseProcessor {
    SubscribeToChangingPartitionsResponseFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsResponse): void

    SubscribeToPartitionContentsResponseFunction(socket: WebSocket, msg: SubscribeToPartitionContentsResponse): void

    UnsubscribeFromPartitionContentsResponseFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsResponse): void

    SignOnResponseFunction(socket: WebSocket, msg: SignOnResponse): void

    SignOffResponseFunction(socket: WebSocket, msg: SignOffResponse): void

    ListPartitionsResponseFunction(socket: WebSocket, msg: ListPartitionsQueryResponse): void

    GetAvailableIdsResponseFunction(socket: WebSocket, msg: GetAvailableIdsResponse): void

    ReconnectResponseFunction(socket: WebSocket, msg: ReconnectResponse): void
}
