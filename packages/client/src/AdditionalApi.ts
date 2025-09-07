import {
    BulkImport,
    LionwebResponse
} from "@lionweb/server-shared"
import { ClientResponse, RepositoryClient } from "./RepositoryClient.js"
import { LionWebJsonMetaPointer, LionWebJsonUsedLanguage } from "@lionweb/json"
import { InputType, ZlibOptions } from "zlib"
import {
    PBAttachPoint,
    PBBulkImport,
    PBContainment,
    PBLanguage,
    PBNode,
    PBProperty,
    PBReference,
    PBReferenceValue,
    PROTOBUF_CONTENT_TYPE
} from "@lionweb/server-additionalapi"
import { PBMetaPointer } from "@lionweb/server-additionalapi"

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

class InterningContext {
    public strings: string[] = []
    public languages: PBLanguage[] = []
    public metaPointers: PBMetaPointer[] = []
    private stringsIndexingMap: Map<string, number> = new Map<string, number>()
    private languagesIndexingMap: Map<LionWebJsonUsedLanguage, number> = new Map<LionWebJsonUsedLanguage, number>()
    private metaPointersIndexingMap: Map<LionWebJsonMetaPointer, number> = new Map<LionWebJsonMetaPointer, number>()

    internLanguage(languageVersion: LionWebJsonUsedLanguage) : number {
        if (!this.languagesIndexingMap.has(languageVersion)) {
            const index = this.languages.length
            this.languages.push({
                key: this.internString(languageVersion.key),
                version: this.internString(languageVersion.version)
            } as PBLanguage)
            return index
        }
        return this.languagesIndexingMap.get(languageVersion)
    }

    internMetaPointer(metaPointer: LionWebJsonMetaPointer) : number {
        if (!this.metaPointersIndexingMap.has(metaPointer)) {
            const index = this.metaPointers.length
            this.metaPointers.push({
                language: this.internLanguage({
                    key: metaPointer.language,
                    version: metaPointer.version
                } as LionWebJsonMetaPointer),
                key: this.internString(metaPointer.key)
            } as PBMetaPointer)
            return index
        }
        return this.metaPointersIndexingMap.get(metaPointer)
    }

    internString(string: string) : number | undefined {
        if (string === undefined) {
            return undefined
        }
        if (!this.stringsIndexingMap.has(string)) {
            const index = this.strings.length
            this.stringsIndexingMap.set(string, index)
            this.strings.push(string)
            return index
        }
        return this.stringsIndexingMap.get(string)
    }


}

export function encodeBulkImportToProtobuf(bulkImport: BulkImport): Uint8Array {
    const containerByAttached: Record<string, string> = {}
    const interningContext = new InterningContext()

    // Convert attach points
    const attachPoints: PBAttachPoint[] = bulkImport.attachPoints.map(ap => {
        containerByAttached[ap.root] = ap.container
        
        return PBAttachPoint.create({
            container: interningContext.internString(ap.container),
            metaPointerIndex: interningContext.internMetaPointer(ap.containment),
            rootId: interningContext.internString(ap.root)
        })
    })

    // Convert nodes
    const nodes: PBNode[] = bulkImport.nodes.map(node => {
        // Convert properties
        const properties: PBProperty[] = node.properties.map(p => 
            PBProperty.create({
                metaPointer: interningContext.internMetaPointer(p.property),
                value: interningContext.internString(p.value)
            })
        )

        // Convert containments
        const containments: PBContainment[] = node.containments.map(c =>
            PBContainment.create({
                metaPointer:interningContext.internMetaPointer(c.containment),
                children: c.children.map(child => interningContext.internString(child))
            })
        )

        // Convert references
        const references: PBReference[] = node.references.map(r => {
            const values: PBReferenceValue[] = r.targets.map(entry =>
                PBReferenceValue.create({
                    resolveInfo: interningContext.internString(entry.resolveInfo),
                    referred: interningContext.internString(entry.reference)
                })
            )

            return PBReference.create({
                metaPointer: interningContext.internMetaPointer(r.reference),
                values: values
            })
        })

        const parentId = node.parent ?? containerByAttached[node.id]

        return PBNode.create({
            id: interningContext.internString(node.id),
            classifier: interningContext.internMetaPointer(node.classifier),
            properties: properties,
            containments: containments,
            references: references,
            annotations: node.annotations.map(a => interningContext.internString(a)),
            parent: interningContext.internString(parentId)
        })
    })

    // TODO add interned stuff

    // Create the protobuf message
    const pbBulkImport = PBBulkImport.create({
        attachPoints: attachPoints,
        nodes: nodes
    })

    // Encode to bytes
    return PBBulkImport.encode(pbBulkImport).finish()
}
