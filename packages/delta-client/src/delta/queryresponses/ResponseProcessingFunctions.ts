import type {
    SubscribeToChangingPartitionsResponse,
    SubscribeToPartitionContentsResponse,
    UnsubscribeFromPartitionContentsResponse,
    ListPartitionsResponse,
    GetAvailableIdsResponse
} from "@lionweb/server-delta-shared"
import { type ReceivingDelta } from "@lionweb/server-delta-client"

const SubscribeToChangingPartitionsResponseFunction = (msg: SubscribeToChangingPartitionsResponse): void => {
    console.log("Called SubscribeToChangingPartitionsResponseFunction " + msg.messageKind)
}

const SubscribeToPartitionContentsResponseFunction = (msg: SubscribeToPartitionContentsResponse): void => {
    console.log("Called SubscribeToPartitionContentsResponseFunction " + msg.messageKind)
}

const UnsubscribeFromPartitionContentsResponseFunction = (msg: UnsubscribeFromPartitionContentsResponse): void => {
    console.log("Called UnsubscribeFromPartitionContentsResponseFunction " + msg.messageKind)
}

const ListPartitionsResponseFunction = (msg: ListPartitionsResponse): void => {
    console.log("Called ListPartitionsResponseFunction " + msg.messageKind)
}

const GetAvailableIdsResponseFunction = (msg: GetAvailableIdsResponse): void => {
    console.log("Called GetAvailableIdsResponseFunction " + msg.messageKind)
}

export const responseFunctions: ReceivingDelta[] = [
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
    }
]
