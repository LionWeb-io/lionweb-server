import { LionWebJsonNode } from "@lionweb/json"
import { Duplex } from "stream"
import { PoolClient } from "pg"
import { from as copyFrom } from "pg-copy-streams"
import { DbConnection, RepositoryData } from "@lionweb/server-common"
import { BulkImport, HttpClientErrors, HttpSuccessCodes, PBBulkImport, PBLanguage, PBMetaPointer } from "@lionweb/server-shared"
import { MetaPointersCollector, MetaPointersTracker } from "@lionweb/server-dbadmin"
import { finished } from "stream/promises"
import { BulkImportResultType } from "./AdditionalQueries.js"
import { makeQueryToAttachNodeForProtobuf, makeQueryToCheckHowManyDoNotExist } from "./QueryNode.js"

const SEPARATOR = "\t"

function prepareInputStreamNodes(nodes: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    nodes.forEach(node => {
        read_stream_string.push(node.id)
        read_stream_string.push(SEPARATOR)
        read_stream_string.push(metaPointersTracker.forMetaPointer(node.classifier).toString())
        read_stream_string.push(SEPARATOR)
        read_stream_string.push("{" + node.annotations.join(",") + "}")
        read_stream_string.push(SEPARATOR)
        if (node.parent == null) {
            read_stream_string.push("\\N")
        } else {
            read_stream_string.push(node.parent)
        }
        read_stream_string.push("\n")
    })
    read_stream_string.push(null)
    return read_stream_string
}

function prepareInputStreamProperties(nodes: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    nodes.forEach(node => {
        node.properties.forEach(prop => {
            read_stream_string.push(metaPointersTracker.forMetaPointer(prop.property).toString())
            read_stream_string.push(SEPARATOR)
            if (prop.value == null) {
                read_stream_string.push("\\N")
            } else {
                read_stream_string.push(prop.value.replaceAll("\n", "\\n").replaceAll("\r", "\\r").replaceAll("\t", "\\t"))
            }
            read_stream_string.push(SEPARATOR)
            read_stream_string.push(node.id)
            read_stream_string.push("\n")
        })
    })
    read_stream_string.push(null)

    return read_stream_string
}

function prepareInputStreamReferences(nodes: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    nodes.forEach(node => {
        node.references.forEach(ref => {
            read_stream_string.push(metaPointersTracker.forMetaPointer(ref.reference).toString())
            read_stream_string.push(SEPARATOR)

            const refValueStr =
                "{" +
                ref.targets
                    .map(t => {
                        let refStr = "null"
                        if (t.reference != null) {
                            refStr = `\\\\"${t.reference}\\\\"`
                        }

                        return `"{\\\\"reference\\\\": ${refStr}, \\\\"resolveInfo\\\\": \\\\"${t.resolveInfo}\\\\"}"`
                    })
                    .join(",") +
                "}"
            read_stream_string.push(refValueStr)
            read_stream_string.push(SEPARATOR)
            read_stream_string.push(node.id)
            read_stream_string.push("\n")
        })
    })
    read_stream_string.push(null)
    return read_stream_string
}

function prepareInputStreamContainments(nodes: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    nodes.forEach(node => {
        node.containments.forEach(containment => {
            read_stream_string.push(metaPointersTracker.forMetaPointer(containment.containment).toString())
            read_stream_string.push(SEPARATOR)
            read_stream_string.push("{" + containment.children.join(",") + "}")
            read_stream_string.push(SEPARATOR)
            read_stream_string.push(node.id)
            read_stream_string.push("\n")
        })
    })
    read_stream_string.push(null)
    return read_stream_string
}

const escapeMap : { [key: string]: string } = { '\n': '\\n', '\r': '\\r', '\t': '\\t' }

