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
    NoOpEvent,
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
    ClassifierChangedFunction(socket: WebSocket, msg: ClassifierChangedEvent): void

    PartitionAddedFunction(socket: WebSocket, msg: PartitionAddedEvent): void

    PartitionDeletedFunction(socket: WebSocket, msg: PartitionDeletedEvent): void

    PropertyAddedFunction(socket: WebSocket, msg: PropertyAddedEvent): void

    PropertyDeletedFunction(socket: WebSocket, msg: PropertyDeletedEvent): void

    PropertyChangedFunction(socket: WebSocket, msg: PropertyChangedEvent): void

    ChildAddedFunction(socket: WebSocket, msg: ChildAddedEvent): void

    ChildDeletedFunction(socket: WebSocket, msg: ChildDeletedEvent): void

    ChildReplacedFunction(socket: WebSocket, msg: ChildReplacedEvent): void

    ChildMovedFromOtherContainmentFunction(socket: WebSocket, msg: ChildMovedFromOtherContainmentEvent): void

    ChildMovedFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: ChildMovedFromOtherContainmentInSameParentEvent): void

    ChildMovedInSameContainmentFunction(socket: WebSocket, msg: ChildMovedInSameContainmentEvent): void

    ChildMovedAndReplacedFromOtherContainmentFunction(socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentEvent): void

    ChildMovedAndReplacedFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void

    ChildMovedAndReplacedInSameContainmentFunction(socket: WebSocket, msg: ChildMovedAndReplacedInSameContainmentEvent): void

    AnnotationAddedFunction(socket: WebSocket, msg: AnnotationAddedEvent): void

    AnnotationDeletedFunction(socket: WebSocket, msg: AnnotationDeletedEvent): void

    AnnotationReplacedFunction(socket: WebSocket, msg: AnnotationReplacedEvent): void

    AnnotationMovedFromOtherParentFunction(socket: WebSocket, msg: AnnotationMovedFromOtherParentEvent): void

    AnnotationMovedInSameParentFunction(socket: WebSocket, msg: AnnotationMovedInSameParentEvent): void

    AnnotationMovedAndReplacedFromOtherParentFunction(socket: WebSocket, msg: AnnotationMovedAndReplacedFromOtherParentEvent): void

    AnnotationMovedAndReplacedInSameParentFunction(socket: WebSocket, msg: AnnotationMovedAndReplacedInSameParentEvent): void

    ReferenceAddedFunction(socket: WebSocket, msg: ReferenceAddedEvent): void

    ReferenceDeletedFunction(socket: WebSocket, msg: ReferenceDeletedEvent): void

    ReferenceChangedFunction(socket: WebSocket, msg: ReferenceChangedEvent): void

    EntryMovedFromOtherReferenceFunction(socket: WebSocket, msg: EntryMovedFromOtherReferenceEvent): void

    EntryMovedFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: EntryMovedFromOtherReferenceInSameParentEvent): void

    EntryMovedInSameReferenceFunction(socket: WebSocket, msg: EntryMovedInSameReferenceEvent): void

    EntryMovedAndReplacedFromOtherReferenceFunction(socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceEvent): void

    EntryMovedAndReplacedFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void

    EntryMovedAndReplacedInSameReferenceFunction(socket: WebSocket, msg: EntryMovedAndReplacedInSameReferenceEvent): void

    ReferenceResolveInfoAddedFunction(socket: WebSocket, msg: ReferenceResolveInfoAddedEvent): void

    ReferenceResolveInfoDeletedFunction(socket: WebSocket, msg: ReferenceResolveInfoDeletedEvent): void

    ReferenceResolveInfoChangedFunction(socket: WebSocket, msg: ReferenceResolveInfoChangedEvent): void

    ReferenceTargetAddedFunction(socket: WebSocket, msg: ReferenceTargetAddedEvent): void

    ReferenceTargetDeletedFunction(socket: WebSocket, msg: ReferenceTargetDeletedEvent): void

    ReferenceTargetChangedFunction(socket: WebSocket, msg: ReferenceTargetChangedEvent): void

    ErrorFunction(socket: WebSocket, msg: ErrorEvent): void

    NoOpEventFunction(socket: WebSocket, msg: NoOpEvent): void
}
