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
import WebSocket from 'ws';
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddChild = (socket: WebSocket, msg: AddChildCommand): DeltaEvent => {
        deltaLogger.info("Called AddChild " + msg.messageKind)
        return errorEvent(msg)
    }

const DeleteChild = (socket: WebSocket, msg: DeleteChildCommand): DeltaEvent => {
        deltaLogger.info("Called DeleteChild " + msg.messageKind)
        return errorEvent(msg)
    }

const ReplaceChild = (socket: WebSocket, msg: ReplaceChildCommand): DeltaEvent => {
        deltaLogger.info("Called ReplaceChild " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainment = (socket: WebSocket, msg: MoveChildFromOtherContainmentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildFromOtherContainmentInSameParent = (socket: WebSocket, msg: MoveChildFromOtherContainmentInSameParentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveChildInSameContainment = (socket: WebSocket, msg: MoveChildInSameContainmentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveChildInSameContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainment = (socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainment " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildFromOtherContainmentInSameParent = (socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): DeltaEvent => {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentInSameParent " + msg.messageKind)
        return errorEvent(msg)
    }

const MoveAndReplaceChildInSameContainment = (socket: WebSocket, msg: MoveAndReplaceChildInSameContainmentCommand): DeltaEvent => {
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
