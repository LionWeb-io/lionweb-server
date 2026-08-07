// functions implementing the LionWeb bulk API
// - unpack the request
// - call controller to do actual work
// - pack response
import { getRepositoryData } from "@lionweb/server-dbadmin"
import { HttpClientErrors, ListPartitionsResponse, StoreResponse } from "@lionweb/server-shared"
import { lionwebResponse } from "@lionweb/server-common"
import { Request, Response } from "express"
import { HistoryContext } from "../main.js"
import { getIntegerParam, isParameterError, FOREVER } from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import { bulkLogger, dbLogger, requestLogger } from "@lionweb/server-logging"
export interface HistoryApi {
    listPartitions: (request: Request, response: Response) => void
    retrieve: (request: Request, response: Response) => void
}

export class HistoryApiImpl implements HistoryApi {
    constructor(private ctx: HistoryContext) {}
    /**
     * Bulk API: Get all partitions (nodes without parent) from the repo
     * @param request no `parameters` or `body`
     * @param response The list of all partition nodes, without children or annotations
     */
    listPartitions = async (request: Request, response: Response): Promise<void> => {
        bulkLogger.info(` * history listPartitions request received, with body of ${request.headers["content-length"]} bytes`)
        await this.ctx.dbConnection.tx(async (task: LionWebTask) => {
            const repositoryData = await getRepositoryData(task, request)
            requestLogger.debug(`    ** repository data {repositoryData} bytes`, {repositoryData})
            const repoVersion = getIntegerParam(request, "repoVersion", FOREVER)
            if (isParameterError(repositoryData)) {
                lionwebResponse<ListPartitionsResponse>(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    chunk: null,
                    messages: [repositoryData.error]
                })
            } else if (isParameterError(repoVersion)) {
                lionwebResponse<StoreResponse>(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [repoVersion.error]
                })
            } else {
                const result = await this.ctx.historyApiWorker.bulkPartitions(task, repositoryData, repoVersion)
                lionwebResponse<ListPartitionsResponse>(response, result.status, result.queryResult)
            }
        })
    }

    /**
     * Bulk API: Retrieve a set of nodes including its parts to a given level
     * @param request `body.ids` contains the list of nodes to be found.
     *            parameter `depthLimit` contains the depth to which the parts are also found.
     * @param response
     */
    retrieve = async (request: Request, response: Response): Promise<void> => {
        bulkLogger.info(` * retrieve request received, with body of ${request.headers["content-length"]} bytes`)
        await this.ctx.dbConnection.tx(async (task: LionWebTask) => {
            const repositoryData = await getRepositoryData(task, request)
            requestLogger.debug(`    ** repository data {repositoryData} bytes`, {repositoryData})
            const depthLimit = getIntegerParam(request, "depthLimit", Number.MAX_SAFE_INTEGER)
            const idList = request.body.ids
            const repoVersion = getIntegerParam(request, "repoVersion", FOREVER)
            dbLogger.debug(
                `Api.getNodes: {request.body} depth ${depthLimit} repo: {repositoryData}`, {request, repositoryData}
            )
            if (isParameterError(depthLimit)) {
                lionwebResponse(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [depthLimit.error]
                })
            } else if (isParameterError(repositoryData)) {
                lionwebResponse(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [repositoryData.error]
                })
            } else if (!Array.isArray(idList)) {
                lionwebResponse(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [{ kind: "IdsIncorrect", message: `parameter 'ids' is not an array` }]
                })
            } else if (isParameterError(repoVersion)) {
                lionwebResponse<StoreResponse>(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [repoVersion.error]
                })
            } else {
                const result = await this.ctx.historyApiWorker.bulkRetrieve(task, repositoryData, idList, depthLimit, repoVersion)
                lionwebResponse(response, result.status, result.queryResult)
            }
        })
    }
}
