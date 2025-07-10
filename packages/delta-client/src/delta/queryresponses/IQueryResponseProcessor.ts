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
    SubscribeToChangingPartitionsResponseFunction(msg: SubscribeToChangingPartitionsResponse): void

    SubscribeToPartitionContentsResponseFunction(msg: SubscribeToPartitionContentsResponse): void

    UnsubscribeFromPartitionContentsResponseFunction(msg: UnsubscribeFromPartitionContentsResponse): void

    SignOnResponseFunction(msg: SignOnResponse): void

    SignOffResponseFunction(msg: SignOffResponse): void

    ListPartitionsResponseFunction(msg: ListPartitionsQueryResponse): void

    GetAvailableIdsResponseFunction(msg: GetAvailableIdsResponse): void

    ReconnectResponseFunction(msg: ReconnectResponse): void
}
