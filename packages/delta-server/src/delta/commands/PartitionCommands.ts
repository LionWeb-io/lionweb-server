import { Missing, NodeAdded, PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DbChanges, deltaLogger, insertNodeArraySQL, MetaPointersTracker } from "@lionweb/server-common"
import { AddPartitionCommand, DeletePartitionCommand, DeltaEvent, PartitionAddedEvent } from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddPartitionFunction = async (participation: ParticipationInfo, msg: AddPartitionCommand, _ctx: DeltaContext): Promise<DeltaEvent> => {
    deltaLogger.info("Called AddPartitionFunction " + msg.messageKind + " nodes ");// + msg.newPartition?.nodes?.length)

    const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
    await metaPointersTracker.populateFromNodes(msg.newPartition.nodes, _ctx.dbConnection)

    const insert = insertNodeArraySQL(msg.newPartition.nodes, metaPointersTracker)
    deltaLogger.info(`db add partition result is ${JSON.stringify(insert)}`)
    const dbResult = _ctx.dbConnection.query(participation.repositoryData!, insert)
    deltaLogger.info(`db add partition result is ${JSON.stringify(dbResult)}`)

    return {
        messageKind: "PartitionAdded",
        newPartition: { nodes: [] },
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        sequenceNumber: 0,
        protocolMessages: [
            {
                kind: "AffectedNode",
                message: `Node ${msg.newPartition} has been changed`,
                data: [{ key: "node", value: msg.newPartition.nodes[0].id }]
            }
        ]
    } as PartitionAddedEvent
}

const DeletePartitionFunction = (participation: ParticipationInfo, msg: DeletePartitionCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called DeletePartitionFunction " + msg.messageKind)
    return errorEvent(msg)
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
