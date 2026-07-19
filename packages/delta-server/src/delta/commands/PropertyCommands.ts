import { isEqualMetaPointer } from "@lionweb/json"
import { Missing, PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DbChanges, MetaPointersTracker, SQL_nextRepoVersion, TableHelpers } from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import {
    AddPropertyCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    DeltaEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    type ErrorDelta
} from "@lionweb/server-delta-shared"
import { deltaLogger } from "@lionweb/server-logging"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, affectedPartitionMessage } from "../events.js"
import { Participation } from "../participation/index.js"
import { DB_affectedPartition, DeltaFunction, DB_retrieveNode } from "./DeltaUtil.js"
import { findAndValidateProperty, validatePropertyDoesNotExist, validatePropertyHasChanged } from "./Validations.js"

const AddPropertyFunction = async (
    participation: Participation,
    msg: AddPropertyCommand,
    ctx: DeltaContext
): Promise<PropertyAddedEvent | ErrorDelta> => {
    deltaLogger.debug(`Called AddPropertyFunction command id ${msg.commandId}`)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await DB_retrieveNode(msg.node, msg, participation, task)
        console.log("PropertyAdded: retrieve done")
        validatePropertyDoesNotExist(node, msg.property, msg, participation)
    
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
        console.log("PropertyAdded: populate done")
        deltaLogger.debug(`query: ${changes.createPostgresQuery(metaPointersTracker)}`)
        let query = SQL_nextRepoVersion(participation.participationId) 
        query += changes.createPostgresQuery(metaPointersTracker)
        const dbResult = await task.query(participation.repositoryData!, query)
        console.log(`PropertyAdded: db add dor ${msg.newValue} result is ${JSON.stringify(dbResult)}`)
        const partition = await DB_affectedPartition(task, msg.node, participation)
        return {
            messageKind: "PropertyAdded",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id), affectedPartitionMessage(partition)]
        } as PropertyAddedEvent
    })
    return result
}

const DeletePropertyFunction = async (
    participation: Participation,
    msg: DeletePropertyCommand,
    ctx: DeltaContext
): Promise<PropertyDeletedEvent | ErrorDelta> => {
    deltaLogger.debug(`Called DeletePropertyFunction command id ${msg.commandId}`)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await DB_retrieveNode(msg.node, msg, participation, task)
        const oldProperty = findAndValidateProperty(node, msg.property, msg, participation)
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
        const nextRepoVersionSql = SQL_nextRepoVersion(participation.participationId)
        const addPropSql= changes.createPostgresQuery(metaPointersTracker)
        const dbResult = await task.query(participation.repositoryData!, nextRepoVersionSql + addPropSql )
        deltaLogger.debug(`db delete is ${JSON.stringify(dbResult)}`)
        const partition = await DB_affectedPartition(task, msg.node, participation)

        return {
            messageKind: "PropertyDeleted",
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id), affectedPartitionMessage(partition)],
            oldValue: oldProperty.value
        } as PropertyDeletedEvent
    })
    return result
}

const ChangePropertyFunction = async (
    participation: Participation,
    msg: ChangePropertyCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug(
        `Called ChangePropertyFunction ${msg.node} pinfo ${JSON.stringify(participation.repositoryData)} command id ${msg.commandId}`
    )
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await DB_retrieveNode(msg.node, msg, participation, task)
        const oldProperty = findAndValidateProperty(node, msg.property, msg, participation)
        validatePropertyHasChanged(oldProperty, msg.newValue, msg, participation)

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
        const nextRepoVersionSql = SQL_nextRepoVersion(participation.participationId)
        const addPropSql = changes.createPostgresQuery(metaPointersTracker)
        const dbResult = await task.query(participation.repositoryData!, nextRepoVersionSql + addPropSql)
        // deltaLogger.debug(`Result is ${JSON.stringify(dbResult)}`)
        const partition = await DB_affectedPartition(task, msg.node, participation)

        return {
            messageKind: "PropertyChanged",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id), affectedPartitionMessage(partition), {
                kind: "query",
                message: JSON.stringify(dbResult),
                data: {}
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
