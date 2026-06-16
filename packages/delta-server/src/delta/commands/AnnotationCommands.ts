import { AnnotationAdded, AnnotationOrderChanged, AnnotationRemoved, ChildAdded, Missing, ParentChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import {
    DB_retrieveFullNodesFromIdList,
    DB_retrieveNodeTree,
    DbChanges,
    MetaPointersTracker,
    SQL_deleteFullNodes,
    SQL_insertNodeArray,
    SQL_nextRepoVersion,
    TableHelpers
} from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import { deltaLogger } from "@lionweb/server-shared"
import {
    AddAnnotationCommand,
    AnnotationAddedEvent,
    AnnotationDeletedEvent,
    AnnotationReplacedEvent,
    DeleteAnnotationCommand,
    DeltaEvent,
    MoveAndReplaceAnnotationFromOtherParentCommand,
    MoveAndReplaceAnnotationInSameParentCommand,
    MoveAnnotationFromOtherParentCommand,
    MoveAnnotationInSameParentCommand,
    ReplaceAnnotationCommand,
    ErrorDelta,
    AnnotationMovedFromOtherParentEvent,
    AnnotationMovedInSameParentEvent,
    AnnotationMovedAndReplacedFromOtherParentEvent,
    AnnotationMovedAndReplacedInSameParentEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, affectedPartitionMessage } from "../events.js"
import { Participation } from "../participation/index.js"
import { DB_affectedPartition, deltaContext, DeltaFunction } from "./DeltaUtil.js"
import {
    findAndValidateNodeExists,
    validateAnnotationIndex,
    validateChildInAnnotation,
    validateExistingNodesIsEmpty,
    validateProperTree
} from "./Validations.js"

const AddAnnotation = async (participation: Participation, msg: AddAnnotationCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info(`Called AddAnnotation to node ${msg.parent}`)
    const newAnnotationNode = validateProperTree(msg.newAnnotation, msg.parent, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
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
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const addNodesquery = SQL_insertNodeArray(msg.newAnnotation.nodes, metaPointerTracker)
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        deltaLogger.debug(`ADD NODES QUERY '${addNodesquery}`)
        deltaLogger.debug(`ADD CHILD QUERY '${addChildQuery}`)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + addNodesquery + addChildQuery)
        const partition = await DB_affectedPartition(task, parentNode!.id, participation)
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
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [msg.parent, msg.deletedAnnotation])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const annotationNode = findAndValidateNodeExists(msg.deletedAnnotation, nodesFromDB, msg, participation)
        validateChildInAnnotation(parentNode, msg.index, msg.deletedAnnotation, msg, participation)

        // All ok, now prepare the deletion query
        const afterNode = structuredClone(parentNode)
        afterNode.annotations.splice(msg.index, 1)
        // Get the subtree of `deletedChild` from the database to remove them
        const subtreeNodes = await DB_retrieveNodeTree(task, participation.repositoryData!, [msg.deletedAnnotation], Number.MAX_SAFE_INTEGER)
        const deleteSql = SQL_deleteFullNodes(subtreeNodes.map(n => n.id))
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
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const execute = await task.query(
            participation.repositoryData!,
            nextVersionSql + deleteSql + dbChanges.createPostgresQuery(metaPointerTracker)
        )
        const partition = await DB_affectedPartition(task, parentNode!.id, participation)
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
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info("Called ReplaceAnnotation " + msg.messageKind)
    const newAnnotationNode = validateProperTree(msg.newAnnotation, msg.parent, msg, participation)

    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
            msg.parent,
            msg.replacedAnnotation,
            ...msg.newAnnotation.nodes.map(n => n.id)
        ])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)

        const existingChildNodes = nodesFromDB.filter(n => n.id !== msg.parent && n.id !== msg.replacedAnnotation)
        validateExistingNodesIsEmpty(existingChildNodes, msg, participation)

        // const containment = validateContainment(parentNode, msg.containment, msg.index, "Replace", msg.replacedChild, msg, participation)
        validateChildInAnnotation(parentNode, msg.index, msg.replacedAnnotation, msg, participation)
        const newParentNode = structuredClone(parentNode)
        newParentNode.annotations.splice(msg.index, 1, newAnnotationNode.id)

        // Checks done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        const replacedTree = await DB_retrieveNodeTree(task, participation.repositoryData!, [msg.replacedAnnotation], Number.MAX_SAFE_INTEGER)

        // TODO: The resr
        changes.addChanges([
            new AnnotationRemoved(deltaContext(), parentNode, newParentNode, msg.replacedAnnotation, msg.index),
            new AnnotationAdded(deltaContext(), parentNode, newParentNode, newAnnotationNode.id, msg.index),
        ])
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newAnnotation.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newAnnotation.nodes, task)
        const addNodesquery = SQL_insertNodeArray(msg.newAnnotation.nodes, metaPointerTracker)
        const deleteNodes = SQL_deleteFullNodes(replacedTree.map(node => node.id))
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + addNodesquery + deleteNodes + addChildQuery)
        const partition = await DB_affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "AnnotationReplaced",
            parent: msg.parent,
            index: msg.index,
            newAnnotation: msg.newAnnotation,
            replacedAnnotation: msg.replacedAnnotation,
            replacedDescendants: replacedTree.map(node => node.id),
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)]
        } as AnnotationReplacedEvent
    })

    return result
}

