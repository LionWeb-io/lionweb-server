import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js";

export type IEvent = {
    messageKind: EventKind;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CommandSource
 */
export type CommandSource = IEvent & {
    participationId: ParticipationId[];
    commandId: CommandId[];
};

export type SequenceNumber = string;

export type CommandId = string;

export type ParticipationId = string;

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAdded = IEvent & {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "PartitionAdded",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeleted = IEvent & {
    deletedPartition: LionWebId;
    messageKind: EventKind; // === "PartitionDeleted",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ClassifierEntryMovedAndReplacedFromOtherReferenceChanged
 */
export type ClassifierEntryMovedAndReplacedFromOtherReferenceChanged = IEvent & {
    node: LionWebId;
    newClassifier: LionWebJsonMetaPointer;
    oldClassifier: LionWebJsonMetaPointer;
    messageKind: EventKind; // === "ClassifierEntryMovedAndReplacedFromOtherReferenceChanged",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyAdded
 */
export type PropertyAdded = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: EventKind; // === "PropertyAdded",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyDeleted
 */
export type PropertyDeleted = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: EventKind; // === "PropertyDeleted",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-PropertyChanged
 */
export type PropertyChanged = IEvent & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    oldValue: string;
    messageKind: EventKind; // === "PropertyChanged",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAdded = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: EventKind; // === "ChildAdded",
    originCommands: CommandSource[];
    sequenceNumber: SequenceNumber;
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeleted = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: EventKind; // === "ChildDeleted",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplaced = IEvent & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    replacedChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: EventKind; // === "ChildReplaced",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: number;
    messageKind: EventKind; // === "ChildMovedFromOtherContainment",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: number;
    messageKind: EventKind; // === "ChildMovedFromOtherContainmentInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldIndex: number;
    messageKind: EventKind; // === "ChildMovedInSameContainment",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainment = IEvent & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldParent: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: number;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "ChildMovedAndReplacedFromOtherContainment",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParent = IEvent & {
    parent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldContainment: LionWebJsonMetaPointer;
    oldIndex: number;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "ChildMovedAndReplacedFromOtherContainmentInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainment = IEvent & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    oldIndex: number;
    replacedChild: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "ChildMovedAndReplacedInSameContainment",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAdded = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: number;
    messageKind: EventKind; // === "AnnotationAdded",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeleted = IEvent & {
    parent: LionWebId;
    index: number;
    deletedAnnotation: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "AnnotationDeleted",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplaced = IEvent & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    replacedAnnotation: LionWebJsonDeltaChunk;
    index: number;
    messageKind: EventKind; // === "AnnotationReplaced",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: number;
    messageKind: EventKind; // === "AnnotationMovedFromOtherParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParent = IEvent & {
    parent: LionWebId;
    oldIndex: number;
    newIndex: number;
    movedAnnotation: LionWebId;
    messageKind: EventKind; // === "AnnotationMovedInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParent = IEvent & {
    newParent: LionWebId;
    newIndex: number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebJsonDeltaChunk;
    oldParent: LionWebId;
    oldIndex: number;
    messageKind: EventKind; // === "AnnotationMovedAndReplacedFromOtherParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParent = IEvent & {
    parent: LionWebId;
    newIndex: number;
    oldIndex: number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebJsonDeltaChunk;
    messageKind: EventKind; // === "AnnotationMovedAndReplacedInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: EventKind; // === "ReferenceAdded",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    deletedTarget: LionWebId;
    deletedResolveInfo: string;
    messageKind: EventKind; // === "ReferenceDeleted",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    replacedTarget: LionWebId;
    replacedResolveInfo: string;
    messageKind: EventKind; // === "ReferenceChanged",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReference = IEvent & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: number;
    target: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "EntryMovedFromOtherReference",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: number;
    target: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "EntryMovedFromOtherReferenceInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: number;
    oldIndex: number;
    target: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "EntryMovedInSameReference",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReference = IEvent & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: number;
    movedTarget: LionWebId;
    movedResolveInfo: string;
    replacedTarget: LionWebId;
    replacedResolveInfo: string;
    messageKind: EventKind; // === "EntryMovedAndReplacedFromOtherReference",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParent = IEvent & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: number;
    movedTarget: LionWebId;
    movedResolveInfo: string;
    replacedTarget: LionWebId;
    replacedResolveInfo: string;
    messageKind: EventKind; // === "EntryMovedAndReplacedFromOtherReferenceInSameParent",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReference = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: number;
    movedTarget: LionWebId;
    movedResolveInfo: string;
    oldIndex: number;
    replacedTarget: LionWebId;
    replacedResolveInfo: string;
    messageKind: EventKind; // === "EntryMovedAndReplacedInSameReference",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    target: LionWebId;
    newResolveInfo: string;
    messageKind: EventKind; // === "ReferenceResolveInfoAdded",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    target: LionWebId;
    deletedResolveInfo: string;
    messageKind: EventKind; // === "ReferenceResolveInfoDeleted",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    target: LionWebId;
    newResolveInfo: string;
    replacedResolveInfo: string;
    messageKind: EventKind; // === "ReferenceResolveInfoChanged",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAdded = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "ReferenceTargetAdded",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeleted = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    deletedTarget: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "ReferenceTargetDeleted",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChanged = IEvent & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    resolveInfo: string;
    messageKind: EventKind; // === "ReferenceTargetChanged",
    originCommands: CommandSource[];
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEvent = IEvent & {
    parts: IEvent;
    messageKind: EventKind; // === "CompositeEvent",
    protocolMessage?: ProtocolMessage[];
};

export type EventKind =
    | "CommandSource"
    | "SequenceNumber"
    | "CommandId"
    | "ParticipationId"
    | "PartitionAdded"
    | "PartitionDeleted"
    | "ClassifierEntryMovedAndReplacedFromOtherReferenceChanged"
    | "PropertyAdded"
    | "PropertyDeleted"
    | "PropertyChanged"
    | "ChildAdded"
    | "ChildDeleted"
    | "ChildReplaced"
    | "ChildMovedFromOtherContainment"
    | "ChildMovedFromOtherContainmentInSameParent"
    | "ChildMovedInSameContainment"
    | "ChildMovedAndReplacedFromOtherContainment"
    | "ChildMovedAndReplacedFromOtherContainmentInSameParent"
    | "ChildMovedAndReplacedInSameContainment"
    | "AnnotationAdded"
    | "AnnotationDeleted"
    | "AnnotationReplaced"
    | "AnnotationMovedFromOtherParent"
    | "AnnotationMovedInSameParent"
    | "AnnotationMovedAndReplacedFromOtherParent"
    | "AnnotationMovedAndReplacedInSameParent"
    | "ReferenceAdded"
    | "ReferenceDeleted"
    | "ReferenceChanged"
    | "EntryMovedFromOtherReference"
    | "EntryMovedFromOtherReferenceInSameParent"
    | "EntryMovedInSameReference"
    | "EntryMovedAndReplacedFromOtherReference"
    | "EntryMovedAndReplacedFromOtherReferenceInSameParent"
    | "EntryMovedAndReplacedInSameReference"
    | "ReferenceResolveInfoAdded"
    | "ReferenceResolveInfoDeleted"
    | "ReferenceResolveInfoChanged"
    | "ReferenceTargetAdded"
    | "ReferenceTargetDeleted"
    | "ReferenceTargetChanged"
    | "CompositeEvent";
