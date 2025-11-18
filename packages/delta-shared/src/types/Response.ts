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
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToChangingPartitionsResponse
 */
export type SubscribeToChangingPartitionsResponse = DeltaResponse & {
    messageKind: "SubscribeToChangingPartitionsResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToPartitionContentsResponse
 */
export type SubscribeToPartitionContentsResponse = DeltaResponse & {
    contents: LionWebDeltaJsonChunk;
    messageKind: "SubscribeToPartitionContentsResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-UnsubscribeFromPartitionContentsResponse
 */
export type UnsubscribeFromPartitionContentsResponse = DeltaResponse & {
    messageKind: "UnsubscribeFromPartitionContentsResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOnResponse
 */
export type SignOnResponse = DeltaResponse & {
    participationId: ParticipationId;
    messageKind: "SignOnResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOffResponse
 */
export type SignOffResponse = DeltaResponse & {
    messageKind: "SignOffResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-ReconnectResponse
 */
export type ReconnectResponse = DeltaResponse & {
    lastSentSequenceNumber: SequenceNumber;
    messageKind: "ReconnectResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-GetAvailableIdsResponse
 */
export type GetAvailableIdsResponse = DeltaResponse & {
    ids: LionWebId[];
    messageKind: "GetAvailableIdsResponse";
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-ListPartitionsResponse
 */
export type ListPartitionsResponse = DeltaResponse & {
    partitions: LionWebDeltaJsonChunk;
    messageKind: "ListPartitionsResponse";
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
    | "ListPartitionsResponse";

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
        ].includes(castObject.messageKind)
    );
}
