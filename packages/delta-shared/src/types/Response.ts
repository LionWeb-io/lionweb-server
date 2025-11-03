import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { QueryId } from "./DeltaTypes.js";
import { LionWebDeltaJsonChunk } from "./DeltaTypes.js";
import { ParticipationId } from "./DeltaTypes.js";
import { SequenceNumber } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToChangingPartitionsResponse
 */
export type SubscribeToChangingPartitionsResponse = {
    messageKind: "SubscribeToChangingPartitionsResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToPartitionContentsResponse
 */
export type SubscribeToPartitionContentsResponse = {
    contents: LionWebDeltaJsonChunk;
    messageKind: "SubscribeToPartitionContentsResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-UnsubscribeFromPartitionContentsResponse
 */
export type UnsubscribeFromPartitionContentsResponse = {
    messageKind: "UnsubscribeFromPartitionContentsResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOnResponse
 */
export type SignOnResponse = {
    participationId: ParticipationId;
    messageKind: "SignOnResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOffResponse
 */
export type SignOffResponse = {
    messageKind: "SignOffResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-ReconnectResponse
 */
export type ReconnectResponse = {
    lastSentSequenceNumber: SequenceNumber;
    messageKind: "ReconnectResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-GetAvailableIdsResponse
 */
export type GetAvailableIdsResponse = {
    ids: LionWebId[];
    messageKind: "GetAvailableIdsResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-ListPartitionsResponse
 */
export type ListPartitionsResponse = {
    partitions: LionWebDeltaJsonChunk;
    messageKind: "ListPartitionsResponse";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

// The overall "super-type"
export type DeltaResponse =
    | SubscribeToChangingPartitionsResponse
    | SubscribeToPartitionContentsResponse
    | UnsubscribeFromPartitionContentsResponse
    | SignOnResponse
    | SignOffResponse
    | ReconnectResponse
    | GetAvailableIdsResponse
    | ListPartitionsResponse;
