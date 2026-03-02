import { PBLanguage, PBMetaPointer } from "@lionweb/server-shared"
import { LionWebJsonMetaPointer, LionWebJsonUsedLanguage } from "@lionweb/json"
import {
    BulkImport,
    PBAttachPoint,
    PBBulkImport,
    PBContainment,
    PBNode,
    PBProperty,
    PBReference,
    PBReferenceValue
} from "@lionweb/server-shared"

/**
 * The `InterningContext` class is responsible for managing and interning strings, language versions,
 * and meta-pointers, as needed when serializing to Protobuffer.
 */
class EncodeBulkImportToProtobuf {
    public strings: string[] = []
    public languages: PBLanguage[] = []
    public metaPointers: PBMetaPointer[] = []
    private stringsIndexingMap: Map<string, number> = new Map<string, number>()
    private languagesIndexingMap: Map<LionWebJsonUsedLanguage, number> = new Map<LionWebJsonUsedLanguage, number>()
    private metaPointersIndexingMap: Map<LionWebJsonMetaPointer, number> = new Map<LionWebJsonMetaPointer, number>()

    constructor() {
        this.stringsIndexingMap.set(null, 0)
        this.languagesIndexingMap.set(null, 0)
    }

    internLanguage(languageVersion: LionWebJsonUsedLanguage): number {
        if (!this.languagesIndexingMap.has(languageVersion)) {
            const index = this.languages.length + 1
            this.languages.push({
                key: this.internString(languageVersion.key),
                version: this.internString(languageVersion.version)
            } as PBLanguage)
            return index
        }
        return this.languagesIndexingMap.get(languageVersion)
    }

    internMetaPointer(metaPointer: LionWebJsonMetaPointer): number {
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

    internString(string: string): number {
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


/**
 * Encodes a BulkImport object into a Protobuf byte array.
 *
 * The method processes each component of the BulkImport object, including attach points, nodes, properties,
 * containments, references, and annotations, transforming them into their Protobuf representations while
 * using the interning mechanism expected by protobuf.
 *
 * @param {BulkImport} bulkImport - The BulkImport object representing a collection of nodes and their structure to be serialized.
 * @return {Uint8Array} A serialized Protobuf representation of the BulkImport object as a byte array.
 */
export function encodeBulkImportToProtobuf(bulkImport: BulkImport): Uint8Array {
    const containerByAttached: Record<string, string> = {}
    const interningContext = new EncodeBulkImportToProtobuf()
    const { attachPoints: inputAttachPoints, nodes: inputNodes } = bulkImport

    // Pre-allocate arrays
    const attachPoints = new Array<PBAttachPoint>(inputAttachPoints.length)
    const nodes = new Array<PBNode>(inputNodes.length)

    // Convert attach points
    for (let attachPointIndex = 0; attachPointIndex < inputAttachPoints.length; attachPointIndex++) {
        const ap = inputAttachPoints[attachPointIndex]
        containerByAttached[ap.root] = ap.container

        attachPoints[attachPointIndex] = PBAttachPoint.create({
            siContainer: interningContext.internString(ap.container),
            mpiMetaPointer: interningContext.internMetaPointer(ap.containment),
            siRoot: interningContext.internString(ap.root)
        })
    }

    // Convert nodes
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
