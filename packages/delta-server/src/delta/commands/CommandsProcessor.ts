import {
    AddAnnotationCommand,
    AddChildCommand,
    AddPartitionCommand,
    AddPropertyCommand,
    AddReferenceCommand,
    AddReferenceResolveInfoCommand,
    AddReferenceTargetCommand,
    ChangeClassifierCommand,
    ChangePropertyCommand,
    ChangeReferenceCommand,
    ChangeReferenceResolveInfoCommand,
    ChangeReferenceTargetCommand,
    CommandResponseCommand,
    CompositeCommandCommand,
    DeleteAnnotationCommand,
    DeleteChildCommand,
    DeletePartitionCommand,
    DeletePropertyCommand,
    DeleteReferenceCommand,
    DeleteReferenceResolveInfoCommand,
    DeleteReferenceTargetCommand,
    MoveAndReplaceAnnotationFromOtherParentCommand,
    MoveAndReplaceAnnotationInSameParentCommand,
    MoveAndReplaceChildFromOtherContainmentCommand,
    MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    MoveAndReplaceChildInSameContainmentCommand,
    MoveAndReplaceEntryFromOtherReferenceCommand,
    MoveAndReplaceEntryFromOtherReferenceInSameParentCommand,
    MoveAndReplaceEntryInSameReferenceCommand,
    MoveAnnotationFromOtherParentCommand,
    MoveAnnotationInSameParentCommand,
    MoveChildFromOtherContainmentCommand,
    MoveChildFromOtherContainmentInSameParentCommand,
    MoveChildInSameContainmentCommand,
    MoveEntryFromOtherReferenceCommand,
    MoveEntryFromOtherReferenceInSameParentCommand,
    MoveEntryInSameReferenceCommand,
    ReplaceAnnotationCommand,
    ReplaceChildCommand
} from "@lionweb/server-delta-shared"

export function CommandResponseFunction(msg: CommandResponseCommand): void {
    console.log("Called CommandResponseFunction " + msg.messageKind);
}

export function AddPartitionFunction(msg: AddPartitionCommand): void {
    console.log("Called AddPartitionFunction " + msg.messageKind);
}

export function DeletePartitionFunction(msg: DeletePartitionCommand): void {
    console.log("Called DeletePartitionFunction " + msg.messageKind);
}

export function ChangeClassifierFunction(msg: ChangeClassifierCommand): void {
    console.log("Called ChangeClassifierFunction " + msg.messageKind);
}

export function AddPropertyFunction(msg: AddPropertyCommand): void {
    console.log("Called AddPropertyFunction " + msg.messageKind);
}

export function DeletePropertyFunction(msg: DeletePropertyCommand): void {
    console.log("Called DeletePropertyFunction " + msg.messageKind);
}

export function ChangePropertyFunction(msg: ChangePropertyCommand): void {
    console.log("Called ChangePropertyFunction " + msg.messageKind);
}

export function AddChildFunction(msg: AddChildCommand): void {
    console.log("Called AddChildFunction " + msg.messageKind);
}

export function DeleteChildFunction(msg: DeleteChildCommand): void {
    console.log("Called DeleteChildFunction " + msg.messageKind);
}

export function ReplaceChildFunction(msg: ReplaceChildCommand): void {
    console.log("Called ReplaceChildFunction " + msg.messageKind);
}

export function MoveChildFromOtherContainmentFunction(msg: MoveChildFromOtherContainmentCommand): void {
    console.log("Called MoveChildFromOtherContainmentFunction " + msg.messageKind);
}

export function MoveChildFromOtherContainmentInSameParentFunction(msg: MoveChildFromOtherContainmentInSameParentCommand): void {
    console.log("Called MoveChildFromOtherContainmentInSameParentFunction " + msg.messageKind);
}

export function MoveChildInSameContainmentFunction(msg: MoveChildInSameContainmentCommand): void {
    console.log("Called MoveChildInSameContainmentFunction " + msg.messageKind);
}

export function MoveAndReplaceChildFromOtherContainmentFunction(msg: MoveAndReplaceChildFromOtherContainmentCommand): void {
    console.log("Called MoveAndReplaceChildFromOtherContainmentFunction " + msg.messageKind);
}

export function MoveAndReplaceChildFromOtherContainmentInSameParentFunction(msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): void {
    console.log("Called MoveAndReplaceChildFromOtherContainmentInSameParentFunction " + msg.messageKind);
}

export function MoveAndReplaceChildInSameContainmentFunction(msg: MoveAndReplaceChildInSameContainmentCommand): void {
    console.log("Called MoveAndReplaceChildInSameContainmentFunction " + msg.messageKind);
}

