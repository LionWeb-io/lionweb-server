import { AnnotationAdded, AnnotationRemoved } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DB, DbChanges, MetaPointersTracker, SQL, TableHelpers } from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import { deltaLogger } from "@lionweb/server-shared"
import {
    AddAnnotationCommand,
    AnnotationAddedEvent,
    AnnotationDeletedEvent,
    DeleteAnnotationCommand,
    DeltaEvent,
    MoveAndReplaceAnnotationFromOtherParentCommand,
    MoveAndReplaceAnnotationInSameParentCommand,
    MoveAnnotationFromOtherParentCommand,
    MoveAnnotationInSameParentCommand,
    ReplaceAnnotationCommand,
    ErrorDelta
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, affectedPartitionMessage, newErrorDelta } from "../events.js"
import { Participation } from "../participation/index.js"
import { affectedPartition, deltaContext, DeltaFunction, errorEvent } from "./DeltaUtil.js"
import { findAndValidateNodeExists, validateExistingNodesIsEmpty, validateProperTree } from "./Validations.js"

const AddAnnotation = async (participation: Participation, msg: AddAnnotationCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info(`Called AddAnnotation to node ${msg.parent}`)
    const newAnnotationNode = validateProperTree(msg.newAnnotation, msg.parent, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            ...msg.newAnnotation.nodes.map(n => n.id),
            msg.parent
        ])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const existingChildNodes = nodesFromDB.filter(nn => {
            deltaLogger.debug(`nn.id ${nn.id} parent ${msg.parent}`)
            return nn.id !== msg.parent
        })
        // node alreadyExists
        validateExistingNodesIsEmpty(existingChildNodes, msg, participation)

        const newParentNode = structuredClone(parentNode)
        newParentNode.annotations.splice(msg.index, 0, newAnnotationNode!.id)
        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([
            new AnnotationAdded(
                deltaContext(),
                parentNode,
                newParentNode,
                newAnnotationNode!.id,
                msg.index
            )
        ])
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newAnnotation.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newAnnotation.nodes, task)
        const nextVersionSql = SQL.nextRepoVersionSQL(participation.participationId)
        const addNodesquery = SQL.insertNodeArraySQL(msg.newAnnotation.nodes, metaPointerTracker)
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        deltaLogger.debug(`ADD NODES QUERY '${addNodesquery}`)
        deltaLogger.debug(`ADD CHILD QUERY '${addChildQuery}`)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + addNodesquery + addChildQuery)
        const partition = await affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "AnnotationAdded",
            newAnnotation: msg.newAnnotation,
            index: msg.index,
            parent: msg.parent,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode!.id), affectedPartitionMessage(partition)]
        } as AnnotationAddedEvent
    })
    return result
}

const DeleteAnnotation = async (
    participation: Participation,
    msg: DeleteAnnotationCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called DeleteAnnotation " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [msg.parent, msg.deletedAnnotation])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const annotationNode = findAndValidateNodeExists(msg.deletedAnnotation, nodesFromDB, msg, participation)

        if (msg.index > parentNode.annotations.length - 1) {
            return newErrorDelta("unknownIndex", "TODO", msg, participation)
        }
        if (parentNode.annotations[msg.index] !== msg.deletedAnnotation) {
            return newErrorDelta("indexEntryMismatch", "TODO", msg, participation)
        }

        // All ok, now prepare the deletion query
        const afterNode = structuredClone(parentNode)
        afterNode.annotations.splice(msg.index, 1)
        // Get the subtree of `deletedChild` from the database to remove them
        const subtreeNodes = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [msg.deletedAnnotation], Number.MAX_SAFE_INTEGER)
        const deleteSql = SQL.deleteFullNodesSQL(subtreeNodes.map(n => n.id))
        const dbChanges = new DbChanges(TableHelpers.pgp)
        dbChanges.addChanges([
            new AnnotationRemoved(
                new JsonContext(null, ["delta"]),
                parentNode,
                afterNode,
                msg.deletedAnnotation,
                msg.index
            )
        ])
        // Run the query with metapointers as a dummy, there are no metapointers being added
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL.nextRepoVersionSQL(participation.participationId)
        const execute = await task.query(
            participation.repositoryData!,
            nextVersionSql + deleteSql + dbChanges.createPostgresQuery(metaPointerTracker)
        )
        const partition = await affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "AnnotationDeleted",
            deletedAnnotation: msg.deletedAnnotation,
            deletedDescendants: subtreeNodes.filter(node => node.id !== msg.deletedAnnotation).map(node => node.id),
            index: msg.index,
            parent: msg.parent,
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)],
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0
        } as AnnotationDeletedEvent
    })
    return result}

const ReplaceAnnotation = async (
    participation: Participation,
    msg: ReplaceAnnotationCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called ReplaceAnnotation " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationFromOtherParent = async (
    participation: Participation,
    msg: MoveAnnotationFromOtherParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAnnotationInSameParent = async (
    participation: Participation,
    msg: MoveAnnotationInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAnnotationInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationFromOtherParent = async (
    participation: Participation,
    msg: MoveAndReplaceAnnotationFromOtherParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAndReplaceAnnotationFromOtherParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceAnnotationInSameParent = async (
    participation: Participation,
    msg: MoveAndReplaceAnnotationInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAndReplaceAnnotationInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

export const annotationFunctions: DeltaFunction[] = [
    {
        messageKind: "AddAnnotation",
        // @ts-expect-error TS2332
        processor: AddAnnotation
    },
    {
        messageKind: "DeleteAnnotation",
        // @ts-expect-error TS2332
        processor: DeleteAnnotation
    },
    {
        messageKind: "ReplaceAnnotation",
        // @ts-expect-error TS2332
        processor: ReplaceAnnotation
    },
    {
        messageKind: "MoveAnnotationInSameParent",
        // @ts-expect-error TS2332
        processor: MoveAnnotationInSameParent
    },
    {
        messageKind: "MoveAnnotationFromOtherParent",
        // @ts-expect-error TS2332
        processor: MoveAnnotationFromOtherParent
    },
    {
        messageKind: "MoveAndReplaceAnnotationInSameParent",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceAnnotationInSameParent
    },
    {
        messageKind: "MoveAndReplaceAnnotationFromOtherParent",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceAnnotationFromOtherParent
    },
]
