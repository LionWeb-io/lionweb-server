import { DB, DbChanges, deltaLogger, LionWebTask, MetaPointersTracker, TableHelpers } from "@lionweb/server-common"
import { TargetAdded, TargetRemoved, Missing } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { isEqualMetaPointer } from "@lionweb/json"
import {
    AddReferenceCommand,
    AddReferenceResolveInfoCommand,
    AddReferenceTargetCommand,
    ChangeReferenceCommand,
    ChangeReferenceResolveInfoCommand,
    ChangeReferenceTargetCommand,
    DeleteReferenceCommand,
    DeleteReferenceResolveInfoCommand,
    DeleteReferenceTargetCommand,
    DeltaEvent,
    MoveAndReplaceEntryFromOtherReferenceCommand,
    MoveAndReplaceEntryFromOtherReferenceInSameParentCommand,
    MoveAndReplaceEntryInSameReferenceCommand,
    MoveEntryFromOtherReferenceCommand,
    MoveEntryFromOtherReferenceInSameParentCommand,
    MoveEntryInSameReferenceCommand,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"
import { findAndValidateNodeExists, validateReference } from "./Validations.js"

const AddReference = async (participation: ParticipationInfo, msg: AddReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called AddReference " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = validateReference(parentNode!, msg.reference, msg.index,  "Add",undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets]}
        afterReference.targets.splice(msg.index, 0, { resolveInfo: msg.newResolveInfo, reference: msg.newTarget!})

        const changes = new DbChanges(TableHelpers.pgp)
        const missing: Missing = parentNode.references.find(c => isEqualMetaPointer(c.reference, msg.reference)) === undefined ? Missing.MissingBefore : Missing.NotMissing

        changes.addChanges(
            [new TargetAdded(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo, reference: msg.newTarget!}, missing)]
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
            protocolMessages: [affectedNodeMessage(parentNode!.id)]
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
            [new TargetRemoved(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.deletedResolveInfo, reference: msg.deletedTarget!}, Missing.MissingAfter)]
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
            protocolMessages: [affectedNodeMessage(msg.parent)]
        } as ReferenceDeletedEvent
    })
    return result
}

const ChangeReference = async (participation: ParticipationInfo, msg: ChangeReferenceCommand, ctx: DeltaContext): Promise<DeltaEvent> => {
    deltaLogger.info("Called ChangeReference " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const beforeReference = validateReference(parentNode, msg.reference, msg.index, "Replace", undefined, msg, participation)
        const afterReference = { reference: beforeReference.reference, targets: [...beforeReference.targets].splice(msg.index, 1, { 
            resolveInfo: msg.newResolveInfo,
            reference: msg.newTarget!
        })}
        
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges(
            [
                new TargetRemoved(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.oldResolveInfo, reference: msg.oldTarget!}, Missing.MissingAfter),
                new TargetAdded(new JsonContext(null, ["delta"]), parentNode!, beforeReference, afterReference, { resolveInfo: msg.newResolveInfo, reference: msg.newTarget!}, Missing.MissingBefore)
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
            protocolMessages: [affectedNodeMessage(msg.parent)]
        } as ReferenceChangedEvent
    })
    return result
}

const MoveEntryFromOtherReference = (
    participation: ParticipationInfo,
    msg: MoveEntryFromOtherReferenceCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveEntryFromOtherReference " + msg.messageKind)
    return errorEvent(msg)
}

const MoveEntryFromOtherReferenceInSameParent = (
    participation: ParticipationInfo,
    msg: MoveEntryFromOtherReferenceInSameParentCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveEntryFromOtherReferenceInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveEntryInSameReference = (
    participation: ParticipationInfo,
    msg: MoveEntryInSameReferenceCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveEntryInSameReference " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceEntryFromOtherReference = (
    participation: ParticipationInfo,
    msg: MoveAndReplaceEntryFromOtherReferenceCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceEntryFromOtherReference " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceEntryFromOtherReferenceInSameParent = (
    participation: ParticipationInfo,
    msg: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceEntryFromOtherReferenceInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceEntryInSameReference = (
    participation: ParticipationInfo,
    msg: MoveAndReplaceEntryInSameReferenceCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called MoveAndReplaceEntryInSameReference " + msg.messageKind)
    return errorEvent(msg)
}

const AddReferenceResolveInfo = (participation: ParticipationInfo, msg: AddReferenceResolveInfoCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called AddReferenceResolveInfo " + msg.messageKind)
    return errorEvent(msg)
}

const DeleteReferenceResolveInfo = (
    participation: ParticipationInfo,
    msg: DeleteReferenceResolveInfoCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called DeleteReferenceResolveInfo " + msg.messageKind)
    return errorEvent(msg)
}

const ChangeReferenceResolveInfo = (
    participation: ParticipationInfo,
    msg: ChangeReferenceResolveInfoCommand,
    _ctx: DeltaContext
): DeltaEvent => {
    deltaLogger.info("Called ChangeReferenceResolveInfo " + msg.messageKind)
    return errorEvent(msg)
}

const AddReferenceTarget = (participation: ParticipationInfo, msg: AddReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called AddReferenceTarget " + msg.messageKind)
    return errorEvent(msg)
}

const DeleteReferenceTarget = (participation: ParticipationInfo, msg: DeleteReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called DeleteReferenceTarget " + msg.messageKind)
    return errorEvent(msg)
}

const ChangeReferenceTarget = (participation: ParticipationInfo, msg: ChangeReferenceTargetCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called ChangeReferenceTarget " + msg.messageKind)
    return errorEvent(msg)
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
    },
    {
        messageKind: "AddReferenceResolveInfo",
        // @ts-expect-error TS2332
        processor: AddReferenceResolveInfo
    },
    {
        messageKind: "AddReferenceTarget",
        // @ts-expect-error TS2332
        processor: AddReferenceTarget
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: ChangeReferenceResolveInfo
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: ChangeReferenceTarget
    },
    {
        messageKind: "DeleteReferenceResolveInfo",
        // @ts-expect-error TS2332
        processor: DeleteReferenceResolveInfo
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: DeleteReferenceTarget
    },
    {
        messageKind: "",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryFromOtherReference
    },
    {
        messageKind: "MoveAndReplaceEntryFromOtherReferenceInSameParent",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryFromOtherReferenceInSameParent
    },
    {
        messageKind: "MoveAndReplaceEntryInSameReference",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceEntryInSameReference
    },
    {
        messageKind: "MoveEntryFromOtherReference",
        // @ts-expect-error TS2332
        processor: MoveEntryFromOtherReference
    },
    {
        messageKind: "MoveEntryFromOtherReferenceInSameParent",
        // @ts-expect-error TS2332
        processor: MoveEntryFromOtherReferenceInSameParent
    },
    {
        messageKind: "MoveEntryInSameReference",
        // @ts-expect-error TS2332
        processor: MoveEntryInSameReference
    }
]
