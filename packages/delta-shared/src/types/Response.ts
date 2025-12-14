import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { QueryId } from "./DeltaTypes.js";
import { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
import { ParticipationId } from "./DeltaTypes.js";
import { SequenceNumber } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";

// The overall "super-type"
export type DeltaResponse = {
    messageKind: ResponseMessageKind;
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToChangingPartitionsResponse
 */
export type SubscribeToChangingPartitionsResponse = DeltaResponse & {
    messageKind: "SubscribeToChangingPartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToPartitionContentsResponse
 */
export type SubscribeToPartitionContentsResponse = DeltaResponse & {
    contents: LionWebDeltaJsonChunk;
    messageKind: "SubscribeToPartitionContentsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-UnsubscribeFromPartitionContentsResponse
 */
export type UnsubscribeFromPartitionContentsResponse = DeltaResponse & {
    messageKind: "UnsubscribeFromPartitionContentsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOnResponse
 */
export type SignOnResponse = DeltaResponse & {
    participationId: ParticipationId;
    messageKind: "SignOnResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOffResponse
 */
export type SignOffResponse = DeltaResponse & {
    messageKind: "SignOffResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ReconnectResponse
 */
export type ReconnectResponse = DeltaResponse & {
    lastSentSequenceNumber: SequenceNumber;
    messageKind: "ReconnectResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-GetAvailableIdsResponse
 */
export type GetAvailableIdsResponse = DeltaResponse & {
    ids: LionWebId[];
    messageKind: "GetAvailableIdsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ListPartitionsResponse
 */
export type ListPartitionsResponse = DeltaResponse & {
    partitions: LionWebDeltaJsonChunk;
    messageKind: "ListPartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ErrorResponse
 */
export type ErrorResponse = DeltaResponse & {
    errorCode: String;
    message: String;
    messageKind: "ErrorResponse";
};

// The type for the tagged union property
export type ResponseMessageKind =
    | "SubscribeToChangingPartitionsResponse"
    | "SubscribeToPartitionContentsResponse"
    | "UnsubscribeFromPartitionContentsResponse"
    | "SignOnResponse"
    | "SignOffResponse"
    | "ReconnectResponse"
    | "GetAvailableIdsResponse"
    | "ListPartitionsResponse"
    | "ErrorResponse";

// Type Guard function
export function isDeltaResponse(object: unknown): object is DeltaResponse {
    const castObject = object as DeltaResponse;
    return (
        castObject.messageKind !== undefined &&
        [
            "SubscribeToChangingPartitionsResponse",
            "SubscribeToPartitionContentsResponse",
            "UnsubscribeFromPartitionContentsResponse",
            "SignOnResponse",
            "SignOffResponse",
            "ReconnectResponse",
            "GetAvailableIdsResponse",
            "ListPartitionsResponse",
            "ErrorResponse",
        ].includes(castObject.messageKind)
    );
}
