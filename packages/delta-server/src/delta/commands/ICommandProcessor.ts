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

export interface ICommandProcessor {
    CommandResponseFunction(msg: CommandResponseCommand): void

    AddPartitionFunction(msg: AddPartitionCommand): void

    DeletePartitionFunction(msg: DeletePartitionCommand): void

    ChangeClassifierFunction(msg: ChangeClassifierCommand): void

    AddPropertyFunction(msg: AddPropertyCommand): void

    DeletePropertyFunction(msg: DeletePropertyCommand): void

    ChangePropertyFunction(msg: ChangePropertyCommand): void

    AddChildFunction(msg: AddChildCommand): void

    DeleteChildFunction(msg: DeleteChildCommand): void

    ReplaceChildFunction(msg: ReplaceChildCommand): void

    MoveChildFromOtherContainmentFunction(msg: MoveChildFromOtherContainmentCommand): void

    MoveChildFromOtherContainmentInSameParentFunction(msg: MoveChildFromOtherContainmentInSameParentCommand): void

    MoveChildInSameContainmentFunction(msg: MoveChildInSameContainmentCommand): void

    MoveAndReplaceChildFromOtherContainmentFunction(msg: MoveAndReplaceChildFromOtherContainmentCommand): void

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): void

    MoveAndReplaceChildInSameContainmentFunction(msg: MoveAndReplaceChildInSameContainmentCommand): void

    AddAnnotationFunction(msg: AddAnnotationCommand): void

    DeleteAnnotationFunction(msg: DeleteAnnotationCommand): void

    ReplaceAnnotationFunction(msg: ReplaceAnnotationCommand): void

    MoveAnnotationFromOtherParentFunction(msg: MoveAnnotationFromOtherParentCommand): void

    MoveAnnotationInSameParentFunction(msg: MoveAnnotationInSameParentCommand): void

    MoveAndReplaceAnnotationFromOtherParentFunction(msg: MoveAndReplaceAnnotationFromOtherParentCommand): void

    MoveAndReplaceAnnotationInSameParentFunction(msg: MoveAndReplaceAnnotationInSameParentCommand): void

    AddReferenceFunction(msg: AddReferenceCommand): void

    DeleteReferenceFunction(msg: DeleteReferenceCommand): void

    ChangeReferenceFunction(msg: ChangeReferenceCommand): void

    MoveEntryFromOtherReferenceFunction(msg: MoveEntryFromOtherReferenceCommand): void

    MoveEntryFromOtherReferenceInSameParentFunction(msg: MoveEntryFromOtherReferenceInSameParentCommand): void

    MoveEntryInSameReferenceFunction(msg: MoveEntryInSameReferenceCommand): void

    MoveAndReplaceEntryFromOtherReferenceFunction(msg: MoveAndReplaceEntryFromOtherReferenceCommand): void

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): void

    MoveAndReplaceEntryInSameReferenceFunction(msg: MoveAndReplaceEntryInSameReferenceCommand): void

    AddReferenceResolveInfoFunction(msg: AddReferenceResolveInfoCommand): void

    DeleteReferenceResolveInfoFunction(msg: DeleteReferenceResolveInfoCommand): void

    ChangeReferenceResolveInfoFunction(msg: ChangeReferenceResolveInfoCommand): void

    AddReferenceTargetFunction(msg: AddReferenceTargetCommand): void

    DeleteReferenceTargetFunction(msg: DeleteReferenceTargetCommand): void

    ChangeReferenceTargetFunction(msg: ChangeReferenceTargetCommand): void

    CompositeCommandFunction(msg: CompositeCommandCommand): void
}
