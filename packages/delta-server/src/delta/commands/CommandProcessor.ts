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
import { ICommandProcessor } from "./ICommandProcessor.js"

export class CommandProcessor implements ICommandProcessor {
    CommandResponseFunction(msg: CommandResponseCommand): void {
        console.log("Called CommandResponseFunction " + msg.messageKind)
    }

    AddPartitionFunction(msg: AddPartitionCommand): void {
        console.log("Called AddPartitionFunction " + msg.messageKind)
    }

    DeletePartitionFunction(msg: DeletePartitionCommand): void {
        console.log("Called DeletePartitionFunction " + msg.messageKind)
    }

    ChangeClassifierFunction(msg: ChangeClassifierCommand): void {
        console.log("Called ChangeClassifierFunction " + msg.messageKind)
    }

    AddPropertyFunction(msg: AddPropertyCommand): void {
        console.log("Called AddPropertyFunction " + msg.messageKind)
    }

    DeletePropertyFunction(msg: DeletePropertyCommand): void {
        console.log("Called DeletePropertyFunction " + msg.messageKind)
    }

    ChangePropertyFunction(msg: ChangePropertyCommand): void {
        console.log("Called ChangePropertyFunction " + msg.messageKind)
    }

    AddChildFunction(msg: AddChildCommand): void {
        console.log("Called AddChildFunction " + msg.messageKind)
    }

    DeleteChildFunction(msg: DeleteChildCommand): void {
        console.log("Called DeleteChildFunction " + msg.messageKind)
    }

    ReplaceChildFunction(msg: ReplaceChildCommand): void {
        console.log("Called ReplaceChildFunction " + msg.messageKind)
    }

    MoveChildFromOtherContainmentFunction(msg: MoveChildFromOtherContainmentCommand): void {
        console.log("Called MoveChildFromOtherContainmentFunction " + msg.messageKind)
    }

    MoveChildFromOtherContainmentInSameParentFunction(msg: MoveChildFromOtherContainmentInSameParentCommand): void {
        console.log("Called MoveChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    MoveChildInSameContainmentFunction(msg: MoveChildInSameContainmentCommand): void {
        console.log("Called MoveChildInSameContainmentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildFromOtherContainmentFunction(msg: MoveAndReplaceChildFromOtherContainmentCommand): void {
        console.log("Called MoveAndReplaceChildFromOtherContainmentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): void {
        console.log("Called MoveAndReplaceChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildInSameContainmentFunction(msg: MoveAndReplaceChildInSameContainmentCommand): void {
        console.log("Called MoveAndReplaceChildInSameContainmentFunction " + msg.messageKind)
    }

    AddAnnotationFunction(msg: AddAnnotationCommand): void {
        console.log("Called AddAnnotationFunction " + msg.messageKind)
    }

    DeleteAnnotationFunction(msg: DeleteAnnotationCommand): void {
        console.log("Called DeleteAnnotationFunction " + msg.messageKind)
    }

    ReplaceAnnotationFunction(msg: ReplaceAnnotationCommand): void {
        console.log("Called ReplaceAnnotationFunction " + msg.messageKind)
    }

    MoveAnnotationFromOtherParentFunction(msg: MoveAnnotationFromOtherParentCommand): void {
        console.log("Called MoveAnnotationFromOtherParentFunction " + msg.messageKind)
    }

    MoveAnnotationInSameParentFunction(msg: MoveAnnotationInSameParentCommand): void {
        console.log("Called MoveAnnotationInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceAnnotationFromOtherParentFunction(msg: MoveAndReplaceAnnotationFromOtherParentCommand): void {
        console.log("Called MoveAndReplaceAnnotationFromOtherParentFunction " + msg.messageKind)
    }

    MoveAndReplaceAnnotationInSameParentFunction(msg: MoveAndReplaceAnnotationInSameParentCommand): void {
        console.log("Called MoveAndReplaceAnnotationInSameParentFunction " + msg.messageKind)
    }

    AddReferenceFunction(msg: AddReferenceCommand): void {
        console.log("Called AddReferenceFunction " + msg.messageKind)
    }

    DeleteReferenceFunction(msg: DeleteReferenceCommand): void {
        console.log("Called DeleteReferenceFunction " + msg.messageKind)
    }

    ChangeReferenceFunction(msg: ChangeReferenceCommand): void {
        console.log("Called ChangeReferenceFunction " + msg.messageKind)
    }

    MoveEntryFromOtherReferenceFunction(msg: MoveEntryFromOtherReferenceCommand): void {
        console.log("Called MoveEntryFromOtherReferenceFunction " + msg.messageKind)
    }

    MoveEntryFromOtherReferenceInSameParentFunction(msg: MoveEntryFromOtherReferenceInSameParentCommand): void {
        console.log("Called MoveEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    MoveEntryInSameReferenceFunction(msg: MoveEntryInSameReferenceCommand): void {
        console.log("Called MoveEntryInSameReferenceFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryFromOtherReferenceFunction(msg: MoveAndReplaceEntryFromOtherReferenceCommand): void {
        console.log("Called MoveAndReplaceEntryFromOtherReferenceFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): void {
        console.log("Called MoveAndReplaceEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryInSameReferenceFunction(msg: MoveAndReplaceEntryInSameReferenceCommand): void {
        console.log("Called MoveAndReplaceEntryInSameReferenceFunction " + msg.messageKind)
    }

    AddReferenceResolveInfoFunction(msg: AddReferenceResolveInfoCommand): void {
        console.log("Called AddReferenceResolveInfoFunction " + msg.messageKind)
    }

    DeleteReferenceResolveInfoFunction(msg: DeleteReferenceResolveInfoCommand): void {
        console.log("Called DeleteReferenceResolveInfoFunction " + msg.messageKind)
    }

    ChangeReferenceResolveInfoFunction(msg: ChangeReferenceResolveInfoCommand): void {
        console.log("Called ChangeReferenceResolveInfoFunction " + msg.messageKind)
    }

    AddReferenceTargetFunction(msg: AddReferenceTargetCommand): void {
        console.log("Called AddReferenceTargetFunction " + msg.messageKind)
    }

    DeleteReferenceTargetFunction(msg: DeleteReferenceTargetCommand): void {
        console.log("Called DeleteReferenceTargetFunction " + msg.messageKind)
    }

    ChangeReferenceTargetFunction(msg: ChangeReferenceTargetCommand): void {
        console.log("Called ChangeReferenceTargetFunction " + msg.messageKind)
    }

    CompositeCommandFunction(msg: CompositeCommandCommand): void {
        console.log("Called CompositeCommandFunction " + msg.messageKind)
    }
}
