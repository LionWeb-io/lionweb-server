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
    MoveEntryInSameReferenceCommand, PropertyAddedEvent, PropertyChangedEvent, PropertyDeletedEvent,
    ReplaceAnnotationCommand,
    ReplaceChildCommand
} from "@lionweb/server-delta-shared"
import { activeSockets } from "../DeltaClientAdmin.js";
import { ICommandProcessor } from "./ICommandProcessor.js"
import WebSocket from 'ws';

export class CommandProcessor implements ICommandProcessor {
    CommandResponseFunction(socket: WebSocket, msg: CommandResponseCommand): void {
        console.log("Called CommandResponseFunction " + msg.messageKind)
    }

    AddPartitionFunction(socket: WebSocket, msg: AddPartitionCommand): void {
        console.log("Called AddPartitionFunction " + msg.messageKind)
    }

    DeletePartitionFunction(socket: WebSocket, msg: DeletePartitionCommand): void {
        console.log("Called DeletePartitionFunction " + msg.messageKind)
    }

    ChangeClassifierFunction(socket: WebSocket, msg: ChangeClassifierCommand): void {
        console.log("Called ChangeClassifierFunction " + msg.messageKind)
    }

    AddPropertyFunction(socket: WebSocket, msg: AddPropertyCommand): void {
        console.log("Called AddPropertyFunction " + msg.messageKind)
        const pInfo = activeSockets.get(socket)
        const event: PropertyAddedEvent = {
            messageKind: "PropertyAdded",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: pInfo!.participationId} ],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            protocolMessages: []
        }
        console.log(`Sending ${JSON.stringify(event)}`)
        for(const pInfo of activeSockets.values()) {
            event.sequenceNumber = pInfo.eventSequenceNumber++ 
            pInfo.socket.send(JSON.stringify(event))
        }
    }

    DeletePropertyFunction(socket: WebSocket, msg: DeletePropertyCommand): void {
        console.log("Called DeletePropertyFunction " + msg.messageKind)
        const pInfo = activeSockets.get(socket)
        const event: PropertyDeletedEvent = {
            messageKind: "PropertyDeleted",
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: pInfo!.participationId} ],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            protocolMessages: [],
            oldValue: "any dummy"
        }
        console.log(`Sending ${JSON.stringify(event)}`)
        for(const pInfo of activeSockets.values()) {
            event.sequenceNumber = pInfo.eventSequenceNumber++
            pInfo.socket.send(JSON.stringify(event))
        }    }

    ChangePropertyFunction(socket: WebSocket, msg: ChangePropertyCommand): void {
        console.log("Called ChangePropertyFunction " + msg.messageKind)
        const pInfo = activeSockets.get(socket)
        const event: PropertyChangedEvent = {
            messageKind: "PropertyChanged",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: pInfo!.participationId} ],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            protocolMessages: [],
            oldValue: "any dummy"
        }
        console.log(`Sending ${JSON.stringify(event)}`)
        for(const pInfo of activeSockets.values()) {
            event.sequenceNumber = pInfo.eventSequenceNumber++
            pInfo.socket.send(JSON.stringify(event))
        }
    }

    AddChildFunction(socket: WebSocket, msg: AddChildCommand): void {
        console.log("Called AddChildFunction " + msg.messageKind)
    }

    DeleteChildFunction(socket: WebSocket, msg: DeleteChildCommand): void {
        console.log("Called DeleteChildFunction " + msg.messageKind)
    }

    ReplaceChildFunction(socket: WebSocket, msg: ReplaceChildCommand): void {
        console.log("Called ReplaceChildFunction " + msg.messageKind)
    }

    MoveChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentCommand): void {
        console.log("Called MoveChildFromOtherContainmentFunction " + msg.messageKind)
    }

    MoveChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentInSameParentCommand): void {
        console.log("Called MoveChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    MoveChildInSameContainmentFunction(socket: WebSocket, msg: MoveChildInSameContainmentCommand): void {
        console.log("Called MoveChildInSameContainmentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentCommand): void {
        console.log("Called MoveAndReplaceChildFromOtherContainmentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): void {
        console.log("Called MoveAndReplaceChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceChildInSameContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildInSameContainmentCommand): void {
        console.log("Called MoveAndReplaceChildInSameContainmentFunction " + msg.messageKind)
    }

    AddAnnotationFunction(socket: WebSocket, msg: AddAnnotationCommand): void {
        console.log("Called AddAnnotationFunction " + msg.messageKind)
    }

    DeleteAnnotationFunction(socket: WebSocket, msg: DeleteAnnotationCommand): void {
        console.log("Called DeleteAnnotationFunction " + msg.messageKind)
    }

    ReplaceAnnotationFunction(socket: WebSocket, msg: ReplaceAnnotationCommand): void {
        console.log("Called ReplaceAnnotationFunction " + msg.messageKind)
    }

    MoveAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAnnotationFromOtherParentCommand): void {
        console.log("Called MoveAnnotationFromOtherParentFunction " + msg.messageKind)
    }

    MoveAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAnnotationInSameParentCommand): void {
        console.log("Called MoveAnnotationInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationFromOtherParentCommand): void {
        console.log("Called MoveAndReplaceAnnotationFromOtherParentFunction " + msg.messageKind)
    }

    MoveAndReplaceAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationInSameParentCommand): void {
        console.log("Called MoveAndReplaceAnnotationInSameParentFunction " + msg.messageKind)
    }

    AddReferenceFunction(socket: WebSocket, msg: AddReferenceCommand): void {
        console.log("Called AddReferenceFunction " + msg.messageKind)
    }

    DeleteReferenceFunction(socket: WebSocket, msg: DeleteReferenceCommand): void {
        console.log("Called DeleteReferenceFunction " + msg.messageKind)
    }

    ChangeReferenceFunction(socket: WebSocket, msg: ChangeReferenceCommand): void {
        console.log("Called ChangeReferenceFunction " + msg.messageKind)
    }

    MoveEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceCommand): void {
        console.log("Called MoveEntryFromOtherReferenceFunction " + msg.messageKind)
    }

    MoveEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceInSameParentCommand): void {
        console.log("Called MoveEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    MoveEntryInSameReferenceFunction(socket: WebSocket, msg: MoveEntryInSameReferenceCommand): void {
        console.log("Called MoveEntryInSameReferenceFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceCommand): void {
        console.log("Called MoveAndReplaceEntryFromOtherReferenceFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): void {
        console.log("Called MoveAndReplaceEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

    MoveAndReplaceEntryInSameReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryInSameReferenceCommand): void {
        console.log("Called MoveAndReplaceEntryInSameReferenceFunction " + msg.messageKind)
    }

    AddReferenceResolveInfoFunction(socket: WebSocket, msg: AddReferenceResolveInfoCommand): void {
        console.log("Called AddReferenceResolveInfoFunction " + msg.messageKind)
    }

    DeleteReferenceResolveInfoFunction(socket: WebSocket, msg: DeleteReferenceResolveInfoCommand): void {
        console.log("Called DeleteReferenceResolveInfoFunction " + msg.messageKind)
    }

    ChangeReferenceResolveInfoFunction(socket: WebSocket, msg: ChangeReferenceResolveInfoCommand): void {
        console.log("Called ChangeReferenceResolveInfoFunction " + msg.messageKind)
    }

    AddReferenceTargetFunction(socket: WebSocket, msg: AddReferenceTargetCommand): void {
        console.log("Called AddReferenceTargetFunction " + msg.messageKind)
    }

    DeleteReferenceTargetFunction(socket: WebSocket, msg: DeleteReferenceTargetCommand): void {
        console.log("Called DeleteReferenceTargetFunction " + msg.messageKind)
    }

    ChangeReferenceTargetFunction(socket: WebSocket, msg: ChangeReferenceTargetCommand): void {
        console.log("Called ChangeReferenceTargetFunction " + msg.messageKind)
    }

    CompositeCommandFunction(socket: WebSocket, msg: CompositeCommandCommand): void {
        console.log("Called CompositeCommandFunction " + msg.messageKind)
    }
}
