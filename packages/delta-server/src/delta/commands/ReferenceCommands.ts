import {
    DB_retrieveFullNodesFromIdList,
    DbChanges,
    MetaPointersTracker,
    SQL_nextRepoVersion,
    TableHelpers
} from "@lionweb/server-common"
import { TargetAdded, TargetRemoved, FeatureMissing } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { isEqualMetaPointer } from "@lionweb/json"
import { LionWebTask } from "@lionweb/server-database"
import {
    AddReferenceCommand,
    ChangeReferenceCommand,
    DeleteReferenceCommand,
    DeltaEvent,
    LionWebJsonReferenceTarget,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent,
    type ErrorDelta
} from "@lionweb/server-delta-shared"
import { deltaLogger } from "@lionweb/server-logging"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, affectedPartitionMessage } from "../events.js"
import { Participation } from "../participation/index.js"
import { DB_affectedPartition, DeltaFunction } from "./DeltaUtil.js"
import { findAndValidateNodeExists, findAndValidateReference, validateReferenceTarget } from "./Validations.js"

const AddReference = async (participation: Participation, msg: AddReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called AddReference " + msg.newResolveInfo)
    validateReferenceTarget(msg.newResolveInfo, msg.newReference, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = findAndValidateReference(parentNode, msg.reference, msg.index,undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets]}
        afterReference.targets.splice(msg.index, 0, { resolveInfo: msg.newResolveInfo ?? null, reference: msg.newReference!})

        const changes = new DbChanges(TableHelpers.pgp)
        const missing: FeatureMissing = parentNode.references.find(c => isEqualMetaPointer(c.reference, msg.reference)) === undefined ? FeatureMissing.MissingBefore : FeatureMissing.NotMissing

        deltaLogger.debug(`AddReference missing ${missing}`)
        changes.addChanges(
            [new TargetAdded(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo  ?? null, reference: msg.newReference!}, missing)]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const changesQuery = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + changesQuery)
        const partition = await DB_affectedPartition(task, msg.parent, participation)
        return {
            messageKind: "ReferenceAdded",
            newResolveInfo: msg.newResolveInfo,
            newReference: msg.newReference,
            reference: msg.reference,
            index: msg.index,
            parent: msg.parent,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode!.id), affectedPartitionMessage(partition),
                { kind: "MISSING", message: `AddReference missing ${missing}`, data: {} },
                { kind: "query", message: "AddReference query", data: {query: changesQuery}}
            ]
        } as ReferenceAddedEvent
    })
    return result
}

const DeleteReference = async (participation: Participation, msg: DeleteReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent> => {
    deltaLogger.debug("Called DeleteReference " + msg.messageKind)
    validateReferenceTarget(msg.deletedResolveInfo, msg.deletedReference, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = findAndValidateReference(parentNode, msg.reference, msg.index, undefined, msg, participation)
        const afterTargets = [...beforeReference.targets]
        afterTargets.splice(msg.index, 1)
        const afterReference = { reference: beforeReference.reference, targets: afterTargets}
        deltaLogger.debug(`REFERENCE DEL index ${msg.index} before {beforeReference.targets} after {afterReference.targets}`, {beforeReference, afterReference})
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges(
            [new TargetRemoved(new JsonContext(null, ["delta"]), parentNode, beforeReference, afterReference, { resolveInfo: msg.deletedResolveInfo ?? null, reference: msg.deletedReference!}, FeatureMissing.NotMissing)]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        const changesQuery = changes.createPostgresQuery(metaPointerTracker)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + changesQuery)
        const partition = await DB_affectedPartition(task, msg.parent, participation)
        return {
            messageKind: "ReferenceDeleted",
            parent: msg.parent,
            index: msg.index,
            reference: msg.reference,
            deletedResolveInfo: msg.deletedResolveInfo,
            deletedReference: msg.deletedReference,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(msg.parent), affectedPartitionMessage(partition)]
        } as ReferenceDeletedEvent
    })
    return result
}

const ChangeReference = async (participation: Participation, msg: ChangeReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug("Called ChangeReference " + msg.reference.key)
    validateReferenceTarget(msg.newResolveInfo, msg.newReference, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = findAndValidateReference(
            parentNode,
            msg.reference,
            msg.index,
            // @ts-ignore
            { resolveInfo: msg.oldResolveInfo ?? null, reference: msg.oldReference ?? null },
            msg,
            participation
        )
        const newTargets = [...beforeReference.targets]
        newTargets.splice(msg.index, 1, {
            resolveInfo: msg.newResolveInfo ?? null,
            reference: msg.newReference ?? null
        } as LionWebJsonReferenceTarget)
        const afterReference = { reference: msg.reference, targets: newTargets }
        
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges(
            [
                new TargetAdded(new JsonContext(null, ["delta"]), parentNode, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo ?? null, reference: msg.newReference!}, FeatureMissing.NotMissing)
            ]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        const changesQuery = changes.createPostgresQuery(metaPointerTracker)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        await task.query(participation!.repositoryData!, nextVersionSql + changesQuery)
        const partition = await DB_affectedPartition(task, msg.parent, participation)
        return {
            messageKind: "ReferenceChanged",
            parent: msg.parent,
            index: msg.index,
            reference: msg.reference,
            oldResolveInfo: msg.oldResolveInfo,
            oldReference: msg.oldReference,
            newResolveInfo: msg.newResolveInfo,
            newReference: msg.newReference,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(msg.parent), affectedPartitionMessage(partition),
                {kind: "query", message: "AddReference query", data: {query: changesQuery}}
            ]

        } as ReferenceChangedEvent
    })
    return result
}

export const referenceFunctions: DeltaFunction[] = [
    {
        messageKind: "AddReference",
        // @ts-expect-error TS2332
        processor: AddReference
    },
    {
        messageKind: "DeleteReference",
        // @ts-expect-error TS2332
        processor: DeleteReference
    },
    {
        messageKind: "ChangeReference",
        // @ts-expect-error TS2332
        processor: ChangeReference
    }
]
