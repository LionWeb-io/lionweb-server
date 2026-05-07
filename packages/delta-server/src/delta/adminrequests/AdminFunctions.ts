import { LionWebTask } from "@lionweb/server-database"
import {
    deltaLogger,
} from "@lionweb/server-shared"
import { repositoryStore } from "@lionweb/server-dbadmin"
import {
    CreateRepositoryAdminRequest,
    CreateRepositoryAdminResponse,
    DeleteRepositoryAdminRequest,
    DeleteRepositoryAdminResponse,
    DeltaAdminResponse,
    ErrorEvent,
    ListRepositoriesAdminRequest,
    ListRepositoriesAdminResponse,
    RenameRepositoryAdminResponse
} from "@lionweb/server-delta-shared"
import { DeltaFunction } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { Participation } from "../participation/index.js"

const ListRepositories = async (participation: Participation, msg: ListRepositoriesAdminRequest, ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called ListRepositories request id: " + msg.queryId)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        await repositoryStore.refresh(task)
    })

    const repositories = Array.from(repositoryStore.repositoryName2repository.values()).map(repo => ({
        name: repo.repository_name,
        lionweb_version: repo.lionweb_version,
        history: repo.history
    }))

    return {
        messageKind: "ListRepositoriesAdminResponse",
        queryId: msg.queryId,
        repositories: repositories,
        additionalInfos: []
    } as ListRepositoriesAdminResponse
}

const CreateRepository = async (participation: Participation, msg: CreateRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called CreateRepository request id: " + msg.queryId)
    return {
        messageKind: "CreateRepositoryAdminResponse",
        queryId: msg.queryId,
        newRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as CreateRepositoryAdminResponse
}

const DeleteRepository = async (participation: Participation, msg: DeleteRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called DeleteRepository request id: " + msg.queryId)
    return {
        messageKind: "DeleteRepositoryAdminResponse",
        queryId: msg.queryId,
        deletedRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as DeleteRepositoryAdminResponse
}

const RenameRepository = async (participation: Participation, msg: DeleteRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called RenameRepository request id: " + msg.queryId)
    return {
        messageKind: "RenameRepositoryAdminResponse",
        queryId: msg.queryId,
        oldRepositoryName: msg.repositoryName,
        newRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as RenameRepositoryAdminResponse
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
    },
    {
        messageKind: "RenameRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: RenameRepository
    }
]
