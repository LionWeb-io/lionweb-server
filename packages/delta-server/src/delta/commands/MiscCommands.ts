import { deltaLogger } from "@lionweb/server-common"
import { ChangeClassifierCommand, CompositeCommand, DeltaEvent } from "@lionweb/server-delta-shared"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const ChangeClassifier = (socket: WebSocket, msg: ChangeClassifierCommand): DeltaEvent => {
    deltaLogger.info("Called ChangeClassifierFunction " + msg.messageKind)
    return errorEvent(msg)
}

const CompositeCommand = (socket: WebSocket, msg: CompositeCommand): DeltaEvent => {
    deltaLogger.info("Called CompositeCommandFunction " + msg.messageKind)
    return errorEvent(msg)
}

export const miscFunctions: DeltaFunction[] = [
    {
        messageKind: "ChangeClassifier",
        // @ts-expect-error TS2332
        processor: ChangeClassifier
    },
    {
        messageKind: "CompositeCommand",
        // @ts-expect-error TS2332
        processor: CompositeCommand
    }
]
