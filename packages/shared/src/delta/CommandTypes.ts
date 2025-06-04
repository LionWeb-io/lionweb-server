import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json";
import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js";

export type ICommand = {
    messageKind: CommandKind;
    commandId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartition = ICommand & {
    newPartition: LionWebJsonDeltaChunk;
    messageKind: CommandKind; // === "AddPartition",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartition = ICommand & {
    deletedPartition: LionWebId;
    messageKind: CommandKind; // === "DeletePartition",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifier = ICommand & {
    node: LionWebId;
    newClassifier: LionWebJsonMetaPointer;
    messageKind: CommandKind; // === "ChangeClassifier",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddProperty
 */
export type AddProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: CommandKind; // === "AddProperty",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteProperty
 */
export type DeleteProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: CommandKind; // === "DeleteProperty",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangeProperty = ICommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: string;
    messageKind: CommandKind; // === "ChangeProperty",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddChild
 */
export type AddChild = ICommand & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: CommandKind; // === "AddChild",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteChild
 */
export type DeleteChild = ICommand & {
    parent: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: CommandKind; // === "DeleteChild",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ReplaceChild
 */
export type ReplaceChild = ICommand & {
    parent: LionWebId;
    newChild: LionWebJsonDeltaChunk;
    containment: LionWebJsonMetaPointer;
    index: number;
    messageKind: CommandKind; // === "ReplaceChild",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainment = ICommand & {
    newParent: LionWebId;
    movedChild: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    messageKind: CommandKind; // === "MoveChildFromOtherContainment",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParent = ICommand & {
    newContainment: LionWebJsonMetaPointer;
    movedChild: LionWebId;
    newIndex: number;
    messageKind: CommandKind; // === "MoveChildFromOtherContainmentInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainment = ICommand & {
    movedChild: LionWebId;
    newIndex: number;
    messageKind: CommandKind; // === "MoveChildInSameContainment",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainment = ICommand & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    messageKind: CommandKind; // === "MoveAndReplaceChildFromOtherContainment",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParent = ICommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: number;
    movedChild: LionWebId;
    messageKind: CommandKind; // === "MoveAndReplaceChildFromOtherContainmentInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainment = ICommand & {
    newIndex: number;
    movedChild: LionWebId;
    messageKind: CommandKind; // === "MoveAndReplaceChildInSameContainment",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddAnnotation
 */
export type AddAnnotation = ICommand & {
    newAnnotation: LionWebJsonDeltaChunk;
    parent: LionWebId;
    messageKind: CommandKind; // === "AddAnnotation",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteAnnotation
 */
export type DeleteAnnotation = ICommand & {
    parent: LionWebId;
    index: number;
    messageKind: CommandKind; // === "DeleteAnnotation",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotation = ICommand & {
    parent: LionWebId;
    newAnnotation: LionWebJsonDeltaChunk;
    index: number;
    messageKind: CommandKind; // === "ReplaceAnnotation",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParent = ICommand & {
    newParent: LionWebId;
    newIndex: number;
    movedAnnotation: LionWebId;
    messageKind: CommandKind; // === "MoveAnnotationFromOtherParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParent = ICommand & {
    newIndex: number;
    movedAnnotation: LionWebId;
    messageKind: CommandKind; // === "MoveAnnotationInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParent = ICommand & {
    newParent: LionWebId;
    newIndex: number;
    movedAnnotation: LionWebId;
    messageKind: CommandKind; // === "MoveAndReplaceAnnotationFromOtherParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParent = ICommand & {
    newIndex: number;
    movedAnnotation: LionWebId;
    messageKind: CommandKind; // === "MoveAndReplaceAnnotationInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReference
 */
export type AddReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "AddReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReference
 */
export type DeleteReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    messageKind: CommandKind; // === "DeleteReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReference
 */
export type ChangeReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "ChangeReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveEntryFromOtherReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParent = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveEntryFromOtherReferenceInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveEntryInSameReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveAndReplaceEntryFromOtherReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParent = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveAndReplaceEntryFromOtherReferenceInSameParent",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReference = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "MoveAndReplaceEntryInSameReference",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "AddReferenceResolveInfo",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "DeleteReferenceResolveInfo",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReferenceResolveInfo
 */
export type ChangeReferenceResolveInfo = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "ChangeReferenceResolveInfo",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-AddReferenceTarget
 */
export type AddReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "AddReferenceTarget",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "DeleteReferenceTarget",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-ChangeReferenceTarget
 */
export type ChangeReferenceTarget = ICommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "ChangeReferenceTarget",
    protocolMessage?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-CompositeCommand
 */
export type CompositeCommand = ICommand & {
    parts: ICommand;
    reference: LionWebJsonMetaPointer;
    index: number;
    newTarget: LionWebId;
    newResolveInfo: string;
    messageKind: CommandKind; // === "CompositeCommand",
    protocolMessage?: ProtocolMessage[];
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
    | "CompositeCommand";
