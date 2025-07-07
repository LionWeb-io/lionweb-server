import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, JS_string, JS_number } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-CommandResponse
 */
export type CommandResponse = {
    messageKind: "CommandResponse";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartition = {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: "AddPartition";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartition = {
    deletedPartition: LionWebId;
    messageKind: "DeletePartition";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifier = {
    node: LionWebId;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: "ChangeClassifier";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddProperty
 */
export type AddProperty = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    messageKind: "AddProperty";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteProperty
 */
export type DeleteProperty = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: "DeleteProperty";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangeProperty = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: JS_string;
    messageKind: "ChangeProperty";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddChild
 */
export type AddChild = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    messageKind: "AddChild";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteChild
 */
export type DeleteChild = {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    deletedChild: LionWebId;
    messageKind: "DeleteChild";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceChild
 */
export type ReplaceChild = {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: JS_number;
    replacedChild: LionWebId;
    messageKind: "ReplaceChild";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainment = {
    newParent: LionWebId;
    movedChild: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    messageKind: "MoveChildFromOtherContainment";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParent = {
    newContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    newIndex: JS_number;
    messageKind: "MoveChildFromOtherContainmentInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainment = {
    movedChild: LionWebId;
    newIndex: JS_number;
    messageKind: "MoveChildInSameContainment";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainment = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    replacedChild: LionWebId;
    messageKind: "MoveAndReplaceChildFromOtherContainment";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParent = {
    newContainment: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedChild: LionWebId;
    replacedChild: LionWebId;
    messageKind: "MoveAndReplaceChildFromOtherContainmentInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainment = {
    newIndex: JS_number;
    movedChild: LionWebId;
    replacedChild: LionWebId;
    messageKind: "MoveAndReplaceChildInSameContainment";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddAnnotation
 */
export type AddAnnotation = {
    newAnnotation: LionWebJsonDeltaChunk;
    parent: LionWebId;
    index: JS_number;
    messageKind: "AddAnnotation";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteAnnotation
 */
export type DeleteAnnotation = {
    parent: LionWebId;
    index: JS_number;
    deletedAnnotation: LionWebId;
    messageKind: "DeleteAnnotation";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotation = {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: JS_number;
    replacedAnnotation: LionWebId;
    messageKind: "ReplaceAnnotation";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationFromOtherParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParent = {
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParent = {
    newParent: LionWebId;
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationFromOtherParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParent = {
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    replacedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReference
 */
export type AddReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "AddReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReference
 */
export type DeleteReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedTarget: LionWebId;
    deletedResolveInfo: JS_string;
    messageKind: "DeleteReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReference
 */
export type ChangeReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newTarget: LionWebId;
    newResolveInfo: JS_string;
    oldTarget: LionWebId;
    oldResolveInfo: JS_string;
    messageKind: "ChangeReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReference = {
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    messageKind: "MoveEntryFromOtherReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParent = {
    parent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    messageKind: "MoveEntryFromOtherReferenceInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    messageKind: "MoveEntryInSameReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReference = {
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: JS_string;
    messageKind: "MoveAndReplaceEntryFromOtherReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParent = {
    parent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newReference: LionWebJsonMetaPointer;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: JS_string;
    messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReference = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    oldIndex: JS_number;
    newIndex: JS_number;
    movedTarget?: LionWebId;
    movedResolveInfo?: JS_string;
    replacedTarget?: LionWebId;
    replacedResolveInfo?: JS_string;
    messageKind: "MoveAndReplaceEntryInSameReference";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfo = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    target: LionWebId;
    newResolveInfo: JS_string;
    messageKind: "AddReferenceResolveInfo";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfo = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    deletedResolveInfo: JS_string;
    target: LionWebId;
    messageKind: "DeleteReferenceResolveInfo";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceResolveInfo
 */
export type ChangeReferenceResolveInfo = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    newResolveInfo: JS_string;
    oldResolveInfo: JS_string;
    target: LionWebId;
    messageKind: "ChangeReferenceResolveInfo";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceTarget
 */
export type AddReferenceTarget = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    resolveInfo: JS_string;
    newTarget: LionWebId;
    messageKind: "AddReferenceTarget";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTarget = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    resolveInfo: JS_string;
    deletedTarget: LionWebId;
    messageKind: "DeleteReferenceTarget";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceTarget
 */
export type ChangeReferenceTarget = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: JS_number;
    resolveInfo: JS_string;
    newTarget: LionWebId;
    oldTarget: LionWebId;
    messageKind: "ChangeReferenceTarget";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-CompositeCommand
 */
export type CompositeCommand = {
    parts: CommandType[];
    messageKind: "CompositeCommand";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

export type CommandType =
    | CommandResponse
    | AddPartition
    | DeletePartition
    | ChangeClassifier
    | AddProperty
    | DeleteProperty
    | ChangeProperty
    | AddChild
    | DeleteChild
    | ReplaceChild
    | MoveChildFromOtherContainment
    | MoveChildFromOtherContainmentInSameParent
    | MoveChildInSameContainment
    | MoveAndReplaceChildFromOtherContainment
    | MoveAndReplaceChildFromOtherContainmentInSameParent
    | MoveAndReplaceChildInSameContainment
    | AddAnnotation
    | DeleteAnnotation
    | ReplaceAnnotation
    | MoveAnnotationFromOtherParent
    | MoveAnnotationInSameParent
    | MoveAndReplaceAnnotationFromOtherParent
    | MoveAndReplaceAnnotationInSameParent
    | AddReference
    | DeleteReference
    | ChangeReference
    | MoveEntryFromOtherReference
    | MoveEntryFromOtherReferenceInSameParent
    | MoveEntryInSameReference
    | MoveAndReplaceEntryFromOtherReference
    | MoveAndReplaceEntryFromOtherReferenceInSameParent
    | MoveAndReplaceEntryInSameReference
    | AddReferenceResolveInfo
    | DeleteReferenceResolveInfo
    | ChangeReferenceResolveInfo
    | AddReferenceTarget
    | DeleteReferenceTarget
    | ChangeReferenceTarget
    | CompositeCommand;
