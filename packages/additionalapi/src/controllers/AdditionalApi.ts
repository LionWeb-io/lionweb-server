import { getRepositoryData } from "@lionweb/server-dbadmin"
import { Request, Response } from "express"
import { AdditionalApiContext } from "../main.js"
import { HttpClientErrors, HttpSuccessCodes } from "@lionweb/server-shared"
import { lionwebResponse } from "@lionweb/server-common"
import { dbLogger, getIntegerParam, isParameterError } from "@lionweb/server-common"
import { PBBulkImport, PBLanguage, PBMetaPointer } from "../proto/index.js"
import { BulkImport } from "@lionweb/server-shared"
import { LionWebJsonMetaPointer, LionWebJsonUsedLanguage } from "@lionweb/json"

export const JSON_CONTENT_TYPE = "application/json"
export const PROTOBUF_CONTENT_TYPE = "application/protobuf"

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
        const bulkImport: BulkImport = {
            nodes: [],
            attachPoints: []
        }

        // In the ProtoBuf format we use a map of strings, to save space, given the node id and strings describing
        // metapointers are always repeated
        const stringsMap = new Map<number, string>()
        pbBulkImport.internedStrings.forEach((string: string, index: number) => {
            stringsMap.set(index, string)
        })

        const languagesMap = new Map<number, LionWebJsonUsedLanguage>()
        pbBulkImport.internedLanguages.forEach((pbLanguage: PBLanguage, index: number) => {
            const languageVersion: LionWebJsonUsedLanguage = {
                key: stringsMap.get(pbLanguage.key),
                version: stringsMap.get(pbLanguage.version)
            }
            languagesMap.set(index, languageVersion)
        })

        // We do the same also for metapointer, which are duplicated over and over
        const metaPointersMap = new Map<number, LionWebJsonMetaPointer>()
        pbBulkImport.internedMetaPointers.forEach((pbMetaPointer: PBMetaPointer, index: number) => {
            const languageVersion : LionWebJsonUsedLanguage = languagesMap.get(pbMetaPointer.language);
            const metaPointer: LionWebJsonMetaPointer = {
                language: languageVersion.key,
                version: languageVersion.version,
                key: stringsMap.get(pbMetaPointer.key)
            }
            metaPointersMap.set(index, metaPointer)
        })

        const findMetaPointer = (metaPointerIndex: number): LionWebJsonMetaPointer => {
            const res = metaPointersMap.get(metaPointerIndex)
            if (res == null) {
                throw new Error(`Metapointer with index ${metaPointerIndex} not found. Metapointer index known: ${metaPointersMap.keys()}`)
            }
            return res
        }

        pbBulkImport.attachPoints.forEach(pbAttachPoint => {
            bulkImport.attachPoints.push({
                container: stringsMap.get(pbAttachPoint.container),
                containment: findMetaPointer(pbAttachPoint.metaPointerIndex),
                root: stringsMap.get(pbAttachPoint.rootId)
            })
        })

        pbBulkImport.nodes.forEach(pbNode => {
            bulkImport.nodes.push({
                id: stringsMap.get(pbNode.id),
                parent: stringsMap.get(pbNode.parent),
                classifier: findMetaPointer(pbNode.classifier),
                annotations: [],
                properties: pbNode.properties.map(p => {
                    return {
                        property: findMetaPointer(p.metaPointer),
                        value: stringsMap.get(p.value)
                    }
                }),
                containments: pbNode.containments.map(c => {
                    return {
                        containment: findMetaPointer(c.metaPointer),
                        children: c.children.map(child => stringsMap.get(child))
                    }
                }),
                references: pbNode.references.map(r => {
                    return {
                        reference: findMetaPointer(r.metaPointer),
                        targets: r.values.map(rv => {
                            return {
                                reference: stringsMap.get(rv.referred),
                                resolveInfo: stringsMap.get(rv.resolveInfo)
                            }
                        })
                    }
                })
            })
        })
        return bulkImport
    }
}
