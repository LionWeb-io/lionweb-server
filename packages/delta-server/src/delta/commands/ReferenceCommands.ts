import { deltaLogger } from "@lionweb/server-common";
import {
    AddReferenceCommand,
    AddReferenceResolveInfoCommand,
    AddReferenceTargetCommand,
    ChangeReferenceCommand,
    ChangeReferenceResolveInfoCommand,
    ChangeReferenceTargetCommand,
    DeleteReferenceCommand,
    DeleteReferenceResolveInfoCommand,
    DeleteReferenceTargetCommand,
    DeltaEvent,
    MoveAndReplaceEntryFromOtherReferenceCommand,
    MoveAndReplaceEntryFromOtherReferenceInSameParentCommand,
    MoveAndReplaceEntryInSameReferenceCommand,
    MoveEntryFromOtherReferenceCommand,
    MoveEntryFromOtherReferenceInSameParentCommand,
    MoveEntryInSameReferenceCommand
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddReference = (participation: ParticipationInfo, msg: AddReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called AddReference " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReference = (participation: ParticipationInfo, msg: DeleteReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called DeleteReference " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReference = (participation: ParticipationInfo, msg: ChangeReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called ChangeReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryFromOtherReference = (participation: ParticipationInfo, msg: MoveEntryFromOtherReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveEntryFromOtherReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryFromOtherReferenceInSameParent = (participation: ParticipationInfo, msg: MoveEntryFromOtherReferenceInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveEntryFromOtherReferenceInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryInSameReference = (participation: ParticipationInfo, msg: MoveEntryInSameReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveEntryInSameReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryFromOtherReference = (participation: ParticipationInfo, msg: MoveAndReplaceEntryFromOtherReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryFromOtherReferenceInSameParent = (participation: ParticipationInfo, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReferenceInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryInSameReference = (participation: ParticipationInfo, msg: MoveAndReplaceEntryInSameReferenceCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryInSameReference " + msg.messageKind)
        return errorEvent(msg)
    }

const AddReferenceResolveInfo = (participation: ParticipationInfo, msg: AddReferenceResolveInfoCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called AddReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReferenceResolveInfo = (participation: ParticipationInfo, msg: DeleteReferenceResolveInfoCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called DeleteReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReferenceResolveInfo = (participation: ParticipationInfo, msg: ChangeReferenceResolveInfoCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called ChangeReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const AddReferenceTarget = (participation: ParticipationInfo, msg: AddReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called AddReferenceTarget " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReferenceTarget = (participation: ParticipationInfo, msg: DeleteReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called DeleteReferenceTarget " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReferenceTarget = (participation: ParticipationInfo, msg: ChangeReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
        deltaLogger.info("Called ChangeReferenceTarget " + msg.messageKind)
        return errorEvent(msg)
    }
    
export const references: DeltaFunction[] = [
    {
        messageKind: "AddReference",
        // @ts-expect-error TS2332
        processor: AddReference
    },
    {
        messageKind: "DeleteReference",
        // @ts-expect-error TS2332
        processor: DeleteReference
    },
    {
        messageKind: "ChangeReference",
        // @ts-expect-error TS2332
        processor: ChangeReference
    },
    {
        messageKind: "AddReferenceResolveInfo",
        // @ts-expect-error TS2332
        processor: AddReferenceResolveInfo
    },
    {
        messageKind: "AddReferenceTarget",
        // @ts-expect-error TS2332
        processor: AddReferenceTarget
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: ChangeReferenceResolveInfo
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: ChangeReferenceTarget
    },
    {
        messageKind: "DeleteReferenceResolveInfo",
        // @ts-expect-error TS2332
        processor: DeleteReferenceResolveInfo
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: DeleteReferenceTarget
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryFromOtherReference
    },
    {
        messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryFromOtherReferenceInSameParent
    },
    {
        messageKind: "MoveAndReplaceEntryInSameReference",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryInSameReference
    },
    {
        messageKind: "MoveEntryFromOtherReference",
        // @ts-expect-error TS2332
        processor: MoveEntryFromOtherReference
    },
    {
        messageKind: "MoveEntryFromOtherReferenceInSameParent",
        // @ts-expect-error TS2332
        processor: MoveEntryFromOtherReferenceInSameParent
    },
    {
        messageKind: "MoveEntryInSameReference",
        // @ts-expect-error TS2332
        processor: MoveEntryInSameReference
    },
]
