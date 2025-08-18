import { deltaLogger } from "@lionweb/server-common";
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
    CommandResponseCommand, CommandType,
    CompositeCommandCommand,
    DeleteAnnotationCommand,
    DeleteChildCommand,
    DeletePartitionCommand,
    DeletePropertyCommand,
    DeleteReferenceCommand,
    DeleteReferenceResolveInfoCommand,
    DeleteReferenceTargetCommand, ErrorEvent, EventType,
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
    MoveEntryInSameReferenceCommand, PartitionAddedEvent, PropertyAddedEvent, PropertyChangedEvent, PropertyDeletedEvent,
    ReplaceAnnotationCommand,
    ReplaceChildCommand
} from "@lionweb/server-delta-shared"
import { activeSockets } from "../DeltaClientAdmin.js";
import { ICommandProcessor } from "./ICommandProcessor.js"
import WebSocket from 'ws';

export class CommandProcessor implements ICommandProcessor {
    CommandResponseFunction(socket: WebSocket, msg: CommandResponseCommand): EventType {
        deltaLogger.info("Called CommandResponseFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddPartitionFunction = (socket: WebSocket, msg: AddPartitionCommand): EventType => {
        deltaLogger.info("Called AddPartitionFunction " + msg.messageKind)
        const pInfo = activeSockets.get(socket)
        const response: PartitionAddedEvent = {
            messageKind: "PartitionAdded",
            newPartition: { nodes: [] },
            originCommands: [{ commandId: msg.commandId, participationId: pInfo!.participationId} ],
            sequenceNumber: 0,
            protocolMessages: []
        }
        return response
    }

    DeletePartitionFunction = (socket: WebSocket, msg: DeletePartitionCommand): EventType => {
        deltaLogger.info("Called DeletePartitionFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ChangeClassifierFunction = (socket: WebSocket, msg: ChangeClassifierCommand): EventType => {
        deltaLogger.info("Called ChangeClassifierFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddPropertyFunction = (socket: WebSocket, msg: AddPropertyCommand): PropertyAddedEvent | ErrorEvent => {
        deltaLogger.info("Called AddPropertyFunction " + msg.messageKind)
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
        return event
    }

    DeletePropertyFunction = (socket: WebSocket, msg: DeletePropertyCommand): EventType => {
        deltaLogger.info("Called DeletePropertyFunction " + msg.messageKind)
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
        return event
    }

    ChangePropertyFunction = (socket: WebSocket, msg: ChangePropertyCommand): EventType => {
        deltaLogger.info("Called ChangePropertyFunction " + msg.messageKind)
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
        return event;
    }

    AddChildFunction(socket: WebSocket, msg: AddChildCommand): EventType {
        deltaLogger.info("Called AddChildFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    DeleteChildFunction(socket: WebSocket, msg: DeleteChildCommand): EventType {
        deltaLogger.info("Called DeleteChildFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ReplaceChildFunction(socket: WebSocket, msg: ReplaceChildCommand): EventType {
        deltaLogger.info("Called ReplaceChildFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentCommand): EventType {
        deltaLogger.info("Called MoveChildFromOtherContainmentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveChildFromOtherContainmentInSameParentCommand): EventType {
        deltaLogger.info("Called MoveChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveChildInSameContainmentFunction(socket: WebSocket, msg: MoveChildInSameContainmentCommand): EventType {
        deltaLogger.info("Called MoveChildInSameContainmentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceChildFromOtherContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceChildFromOtherContainmentInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceChildInSameContainmentFunction(socket: WebSocket, msg: MoveAndReplaceChildInSameContainmentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceChildInSameContainmentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddAnnotationFunction(socket: WebSocket, msg: AddAnnotationCommand): EventType {
        deltaLogger.info("Called AddAnnotationFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    DeleteAnnotationFunction(socket: WebSocket, msg: DeleteAnnotationCommand): EventType {
        deltaLogger.info("Called DeleteAnnotationFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ReplaceAnnotationFunction(socket: WebSocket, msg: ReplaceAnnotationCommand): EventType {
        deltaLogger.info("Called ReplaceAnnotationFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAnnotationFromOtherParentCommand): EventType {
        deltaLogger.info("Called MoveAnnotationFromOtherParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAnnotationInSameParentCommand): EventType {
        deltaLogger.info("Called MoveAnnotationInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceAnnotationFromOtherParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationFromOtherParentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceAnnotationFromOtherParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceAnnotationInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceAnnotationInSameParentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceAnnotationInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddReferenceFunction(socket: WebSocket, msg: AddReferenceCommand): EventType {
        deltaLogger.info("Called AddReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    DeleteReferenceFunction(socket: WebSocket, msg: DeleteReferenceCommand): EventType {
        deltaLogger.info("Called DeleteReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ChangeReferenceFunction(socket: WebSocket, msg: ChangeReferenceCommand): EventType {
        deltaLogger.info("Called ChangeReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceCommand): EventType {
        deltaLogger.info("Called MoveEntryFromOtherReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveEntryFromOtherReferenceInSameParentCommand): EventType {
        deltaLogger.info("Called MoveEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveEntryInSameReferenceFunction(socket: WebSocket, msg: MoveEntryInSameReferenceCommand): EventType {
        deltaLogger.info("Called MoveEntryInSameReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceEntryFromOtherReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction(socket: WebSocket, msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceEntryFromOtherReferenceInSameParentFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    MoveAndReplaceEntryInSameReferenceFunction(socket: WebSocket, msg: MoveAndReplaceEntryInSameReferenceCommand): EventType {
        deltaLogger.info("Called MoveAndReplaceEntryInSameReferenceFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddReferenceResolveInfoFunction(socket: WebSocket, msg: AddReferenceResolveInfoCommand): EventType {
        deltaLogger.info("Called AddReferenceResolveInfoFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    DeleteReferenceResolveInfoFunction(socket: WebSocket, msg: DeleteReferenceResolveInfoCommand): EventType {
        deltaLogger.info("Called DeleteReferenceResolveInfoFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ChangeReferenceResolveInfoFunction(socket: WebSocket, msg: ChangeReferenceResolveInfoCommand): EventType {
        deltaLogger.info("Called ChangeReferenceResolveInfoFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    AddReferenceTargetFunction(socket: WebSocket, msg: AddReferenceTargetCommand): EventType {
        deltaLogger.info("Called AddReferenceTargetFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    DeleteReferenceTargetFunction(socket: WebSocket, msg: DeleteReferenceTargetCommand): EventType {
        deltaLogger.info("Called DeleteReferenceTargetFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    ChangeReferenceTargetFunction(socket: WebSocket, msg: ChangeReferenceTargetCommand): EventType {
        deltaLogger.info("Called ChangeReferenceTargetFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }

    CompositeCommandFunction(socket: WebSocket, msg: CompositeCommandCommand): EventType {
        deltaLogger.info("Called CompositeCommandFunction " + msg.messageKind)
        return this.errorEvent(msg)
    }
    
    errorEvent = (msg: CommandType): ErrorEvent => (
        {
            message: `${msg.messageKind}: Not implemented yet`,
            sequenceNumber: 0,
            originCommands: [ { commandId: msg.commandId, participationId: "error"}],
            errorCode: "generic",
            messageKind: "ErrorEvent"
        }
    )
}
