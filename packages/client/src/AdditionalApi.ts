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

            if (compress) {
                body = await compressJSON(bulkImport);
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip',
                };
            } else {
                body = JSON.stringify(bulkImport);
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

function isNode(): boolean {
    return typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null;
}

async function compressJSON(input: object): Promise<BodyInit> {
    const json = JSON.stringify(input);

    if (isNode()) {
        // Node.js: use CompressionStream (Node >= 18) + bridge
        const stream = new CompressionStream("gzip");
        const readableWebStream = new Blob([json]).stream().pipeThrough(stream);

        // Convert to Node.js Readable
        const nodeStream = require("stream").Readable.from(
            readableWebStream as any  // only works in Node ≥18.17+
        );
        return nodeStream;
    } else {
        // Browser: just return the native web stream
        const stream = new CompressionStream("gzip");
        return new Blob([json]).stream().pipeThrough(stream);
    }
}
