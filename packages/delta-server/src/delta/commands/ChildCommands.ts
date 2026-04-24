import { isEqualMetaPointer } from "@lionweb/json"
import { NodeUtils } from "@lionweb/json-utils"
import { ChildAdded, Missing, ChildRemoved, ParentChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import {
    DbChanges,
    SQL, DB,
    MetaPointersTracker,
    TableHelpers
} from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import {
    AddChildCommand,
    ChildAddedEvent,
    ChildDeletedEvent,
    ChildMovedFromOtherContainmentEvent,
    ChildReplacedEvent,
    DeleteChildCommand,
    DeltaEvent,
    ErrorEvent,
    MoveAndReplaceChildFromOtherContainmentCommand,
    MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    MoveAndReplaceChildInSameContainmentCommand,
    MoveChildFromOtherContainmentCommand,
    MoveChildFromOtherContainmentInSameParentCommand,
    MoveChildInSameContainmentCommand,
    ReplaceChildCommand
} from "@lionweb/server-delta-shared"
import { deltaLogger } from "@lionweb/server-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, newErrorDelta, type ErrorDelta, affectedPartitionMessage } from "../events.js"
import { Participation } from "../participation/index.js"
import { affectedPartition, DeltaFunction, errorEvent } from "./DeltaUtil.js"
import { findAndValidateNodeExists, validateContainment, validateProperTree } from "./Validations.js"

const AddChild = async (participation: Participation, msg: AddChildCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.info(`Called AddChild ${msg.newChild.nodes.map(n => n.id)}`)
    const newChildNode = validateProperTree(msg.newChild, msg.parent, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            ...(msg.newChild.nodes.map(n => n.id)), msg.parent
        ])
        deltaLogger.debug("BEFORE EXISTING nodses form db " + nodesFromDB.map(n => n.id))
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        deltaLogger.debug("AFTER EXISTING nodses form db " + nodesFromDB.map(n => n.id))
        const existingChildNodes = nodesFromDB.filter(nn => {
            deltaLogger.debug(`nn.id ${nn.id} parent ${msg.parent}`)
            return nn.id !== msg.parent
        })
        // node alreadyExists
        deltaLogger.debug("EXISTING child nodes " + existingChildNodes.map(n => n.id))
        if (existingChildNodes.length > 0) {
            const existingIds = existingChildNodes.map(n => n.id)
            throw newErrorDelta("nodeAlreadyExists", `Nodes '${existingIds}' already exist`, msg, participation)
        }
        // Find the new child node
        // find the containment, create a new one if it isn't there
        const containment = validateContainment(parentNode!, msg.containment, msg.index,  "Add",undefined, msg, participation)
        // let containment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, msg.containment))
        // Add newChild to current containment of parent
        containment.children.splice(msg.index, 0, newChildNode!.id)
        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        // Add child to parent
        const missing: Missing = (parentNode.containments.find(c => isEqualMetaPointer(c.containment, msg.containment)) === undefined ? Missing.MissingBefore : Missing.NotMissing)
        deltaLogger.debug(`Missing is ${missing} ================================ ${JSON.stringify(msg.containment)}`)
        changes.addChanges(
            [new ChildAdded(new JsonContext(null, ["delta"]), parentNode!, msg.containment, containment, newChildNode!.id, missing)]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newChild.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newChild.nodes, task)
        const nextVersionSql = SQL.nextRepoVersionSQL(participation.participationId)
        const addNodesquery = SQL.insertNodeArraySQL(msg.newChild.nodes, metaPointerTracker)
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        deltaLogger.debug(`ADD NODES QUERY '${addNodesquery}`)
        deltaLogger.debug(`ADD CHILD QUERY '${addChildQuery}`)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + addNodesquery + addChildQuery)
        const partition = await affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "ChildAdded",
            containment: msg.containment,
            index: msg.index,
            parent: msg.parent,
            newChild: msg.newChild,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode!.id), affectedPartitionMessage(partition)]
        } as ChildAddedEvent
    })
    return result
}

