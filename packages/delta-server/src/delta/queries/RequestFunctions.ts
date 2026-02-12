import { deltaLogger, LionWebTask, DB } from "@lionweb/server-common"
import {
    DeltaEvent,
    DeltaResponse,
    GetAvailableIdsRequest,
    GetAvailableIdsResponse,
    InformAboutChangingPartitionsRequest,
    InformAboutChangingPartitionsResponse,
    ListPartitionsRequest,
    ListPartitionsResponse,
    ReconnectRequest,
    SignOffRequest,
    SignOffResponse,
    SignOnRequest,
    SignOnResponse,
    SubscribeToChangingPartitionsRequest,
    SubscribeToChangingPartitionsResponse,
    SubscribeToPartitionContentsRequest,
    SubscribeToPartitionContentsResponse,
    UnsubscribeFromPartitionContentsRequest,
    UnsubscribeFromPartitionContentsResponse
} from "@lionweb/server-delta-shared"
import { DeltaFunction, errorNotImplementedEvent } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorDelta, ErrorDelta } from "../events.js"
import { ParticipationInfo, ChangingPartitionsSubscription } from "./Participation.js"

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
    participation: ParticipationInfo,
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
        additionalInfo: []
    } as SubscribeToChangingPartitionsResponse
}

const InformAboutChangingPartitionsRequestFunction = (
    participation: ParticipationInfo,
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
        additionalInfo: []
    } as InformAboutChangingPartitionsResponse
}

const SubscribeToPartitionContentsRequestFunction = async (
    participation: ParticipationInfo,
    msg: SubscribeToPartitionContentsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse | ErrorDelta> => {
    deltaLogger.info("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        if (participation.subscribedPartitions.includes(msg.partition)) {
            return newErrorDelta("AlreadySubscribed", `Already subscribed to partition ${msg.partition}`, msg, participation)
        }
        participation.subscribedPartitions.push(msg.partition)
        const queryResult = await DB.retrieveFullNodesRecursiveDB(task, participation.repositoryData!, [msg.partition], Number.MAX_SAFE_INTEGER)
        return {
            messageKind: "SubscribeToPartitionContentsResponse",
            contents: { nodes: queryResult },
            additionalInfo: [],
            queryId: msg.queryId
        } as SubscribeToPartitionContentsResponse
    })
    return result
}

const UnsubscribeFromPartitionContentsRequestFunction = (
    participation: ParticipationInfo,
    msg: UnsubscribeFromPartitionContentsRequest,
    _ctx: DeltaContext
): DeltaEvent | DeltaResponse | ErrorDelta => {
    deltaLogger.info("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
    if (!participation.subscribedPartitions.includes(msg.partition)) {
        return newErrorDelta("NotSubscribed", `Not subscribed to partition ${msg.partition}, cannot unsubscribe`, msg, participation)
    }
    const index = participation.subscribedPartitions.findIndex(p => p === msg.partition)
    participation.subscribedPartitions.splice(index, 1)
    return {
        queryId: msg.queryId,
        messageKind: "UnsubscribeFromPartitionContentsResponse",
        additionalInfo: []
    } as UnsubscribeFromPartitionContentsResponse
}

const SignOnRequestFunction = async (
    participation: ParticipationInfo,
    msg: SignOnRequest,
    _ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse | ErrorDelta> => {
    deltaLogger.info("Called SignOnRequestFunction " + msg.messageKind)
    const error = validateSignOnRequest(participation, msg)
    if (error !== undefined) {
        return error
    }
    participation.participationStatus = "signedOn"
    await participation.startParticipation(msg.clientId, msg.repositoryId)
    return {
        messageKind: "SignOnResponse",
        participationId: participation.participationId,
        queryId: msg.queryId,
        additionalInfo: [{ data: [], kind: "Info", message: "SignOnRequest received ok" }]
    } as SignOnResponse
}

const validateSignOnRequest = (participation: ParticipationInfo | undefined, msg: SignOnRequest): ErrorDelta | undefined => {
    if (msg.repositoryId === undefined) {
        return newErrorDelta("RepositoryIdMissing", `Repository id missing in request`, msg, participation!)
    }
    if (participation === undefined) {
        // no participation info found for this socket, something unknown went wrong.
        return newErrorDelta("ParticipationMissing", `Repository '${msg.repositoryId}' unknown`, msg, participation!)
    }
}

const SignOffRequestFunction = (participation: ParticipationInfo, msg: SignOffRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called SignOffRequestFunction " + msg.messageKind)
    if (participation.participationStatus !== "signedOn") {
        return newErrorDelta("NotSignedOn", "Cannot SignOff a participation, because you are not signed on.", msg, participation)
    }
    participation.participationStatus = "signedOff"
    return {
        messageKind: "SignOffResponse",
        queryId: msg.queryId,
        additionalInfo: []
    } as SignOffResponse
}

const ListPartitionsRequestFunction = async (
    participation: ParticipationInfo,
    msg: ListPartitionsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info("Called ListPartitionsRequestFunction " + msg.messageKind)
    const partitions = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const result = await DB.retrievePartitionsFromDB(task, participation.repositoryData!)
        return result
    })

    // const partitions = await retrievePartitionsFromDB(_ctx.dbConnection, participation.repositoryData!)
    const response: ListPartitionsResponse = {
        messageKind: "ListPartitionsResponse",
        partitions: { nodes: partitions.nodes },
        queryId: msg.queryId,
        additionalInfo: [
            {
                kind: "repoVersion",
                message: "The current version of the repository",
                data: [{ key: "version", value: "" + partitions.version }]
            }
        ]
    }
    return response
}

const GetAvailableIdsRequestFunction = async (
    participation: ParticipationInfo,
    msg: GetAvailableIdsRequest,
    ctx: DeltaContext
): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info("Called GetAvailableIdsRequestFunction " + msg.messageKind)
    const ids = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const result = await DB.getAvailableIds(task, participation.repositoryData!, msg.count)
        return result
    })
    const response: GetAvailableIdsResponse = {
        messageKind: "GetAvailableIdsResponse",
        queryId: msg.queryId,
        ids: ids,
        additionalInfo:[]
    }
    return response
}

const ReconnectRequestFunction = (
    participation: ParticipationInfo,
    msg: ReconnectRequest,
    _ctx: DeltaContext
): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called ReconnectRequestFunction " + msg.messageKind)
    return errorNotImplementedEvent(msg)
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
    }
]
