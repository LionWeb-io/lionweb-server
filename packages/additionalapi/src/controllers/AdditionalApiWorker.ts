import { LionWebTask, RepositoryData } from "@lionweb/server-database"
import { AdditionalApiContext } from "../main.js";
import { BulkImport, requestLogger } from "@lionweb/server-shared"

/**
 * Implementations of the additional non-LionWeb methods.
 */
export class AdditionalApiWorker {
    constructor(private context: AdditionalApiContext) {
    }
    getNodeTree = async (task: LionWebTask, repositoryData: RepositoryData, nodeIds: string[], depthLimit: number)=> {

        requestLogger.info("AdditionalApiWorker.getNodeTree for " + nodeIds + " with depth " + depthLimit)
        return await this.context.queries.getNodeTree(task, repositoryData, nodeIds, depthLimit)
    }

    /**
     * When processing a bulk import operation specified through JSON or ProtoBuf, we convert the payload to a BulkImport
     * so that we can process both of them with the same logic.
     *
     * The bulk import can contain entire partitions or subtrees. In case of subtrees a corresponding attach points
     * must be defined.
     *
     * @param repositoryData
     * @param bulkImport
     */
    bulkImport = async (repositoryData: RepositoryData, bulkImport: BulkImport)=> {
        requestLogger.info("AdditionalApiWorker.bulkImport")
        return await this.context.queries.bulkImport(this.context, repositoryData, bulkImport)
    }

}
