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
import { IQueryRequestProcessor } from "./IQueryRequestProcessor.js"

export class QueryRequestProcessor implements IQueryRequestProcessor {
    SubscribeToChangingPartitionsRequestFunction(msg: SubscribeToChangingPartitionsRequest): void {
        console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
    }

    SubscribeToPartitionContentsRequestFunction(msg: SubscribeToPartitionContentsRequest): void {
        console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
    }

    UnsubscribeFromPartitionContentsRequestFunction(msg: UnsubscribeFromPartitionContentsRequest): void {
        console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
    }

    SignOnRequestFunction(msg: SignOnRequest): void {
        console.log("Called SignOnRequestFunction " + msg.messageKind)
    }

    SignOffRequestFunction(msg: SignOffRequest): void {
        console.log("Called SignOffRequestFunction " + msg.messageKind)
    }

    ListPartitionsRequestFunction(msg: ListPartitionsRequest): void {
        console.log("Called ListPartitionsRequestFunction " + msg.messageKind)
    }

    GetAvailableIdsRequestFunction(msg: GetAvailableIdsRequest): void {
        console.log("Called GetAvailableIdsRequestFunction " + msg.messageKind)
    }

    ReconnectRequestFunction(msg: ReconnectRequest): void {
        console.log("Called ReconnectRequestFunction " + msg.messageKind)
    }
}
