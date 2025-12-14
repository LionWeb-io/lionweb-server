import { String } from "./DeltaTypes.js";
import { ProtocolMessage } from "./DeltaTypes.js";
import { QueryId } from "./DeltaTypes.js";
import { Boolean } from "./DeltaTypes.js";
import { LionWebId } from "./Chunks.js";
import { ClientId } from "./DeltaTypes.js";
import { ParticipationId } from "./DeltaTypes.js";
import { SequenceNumber } from "./DeltaTypes.js";
import { Number } from "./DeltaTypes.js";

// The overall "super-type"
export type DeltaRequest = {
    messageKind: RequestMessageKind;
    protocolMessages: ProtocolMessage[];
    queryId: QueryId;
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToChangingPartitions
 */
export type SubscribeToChangingPartitionsRequest = DeltaRequest & {
    creation: Boolean;
    deletion: Boolean;
    partitions: Boolean;
    messageKind: "SubscribeToChangingPartitions";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SubscribeToPartitionContents
 */
export type SubscribeToPartitionContentsRequest = DeltaRequest & {
    partition: LionWebId;
    messageKind: "SubscribeToPartitionContents";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-UnsubscribeFromPartitionContents
 */
export type UnsubscribeFromPartitionContentsRequest = DeltaRequest & {
    partition: LionWebId;
    messageKind: "UnsubscribeFromPartitionContents";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOn
 */
export type SignOnRequest = DeltaRequest & {
    deltaProtocolVersion: String;
    clientId: ClientId;
    repositoryId: String;
    messageKind: "SignOn";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-SignOff
 */
export type SignOffRequest = DeltaRequest & {
    messageKind: "SignOff";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-Reconnect
 */
export type ReconnectRequest = DeltaRequest & {
    participationId: ParticipationId;
    lastReceivedSequenceNumber: SequenceNumber;
    messageKind: "Reconnect";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-GetAvailableIds
 */
export type GetAvailableIdsRequest = DeltaRequest & {
    count: Number;
    messageKind: "GetAvailableIds";
};

/**
 *  @see https://lionWeb.io/specification/delta/delta-api.html#qry-ListPartitions
 */
export type ListPartitionsRequest = DeltaRequest & {
    messageKind: "ListPartitions";
};

// The type for the tagged union property
export type RequestMessageKind =
    | "SubscribeToChangingPartitions"
    | "SubscribeToPartitionContents"
    | "UnsubscribeFromPartitionContents"
    | "SignOn"
    | "SignOff"
    | "Reconnect"
    | "GetAvailableIds"
    | "ListPartitions";

// Type Guard function
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
