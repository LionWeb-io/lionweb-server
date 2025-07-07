import { LionWebId, LionWebJsonNode } from "@lionweb/json"
import { ParticipationId } from "./EventTypes.js"
import { JS_number, JS_string, LionWebJsonDeltaChunk, ProtocolMessage } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToChangingPartitionsRequest
 */
export type SubscribeToChangingPartitionsRequest = {
    creation: primitiveBoolean;
    deletion: primitiveBoolean;
    partitions: primitiveBoolean;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToChangingPartitionsResponse
 */
export type SubscribeToChangingPartitionsResponse = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToPartitionContentsRequest
 */
export type SubscribeToPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToPartitionContentsResponse
 */
export type SubscribeToPartitionContentsResponse = {
    contents: LionWebJsonDeltaChunk;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-UnsubscribeFromPartitionContentsRequest
 */
export type UnsubscribeFromPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-UnsubscribeFromPartitionContentsResponse
 */
export type UnsubscribeFromPartitionContentsResponse = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOnRequest
 */
export type SignOnRequest = {
    deltaProtocolVersion: JS_string;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOnResponse
 */
export type SignOnResponse = {
    participationId: ParticipationId;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOffRequest
 */
export type SignOffRequest = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOffResponse
 */
export type SignOffResponse = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ListPartitionsRequest
 */
export type ListPartitionsRequest = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ListPartitionsResponse
 */
export type ListPartitionsResponse = {
    partitions: LionWebJsonDeltaChunk;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-GetAvailableIdsRequest
 */
export type GetAvailableIdsRequest = {
    count: primitiveNumber;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-GetAvailableIdsResponse
 */
export type GetAvailableIdsResponse = {
    ids: LionWebId[];
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ReconnectRequest
 */
export type ReconnectRequest = {
    participationId: JS_string;
    lastReceivedSequenceNumber: JS_number;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ReconnectResponse
 */
export type ReconnectResponse = {
    lastSentSequenceNumber: JS_number;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

export type QueryKind = string;

export type primitiveBoolean = boolean;

export type primitiveNumber = number;
