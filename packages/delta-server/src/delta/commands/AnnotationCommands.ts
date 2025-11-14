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
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddAnnotation = (participation: ParticipationInfo, msg: AddAnnotationCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called AddAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const DeleteAnnotation = (participation: ParticipationInfo, msg: DeleteAnnotationCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called DeleteAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const ReplaceAnnotation = (participation: ParticipationInfo, msg: ReplaceAnnotationCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called ReplaceAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationFromOtherParent = (participation: ParticipationInfo, msg: MoveAnnotationFromOtherParentCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called MoveAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationInSameParent = (participation: ParticipationInfo, msg: MoveAnnotationInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called MoveAnnotationInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationFromOtherParent = (
    participation: ParticipationInfo,
    msg: MoveAndReplaceAnnotationFromOtherParentCommand, _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationInSameParent = (participation: ParticipationInfo, msg: MoveAndReplaceAnnotationInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
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
