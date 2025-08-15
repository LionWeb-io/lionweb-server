import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { DeltaErrorCode } from "../DeltaErrors.js"
import { ProtocolMessage, LionWebJsonDeltaChunk, JS_string, JS_number } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-CommandSource
 */
export type CommandSourceEvent = {
    participationId: ParticipationId;
    commandId: CommandId;
};

export type SequenceNumber = number;

export type CommandId = string;

export type ParticipationId = string;

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ClassifierChanged
 */
export type ClassifierChangedEvent = {
    node: LionWebId;
    oldClassifier: LionWebJsonMetaPointer;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: "ClassifierChanged";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAddedEvent = {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: "PartitionAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeletedEvent = {
    deletedPartition: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: "PartitionDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyAdded
 */
export type PropertyAddedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    messageKind: "PropertyAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyDeleted
 */
export type PropertyDeletedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    oldValue: JS_string;
    messageKind: "PropertyDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyChanged
 */
export type PropertyChangedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    oldValue: JS_string;
    messageKind: "PropertyChanged";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAddedEvent = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeletedEvent = {
    parent: LionWebId;
    deletedChild: LionWebId;
    deletedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplacedEvent = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildReplaced";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainmentEvent = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: "ChildMovedFromOtherContainment";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParentEvent = {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: "ChildMovedFromOtherContainmentInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainmentEvent = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    messageKind: "ChildMovedInSameContainment";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainmentEvent = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "ChildMovedAndReplacedFromOtherContainment";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParentEvent = {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "ChildMovedAndReplacedFromOtherContainmentInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainmentEvent = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "ChildMovedAndReplacedInSameContainment";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAddedEvent = {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: JS_number;
    messageKind: "AnnotationAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeletedEvent = {
    parent: LionWebId;
    index: JS_number;
    deletedAnnotation: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: "AnnotationDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplacedEvent = {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    index: JS_number;
    messageKind: "AnnotationReplaced";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParentEvent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: "AnnotationMovedFromOtherParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParentEvent = {
    parent: LionWebId;
    oldIndex: JS_number;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: "AnnotationMovedInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParentEvent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: "AnnotationMovedAndReplacedFromOtherParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParentEvent = {
    parent: LionWebId;
    newIndex: JS_number;
    oldIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "AnnotationMovedAndReplacedInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAddedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "ReferenceAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeletedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: "ReferenceDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChangedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    oldTarget: LionWebId;
    oldResolveInfo: JS_string;
    messageKind: "ReferenceChanged";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReferenceEvent = {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedFromOtherReference";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParentEvent = {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedFromOtherReferenceInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReferenceEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedInSameReference";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReferenceEvent = {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: "EntryMovedAndReplacedFromOtherReference";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParentEvent = {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: "EntryMovedAndReplacedFromOtherReferenceInSameParent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReferenceEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    oldIndex: JS_number;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: "EntryMovedAndReplacedInSameReference";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAddedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeletedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChangedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    replacedResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoChanged";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAddedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetAdded";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeletedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetDeleted";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChangedEvent = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetChanged";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEventEvent = {
    parts: EventType[];
    messageKind: "CompositeEvent";
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-Error
 */
export type ErrorEvent = {
    errorCode: DeltaErrorCode;
    message: JS_string;
    messageKind: "ErrorEvent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-NoOpEvent
 */
export type NoOpEventEvent = {
    messageKind: "NoOpEvent";
    originCommands: CommandSourceEvent[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

export type EventType =
    | ClassifierChangedEvent
    | PartitionAddedEvent
    | PartitionDeletedEvent
    | PropertyAddedEvent
    | PropertyDeletedEvent
    | PropertyChangedEvent
    | ChildAddedEvent
    | ChildDeletedEvent
    | ChildReplacedEvent
    | ChildMovedFromOtherContainmentEvent
    | ChildMovedFromOtherContainmentInSameParentEvent
    | ChildMovedInSameContainmentEvent
    | ChildMovedAndReplacedFromOtherContainmentEvent
    | ChildMovedAndReplacedFromOtherContainmentInSameParentEvent
    | ChildMovedAndReplacedInSameContainmentEvent
    | AnnotationAddedEvent
    | AnnotationDeletedEvent
    | AnnotationReplacedEvent
    | AnnotationMovedFromOtherParentEvent
    | AnnotationMovedInSameParentEvent
    | AnnotationMovedAndReplacedFromOtherParentEvent
    | AnnotationMovedAndReplacedInSameParentEvent
    | ReferenceAddedEvent
    | ReferenceDeletedEvent
    | ReferenceChangedEvent
    | EntryMovedFromOtherReferenceEvent
    | EntryMovedFromOtherReferenceInSameParentEvent
    | EntryMovedInSameReferenceEvent
    | EntryMovedAndReplacedFromOtherReferenceEvent
    | EntryMovedAndReplacedFromOtherReferenceInSameParentEvent
    | EntryMovedAndReplacedInSameReferenceEvent
    | ReferenceResolveInfoAddedEvent
    | ReferenceResolveInfoDeletedEvent
    | ReferenceResolveInfoChangedEvent
    | ReferenceTargetAddedEvent
    | ReferenceTargetDeletedEvent
    | ReferenceTargetChangedEvent
    | CompositeEventEvent
    | ErrorEvent
    | NoOpEventEvent;