function prepareInputStreamNodesProtobuf(bulkImport: PBBulkImport, metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    const { nodes, internedMetaPointers, internedLanguages, internedStrings } = bulkImport

    // Pre-compute metapointer strings to avoid repeated function calls
    const metaPointerStrings = new Array(internedMetaPointers.length)
    for (let i = 0; i < internedMetaPointers.length; i++) {
        metaPointerStrings[i] = forPBMetapointer(metaPointersTracker, internedMetaPointers[i], internedLanguages, internedStrings).toString()
    }

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const annotations = node.annotations || []

        // Build the entire line at once instead of multiple pushes
        const line = `${internedStrings[node.id]}${SEPARATOR}${metaPointerStrings[node.classifier]}${SEPARATOR}{${annotations.join(",")}}${SEPARATOR}${node.parent == null ? "\\N" : internedStrings[node.parent]}\n`
        read_stream_string.push(line)
    }
    read_stream_string.push(null)
    return read_stream_string
}

function prepareInputStreamPropertiesProtobuf(bulkImport: PBBulkImport, metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    const { nodes, internedMetaPointers, internedLanguages, internedStrings } = bulkImport

    // Pre-compute metapointer strings
    const metaPointerStrings = new Array(internedMetaPointers.length)
    for (let i = 0; i < internedMetaPointers.length; i++) {
        metaPointerStrings[i] = forPBMetapointer(metaPointersTracker, internedMetaPointers[i], internedLanguages, internedStrings).toString()
    }

    // Pre-compile regex for better performance
    const escapeRegex = /[\n\r\t]/g


    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const nodeId = internedStrings[node.id]

        for (let j = 0; j < node.properties.length; j++) {
            const prop = node.properties[j]
            const value = prop.value == null ? "\\N" :
                internedStrings[prop.value].replace(escapeRegex, match => escapeMap[match])

            const line = `${metaPointerStrings[prop.metaPointer]}${SEPARATOR}${value}${SEPARATOR}${nodeId}\n`
            read_stream_string.push(line)
        }
    }
    read_stream_string.push(null)
    return read_stream_string
}

function prepareInputStreamReferencesProtobuf(bulkImport: PBBulkImport, metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    const { nodes, internedMetaPointers, internedLanguages, internedStrings } = bulkImport

    // Pre-compute metapointer strings
    const metaPointerStrings = new Array(internedMetaPointers.length)
    for (let i = 0; i < internedMetaPointers.length; i++) {
        metaPointerStrings[i] = forPBMetapointer(metaPointersTracker, internedMetaPointers[i], internedLanguages, internedStrings).toString()
    }

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const nodeId = internedStrings[node.id]

        for (let j = 0; j < node.references.length; j++) {
            const ref = node.references[j]

            // Build JSON string more efficiently
            let refValueStr = "{"
            for (let k = 0; k < ref.values.length; k++) {
                if (k > 0) refValueStr += ","
                const value = ref.values[k]
                const refStr = (value.referred != null && value.referred !== undefined)
                    ? `\\\\"${internedStrings[value.referred]}\\\\"`
                    : "null"
                refValueStr += `"{\\\\"reference\\\\": ${refStr}, \\\\"resolveInfo\\\\": \\\\"${internedStrings[value.resolveInfo] || ''}\\\\"}"`
            }
            refValueStr += "}"

            const line = `${metaPointerStrings[ref.metaPointer]}${SEPARATOR}${refValueStr}${SEPARATOR}${nodeId}\n`
            read_stream_string.push(line)
        }
    }
    read_stream_string.push(null)
    return read_stream_string
}

