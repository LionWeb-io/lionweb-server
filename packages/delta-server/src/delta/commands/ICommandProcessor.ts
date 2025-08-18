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
    DeleteReferenceTargetCommand, EventType,
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
    CommandResponseFunction(socket: WebSocket, msg: CommandResponseCommand): EventType

    AddPartitionFunction(socket: WebSocket, msg: AddPartitionCommand): EventType

    DeletePartitionFunction(socket: WebSocket, msg: DeletePartitionCommand): EventType

    ChangeClassifierFunction(socket: WebSocket, msg: ChangeClassifierCommand): EventType

    AddPropertyFunction(socket: WebSocket, msg: AddPropertyCommand): EventType

    DeletePropertyFunction(socket: WebSocket, msg: DeletePropertyCommand): EventType

    ChangePropertyFunction(socket: WebSocket, msg: ChangePropertyCommand): EventType

    AddChildFunction(socket: WebSocket, msg: AddChildCommand): EventType

    DeleteChildFunction(socket: WebSocket, msg: DeleteChildCommand): EventType

    ReplaceChildFunction(socket: WebSocket, msg: ReplaceChildCommand): EventType

    MoveChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentCommand): EventType

    MoveChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentInSameParentCommand): EventType

    MoveChildInSameContainmentFunction(socket: WebSocket, msg: MoveChildInSameContainmentCommand): EventType

    MoveAndReplaceChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentCommand): EventType

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): EventType

    MoveAndReplaceChildInSameContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildInSameContainmentCommand): EventType

    AddAnnotationFunction(socket: WebSocket, msg: AddAnnotationCommand): EventType

    DeleteAnnotationFunction(socket: WebSocket, msg: DeleteAnnotationCommand): EventType

    ReplaceAnnotationFunction(socket: WebSocket, msg: ReplaceAnnotationCommand): EventType

    MoveAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAnnotationFromOtherParentCommand): EventType

    MoveAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAnnotationInSameParentCommand): EventType

    MoveAndReplaceAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationFromOtherParentCommand): EventType

    MoveAndReplaceAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationInSameParentCommand): EventType

    AddReferenceFunction(socket: WebSocket, msg: AddReferenceCommand): EventType

    DeleteReferenceFunction(socket: WebSocket, msg: DeleteReferenceCommand): EventType

    ChangeReferenceFunction(socket: WebSocket, msg: ChangeReferenceCommand): EventType

    MoveEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceCommand): EventType

    MoveEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceInSameParentCommand): EventType

    MoveEntryInSameReferenceFunction(socket: WebSocket, msg: MoveEntryInSameReferenceCommand): EventType

    MoveAndReplaceEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceCommand): EventType

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): EventType

    MoveAndReplaceEntryInSameReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryInSameReferenceCommand): EventType

    AddReferenceResolveInfoFunction(socket: WebSocket, msg: AddReferenceResolveInfoCommand): EventType

    DeleteReferenceResolveInfoFunction(socket: WebSocket, msg: DeleteReferenceResolveInfoCommand): EventType

    ChangeReferenceResolveInfoFunction(socket: WebSocket, msg: ChangeReferenceResolveInfoCommand): EventType

    AddReferenceTargetFunction(socket: WebSocket, msg: AddReferenceTargetCommand): EventType

    DeleteReferenceTargetFunction(socket: WebSocket, msg: DeleteReferenceTargetCommand): EventType

    ChangeReferenceTargetFunction(socket: WebSocket, msg: ChangeReferenceTargetCommand): EventType

    CompositeCommandFunction(socket: WebSocket, msg: CompositeCommandCommand): EventType
}
