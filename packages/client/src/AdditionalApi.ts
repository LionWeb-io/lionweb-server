import { LionwebResponse } from "@lionweb/server-shared"
import { ClientResponse, RepositoryClient } from "./RepositoryClient.js"
import {
    BulkImport,
    FBAttachPoint,
    FBBulkImport,
    FBContainment,
    FBMetaPointer,
    FBNode,
    FBProperty,
    FBReference,
    FBReferenceValue
} from "@lionweb/server-additionalapi";
import { Builder as FBBuilder } from 'flatbuffers';
import {LionWebJsonMetaPointer} from "@lionweb/json";
import { gzip as gzipCb } from "node:zlib";
import { promisify } from "node:util";

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
            const { body, headers } = compress
                ? { body: await compressJSON(bulkImport), headers: { "Content-Type": "application/json", "Content-Encoding": "gzip" } }
                : { body: JSON.stringify(bulkImport),     headers: { "Content-Type": "application/json" } };

            return await this.client.postWithTimeout(`additional/bulkImport`, {
                body,
                params: "",
                headers,
            }, false);
        } else if (transferFormat == TransferFormat.FLATBUFFERS) {
            if (compress) {
                throw new Error("Not yet supported")
            } else {
                const flatbufferBytes = encodeBulkImportToFlatBuffer(bulkImport);
                const headers = {
                    "Content-Type": "application/x-flatbuffers"
                };

                return await this.client.postWithTimeout("additional/bulkImport", {
                    body: flatbufferBytes,
                    params: "",
                    headers,
                }, false);
            }
        } else {
            throw new Error(`Transfer Format ${transferFormat} is not yet supported`)
        }
    }
}

const gzip = promisify(gzipCb);

// Works in Node and browsers when lib.dom is in your TS config.
const CS: typeof CompressionStream | undefined =
    typeof CompressionStream !== "undefined" ? CompressionStream : undefined;

const hasCompressionStream = !!CS;

function isNode(): boolean {
    return typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null;
}

export async function compressJSON(input: unknown): Promise<BodyInit> {
    const json = JSON.stringify(input);

    // Browsers: stream with CompressionStream
    if (!isNode() && hasCompressionStream) {
        const cs = new CompressionStream("gzip");
        return new Blob([json]).stream().pipeThrough(cs); // ReadableStream (OK in browsers)
    }

    // Node (or old browsers): gzip to Buffer (BodyInit accepts Buffer/Uint8Array)
    if (isNode()) return await gzip(json);
    return json; // very old browsers
}

function offsetForMetaPointer(builder: FBBuilder, mp: LionWebJsonMetaPointer): number {
    const languageOffset = builder.createString(mp.language);
    const keyOffset = builder.createString(mp.key);
    const versionOffset = builder.createString(mp.version);
    return FBMetaPointer.createFBMetaPointer(builder, languageOffset, keyOffset, versionOffset);
}

export function encodeBulkImportToFlatBuffer(bulkImport: BulkImport): Uint8Array {
    const builder = new FBBuilder(1024);
    const containerByAttached: Record<string, string> = {};

    const attachOffsets = bulkImport.attachPoints.map(ap => {
        const containment = offsetForMetaPointer(builder, ap.containment);
        const container = builder.createString(ap.container);
        const root = builder.createString(ap.root);

        containerByAttached[ap.root] = ap.container;

        FBAttachPoint.startFBAttachPoint(builder);
        FBAttachPoint.addContainer(builder, container);
        FBAttachPoint.addContainment(builder, containment);
        FBAttachPoint.addRoot(builder, root);
        return FBAttachPoint.endFBAttachPoint(builder);
    });

    const attachPointsVector = FBBulkImport.createAttachPointsVector(builder, attachOffsets);

    const nodeOffsets = bulkImport.nodes.map(node => {
        const propOffsets = node.properties.map(p => {
            const mp = offsetForMetaPointer(builder, p.property);
            const value = p.value ? builder.createString(p.value) : undefined;

            FBProperty.startFBProperty(builder);
            FBProperty.addMetaPointer(builder, mp);
            if (value !== undefined) FBProperty.addValue(builder, value);
            return FBProperty.endFBProperty(builder);
        });
        const propsVector = FBNode.createPropertiesVector(builder, propOffsets);

        const contOffsets = node.containments.map(c => {
            const mp = offsetForMetaPointer(builder, c.containment);
            const childrenOffsets = c.children.map(childID => builder.createString(childID));
            const childrenVector = FBContainment.createChildrenVector(builder, childrenOffsets);

            FBContainment.startFBContainment(builder);
            FBContainment.addMetaPointer(builder, mp);
            FBContainment.addChildren(builder, childrenVector);
            return FBContainment.endFBContainment(builder);
        });
        const consVector = FBNode.createContainmentsVector(builder, contOffsets);

        const refOffsets = node.references.map(r => {
            const mp = offsetForMetaPointer(builder, r.reference);
            const valueOffsets = r.targets.map(entry => {
                const resolveInfo = entry.resolveInfo ? builder.createString(entry.resolveInfo) : undefined;
                const referred = entry.reference ? builder.createString(entry.reference) : undefined;

                FBReferenceValue.startFBReferenceValue(builder);
                if (resolveInfo) FBReferenceValue.addResolveInfo(builder, resolveInfo);
                if (referred) FBReferenceValue.addReferred(builder, referred);
                return FBReferenceValue.endFBReferenceValue(builder);
            });
            const valuesVector = FBReference.createValuesVector(builder, valueOffsets);

            FBReference.startFBReference(builder);
            FBReference.addMetaPointer(builder, mp);
            FBReference.addValues(builder, valuesVector);
            return FBReference.endFBReference(builder);
        });
        const refsVector = FBNode.createReferencesVector(builder, refOffsets);

        const annotationOffsets = node.annotations.map(a => builder.createString(a));
        const annsVector = FBNode.createAnnotationsVector(builder, annotationOffsets);

        const id = builder.createString(node.id);
        const classifier = offsetForMetaPointer(builder, node.classifier);

        const parentId = node.parent ?? containerByAttached[node.id];
        const parentOffset = parentId ? builder.createString(parentId) : null;

        FBNode.startFBNode(builder);
        FBNode.addId(builder, id);
        FBNode.addClassifier(builder, classifier);
        FBNode.addProperties(builder, propsVector);
        FBNode.addContainments(builder, consVector);
        FBNode.addReferences(builder, refsVector);
        FBNode.addAnnotations(builder, annsVector);
        if (parentOffset) FBNode.addParent(builder, parentOffset);
        return FBNode.endFBNode(builder);
    });

    const nodesVector = FBBulkImport.createNodesVector(builder, nodeOffsets);

    FBBulkImport.startFBBulkImport(builder);
    FBBulkImport.addAttachPoints(builder, attachPointsVector);
    FBBulkImport.addNodes(builder, nodesVector);
    const bulkImportOffset = FBBulkImport.endFBBulkImport(builder);
    builder.finish(bulkImportOffset);

    return builder.asUint8Array();
}