export function AddAnnotationFunction(msg: AddAnnotationCommand): void {
    console.log("Called AddAnnotationFunction " + msg.messageKind);
}

export function DeleteAnnotationFunction(msg: DeleteAnnotationCommand): void {
    console.log("Called DeleteAnnotationFunction " + msg.messageKind);
}

export function ReplaceAnnotationFunction(msg: ReplaceAnnotationCommand): void {
    console.log("Called ReplaceAnnotationFunction " + msg.messageKind);
}

export function MoveAnnotationFromOtherParentFunction(msg: MoveAnnotationFromOtherParentCommand): void {
    console.log("Called MoveAnnotationFromOtherParentFunction " + msg.messageKind);
}

export function MoveAnnotationInSameParentFunction(msg: MoveAnnotationInSameParentCommand): void {
    console.log("Called MoveAnnotationInSameParentFunction " + msg.messageKind);
}

export function MoveAndReplaceAnnotationFromOtherParentFunction(msg: MoveAndReplaceAnnotationFromOtherParentCommand): void {
    console.log("Called MoveAndReplaceAnnotationFromOtherParentFunction " + msg.messageKind);
}

export function MoveAndReplaceAnnotationInSameParentFunction(msg: MoveAndReplaceAnnotationInSameParentCommand): void {
    console.log("Called MoveAndReplaceAnnotationInSameParentFunction " + msg.messageKind);
}

export function AddReferenceFunction(msg: AddReferenceCommand): void {
    console.log("Called AddReferenceFunction " + msg.messageKind);
}

export function DeleteReferenceFunction(msg: DeleteReferenceCommand): void {
    console.log("Called DeleteReferenceFunction " + msg.messageKind);
}

export function ChangeReferenceFunction(msg: ChangeReferenceCommand): void {
    console.log("Called ChangeReferenceFunction " + msg.messageKind);
}

export function MoveEntryFromOtherReferenceFunction(msg: MoveEntryFromOtherReferenceCommand): void {
    console.log("Called MoveEntryFromOtherReferenceFunction " + msg.messageKind);
}

export function MoveEntryFromOtherReferenceInSameParentFunction(msg: MoveEntryFromOtherReferenceInSameParentCommand): void {
    console.log("Called MoveEntryFromOtherReferenceInSameParentFunction " + msg.messageKind);
}

export function MoveEntryInSameReferenceFunction(msg: MoveEntryInSameReferenceCommand): void {
    console.log("Called MoveEntryInSameReferenceFunction " + msg.messageKind);
}

export function MoveAndReplaceEntryFromOtherReferenceFunction(msg: MoveAndReplaceEntryFromOtherReferenceCommand): void {
    console.log("Called MoveAndReplaceEntryFromOtherReferenceFunction " + msg.messageKind);
}

export function MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): void {
    console.log("Called MoveAndReplaceEntryFromOtherReferenceInSameParentFunction " + msg.messageKind);
}

export function MoveAndReplaceEntryInSameReferenceFunction(msg: MoveAndReplaceEntryInSameReferenceCommand): void {
    console.log("Called MoveAndReplaceEntryInSameReferenceFunction " + msg.messageKind);
}

export function AddReferenceResolveInfoFunction(msg: AddReferenceResolveInfoCommand): void {
    console.log("Called AddReferenceResolveInfoFunction " + msg.messageKind);
}

export function DeleteReferenceResolveInfoFunction(msg: DeleteReferenceResolveInfoCommand): void {
    console.log("Called DeleteReferenceResolveInfoFunction " + msg.messageKind);
}

export function ChangeReferenceResolveInfoFunction(msg: ChangeReferenceResolveInfoCommand): void {
    console.log("Called ChangeReferenceResolveInfoFunction " + msg.messageKind);
}

export function AddReferenceTargetFunction(msg: AddReferenceTargetCommand): void {
    console.log("Called AddReferenceTargetFunction " + msg.messageKind);
}

export function DeleteReferenceTargetFunction(msg: DeleteReferenceTargetCommand): void {
    console.log("Called DeleteReferenceTargetFunction " + msg.messageKind);
}

export function ChangeReferenceTargetFunction(msg: ChangeReferenceTargetCommand): void {
    console.log("Called ChangeReferenceTargetFunction " + msg.messageKind);
}

export function CompositeCommandFunction(msg: CompositeCommandCommand): void {
    console.log("Called CompositeCommandFunction " + msg.messageKind);
}
