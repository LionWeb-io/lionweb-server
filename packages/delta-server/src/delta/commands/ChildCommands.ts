import { isEqualMetaPointer } from "@lionweb/json"
import { ChildAdded, Missing, ChildRemoved } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import {
    DbChanges,
    deltaLogger,
    SQL, DB,
    LionWebTask,
    MetaPointersTracker,
    TableHelpers
} from "@lionweb/server-common"
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
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"
import { findAndvalidateNodeExists, validateContainment, validateProperTree } from "./Validations.js"

const AddChild = async (participation: ParticipationInfo, msg: AddChildCommand, ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called AddChild command id: " + msg.commandId)
    const newChildNode = validateProperTree(msg.newChild, msg.parent, msg, participation)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.parent,
            ...msg.newChild.nodes.map(n => n.id)
        ])
        const parentNode = findAndvalidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        const existingChildNodes = nodesFromDB.filter(n => n.id !== msg.parent)
        // node alreadyExists
        if (existingChildNodes.length > 0) {
            const existingIds = existingChildNodes.map(n => n.id)
            return newErrorEvent("err-nodeAlreadyExists", `Nodes '${existingIds}' already exist`, msg, participation)
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

        changes.addChanges(
            [new ChildAdded(new JsonContext(null, ["delta"]), parentNode!, msg.containment, containment, newChildNode!.id, Missing.MissingBefore)]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newChild.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newChild.nodes, task)
        const addNodesquery = SQL.insertNodeArraySQL(msg.newChild.nodes, metaPointerTracker)
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, addNodesquery + addChildQuery)
        return {
            messageKind: "ChildAdded",
            containment: msg.containment,
            index: msg.index,
            parent: msg.parent,
            newChild: msg.newChild,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            protocolMessages: [affectedNodeMessage(parentNode!.id)]
        } as ChildAddedEvent
    })
    return result
}

const DeleteChild = async (
    participation: ParticipationInfo,
    msg: DeleteChildCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called DeleteChild " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.parent, msg.deletedChild
        ])
        const parentNode = nodesFromDB.find(n => n.id === msg.parent)

        // Check whether parent exists
        if (parentNode === undefined) {
            return newErrorEvent("err-unknownNode", `Parent '${msg.parent}' does not exist`, msg, participation)
        }
        // Check whether child exists
        const childNode = nodesFromDB.find(n => n.id === msg.deletedChild)
        // validateExists(childNode, "err-unknownNode", `Child '${msg.deletedChild}' does not exist`, msg, participation)
        if (childNode === undefined) {
            return newErrorEvent("err-unknownNode", `Child '${msg.deletedChild}' does not exist`, msg, participation)
        }

        // Check whether containment exists in the parent
        const containment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, msg.containment))
        if (containment === undefined) {
            return newErrorEvent("unknownContainment", `Containment '${JSON.stringify(msg.containment)}' does not exists in parent '${msg.parent}'`, msg, participation)
        }
        if (msg.index > containment.children.length - 1) {
            return newErrorEvent("unknownIndex", "TODO", msg, participation)
        }
        if (containment.children[msg.index] !== msg.deletedChild) {
            return newErrorEvent("indexEntryMismatch", "TODO", msg, participation)
        }

        // All ok, now prepare the deletion query
        containment.children.splice(msg.index, 1)
        // Get the subtree of `deletedChild` from the database to remove them
        const subtreeNodes = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [msg.deletedChild], Number.MAX_SAFE_INTEGER)
        const deleteSql = SQL.deleteFullNodesSQL(subtreeNodes.map(n => n.id))
        const dbChanges = new DbChanges(TableHelpers.pgp)
        dbChanges.addChanges(            
            [new ChildRemoved(new JsonContext(null, ["delta"]), parentNode, msg.containment, containment, msg.deletedChild, Missing.MissingAfter)]
        ) 
        // Run the query with metapointers as a dummy, there are no metapointers being added
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        const execute = task.query(participation.repositoryData!, deleteSql + dbChanges.createPostgresQuery(metaPointerTracker))
        return {
            messageKind: "ChildDeleted",
            deletedChild: msg.deletedChild,
            index: msg.index,
            parent: msg.parent,
            containment: msg.containment,
            deletedDescendants: subtreeNodes.filter(node => node.id !== msg.deletedChild).map(node => node.id),
            protocolMessages: [affectedNodeMessage(parentNode.id)],
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0
        } as ChildDeletedEvent
    })
    return result
}

