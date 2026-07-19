import { DB_retrievePartitionNodes, DB_retrieveFullNodesRecursive, DB_getAvailableIds } from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import {
    DeltaEvent,
    DeltaResponse,
    GetAvailableIdsRequest,
    GetAvailableIdsResponse,
    InformAboutChangingPartitionsRequest,
    InformAboutChangingPartitionsResponse,
    ListAndSubscribePartitionsRequest,
    ListAndSubscribePartitionsResponse,
    ListPartitionsRequest,
    ListPartitionsResponse,
    ReconnectRequest,
    ReconnectResponse,
    SignOffRequest,
    SignOffResponse,
    SignOnRequest,
    SignOnResponse,
    SubscribeToChangingPartitionsRequest,
    SubscribeToChangingPartitionsResponse,
    SubscribeToPartitionContentsRequest,
    SubscribeToPartitionContentsResponse,
    UnsubscribeFromPartitionContentsRequest,
    UnsubscribeFromPartitionContentsResponse,
    type ErrorDelta
} from "@lionweb/server-delta-shared"
import { deltaLogger } from "@lionweb/server-logging"
import { DeltaFunction } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorDelta } from "../events.js"
import { Participation, ChangingPartitionsSubscription, PARTICIPATIONS } from "../participation/index.js"

/**
 * Allowed state transitions:
 * START     => connected
 * connected => signedOn
 * signedOn  => signedOff    NB should this not be "connected again?
 * signedOff => signedOn
 *
 * connected => disconnected
 * signedOn  => dicponnected
 * signedOff => disconnected */
// export type ParticipationStatus = "connected" | "signedOn" | "signedOff" | "disconnected"

const SubscribeToChangingPartitionsRequestFunction = (
    participation: Participation,
    msg: SubscribeToChangingPartitionsRequest
): DeltaEvent | DeltaResponse | ErrorDelta => {
    deltaLogger.info("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
    const subscription= new ChangingPartitionsSubscription()
    subscription.deletion = msg.deletion
    subscription.creation = msg.creation
    subscription.autoSubscribe = true
    participation.partitionChangesSubscription = subscription
    return {
        messageKind: "SubscribeToChangingPartitionsResponse",
        queryId: msg.queryId,
        additionalInfos: []
    } as SubscribeToChangingPartitionsResponse
}

const InformAboutChangingPartitionsRequestFunction = (
    participation: Participation,
    msg: InformAboutChangingPartitionsRequest
): DeltaEvent | DeltaResponse | ErrorDelta => {
    deltaLogger.info("Called InformAboutChangingPartitionsRequestFunction " + msg.messageKind)
    const subscription= new ChangingPartitionsSubscription()
    subscription.deletion = msg.deletion
    subscription.creation = msg.creation
    subscription.depth = msg.depthLimit
    subscription.autoSubscribe = false
    participation.partitionChangesSubscription = subscription
    return {
        messageKind: "InformAboutChangingPartitionsResponse",
        queryId: msg.queryId,
        additionalInfos: []
    } as InformAboutChangingPartitionsResponse
}

const SubscribeToPartitionContentsRequestFunction = async (
    participation: Participation,
    msg: SubscribeToPartitionContentsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse | ErrorDelta> => {
    deltaLogger.info("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        if (participation.subscribedPartitions.has(msg.partition)) {
            return newErrorDelta("alreadySubscribed", `Already subscribed to partition ${msg.partition}`, msg, participation)
        }
        participation.subscribedPartitions.add(msg.partition)
        const queryResult = await DB_retrieveFullNodesRecursive(task, participation.repositoryData!, [msg.partition], Number.MAX_SAFE_INTEGER)
        return {
            messageKind: "SubscribeToPartitionContentsResponse",
            contents: { nodes: queryResult },
            additionalInfos: [],
            queryId: msg.queryId
        } as SubscribeToPartitionContentsResponse
    })
    return result
}

const UnsubscribeFromPartitionContentsRequestFunction = (
    participation: Participation,
    msg: UnsubscribeFromPartitionContentsRequest,
    _ctx: DeltaContext
): DeltaEvent | DeltaResponse | ErrorDelta => {
    deltaLogger.info("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
    if (!participation.subscribedPartitions.has(msg.partition)) {
        return newErrorDelta("notSubscribed", `Not subscribed to partition ${msg.partition}, cannot unsubscribe`, msg, participation)
    }
    participation.subscribedPartitions.delete(msg.partition)
    return {
        queryId: msg.queryId,
        messageKind: "UnsubscribeFromPartitionContentsResponse",
        additionalInfos: []
    } as UnsubscribeFromPartitionContentsResponse
}

const SignOnRequestFunction = async (
    participation: Participation,
    msg: SignOnRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse | ErrorDelta> => {
    deltaLogger.info("Called SignOnRequestFunction " + msg.messageKind)
    const error = validateSignOnRequest(participation, msg)
    if (error !== undefined) {
        return error
    }
    participation.participationStatus = "signedOn"
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        await participation.startParticipation(task, msg.clientId, msg.repositoryId)
    })
    return {
        messageKind: "SignOnResponse",
        participationId: participation.participationId,
        queryId: msg.queryId,
        additionalInfos: [{ data: {}, kind: "Info", message: "SignOnRequest received ok" }]
    } as SignOnResponse
}

