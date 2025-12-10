import {
    deltaLogger,
    LionWebTask,
    MetaPointersTracker,
    SQL,
    DB,
    isProperTree
} from "@lionweb/server-common"
import {
    AddPartitionCommand,
    DeletePartitionCommand,
    DeltaEvent,
    ErrorEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, issuesToProtocolNessages } from "./DeltaUtil.js"

const AddPartitionFunction = async (
    participation: ParticipationInfo,
    msg: AddPartitionCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent> => {
    deltaLogger.info("Called AddPartitionFunction " + msg.messageKind + " nodes ") // + msg.newPartition?.nodes?.length)
    // - There is exactly one node with parent `parentNode`, called `childNode`
    // - All nodes together form a proper tree with root `childNode`, i.e. no orphans allowed
    //   This can be done through the LionwebReferenceValidator.
    const issues = isProperTree(msg.newPartition)
    if (issues.length > 0) {
        deltaLogger.debug(`Issue with partition ${JSON.stringify(msg)}`)
        return newErrorEvent("NotATree", `the newPartition chunk is not a proper tree`, msg, participation, {
            protocolMessages: issuesToProtocolNessages(issues)
        })
    }

    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const existingNodes = await DB.nodeIdsInUseDB(
            task,
            participation.repositoryData!,
            msg.newPartition.nodes.map(n => n.id)
        )
        if (existingNodes.length > 0) {
            console.log(`Cannot add partition, node ids ${existingNodes.map(n => n.id)} already in use`)
            return newErrorEvent(
                "IdsAlreadyInUse",
                `Cannot add partition, node ids ${existingNodes.map(n => n.id)} already in use`,
                msg,
                participation
            )
        }
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointersTracker.populateFromNodes(msg.newPartition.nodes, task)

        const insert = SQL.insertNodeArraySQL(msg.newPartition.nodes, metaPointersTracker)
        // deltaLogger.info(`db add partition result is ${JSON.stringify(insert)}`)
        const dbResult = task.query(participation.repositoryData!, insert)
        // deltaLogger.info(`db add partition result is ${JSON.stringify(dbResult)}`)

        // We have checked that there is exactly one partition node, now select it as affected node
        const partitionNode = msg.newPartition.nodes.find(n => n.parent === null)!
        participation.subscribedPartitions.push(partitionNode.id)
        deltaLogger.debug(`Adding partition ${partitionNode.id} to subscribed partitions`)
        return {
            messageKind: "PartitionAdded",
            newPartition: { nodes: [] },
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,
            protocolMessages: [ affectedNodeMessage(partitionNode) ]
        } as PartitionAddedEvent
    })
    return result
}

const DeletePartitionFunction = async (participation: ParticipationInfo, msg: DeletePartitionCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorEvent> => {
    deltaLogger.info("Called DeletePartitionFunction " + msg.messageKind)
    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const queryResult = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [msg.deletedPartition], Number.MAX_SAFE_INTEGER)
        if (queryResult.length === 0) {
            return newErrorEvent("err-unknownNode", `Partition node with id ${msg.deletedPartition} does not exist`, msg, participation)
        }
        const nodesToDelete = queryResult.map(qr => qr.id)
        const query = SQL.deleteFullNodesSQL(nodesToDelete)
        const deleteResult = await task.query(participation.repositoryData!, query)
        return {
            messageKind: "PartitionDeleted",
            deletedPartition: msg.deletedPartition,
            deletedDescendants: nodesToDelete,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,
            protocolMessages: [
                {
                    kind: "AffectedNode",
                    message: `Node ${msg.deletedPartition} has been changed`,
                    data: [{ key: "node", value: msg.deletedPartition }]
                }
            ]
        } as PartitionDeletedEvent
    })
    return result
}

export const partitionFunctions: DeltaFunction[] = [
    {
        messageKind: "AddPartition",
        // @ts-expect-error TS2332
        processor: AddPartitionFunction
    },
    {
        messageKind: "DeletePartition",
        // @ts-expect-error TS2332
        processor: DeletePartitionFunction
    }
]
