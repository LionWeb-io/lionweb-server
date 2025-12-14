import { CommandId } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";
import { LionWebJsonMetaPointer } from "./Chunks.js";
import { Number } from "./DeltaTypes.js";
// cannot find import for Command

// The overall "super-type"
export type DeltaCommand = {
    commandId: CommandId;
    messageKind: CommandMessageKind;
    protocolMessages: ProtocolMessage[];
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddPartition
 */
export type AddPartitionCommand = DeltaCommand & {
    newPartition: LionWebDeltaJsonChunk;
    messageKind: "AddPartition";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeletePartition
 */
export type DeletePartitionCommand = DeltaCommand & {
    deletedPartition: LionWebId;
    messageKind: "DeletePartition";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ChangeClassifier
 */
export type ChangeClassifierCommand = DeltaCommand & {
    newClassifier: LionWebJsonMetaPointer;
    node: LionWebId;
    messageKind: "ChangeClassifier";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddProperty
 */
export type AddPropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    messageKind: "AddProperty";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ChangeProperty
 */
export type ChangePropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    messageKind: "ChangeProperty";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteProperty
 */
export type DeletePropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: "DeleteProperty";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddChild
 */
export type AddChildCommand = DeltaCommand & {
    parent: LionWebId;
    newChild: LionWebDeltaJsonChunk;
    containment: LionWebJsonMetaPointer;
    index: Number;
    messageKind: "AddChild";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteChild
 */
export type DeleteChildCommand = DeltaCommand & {
    parent: LionWebId;
    deletedChild: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: Number;
    messageKind: "DeleteChild";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ReplaceChild
 */
export type ReplaceChildCommand = DeltaCommand & {
    parent: LionWebId;
    newChild: LionWebDeltaJsonChunk;
    containment: LionWebJsonMetaPointer;
    index: Number;
    replacedChild: LionWebId;
    messageKind: "ReplaceChild";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainmentCommand = DeltaCommand & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildFromOtherContainment";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParentCommand = DeltaCommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildFromOtherContainmentInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainmentCommand = DeltaCommand & {
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildInSameContainment";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceChildFromOtherContainment
 */
export type MoveAndReplaceChildFromOtherContainmentCommand = DeltaCommand & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    messageKind: "MoveAndReplaceChildFromOtherContainment";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParentCommand = DeltaCommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    messageKind: "MoveAndReplaceChildFromOtherContainmentInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainmentCommand = DeltaCommand & {
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    messageKind: "MoveAndReplaceChildInSameContainment";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddAnnotation
 */
export type AddAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    messageKind: "AddAnnotation";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteAnnotation
 */
export type DeleteAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    index: Number;
    deletedAnnotation: LionWebId;
    messageKind: "DeleteAnnotation";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    replacedAnnotation: LionWebId;
    messageKind: "ReplaceAnnotation";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParentCommand = DeltaCommand & {
    newParent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationFromOtherParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParentCommand = DeltaCommand & {
    newIndex: Number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParentCommand = DeltaCommand & {
    newParent: LionWebId;
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationFromOtherParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParentCommand = DeltaCommand & {
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddReference
 */
export type AddReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId | null;
    newResolveInfo: String | null;
    messageKind: "AddReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteReference
 */
export type DeleteReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId | null;
    deletedResolveInfo: String | null;
    messageKind: "DeleteReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ChangeReference
 */
export type ChangeReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    oldTarget: LionWebId | null;
    oldResolveInfo: String | null;
    newTarget: LionWebId | null;
    newResolveInfo: String | null;
    messageKind: "ChangeReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReferenceCommand = DeltaCommand & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveEntryFromOtherReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParentCommand = DeltaCommand & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveEntryFromOtherReferenceInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveEntryInSameReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReferenceCommand = DeltaCommand & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    replacedResolveInfo: String | null;
    replacedTarget: LionWebId | null;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveAndReplaceEntryFromOtherReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParentCommand = DeltaCommand & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    replacedResolveInfo: String | null;
    replacedTarget: LionWebId | null;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    replacedResolveInfo: String | null;
    replacedTarget: LionWebId | null;
    movedResolveInfo: String | null;
    movedTarget: LionWebId | null;
    messageKind: "MoveAndReplaceEntryInSameReference";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfoCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newResolveInfo: String;
    messageKind: "AddReferenceResolveInfo";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfoCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedResolveInfo: String;
    messageKind: "DeleteReferenceResolveInfo";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ChangeReferenceResolveInfo
 */
export type ChangeReferenceResolveInfoCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newResolveInfo: String;
    oldResolveInfo: String;
    messageKind: "ChangeReferenceResolveInfo";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-AddReferenceTarget
 */
export type AddReferenceTargetCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    messageKind: "AddReferenceTarget";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTargetCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId;
    messageKind: "DeleteReferenceTarget";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-ChangeReferenceTarget
 */
export type ChangeReferenceTargetCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    oldTarget: LionWebId;
    messageKind: "ChangeReferenceTarget";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#cmd-CompositeCommand
 */
export type CompositeCommand = DeltaCommand & {
    parts: DeltaCommand[];
    messageKind: "CompositeCommand";
};

// The type for the tagged union property
export type CommandMessageKind =
    | "AddPartition"
    | "DeletePartition"
    | "ChangeClassifier"
    | "AddProperty"
    | "ChangeProperty"
    | "DeleteProperty"
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

// Type Guard function
export function isDeltaCommand(object: unknown): object is DeltaCommand {
    const castObject = object as DeltaCommand;
    return (
        castObject.messageKind !== undefined &&
        [
            "AddPartition",
            "DeletePartition",
            "ChangeClassifier",
            "AddProperty",
            "ChangeProperty",
            "DeleteProperty",
            "AddChild",
            "DeleteChild",
            "ReplaceChild",
            "MoveChildFromOtherContainment",
            "MoveChildFromOtherContainmentInSameParent",
            "MoveChildInSameContainment",
            "MoveAndReplaceChildFromOtherContainment",
            "MoveAndReplaceChildFromOtherContainmentInSameParent",
            "MoveAndReplaceChildInSameContainment",
            "AddAnnotation",
            "DeleteAnnotation",
            "ReplaceAnnotation",
            "MoveAnnotationFromOtherParent",
            "MoveAnnotationInSameParent",
            "MoveAndReplaceAnnotationFromOtherParent",
            "MoveAndReplaceAnnotationInSameParent",
            "AddReference",
            "DeleteReference",
            "ChangeReference",
            "MoveEntryFromOtherReference",
            "MoveEntryFromOtherReferenceInSameParent",
            "MoveEntryInSameReference",
            "MoveAndReplaceEntryFromOtherReference",
            "MoveAndReplaceEntryFromOtherReferenceInSameParent",
            "MoveAndReplaceEntryInSameReference",
            "AddReferenceResolveInfo",
            "DeleteReferenceResolveInfo",
            "ChangeReferenceResolveInfo",
            "AddReferenceTarget",
            "DeleteReferenceTarget",
            "ChangeReferenceTarget",
            "CompositeCommand",
        ].includes(castObject.messageKind)
    );
}
