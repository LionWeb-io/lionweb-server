import {
    deltaLogger,
} from "@lionweb/server-common"
import { repositoryStore } from "@lionweb/server-dbadmin"
import {
    CreateRepositoryAdminRequest,
    CreateRepositoryAdminResponse,
    DeleteRepositoryAdminRequest,
    DeleteRepositoryAdminResponse,
    DeltaAdminResponse,
    ErrorEvent,
    ListRepositoriesAdminRequest,
    ListRepositoriesAdminResponse
} from "@lionweb/server-delta-shared"
import { DeltaFunction } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { ParticipationInfo } from "../queries/index.js"

const ListRepositories = async (participation: ParticipationInfo, msg: ListRepositoriesAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called ListRepositories request id: " + msg.queryId)
    await repositoryStore.refresh()

    const repositories = Array.from(repositoryStore.repositoryName2repository.values()).map(repo => ({
        name: repo.repository_name,
        lionweb_version: repo.lionweb_version,
        history: repo.history
    }))

    return {
        messageKind: "ListRepositoriesAdminResponse",
        queryId: msg.queryId,
        repositories: repositories,
        additionalInfo: []
    } as ListRepositoriesAdminResponse
}

const CreateRepository = async (participation: ParticipationInfo, msg: CreateRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called CreateRepository request id: " + msg.queryId)
    return {
        messageKind: "CreateRepositoryAdminResponse",
        queryId: msg.queryId,
        additionalInfo: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: []
        }]
    } as CreateRepositoryAdminResponse
}

const DeleteRepository = async (participation: ParticipationInfo, msg: DeleteRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called DeleteRepository request id: " + msg.queryId)
    return {
        messageKind: "DeleteRepositoryAdminResponse",
        queryId: msg.queryId,
        additionalInfo: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: []
        }]
    } as DeleteRepositoryAdminResponse
}

export const adminRequestFunctions: DeltaFunction[] = [
    {
        messageKind: "ListRepositoriesAdminRequest",
        // @ts-expect-error TS2332
        processor: ListRepositories
    },
    {
        messageKind: "CreateRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: CreateRepository
    },
    {
        messageKind: "DeleteRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: DeleteRepository
    }
]