const MoveAnnotationFromOtherParent = async (
    participation: Participation,
    msg: MoveAnnotationFromOtherParentCommand,
    ctx: DeltaContext
): Promise<AnnotationMovedFromOtherParentEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAnnotationFromOtherParent " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
            ...msg.movedAnnotation, msg.oldParent, msg.newParent
        ])
        const oldParentNode = findAndValidateNodeExists(msg.oldParent, nodesFromDB, msg, participation)
        const newParentNode = findAndValidateNodeExists(msg.newParent, nodesFromDB, msg, participation)

        validateChildInAnnotation(oldParentNode, msg.oldIndex, msg.movedAnnotation, msg, participation)
        validateAnnotationIndex(newParentNode, msg.newIndex, msg, participation)
        const changedNewParentNode = structuredClone(newParentNode)
        changedNewParentNode.annotations.splice(msg.newIndex, 0, msg.movedAnnotation)
        const changedOldParentNode = structuredClone(oldParentNode)
        changedOldParentNode.annotations.splice(msg.oldIndex, 1)
        
        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([
            new AnnotationRemoved(deltaContext(),oldParentNode,changedOldParentNode,msg.movedAnnotation,msg.oldIndex),
            new AnnotationAdded(deltaContext(),newParentNode,changedNewParentNode,msg.movedAnnotation,msg.newIndex)
        ])
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const query = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + query)
        // TODO Second participation should be added if needed
        const partition = await DB_affectedPartition(task, oldParentNode.id, participation)
        return {
            messageKind: "AnnotationMovedFromOtherParent",
            movedAnnotation: msg.movedAnnotation,
            oldParent: msg.oldParent,
            oldIndex: msg.oldIndex,
            newParent: msg.newParent,
            newIndex: msg.newIndex,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(newParentNode.id), affectedPartitionMessage(partition)]
        } as AnnotationMovedFromOtherParentEvent
    })
    return result
}

const MoveAnnotationInSameParent = async (
    participation: Participation,
    msg: MoveAnnotationInSameParentCommand,
    ctx: DeltaContext
): Promise<AnnotationMovedInSameParentEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAnnotationInSameParent " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
            ...msg.movedAnnotation, msg.parent
        ])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)

        validateChildInAnnotation(parentNode, msg.oldIndex, msg.movedAnnotation, msg, participation)
        validateAnnotationIndex(parentNode, msg.newIndex, msg, participation)
        const changedParentNode = structuredClone(parentNode)
        changedParentNode.annotations.splice(msg.oldIndex, 1)
        changedParentNode.annotations.splice(msg.newIndex, 0, msg.movedAnnotation)

        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([
            new AnnotationOrderChanged(deltaContext(),parentNode,changedParentNode,msg.movedAnnotation,msg.newIndex)
        ])
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const query = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + query)
        const partition = await DB_affectedPartition(task, parentNode.id, participation)
        return {
            messageKind: "AnnotationMovedInSameParent",
            movedAnnotation: msg.movedAnnotation,
            parent: msg.parent,
            oldIndex: msg.oldIndex,
            newIndex: msg.newIndex,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)]
        } as AnnotationMovedInSameParentEvent
    })
    return result
}

