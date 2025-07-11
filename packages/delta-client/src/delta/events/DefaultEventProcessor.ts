import WebSocket from 'ws';
import {
    AnnotationAddedEvent,
    AnnotationDeletedEvent,
    AnnotationMovedAndReplacedFromOtherParentEvent,
    AnnotationMovedAndReplacedInSameParentEvent,
    AnnotationMovedFromOtherParentEvent,
    AnnotationMovedInSameParentEvent,
    AnnotationReplacedEvent,
    ChildAddedEvent,
    ChildDeletedEvent,
    ChildMovedAndReplacedFromOtherContainmentEvent,
    ChildMovedAndReplacedFromOtherContainmentInSameParentEvent,
    ChildMovedAndReplacedInSameContainmentEvent,
    ChildMovedFromOtherContainmentEvent,
    ChildMovedFromOtherContainmentInSameParentEvent,
    ChildMovedInSameContainmentEvent,
    ChildReplacedEvent,
    ClassifierChangedEvent,
    EntryMovedAndReplacedFromOtherReferenceEvent,
    EntryMovedAndReplacedFromOtherReferenceInSameParentEvent,
    EntryMovedAndReplacedInSameReferenceEvent,
    EntryMovedFromOtherReferenceEvent,
    EntryMovedFromOtherReferenceInSameParentEvent,
    EntryMovedInSameReferenceEvent,
    ErrorEvent,
    NoOpEventEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent,
    ReferenceResolveInfoAddedEvent,
    ReferenceResolveInfoChangedEvent,
    ReferenceResolveInfoDeletedEvent,
    ReferenceTargetAddedEvent,
    ReferenceTargetChangedEvent,
    ReferenceTargetDeletedEvent
} from "@lionweb/server-delta-shared"
import { IEventProcessor } from "./IEventProcessor.js"

export class DefaultEventProcessor implements IEventProcessor {
    ClassifierChangedFunction(socket: WebSocket, msg: ClassifierChangedEvent): void {
        console.log("Called ClassifierChangedFunction " + msg.messageKind)
    }

    PartitionAddedFunction(socket: WebSocket, msg: PartitionAddedEvent): void {
        console.log("Called PartitionAddedFunction " + msg.messageKind)
    }

    PartitionDeletedFunction(socket: WebSocket, msg: PartitionDeletedEvent): void {
        console.log("Called PartitionDeletedFunction " + msg.messageKind)
    }

    PropertyAddedFunction(socket: WebSocket, msg: PropertyAddedEvent): void {
        console.log("Called PropertyAddedFunction " + msg.messageKind)
    }

    PropertyDeletedFunction(socket: WebSocket, msg: PropertyDeletedEvent): void {
        console.log("Called PropertyDeletedFunction " + msg.messageKind)
    }

    PropertyChangedFunction(socket: WebSocket, msg: PropertyChangedEvent): void {
        console.log("Called PropertyChangedFunction " + msg.messageKind)
    }

    ChildAddedFunction(socket: WebSocket, msg: ChildAddedEvent): void {
        console.log("Called ChildAddedFunction " + msg.messageKind)
    }

    ChildDeletedFunction(socket: WebSocket, msg: ChildDeletedEvent): void {
        console.log("Called ChildDeletedFunction " + msg.messageKind)
    }

    ChildReplacedFunction(socket: WebSocket, msg: ChildReplacedEvent): void {
        console.log("Called ChildReplacedFunction " + msg.messageKind)
    }

    ChildMovedFromOtherContainmentFunction(socket: WebSocket, msg: ChildMovedFromOtherContainmentEvent): void {
        console.log("Called ChildMovedFromOtherContainmentFunction " + msg.messageKind)
    }

    ChildMovedFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: ChildMovedFromOtherContainmentInSameParentEvent): void {
        console.log("Called ChildMovedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    ChildMovedInSameContainmentFunction(socket: WebSocket, msg: ChildMovedInSameContainmentEvent): void {
        console.log("Called ChildMovedInSameContainmentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedFromOtherContainmentFunction(socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentEvent): void {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedInSameContainmentFunction(socket: WebSocket, msg: ChildMovedAndReplacedInSameContainmentEvent): void {
        console.log("Called ChildMovedAndReplacedInSameContainmentFunction " + msg.messageKind)
    }

    AnnotationAddedFunction(socket: WebSocket, msg: AnnotationAddedEvent): void {
        console.log("Called AnnotationAddedFunction " + msg.messageKind)
    }

    AnnotationDeletedFunction(socket: WebSocket, msg: AnnotationDeletedEvent): void {
        console.log("Called AnnotationDeletedFunction " + msg.messageKind)
    }

    AnnotationReplacedFunction(socket: WebSocket, msg: AnnotationReplacedEvent): void {
        console.log("Called AnnotationReplacedFunction " + msg.messageKind)
    }

    AnnotationMovedFromOtherParentFunction(socket: WebSocket, msg: AnnotationMovedFromOtherParentEvent): void {
        console.log("Called AnnotationMovedFromOtherParentFunction " + msg.messageKind)
    }

    AnnotationMovedInSameParentFunction(socket: WebSocket, msg: AnnotationMovedInSameParentEvent): void {
        console.log("Called AnnotationMovedInSameParentFunction " + msg.messageKind)
    }

    AnnotationMovedAndReplacedFromOtherParentFunction(socket: WebSocket, msg: AnnotationMovedAndReplacedFromOtherParentEvent): void {
        console.log("Called AnnotationMovedAndReplacedFromOtherParentFunction " + msg.messageKind)
    }

    AnnotationMovedAndReplacedInSameParentFunction(socket: WebSocket, msg: AnnotationMovedAndReplacedInSameParentEvent): void {
        console.log("Called AnnotationMovedAndReplacedInSameParentFunction " + msg.messageKind)
    }

    ReferenceAddedFunction(socket: WebSocket, msg: ReferenceAddedEvent): void {
        console.log("Called ReferenceAddedFunction " + msg.messageKind)
    }

    ReferenceDeletedFunction(socket: WebSocket, msg: ReferenceDeletedEvent): void {
        console.log("Called ReferenceDeletedFunction " + msg.messageKind)
    }

    ReferenceChangedFunction(socket: WebSocket, msg: ReferenceChangedEvent): void {
        console.log("Called ReferenceChangedFunction " + msg.messageKind)
    }

    EntryMovedFromOtherReferenceFunction(socket: WebSocket, msg: EntryMovedFromOtherReferenceEvent): void {
        console.log("Called EntryMovedFromOtherReferenceFunction " + msg.messageKind)
    }

    EntryMovedFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: EntryMovedFromOtherReferenceInSameParentEvent): void {
        console.log("Called EntryMovedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    EntryMovedInSameReferenceFunction(socket: WebSocket, msg: EntryMovedInSameReferenceEvent): void {
        console.log("Called EntryMovedInSameReferenceFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedFromOtherReferenceFunction(socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceEvent): void {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedInSameReferenceFunction(socket: WebSocket, msg: EntryMovedAndReplacedInSameReferenceEvent): void {
        console.log("Called EntryMovedAndReplacedInSameReferenceFunction " + msg.messageKind)
    }

    ReferenceResolveInfoAddedFunction(socket: WebSocket, msg: ReferenceResolveInfoAddedEvent): void {
        console.log("Called ReferenceResolveInfoAddedFunction " + msg.messageKind)
    }

    ReferenceResolveInfoDeletedFunction(socket: WebSocket, msg: ReferenceResolveInfoDeletedEvent): void {
        console.log("Called ReferenceResolveInfoDeletedFunction " + msg.messageKind)
    }

    ReferenceResolveInfoChangedFunction(socket: WebSocket, msg: ReferenceResolveInfoChangedEvent): void {
        console.log("Called ReferenceResolveInfoChangedFunction " + msg.messageKind)
    }

    ReferenceTargetAddedFunction(socket: WebSocket, msg: ReferenceTargetAddedEvent): void {
        console.log("Called ReferenceTargetAddedFunction " + msg.messageKind)
    }

    ReferenceTargetDeletedFunction(socket: WebSocket, msg: ReferenceTargetDeletedEvent): void {
        console.log("Called ReferenceTargetDeletedFunction " + msg.messageKind)
    }

    ReferenceTargetChangedFunction(socket: WebSocket, msg: ReferenceTargetChangedEvent): void {
        console.log("Called ReferenceTargetChangedFunction " + msg.messageKind)
    }

    ErrorFunction(socket: WebSocket, msg: ErrorEvent): void {
        console.log("Called ErrorFunction " + msg.messageKind)
    }

    NoOpEventFunction(socket: WebSocket, msg: NoOpEventEvent): void {
        console.log("Called NoOpEventFunction " + msg.messageKind)
    }
}
