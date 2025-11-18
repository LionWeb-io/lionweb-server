import { deltaLogger } from "@lionweb/server-common";
import {
    AddChildCommand,
    DeleteChildCommand,
    DeltaEvent, ErrorEvent,
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

const AddChild = async (participation: ParticipationInfo, msg: AddChildCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called AddChild " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteChild = async (participation: ParticipationInfo, msg: DeleteChildCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called DeleteChild " + msg.messageKind)
        return errorEvent(msg)
    }

const ReplaceChild = async (participation: ParticipationInfo, msg: ReplaceChildCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called ReplaceChild " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainment = async (participation: ParticipationInfo, msg: MoveChildFromOtherContainmentCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called MoveChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainmentInSameParent = async (participation: ParticipationInfo, msg: MoveChildFromOtherContainmentInSameParentCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called MoveChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildInSameContainment = async (participation: ParticipationInfo, msg: MoveChildInSameContainmentCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called MoveChildInSameContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainment = async (participation: ParticipationInfo, msg: MoveAndReplaceChildFromOtherContainmentCommand): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainmentInSameParent = async (participation: ParticipationInfo, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildInSameContainment = async (participation: ParticipationInfo, msg: MoveAndReplaceChildInSameContainmentCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
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