const MoveAndReplaceAnnotationFromOtherParent = async (
    participation: Participation,
    msg: MoveAndReplaceAnnotationFromOtherParentCommand,
    ctx: DeltaContext
): Promise<AnnotationMovedAndReplacedFromOtherParentEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAndReplaceAnnotationFromOtherParent " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
            msg.movedAnnotation, msg.oldParent, msg.newParent
        ])
        const oldParentNode = findAndValidateNodeExists(msg.oldParent, nodesFromDB, msg, participation)
        const newParentNode = findAndValidateNodeExists(msg.newParent, nodesFromDB, msg, participation)
        const movedAnnotationNode = findAndValidateNodeExists(msg.movedAnnotation, nodesFromDB, msg, participation)

        validateChildInAnnotation(oldParentNode, msg.oldIndex, msg.movedAnnotation, msg, participation)
        validateChildInAnnotation(newParentNode, msg.newIndex, msg.replacedAnnotation, msg, participation)
        const changedNewParentNode = structuredClone(newParentNode)
        changedNewParentNode.annotations.splice(msg.newIndex, 1, msg.movedAnnotation)
        const changedOldParentNode = structuredClone(oldParentNode)
        changedOldParentNode.annotations.splice(msg.oldIndex, 1)

        const replacedTree = await DB_retrieveNodeTree(task, participation.repositoryData!, [msg.replacedAnnotation], Number.MAX_SAFE_INTEGER)

        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([
            new ParentChanged(deltaContext(), movedAnnotationNode, msg.oldParent, msg.newParent),
            new AnnotationRemoved(deltaContext(),oldParentNode,changedOldParentNode,msg.movedAnnotation,msg.oldIndex),
            new AnnotationRemoved(deltaContext(),newParentNode,changedNewParentNode,msg.replacedAnnotation,msg.newIndex),
            new AnnotationAdded(deltaContext(),newParentNode,changedNewParentNode,msg.movedAnnotation,msg.newIndex)
        ])
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const deleteNodes = SQL_deleteFullNodes(replacedTree.map(node => node.id))
        const query = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + deleteNodes + query)
        // TODO Second participation should be added if needed
        const partition = await DB_affectedPartition(task, oldParentNode.id, participation)
        return {
            messageKind: "AnnotationMovedAndReplacedFromOtherParent",
            movedAnnotation: msg.movedAnnotation,
            oldParent: msg.oldParent,
            oldIndex: msg.oldIndex,
            newParent: msg.newParent,
            newIndex: msg.newIndex,
            replacedAnnotation: msg.replacedAnnotation,
            replacedDescendants: replacedTree.map(node => node.id),
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(newParentNode.id), affectedPartitionMessage(partition)]
        } as AnnotationMovedAndReplacedFromOtherParentEvent
    })
    return result
}

const MoveAndReplaceAnnotationInSameParent = async (
    participation: Participation,
    msg: MoveAndReplaceAnnotationInSameParentCommand,
    ctx: DeltaContext
): Promise<AnnotationMovedAndReplacedInSameParentEvent | ErrorDelta> => {
    deltaLogger.info("Called MoveAndReplaceAnnotationInSameParent " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB_retrieveFullNodesFromIdList(task, participation.repositoryData!, [
            ...msg.movedAnnotation, msg.parent
        ])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)

        validateChildInAnnotation(parentNode, msg.oldIndex, msg.movedAnnotation, msg, participation)
        validateChildInAnnotation(parentNode, msg.oldIndex + msg.indexOffset, msg.replacedAnnotation, msg, participation)
        const changedParentNode = structuredClone(parentNode)
        changedParentNode.annotations.splice(msg.oldIndex, 1)
        if (msg.indexOffset < 0) {
            changedParentNode.annotations.splice(msg.oldIndex + msg.indexOffset, 1, msg.movedAnnotation)
        } else {
            changedParentNode.annotations.splice(msg.oldIndex + msg.indexOffset - 1, 1, msg.movedAnnotation)
        }

        const replacedTree = await DB_retrieveNodeTree(task, participation.repositoryData!, [msg.replacedAnnotation], Number.MAX_SAFE_INTEGER)

        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([
            new AnnotationRemoved(deltaContext(),parentNode,changedParentNode,msg.movedAnnotation,msg.oldIndex),
            new AnnotationAdded(deltaContext(),parentNode,changedParentNode,msg.movedAnnotation,msg.oldIndex + msg.indexOffset)
        ])
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL_nextRepoVersion(participation.participationId)
        const deleteNodes = SQL_deleteFullNodes(replacedTree.map(node => node.id))
        const query = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + deleteNodes + query)
        // TODO Second participation should be added if needed
        const partition = await DB_affectedPartition(task, parentNode.id, participation)
        return {
            messageKind: "AnnotationMovedAndReplacedInSameParent",
            movedAnnotation: msg.movedAnnotation,
            parent: msg.parent,
            oldIndex: msg.oldIndex,
            indexOffset:msg.indexOffset,
            replacedAnnotation: msg.replacedAnnotation,
            replacedDescendants: replacedTree.map(node => node.id),
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)]
        } as AnnotationMovedAndReplacedInSameParentEvent
    })
    return result
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
