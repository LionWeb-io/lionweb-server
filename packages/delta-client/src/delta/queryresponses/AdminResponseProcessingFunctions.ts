import type { CreateRepositoryAdminResponse, DeleteRepositoryAdminResponse, ListRepositoriesAdminResponse } from "@lionweb/server-delta-shared"
import { type ReceivingDelta } from "@lionweb/server-delta-client"

const ListRepositoriesFunction = (msg: ListRepositoriesAdminResponse): void => {
    console.log("Called ListRepositories " + msg.messageKind)
}

const CreateRepositoryAdminResponseFunction = (msg: CreateRepositoryAdminResponse): void => {
    console.log("Called CreateRepositoryAdminResponseFunction " + msg.messageKind)
}

const DeleteRepositoryAdminResponseFunction = (msg: DeleteRepositoryAdminResponse): void => {
    console.log("Called DeleteRepositoryAdminResponse " + msg.messageKind)
}

export const adminResponseFunctions: ReceivingDelta[] = [
    {
        messageKind: "ListRepositoriesAdminResponse",
        // @ts-expect-error TS2322
        processor: ListRepositoriesFunction
    },
    {
        messageKind: "CreateRepositoryAdminResponse",
        // @ts-expect-error TS2322
        processor: CreateRepositoryAdminResponseFunction
    },
    {
        messageKind: "DeleteRepositoryAdminResponse",
        // @ts-expect-error TS2322
        processor: DeleteRepositoryAdminResponseFunction
    }
]
