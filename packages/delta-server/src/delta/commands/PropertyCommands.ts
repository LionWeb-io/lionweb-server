import { isEqualMetaPointer } from "@lionweb/json"
import { Missing, PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DbChanges, deltaLogger, MetaPointersTracker } from "@lionweb/server-common"
import {
    AddPropertyCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    DeltaEvent,
    ErrorEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, retrieveNodeFromDB } from "./DeltaUtil.js"

const AddPropertyFunction = async (
    participation: ParticipationInfo,
    msg: AddPropertyCommand,
    _ctx: DeltaContext
): Promise<PropertyAddedEvent | ErrorEvent> => {
    deltaLogger.info("Called AddPropertyFunction " + msg.messageKind)
    const node = await retrieveNodeFromDB(msg.node, msg, participation, _ctx)
    const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
    if (oldProperty !== undefined && oldProperty.value !== null && oldProperty.value !== undefined) {
        deltaLogger.info(`!!!!! ${JSON.stringify(node)}`)
        return newErrorEvent("PropertyAlreadyExist", `The property with key '${msg.property.key}' already exist`, msg, participation)
    }

    // OKI, now store the new value
    const change = new PropertyValueChanged(
        new JsonContext(null, ["delta"]),
        msg.node,
        msg.property,
        null,
        msg.newValue,
        Missing.MissingBefore
    )
    const changes = new DbChanges(_ctx.pgp)
    changes.addChanges([change])
    const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
    const dbResult = await _ctx.dbConnection.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
    deltaLogger.info(`db delete is ${JSON.stringify(dbResult)}`)
    const event: PropertyAddedEvent = {
        messageKind: "PropertyAdded",
        newValue: msg.newValue,
        node: msg.node,
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        property: msg.property,
        sequenceNumber: 0, // dummy, will be changed for each participation before sending
        protocolMessages: []
    }
    return event
}

const DeletePropertyFunction = async (
    participation: ParticipationInfo,
    msg: DeletePropertyCommand,
    _ctx: DeltaContext
): Promise<PropertyDeletedEvent | ErrorEvent> => {
    deltaLogger.info("Called DeletePropertyFunction " + msg.messageKind)
    const node = await retrieveNodeFromDB(msg.node, msg, participation, _ctx)
    const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
    if (oldProperty === undefined || oldProperty.value === null || oldProperty.value === undefined) {
        deltaLogger.info(`!!!!! ${JSON.stringify(node)}`)
        return newErrorEvent("PropertyDoesNotExist", `The property with key '${msg.property.key}' does not exist`, msg, participation)
    }
    // OKI, now store the new value
    const change = new PropertyValueChanged(new JsonContext(null, ["delta"]), msg.node, msg.property, oldProperty.value, null, Missing.MissingAfter)
    const changes = new DbChanges(_ctx.pgp)
    changes.addChanges([change])
    const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
    const dbResult = await _ctx.dbConnection.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
    deltaLogger.info(`db delete is ${JSON.stringify(dbResult)}`)

    const event: PropertyDeletedEvent = {
        messageKind: "PropertyDeleted",
        node: msg.node,
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        property: msg.property,
        sequenceNumber: 0, // dummy, will be changed for each participation before sending
        protocolMessages: [
            {
                kind:"OldProperty",
                message: "Value of old property",
                data: [{
                    key: "OldProperty",
                    value: JSON.stringify(oldProperty)
                }]
            }
        ],
        oldValue: oldProperty.value
    }
    return event
}

const ChangePropertyFunction = async (
    participation: ParticipationInfo,
    msg: ChangePropertyCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent> => {
    deltaLogger.info(`Called ChangePropertyFunction ${msg.node} pinfo ${JSON.stringify(participation.repositoryData)}`)
    const node = await retrieveNodeFromDB(msg.node, msg, participation, _ctx)
    const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
    if (oldProperty === undefined || oldProperty.value === null || oldProperty.value === undefined) {
        return newErrorEvent("PropertyDoesNotExist", `The property with key '${msg.property.key}' does not exist`, msg, participation)
    }
    if (oldProperty.value === msg.newValue) {
        return newErrorEvent("PropertyAlreadyHasNewValue", `The property with key '${msg.property.key}' already has value ${msg.newValue}`, msg, participation)
    }

    // OKI, now store the new value
    const change = new PropertyValueChanged(new JsonContext(null, ["delta"]), msg.node, msg.property, oldProperty.value, msg.newValue, Missing.NotMissing)
    const changes = new DbChanges(_ctx.pgp)
    changes.addChanges([change])
    const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
    const dbResult = await _ctx.dbConnection.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
    deltaLogger.info(`Result is ${JSON.stringify(dbResult)}`)
    const event: PropertyChangedEvent = {
        messageKind: "PropertyChanged",
        newValue: msg.newValue,
        node: msg.node,
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        property: msg.property,
        sequenceNumber: 0, // dummy, will be changed for each participation before sending
        protocolMessages: [
            {
                kind: "OldNode",
                message: JSON.stringify(node),
                data: []
            }
        ],
        oldValue: oldProperty.value
    }
    return event 
}

export const propertyFunctions: DeltaFunction[] = [
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
