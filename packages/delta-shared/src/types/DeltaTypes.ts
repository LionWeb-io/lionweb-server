export type String = string;
export type SequenceNumber = number;
export type CommandId = string;
export type ParticipationId = string;
export type Number = number;
export type QueryId = string;
export type Boolean = boolean;
export type ClientId = string;

export type ProtocolMessage = {
    kind: String;
    message: String;
    data: KeyValuePair[];
};

export type KeyValuePair = {
    key: String;
    value: String;
};

export type CommandSource = {
    participationId: ParticipationId;
    commandId: CommandId;
};

export type LionWebDeltaJsonChunk = {};
