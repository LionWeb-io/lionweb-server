import { deltaLogger } from "@lionweb/server-common";
import {
    AddPropertyCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    DeltaEvent
} from "@lionweb/server-delta-shared"
import { activeSockets } from "../DeltaClientAdmin.js";
import WebSocket from 'ws';
import { DeltaFunction } from "./DeltaUtil.js"


const AddPropertyFunction = (socket: WebSocket, msg: AddPropertyCommand): PropertyAddedEvent | ErrorEvent => {
        deltaLogger.info("Called AddPropertyFunction " + msg.messageKind)
        const pInfo = activeSockets.get(socket)
        // get node with properties
        // CHECK: node exists, property does not exist (not there or value is null)
        // Set value in Postgress
        // Send event
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

const DeletePropertyFunction = (socket: WebSocket, msg: DeletePropertyCommand): PropertyDeletedEvent | ErrorEvent => {
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

const ChangePropertyFunction = (socket: WebSocket, msg: ChangePropertyCommand): DeltaEvent => {
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
            oldValue: "any dummy",
        }
        return event;
    }

export const propertyFunctions2: DeltaFunction[] = [
    {
        messageKind: "AddProperty",
        // @ts-expect-error TS2332
        processor: AddPropertyFunction
    },
    {
        messageKind: "DeleteProperty",
        // @ts-expect-error TS2332
        processor: DeletePropertyFunction
    },
    {
        messageKind: "ChangeProperty",
        // @ts-expect-error TS2332
        processor: ChangePropertyFunction
    }
]