function prepareInputStreamContainmentsProtobuf(bulkImport: PBBulkImport, metaPointersTracker: MetaPointersTracker): Duplex {
    const read_stream_string = new Duplex()
    const { nodes, internedMetaPointers, internedLanguages, internedStrings } = bulkImport

    // Pre-compute metapointer strings
    const metaPointerStrings = new Array(internedMetaPointers.length)
    for (let i = 0; i < internedMetaPointers.length; i++) {
        metaPointerStrings[i] = forPBMetapointer(metaPointersTracker, internedMetaPointers[i], internedLanguages, internedStrings).toString()
    }

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const nodeId = internedStrings[node.id]

        for (let j = 0; j < node.containments.length; j++) {
            const containment = node.containments[j]

            // Convert children indices to strings efficiently
            const children = containment.children || []
            let childrenStr = "{"
            for (let k = 0; k < children.length; k++) {
                if (k > 0) childrenStr += ","
                childrenStr += internedStrings[children[k]]
            }
            childrenStr += "}"

            const line = `${metaPointerStrings[containment.metaPointer]}${SEPARATOR}${childrenStr}${SEPARATOR}${nodeId}\n`
            read_stream_string.push(line)
        }
    }
    read_stream_string.push(null)
    return read_stream_string
}

async function pipeInputIntoQueryStream(client: PoolClient, query: string, inputStream: Duplex, opDesc: string): Promise<void> {
    const queryStream = client.query(copyFrom(query));

    // propagate src errors too
    const srcErr = new Promise<never>((_, reject) =>
        inputStream.once("error", (e) =>
            reject(new Error(`Error on ${opDesc} (source): ${e instanceof Error ? e.message : String(e)}`))
        )
    );

    inputStream.pipe(queryStream);

    try {
        // COPY FROM completes on the writable's 'finish'
        await Promise.race([
            finished(queryStream), // resolves on finish, rejects on error/close
            srcErr,
        ]);
    } catch (e) {
        throw new Error(`Error on ${opDesc}: ${e instanceof Error ? e.message : String(e)}`);
    }
}

export async function storeNodes(
    client: PoolClient,
    repositoryData: RepositoryData,
    bulkImport: BulkImport,
    metaPointersTracker: MetaPointersTracker
): Promise<void> {
    try {
        const repositoryName = repositoryData.repository.repository_name
        const schemaName = repositoryData.repository.schema_name

        const nodes = bulkImport.nodes

        await pipeInputIntoQueryStream(
            client,
            `COPY "${schemaName}".lionweb_nodes(id,classifier,annotations,parent) FROM STDIN`,
            prepareInputStreamNodes(nodes, metaPointersTracker),
            "nodes insertion"
        )
        await pipeInputIntoQueryStream(
            client,
            `COPY "${schemaName}".lionweb_containments(containment,children,node_id) FROM STDIN`,
            prepareInputStreamContainments(nodes, metaPointersTracker),
            "containments insertion"
        )
        await pipeInputIntoQueryStream(
            client,
            `COPY "${schemaName}".lionweb_references(reference,targets,node_id) FROM STDIN`,
            prepareInputStreamReferences(nodes, metaPointersTracker),
            `references ${repositoryName}`
        )
        await pipeInputIntoQueryStream(
            client,
            `COPY "${schemaName}".lionweb_properties(property,value,node_id) FROM STDIN`,
            prepareInputStreamProperties(nodes, metaPointersTracker),
            `properties ${repositoryName}`
        )
    } finally {
        client.release(false)
    }
}

