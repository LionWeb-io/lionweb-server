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
    EntryMovedInSameReferenceEvent, ErrorEvent,
    EventType, GetAvailableIdsResponse, ListPartitionsQueryResponse, NoOpEventEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent, ReconnectResponse,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent,
    ReferenceResolveInfoAddedEvent,
    ReferenceResolveInfoChangedEvent,
    ReferenceResolveInfoDeletedEvent,
    ReferenceTargetAddedEvent, ReferenceTargetChangedEvent,
    ReferenceTargetDeletedEvent, SignOffResponse, SignOnResponse
} from "@lionweb/server-delta-shared";

export function ClassifierChangedFunction(msg: ClassifierChangedEvent): void {
    console.log("Called ClassifierChangedFunction " + msg.messageKind);
}

export function PartitionAddedFunction(msg: PartitionAddedEvent): void {
    console.log("Called PartitionAddedFunction " + msg.messageKind);
}

export function PartitionDeletedFunction(msg: PartitionDeletedEvent): void {
    console.log("Called PartitionDeletedFunction " + msg.messageKind);
}

export function PropertyAddedFunction(msg: PropertyAddedEvent): void {
    console.log("Called PropertyAddedFunction " + msg.messageKind);
}

export function PropertyDeletedFunction(msg: PropertyDeletedEvent): void {
    console.log("Called PropertyDeletedFunction " + msg.messageKind);
}

export function PropertyChangedFunction(msg: PropertyChangedEvent): void {
    console.log("Called PropertyChangedFunction " + msg.messageKind);
}

export function ChildAddedFunction(msg: ChildAddedEvent): void {
    console.log("Called ChildAddedFunction " + msg.messageKind);
}

export function ChildDeletedFunction(msg: ChildDeletedEvent): void {
    console.log("Called ChildDeletedFunction " + msg.messageKind);
}

export function ChildReplacedFunction(msg: ChildReplacedEvent): void {
    console.log("Called ChildReplacedFunction " + msg.messageKind);
}

export function ChildMovedFromOtherContainmentFunction(msg: ChildMovedFromOtherContainmentEvent): void {
    console.log("Called ChildMovedFromOtherContainmentFunction " + msg.messageKind);
}

export function ChildMovedFromOtherContainmentInSameParentFunction(msg: ChildMovedFromOtherContainmentInSameParentEvent): void {
    console.log("Called ChildMovedFromOtherContainmentInSameParentFunction " + msg.messageKind);
}

export function ChildMovedInSameContainmentFunction(msg: ChildMovedInSameContainmentEvent): void {
    console.log("Called ChildMovedInSameContainmentFunction " + msg.messageKind);
}

export function ChildMovedAndReplacedFromOtherContainmentFunction(msg: ChildMovedAndReplacedFromOtherContainmentEvent): void {
    console.log("Called ChildMovedAndReplacedFromOtherContainmentFunction " + msg.messageKind);
}