const DeleteChild = async (
    participation: Participation,
    msg: DeleteChildCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug("DeleteChild " + msg.deletedChild)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.parent, msg.deletedChild
        ])
        const parentNode = nodesFromDB.find(n => n.id === msg.parent)

        // Check whether parent exists
        if (parentNode === undefined) {
            return newErrorDelta("unknownNode", `Parent '${msg.parent}' does not exist`, msg, participation)
        }
        // Check whether child exists
        const childNode = nodesFromDB.find(n => n.id === msg.deletedChild)
        // validateExists(childNode, "unknownNode", `Child '${msg.deletedChild}' does not exist`, msg, participation)
        if (childNode === undefined) {
            return newErrorDelta("unknownNode", `Child '${msg.deletedChild}' does not exist`, msg, participation)
        }

        // Check whether containment exists in the parent
        const containment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, msg.containment))
        if (containment === undefined) {
            return newErrorDelta("unknownContainment", `Containment '${JSON.stringify(msg.containment)}' does not exists in parent '${msg.parent}'`, msg, participation)
        }
        if (msg.index > containment.children.length - 1) {
            return newErrorDelta("unknownIndex", "TODO", msg, participation)
        }
        if (containment.children[msg.index] !== msg.deletedChild) {
            return newErrorDelta("indexEntryMismatch", "TODO", msg, participation)
        }

        // All ok, now prepare the deletion query
        containment.children.splice(msg.index, 1)
        // Get the subtree of `deletedChild` from the database to remove them
        const subtreeNodes = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [msg.deletedChild], Number.MAX_SAFE_INTEGER)
        const deleteSql = SQL.deleteFullNodesSQL(subtreeNodes.map(n => n.id))
        const dbChanges = new DbChanges(TableHelpers.pgp)
        dbChanges.addChanges(            
            [new ChildRemoved(new JsonContext(null, ["delta"]), parentNode, msg.containment, containment, msg.deletedChild, Missing.NotMissing)]
        ) 
        // Run the query with metapointers as a dummy, there are no metapointers being added
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const nextVersionSql = SQL.nextRepoVersionSQL(participation.participationId)
        const execute = task.query(participation.repositoryData!, nextVersionSql + deleteSql + dbChanges.createPostgresQuery(metaPointerTracker))
        const partition = await affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "ChildDeleted",
            deletedChild: msg.deletedChild,
            index: msg.index,
            parent: msg.parent,
            containment: msg.containment,
            deletedDescendants: subtreeNodes.filter(node => node.id !== msg.deletedChild).map(node => node.id),
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)],
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0
        } as ChildDeletedEvent
    })
    return result
}

const ReplaceChild = async (
    participation: Participation,
    msg: ReplaceChildCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug("Called ReplaceChild " + msg.messageKind)
    validateProperTree(msg.newChild, msg.parent, msg, participation)
    
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.parent, msg.replacedChild, ...msg.newChild.nodes.map(n => n.id)

        ])
        const parentNode = findAndValidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        
        const existingChildNodes = nodesFromDB.filter(n => n.id !== msg.parent && n.id !== msg.replacedChild)
        // node alreadyExists
        if (existingChildNodes.length > 0) {
            const existingIds = existingChildNodes.map(n => n.id)
            return newErrorDelta("nodeAlreadyExists", `Nodes '${existingIds}' already exist`, msg, participation)
        }
        
        // Find the new child node
        const newChildNode = msg.newChild.nodes.find(node => node.parent === msg.parent)
        if (newChildNode === undefined) {
            // TODO this check can be moved to the ReferenceValidator by giving the `parent` as parameter
            return newErrorDelta("childNotFound", `The newChild chunk does not contain a node with parent ${msg.parent}`, msg, participation)
        }
        
        // Check whether replaced child exists
        const childNode = nodesFromDB.find(n => n.id === msg.replacedChild)
        if (childNode === undefined) {
            return newErrorDelta("unknownNode", `Child '${msg.replacedChild}' does not exist`, msg, participation)
        }

        const containment = validateContainment(parentNode, msg.containment, msg.index, "Replace", msg.replacedChild, msg, participation)
        // Checks done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        const replacedTree = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [
            msg.replacedChild], Number.MAX_SAFE_INTEGER)

        const missing: Missing = (parentNode.containments.find(c => isEqualMetaPointer(c.containment, msg.containment)) === undefined ? Missing.MissingBefore : Missing.NotMissing)
        changes.addChanges(
            [new ChildAdded(new JsonContext(null, ["delta"]), parentNode, msg.containment, containment, newChildNode.id, missing)]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newChild.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newChild.nodes, task)
        const addNodesquery = SQL.insertNodeArraySQL(msg.newChild.nodes, metaPointerTracker)
        const deleteNodes = SQL.deleteFullNodesSQL(replacedTree.map(node => node.id))
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        const nextVersionSql = SQL.nextRepoVersionSQL(participation.participationId)
        const queryResult = await task.query(participation.repositoryData!, nextVersionSql + addNodesquery + deleteNodes + addChildQuery)
        const partition = await affectedPartition(task, parentNode!.id, participation)
        return {
            messageKind: "ChildReplaced",
            parent: msg.parent,
            containment: msg.containment,
            index: msg.index,
            newChild: msg.newChild,
            replacedChild: msg.replacedChild,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(parentNode.id), affectedPartitionMessage(partition)]
        } as ChildReplacedEvent
    })

    return result
}

