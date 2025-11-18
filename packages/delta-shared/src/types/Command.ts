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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddPartition
 */
export type AddPartitionCommand = DeltaCommand & {
    newPartition: LionWebDeltaJsonChunk;
    messageKind: "AddPartition";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeletePartition
 */
export type DeletePartitionCommand = DeltaCommand & {
    deletedPartition: LionWebId;
    messageKind: "DeletePartition";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeClassifier
 */
export type ChangeClassifierCommand = DeltaCommand & {
    newClassifier: LionWebJsonMetaPointer;
    node: LionWebId;
    messageKind: "ChangeClassifier";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddProperty
 */
export type AddPropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    messageKind: "AddProperty";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeProperty
 */
export type ChangePropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    newValue: String;
    messageKind: "ChangeProperty";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteProperty
 */
export type DeletePropertyCommand = DeltaCommand & {
    node: LionWebId;
    property: LionWebJsonMetaPointer;
    messageKind: "DeleteProperty";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddChild
 */
export type AddChildCommand = DeltaCommand & {
    parent: LionWebId;
    newChild: LionWebDeltaJsonChunk;
    containment: LionWebJsonMetaPointer;
    index: Number;
    messageKind: "AddChild";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteChild
 */
export type DeleteChildCommand = DeltaCommand & {
    parent: LionWebId;
    deletedChild: LionWebId;
    containment: LionWebJsonMetaPointer;
    index: Number;
    messageKind: "DeleteChild";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceChild
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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainment
 */
export type MoveChildFromOtherContainmentCommand = DeltaCommand & {
    newParent: LionWebId;
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildFromOtherContainment";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildFromOtherContainmentInSameParent
 */
export type MoveChildFromOtherContainmentInSameParentCommand = DeltaCommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildFromOtherContainmentInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveChildInSameContainment
 */
export type MoveChildInSameContainmentCommand = DeltaCommand & {
    newIndex: Number;
    movedChild: LionWebId;
    messageKind: "MoveChildInSameContainment";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainment
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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildFromOtherContainmentInSameParent
 */
export type MoveAndReplaceChildFromOtherContainmentInSameParentCommand = DeltaCommand & {
    newContainment: LionWebJsonMetaPointer;
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    messageKind: "MoveAndReplaceChildFromOtherContainmentInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceChildInSameContainment
 */
export type MoveAndReplaceChildInSameContainmentCommand = DeltaCommand & {
    newIndex: Number;
    replacedChild: LionWebId;
    movedChild: LionWebId;
    messageKind: "MoveAndReplaceChildInSameContainment";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddAnnotation
 */
export type AddAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    messageKind: "AddAnnotation";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteAnnotation
 */
export type DeleteAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    index: Number;
    deletedAnnotation: LionWebId;
    messageKind: "DeleteAnnotation";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ReplaceAnnotation
 */
export type ReplaceAnnotationCommand = DeltaCommand & {
    parent: LionWebId;
    newAnnotation: LionWebDeltaJsonChunk;
    index: Number;
    replacedAnnotation: LionWebId;
    messageKind: "ReplaceAnnotation";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationFromOtherParent
 */
export type MoveAnnotationFromOtherParentCommand = DeltaCommand & {
    newParent: LionWebId;
    newIndex: Number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationFromOtherParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAnnotationInSameParent
 */
export type MoveAnnotationInSameParentCommand = DeltaCommand & {
    newIndex: Number;
    movedAnnotation: LionWebId;
    messageKind: "MoveAnnotationInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationFromOtherParent
 */
export type MoveAndReplaceAnnotationFromOtherParentCommand = DeltaCommand & {
    newParent: LionWebId;
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationFromOtherParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceAnnotationInSameParent
 */
export type MoveAndReplaceAnnotationInSameParentCommand = DeltaCommand & {
    newIndex: Number;
    replacedAnnotation: LionWebId;
    movedAnnotation: LionWebId;
    messageKind: "MoveAndReplaceAnnotationInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReference
 */
export type AddReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    newResolveInfo: String;
    messageKind: "AddReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReference
 */
export type DeleteReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId;
    deletedResolveInfo: String;
    messageKind: "DeleteReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReference
 */
export type ChangeReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    oldTarget: LionWebId;
    oldResolveInfo: String;
    newTarget: LionWebId;
    newResolveInfo: String;
    messageKind: "ChangeReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReference
 */
export type MoveEntryFromOtherReferenceCommand = DeltaCommand & {
    newParent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldParent: LionWebId;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    messageKind: "MoveEntryFromOtherReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryFromOtherReferenceInSameParent
 */
export type MoveEntryFromOtherReferenceInSameParentCommand = DeltaCommand & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    messageKind: "MoveEntryFromOtherReferenceInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveEntryInSameReference
 */
export type MoveEntryInSameReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    messageKind: "MoveEntryInSameReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReference
 */
export type MoveAndReplaceEntryFromOtherReferenceCommand = DeltaCommand & {
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
    messageKind: "MoveAndReplaceEntryFromOtherReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryFromOtherReferenceInSameParent
 */
export type MoveAndReplaceEntryFromOtherReferenceInSameParentCommand = DeltaCommand & {
    parent: LionWebId;
    newReference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldReference: LionWebJsonMetaPointer;
    oldIndex: Number;
    replacedResolveInfo: String;
    replacedTarget: LionWebId;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-MoveAndReplaceEntryInSameReference
 */
export type MoveAndReplaceEntryInSameReferenceCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    newIndex: Number;
    oldIndex: Number;
    replacedResolveInfo: String;
    replacedTarget: LionWebId;
    movedResolveInfo: String;
    movedTarget: LionWebId;
    messageKind: "MoveAndReplaceEntryInSameReference";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceResolveInfo
 */
export type AddReferenceResolveInfoCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newResolveInfo: String;
    messageKind: "AddReferenceResolveInfo";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceResolveInfo
 */
export type DeleteReferenceResolveInfoCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedResolveInfo: String;
    messageKind: "DeleteReferenceResolveInfo";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceResolveInfo
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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-AddReferenceTarget
 */
export type AddReferenceTargetCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    newTarget: LionWebId;
    messageKind: "AddReferenceTarget";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-DeleteReferenceTarget
 */
export type DeleteReferenceTargetCommand = DeltaCommand & {
    parent: LionWebId;
    reference: LionWebJsonMetaPointer;
    index: Number;
    deletedTarget: LionWebId;
    messageKind: "DeleteReferenceTarget";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-ChangeReferenceTarget
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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd-CompositeCommand
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
