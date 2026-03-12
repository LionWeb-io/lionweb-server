import { LionWebJsonNode } from "@lionweb/json"
import { ValidationIssue } from "@lionweb/validation"
import { dbLogger, SQL, DB, LionWebTask, deltaLogger, NodeWithParent } from "@lionweb/server-common"
import {
    AdditionalInfo,
    CommandId,
    DeltaCommand,
    DeltaRequest,
    ErrorEvent, LionWebId,
    MessageFromClient,
    MessageToClient
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorDelta, queryData } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import WebSocket from "ws"

export type CommandOrRequest = {
    commandId: CommandId;
    messageKind: string;
    additionalInfos: AdditionalInfo[];

}
export type MessageFunction =  (participation: ParticipationInfo, msg: MessageFromClient, ctx: DeltaContext, socket?: WebSocket) => (MessageToClient)

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
    additionalInfos: []
})

export const errorNotImplementedEvent = (msg: DeltaRequest): ErrorEvent => (
    {
        message: `${msg.messageKind}: Not implemented yet`,
        sequenceNumber: 0,
        originCommands: [ { commandId: msg.queryId, participationId: "error"}],
        errorCode: "generic",
        messageKind: "ErrorEvent",
        additionalInfos: []
    }
)

export const issuesToProtocolMessages = (issues: ValidationIssue[]): AdditionalInfo[] => {
    return issues.map(issue => {
        return {
            kind: issue.issueType,
            message: issue.errorMsg(),
            data: []
        }
    })
}

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
        throw newErrorDelta("queryError", "Query result has incorrect type", delta, participation, {
            additionalInfos: queryData("empty", queryResult)
        })
    }
    if (queryResult === undefined || queryResult.length === 0) {
        throw newErrorDelta("nodeDoesNotExist", `The node with id '${id}' does not exist result ${queryResult}`, delta, participation)
    }
    if (queryResult.length > 1) {
        throw newErrorDelta("TwoNodesWithSameId", `There are two nodes with id '${id}' in the repository`, delta, participation, {
            additionalInfos: queryData("query", queryResult)
        })
    }
    return queryResult[0]
}

/**
 * Find the Partition to which the node with `nodeid` belongs.
 * @param nodeid
 * @param participation
 * @param ctx
 */
export async function affectedPartition(nodeid: LionWebId, participation: ParticipationInfo, ctx: DeltaContext): Promise<LionWebId> {
    const parentChain = await DB.retrieveParentsDB(ctx!.dbConnection, participation!.repositoryData!, nodeid)
    if (parentChain === undefined) {
        throw new Error("affectedPartition: Internal Error: PARENT CHAIN UNDEFINED")
    }
    deltaLogger.debug(`affectedPartition: PARENT CHAIN IS ${JSON.stringify(parentChain)}`)
    const affectedPartition = parentChain[parentChain.length - 1] ?? ({ id: nodeid, parent: null } as NodeWithParent)
    return affectedPartition.id
}
