import {
    GetAvailableIdsRequest,
    ListPartitionsRequest, ReconnectRequest,
    SignOffRequest,
    SignOnRequest,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"

export function SubscribeToChangingPartitionsRequestFunction(msg: SubscribeToChangingPartitionsRequest): void {
    console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind);
}

export function SubscribeToPartitionContentsRequestFunction(msg: SubscribeToPartitionContentsRequest): void {
    console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind);
}

export function UnsubscribeFromPartitionContentsRequestFunction(msg: UnsubscribeFromPartitionContentsRequest): void {
    console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind);
}

export function SignOnRequestFunction(msg: SignOnRequest): void {
    console.log("Called SignOnRequestFunction " + msg.messageKind);
}

export function SignOffRequestFunction(msg: SignOffRequest): void {
    console.log("Called SignOffRequestFunction " + msg.messageKind);
}

export function ListPartitionsRequestFunction(msg: ListPartitionsRequest): void {
    console.log("Called ListPartitionsRequestFunction " + msg.messageKind);
}

export function GetAvailableIdsRequestFunction(msg: GetAvailableIdsRequest): void {
    console.log("Called GetAvailableIdsRequestFunction " + msg.messageKind);
}

export function ReconnectRequestFunction(msg: ReconnectRequest): void {
    console.log("Called ReconnectRequestFunction " + msg.messageKind);
}
