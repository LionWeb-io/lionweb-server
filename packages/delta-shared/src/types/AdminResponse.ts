import type { QueryId } from "./DeltaTypes.js";
import type { String } from "./DeltaTypes.js";
import type { AdditionalInfo } from "./DeltaTypes.js";
import type { RepositoryInfo } from "./AdminTypes.js";

export const DeltaAdminResponseMessageKinds = [
    "ListRepositoriesAdminResponse",
    "CreateRepositoryAdminResponse",
    "DeleteRepositoryAdminResponse",
    "RenameRepositoryAdminResponse",
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
 *  @see unknown-ListRepositories
 */
export type ListRepositoriesAdminResponse = DeltaAdminResponse & {
    repositories: RepositoryInfo[];
    messageKind: "ListRepositoriesAdminResponse";
};

/**
 *  @see unknown-CreateRepository
 */
export type CreateRepositoryAdminResponse = DeltaAdminResponse & {
    newRepositoryName: String;
    messageKind: "CreateRepositoryAdminResponse";
};

/**
 *  @see unknown-DeleteRepository
 */
export type DeleteRepositoryAdminResponse = DeltaAdminResponse & {
    deletedRepositoryName: String;
    messageKind: "DeleteRepositoryAdminResponse";
};

/**
 *  @see unknown-RenameRepository
 */
export type RenameRepositoryAdminResponse = DeltaAdminResponse & {
    oldRepositoryName: String;
    newRepositoryName: String;
    messageKind: "RenameRepositoryAdminResponse";
};

// Type Guard function
export function isDeltaAdminResponse(object: unknown): object is DeltaAdminResponse {
    const castObject = object as DeltaAdminResponse;
    return castObject.messageKind !== undefined && DeltaAdminResponseMessageKinds.includes(castObject.messageKind);
}
