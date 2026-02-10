import { AdminResponseMessageKind, DeltaAdminResponse, DeltaEvent, DeltaResponse, EventMessageKind, ResponseMessageKind } from "@lionweb/server-delta-shared"

export type ReceivingFunction = (msg: DeltaEvent | DeltaResponse | DeltaAdminResponse) => void
export type ReceivingDelta = {
    messageKind: EventMessageKind | ResponseMessageKind | AdminResponseMessageKind
    processor: ReceivingFunction
}
