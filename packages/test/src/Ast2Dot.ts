import { isEqualMetaPointer, LionWebJsonNode } from "@lionweb/json"
import { LION_CORE_M3_VERSION, LionWebJsonChunkWrapper, MetaPointers } from "@lionweb/json-utils"
import { LionWebId } from "@lionweb/server-delta-shared"

/**
 * Generate a string with graphviz dot code representing the tree for which `node` is the root.
 * @param node
 */
export function ast2dot(rootNodeId: LionWebId, nodes: LionWebJsonNode[]): string {
    const chunk = new LionWebJsonChunkWrapper({
        languages: [],
        nodes: nodes,
        serializationFormatVersion: LION_CORE_M3_VERSION
    })
    const node = chunk.getNode(rootNodeId)
    if (node === undefined) {
        return `ast2dot undefined root node ${rootNodeId}`
    }

    return `
digraph {
    ${ast2dotRecursive(node, chunk)}
}`
}

/**
 * Generate a string with graphviz dot code representing the tree for which `node` is the root.
 * @param node
 */
function ast2dotRecursive(node: LionWebJsonNode, chunk : LionWebJsonChunkWrapper): string {
    // const isNS = FreLanguage.getInstance().classifier(node.freLanguageConcept()).isNamespace
    const isNS = false
    let index = 1
    const nameProp = node.properties.find(prop => isEqualMetaPointer(prop.property, MetaPointers.INamedName))
    const hasNameProp = nameProp !== undefined
    const name = hasNameProp ? nameProp.value : node.id
    const children = chunk.getAllChildNodes(node)
    return `    "${node.id}" ${
        isNS ? ` [peripheries=2, label="${name}\n${node.classifier.key}"]` : `[label="${name}\n${node.classifier.key}"]`
    }
      ${children
          .map(ch => `"${node.id}" -> "${ch.id}" [minlen=${index++}]`)
          .join("\n")}
      ${children
          .map(ch => `${ast2dotRecursive(ch, chunk)}`)
          .join("\n")}
    `
}

