// @ts-nocheck
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
    ClassifierChangedFunction(msg: ClassifierChangedEvent): void {
        console.log("Called ClassifierChangedFunction " + msg.messageKind)
    }

    PartitionAddedFunction(msg: PartitionAddedEvent): void {
        console.log("Called PartitionAddedFunction " + msg.messageKind)
    }

    PartitionDeletedFunction(msg: PartitionDeletedEvent): void {
        console.log("Called PartitionDeletedFunction " + msg.messageKind)
    }

    PropertyAddedFunction(msg: PropertyAddedEvent): void {
        console.log("Called PropertyAddedFunction " + msg.messageKind)
    }

    PropertyDeletedFunction(msg: PropertyDeletedEvent): void {
        console.log("Called PropertyDeletedFunction " + msg.messageKind)
    }

    PropertyChangedFunction(msg: PropertyChangedEvent): void {
        console.log("Called PropertyChangedFunction " + msg.messageKind)
    }

    ChildAddedFunction(msg: ChildAddedEvent): void {
        console.log("Called ChildAddedFunction " + msg.messageKind)
    }

    ChildDeletedFunction(msg: ChildDeletedEvent): void {
        console.log("Called ChildDeletedFunction " + msg.messageKind)
    }

    ChildReplacedFunction(msg: ChildReplacedEvent): void {
        console.log("Called ChildReplacedFunction " + msg.messageKind)
    }

    ChildMovedFromOtherContainmentFunction(msg: ChildMovedFromOtherContainmentEvent): void {
        console.log("Called ChildMovedFromOtherContainmentFunction " + msg.messageKind)
    }

    ChildMovedFromOtherContainmentInSameParentFunction(msg: ChildMovedFromOtherContainmentInSameParentEvent): void {
        console.log("Called ChildMovedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    ChildMovedInSameContainmentFunction(msg: ChildMovedInSameContainmentEvent): void {
        console.log("Called ChildMovedInSameContainmentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedFromOtherContainmentFunction(msg: ChildMovedAndReplacedFromOtherContainmentEvent): void {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedFromOtherContainmentInSameParentFunction(msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    ChildMovedAndReplacedInSameContainmentFunction(msg: ChildMovedAndReplacedInSameContainmentEvent): void {
        console.log("Called ChildMovedAndReplacedInSameContainmentFunction " + msg.messageKind)
    }

    AnnotationAddedFunction(msg: AnnotationAddedEvent): void {
        console.log("Called AnnotationAddedFunction " + msg.messageKind)
    }

    AnnotationDeletedFunction(msg: AnnotationDeletedEvent): void {
        console.log("Called AnnotationDeletedFunction " + msg.messageKind)
    }

    AnnotationReplacedFunction(msg: AnnotationReplacedEvent): void {
        console.log("Called AnnotationReplacedFunction " + msg.messageKind)
    }

    AnnotationMovedFromOtherParentFunction(msg: AnnotationMovedFromOtherParentEvent): void {
        console.log("Called AnnotationMovedFromOtherParentFunction " + msg.messageKind)
    }

    AnnotationMovedInSameParentFunction(msg: AnnotationMovedInSameParentEvent): void {
        console.log("Called AnnotationMovedInSameParentFunction " + msg.messageKind)
    }

    AnnotationMovedAndReplacedFromOtherParentFunction(msg: AnnotationMovedAndReplacedFromOtherParentEvent): void {
        console.log("Called AnnotationMovedAndReplacedFromOtherParentFunction " + msg.messageKind)
    }

    AnnotationMovedAndReplacedInSameParentFunction(msg: AnnotationMovedAndReplacedInSameParentEvent): void {
        console.log("Called AnnotationMovedAndReplacedInSameParentFunction " + msg.messageKind)
    }

    ReferenceAddedFunction(msg: ReferenceAddedEvent): void {
        console.log("Called ReferenceAddedFunction " + msg.messageKind)
    }

    ReferenceDeletedFunction(msg: ReferenceDeletedEvent): void {
        console.log("Called ReferenceDeletedFunction " + msg.messageKind)
    }

    ReferenceChangedFunction(msg: ReferenceChangedEvent): void {
        console.log("Called ReferenceChangedFunction " + msg.messageKind)
    }

    EntryMovedFromOtherReferenceFunction(msg: EntryMovedFromOtherReferenceEvent): void {
        console.log("Called EntryMovedFromOtherReferenceFunction " + msg.messageKind)
    }

    EntryMovedFromOtherReferenceInSameParentFunction(msg: EntryMovedFromOtherReferenceInSameParentEvent): void {
        console.log("Called EntryMovedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    EntryMovedInSameReferenceFunction(msg: EntryMovedInSameReferenceEvent): void {
        console.log("Called EntryMovedInSameReferenceFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedFromOtherReferenceFunction(msg: EntryMovedAndReplacedFromOtherReferenceEvent): void {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedFromOtherReferenceInSameParentFunction(msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    EntryMovedAndReplacedInSameReferenceFunction(msg: EntryMovedAndReplacedInSameReferenceEvent): void {
        console.log("Called EntryMovedAndReplacedInSameReferenceFunction " + msg.messageKind)
    }

    ReferenceResolveInfoAddedFunction(msg: ReferenceResolveInfoAddedEvent): void {
        console.log("Called ReferenceResolveInfoAddedFunction " + msg.messageKind)
    }

    ReferenceResolveInfoDeletedFunction(msg: ReferenceResolveInfoDeletedEvent): void {
        console.log("Called ReferenceResolveInfoDeletedFunction " + msg.messageKind)
    }

    ReferenceResolveInfoChangedFunction(msg: ReferenceResolveInfoChangedEvent): void {
        console.log("Called ReferenceResolveInfoChangedFunction " + msg.messageKind)
    }

    ReferenceTargetAddedFunction(msg: ReferenceTargetAddedEvent): void {
        console.log("Called ReferenceTargetAddedFunction " + msg.messageKind)
    }

    ReferenceTargetDeletedFunction(msg: ReferenceTargetDeletedEvent): void {
        console.log("Called ReferenceTargetDeletedFunction " + msg.messageKind)
    }

    ReferenceTargetChangedFunction(msg: ReferenceTargetChangedEvent): void {
        console.log("Called ReferenceTargetChangedFunction " + msg.messageKind)
    }

    ErrorFunction(msg: ErrorEvent): void {
        console.log("Called ErrorFunction " + msg.messageKind)
    }

    NoOpEventFunction(msg: NoOpEventEvent): void {
        console.log("Called NoOpEventFunction " + msg.messageKind)
    }
}
