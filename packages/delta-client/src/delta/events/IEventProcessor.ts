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

export interface IEventProcessor {
    ClassifierChangedFunction(msg: ClassifierChangedEvent): void

    PartitionAddedFunction(msg: PartitionAddedEvent): void

    PartitionDeletedFunction(msg: PartitionDeletedEvent): void

    PropertyAddedFunction(msg: PropertyAddedEvent): void

    PropertyDeletedFunction(msg: PropertyDeletedEvent): void

    PropertyChangedFunction(msg: PropertyChangedEvent): void

    ChildAddedFunction(msg: ChildAddedEvent): void

    ChildDeletedFunction(msg: ChildDeletedEvent): void

    ChildReplacedFunction(msg: ChildReplacedEvent): void

    ChildMovedFromOtherContainmentFunction(msg: ChildMovedFromOtherContainmentEvent): void

    ChildMovedFromOtherContainmentInSameParentFunction(msg: ChildMovedFromOtherContainmentInSameParentEvent): void

    ChildMovedInSameContainmentFunction(msg: ChildMovedInSameContainmentEvent): void

    ChildMovedAndReplacedFromOtherContainmentFunction(msg: ChildMovedAndReplacedFromOtherContainmentEvent): void

    ChildMovedAndReplacedFromOtherContainmentInSameParentFunction(msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void

    ChildMovedAndReplacedInSameContainmentFunction(msg: ChildMovedAndReplacedInSameContainmentEvent): void

    AnnotationAddedFunction(msg: AnnotationAddedEvent): void

    AnnotationDeletedFunction(msg: AnnotationDeletedEvent): void

    AnnotationReplacedFunction(msg: AnnotationReplacedEvent): void

    AnnotationMovedFromOtherParentFunction(msg: AnnotationMovedFromOtherParentEvent): void

    AnnotationMovedInSameParentFunction(msg: AnnotationMovedInSameParentEvent): void

    AnnotationMovedAndReplacedFromOtherParentFunction(msg: AnnotationMovedAndReplacedFromOtherParentEvent): void

    AnnotationMovedAndReplacedInSameParentFunction(msg: AnnotationMovedAndReplacedInSameParentEvent): void

    ReferenceAddedFunction(msg: ReferenceAddedEvent): void

    ReferenceDeletedFunction(msg: ReferenceDeletedEvent): void

    ReferenceChangedFunction(msg: ReferenceChangedEvent): void

    EntryMovedFromOtherReferenceFunction(msg: EntryMovedFromOtherReferenceEvent): void

    EntryMovedFromOtherReferenceInSameParentFunction(msg: EntryMovedFromOtherReferenceInSameParentEvent): void

    EntryMovedInSameReferenceFunction(msg: EntryMovedInSameReferenceEvent): void

    EntryMovedAndReplacedFromOtherReferenceFunction(msg: EntryMovedAndReplacedFromOtherReferenceEvent): void

    EntryMovedAndReplacedFromOtherReferenceInSameParentFunction(msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void

    EntryMovedAndReplacedInSameReferenceFunction(msg: EntryMovedAndReplacedInSameReferenceEvent): void

    ReferenceResolveInfoAddedFunction(msg: ReferenceResolveInfoAddedEvent): void

    ReferenceResolveInfoDeletedFunction(msg: ReferenceResolveInfoDeletedEvent): void

    ReferenceResolveInfoChangedFunction(msg: ReferenceResolveInfoChangedEvent): void

    ReferenceTargetAddedFunction(msg: ReferenceTargetAddedEvent): void

    ReferenceTargetDeletedFunction(msg: ReferenceTargetDeletedEvent): void

    ReferenceTargetChangedFunction(msg: ReferenceTargetChangedEvent): void

    ErrorFunction(msg: ErrorEvent): void

    NoOpEventFunction(msg: NoOpEventEvent): void
}
