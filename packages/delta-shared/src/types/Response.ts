import type { QueryId } from "./DeltaTypes.js";
import type { String } from "./DeltaTypes.js";
import type { AdditionalInfo } from "./DeltaTypes.js";
import type { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
import type { Boolean } from "./DeltaTypes.js";
import type { Number } from "./DeltaTypes.js";
import type { ParticipationId } from "./DeltaTypes.js";
import type { SequenceNumber } from "./DeltaTypes.js";
import type { LionWebId } from "./Chunks.js";

export const DeltaResponseMessageKinds = [
    "SubscribeToChangingPartitionsResponse",
    "InformAboutChangingPartitionsResponse",
    "SubscribeToPartitionContentsResponse",
    "UnsubscribeFromPartitionContentsResponse",
    "ChunkedQueryResponse",
    "SignOnResponse",
    "SignOffResponse",
    "ReconnectResponse",
    "GetAvailableIdsResponse",
    "ListPartitionsResponse",
    "ListAndSubscribePartitionsResponse",
    "ErrorResponse",
] as const;

// The type for the tagged union property, derived from the above array
export type ResponseMessageKind = (typeof DeltaResponseMessageKinds)[number];

// The overall "super-type"
export type DeltaResponse = {
    queryId: QueryId;
    messageKind: ResponseMessageKind;
    additionalInfos: AdditionalInfo[];
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToChangingPartitions
 */
export type SubscribeToChangingPartitionsResponse = DeltaResponse & {
    messageKind: "SubscribeToChangingPartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-InformAboutChangingPartitions
 */
export type InformAboutChangingPartitionsResponse = DeltaResponse & {
    messageKind: "InformAboutChangingPartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToPartitionContents
 */
export type SubscribeToPartitionContentsResponse = DeltaResponse & {
    contents: LionWebDeltaJsonChunk;
    split?: Boolean;
    messageKind: "SubscribeToPartitionContentsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-UnsubscribeFromPartitionContents
 */
export type UnsubscribeFromPartitionContentsResponse = DeltaResponse & {
    messageKind: "UnsubscribeFromPartitionContentsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ChunkedQueryResponse
 */
export type ChunkedQueryResponse = DeltaResponse & {
    chunk: LionWebDeltaJsonChunk;
    continuedChunkCompleted: Boolean;
    continuedChunkSequenceNumber: Number;
    messageKind: "ChunkedQueryResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOn
 */
export type SignOnResponse = DeltaResponse & {
    participationId: ParticipationId;
    messageKind: "SignOnResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOff
 */
export type SignOffResponse = DeltaResponse & {
    messageKind: "SignOffResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-Reconnect
 */
export type ReconnectResponse = DeltaResponse & {
    lastSentSequenceNumber: SequenceNumber;
    messageKind: "ReconnectResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-GetAvailableIds
 */
export type GetAvailableIdsResponse = DeltaResponse & {
    ids: LionWebId[];
    messageKind: "GetAvailableIdsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ListPartitions
 */
export type ListPartitionsResponse = DeltaResponse & {
    partitions: LionWebDeltaJsonChunk;
    split?: Boolean;
    messageKind: "ListPartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ListAndSubscribePartitions
 */
export type ListAndSubscribePartitionsResponse = DeltaResponse & {
    partitions: LionWebDeltaJsonChunk;
    split?: Boolean;
    messageKind: "ListAndSubscribePartitionsResponse";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ErrorResponse
 */
export type ErrorResponse = DeltaResponse & {
    errorCode: String;
    message: String;
    messageKind: "ErrorResponse";
};

// Type Guard function
export function isDeltaResponse(object: unknown): object is DeltaResponse {
    const castObject = object as DeltaResponse;
    return castObject.messageKind !== undefined && DeltaResponseMessageKinds.includes(castObject.messageKind);
}
