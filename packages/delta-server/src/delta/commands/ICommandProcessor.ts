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
import WebSocket from 'ws';

export interface ICommandProcessor {
    CommandResponseFunction(socket: WebSocket, msg: CommandResponseCommand): void

    AddPartitionFunction(socket: WebSocket, msg: AddPartitionCommand): void

    DeletePartitionFunction(socket: WebSocket, msg: DeletePartitionCommand): void

    ChangeClassifierFunction(socket: WebSocket, msg: ChangeClassifierCommand): void

    AddPropertyFunction(socket: WebSocket, msg: AddPropertyCommand): void

    DeletePropertyFunction(socket: WebSocket, msg: DeletePropertyCommand): void

    ChangePropertyFunction(socket: WebSocket, msg: ChangePropertyCommand): void

    AddChildFunction(socket: WebSocket, msg: AddChildCommand): void

    DeleteChildFunction(socket: WebSocket, msg: DeleteChildCommand): void

    ReplaceChildFunction(socket: WebSocket, msg: ReplaceChildCommand): void

    MoveChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentCommand): void

    MoveChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentInSameParentCommand): void

    MoveChildInSameContainmentFunction(socket: WebSocket, msg: MoveChildInSameContainmentCommand): void

    MoveAndReplaceChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentCommand): void

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): void

    MoveAndReplaceChildInSameContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildInSameContainmentCommand): void

    AddAnnotationFunction(socket: WebSocket, msg: AddAnnotationCommand): void

    DeleteAnnotationFunction(socket: WebSocket, msg: DeleteAnnotationCommand): void

    ReplaceAnnotationFunction(socket: WebSocket, msg: ReplaceAnnotationCommand): void

    MoveAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAnnotationFromOtherParentCommand): void

    MoveAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAnnotationInSameParentCommand): void

    MoveAndReplaceAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationFromOtherParentCommand): void

    MoveAndReplaceAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationInSameParentCommand): void

    AddReferenceFunction(socket: WebSocket, msg: AddReferenceCommand): void

    DeleteReferenceFunction(socket: WebSocket, msg: DeleteReferenceCommand): void

    ChangeReferenceFunction(socket: WebSocket, msg: ChangeReferenceCommand): void

    MoveEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceCommand): void

    MoveEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceInSameParentCommand): void

    MoveEntryInSameReferenceFunction(socket: WebSocket, msg: MoveEntryInSameReferenceCommand): void

    MoveAndReplaceEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceCommand): void

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): void

    MoveAndReplaceEntryInSameReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryInSameReferenceCommand): void

    AddReferenceResolveInfoFunction(socket: WebSocket, msg: AddReferenceResolveInfoCommand): void

    DeleteReferenceResolveInfoFunction(socket: WebSocket, msg: DeleteReferenceResolveInfoCommand): void

    ChangeReferenceResolveInfoFunction(socket: WebSocket, msg: ChangeReferenceResolveInfoCommand): void

    AddReferenceTargetFunction(socket: WebSocket, msg: AddReferenceTargetCommand): void

    DeleteReferenceTargetFunction(socket: WebSocket, msg: DeleteReferenceTargetCommand): void

    ChangeReferenceTargetFunction(socket: WebSocket, msg: ChangeReferenceTargetCommand): void

    CompositeCommandFunction(socket: WebSocket, msg: CompositeCommandCommand): void
}
