import { deltaLogger } from "@lionweb/server-common"
import {
    DeltaEvent,
    DeltaResponse,
    ErrorEvent,
    GetAvailableIdsRequest,
    ListPartitionsRequest,
    ListPartitionsResponse,
    ReconnectRequest,
    SignOffRequest,
    SignOnRequest,
    SignOnResponse,
    SubscribeToChangingPartitionsRequest,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import { DeltaFunction, errorRequestEvent } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "./Participation.js"

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
): DeltaEvent | DeltaResponse => {
    console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

const SubscribeToPartitionContentsRequestFunction = (
    participation: ParticipationInfo,
    msg: SubscribeToPartitionContentsRequest
): DeltaEvent | DeltaResponse => {
    console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

const UnsubscribeFromPartitionContentsRequestFunction = (
    participation: ParticipationInfo,
    msg: UnsubscribeFromPartitionContentsRequest, _ctx: DeltaContext
): DeltaEvent | DeltaResponse => {
    console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

const SignOnRequestFunction = async (participation: ParticipationInfo, msg: SignOnRequest, _ctx: DeltaContext): Promise<DeltaEvent | DeltaResponse> => {
    deltaLogger.info("Called SignOnRequestFunction " + msg.messageKind)
    const error = validateSignOnRequest(participation, msg)
    if (error !== undefined) {
        return error
    }
    participation.participationStatus = "signedOn"
    await participation.startParticipation(msg.clientId, msg.repositoryId)
    const response: SignOnResponse = {
        messageKind: "SignOnResponse",
        participationId: participation.participationId,
        queryId: msg.queryId,
        protocolMessages: [{ data: [], kind: "Info", message: "SignOnRequest received ok" }]
    }
    return response
}

const validateSignOnRequest = (pInfo: ParticipationInfo | undefined, msg: SignOnRequest): ErrorEvent | undefined => {
    if (msg.repositoryId === undefined) {
        const response: ErrorEvent = {
            messageKind: "ErrorEvent",
            errorCode: "RepositoryMissing",
            message: "SignOnRequest is missing repository id in the protocol message",
            sequenceNumber: 0,
            originCommands: [{ participationId: "none", commandId: msg.queryId }],
            protocolMessages: []
        }
        return response
    }
    if (pInfo === undefined) {
        // no participation info found for this socket, something unknown went wrong.
        const response: ErrorEvent = {
            messageKind: "ErrorEvent",
            errorCode: "RepositoryMissing",
            message: "No socket found: please disconnect and connect again.",
            sequenceNumber: 0,
            originCommands: [{ participationId: "unknown", commandId: msg.queryId }],
            protocolMessages: []
        }
        return response
    }
}

const SignOffRequestFunction = (participation: ParticipationInfo, msg: SignOffRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called SignOffRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

const ListPartitionsRequestFunction = (participation: ParticipationInfo, msg: ListPartitionsRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called ListPartitionsRequestFunction " + msg.messageKind)
    const response: ListPartitionsResponse = {
        messageKind: "ListPartitionsResponse",
        partitions: { nodes: [] },
        queryId: msg.queryId,
        protocolMessages: []
    }
    return response
}

const GetAvailableIdsRequestFunction = (participation: ParticipationInfo, msg: GetAvailableIdsRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called GetAvailableIdsRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

const ReconnectRequestFunction = (participation: ParticipationInfo, msg: ReconnectRequest, _ctx: DeltaContext): DeltaEvent | DeltaResponse => {
    deltaLogger.info("Called ReconnectRequestFunction " + msg.messageKind)
    return errorRequestEvent(msg)
}

export const requestFunctions: DeltaFunction[] = [
    {
        messageKind: "SignOn",
        // @ts-expect-error TS2322
        processor: SignOnRequestFunction
    },
    {
        messageKind: "SignOff",
        // @ts-expect-error TS2322
        processor: SignOffRequestFunction
    },
    {
        messageKind: "GetAvailableIds",
        // @ts-expect-error TS2322
        processor: GetAvailableIdsRequestFunction
    },
    {
        messageKind: "ListPartitions",
        // @ts-expect-error TS2322
        processor: ListPartitionsRequestFunction
    },
    {
        messageKind: "Reconnect",
        // @ts-expect-error TS2322
        processor: ReconnectRequestFunction
    },
    {
        messageKind: "SubscribeToChangingPartitions",
        // @ts-expect-error TS2322
        processor: SubscribeToChangingPartitionsRequestFunction
    },
    {
        messageKind: "SubscribeToPartitionContents",
        // @ts-expect-error TS2322
        processor: SubscribeToPartitionContentsRequestFunction
    },
    {
        messageKind: "UnsubscribeFromPartitionContents",
        // @ts-expect-error TS2322
        processor: UnsubscribeFromPartitionContentsRequestFunction
    }
]
