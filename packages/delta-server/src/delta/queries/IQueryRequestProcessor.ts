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

export interface IQueryRequestProcessor {
    SubscribeToChangingPartitionsRequestFunction(msg: SubscribeToChangingPartitionsRequest): void

    SubscribeToPartitionContentsRequestFunction(msg: SubscribeToPartitionContentsRequest): void

    UnsubscribeFromPartitionContentsRequestFunction(msg: UnsubscribeFromPartitionContentsRequest): void

    SignOnRequestFunction(msg: SignOnRequest): void

    SignOffRequestFunction(msg: SignOffRequest): void

    ListPartitionsRequestFunction(msg: ListPartitionsRequest): void

    GetAvailableIdsRequestFunction(msg: GetAvailableIdsRequest): void

    ReconnectRequestFunction(msg: ReconnectRequest): void
}
