
import { LionWebJsonNode } from "@lionweb/json"
import { deltaLogger, is_NodesForQueryQuery_ResultType, retrieveFullNodesFromQuerySQL, NodesForQueryQuery_ResultType } from "@lionweb/server-common"
import { retrieveNodeSQL } from "@lionweb/server-common/dist/queries/queries.js"
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

/**
 * Retrieve full node, (without children) with `id` from the database.
 * Throw an exception of type `ErrorEvent` if the node does not exist, or there is more than one node with `id`.
 * @param id            The id of the node to be retrieved
 * @param delta         The delta command for which the node is to be found.
 * @param participation The participation info of the delta command
 * @param ctx           The database context to enable database calls
 */
export const retrieveNodeFromDB = async(id: string, delta: DeltaCommand | DeltaRequest, participation: ParticipationInfo, ctx: DeltaContext): Promise<LionWebJsonNode> => {
    const innerQuery = retrieveNodeSQL(id)
    const query = retrieveFullNodesFromQuerySQL(innerQuery)
    const queryResult = await ctx.dbConnection.query(participation.repositoryData!, query)
    deltaLogger.info(`Result of retrieveNode: '${JSON.stringify(queryResult)}'`)

    // Validate return type
    if (!is_NodesForQueryQuery_ResultType(queryResult)) {
        throw newErrorEvent("InternalError", "Query result has incorrect type", delta, participation, {
            protocolMessages: queryData(query, queryResult)
        })
    }
    if (queryResult.length === 0) {
        throw newErrorEvent("NodeDoesNotExist", `The node with id '${id}' does not exist`, delta, participation, {
            protocolMessages: queryData(query, queryResult)
        })
    }
    if (queryResult.length > 1) {
        throw newErrorEvent("TwoNodesWithSameId", `There are two nodes with id '${id}' in the repository`, delta, participation, {
            protocolMessages: queryData(query, queryResult)
        })
    }
    return queryResult[0]
}
