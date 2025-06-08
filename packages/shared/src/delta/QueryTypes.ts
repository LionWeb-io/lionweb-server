import { LionWebId, LionWebJsonNode } from "@lionweb/json"
import { JS_string, ProtocolMessage } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToChangingPartitionsRequest
 */
export type SubscribeToChangingPartitionsRequest = {
    creation: primitiveBoolean;
    deletion: primitiveBoolean;
    partitions: primitiveBoolean;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToPartitionContentsRequest
 */
export type SubscribeToPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-UnsubscribeFromPartitionContentsRequest
 */
export type UnsubscribeFromPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOnRequest
 */
export type SignOnRequest = {
    deltaProtocolVersion: JS_string;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOffRequest
 */
export type SignOffRequest = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ListPartitionsRequest
 */
export type ListPartitionsRequest = {
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-GetAvailableIdsRequest
 */
export type GetAvailableIdsRequest = {
    count: primitiveNumber;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ReconnectRequest
 */
export type ReconnectRequest = {
    lastReceivedSequenceNumber: JS_string;
    participationId: JS_string;
    messageKind: QueryKind;
    queryId: JS_string;
    protocolMessage?: ProtocolMessage;
};

export type QueryKind = string;

export type primitiveBoolean = boolean;

export type primitiveNumber = number;
