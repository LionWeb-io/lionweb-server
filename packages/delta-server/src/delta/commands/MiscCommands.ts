import { deltaLogger } from "@lionweb/server-common"
import { ChangeClassifierCommand, DeltaEvent, CompositeCommand, ChunkedCommand } from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
// import { deltaProcessor } from "../DeltaProcessor.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"
import WebSocket from "ws"

const ChangeClassifierFunction = (participation: ParticipationInfo, msg: ChangeClassifierCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called ChangeClassifierFunction " + msg.messageKind)
    return errorEvent(msg)
}

const CompositeCommandFunction = (participation: ParticipationInfo, msg: CompositeCommand, _ctx: DeltaContext, _ChunkedCommandsocket?: WebSocket): DeltaEvent => {
    deltaLogger.info("Called CompositeCommandFunction " + msg.messageKind)
    // for(const cmd of msg.parts) {
    //     deltaProcessor.processDelta(socket!, cmd)
    // }
    return errorEvent(msg)
}

const ChunkedCommandFunction = (participation: ParticipationInfo, msg: ChunkedCommand, _ctx: DeltaContext, _socket?: WebSocket): DeltaEvent => {
    deltaLogger.info("Called ChunkedCommandFunction " + msg.messageKind)
    // for(const cmd of msg.parts) {
    //     deltaProcessor.processDelta(socket!, cmd)
    // }
    return errorEvent(msg)
}

export const miscFunctions: DeltaFunction[] = [
    {
        messageKind: "ChangeClassifier",
        // @ts-expect-error TS2332
        processor: ChangeClassifierFunction
    },
    {
        messageKind: "ChunkedCommand",
        // @ts-expect-error TS2332
        processor: ChunkedCommandFunction
    },
    {
        messageKind: "CompositeCommand",
        // @ts-expect-error TS2332
        processor: CompositeCommandFunction
    }
]
