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
import WebSocket from "ws"
import { ReceivingDelta } from "../ProcessingTypes.js"

const SubscribeToChangingPartitionsResponseFunction = (socket: WebSocket, msg: SubscribeToChangingPartitionsResponse): void => {
    console.log("Called SubscribeToChangingPartitionsResponseFunction " + msg.messageKind)
}

const SubscribeToPartitionContentsResponseFunction = (socket: WebSocket, msg: SubscribeToPartitionContentsResponse): void => {
    console.log("Called SubscribeToPartitionContentsResponseFunction " + msg.messageKind)
}

const UnsubscribeFromPartitionContentsResponseFunction = (socket: WebSocket, msg: UnsubscribeFromPartitionContentsResponse): void => {
    console.log("Called UnsubscribeFromPartitionContentsResponseFunction " + msg.messageKind)
}

const SignOnResponseFunction = (socket: WebSocket, msg: SignOnResponse): void => {
    console.log("Called SignOnResponseFunction " + msg.messageKind)
}

const SignOffResponseFunction = (socket: WebSocket, msg: SignOffResponse): void => {
    console.log("Called SignOffResponseFunction " + msg.messageKind)
}

const ListPartitionsResponseFunction = (socket: WebSocket, msg: ListPartitionsResponse): void => {
    console.log("Called ListPartitionsResponseFunction " + msg.messageKind)
}

const GetAvailableIdsResponseFunction = (socket: WebSocket, msg: GetAvailableIdsResponse): void => {
    console.log("Called GetAvailableIdsResponseFunction " + msg.messageKind)
}

const ReconnectResponseFunction = (socket: WebSocket, msg: ReconnectResponse): void => {
    console.log("Called ReconnectResponseFunction " + msg.messageKind)
}

export const responseFunctions: ReceivingDelta[] = [
    {
        messageKind: "SubscribeToChangingPartitionsResponse",
        // @ts-expect-error TS2322
        processor: SubscribeToChangingPartitionsResponseFunction
    },
    {
        messageKind: "SubscribeToPartitionContentsResponse",
        // @ts-expect-error TS2322
        processor: SubscribeToPartitionContentsResponseFunction
    },
    {
        messageKind: "UnsubscribeFromPartitionContentsResponse",
        // @ts-expect-error TS2322
        processor: UnsubscribeFromPartitionContentsResponseFunction
    },
    {
        messageKind: "SignOnResponse",
        // @ts-expect-error TS2322
        processor: SignOnResponseFunction
    },
    {
        messageKind: "SignOffResponse",
        // @ts-expect-error TS2322
        processor: SignOffResponseFunction
    },
    {
        messageKind: "ListPartitionsResponse",
        // @ts-expect-error TS2322
        processor: ListPartitionsResponseFunction
    },
    {
        messageKind: "GetAvailableIdsResponse",
        // @ts-expect-error TS2322
        processor: GetAvailableIdsResponseFunction
    },
    {
        messageKind: "ReconnectResponse",
        // @ts-expect-error TS2322
        processor: ReconnectResponseFunction
    },
]
