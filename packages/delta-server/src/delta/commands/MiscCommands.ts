import { deltaLogger } from "@lionweb/server-common"
import { ChangeClassifierCommand, CompositeCommand, DeltaEvent } from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const ChangeClassifier = (participation: ParticipationInfo, msg: ChangeClassifierCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called ChangeClassifierFunction " + msg.messageKind)
    return errorEvent(msg)
}

const CompositeCommand = (participation: ParticipationInfo, msg: CompositeCommand, _ctx: DeltaContext): DeltaEvent => {
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
