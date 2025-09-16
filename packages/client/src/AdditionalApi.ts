import {
    BulkImport,
    LionwebResponse,
    PROTOBUF_CONTENT_TYPE
} from "@lionweb/server-shared"
import { ClientResponse, RepositoryClient } from "./RepositoryClient.js"
import { InputType, ZlibOptions } from "zlib"
import { encodeBulkImportToProtobuf } from "./EncodeBulkImportToProtobuf.js"

export enum TransferFormat {
    JSON = "json",
    PROTOBUF = "protobuf"
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

    async bulkImport(bulkImport: BulkImport, transferFormat: TransferFormat, compress: boolean): Promise<ClientResponse<LionwebResponse>> {
        this.client.log(`AdditionalApi.store transferFormat=${transferFormat}, compress=${compress}`)
        if (transferFormat == TransferFormat.JSON) {
            const { body, headers } = compress
                ? { body: await compressJSON(bulkImport), headers: { "Content-Type": "application/json", "Content-Encoding": "gzip" } }
                : { body: JSON.stringify(bulkImport), headers: { "Content-Type": "application/json" } }

            return await this.client.postWithTimeout(
                `additional/bulkImport`,
                {
                    body,
                    params: "",
                    headers
                },
                false
            )
        } else if (transferFormat == TransferFormat.PROTOBUF) {
            if (compress) {
                throw new Error(`We do not yet support bulk import with ${transferFormat} and compression enabled`)
            } else {
                const protobufBytes = encodeBulkImportToProtobuf(bulkImport)
                const headers = {
                    "Content-Type": PROTOBUF_CONTENT_TYPE
                }

                return await this.client.postWithTimeout(
                    "additional/bulkImport",
                    {
                        body: protobufBytes,
                        params: "",
                        headers
                    },
                    false
                )
            }
        } else {
            throw new Error(`Transfer Format ${transferFormat} is not yet supported for the bulk import operation`)
        }
    }
}

// Works in Node and browsers when lib.dom is in your TS config.
const CS: typeof CompressionStream | undefined = typeof CompressionStream !== "undefined" ? CompressionStream : undefined

const hasCompressionStream = !!CS

function isNode(): boolean {
    return typeof process !== "undefined" && process.versions != null && process.versions.node != null
}

let nodeGzip: (buffer: InputType, options?: ZlibOptions) => Promise<Buffer> = null

/**
 * We want to lazily load this function only on Node, as it is now available on the browser.
 */
async function getNodeGzip(): Promise<(buffer: InputType, options?: ZlibOptions) => Promise<Buffer>> {
    if (nodeGzip != null) {
        return nodeGzip
    }
    if (isNode()) {
        const { gzip: gzipCb } = await import("node:zlib")
        const { promisify } = await import("node:util")
        nodeGzip = promisify(gzipCb)
        return nodeGzip
    } else {
        return null
    }
}

export async function compressJSON(input: unknown): Promise<BodyInit> {
    const json = JSON.stringify(input)

    // Browsers: use CompressionStream
    if (!isNode() && hasCompressionStream) {
        const cs = new CompressionStream("gzip")
        const compressedStream = new Blob([json]).stream().pipeThrough(cs)
        // Collect into a Blob -> no actual streaming body for fetch
        return await new Response(compressedStream).blob()
    }

    // Node: gzip to Buffer (BodyInit accepts Buffer/Uint8Array)
    if (isNode()) {
        const gzip = await getNodeGzip()
        return await gzip(json)
    }

    // very old browsers
    throw new Error("Compression not support: this seems to be an old browser")
}
