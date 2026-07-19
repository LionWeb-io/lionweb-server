import type { QueryId } from "./DeltaTypes.js";
import type { String } from "./DeltaTypes.js";
import type { AdditionalInfo } from "./DeltaTypes.js";
import type { RepositoryInfo } from "./AdminTypes.js";

export const DeltaAdminResponseMessageKinds = [
    "Custom_ListRepositoriesAdminResponse",
    "Custom_CreateRepositoryAdminResponse",
    "Custom_DeleteRepositoryAdminResponse",
    "Custom_RenameRepositoryAdminResponse",
] as const;

// The type for the tagged union property, derived from the above array
export type AdminResponseMessageKind = (typeof DeltaAdminResponseMessageKinds)[number];

// The overall "super-type"
export type DeltaAdminResponse = {
    queryId: QueryId;
    messageKind: AdminResponseMessageKind;
    additionalInfos: AdditionalInfo[];
};

/**
 *  @see unknown-Custom_ListRepositories
 */
export type Custom_ListRepositoriesAdminResponse = DeltaAdminResponse & {
    repositories: RepositoryInfo[];
    messageKind: "Custom_ListRepositoriesAdminResponse";
};

/**
 *  @see unknown-Custom_CreateRepository
 */
export type Custom_CreateRepositoryAdminResponse = DeltaAdminResponse & {
    newRepositoryName: String;
    messageKind: "Custom_CreateRepositoryAdminResponse";
};

/**
 *  @see unknown-Custom_DeleteRepository
 */
export type Custom_DeleteRepositoryAdminResponse = DeltaAdminResponse & {
    deletedRepositoryName: String;
    messageKind: "Custom_DeleteRepositoryAdminResponse";
};

/**
 *  @see unknown-Custom_RenameRepository
 */
export type Custom_RenameRepositoryAdminResponse = DeltaAdminResponse & {
    oldRepositoryName: String;
    newRepositoryName: String;
    messageKind: "Custom_RenameRepositoryAdminResponse";
};

// Type Guard function
export function isDeltaAdminResponse(object: unknown): object is DeltaAdminResponse {
    const castObject = object as DeltaAdminResponse;
    return castObject.messageKind !== undefined && DeltaAdminResponseMessageKinds.includes(castObject.messageKind);
}