const validateSignOnRequest = (participation: Participation | undefined, msg: SignOnRequest): ErrorDelta | undefined => {
    if (msg.repositoryId === undefined) {
        return newErrorDelta("repositoryIdMissing", `Repository id missing in request`, msg, participation!)
    }
    if (participation === undefined) {
        // no participation info found for this socket, something unknown went wrong.
        return newErrorDelta("participationMissing", `Repository '${msg.repositoryId}' unknown`, msg, participation!)
    }
}

const SignOffRequestFunction = (participation: Participation, msg: SignOffRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called SignOffRequestFunction " + msg.messageKind)
    if (participation.participationStatus !== "signedOn") {
        return newErrorDelta("notSignedOn", "Cannot SignOff a participation, because you are not signed on.", msg, participation)
    }
    participation.participationStatus = "connected"
    return {
        messageKind: "SignOffResponse",
        queryId: msg.queryId,
        additionalInfos: []
    } as SignOffResponse
}

const ListPartitionsRequestFunction = async (
    participation: Participation,
    msg: ListPartitionsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info("Called ListPartitionsRequestFunction " + msg.messageKind)
    const partitionsContents = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const partitions = await DB_retrievePartitionNodes(task, participation.repositoryData!)
        const partitionsContents = await DB_retrieveFullNodesRecursive(
            task,
            participation.repositoryData!,
            partitions.nodes.map(n => n.id),
            msg.depthLimit
        )
        return partitionsContents
    })

    const response: ListPartitionsResponse = {
        messageKind: "ListPartitionsResponse",
        partitions: { nodes: partitionsContents },
        queryId: msg.queryId,
        additionalInfos: []
    }
    return response
}

const ListAndSubscribePartitionsRequestFunction = async (
    participation: Participation,
    msg: ListAndSubscribePartitionsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info("Called ListAndSubscribePartitionsRequestFunction " + msg.messageKind)
    const partitionsContents = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const partitions = await DB_retrievePartitionNodes(task, participation.repositoryData!)
        const partitionsContents = await DB_retrieveFullNodesRecursive(
            task,
            participation.repositoryData!,
            partitions.nodes.map(n => n.id),
            Number.MAX_SAFE_INTEGER
        )
        partitions.nodes.forEach(part => participation.subscribedPartitions.add(part.id))
        return partitionsContents
    })
    
    const response: ListAndSubscribePartitionsResponse = {
        messageKind: "ListAndSubscribePartitionsResponse",
        partitions: { nodes: partitionsContents },
        queryId: msg.queryId,
        additionalInfos: []
    }
    return response
}

const GetAvailableIdsRequestFunction = async (
    participation: Participation,
    msg: GetAvailableIdsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info(`Called GetAvailableIdsRequestFunction participation '${JSON.stringify(participation)}'`)
    const ids = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const result = await DB_getAvailableIds(task, participation.repositoryData!, msg.count)
        return result
    })
    const response: GetAvailableIdsResponse = {
        messageKind: "GetAvailableIdsResponse",
        queryId: msg.queryId,
        ids: ids,
        additionalInfos:[]
    }
    return response
}

const ReconnectRequestFunction = (
    participation: Participation,
    msg: ReconnectRequest,
    _ctx: DeltaContext
): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called ReconnectRequestFunction " + msg.messageKind)
    const oldParticipation = PARTICIPATIONS.findOldParticipation(msg.participationId)
    if (oldParticipation !== undefined) {
        // TODO next line should be done here, but we don't know the socket.
        // PARTICIPATIONS.reconnect(socket, oldParticipation)
        const response: ReconnectResponse = {
            messageKind: "ReconnectResponse",
            queryId: msg.queryId,
            lastSentSequenceNumber: oldParticipation.lastSequenceNumber(),
            additionalInfos: []
        }
        return response
    } else {
        throw newErrorDelta("invalidParticipation", `Server cannot forn an old participation with the id ${msg.participationId}`, msg, undefined)
    }
}

export const requestFunctions: DeltaFunction[] = [
    {
        messageKind: "SignOnRequest",
        // @ts-expect-error TS2322
        processor: SignOnRequestFunction
    },
    {
        messageKind: "SignOffRequest",
        // @ts-expect-error TS2322
        processor: SignOffRequestFunction
    },
    {
        messageKind: "GetAvailableIdsRequest",
        // @ts-expect-error TS2322
        processor: GetAvailableIdsRequestFunction
    },
    {
        messageKind: "ListPartitionsRequest",
        // @ts-expect-error TS2322
        processor: ListPartitionsRequestFunction
    },
    {
        messageKind: "ReconnectRequest",
        // @ts-expect-error TS2322
        processor: ReconnectRequestFunction
    },
    {
        messageKind: "SubscribeToChangingPartitionsRequest",
        // @ts-expect-error TS2322
        processor: SubscribeToChangingPartitionsRequestFunction
    },
    {
        messageKind: "InformAboutChangingPartitionsRequest",
        // @ts-expect-error TS2322
        processor: InformAboutChangingPartitionsRequestFunction
    },
    {
        messageKind: "SubscribeToPartitionContentsRequest",
        // @ts-expect-error TS2322
        processor: SubscribeToPartitionContentsRequestFunction
    },
    {
        messageKind: "UnsubscribeFromPartitionContentsRequest",
        // @ts-expect-error TS2322
        processor: UnsubscribeFromPartitionContentsRequestFunction
    },
    {
        messageKind: "ListAndSubscribePartitionsRequest",
        // @ts-expect-error TS2322
        processor: ListAndSubscribePartitionsRequestFunction
    }
]
