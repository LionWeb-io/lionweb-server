import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, JS_number, JS_string } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-CommandSource
 */
export type CommandSource = {
    participationId: ParticipationId;
    commandId: CommandId;
};

export type SequenceNumber = number;

export type CommandId = string;

export type ParticipationId = string;

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ClassifierChanged
 */
export type ClassifierChanged = {
    node: LionWebId;
    oldClassifier: LionWebJsonMetaPointer;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: "ClassifierChanged";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAdded = {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: "PartitionAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeleted = {
    deletedPartition: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: "PartitionDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyAdded
 */
export type PropertyAdded = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    messageKind: "PropertyAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyDeleted
 */
export type PropertyDeleted = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    oldValue: JS_string;
    messageKind: "PropertyDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyChanged
 */
export type PropertyChanged = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    oldValue: JS_string;
    messageKind: "PropertyChanged";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAdded = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeleted = {
    parent: LionWebId;
    deletedChild: LionWebId;
    deletedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplaced = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "ChildReplaced";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainment = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: "ChildMovedFromOtherContainment";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParent = {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: "ChildMovedFromOtherContainmentInSameParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainment = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    messageKind: "ChildMovedInSameContainment";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainment = {
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
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParent = {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "ChildMovedAndReplacedFromOtherContainmentInSameParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainment = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "ChildMovedAndReplacedInSameContainment";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAdded = {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: JS_number;
    messageKind: "AnnotationAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeleted = {
    parent: LionWebId;
    index: JS_number;
    deletedAnnotation: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: "AnnotationDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplaced = {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    index: JS_number;
    messageKind: "AnnotationReplaced";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: "AnnotationMovedFromOtherParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParent = {
    parent: LionWebId;
    oldIndex: JS_number;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: "AnnotationMovedInSameParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: "AnnotationMovedAndReplacedFromOtherParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParent = {
    parent: LionWebId;
    newIndex: JS_number;
    oldIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: "AnnotationMovedAndReplacedInSameParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAdded = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "ReferenceAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeleted = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: "ReferenceDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChanged = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    oldTarget: LionWebId;
    oldResolveInfo: JS_string;
    messageKind: "ReferenceChanged";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReference = {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedFromOtherReference";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParent = {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedFromOtherReferenceInSameParent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: "EntryMovedInSameReference";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReference = {
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
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParent = {
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
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    oldIndex: JS_number;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: "EntryMovedAndReplacedInSameReference";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAdded = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeleted = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChanged = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    replacedResolveInfo: JS_string;
    messageKind: "ReferenceResolveInfoChanged";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAdded = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetAdded";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeleted = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetDeleted";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChanged = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: "ReferenceTargetChanged";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEvent = {
    parts: EventType[];
    messageKind: "CompositeEvent";
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-Error
 */
export type Error = {
    errorCode: JS_string;
    message: JS_string;
    messageKind: "Error";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-NoOpEvent
 */
export type NoOpEvent = {
    messageKind: "NoOpEvent";
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

export type EventType =
    | ClassifierChanged
    | PartitionAdded
    | PartitionDeleted
    | PropertyAdded
    | PropertyDeleted
    | PropertyChanged
    | ChildAdded
    | ChildDeleted
    | ChildReplaced
    | ChildMovedFromOtherContainment
    | ChildMovedFromOtherContainmentInSameParent
    | ChildMovedInSameContainment
    | ChildMovedAndReplacedFromOtherContainment
    | ChildMovedAndReplacedFromOtherContainmentInSameParent
    | ChildMovedAndReplacedInSameContainment
    | AnnotationAdded
    | AnnotationDeleted
    | AnnotationReplaced
    | AnnotationMovedFromOtherParent
    | AnnotationMovedInSameParent
    | AnnotationMovedAndReplacedFromOtherParent
    | AnnotationMovedAndReplacedInSameParent
    | ReferenceAdded
    | ReferenceDeleted
    | ReferenceChanged
    | EntryMovedFromOtherReference
    | EntryMovedFromOtherReferenceInSameParent
    | EntryMovedInSameReference
    | EntryMovedAndReplacedFromOtherReference
    | EntryMovedAndReplacedFromOtherReferenceInSameParent
    | EntryMovedAndReplacedInSameReference
    | ReferenceResolveInfoAdded
    | ReferenceResolveInfoDeleted
    | ReferenceResolveInfoChanged
    | ReferenceTargetAdded
    | ReferenceTargetDeleted
    | ReferenceTargetChanged
    | CompositeEvent
    | Error
    | NoOpEvent;
