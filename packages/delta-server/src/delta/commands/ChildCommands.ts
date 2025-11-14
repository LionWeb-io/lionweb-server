import { deltaLogger } from "@lionweb/server-common";
import {
    AddChildCommand,
    DeleteChildCommand,
    DeltaEvent,
    MoveAndReplaceChildFromOtherContainmentCommand,
    MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    MoveAndReplaceChildInSameContainmentCommand,
    MoveChildFromOtherContainmentCommand,
    MoveChildFromOtherContainmentInSameParentCommand,
    MoveChildInSameContainmentCommand,
    ReplaceChildCommand
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddChild = (participation: ParticipationInfo, msg: AddChildCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called AddChild " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteChild = (participation: ParticipationInfo, msg: DeleteChildCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called DeleteChild " + msg.messageKind)
        return errorEvent(msg)
    }

const ReplaceChild = (participation: ParticipationInfo, msg: ReplaceChildCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called ReplaceChild " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainment = (participation: ParticipationInfo, msg: MoveChildFromOtherContainmentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainmentInSameParent = (participation: ParticipationInfo, msg: MoveChildFromOtherContainmentInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildInSameContainment = (participation: ParticipationInfo, msg: MoveChildInSameContainmentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveChildInSameContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainment = (participation: ParticipationInfo, msg: MoveAndReplaceChildFromOtherContainmentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainmentInSameParent = (participation: ParticipationInfo, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildInSameContainment = (participation: ParticipationInfo, msg: MoveAndReplaceChildInSameContainmentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceChildInSameContainment " + msg.messageKind)
        return errorEvent(msg)
    }

export const childFunctions: DeltaFunction[] = [
    {
        messageKind: "AddChild",
        // @ts-expect-error TS2332
        processor: AddChild
    },
    {
        messageKind: "DeleteChild",
        // @ts-expect-error TS2332
        processor: DeleteChild
    },
    {
        messageKind: "ReplaceChild",
        // @ts-expect-error TS2332
        processor: ReplaceChild
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildInSameContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainmentInSameParent
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildInSameContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainmentInSameParent
    }
]