const MoveChildFromOtherContainmentFunction = async (
    participation: Participation,
    msg: MoveChildFromOtherContainmentCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveChildFromOtherContainment " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.newParent, msg.movedChild, msg.oldParent
        ])
        const newParentNode = findAndValidateNodeExists(msg.newParent, nodesFromDB, msg, participation)
        const movedChildNode = findAndValidateNodeExists(msg.movedChild, nodesFromDB, msg, participation)
        const oldParentFromCommand = findAndValidateNodeExists(msg.oldParent, nodesFromDB, msg, participation)
        const oldParentFromCmdContainment = NodeUtils.findContainment(oldParentFromCommand, msg.oldContainment)
        if (
            oldParentFromCmdContainment === undefined ||
            msg.oldIndex > oldParentFromCmdContainment.children.length ||
            oldParentFromCmdContainment?.children[msg.oldIndex] !== msg.movedChild
        ) {
            throw newErrorDelta("indexEntryMismatch", `child is not at oldIndex`, msg, participation)
        }
        const oldMovedChildParentFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            movedChildNode.parent!
        ])
        const oldParentNode = findAndValidateNodeExists(movedChildNode.parent!, oldMovedChildParentFromDB, msg, participation)
        if (newParentNode.id === oldParentNode.id) {
            throw newErrorDelta(
                "haveTheSameParents",
                `Old and new parent are the same (${newParentNode.id}, not allowed for MoveChildFromOtherContainment command`,
                msg,
                participation
            )
        }
        if (msg.oldParent !== movedChildNode.parent) {
            throw newErrorDelta(
                "parentMismatch",
                `Parent in message is not the parent of the child in the repository`,
                msg,
                participation
            )
        }
        const newContainment = validateContainment(newParentNode, msg.newContainment, msg.newIndex, "Add", undefined, msg, participation)
        
        const oldContainment = oldParentNode.containments.find(cont => cont.children.includes(msg.movedChild))
        if (oldContainment === undefined) {
            throw newErrorDelta("moveWithoutParent", `Internal error: (old) parent of ${msg.movedChild} does not have a containment with this node.`, msg, participation)
        }
        const oldIndex = oldContainment.children.indexOf(movedChildNode.id)
        
        // Now Do It
        // remove movedChild from oldParent containment
        // add moivedChild to newParent comntainment.
        const changes = new DbChanges(TableHelpers.pgp)
        newContainment.children.splice(msg.newIndex, 0, movedChildNode.id)
        oldContainment.children.splice(oldIndex, 1)
        changes.addChanges(
            [
                new ParentChanged(new JsonContext(null, ["delta"]), movedChildNode, oldParentNode.id, newParentNode.id),
                new ChildAdded(new JsonContext(null, ["delta"]), newParentNode, msg.newContainment, newContainment, movedChildNode.id, Missing.MissingBefore),
                new ChildRemoved(new JsonContext(null, ["delta"]), oldParentNode, oldContainment.containment, oldContainment, movedChildNode.id, Missing.NotMissing),
            ]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        // TODO This isn't neccesary as this is done by next functionm call: check this!
        await metaPointerTracker.populateFromNodes([newParentNode], task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [newParentNode], task)
        await task.query(participation.repositoryData!, changes.createPostgresQuery(metaPointerTracker))
        const oldPartition = await affectedPartition(task, oldParentNode!.id, participation)
        const newPartition = await affectedPartition(task, newParentNode!.id, participation)
        return {
            messageKind: "ChildMovedFromOtherContainment",
            newParent: newParentNode.id,
            newContainment: msg.newContainment,
            newIndex: 0,
            oldParent: oldParentNode.id,
            oldContainment: msg.newContainment,
            oldIndex: oldIndex,
            movedChild: "",
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            additionalInfos: [
                affectedNodeMessage(msg.newParent),
                affectedPartitionMessage(oldPartition),
                // TODO Make sure two infos with the same key are handled correctly
                affectedPartitionMessage(newPartition)
            ]
        } as ChildMovedFromOtherContainmentEvent
    })
    return result
}

const MoveChildFromOtherContainmentInSameParent = async (
    participation: Participation,
    msg: MoveChildFromOtherContainmentInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveChildFromOtherContainmentInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveChildInSameContainment = async (
    participation: Participation,
    msg: MoveChildInSameContainmentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveChildInSameContainment " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildFromOtherContainment = async (
    participation: Participation,
    msg: MoveAndReplaceChildFromOtherContainmentCommand
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveAndReplaceChildFromOtherContainment " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildFromOtherContainmentInSameParent = async (
    participation: Participation,
    msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveAndReplaceChildFromOtherContainmentInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildInSameContainment = async (
    participation: Participation,
    msg: MoveAndReplaceChildInSameContainmentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.debug("Called MoveAndReplaceChildInSameContainment " + msg.messageKind)
    return errorEvent(msg)
}

export const childFunctions: DeltaFunction[] = [
    {
        messageKind: "AddChild",
        // @ts-expect-error TS2332
        processor: AddChild
    },
    {
        messageKind: "DeleteChild",
        // @ts-expect-error TS2332
        processor: DeleteChild
    },
    {
        messageKind: "ReplaceChild",
        // @ts-expect-error TS2332
        processor: ReplaceChild
    },
    {
        messageKind: "MoveChildFromOtherContainment",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainmentFunction
    },
    {
        messageKind: "MoveChildInSameContainment",
        // @ts-expect-error TS2332
        processor: MoveChildInSameContainment
    },
    {
        messageKind: "MoveChildFromOtherContainmentInSameParent",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainmentInSameParent
    },
    {
        messageKind: "MoveAndReplaceChildFromOtherContainment",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainment
    },
    {
        messageKind: "MoveAndReplaceChildFromOtherContainmentInSameParent",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainmentInSameParent
    },
    {
        messageKind: "MoveAndReplaceChildInSameContainment",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildInSameContainment
    }
]
