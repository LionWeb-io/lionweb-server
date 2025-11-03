import { deltaLogger } from "@lionweb/server-common";
import { DeltaEvent, DeltaResponse, GetAvailableIdsRequest,
    ListPartitionsRequest,
    ListPartitionsResponse,
    ReconnectRequest, SignOffRequest, SignOnRequest, SignOnResponse, SubscribeToChangingPartitionsRequest, SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest
} from "@lionweb/server-delta-shared"
import WebSocket from 'ws';
import { DeltaFunction, errorRequestEvent } from "../commands/index.js"
import { activeSockets } from "../DeltaClientAdmin.js"


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

let currentParticipationId: number = 1
    
const    SubscribeToChangingPartitionsRequestFunction = (socket: WebSocket, msg: SubscribeToChangingPartitionsRequest): DeltaEvent | DeltaResponse => {
        console.log("Called SubscribeToChangingPartitionsRequestFunction " + msg.messageKind)
        return errorRequestEvent(msg)
    }

const    SubscribeToPartitionContentsRequestFunction = (socket: WebSocket, msg: SubscribeToPartitionContentsRequest): DeltaEvent | DeltaResponse => {
        console.log("Called SubscribeToPartitionContentsRequestFunction " + msg.messageKind)
        return errorRequestEvent(msg)
    }

const    UnsubscribeFromPartitionContentsRequestFunction = (socket: WebSocket, msg: UnsubscribeFromPartitionContentsRequest): DeltaEvent  | DeltaResponse => {
        console.log("Called UnsubscribeFromPartitionContentsRequestFunction " + msg.messageKind)
        return errorRequestEvent(msg)
    }

const    SignOnRequestFunction = (socket: WebSocket, msg: SignOnRequest): DeltaEvent | DeltaResponse => {
        deltaLogger.info("Called SignOnRequestFunction " + msg.messageKind)
        // const repositoryInfo = msg.protocolMessages?.find(p => p.kind === "repository");
        // if (repositoryInfo === undefined) {
        //     const response: ErrorEvent = {
        //         messageKind: "ErrorEvent",
        //         errorCode: "RepositoryMissing",
        //         message: "SignOnRequest is missing repository name in the protocol message",
        //         sequenceNumber: 0,
        //         originCommands: [ {participationId: "unknown", commandId: msg.queryId} ],
        //         protocolMessages: []
        //     }
        //     const pInfo = activeSockets.get(socket)
        //     pInfo!.participationStatus = "signedOn"
        //     socket.send(JSON.stringify(response))
        // } else {
        //     const repositoryName = repositoryInfo.data.find( d => d.key === "repository")
        // }
        const pInfo = activeSockets.get(socket)
        deltaLogger.info(`SignOnRequest pInfo is ${pInfo}`)
        pInfo!.participationStatus = "signedOn"
        pInfo!.clientId = msg.clientId
        const response: SignOnResponse = {
            messageKind: "SignOnResponse",
            participationId: `pid-${currentParticipationId++}`,
            queryId: msg.queryId,
            protocolMessages: [ { data: [], kind: "Info", message: "SignOnRequest received"}]
        }
        return response
    }

const    SignOffRequestFunction = (socket: WebSocket, msg: SignOffRequest): DeltaEvent | DeltaResponse => {
        deltaLogger.info("Called SignOffRequestFunction " + msg.messageKind)
        return errorRequestEvent(msg)
    }

const    ListPartitionsRequestFunction = (socket: WebSocket, msg: ListPartitionsRequest): DeltaEvent | DeltaResponse => {
        deltaLogger.info("Called ListPartitionsRequestFunction " + msg.messageKind)
        const response: ListPartitionsResponse = {
            messageKind: "ListPartitionsResponse",
            partitions: {  nodes: [] },
            queryId: msg.queryId,
            protocolMessages: []
        }
        return response
    }

const    GetAvailableIdsRequestFunction = (socket: WebSocket, msg: GetAvailableIdsRequest): DeltaEvent | DeltaResponse => {
        deltaLogger.info("Called GetAvailableIdsRequestFunction " + msg.messageKind)
        return errorRequestEvent(msg)
    }

const    ReconnectRequestFunction = (socket: WebSocket, msg: ReconnectRequest): DeltaEvent | DeltaResponse => {
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
    },
]

