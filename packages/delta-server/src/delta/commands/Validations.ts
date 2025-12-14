import { isProperTree } from "@lionweb/server-common"
import {
    DeltaCommand,
    LionWebDeltaJsonChunk,
    LionWebId,
    LionWebJsonContainment,
    LionWebJsonMetaPointer,
    LionWebJsonReference,
    LionWebJsonReferenceTarget
} from "@lionweb/server-delta-shared"
import { isEqualMetaPointer, LionWebJsonNode } from "@lionweb/json"
import { newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { issuesToProtocolNessages } from "./DeltaUtil.js"

export type Change = "Add" | "Replace" | "Delete"

/**
 * 
 * @param nodes
 * @param parent
 * @param msg
 * @param participation
 * @returns             The parent of the root node of the tree built from `nodes`
 */
export function validateProperTree(nodes: LionWebDeltaJsonChunk, parent: LionWebId | null, msg: DeltaCommand, participation: ParticipationInfo): LionWebJsonNode | undefined {
    // - There is exactly one node with parent `parentNode`, called `childNode`
    // - All nodes together form a proper tree with root `childNode`, i.e. no orphans allowed
    //   This can be done through the LionwebReferenceValidator.
    const issues = isProperTree(nodes)
    if (issues.length > 0) {
        throw newErrorEvent("NotATree", `the newChild chunk is not a proper tree`, msg, participation, {
            protocolMessages: issuesToProtocolNessages(issues)
        })
    }
    const rootNode = nodes.nodes.find(node => node.parent === parent )
    if (rootNode === undefined) {
        // TODO this check can be moved to the ReferenceValidator by giving the `parent` as parameter
        throw newErrorEvent("NoChildFound", `The newChild chunk does not contain a node with parent ${parent}`, msg, participation)
    }
    return rootNode
}

/**
 * Validate whether `parentNode` has a `containment` with a valid `index`, and currently `expectedChild` at `index`
 * @param parentNode    The node in which the containment is to be changed.
 * @param containment   The containment which is to be changed
 * @param index         The index of the child to be changed / added deleted
 * @param expectedChild The current child at `index`
 * @param msg
 * @param participation
 * @returns             The containment of the parent node, or a copy of it 
 */
export function validateContainment(
    parentNode: LionWebJsonNode,
    containment: LionWebJsonMetaPointer,
    index: number,
    change: Change,
    expectedChild: LionWebId | undefined,
    msg: DeltaCommand,
    participation: ParticipationInfo
): LionWebJsonContainment {
    // Check whether containment exists in the parent
    let foundContainment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, containment))
    if (foundContainment === undefined) {
        if (index !== 0) {
            throw newErrorEvent("err-unknownIndex", `Index '${index}' is out of bounds`, msg, participation)
        } else if (change === "Add") {
            // create new containment with one child
            foundContainment = {
                containment: containment,
                children: []
            }
        } else {
            throw newErrorEvent(
                "unknownContainment",
                `Containment '${JSON.stringify(containment)}' does not exists in parent '${parentNode.id}'`,
                msg,
                participation
            )
        }
    }
    // Check the index is within bounds
    if (change === "Add" && index > foundContainment.children.length) {
        throw newErrorEvent("unknownIndex", "TODO", msg, participation)
    }
    if ((change === "Replace" || change === "Delete") && index > foundContainment.children.length - 1) {
        throw newErrorEvent("unknownIndex", "TODO", msg, participation)
    }
    // Check whether the replaced child is at the given index
    if (expectedChild !== undefined && foundContainment.children[index] !== expectedChild) {
        throw newErrorEvent("indexEntryMismatch", `The child '${expectedChild}' is not at index ${index} `, msg, participation)
    }
    return foundContainment
}

/**
 * Validate whether `parentNode` has a `containment` with a valid `index`, and currently `expectedChild` at `index`
 * @param parentNode    The node in which the containment is to be changed.
 * @param containment   The containment which is to be changed
 * @param index         The index of the child to be changed / added deleted
 * @param expectedChild The current child at `index`
 * @param msg
 * @param participation
 * @returns             The containment of the parent node, or a copy of it
 */
export function validateReference(
    parentNode: LionWebJsonNode,
    reference: LionWebJsonMetaPointer,
    index: number,
    change: Change,
    expectedReference: LionWebJsonReferenceTarget | undefined,
    msg: DeltaCommand,
    participation: ParticipationInfo
): LionWebJsonReference {
    // Check whether containment exists in the parent
    let foundReference = parentNode.references.find(c => isEqualMetaPointer(c.reference, reference))
    if (foundReference === undefined) {
        if (index !== 0) {
            throw newErrorEvent("err-unknownIndex", `Index '${index}' is out of bounds`, msg, participation)
        } else if (change === "Add") {
            // create new containment with one child
            foundReference = {
                reference: reference,
                targets: []
            }
        } else {
            throw newErrorEvent(
                "unknownContainment",
                `Reference '${JSON.stringify(reference)}' does not exists in node '${parentNode.id}'`,
                msg,
                participation
            )
        }
    }
    // Check the index is within bounds
    if (change === "Add" && index > foundReference.targets.length) {
        throw newErrorEvent("unknownIndex", "TODO", msg, participation)
    }
    if ((change === "Replace" || change === "Delete") && index > foundReference.targets.length - 1) {
        throw newErrorEvent("unknownIndex", "TODO", msg, participation)
    }
    // Check whether the replaced child is at the given index
    if (expectedReference !== undefined && foundReference.targets[index] !== expectedReference) {
        throw newErrorEvent("indexEntryMismatch", `The child '${expectedReference}' is not at index ${index} `, msg, participation)
    }
    return foundReference
}

export function findAndValidateNodeExists(
    id: LionWebId,
    nodes: LionWebJsonNode[],
    msg: DeltaCommand,
    participation: ParticipationInfo
): LionWebJsonNode {
    const result = nodes.find(n => n.id = id)
    if (result === undefined) {
        throw newErrorEvent("err-unknownNode", `Node ${id} does not exist`, msg, participation)
    }
    return result
}
