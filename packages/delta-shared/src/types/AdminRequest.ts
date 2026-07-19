import type { QueryId } from "./DeltaTypes.js";
import type { String } from "./DeltaTypes.js";
import type { AdditionalInfo } from "./DeltaTypes.js";
import type { Boolean } from "./DeltaTypes.js";

export const DeltaAdminRequestMessageKinds = [
    "Custom_ListRepositoriesAdminRequest",
    "Custom_CreateRepositoryAdminRequest",
    "Custom_DeleteRepositoryAdminRequest",
    "Custom_RenameRepositoryAdminRequest",
] as const;

// The type for the tagged union property, derived from the above array
export type AdminRequestMessageKind = (typeof DeltaAdminRequestMessageKinds)[number];

// The overall "super-type"
export type DeltaAdminRequest = {
    queryId: QueryId;
    messageKind: AdminRequestMessageKind;
    additionalInfos: AdditionalInfo[];
};

/**
 *  @see unknown-Custom_ListRepositories
 */
export type Custom_ListRepositoriesAdminRequest = DeltaAdminRequest & {
    messageKind: "Custom_ListRepositoriesAdminRequest";
};

/**
 *  @see unknown-Custom_CreateRepository
 */
export type Custom_CreateRepositoryAdminRequest = DeltaAdminRequest & {
    repositoryName: String;
    lionWebVersion: String;
    history: Boolean;
    messageKind: "Custom_CreateRepositoryAdminRequest";
};

/**
 *  @see unknown-Custom_DeleteRepository
 */
export type Custom_DeleteRepositoryAdminRequest = DeltaAdminRequest & {
    repositoryName: String;
    messageKind: "Custom_DeleteRepositoryAdminRequest";
};

/**
 *  @see unknown-Custom_RenameRepository
 */
export type Custom_RenameRepositoryAdminRequest = DeltaAdminRequest & {
    repositoryName: String;
    messageKind: "Custom_RenameRepositoryAdminRequest";
};

// Type Guard function
export function isDeltaAdminRequest(object: unknown): object is DeltaAdminRequest {
    const castObject = object as DeltaAdminRequest;
    return castObject.messageKind !== undefined && DeltaAdminRequestMessageKinds.includes(castObject.messageKind);
}
