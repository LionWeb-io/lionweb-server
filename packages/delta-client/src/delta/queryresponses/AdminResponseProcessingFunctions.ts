import type { Custom_CreateRepositoryAdminResponse, Custom_DeleteRepositoryAdminResponse, Custom_ListRepositoriesAdminResponse } from "@lionweb/server-delta-shared"
import { type ReceivingDelta } from "@lionweb/server-delta-client"

const ListRepositoriesFunction = (msg: Custom_ListRepositoriesAdminResponse): void => {
    console.log("Called ListRepositories " + msg.messageKind)
}

const CreateRepositoryAdminResponseFunction = (msg: Custom_CreateRepositoryAdminResponse): void => {
    console.log("Called CreateRepositoryAdminResponseFunction " + msg.messageKind)
}

const DeleteRepositoryAdminResponseFunction = (msg: Custom_DeleteRepositoryAdminResponse): void => {
    console.log("Called DeleteRepositoryAdminResponse " + msg.messageKind)
}

export const adminResponseFunctions: ReceivingDelta[] = [
    {
        messageKind: "Custom_ListRepositoriesAdminResponse",
        // @ts-expect-error TS2322
        processor: ListRepositoriesFunction
    },
    {
        messageKind: "Custom_CreateRepositoryAdminResponse",
        // @ts-expect-error TS2322
        processor: CreateRepositoryAdminResponseFunction
    },
    {
        messageKind: "Custom_DeleteRepositoryAdminResponse",
        // @ts-expect-error TS2322
        processor: DeleteRepositoryAdminResponseFunction
    }
]
