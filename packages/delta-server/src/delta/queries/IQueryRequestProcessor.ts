import {
    EventType,
    GetAvailableIdsRequest,
    ListPartitionsRequest, QueryResponseType,
    ReconnectRequest,
    SignOffRequest,
    SignOnRequest,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import WebSocket from 'ws';

export interface IQueryRequestProcessor {
    SubscribeToChangingPartitionsRequestFunction(socket: WebSocket, msg: SubscribeToChangingPartitionsRequest): EventType | QueryResponseType

    SubscribeToPartitionContentsRequestFunction(socket: WebSocket, msg: SubscribeToPartitionContentsRequest): EventType | QueryResponseType

    UnsubscribeFromPartitionContentsRequestFunction(socket: WebSocket, msg: UnsubscribeFromPartitionContentsRequest): EventType | QueryResponseType

    SignOnRequestFunction(socket: WebSocket, msg: SignOnRequest): EventType | QueryResponseType

    SignOffRequestFunction(socket: WebSocket, msg: SignOffRequest): EventType | QueryResponseType

    ListPartitionsRequestFunction(socket: WebSocket, msg: ListPartitionsRequest): EventType | QueryResponseType

    GetAvailableIdsRequestFunction(socket: WebSocket, msg: GetAvailableIdsRequest): EventType | QueryResponseType

    ReconnectRequestFunction(socket: WebSocket, msg: ReconnectRequest): EventType | QueryResponseType
}