async function storeNodesThroughProtobuf(
    client: PoolClient,
    repositoryData: RepositoryData,
    dbConnection: DbConnection,
    bulkImport: PBBulkImport
): Promise<MetaPointersTracker> {
    // We obtain all the indexes for all the MetaPointers we need. We will then use such indexes in successive calls
    // to pipeInputIntoQueryStream, etc.
    const metaPointersTracker = new MetaPointersTracker(repositoryData)
    await populateThroughProtobuf(metaPointersTracker, bulkImport, repositoryData, dbConnection)

    const repositoryName = repositoryData.repository.repository_name
    const schemaName = repositoryData.repository.schema_name
    await pipeInputIntoQueryStream(
        client,
        `COPY "${schemaName}".lionweb_nodes(id,classifier,annotations,parent) FROM STDIN`,
        prepareInputStreamNodesProtobuf(bulkImport, metaPointersTracker),
        "nodes insertion"
    )
    await pipeInputIntoQueryStream(
        client,
        `COPY "${schemaName}".lionweb_containments(containment,children,node_id) FROM STDIN`,
        prepareInputStreamContainmentsProtobuf(bulkImport, metaPointersTracker),
        "containments insertion"
    )
    await pipeInputIntoQueryStream(
        client,
        `COPY "${schemaName}".lionweb_references(reference,targets,node_id) FROM STDIN`,
        prepareInputStreamReferencesProtobuf(bulkImport, metaPointersTracker),
        `references ${repositoryName}`
    )
    await pipeInputIntoQueryStream(
        client,
        `COPY "${schemaName}".lionweb_properties(property,value,node_id) FROM STDIN`,
        prepareInputStreamPropertiesProtobuf(bulkImport, metaPointersTracker),
        `properties ${repositoryName}`
    )
    return metaPointersTracker
}

/**
 * This is a variant of bulkImport that operates directly on Protobuf data structures, instead of converting them
 * to the "neutral" format and invoke bulkImport. This choice has been made for performance reasons.
 */
export async function performImportFromProtobuf(
    client: PoolClient,
    dbConnection: DbConnection,
    bulkImport: PBBulkImport,
    repositoryData: RepositoryData
): Promise<BulkImportResultType> {
    try {
        // Check - We verify there are no duplicate IDs in the new nodes
        const newNodesSet = new Set<string>()
        const parentsSet: Set<string> = new Set<string>()
        for (let i = 0; i < bulkImport.nodes.length; i++) {
            const pbNode = bulkImport.nodes[i]
            const pbNodeID = bulkImport.internedStrings[pbNode.id]
            if (newNodesSet.has(pbNodeID)) {
                return {
                    status: HttpClientErrors.BadRequest,
                    success: false,
                    description: `Node with ID ${pbNodeID} is being inserted twice`
                }
            }
            newNodesSet.add(pbNodeID)
            const parent = bulkImport.internedStrings[pbNode.parent]
            if (parent) {
                parentsSet.add(parent)
            }
        }

        // Check - We verify all the parent nodes are either other new nodes or the attach points containers
        // Check - verify the root of the attach points are among the new nodes
        const attachPointContainers: Set<string> = new Set<string>()
        for (let i = 0; i < bulkImport.attachPoints.length; i++) {
            const pbAttachPoint = bulkImport.attachPoints[i]
            const pbAttachPointRoot = bulkImport.internedStrings[pbAttachPoint.rootId]
            if (!newNodesSet.has(pbAttachPointRoot)) {
                return {
                    status: HttpClientErrors.BadRequest,
                    success: false,
                    description: `Attach point root ${pbAttachPointRoot} does not appear among the new nodes`
                }
            }
            attachPointContainers.add(bulkImport.internedStrings[pbAttachPoint.container])
        }
        parentsSet.forEach(parent => {
            if (!newNodesSet.has(parent) && !attachPointContainers.has(parent)) {
                return {
                    status: HttpClientErrors.BadRequest,
                    success: false,
                    description: `Invalid parent specified: ${parent}. It is not one of the new nodes being added or one of the attach points`
                }
            }
        })

        // Check - verify all the given new nodes are effectively new
        const allNewNodesResult =
            newNodesSet.size == 0 ? 0 : await dbConnection.query(repositoryData, makeQueryToCheckHowManyDoNotExist(newNodesSet))
        if (allNewNodesResult > 0) {
            return {
                status: HttpClientErrors.BadRequest,
                success: false,
                description: `Some of the given nodes already exist`
            }
        }

        // Check - verify the containers from the attach points are existing nodes
        const allExistingNodesResult =
            attachPointContainers.size == 0
                ? 0
                : await dbConnection.query(repositoryData, makeQueryToCheckHowManyDoNotExist(attachPointContainers))
        if (allExistingNodesResult > 0) {
            return {
                status: HttpClientErrors.BadRequest,
                success: false,
                description: `Some of the attach point containers do not exist`
            }
        }

        // Add all the new nodes
        const metaPointersTracker = await storeNodesThroughProtobuf(client, repositoryData, dbConnection, bulkImport)

        // Attach the root of the new nodes to existing containers
        for (let i = 0; i < bulkImport.attachPoints.length; i++) {
            const pbAttachPoint = bulkImport.attachPoints[i]
            await dbConnection.query(repositoryData, makeQueryToAttachNodeForProtobuf(pbAttachPoint, metaPointersTracker,
                bulkImport.internedLanguages, bulkImport.internedStrings, bulkImport.internedMetaPointers))
        }

        return { status: HttpSuccessCodes.Ok, success: true }
    } finally {
        client.release(false)
    }
}