const ReplaceChild = async (
    participation: ParticipationInfo,
    msg: ReplaceChildCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called ReplaceChild " + msg.messageKind)
    validateProperTree(msg.newChild, msg.parent, msg, participation)
    
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.parent, msg.replacedChild, ...msg.newChild.nodes.map(n => n.id)

        ])
        const parentNode = findAndvalidateNodeExists(msg.parent, nodesFromDB, msg, participation)
        
        const existingChildNodes = nodesFromDB.filter(n => n.id !== msg.parent && n.id !== msg.replacedChild)
        // node alreadyExists
        if (existingChildNodes.length > 0) {
            const existingIds = existingChildNodes.map(n => n.id)
            return newErrorEvent("err-nodeAlreadyExists", `Nodes '${existingIds}' already exist`, msg, participation)
        }
        
        // Find the new child node
        const newChildNode = msg.newChild.nodes.find(node => node.parent === msg.parent)
        if (newChildNode === undefined) {
            // TODO this check can be moved to the ReferenceValidator by giving the `parent` as parameter
            return newErrorEvent("NoChildFound", `The newChild chunk does not contain a node with parent ${msg.parent}`, msg, participation)
        }
        
        // Check whether child exists
        const childNode = nodesFromDB.find(n => n.id === msg.replacedChild)
        if (childNode === undefined) {
            return newErrorEvent("err-unknownNode", `Child '${msg.replacedChild}' does not exist`, msg, participation)
        }

        const containment = validateContainment(parentNode, msg.containment, msg.index, "Replace", msg.replacedChild, msg, participation)
        // Check done, do the work
        const changes = new DbChanges(TableHelpers.pgp)
        const replacedTree = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [
            msg.replacedChild], Number.MAX_SAFE_INTEGER)

        // Add child to parent

        changes.addChanges(
            [new ChildAdded(new JsonContext(null, ["delta"]), parentNode, msg.containment, containment, newChildNode.id, Missing.MissingBefore)]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointerTracker.populateFromNodes(msg.newChild.nodes, task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, msg.newChild.nodes, task)
        const addNodesquery = SQL.insertNodeArraySQL(msg.newChild.nodes, metaPointerTracker)
        const deleteNodes = SQL.deleteFullNodesSQL(replacedTree.map(node => node.id))
        const addChildQuery = changes.createPostgresQuery(metaPointerTracker)
        const queryResult = await task.query(participation.repositoryData!, addNodesquery + deleteNodes + addChildQuery)
        
        return {
            messageKind: "ChildReplaced",
            parent: msg.parent,
            containment: msg.containment,
            index: msg.index,
            newChild: msg.newChild,
            replacedChild: msg.replacedChild,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            protocolMessages: [affectedNodeMessage(parentNode.id)]
        } as ChildReplacedEvent
    })

    return result
}

const MoveChildFromOtherContainment = async (
    participation: ParticipationInfo,
    msg: MoveChildFromOtherContainmentCommand,
    ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveChildFromOtherContainment " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const nodesFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            msg.newParent, msg.movedChild
        ])
        const newParentNode = findAndvalidateNodeExists(msg.newParent, nodesFromDB, msg, participation)
        const movedChildNode = findAndvalidateNodeExists(msg.movedChild, nodesFromDB, msg, participation)
        const oldParentFromDB = await DB.retrieveFullNodesFromIdListDB(task, participation.repositoryData!, [
            movedChildNode.parent!
        ])
        const oldParentNode = findAndvalidateNodeExists(movedChildNode.parent!, oldParentFromDB, msg, participation)
        if (newParentNode.id === oldParentNode.id) {
            throw newErrorEvent("SameParents", `Old and new parent are the same (${newParentNode.id}, not allowed for MoveChildFromOtherContainment command`, msg, participation)
        }
        const newContainment = validateContainment(newParentNode, msg.newContainment, msg.newIndex, "Add", undefined, msg, participation)
        const oldContainment = oldParentNode.containments.find(cont => cont.children.includes(msg.movedChild))
        if (oldContainment === undefined) {
            throw newErrorEvent("ParentError", `Internal error: (old) parent of ${msg.movedChild} does not have a containmennt with this node.`, msg, participation)
        }
        const oldIndex = oldContainment.children.indexOf(movedChildNode.id)
        
        // Now Do It
        // remove movedChild from oldParent containment
        // add moivedChild to newParent comntainment.
        const changes = new DbChanges(TableHelpers.pgp)
        newContainment.children.splice(msg.newIndex, 0, movedChildNode.id)
        oldContainment.children.splice(oldIndex, 0)
        changes.addChanges(
            [
                new ChildAdded(new JsonContext(null, ["delta"]), newParentNode, msg.newContainment, newContainment, movedChildNode.id, Missing.MissingBefore),
                new ChildRemoved(new JsonContext(null, ["delta"]), oldParentNode, oldContainment.containment, oldContainment, movedChildNode.id, Missing.MissingAfter),
            ]
        )
        // Add child nodes to database
        const metaPointerTracker = new MetaPointersTracker(participation.repositoryData!)
        // TODO This isn't neccesary as this is done by next functionm call: check this!
        await metaPointerTracker.populateFromNodes([newParentNode], task)
        await changes.populateMetaPointersFromDbChanges(metaPointerTracker, [newParentNode], task)
        await task.query(participation.repositoryData!, changes.createPostgresQuery(metaPointerTracker))
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
            sequenceNumber: 0,          // dummy, will be changed for each participation before sending
            protocolMessages: [affectedNodeMessage(msg.newParent)]
        } as ChildMovedFromOtherContainmentEvent
    })
    return errorEvent(msg)
}

const MoveChildFromOtherContainmentInSameParent = async (
    participation: ParticipationInfo,
    msg: MoveChildFromOtherContainmentInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveChildFromOtherContainmentInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveChildInSameContainment = async (
    participation: ParticipationInfo,
    msg: MoveChildInSameContainmentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveChildInSameContainment " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildFromOtherContainment = async (
    participation: ParticipationInfo,
    msg: MoveAndReplaceChildFromOtherContainmentCommand
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveAndReplaceChildFromOtherContainment " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildFromOtherContainmentInSameParent = async (
    participation: ParticipationInfo,
    msg: MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveAndReplaceChildFromOtherContainmentInSameParent " + msg.messageKind)
    return errorEvent(msg)
}

const MoveAndReplaceChildInSameContainment = async (
    participation: ParticipationInfo,
    msg: MoveAndReplaceChildInSameContainmentCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called MoveAndReplaceChildInSameContainment " + msg.messageKind)
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
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildInSameContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveChildFromOtherContainmentInSameParent
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildInSameContainment
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: MoveAndReplaceChildFromOtherContainmentInSameParent
    }
]
