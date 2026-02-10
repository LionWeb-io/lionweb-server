import { QueryId } from "./DeltaTypes.js";
import { String } from "./DeltaTypes.js";
import { AdditionalInfo } from "./DeltaTypes.js";

// The overall "super-type"
export type DeltaAdminRequest = {
    queryId: QueryId;
    messageKind: AdminRequestMessageKind;
    additionalInfo: AdditionalInfo[];
};

/**
 *  @see unknown-ListRepositories
 */
export type ListRepositoriesAdminRequest = DeltaAdminRequest & {
    messageKind: "ListRepositoriesAdminRequest";
};

/**
 *  @see unknown-CreateRepository
 */
export type CreateRepositoryAdminRequest = DeltaAdminRequest & {
    repositoryName: String;
    messageKind: "CreateRepositoryAdminRequest";
};

/**
 *  @see unknown-DeleteRepository
 */
export type DeleteRepositoryAdminRequest = DeltaAdminRequest & {
    repositoryName: String;
    messageKind: "DeleteRepositoryAdminRequest";
};

// The type for the tagged union property
export type AdminRequestMessageKind = "ListRepositoriesAdminRequest" | "CreateRepositoryAdminRequest" | "DeleteRepositoryAdminRequest";

// Type Guard function
export function isDeltaAdminRequest(object: unknown): object is DeltaAdminRequest {
    const castObject = object as DeltaAdminRequest;
    return (
        castObject.messageKind !== undefined &&
        ["ListRepositoriesAdminRequest", "CreateRepositoryAdminRequest", "DeleteRepositoryAdminRequest"].includes(castObject.messageKind)
    );
}
