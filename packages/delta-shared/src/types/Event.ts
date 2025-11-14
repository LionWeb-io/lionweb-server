import { LionWebId } from "./Chunks.js";
import { LionWebJsonMetaPointer } from "./Chunks.js";
import { Number } from "./DeltaTypes.js";
import { CommandSource } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
// cannot find import for Event

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ClassifierChanged
 */
export type ClassifierChangedEvent = {
    node: LionWebId;
    oldClassifier: LionWebJsonMetaPointer;
    newClassifier: LionWebJsonMetaPointer;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ClassifierChanged";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionAdded
 */
export type PartitionAddedEvent = {
    newPartition: LionWebDeltaJsonChunk;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "PartitionAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PartitionDeleted
 */
export type PartitionDeletedEvent = {
    deletedPartition: LionWebId;
    deletedDescendants: LionWebId[];
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "PartitionDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyAdded
 */
export type PropertyAddedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "PropertyAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyDeleted
 */
export type PropertyDeletedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    oldValue: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "PropertyDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-PropertyChanged
 */
export type PropertyChangedEvent = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    oldValue: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "PropertyChanged";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildAdded
 */
export type ChildAddedEvent = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    newChild: LionWebDeltaJsonChunk;
    index: Number;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildDeleted
 */
export type ChildDeletedEvent = {
    parent: LionWebId;
    index: Number;
    containment: LionWebJsonMetaPointer;
    deletedChild: LionWebId;
    deletedDescendants: LionWebId[];
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildReplaced
 */
export type ChildReplacedEvent = {
    parent: LionWebId;
    index: Number;
    containment: LionWebJsonMetaPointer;
    replacedChild: LionWebId;
    replacedDescendants: LionWebId[];
    newChild: LionWebDeltaJsonChunk;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildReplaced";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainment
 */
export type ChildMovedFromOtherContainmentEvent = {
    newParent: LionWebId;
    newIndex: Number;
    newContainment: LionWebJsonMetaPointer;
    oldParent: LionWebId;
    oldIndex: Number;
    oldContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedFromOtherContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedFromOtherContainmentInSameParent
 */
export type ChildMovedFromOtherContainmentInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    newContainment: LionWebJsonMetaPointer;
    oldIndex: Number;
    oldContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedFromOtherContainmentInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedInSameContainment
 */
export type ChildMovedInSameContainmentEvent = {
    parent: LionWebId;
    newIndex: Number;
    containment: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedInSameContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainment
 */
export type ChildMovedAndReplacedFromOtherContainmentEvent = {
    newParent: LionWebId;
    newIndex: Number;
    newContainment: LionWebJsonMetaPointer;
    oldParent: LionWebId;
    oldIndex: Number;
    oldContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    replacedDescendants: LionWebId[];
    replacedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedAndReplacedFromOtherContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedFromOtherContainmentInSameParent
 */
export type ChildMovedAndReplacedFromOtherContainmentInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    newContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    oldIndex: Number;
    oldContainment: LionWebJsonMetaPointer;
    replacedDescendants: LionWebId[];
    replacedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedAndReplacedFromOtherContainmentInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ChildMovedAndReplacedInSameContainment
 */
export type ChildMovedAndReplacedInSameContainmentEvent = {
    parent: LionWebId;
    newIndex: Number;
    containment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    oldIndex: Number;
    replacedDescendants: LionWebId[];
    replacedChild: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ChildMovedAndReplacedInSameContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationAdded
 */
export type AnnotationAddedEvent = {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationDeleted
 */
export type AnnotationDeletedEvent = {
    parent: LionWebId;
    deletedAnnotation: LionWebId;
    deletedDescendants: LionWebId[];
    index: Number;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationReplaced
 */
export type AnnotationReplacedEvent = {
    parent: LionWebId;
    index: Number;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    newAnnotation: LionWebDeltaJsonChunk;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationReplaced";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedFromOtherParent
 */
export type AnnotationMovedFromOtherParentEvent = {
    newParent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: Number;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationMovedFromOtherParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedInSameParent
 */
export type AnnotationMovedInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    oldIndex: Number;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationMovedInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedFromOtherParent
 */
export type AnnotationMovedAndReplacedFromOtherParentEvent = {
    newParent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    oldParent: LionWebId;
    oldIndex: Number;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationMovedAndReplacedFromOtherParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-AnnotationMovedAndReplacedInSameParent
 */
export type AnnotationMovedAndReplacedInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    oldIndex: Number;
    replacedAnnotation: LionWebId;
    replacedDescendants: LionWebId[];
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "AnnotationMovedAndReplacedInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceAdded
 */
export type ReferenceAddedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    newTarget?: LionWebId;
    newResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceDeleted
 */
export type ReferenceDeletedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    deletedTarget?: LionWebId;
    deletedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceChanged
 */
export type ReferenceChangedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    newTarget?: LionWebId;
    newResolveInfo?: String;
    oldTarget?: LionWebId;
    oldResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceChanged";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReference
 */
export type EntryMovedFromOtherReferenceEvent = {
    newParent: LionWebId;
    newIndex: Number;
    newReference: LionWebJsonMetaPointer;
    oldParent: LionWebId;
    oldIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedFromOtherReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedFromOtherReferenceInSameParent
 */
export type EntryMovedFromOtherReferenceInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    newReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedFromOtherReferenceInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedInSameReference
 */
export type EntryMovedInSameReferenceEvent = {
    parent: LionWebId;
    newIndex: Number;
    oldIndex: Number;
    reference: LionWebJsonMetaPointer;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedInSameReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReference
 */
export type EntryMovedAndReplacedFromOtherReferenceEvent = {
    newParent: LionWebId;
    newIndex: Number;
    newReference: LionWebJsonMetaPointer;
    oldParent: LionWebId;
    oldIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedAndReplacedFromOtherReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedFromOtherReferenceInSameParent
 */
export type EntryMovedAndReplacedFromOtherReferenceInSameParentEvent = {
    parent: LionWebId;
    newIndex: Number;
    newReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedAndReplacedFromOtherReferenceInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-EntryMovedAndReplacedInSameReference
 */
export type EntryMovedAndReplacedInSameReferenceEvent = {
    parent: LionWebId;
    newIndex: Number;
    reference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedTarget?: LionWebId;
    movedResolveInfo?: String;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "EntryMovedAndReplacedInSameReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoAdded
 */
export type ReferenceResolveInfoAddedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    newResolveInfo: String;
    target: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceResolveInfoAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoDeleted
 */
export type ReferenceResolveInfoDeletedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    deletedResolveInfo: String;
    target: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceResolveInfoDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceResolveInfoChanged
 */
export type ReferenceResolveInfoChangedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    newResolveInfo: String;
    target?: LionWebId;
    oldResolveInfo: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceResolveInfoChanged";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetAdded
 */
export type ReferenceTargetAddedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    resolveInfo: String;
    newTarget: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceTargetAdded";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetDeleted
 */
export type ReferenceTargetDeletedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    resolveInfo: String;
    deletedTarget: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceTargetDeleted";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ReferenceTargetChanged
 */
export type ReferenceTargetChangedEvent = {
    parent: LionWebId;
    index: Number;
    reference: LionWebJsonMetaPointer;
    resolveInfo: String;
    newTarget: LionWebId;
    replacedTarget: LionWebId;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ReferenceTargetChanged";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-CompositeEvent
 */
export type CompositeEvent = {
    parts: DeltaEvent[];
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "CompositeEvent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-NoOp
 */
export type NoOpEvent = {
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "NoOp";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt-ErrorEvent
 */
export type ErrorEvent = {
    errorCode: String;
    message: String;
    sequenceNumber: Number;
    originCommands: CommandSource[];
    messageKind: "ErrorEvent";
    protocolMessages: ProtocolMessage[];
};

// The overall "super-type"
export type DeltaEvent =
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
    | CompositeEvent
    | NoOpEvent
    | ErrorEvent;

// The type for the tagged union property
export type EventMessageKind =
    | "ClassifierChanged"
    | "PartitionAdded"
    | "PartitionDeleted"
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
    | "CompositeEvent"
    | "NoOp"
    | "ErrorEvent";

// Type Guard function
export function isDeltaEvent(object: unknown): object is DeltaEvent {
    const castObject = object as DeltaEvent;
    return (
        castObject.messageKind !== undefined &&
        [
            "ClassifierChanged",
            "PartitionAdded",
            "PartitionDeleted",
            "PropertyAdded",
            "PropertyDeleted",
            "PropertyChanged",
            "ChildAdded",
            "ChildDeleted",
            "ChildReplaced",
            "ChildMovedFromOtherContainment",
            "ChildMovedFromOtherContainmentInSameParent",
            "ChildMovedInSameContainment",
            "ChildMovedAndReplacedFromOtherContainment",
            "ChildMovedAndReplacedFromOtherContainmentInSameParent",
            "ChildMovedAndReplacedInSameContainment",
            "AnnotationAdded",
            "AnnotationDeleted",
            "AnnotationReplaced",
            "AnnotationMovedFromOtherParent",
            "AnnotationMovedInSameParent",
            "AnnotationMovedAndReplacedFromOtherParent",
            "AnnotationMovedAndReplacedInSameParent",
            "ReferenceAdded",
            "ReferenceDeleted",
            "ReferenceChanged",
            "EntryMovedFromOtherReference",
            "EntryMovedFromOtherReferenceInSameParent",
            "EntryMovedInSameReference",
            "EntryMovedAndReplacedFromOtherReference",
            "EntryMovedAndReplacedFromOtherReferenceInSameParent",
            "EntryMovedAndReplacedInSameReference",
            "ReferenceResolveInfoAdded",
            "ReferenceResolveInfoDeleted",
            "ReferenceResolveInfoChanged",
            "ReferenceTargetAdded",
            "ReferenceTargetDeleted",
            "ReferenceTargetChanged",
            "CompositeEvent",
            "NoOp",
            "ErrorEvent",
        ].includes(castObject.messageKind)
    );
}
