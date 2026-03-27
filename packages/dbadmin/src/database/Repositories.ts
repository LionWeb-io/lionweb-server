import {
    getRepositoryParameter,
    getStringParam, initializeGlobalMetaPointersMap,
    isParameterError,
    ParameterError,
    REPOSITORIES_TABLE,
    RepositoryData,
    RepositoryInfo,
    requestLogger
} from "@lionweb/server-common"
import { GenericIssue, ValidationResult } from "@lionweb/validation"
import { LionWebJsonChunk } from "@lionweb/json"
import { JsonContext } from "@lionweb/json-utils"
import { Request } from "express"
import { DbAdminApiContext } from "../main.js"

export async function getRepositoryData(request: Request, defaultClient?: string): Promise<RepositoryData | ParameterError> {
    const clientId = getStringParam(request, "clientId", defaultClient)
    if (isParameterError(clientId)) {
        return clientId
    } else {
        const repoName = getRepositoryParameter(request)
        const repo: RepositoryInfo = await repositoryStore.getRepository(repoName)
        // requestLogger.info(`getRepository(...): FOUND REPO '${JSON.stringify(repo)}' for reponame ${repoName}`)
        if (repo === undefined) {
            return {
                success: false,
                error: {
                    kind: `RepositoryUnknown-ParameterIncorrect`,
                    message: `Repository ${repoName} not found`
                }
            }
        }
        return {
            clientId: clientId,
            repository: repo
        }
    }
}

/**
 * In memory representation of all repository administration info
 */
export class RepositoryStore {
    /**
     * Map from repository name to RepositoryInfo
     */
    repositoryName2repository: Map<string, RepositoryInfo> = new Map<string, RepositoryInfo>()
    initialized: boolean = false
    ctx: DbAdminApiContext
    i: number = 1

    constructor() {}

    setContext(ctx: DbAdminApiContext) {
        this.ctx = ctx
    }

    async refresh(): Promise<void> {
        requestLogger.trace("RepositoryStore REFRESH")
        this.initialized = false
        await this.initialize()
    }

    async initialize() {
        requestLogger.trace("RepositoryStore initialize " + this.i++)
        if (this.initialized) {
            // requestLogger.info("ALREADY initialized")
            return
        }
        // requestLogger.info("initializing")
        this.repositoryName2repository.clear()
        const repoTable = (await this.ctx.dbConnection.queryWithoutRepository(`SELECT * FROM ${REPOSITORIES_TABLE};\n`)) as RepositoryInfo[]
        for(const repo of repoTable) {
            this.repositoryName2repository.set(repo.repository_name, repo)
            // requestLogger.info("Repo row: " + JSON.stringify(repo))
            await initializeGlobalMetaPointersMap(this.ctx.dbConnection, { repository: repo, clientId: "SERVER" })
        }
        this.initialized = true
    }

    allRepositories(): RepositoryInfo[] {
        return Array.from(this.repositoryName2repository.values())
    }

    async getRepository(repoName: string): Promise<RepositoryInfo> {
        if (!this.initialized) {
            await this.initialize()
        }
        const result = this.repositoryName2repository.get(repoName)
        requestLogger.trace(`getRepository(${repoName}) => ${JSON.stringify(result)}`)
        return result
    }

    async toString(): Promise<string> {
        await this.initialize()
        let result = ""
        for (const entry of this.repositoryName2repository.entries()) {
            result += `repo ${entry[0]}: ${JSON.stringify(entry[1])}\n`
        }
        return result
    }
}

/**
 * Validate whether the LionWeb versions in `chunk` and `repositoryData` are the same.
 * @param chunk
 * @param repositoryData
 * @param validationResult
 */
export function validateLionWebVersion(chunk: LionWebJsonChunk, repositoryData: RepositoryData, validationResult: ValidationResult): void {
    if (chunk?.serializationFormatVersion !== repositoryData.repository.lionweb_version) {
        requestLogger.info(
            `SeralizationVersion ${chunk.serializationFormatVersion} is incorrect for repository ${repositoryData.repository.repository_name} with LionWeb version ${repositoryData.repository.lionweb_version}.`
        )
    const ctx: JsonContext = new JsonContext(null, ["$"])

        validationResult.issues.push(
            new GenericIssue(
                ctx,
                `SeralizationVersion ${chunk.serializationFormatVersion} is incorrect for repository ${repositoryData.repository.repository_name} with LionWeb version ${repositoryData.repository.lionweb_version}.`
            )
        )
    }
}

export const repositoryStore = new RepositoryStore()
