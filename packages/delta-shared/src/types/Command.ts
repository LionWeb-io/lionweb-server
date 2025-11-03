import { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
import { CommandId } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";
import { LionWebJsonMetaPointer } from "./Chunks.js";
import { Number } from "./DeltaTypes.js";
// cannot find import for Command

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartitionCommand = {
    newPartition: LionWebDeltaJsonChunk;
    commandId: CommandId;
    messageKind: "AddPartition";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartitionCommand = {
    deletedPartition: LionWebId;
    commandId: CommandId;
    messageKind: "DeletePartition";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifierCommand = {
    newClassifier: LionWebJsonMetaPointer;
    node: LionWebId;
    commandId: CommandId;
    messageKind: "ChangeClassifier";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddProperty
 */
export type AddPropertyCommand = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    commandId: CommandId;
    messageKind: "AddProperty";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangePropertyCommand = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    commandId: CommandId;
    messageKind: "ChangeProperty";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteProperty
 */
export type DeletePropertyCommand = {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    commandId: CommandId;
    messageKind: "DeleteProperty";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddChild
 */
export type AddChildCommand = {
    parent: LionWebId;
    newChild: LionWebDeltaJsonChunk;
    containment: LionWebJsonMetaPointer;
    index: Number;
    commandId: CommandId;
    messageKind: "AddChild";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteChild
 */
export type DeleteChildCommand = {
    parent: LionWebId;
    deletedChild: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: Number;
    commandId: CommandId;
    messageKind: "DeleteChild";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceChild
 */
export type ReplaceChildCommand = {
    parent: LionWebId;
    newChild: LionWebDeltaJsonChunk;
    containment: LionWebJsonMetaPointer;
    index: Number;
    replacedChild: LionWebId;
    commandId: CommandId;
    messageKind: "ReplaceChild";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainmentCommand = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveChildFromOtherContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParentCommand = {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveChildFromOtherContainmentInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainmentCommand = {
    newIndex: Number;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveChildInSameContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainmentCommand = {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceChildFromOtherContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParentCommand = {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceChildFromOtherContainmentInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainmentCommand = {
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceChildInSameContainment";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddAnnotation
 */
export type AddAnnotationCommand = {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    commandId: CommandId;
    messageKind: "AddAnnotation";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteAnnotation
 */
export type DeleteAnnotationCommand = {
    parent: LionWebId;
    index: Number;
    deletedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "DeleteAnnotation";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotationCommand = {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    replacedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "ReplaceAnnotation";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParentCommand = {
    newParent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAnnotationFromOtherParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParentCommand = {
    newIndex: Number;
    movedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAnnotationInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParentCommand = {
    newParent: LionWebId;
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceAnnotationFromOtherParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParentCommand = {
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceAnnotationInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReference
 */
export type AddReferenceCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    newResolveInfo: String;
    commandId: CommandId;
    messageKind: "AddReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReference
 */
export type DeleteReferenceCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId;
    deleteResolveInfo: String;
    commandId: CommandId;
    messageKind: "DeleteReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReference
 */
export type ChangeReferenceCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    oldTarget: LionWebId;
    oldResolveInfo: String;
    newTarget: LionWebId;
    newResolveInfo: String;
    commandId: CommandId;
    messageKind: "ChangeReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReferenceCommand = {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveEntryFromOtherReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParentCommand = {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveEntryFromOtherReferenceInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReferenceCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveEntryInSameReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReferenceCommand = {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    replacedResolveInfo: String;
    replacedTarget: LionWebId;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceEntryFromOtherReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParentCommand = {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    replacedResolveInfo: String;
    replacedTarget: LionWebId;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReferenceCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    replacedResolveInfo: String;
    replacedTarget: LionWebId;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "MoveAndReplaceEntryInSameReference";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfoCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newResolveInfo: String;
    commandId: CommandId;
    messageKind: "AddReferenceResolveInfo";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfoCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedResolveInfo: String;
    commandId: CommandId;
    messageKind: "DeleteReferenceResolveInfo";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceResolveInfo
 */
export type ChangeReferenceResolveInfoCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newResolveInfo: String;
    oldResolveInfo: String;
    commandId: CommandId;
    messageKind: "ChangeReferenceResolveInfo";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceTarget
 */
export type AddReferenceTargetCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    commandId: CommandId;
    messageKind: "AddReferenceTarget";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTargetCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId;
    commandId: CommandId;
    messageKind: "DeleteReferenceTarget";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceTarget
 */
export type ChangeReferenceTargetCommand = {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    oldTarget: LionWebId;
    commandId: CommandId;
    messageKind: "ChangeReferenceTarget";
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-CompositeCommand
 */
export type CompositeCommand = {
    parts: DeltaCommand[];
    commandId: CommandId;
    messageKind: "CompositeCommand";
    protocolMessages: ProtocolMessage[];
};

// The overall "super-type"
export type DeltaCommand =
    | AddPartitionCommand
    | DeletePartitionCommand
    | ChangeClassifierCommand
    | AddPropertyCommand
    | ChangePropertyCommand
    | DeletePropertyCommand
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
    | CompositeCommand;
