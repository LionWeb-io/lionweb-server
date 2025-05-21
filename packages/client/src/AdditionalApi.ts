import { LionwebResponse } from "@lionweb/server-shared"
import { ClientResponse, RepositoryClient } from "./RepositoryClient.js"
import {BulkImport} from "@lionweb/repository-additionalapi";

export enum TransferFormat {
    JSON= 'json',
    PROTOBUF = 'protobuf',
    FLATBUFFERS = 'flatbuffers'
}

export class AdditionalApi {
    client: RepositoryClient

    constructor(client: RepositoryClient) {
        this.client = client
    }

    async getNodeTree(nodeIds: string[]): Promise<ClientResponse<LionwebResponse>> {
        this.client.log(`AdditionalApi.getNodeTree`)
        return await this.client.postWithTimeout(`additional/getNodeTree`, { body: { ids: nodeIds }, params: "" })
    }

    async bulkImport(bulkImport: BulkImport, transferFormat: TransferFormat, compress: boolean) : Promise<ClientResponse<LionwebResponse>> {
        this.client.log(`AdditionalApi.store transferFormat=${transferFormat}, compress=${compress}`)
        if (transferFormat == TransferFormat.JSON) {
            let body: BodyInit;
            let headers: Record<string, string> = {};

            const json = JSON.stringify(bulkImport);
            if (compress) {

                const stream = new CompressionStream('gzip');
                const compressedStream = new Blob([json]).stream().pipeThrough(stream);
                body = compressedStream;
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip',
                };
            } else {
                body = json;
                headers = {
                    'Content-Type': 'application/json',
                };
            }

            return await this.client.postWithTimeout(`additional/bulkImport`, {
                body,
                params: "",
                headers
            });
        } else {
            throw new Error("Not yet supported")
        }
    }
}
