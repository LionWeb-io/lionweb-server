import { deltaLogger } from "@lionweb/server-common"
import { AddPartitionCommand, DeletePartitionCommand, DeltaEvent, PartitionAddedEvent } from "@lionweb/server-delta-shared"
import { activeSockets } from "../DeltaClientAdmin.js"
import WebSocket from "ws"
import { DeltaFunction, errorEvent } from "./DeltaUtil.js"

const AddPartitionFunction = (socket: WebSocket, msg: AddPartitionCommand): DeltaEvent => {
    deltaLogger.info("Called AddPartitionFunction " + msg.messageKind)
    const pInfo = activeSockets.get(socket)
    const response: PartitionAddedEvent = {
        messageKind: "PartitionAdded",
        newPartition: { nodes: [] },
        originCommands: [{ commandId: msg.commandId, participationId: pInfo!.participationId }],
        sequenceNumber: 0,
        protocolMessages: []
    }
    return response
}

const DeletePartitionFunction = (socket: WebSocket, msg: DeletePartitionCommand): DeltaEvent => {
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
