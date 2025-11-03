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
import WebSocket from 'ws';
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddReference = (socket: WebSocket, msg: AddReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called AddReference " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReference = (socket: WebSocket, msg: DeleteReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called DeleteReference " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReference = (socket: WebSocket, msg: ChangeReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called ChangeReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryFromOtherReference = (socket: WebSocket, msg: MoveEntryFromOtherReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called MoveEntryFromOtherReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryFromOtherReferenceInSameParent = (socket: WebSocket, msg: MoveEntryFromOtherReferenceInSameParentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveEntryFromOtherReferenceInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveEntryInSameReference = (socket: WebSocket, msg: MoveEntryInSameReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called MoveEntryInSameReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryFromOtherReference = (socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReference " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryFromOtherReferenceInSameParent = (socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReferenceInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceEntryInSameReference = (socket: WebSocket, msg: MoveAndReplaceEntryInSameReferenceCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceEntryInSameReference " + msg.messageKind)
        return errorEvent(msg)
    }

const AddReferenceResolveInfo = (socket: WebSocket, msg: AddReferenceResolveInfoCommand): DeltaEvent => {
        deltaLogger.info("Called AddReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReferenceResolveInfo = (socket: WebSocket, msg: DeleteReferenceResolveInfoCommand): DeltaEvent => {
        deltaLogger.info("Called DeleteReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReferenceResolveInfo = (socket: WebSocket, msg: ChangeReferenceResolveInfoCommand): DeltaEvent => {
        deltaLogger.info("Called ChangeReferenceResolveInfo " + msg.messageKind)
        return errorEvent(msg)
    }

const AddReferenceTarget = (socket: WebSocket, msg: AddReferenceTargetCommand): DeltaEvent => {
        deltaLogger.info("Called AddReferenceTarget " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteReferenceTarget = (socket: WebSocket, msg: DeleteReferenceTargetCommand): DeltaEvent => {
        deltaLogger.info("Called DeleteReferenceTarget " + msg.messageKind)
        return errorEvent(msg)
    }

const ChangeReferenceTarget = (socket: WebSocket, msg: ChangeReferenceTargetCommand): DeltaEvent => {
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
