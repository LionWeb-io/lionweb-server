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
    kind: JS_string;
    message: JS_string;
    data: KeyValuePair[];
};

/**
 *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#-KeyValuePair
 */
export type KeyValuePair = {
    key: JS_string;
    value: JS_string;
};

export type numberString = string;

export type JS_string = string;
