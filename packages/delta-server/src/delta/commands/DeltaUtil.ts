
import { LionWebJsonNode } from "@lionweb/json"
import { ValidationIssue } from "@lionweb/validation"
import { dbLogger, SQL, DB, LionWebTask } from "@lionweb/server-common"
import {
    CommandId,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    DeltaResponse,
    ErrorEvent,
    ProtocolMessage
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorEvent, queryData } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"

export type MessageFromClient = DeltaCommand | DeltaRequest

export type CommandOrRequest = {
    commandId: CommandId;
    messageKind: string;
    protocolMessages: ProtocolMessage[];

}
export type MessageFunction =  (participation: ParticipationInfo, msg: MessageFromClient, ctx: DeltaContext) => (DeltaEvent | DeltaResponse)

export type DeltaFunction = {
    messageKind: string;
    processor: MessageFunction;
}

export const errorEvent = (msg: DeltaCommand): ErrorEvent => ({
    message: `${msg.messageKind}: Not implemented yet`,
    sequenceNumber: 0,
    originCommands: [{ commandId: msg.commandId, participationId: "error" }],
    errorCode: "generic",
    messageKind: "ErrorEvent",
    protocolMessages: []
})

export const errorNotImplementedEvent = (msg: DeltaRequest): ErrorEvent => (
    {
        message: `${msg.messageKind}: Not implemented yet`,
        sequenceNumber: 0,
        originCommands: [ { commandId: msg.queryId, participationId: "error"}],
        errorCode: "generic",
        messageKind: "ErrorEvent",
        protocolMessages: []
    }
)

export const issuesToProtocolNessages = (issues: ValidationIssue[]): ProtocolMessage[] => {
    return issues.map(issue => {
        return {
            kind: issue.issueType,
            message: issue.errorMsg(),
            data: []
        }
    })
}

// To whom needs this Event (yes, it's an Event now) need to be sent.
// For most/all events, we need to know whether the others are subscribed to the partition wjhre changes took place
// export async function getAffectedPartitions(task: LionWebTask, response: DeltaEvent | DeltaResponse) {
//     // TODO: Add the changed partitions to the result of the processing function, so we know to whom to send.
//     deltaLogger.debug(`looking foir affected nodes in ${response}`)
//     const affectedNodeData = response.protocolMessages.find(m => m.kind == "AffectedNode")
//     const affectedNode = affectedNodeData?.data?.find(kv => kv.key === "node")
//     if (affectedNode === undefined) {
//         deltaLogger.debug("No affected node found, not sending delta's")
//     } else {
//         // TODO The parent is retrieved outside the transaction, could already be changed by another delta.
//         const parentChain = await retrieveParentsDB(this.context!.dbConnection, participation!.repositoryData!, affectedNode.value)
//         if (parentChain === undefined) {
//             throw new Error("PARENTCHAIN UNDEFINED")
//         } else {
//             deltaLogger.debug(`PARENT CHAIN IS ${parentChain.map(p => `${p.id} parent ${p.parent} | `)}`)
//         }
//         const affectedPartition = parentChain[parentChain.length - 1]
//         if (affectedPartition !== undefined) {
//             for (const participationInfo of activeSockets.values()) {
//                 if (participationInfo.subscribedPartitions.includes(affectedPartition.id)) {
//                     response.sequenceNumber = participationInfo.eventSequenceNumber++
//                     deltaLogger.info(`Subscribed Sending ${JSON.stringify(response)} to ${participationInfo.repositoryData!.clientId}`)
//                     participationInfo.socket.send(JSON.stringify(response))
//                 } else {
//                     deltaLogger.info(`NOT Subscribed ${participationInfo.repositoryData!.clientId}`)
//                 }
//             }
//         } else {
//             deltaLogger.info(`NO Subscribed no affected node`)
//         }
//     }
// }
/**
 * Retrieve full node, (without children) with `id` from the database.
 * Throw an exception of type `ErrorEvent` if the node does not exist, or there is more than one node with `id`.
 * @param id            The id of the node to be retrieved
 * @param delta         The delta command for which the node is to be found.
 * @param participation The participation info of the delta command
 * @param ctx           The database context to enable database calls
 */
export const retrieveNodeFromDB = async(id: string, delta: DeltaCommand | DeltaRequest, participation: ParticipationInfo, task: LionWebTask): Promise<LionWebJsonNode> => {
    const queryResult = await DB.retrieveSingleFullNodeDB(task, participation.repositoryData!, id)
    dbLogger.info(`Result of retrieveNode: '${JSON.stringify(queryResult)}'`) 

    // Validate return type
    if (!SQL.is_NodesForQueryQuery_ResultType(queryResult)) {
        throw newErrorEvent("InternalError", "Query result has incorrect type", delta, participation, {
            protocolMessages: queryData("empty", queryResult)
        })
    }
    if (queryResult === undefined || queryResult.length === 0) {
        throw newErrorEvent("NodeDoesNotExist", `The node with id '${id}' does not exist result ${queryResult}`, delta, participation)
    }
    if (queryResult.length > 1) {
        throw newErrorEvent("TwoNodesWithSameId", `There are two nodes with id '${id}' in the repository`, delta, participation, {
            protocolMessages: queryData("query", queryResult)
        })
    }
    return queryResult[0]
}
