import { isEqualMetaPointer } from "@lionweb/json"
import { Missing, PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DbChanges, deltaLogger, LionWebTask, MetaPointersTracker, TableHelpers } from "@lionweb/server-common"
import {
    AddPropertyCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    DeltaEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, newErrorDelta, ErrorDelta } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, retrieveNodeFromDB } from "./DeltaUtil.js"

const AddPropertyFunction = async (
    participation: ParticipationInfo,
    msg: AddPropertyCommand,
    _ctx: DeltaContext
): Promise<PropertyAddedEvent | ErrorDelta> => {
    deltaLogger.debug(`Called AddPropertyFunction command id ${msg.commandId}`)
    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await retrieveNodeFromDB(msg.node, msg, participation, task)
        const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
        if (oldProperty !== undefined && oldProperty.value !== null && oldProperty.value !== undefined) {
            return newErrorDelta("propertyAlreadyExists", `The property with key '${msg.property.key}' already exist`, msg, participation)
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
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([change])
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointersTracker, [], task)
        deltaLogger.debug(`query: ${changes.createPostgresQuery(metaPointersTracker)}`)
        const dbResult = await task.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
        deltaLogger.debug(`db delete is ${JSON.stringify(dbResult)}`)
        return {
            messageKind: "PropertyAdded",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id)]
        } as PropertyAddedEvent
    })
    return result
}

const DeletePropertyFunction = async (
    participation: ParticipationInfo,
    msg: DeletePropertyCommand,
    _ctx: DeltaContext
): Promise<PropertyDeletedEvent | ErrorDelta> => {
    deltaLogger.debug(`Called DeletePropertyFunction command id ${msg.commandId}`)
    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await retrieveNodeFromDB(msg.node, msg, participation, task)
        const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
        if (oldProperty === undefined || oldProperty.value === null || oldProperty.value === undefined) {
            return newErrorDelta("unknownProperty", `The property with key '${msg.property.key}' does not exist`, msg, participation)
        }
        // OKI, now store the new value
        const change = new PropertyValueChanged(
            new JsonContext(null, ["delta"]),
            msg.node,
            msg.property,
            oldProperty.value,
            null,
            Missing.MissingAfter
        )
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([change])
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointersTracker, [], task)
        const dbResult = await task.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
        deltaLogger.debug(`db delete is ${JSON.stringify(dbResult)}`)

        return {
            messageKind: "PropertyDeleted",
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id)],
            oldValue: oldProperty.value
        } as PropertyDeletedEvent
    })
    return result
}

const ChangePropertyFunction = async (
    participation: ParticipationInfo,
    msg: ChangePropertyCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug(
        `Called ChangePropertyFunction ${msg.node} pinfo ${JSON.stringify(participation.repositoryData)} command id ${msg.commandId}`
    )
    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await retrieveNodeFromDB(msg.node, msg, participation, task)
        const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
        if (oldProperty === undefined || oldProperty.value === null || oldProperty.value === undefined) {
            return newErrorDelta("unknownProperty", `The property with key '${msg.property.key}' does not exist`, msg, participation)
        }
        if (oldProperty.value === msg.newValue) {
            // TODO delta send a NoOp
            return newErrorDelta(
                "generic",
                `The property with key '${msg.property.key}' already has value ${msg.newValue}`,
                msg,
                participation
            )
        }

        // OKI, now store the new value
        const change = new PropertyValueChanged(
            new JsonContext(null, ["delta"]),
            msg.node,
            msg.property,
            oldProperty.value,
            msg.newValue,
            Missing.NotMissing
        )
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([change])
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointersTracker, [], task)
        // console.log(`META ${changes.createPostgresQuery(metaPointersTracker)}`)
        const dbResult = await task.query(participation.repositoryData!, changes.createPostgresQuery(metaPointersTracker))
        // deltaLogger.debug(`Result is ${JSON.stringify(dbResult)}`)
        return {
            messageKind: "PropertyChanged",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id), {
                kind: "query",
                message: JSON.stringify(dbResult),
                data: []
            }],
            oldValue: oldProperty.value
        } as PropertyChangedEvent
    })
    return result
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
