import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, numberString, JS_string } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CommandSource
 */
export type CommandSource = {
    participationId: ParticipationId;
    commandId: CommandId;
};

export type SequenceNumber = string;

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
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAdded = IEvent & {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeleted = IEvent & {
    deletedPartition: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
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
    protocolMessage?: ProtocolMessage;
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
    protocolMessage?: ProtocolMessage;
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
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAdded = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeleted = IEvent & {
    parent: LionWebId;
    deletedChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplaced = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    replacedChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldIndex: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: numberString;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: numberString;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    oldIndex: numberString;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAdded = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeleted = IEvent & {
    parent: LionWebId;
    index: numberString;
    deletedAnnotation: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplaced = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    replacedAnnotation: LionWebJsonDeltaChunk;
    index: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: numberString;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParent = IEvent & {
    parent: LionWebId;
    oldIndex: numberString;
    newIndex: numberString;
    movedAnnotation: LionWebId;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: numberString;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebJsonDeltaChunk;
    oldParent: LionWebId;
    oldIndex: numberString;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParent = IEvent & {
    parent: LionWebId;
    newIndex: numberString;
    oldIndex: numberString;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebJsonDeltaChunk;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    deletedTarget: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReference = IEvent & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: numberString;
    oldIndex: numberString;
    target: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReference = IEvent & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedTarget: LionWebId;
    movedResolveInfo: JS_string;
    oldIndex: numberString;
    replacedTarget: LionWebId;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    target: LionWebId;
    newResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    target: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    target: LionWebId;
    newResolveInfo: JS_string;
    replacedResolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    deletedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    resolveInfo: JS_string;
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-IEvent
 */
export type IEvent = {
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEvent = {
    parts: IEvent[];
    messageKind: EventKind;
    protocolMessage?: ProtocolMessage;
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
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-NoOpEvent
 */
export type NoOpEvent = {
    messageKind: EventKind;
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage;
};

export type EventKind = string;