async function populateThroughProtobuf(
    metaPointersTracker: MetaPointersTracker,
    bulkImport: PBBulkImport,
    repositoryData: RepositoryData,
    dbConnection: DbConnection
): Promise<void> {
    await metaPointersTracker.populate((collector: MetaPointersCollector) => {
        function considerAddingPBMetaPointer(metaPointer: PBMetaPointer) {
            const languageVersion = bulkImport.internedLanguages[metaPointer.language]
            collector.considerAddingMetaPointer({
                key: bulkImport.internedStrings[metaPointer.key],
                version: bulkImport.internedStrings[languageVersion.version],
                language: bulkImport.internedStrings[languageVersion.key]
            })
        }

        for (let i = 0; i < bulkImport.nodes.length; i++) {
            const pbNode = bulkImport.nodes[i]
            const metaPointerIndex = pbNode.classifier
            const metaPointer = bulkImport.internedMetaPointers[metaPointerIndex]
            considerAddingPBMetaPointer(metaPointer)
            for (let j = 0; j < pbNode.containments.length; j++) {
                const metaPointerIndex = pbNode.containments[j].metaPointer
                const metaPointer = bulkImport.internedMetaPointers[metaPointerIndex]
                considerAddingPBMetaPointer(metaPointer)
            }
            for (let j = 0; j < pbNode.references.length; j++) {
                const metaPointerIndex = pbNode.references[j].metaPointer
                const metaPointer = bulkImport.internedMetaPointers[metaPointerIndex]
                considerAddingPBMetaPointer(metaPointer)
            }
            for (let j = 0; j < pbNode.properties.length; j++) {
                const metaPointerIndex = pbNode.properties[j].metaPointer
                const metaPointer = bulkImport.internedMetaPointers[metaPointerIndex]
                considerAddingPBMetaPointer(metaPointer)
            }
        }
        for (let i = 0; i < bulkImport.attachPoints.length; i++) {
            const attachPoint = bulkImport.attachPoints[i]
            const metaPointer = bulkImport.internedMetaPointers[attachPoint.metaPointerIndex]
            considerAddingPBMetaPointer(metaPointer)
        }
    }, dbConnection)
}

export function forPBMetapointer(metaPointersTracker: MetaPointersTracker, metaPointer: PBMetaPointer,
                                 internedLanguages: PBLanguage[], internedStrings: string[]): number {
    const language = internedLanguages[metaPointer.language]
    return metaPointersTracker.forMetaPointer({
        key: internedStrings[metaPointer.key],
        language: internedStrings[language.key],
        version: internedStrings[language.version]
    })
}

export async function populateFromBulkImport(metaPointersTracker: MetaPointersTracker, bulkImport: BulkImport, dbConnection: DbConnection) {
    await metaPointersTracker.populate((collector: MetaPointersCollector) => {
        const nodes = bulkImport.nodes
        nodes.forEach((node: LionWebJsonNode) => collector.considerNode(node))
        bulkImport.attachPoints.forEach(ap => collector.considerAddingMetaPointer(ap.containment))
    }, dbConnection)
}
