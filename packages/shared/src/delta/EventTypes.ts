import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, JS_string, JS_number } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CommandSource
 */
export type CommandSource = {
    participationId: ParticipationId;
    commandId: CommandId;
};

export type SequenceNumber = number;

export type CommandId = string;

export type ParticipationId = string;

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ClassifierChanged
 */
export type ClassifierChanged = IEvent & {
    node: LionWebId;
    oldClassifier: LionWebJsonMetaPointer;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAdded = IEvent & {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeleted = IEvent & {
    deletedPartition: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyAdded
 */
export type PropertyAdded = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyDeleted
 */
export type PropertyDeleted = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    oldValue: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyChanged
 */
export type PropertyChanged = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    oldValue: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAdded = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeleted = IEvent & {
    parent: LionWebId;
    deletedChild: LionWebId;
    deletedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplaced = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    oldIndex: JS_number;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAdded = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeleted = IEvent & {
    parent: LionWebId;
    index: JS_number;
    deletedAnnotation: LionWebId;
    deletedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplaced = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    index: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParent = IEvent & {
    parent: LionWebId;
    oldIndex: JS_number;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    oldParent: LionWebId;
    oldIndex: JS_number;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParent = IEvent & {
    parent: LionWebId;
    newIndex: JS_number;
    oldIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    oldTarget: LionWebId;
    oldResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReference = IEvent & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldIndex: JS_number;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReference = IEvent & {
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
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    oldIndex: JS_number;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-IEvent
 */
export type IEvent = {
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEvent = {
    parts: IEvent[];
    messageKind: EventKind;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-Error
 */
export type Error = IEvent & {
    errorCode: JS_string;
    message: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-NoOpEvent
 */
export type NoOpEvent = {
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessages?: ProtocolMessage[];
};

export type EventKind = string;
