import {
    BulkImport,
    LionwebResponse,
    PBAttachPoint,
    PBBulkImport,
    PBContainment,
    PBLanguage,
    PBMetaPointer,
    PBNode,
    PBProperty,
    PBReference,
    PBReferenceValue,
    PROTOBUF_CONTENT_TYPE
} from "@lionweb/server-shared"
import { ClientResponse, RepositoryClient } from "./RepositoryClient.js"
import { LionWebJsonMetaPointer, LionWebJsonUsedLanguage } from "@lionweb/json"
import { InputType, ZlibOptions } from "zlib"

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

    constructor() {
        this.stringsIndexingMap.set(null, 0);
        this.languagesIndexingMap.set(null, 0);
    }

    internLanguage(languageVersion: LionWebJsonUsedLanguage) : number {
        if (!this.languagesIndexingMap.has(languageVersion)) {
            const index = this.languages.length+1
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
                liLanguage: this.internLanguage({
                    key: metaPointer.language,
                    version: metaPointer.version
                } as LionWebJsonMetaPointer),
                siKey: this.internString(metaPointer.key)
            } as PBMetaPointer)
            return index
        }
        return this.metaPointersIndexingMap.get(metaPointer)
    }

    internString(string: string) : number {
        if (string === undefined) {
            return 0
        }
        if (!this.stringsIndexingMap.has(string)) {
            const index = this.strings.length + 1
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
    const { attachPoints: inputAttachPoints, nodes: inputNodes } = bulkImport

    // Pre-allocate arrays
    const attachPoints = new Array<PBAttachPoint>(inputAttachPoints.length)
    const nodes = new Array<PBNode>(inputNodes.length)

    // Convert attach points with for loop
    for (let attachPointIndex = 0; attachPointIndex < inputAttachPoints.length; attachPointIndex++) {
        const ap = inputAttachPoints[attachPointIndex]
        containerByAttached[ap.root] = ap.container

        attachPoints[attachPointIndex] = PBAttachPoint.create({
            siContainer: interningContext.internString(ap.container),
            mpiMetaPointer: interningContext.internMetaPointer(ap.containment),
            siRoot: interningContext.internString(ap.root)
        })
    }

    // Convert nodes with for loops
    for (let nodeIndex = 0; nodeIndex < inputNodes.length; nodeIndex++) {
        const node = inputNodes[nodeIndex]
        const { properties: inputProperties, containments: inputContainments, references: inputReferences, annotations: inputAnnotations } = node

        // Convert properties
        const properties = new Array<PBProperty>(inputProperties.length)
        for (let propertyIndex = 0; propertyIndex < inputProperties.length; propertyIndex++) {
            const p = inputProperties[propertyIndex]
            properties[propertyIndex] = PBProperty.create({
                mpiMetaPointer: interningContext.internMetaPointer(p.property),
                siValue: interningContext.internString(p.value)
            })
        }

        // Convert containments
        const containments = new Array<PBContainment>(inputContainments.length)
        for (let containmentIndex = 0; containmentIndex < inputContainments.length; containmentIndex++) {
            const c = inputContainments[containmentIndex]
            const children = new Array<number>(c.children.length)
            for (let k = 0; k < c.children.length; k++) {
                children[k] = interningContext.internString(c.children[k])
            }
            containments[containmentIndex] = PBContainment.create({
                mpiMetaPointer: interningContext.internMetaPointer(c.containment),
                siChildren: children
            })
        }

        // Convert references
        const references = new Array<PBReference>(inputReferences.length)
        for (let referenceIndex = 0; referenceIndex < inputReferences.length; referenceIndex++) {
            const r = inputReferences[referenceIndex]
            const values = new Array<PBReferenceValue>(r.targets.length)
            for (let targetIndex = 0; targetIndex < r.targets.length; targetIndex++) {
                const entry = r.targets[targetIndex]
                values[targetIndex] = PBReferenceValue.create({
                    siResolveInfo: interningContext.internString(entry.resolveInfo),
                    siReferred: interningContext.internString(entry.reference)
                })
            }
            references[referenceIndex] = PBReference.create({
                mpiMetaPointer: interningContext.internMetaPointer(r.reference),
                values: values
            })
        }

        // Convert annotations
        const annotations = new Array<number>(inputAnnotations.length)
        for (let annotationIndex = 0; annotationIndex < inputAnnotations.length; annotationIndex++) {
            annotations[annotationIndex] = interningContext.internString(inputAnnotations[annotationIndex])
        }

        const parentId = node.parent ?? containerByAttached[node.id]

        nodes[nodeIndex] = PBNode.create({
            siId: interningContext.internString(node.id),
            mpiClassifier: interningContext.internMetaPointer(node.classifier),
            properties: properties,
            containments: containments,
            references: references,
            siAnnotations: annotations,
            siParent: interningContext.internString(parentId)
        })
    }

    // Create the protobuf message
    const pbBulkImport = PBBulkImport.create({
        internedStrings: interningContext.strings,
        internedMetaPointers: interningContext.metaPointers,
        internedLanguages: interningContext.languages,
        attachPoints: attachPoints,
        nodes: nodes
    })

    // Encode to bytes
    return PBBulkImport.encode(pbBulkImport).finish()
}
