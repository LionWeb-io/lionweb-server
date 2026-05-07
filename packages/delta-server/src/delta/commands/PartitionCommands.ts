import {
    MetaPointersTracker,
    SQL,
    DB
} from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import {
    AddPartitionCommand,
    DeletePartitionCommand,
    DeltaEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent
} from "@lionweb/server-delta-shared"
import { deltaLogger } from "@lionweb/server-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, newErrorDelta, ErrorDelta, affectedPartitionMessage } from "../events.js"
import { Participation } from "../participation/index.js"
import { DeltaFunction } from "./DeltaUtil.js"
import { validateProperTree } from "./Validations.js"

const AddPartitionFunction = async (
    participation: Participation,
    msg: AddPartitionCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug(`Called AddPartitionFunction ${msg.messageKind}`)
    const rootNode = validateProperTree(msg.newPartition, null, msg, participation)

    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const existingNodes = await DB.nodeIdsInUseDB(
            task,
            participation.repositoryData!,
            msg.newPartition.nodes.map(n => n.id)
        )
        if (existingNodes.length > 0) {
            deltaLogger.debug(`Cannot add partition, node ids ${existingNodes.map(n => n.id)} already in use`)
            return newErrorDelta(
                "idsAlreadyInUse",
                `Cannot add partition, node ids ${existingNodes.map(n => n.id)} already in use`,
                msg,
                participation
            )
        }
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await metaPointersTracker.populateFromNodes(msg.newPartition.nodes, task)

        let query = SQL.nextRepoVersionSQL(participation.participationId)
        query += SQL.insertNodeArraySQL(msg.newPartition.nodes, metaPointersTracker)
        // deltaLogger.info(`db add partition result is ${JSON.stringify(insert)}`)
        const dbResult = await task.query(participation.repositoryData!, query)
        // deltaLogger.info(`db add partition result is ${JSON.stringify(dbResult)}`)

        // We have checked that there is exactly one partition node, now select it as affected node
        const partitionNode = msg.newPartition.nodes.find(n => n.parent === null)!
        participation.subscribedPartitions.add(partitionNode.id)
        deltaLogger.info(`Adding partition ${partitionNode.id} to subscribed partitions for ${participation.repositoryData?.clientId}`)

        // Only put one node in the response, the actual nodes sent depend on the specific client.
        return {
            messageKind: "PartitionAdded",
            //  TODO Send the partitions or part of it, depending on subscription
            newPartition: { nodes: [rootNode] },
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,
            additionalInfos: [ affectedNodeMessage(partitionNode.id), affectedPartitionMessage(partitionNode.id) ]
        } as PartitionAddedEvent
    })
    return result
}

const DeletePartitionFunction = async (participation: Participation, msg: DeletePartitionCommand, _ctx: DeltaContext): Promise<DeltaEvent | ErrorDelta> => {
    deltaLogger.debug("Called DeletePartitionFunction " + msg.messageKind)
    const result = await _ctx.dbConnection.tx(async (task: LionWebTask) => {
        const queryResult = await DB.retrieveNodeTreeDB(task, participation.repositoryData!, [msg.deletedPartition], Number.MAX_SAFE_INTEGER)
        if (queryResult.length === 0) {
            return newErrorDelta("unknownNode", `Partition node with id ${msg.deletedPartition} does not exist`, msg, participation)
        }
        const nodesToDelete = queryResult.map(qr => qr.id)
        let query = SQL.nextRepoVersionSQL(participation.participationId)
        query += SQL.deleteFullNodesSQL(nodesToDelete)
        const deleteResult = await task.query(participation.repositoryData!, query)
        return {
            messageKind: "PartitionDeleted",
            deletedPartition: msg.deletedPartition,
            deletedDescendants: nodesToDelete,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,
            additionalInfos: [ affectedPartitionMessage(msg.deletedPartition),
                {
                    kind: "AffectedNode",
                    message: `Node ${msg.deletedPartition} has been changed`,
                    data: { node: msg.deletedPartition }
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
