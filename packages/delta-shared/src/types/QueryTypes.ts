import { LionWebId, LionWebJsonNode } from "@lionweb/json"
import { ParticipationId } from "./EventTypes.js"
import { JS_number, JS_string, LionWebJsonDeltaChunk, ProtocolMessage } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SubscribeToChangingPartitionsRequest
 */
export type SubscribeToChangingPartitionsRequest = {
    creation: primitiveBoolean;
    deletion: primitiveBoolean;
    partitions: primitiveBoolean;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SubscribeToChangingPartitionsResponse
 */
export type SubscribeToChangingPartitionsResponse = {
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SubscribeToPartitionContentsRequest
 */
export type SubscribeToPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SubscribeToPartitionContentsResponse
 */
export type SubscribeToPartitionContentsResponse = {
    contents: LionWebJsonDeltaChunk;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-UnsubscribeFromPartitionContentsRequest
 */
export type UnsubscribeFromPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-UnsubscribeFromPartitionContentsResponse
 */
export type UnsubscribeFromPartitionContentsResponse = {
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SignOnRequest
 */
export type SignOnRequest = {
    deltaProtocolVersion: JS_string;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SignOnResponse
 */
export type SignOnResponse = {
    participationId: ParticipationId;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SignOffRequest
 */
export type SignOffRequest = {
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-SignOffResponse
 */
export type SignOffResponse = {
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-ListPartitionsRequest
 */
export type ListPartitionsRequest = {
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-ListPartitionsResponse
 */
export type ListPartitionsQueryResponse = {
    partitions: LionWebJsonDeltaChunk;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-GetAvailableIdsRequest
 */
export type GetAvailableIdsRequest = {
    count: primitiveNumber;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-GetAvailableIdsResponse
 */
export type GetAvailableIdsResponse = {
    ids: LionWebId[];
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-ReconnectRequest
 */
export type ReconnectRequest = {
    participationId: JS_string;
    lastReceivedSequenceNumber: JS_number;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#-ReconnectResponse
 */
export type ReconnectResponse = {
    lastSentSequenceNumber: JS_number;
    messageKind: QueryType;
    queryId: JS_string;
    protocolMessages?: ProtocolMessage[];
};

export type QueryRequestType = 
    ReconnectRequest
    | ListPartitionsRequest
    | ReconnectRequest
    | GetAvailableIdsRequest
    | SignOffRequest
    | SignOnRequest
    | UnsubscribeFromPartitionContentsRequest
    | SubscribeToPartitionContentsRequest
    | SubscribeToChangingPartitionsRequest

export type QueryType = string;

export type primitiveBoolean = boolean;

export type primitiveNumber = number;
