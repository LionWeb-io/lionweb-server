import { getRepositoryData } from "@lionweb/server-dbadmin"
import { Request, Response } from "express"
import { AdditionalApiContext } from "../main.js"
import { HttpClientErrors, HttpSuccessCodes, PROTOBUF_CONTENT_TYPE } from "@lionweb/server-shared"
import { lionwebResponse } from "@lionweb/server-common"
import { dbLogger, getIntegerParam, isParameterError } from "@lionweb/server-common"
import { BulkImport, PBBulkImport } from "@lionweb/server-shared"

export const JSON_CONTENT_TYPE = "application/json"

export interface AdditionalApi {
    getNodeTree(request: Request, response: Response): void

    /**
     * The bulk import operation is intended to import in an existing repository a large number of nodes.
     * It is indicated to use with 10,000 - 500,000 nodes.
     * All nodes should be new, and not updating existing nodes. The operation can receive a series of trees.
     * For each tree the point to which it should be attached should be specified as the pair composed by:
     * a) ID of an existing node, b) containment where to attach the tree. The root of the tree will be appended
     * to that containment.
     *
     * This operation can receive the body in JSON, and protobuf. For optimal performance,
     * it is recommended to use protobuf.
     */
    bulkImport(request: Request, response: Response): void
}

export class AdditionalApiImpl implements AdditionalApi {
    constructor(private context: AdditionalApiContext) {}
    /**
     * Get the tree with root `id`, for a list of node ids.
     * Note that the tree could be overlapping, and the same nodes could appear multiple times in the response.
     * @param request
     * @param response
     */
    getNodeTree = async (request: Request, response: Response): Promise<void> => {
        const idList = request.body.ids
        if (idList === undefined) {
            lionwebResponse(response, HttpClientErrors.BadRequest, {
                success: false,
                messages: [
                    {
                        kind: "EmptyIdList",
                        message: "ids not found",
                        data: idList
                    }
                ]
            })
            return
        }
        const repositoryData = getRepositoryData(request)
        if (isParameterError(repositoryData)) {
            lionwebResponse(response, HttpClientErrors.BadRequest, {
                success: false,
                messages: [repositoryData.error]
            })
            return
        } else {
            const depthLimit = getIntegerParam(request, "depthLimit", Number.MAX_SAFE_INTEGER)
            if (isParameterError(depthLimit)) {
                lionwebResponse(response, HttpClientErrors.PreconditionFailed, {
                    success: false,
                    messages: [depthLimit.error]
                })
            } else {
                dbLogger.info("API.getNodeTree is " + idList)
                const result = await this.context.additionalApiWorker.getNodeTree(repositoryData, idList, depthLimit)
                lionwebResponse(response, HttpSuccessCodes.Ok, {
                    success: true,
                    messages: [],
                    data: result.queryResult
                })
            }
        }
    }

    bulkImport = async (request: Request, response: Response): Promise<void> => {
        const repositoryData = getRepositoryData(request, "Dummy")
        if (isParameterError(repositoryData)) {
            lionwebResponse(response, HttpClientErrors.BadRequest, {
                success: false,
                messages: [repositoryData.error]
            })
            return
        }
        if (request.is(JSON_CONTENT_TYPE)) {
            const result = await this.context.additionalApiWorker.bulkImport(repositoryData, request.body)
            lionwebResponse(response, HttpSuccessCodes.Ok, {
                success: result.success,
                messages: [],
                data: []
            })
        } else if (request.is(PROTOBUF_CONTENT_TYPE)) {
            const data = new Uint8Array(request.body.buffer, request.body.byteOffset, request.body.byteLength)
            const bulkImport = PBBulkImport.decode(data)

            const result = await this.context.additionalApiWorker.bulkImport(
                repositoryData,
                this.convertPBBulkImportToBulkImport(bulkImport)
            )
            lionwebResponse(response, HttpSuccessCodes.Ok, {
                success: result.success,
                messages: [],
                data: []
            })
        } else {
            throw new Error(`Content-type not recognized. Content-type: ${request.headers["content-type"]}`)
        }
    }

    private convertPBBulkImportToBulkImport(pbBulkImport: PBBulkImport): BulkImport {
        const { internedStrings, internedLanguages, internedMetaPointers, attachPoints, nodes } = pbBulkImport

        // Pre-compute all language mappings
        const languagesArray = new Array(internedLanguages.length)
        for (let i = 0; i < internedLanguages.length; i++) {
            const pbLanguage = internedLanguages[i]
            languagesArray[i] = {
                key: internedStrings[pbLanguage.key],
                version: internedStrings[pbLanguage.version]
            }
        }

        // Pre-compute all metapointer mappings using arrays instead of Map
        const metaPointersArray = new Array(internedMetaPointers.length)
        for (let i = 0; i < internedMetaPointers.length; i++) {
            const pbMetaPointer = internedMetaPointers[i]
            const languageVersion = languagesArray[pbMetaPointer.language]
            metaPointersArray[i] = {
                language: languageVersion.key,
                version: languageVersion.version,
                key: internedStrings[pbMetaPointer.key]
            }
        }

        // Convert attach points with pre-allocated array
        const convertedAttachPoints = new Array(attachPoints.length)
        for (let i = 0; i < attachPoints.length; i++) {
            const pbAttachPoint = attachPoints[i]
            convertedAttachPoints[i] = {
                container: internedStrings[pbAttachPoint.container],
                containment: metaPointersArray[pbAttachPoint.metaPointerIndex],
                root: internedStrings[pbAttachPoint.rootId]
            }
        }

        // Convert nodes with pre-allocated array
        const convertedNodes = new Array(nodes.length)
        for (let i = 0; i < nodes.length; i++) {
            const pbNode = nodes[i]
            const { properties, containments, references } = pbNode

            // Pre-allocate nested arrays
            const convertedProperties = new Array(properties.length)
            const convertedContainments = new Array(containments.length)
            const convertedReferences = new Array(references.length)

            // Convert properties
            for (let j = 0; j < properties.length; j++) {
                const p = properties[j]
                convertedProperties[j] = {
                    property: metaPointersArray[p.metaPointer],
                    value: internedStrings[p.value]
                }
            }

            // Convert containments
            for (let j = 0; j < containments.length; j++) {
                const c = containments[j]
                const convertedChildren = new Array(c.children.length)
                for (let k = 0; k < c.children.length; k++) {
                    convertedChildren[k] = internedStrings[c.children[k]]
                }
                convertedContainments[j] = {
                    containment: metaPointersArray[c.metaPointer],
                    children: convertedChildren
                }
            }

            // Convert references
            for (let j = 0; j < references.length; j++) {
                const r = references[j]
                const convertedTargets = new Array(r.values.length)
                for (let k = 0; k < r.values.length; k++) {
                    const rv = r.values[k]
                    convertedTargets[k] = {
                        reference: internedStrings[rv.referred],
                        resolveInfo: internedStrings[rv.resolveInfo]
                    }
                }
                convertedReferences[j] = {
                    reference: metaPointersArray[r.metaPointer],
                    targets: convertedTargets
                }
            }

            convertedNodes[i] = {
                id: internedStrings[pbNode.id],
                parent: internedStrings[pbNode.parent],
                classifier: metaPointersArray[pbNode.classifier],
                annotations: [], // Empty array as in original
                properties: convertedProperties,
                containments: convertedContainments,
                references: convertedReferences
            }
        }

        return {
            nodes: convertedNodes,
            attachPoints: convertedAttachPoints
        }
    }

}
