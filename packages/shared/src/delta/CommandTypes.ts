import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, JS_number, JS_string } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-CommandResponse
 */
export type CommandResponseCommand = {
    messageKind: "CommandResponse";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartitionCommand = {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: "AddPartition";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartitionCommand = {
    deletedPartition: LionWebId;
    messageKind: "DeletePartition";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifierCommand = {
    node: LionWebId;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: "ChangeClassifier";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddProperty
 */
export type AddPropertyCommand = {
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
export type DeletePropertyCommand = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: "DeleteProperty";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangePropertyCommand = {
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
export type AddChildCommand = {
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
export type DeleteChildCommand = {
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
export type ReplaceChildCommand = {
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
export type MoveChildFromOtherContainmentCommand = {
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
export type MoveChildFromOtherContainmentInSameParentCommand = {
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
export type MoveChildInSameContainmentCommand = {
    movedChild: LionWebId;
    newIndex: JS_number;
    messageKind: "MoveChildInSameContainment";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainmentCommand = {
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
export type MoveAndReplaceChildFromOtherContainmentInSameParentCommand = {
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
export type MoveAndReplaceChildInSameContainmentCommand = {
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
export type AddAnnotationCommand = {
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
export type DeleteAnnotationCommand = {
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
export type ReplaceAnnotationCommand = {
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
export type MoveAnnotationFromOtherParentCommand = {
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
export type MoveAnnotationInSameParentCommand = {
    newIndex: JS_number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationInSameParent";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParentCommand = {
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
export type MoveAndReplaceAnnotationInSameParentCommand = {
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
export type AddReferenceCommand = {
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
export type DeleteReferenceCommand = {
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
export type ChangeReferenceCommand = {
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
export type MoveEntryFromOtherReferenceCommand = {
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
export type MoveEntryFromOtherReferenceInSameParentCommand = {
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
export type MoveEntryInSameReferenceCommand = {
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
export type MoveAndReplaceEntryFromOtherReferenceCommand = {
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
export type MoveAndReplaceEntryFromOtherReferenceInSameParentCommand = {
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
export type MoveAndReplaceEntryInSameReferenceCommand = {
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
export type AddReferenceResolveInfoCommand = {
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
export type DeleteReferenceResolveInfoCommand = {
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
export type ChangeReferenceResolveInfoCommand = {
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
export type AddReferenceTargetCommand = {
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
export type DeleteReferenceTargetCommand = {
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
export type ChangeReferenceTargetCommand = {
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
export type CompositeCommandCommand = {
    parts: CommandType[];
    messageKind: "CompositeCommand";
    commandId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

export type CommandType =
    | CommandResponseCommand
    | AddPartitionCommand
    | DeletePartitionCommand
    | ChangeClassifierCommand
    | AddPropertyCommand
    | DeletePropertyCommand
    | ChangePropertyCommand
    | AddChildCommand
    | DeleteChildCommand
    | ReplaceChildCommand
    | MoveChildFromOtherContainmentCommand
    | MoveChildFromOtherContainmentInSameParentCommand
    | MoveChildInSameContainmentCommand
    | MoveAndReplaceChildFromOtherContainmentCommand
    | MoveAndReplaceChildFromOtherContainmentInSameParentCommand
    | MoveAndReplaceChildInSameContainmentCommand
    | AddAnnotationCommand
    | DeleteAnnotationCommand
    | ReplaceAnnotationCommand
    | MoveAnnotationFromOtherParentCommand
    | MoveAnnotationInSameParentCommand
    | MoveAndReplaceAnnotationFromOtherParentCommand
    | MoveAndReplaceAnnotationInSameParentCommand
    | AddReferenceCommand
    | DeleteReferenceCommand
    | ChangeReferenceCommand
    | MoveEntryFromOtherReferenceCommand
    | MoveEntryFromOtherReferenceInSameParentCommand
    | MoveEntryInSameReferenceCommand
    | MoveAndReplaceEntryFromOtherReferenceCommand
    | MoveAndReplaceEntryFromOtherReferenceInSameParentCommand
    | MoveAndReplaceEntryInSameReferenceCommand
    | AddReferenceResolveInfoCommand
    | DeleteReferenceResolveInfoCommand
    | ChangeReferenceResolveInfoCommand
    | AddReferenceTargetCommand
    | DeleteReferenceTargetCommand
    | ChangeReferenceTargetCommand
    | CompositeCommandCommand;
