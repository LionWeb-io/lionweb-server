import { LionWebId, LionWebJsonNode } from "@lionweb/json"
import { ProtocolMessage } from "./SharedTypes.js"

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToChangingPartitions
 */
export type SubscribeToChangingPartitions = {
    creation: boolean;
    deletion: boolean;
    partitions: boolean;
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SubscribeToPartitionContents
 */
export type SubscribeToPartitionContents = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-UnsubscribeFromPartitionContents
 */
export type UnsubscribeFromPartitionContents = {
    partition: LionWebId;
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOnRequest
 */
export type SignOnRequest = {
    deltaProtocolVersion: string;
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-SignOff
 */
export type SignOff = {
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-Reconnect
 */
export type Reconnect = {
    lastReceivedSequenceNumber: string;
    messageKind: QueryKind;
    queryId: string;
    protocolMessage?: ProtocolMessage;
};

export type QueryKind = string;
