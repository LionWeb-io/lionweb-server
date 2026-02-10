import { DB, DbChanges, deltaLogger, LionWebTask, MetaPointersTracker, TableHelpers } from "@lionweb/server-common"
import { TargetAdded, TargetRemoved, Missing } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { isEqualMetaPointer } from "@lionweb/json"
import {
    AddReferenceCommand,
    ChangeReferenceCommand,
    DeleteReferenceCommand,
    DeltaEvent,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, ErrorDelta } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction } from "./DeltaUtil.js"
import { findAndValidateNodeExists, validateReference } from "./Validations.js"

const AddReference = async (participation: ParticipationInfo, msg: AddReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called AddReference " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = validateReference(parentNode!, msg.reference, msg.index,  "Add",undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets]}
        afterReference.targets.splice(msg.index, 0, { resolveInfo: msg.newResolveInfo ?? null, reference: msg.newTarget!})

        const changes = new DbChanges(TableHelpers.pgp)
        const missing: Missing = parentNode.references.find(c => isEqualMetaPointer(c.reference, msg.reference)) === undefined ? Missing.MissingBefore : Missing.NotMissing

        changes.addChanges(
            [new TargetAdded(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo  ?? null, reference: msg.newTarget!}, missing)]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        const changesQuery = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, changesQuery)
        return {
            messageKind: "ReferenceAdded",
            newResolveInfo: msg.newResolveInfo,
            newTarget: msg.newTarget,
            reference: msg.reference,
            index: msg.index,
            parent: msg.parent,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfo: [affectedNodeMessage(parentNode!.id)]
        } as ReferenceAddedEvent
    })
    return result
}

const DeleteReference = async (participation: ParticipationInfo, msg: DeleteReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent> => {
    deltaLogger.info("Called DeleteReference " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = validateReference(parentNode, msg.reference, msg.index, "Delete", undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets].splice(msg.index, 1)}

        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges(
            [new TargetRemoved(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.deletedResolveInfo ?? null, reference: msg.deletedTarget!}, Missing.MissingAfter)]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        return {
            messageKind: "ReferenceDeleted",
            parent: msg.parent,
            index: msg.index,
            reference: msg.reference,
            deletedResolveInfo: msg.deletedResolveInfo,
            deletedTarget: msg.deletedTarget,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfo: [affectedNodeMessage(msg.parent)]
        } as ReferenceDeletedEvent
    })
    return result
}

const ChangeReference = async (participation: ParticipationInfo, msg: ChangeReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called ChangeReference " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = validateReference(parentNode, msg.reference, msg.index, "Replace", undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets].splice(msg.index, 1, { 
            resolveInfo: msg.newResolveInfo ?? null,
            reference: msg.newTarget!
        })}
        
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges(
            [
                new TargetRemoved(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.oldResolveInfo ?? null, reference: msg.oldTarget!}, Missing.MissingAfter),
                new TargetAdded(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo ?? null, reference: msg.newTarget!}, Missing.MissingBefore)
            ]
        )
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [], task)
        return {
            messageKind: "ReferenceChanged",
            parent: msg.parent,
            index: msg.index,
            reference: msg.reference,
            oldResolveInfo: msg.oldResolveInfo,
            oldTarget: msg.oldTarget,
            newResolveInfo: msg.newResolveInfo,
            newTarget: msg.newTarget,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfo: [affectedNodeMessage(msg.parent)]
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