export function ChildMovedAndReplacedFromOtherContainmentInSameParentFunction(msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void {
    console.log("Called ChildMovedAndReplacedFromOtherContainmentInSameParentFunction " + msg.messageKind);
}

export function ChildMovedAndReplacedInSameContainmentFunction(msg: ChildMovedAndReplacedInSameContainmentEvent): void {
    console.log("Called ChildMovedAndReplacedInSameContainmentFunction " + msg.messageKind);
}

export function AnnotationAddedFunction(msg: AnnotationAddedEvent): void {
    console.log("Called AnnotationAddedFunction " + msg.messageKind);
}

export function AnnotationDeletedFunction(msg: AnnotationDeletedEvent): void {
    console.log("Called AnnotationDeletedFunction " + msg.messageKind);
}

export function AnnotationReplacedFunction(msg: AnnotationReplacedEvent): void {
    console.log("Called AnnotationReplacedFunction " + msg.messageKind);
}

export function AnnotationMovedFromOtherParentFunction(msg: AnnotationMovedFromOtherParentEvent): void {
    console.log("Called AnnotationMovedFromOtherParentFunction " + msg.messageKind);
}

export function AnnotationMovedInSameParentFunction(msg: AnnotationMovedInSameParentEvent): void {
    console.log("Called AnnotationMovedInSameParentFunction " + msg.messageKind);
}

export function AnnotationMovedAndReplacedFromOtherParentFunction(msg: AnnotationMovedAndReplacedFromOtherParentEvent): void {
    console.log("Called AnnotationMovedAndReplacedFromOtherParentFunction " + msg.messageKind);
}

export function AnnotationMovedAndReplacedInSameParentFunction(msg: AnnotationMovedAndReplacedInSameParentEvent): void {
    console.log("Called AnnotationMovedAndReplacedInSameParentFunction " + msg.messageKind);
}

export function ReferenceAddedFunction(msg: ReferenceAddedEvent): void {
    console.log("Called ReferenceAddedFunction " + msg.messageKind);
}

export function ReferenceDeletedFunction(msg: ReferenceDeletedEvent): void {
    console.log("Called ReferenceDeletedFunction " + msg.messageKind);
}

export function ReferenceChangedFunction(msg: ReferenceChangedEvent): void {
    console.log("Called ReferenceChangedFunction " + msg.messageKind);
}

export function EntryMovedFromOtherReferenceFunction(msg: EntryMovedFromOtherReferenceEvent): void {
    console.log("Called EntryMovedFromOtherReferenceFunction " + msg.messageKind);
}

export function EntryMovedFromOtherReferenceInSameParentFunction(msg: EntryMovedFromOtherReferenceInSameParentEvent): void {
    console.log("Called EntryMovedFromOtherReferenceInSameParentFunction " + msg.messageKind);
}

export function EntryMovedInSameReferenceFunction(msg: EntryMovedInSameReferenceEvent): void {
    console.log("Called EntryMovedInSameReferenceFunction " + msg.messageKind);
}

export function EntryMovedAndReplacedFromOtherReferenceFunction(msg: EntryMovedAndReplacedFromOtherReferenceEvent): void {
    console.log("Called EntryMovedAndReplacedFromOtherReferenceFunction " + msg.messageKind);
}

export function EntryMovedAndReplacedFromOtherReferenceInSameParentFunction(msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void {
    console.log("Called EntryMovedAndReplacedFromOtherReferenceInSameParentFunction " + msg.messageKind);
}

export function EntryMovedAndReplacedInSameReferenceFunction(msg: EntryMovedAndReplacedInSameReferenceEvent): void {
    console.log("Called EntryMovedAndReplacedInSameReferenceFunction " + msg.messageKind);
}

export function ReferenceResolveInfoAddedFunction(msg: ReferenceResolveInfoAddedEvent): void {
    console.log("Called ReferenceResolveInfoAddedFunction " + msg.messageKind);
}

export function ReferenceResolveInfoDeletedFunction(msg: ReferenceResolveInfoDeletedEvent): void {
    console.log("Called ReferenceResolveInfoDeletedFunction " + msg.messageKind);
}

export function ReferenceResolveInfoChangedFunction(msg: ReferenceResolveInfoChangedEvent): void {
    console.log("Called ReferenceResolveInfoChangedFunction " + msg.messageKind);
}

export function ReferenceTargetAddedFunction(msg: ReferenceTargetAddedEvent): void {
    console.log("Called ReferenceTargetAddedFunction " + msg.messageKind);
}

export function ReferenceTargetDeletedFunction(msg: ReferenceTargetDeletedEvent): void {
    console.log("Called ReferenceTargetDeletedFunction " + msg.messageKind);
}

export function ReferenceTargetChangedFunction(msg: ReferenceTargetChangedEvent): void {
    console.log("Called ReferenceTargetChangedFunction " + msg.messageKind);
}

export function ErrorFunction(msg: ErrorEvent): void {
    console.log("Called ErrorFunction " + msg.messageKind);
}

export function NoOpEventFunction(msg: NoOpEventEvent): void {
    console.log("Called NoOpEventFunction " + msg.messageKind);
}

