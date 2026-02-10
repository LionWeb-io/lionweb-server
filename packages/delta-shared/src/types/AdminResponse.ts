import { QueryId } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { AdditionalInfo } from "./DeltaTypes.js";
import { RepositoryInfo } from "./AdminTypes.js";

// The overall "super-type"
export type DeltaAdminResponse = {
    queryId: QueryId;
    messageKind: AdminResponseMessageKind;
    additionalInfo: AdditionalInfo[];
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
    messageKind: "CreateRepositoryAdminResponse";
};

/**
 *  @see unknown-DeleteRepository
 */
export type DeleteRepositoryAdminResponse = DeltaAdminResponse & {
    messageKind: "DeleteRepositoryAdminResponse";
};

// The type for the tagged union property
export type AdminResponseMessageKind = "ListRepositoriesAdminResponse" | "CreateRepositoryAdminResponse" | "DeleteRepositoryAdminResponse";

// Type Guard function
export function isDeltaAdminResponse(object: unknown): object is DeltaAdminResponse {
    const castObject = object as DeltaAdminResponse;
    return (
        castObject.messageKind !== undefined &&
        ["ListRepositoriesAdminResponse", "CreateRepositoryAdminResponse", "DeleteRepositoryAdminResponse"].includes(castObject.messageKind)
    );
}
