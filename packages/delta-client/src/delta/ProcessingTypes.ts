import { DeltaEvent, DeltaResponse, EventMessageKind, ResponseMessageKind } from "@lionweb/server-delta-shared"
import WebSocket from "ws"

export type ReceivingFunction = (socket: WebSocket, msg: DeltaEvent | DeltaResponse) => void
export type ReceivingDelta = {
    messageKind: EventMessageKind | ResponseMessageKind;
    processor: ReceivingFunction;
}


