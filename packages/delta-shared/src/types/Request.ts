import { Boolean } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { QueryId } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";
import { ClientId } from "./DeltaTypes.js";
import { ParticipationId } from "./DeltaTypes.js";
import { SequenceNumber } from "./DeltaTypes.js";
import { Number } from "./DeltaTypes.js";

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToChangingPartitions
 */
export type SubscribeToChangingPartitionsRequest = {
    creation: Boolean;
    deletion: Boolean;
    partitions: Boolean;
    messageKind: "SubscribeToChangingPartitions";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SubscribeToPartitionContents
 */
export type SubscribeToPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: "SubscribeToPartitionContents";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-UnsubscribeFromPartitionContents
 */
export type UnsubscribeFromPartitionContentsRequest = {
    partition: LionWebId;
    messageKind: "UnsubscribeFromPartitionContents";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOn
 */
export type SignOnRequest = {
    deltaProtocolVersion: String;
    clientId: ClientId;
    repositoryId: String;
    messageKind: "SignOn";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-SignOff
 */
export type SignOffRequest = {
    messageKind: "SignOff";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-Reconnect
 */
export type ReconnectRequest = {
    participationId: ParticipationId;
    lastReceivedSequenceNumber: SequenceNumber;
    messageKind: "Reconnect";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-GetAvailableIds
 */
export type GetAvailableIdsRequest = {
    count: Number;
    messageKind: "GetAvailableIds";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/main/delta/queries.adoc#qry-ListPartitions
 */
export type ListPartitionsRequest = {
    messageKind: "ListPartitions";
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

// The overall "super-type"
export type DeltaRequest =
    | SubscribeToChangingPartitionsRequest
    | SubscribeToPartitionContentsRequest
    | UnsubscribeFromPartitionContentsRequest
    | SignOnRequest
    | SignOffRequest
    | ReconnectRequest
    | GetAvailableIdsRequest
    | ListPartitionsRequest;

export function isDeltaRequest(object: unknown): object is DeltaRequest {
    const castObject = object as DeltaRequest;
    return (
        castObject.messageKind !== undefined &&
        [
            "SubscribeToChangingPartitions",
            "SubscribeToPartitionContents",
            "UnsubscribeFromPartitionContents",
            "SignOn",
            "SignOff",
            "Reconnect",
            "GetAvailableIds",
            "ListPartitions",
        ].includes(castObject.messageKind)
    );
}
