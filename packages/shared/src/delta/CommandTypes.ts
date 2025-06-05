import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk, numberString } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartition = {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartition = {
    deletedPartition: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifier = ICommand & {
    node: LionWebId;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddProperty
 */
export type AddProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteProperty
 */
export type DeleteProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangeProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddChild
 */
export type AddChild = ICommand & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteChild
 */
export type DeleteChild = ICommand & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ReplaceChild
 */
export type ReplaceChild = ICommand & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainment = ICommand & {
    newParent: LionWebId;
    movedChild: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParent = ICommand & {
    newContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainment = ICommand & {
    movedChild: LionWebId;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainment = ICommand & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParent = ICommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: numberString;
    movedChild: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainment = ICommand & {
    newIndex: numberString;
    movedChild: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddAnnotation
 */
export type AddAnnotation = ICommand & {
    newAnnotation: LionWebJsonDeltaChunk;
    parent: LionWebId;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteAnnotation
 */
export type DeleteAnnotation = ICommand & {
    parent: LionWebId;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotation = ICommand & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParent = ICommand & {
    newParent: LionWebId;
    newIndex: numberString;
    movedAnnotation: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParent = ICommand & {
    newIndex: numberString;
    movedAnnotation: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParent = ICommand & {
    newParent: LionWebId;
    newIndex: numberString;
    movedAnnotation: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParent = {
    newIndex: numberString;
    movedAnnotation: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReference
 */
export type AddReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReference
 */
export type DeleteReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReference
 */
export type ChangeReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReference = ICommand & {
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParent = ICommand & {
    parent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReference = ICommand & {
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParent = ICommand & {
    parent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newReference: LionWebJsonMetaPointer;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    oldIndex: numberString;
    newIndex: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newResolveInfo: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReferenceResolveInfo
 */
export type ChangeReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newResolveInfo: string;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReferenceTarget
 */
export type AddReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReferenceTarget
 */
export type ChangeReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: numberString;
    newTarget: LionWebId;
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ICommand
 */
export type ICommand = {
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-CompositeCommand
 */
export type CompositeCommand = ICommand & {
    parts: ICommand[];
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

export type CommandKind =
    | "AddPartition"
    | "DeletePartition"
    | "ChangeClassifier"
    | "AddProperty"
    | "DeleteProperty"
    | "ChangeProperty"
    | "AddChild"
    | "DeleteChild"
    | "ReplaceChild"
    | "MoveChildFromOtherContainment"
    | "MoveChildFromOtherContainmentInSameParent"
    | "MoveChildInSameContainment"
    | "MoveAndReplaceChildFromOtherContainment"
    | "MoveAndReplaceChildFromOtherContainmentInSameParent"
    | "MoveAndReplaceChildInSameContainment"
    | "AddAnnotation"
    | "DeleteAnnotation"
    | "ReplaceAnnotation"
    | "MoveAnnotationFromOtherParent"
    | "MoveAnnotationInSameParent"
    | "MoveAndReplaceAnnotationFromOtherParent"
    | "MoveAndReplaceAnnotationInSameParent"
    | "AddReference"
    | "DeleteReference"
    | "ChangeReference"
    | "MoveEntryFromOtherReference"
    | "MoveEntryFromOtherReferenceInSameParent"
    | "MoveEntryInSameReference"
    | "MoveAndReplaceEntryFromOtherReference"
    | "MoveAndReplaceEntryFromOtherReferenceInSameParent"
    | "MoveAndReplaceEntryInSameReference"
    | "AddReferenceResolveInfo"
    | "DeleteReferenceResolveInfo"
    | "ChangeReferenceResolveInfo"
    | "AddReferenceTarget"
    | "DeleteReferenceTarget"
    | "ChangeReferenceTarget"
    | "ICommand"
    | "CompositeCommand";
