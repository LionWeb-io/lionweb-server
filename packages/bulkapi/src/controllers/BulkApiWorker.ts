import {
    DB_getAvailableIds,
    DB_retrieveFullNodesFromIdList,
    DB_retrievePartitionNodes,
    SQL_currentRepoVersion,
    SQL_retrieveFullNodesRecursive,
    versionResultToResponse,
    versiontToHttpResponseMessage
} from "@lionweb/server-common"
import {
    CreatePartitionsResponse,
    DeletePartitionsResponse,
    HttpClientErrors,
    HttpSuccessCodes,
    IdsResponse,
    ListPartitionsResponse,
    ResponseMessage,
    RetrieveResponse,
    StoreResponse
} from "@lionweb/server-shared"
import { traceLogger, requestLogger } from "@lionweb/server-logging" 
import { EMPTY_CHUNKS, nodesToChunk, QueryReturnType } from "@lionweb/server-common"
import { LionWebTask, RepositoryData} from "@lionweb/server-database"
import { LionWebJsonChunk } from "@lionweb/json"
import { BulkApiContext } from "../main.js"

/**
 * Implementations of the LionWebBulkApi methods.
 */
export class BulkApiWorker {
    private context: BulkApiContext

    constructor(context: BulkApiContext) {
        this.context = context
    }

    async bulkPartitions(task: LionWebTask, repositoryData: RepositoryData): Promise<QueryReturnType<ListPartitionsResponse>> {
        const result = await DB_retrievePartitionNodes(task, repositoryData)
        return {
            status: HttpSuccessCodes.Ok,
            query: "query",
            queryResult: {
                chunk: nodesToChunk(result.nodes, repositoryData.repository.lionweb_version),
                success: true,
                messages: [versiontToHttpResponseMessage(result.version)]
            }
        }
    }

    /**
     * @param chunk A LionWeb chunk containing all nodes that are to be created as partitions.
     */
    createPartitions = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        chunk: LionWebJsonChunk
    ): Promise<QueryReturnType<CreatePartitionsResponse>> => {
        requestLogger.info(`BulkApiWorker.createPartitions repo [{repositoryData}]`, {repositoryData})
        // TODO Optimize: This reuses the "getNodesFromIdList", but that retrieves full nodes, which is not needed here

        const existingNodes = await DB_retrieveFullNodesFromIdList(
            task,
            repositoryData,
            chunk.nodes.map(n => n.id)
        )
        if (existingNodes.length > 0) {
            return {
                status: HttpClientErrors.PreconditionFailed,
                query: "",
                queryResult: {
                    success: false,
                    messages: [
                        {
                            kind: "PartitionAlreadyExists",
                            message: `Nodes with ids "${existingNodes.map(
                                n => n.id
                            )}" cannot be created as partitions, because they already exist.`
                        }
                    ]
                }
            }
        }
        return await this.context.queries.createPartitions(task, repositoryData, chunk)
    }

    /**
     * Delete all partitions
     * @param idList The list of node id's of partition nodes that are to be removed.
     */
    deletePartitions = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        idList: string[]
    ): Promise<QueryReturnType<DeletePartitionsResponse>> => {
        // TODO Optimize: only need parent, all features are not needed, can be optimized.
        const partitions = await DB_retrieveFullNodesFromIdList(task, repositoryData, idList)
        const issues: ResponseMessage[] = []
        partitions.forEach(part => {
            if (part.parent !== null) {
                issues.push({
                    kind: "NodeIsNotPartition",
                    message: `Node with id "${part.id}" cannot be deleted because it is not a partition, it has parent with id "${part.parent}"`
                })
            }
        })
        if (issues.length !== 0) {
            return {
                status: HttpClientErrors.PreconditionFailed,
                query: "",
                queryResult: {
                    success: false,
                    messages: issues
                }
            }
        }
        return await this.context.queries.deletePartitions(task, repositoryData, idList)
    }

    bulkStore = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        chunk: LionWebJsonChunk
    ): Promise<QueryReturnType<StoreResponse>> => {
        return await this.context.queries.store(task, repositoryData, chunk)
    }

    /**
     * This implementation uses Postgres for querying
     * @param nodeIdList
     * @param depthLimit
     */
    bulkRetrieve = async (
        task: LionWebTask,
        repositoryData: RepositoryData,
        nodeIdList: string[],
        depthLimit: number
    ): Promise<QueryReturnType<RetrieveResponse>> => {
        traceLogger.info("BulkApiWorker.retrieve")
        if (nodeIdList.length === 0) {
            return {
                status: HttpSuccessCodes.Ok,
                query: "",
                queryResult: {
                    success: true,
                    messages: [{ kind: "EmptyIdList", message: "The list of ids is empty, empty chunk returned" }],
                    chunk: EMPTY_CHUNKS[repositoryData.repository.lionweb_version]
                }
            }
        }
        const [versionResult, nodes] = await task.multi(repositoryData, SQL_currentRepoVersion() + SQL_retrieveFullNodesRecursive(nodeIdList, depthLimit))
        requestLogger.info(`VERSION {versionResult}`, { versionResult })
        requestLogger.trace(`NODES ${JSON.stringify(nodes)}`)
        return {
            status: HttpSuccessCodes.Ok,
            query: "",
            queryResult: {
                success: true,
                messages: [versionResultToResponse(versionResult)],
                chunk: nodesToChunk(nodes, repositoryData.repository.lionweb_version)
            }
        }
    }

    /**
     * Return _count_ free id's for _clientId_ and reserve these ids for this client only.
     * @param clientId
     * @param count
     */
    ids = async (task: LionWebTask, repositoryData: RepositoryData, count: number): Promise<QueryReturnType<IdsResponse>> => {
        requestLogger.info("Reserve Count ids " + count + " for " + repositoryData.clientId)
        const result: string[] = await DB_getAvailableIds(task, repositoryData, count)
        return {
            status: HttpSuccessCodes.Ok,
            query: "",
            queryResult: {
                success: true,
                messages: [],
                ids: result
            }
        }
    }
}
