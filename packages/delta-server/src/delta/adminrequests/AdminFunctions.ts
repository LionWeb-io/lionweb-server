import { LionWebTask } from "@lionweb/server-database"
import {
    deltaLogger,
} from "@lionweb/server-logging"
import { repositoryStore } from "@lionweb/server-dbadmin"
import {
    Custom_CreateRepositoryAdminRequest,
    Custom_CreateRepositoryAdminResponse,
    Custom_DeleteRepositoryAdminRequest,
    Custom_DeleteRepositoryAdminResponse,
    DeltaAdminResponse,
    ErrorEvent,
    Custom_ListRepositoriesAdminRequest,
    Custom_ListRepositoriesAdminResponse,
    Custom_RenameRepositoryAdminResponse
} from "@lionweb/server-delta-shared"
import { DeltaFunction } from "../commands/index.js"
import { DeltaContext } from "../DeltaContext.js"
import { Participation } from "../participation/index.js"

const ListRepositories = async (participation: Participation, msg: Custom_ListRepositoriesAdminRequest, ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
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
        messageKind: "Custom_ListRepositoriesAdminResponse",
        queryId: msg.queryId,
        repositories: repositories,
        additionalInfos: []
    } as Custom_ListRepositoriesAdminResponse
}

const CreateRepository = async (participation: Participation, msg: Custom_CreateRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called CreateRepository request id: " + msg.queryId)
    return {
        messageKind: "Custom_CreateRepositoryAdminResponse",
        queryId: msg.queryId,
        newRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as Custom_CreateRepositoryAdminResponse
}

const DeleteRepository = async (participation: Participation, msg: Custom_DeleteRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called DeleteRepository request id: " + msg.queryId)
    return {
        messageKind: "Custom_DeleteRepositoryAdminResponse",
        queryId: msg.queryId,
        deletedRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as Custom_DeleteRepositoryAdminResponse
}

const RenameRepository = async (participation: Participation, msg: Custom_DeleteRepositoryAdminRequest, _ctx: DeltaContext): Promise<DeltaAdminResponse | ErrorEvent> => {
    deltaLogger.info("Called RenameRepository request id: " + msg.queryId)
    return {
        messageKind: "Custom_RenameRepositoryAdminResponse",
        queryId: msg.queryId,
        oldRepositoryName: msg.repositoryName,
        newRepositoryName: msg.repositoryName,
        additionalInfos: [ {
            kind: "Info",
            message: "NOT IMPLEMENTED YET",
            data: {}
        }]
    } as Custom_RenameRepositoryAdminResponse
}

export const adminRequestFunctions: DeltaFunction[] = [
    {
        messageKind: "Custom_ListRepositoriesAdminRequest",
        // @ts-expect-error TS2332
        processor: ListRepositories
    },
    {
        messageKind: "Custom_CreateRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: CreateRepository
    },
    {
        messageKind: "Custom_DeleteRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: DeleteRepository
    },
    {
        messageKind: "Custom_RenameRepositoryAdminRequest",
        // @ts-expect-error TS2332
        processor: RenameRepository
    }
]
