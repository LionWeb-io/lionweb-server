// @ts-nocheck
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
import { IQueryResponseProcessor } from "./IQueryProcessors.js"

export class QueryResponseProcessor implements IQueryResponseProcessor {
    SubscribeToChangingPartitionsResponseFunction(msg: SubscribeToChangingPartitionsResponse): void {
        console.log("Called SubscribeToChangingPartitionsResponseFunction " + msg.messageKind)
    }

    SubscribeToPartitionContentsResponseFunction(msg: SubscribeToPartitionContentsResponse): void {
        console.log("Called SubscribeToPartitionContentsResponseFunction " + msg.messageKind)
    }

    UnsubscribeFromPartitionContentsResponseFunction(msg: UnsubscribeFromPartitionContentsResponse): void {
        console.log("Called UnsubscribeFromPartitionContentsResponseFunction " + msg.messageKind)
    }

    SignOnResponseFunction(msg: SignOnResponse): void {
        console.log("Called SignOnResponseFunction " + msg.messageKind)
    }

    SignOffResponseFunction(msg: SignOffResponse): void {
        console.log("Called SignOffResponseFunction " + msg.messageKind)
    }

    ListPartitionsResponseFunction(msg: ListPartitionsQueryResponse): void {
        console.log("Called ListPartitionsResponseFunction " + msg.messageKind)
    }

    GetAvailableIdsResponseFunction(msg: GetAvailableIdsResponse): void {
        console.log("Called GetAvailableIdsResponseFunction " + msg.messageKind)
    }

    ReconnectResponseFunction(msg: ReconnectResponse): void {
        console.log("Called ReconnectResponseFunction " + msg.messageKind)
    }
}
