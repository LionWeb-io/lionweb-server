import type { QueryId } from "./DeltaTypes.js";
import type { String } from "./DeltaTypes.js";
import type { AdditionalInfo } from "./DeltaTypes.js";

export const DeltaMonitorMessageKinds = ["Custom_MonitorStart", "Custom_MonitorEnd"] as const;

// The type for the tagged union property, derived from the above array
export type MonitorMessageKind = (typeof DeltaMonitorMessageKinds)[number];

// The overall "super-type"
export type DeltaMonitor = {
    queryId: QueryId;
    messageKind: MonitorMessageKind;
    additionalInfos: AdditionalInfo[];
};

/**
 *  @see unknown-Custom_MonitorStart
 */
export type Custom_MonitorStartMonitor = DeltaMonitor & {
    repositoryName: String;
    messageKind: "Custom_MonitorStart";
};

/**
 *  @see unknown-Custom_MonitorEnd
 */
export type Custom_MonitorEndMonitor = DeltaMonitor & {
    repositoryName: String;
    messageKind: "Custom_MonitorEnd";
};

// Type Guard function
export function isDeltaMonitor(object: unknown): object is DeltaMonitor {
    const castObject = object as DeltaMonitor;
    return castObject.messageKind !== undefined && DeltaMonitorMessageKinds.includes(castObject.messageKind);
}
