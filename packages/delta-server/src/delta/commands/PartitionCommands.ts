import { deltaLogger } from "@lionweb/server-common"
import { AddPartitionCommand, DeletePartitionCommand, DeltaEvent, PartitionAddedEvent } from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddPartitionFunction = (participation: ParticipationInfo, msg: AddPartitionCommand, _ctx: DeltaContext): DeltaEvent => {
    deltaLogger.info("Called AddPartitionFunction " + msg.messageKind)
    const response: PartitionAddedEvent = {
        messageKind: "PartitionAdded",
        newPartition: { nodes: [] },
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        sequenceNumber: 0,
        protocolMessages: []
    }
    return response
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
