import { deltaLogger } from "@lionweb/server-common"
import {
    AddAnnotationCommand,
    DeleteAnnotationCommand,
    DeltaEvent,
    MoveAndReplaceAnnotationFromOtherParentCommand,
    MoveAndReplaceAnnotationInSameParentCommand,
    MoveAnnotationFromOtherParentCommand,
    MoveAnnotationInSameParentCommand,
    ReplaceAnnotationCommand
} from "@lionweb/server-delta-shared"
import WebSocket from "ws"
import { DeltaFunction, errorEvent, MessageFunction } from "./DeltaUtil.js"

const AddAnnotation = (socket: WebSocket, msg: AddAnnotationCommand): DeltaEvent => {
    deltaLogger.info("Called AddAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const DeleteAnnotation = (socket: WebSocket, msg: DeleteAnnotationCommand): DeltaEvent => {
    deltaLogger.info("Called DeleteAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const ReplaceAnnotation = (socket: WebSocket, msg: ReplaceAnnotationCommand): DeltaEvent => {
    deltaLogger.info("Called ReplaceAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationFromOtherParent = (socket: WebSocket, msg: MoveAnnotationFromOtherParentCommand): DeltaEvent => {
    deltaLogger.info("Called MoveAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationInSameParent = (socket: WebSocket, msg: MoveAnnotationInSameParentCommand): DeltaEvent => {
    deltaLogger.info("Called MoveAnnotationInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationFromOtherParent = (
    socket: WebSocket,
    msg: MoveAndReplaceAnnotationFromOtherParentCommand
): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationInSameParent = (socket: WebSocket, msg: MoveAndReplaceAnnotationInSameParentCommand): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceAnnotationInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

export const annotationFunctions: DeltaFunction[] = [
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: AddAnnotation
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: DeleteAnnotation
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: ReplaceAnnotation
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAnnotationInSameParent
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAnnotationFromOtherParent
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceAnnotationInSameParent
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceAnnotationFromOtherParent
    },
]
