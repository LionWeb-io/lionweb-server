import { LionWebJsonNode } from "@lionweb/json";

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-LionWebJsonDeltaChunk
 */
export type LionWebJsonDeltaChunk = {
    nodes: LionWebJsonNode[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-ProtocolMessage
 */
export type ProtocolMessage = {
    kind: string;
    message: string;
    data: KeyValuePair[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-KeyValuePair
 */
export type KeyValuePair = {
    key: string;
    value: string;
};

export type numberString = string;
