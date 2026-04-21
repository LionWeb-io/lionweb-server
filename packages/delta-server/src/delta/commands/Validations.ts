import { isProperTree } from "@lionweb/server-common"
import {
    ChangeReferenceCommand,
    DeleteReferenceCommand,
    DeltaCommand,
    LionWebDeltaJsonChunk,
    LionWebId,
    LionWebJsonContainment,
    LionWebJsonMetaPointer,
    LionWebJsonReference,
    LionWebJsonReferenceTarget
} from "@lionweb/server-delta-shared"
import { isEqualMetaPointer, isEqualReferenceTarget, LionWebJsonNode } from "@lionweb/json"
import { newErrorDelta } from "../events.js"
import { Participation } from "../participation/index.js"
import { issuesToProtocolMessages } from "./DeltaUtil.js"

export type Change = "Add" | "Replace" | "Delete"

/**
 * 
 * @param nodes
 * @param parent
 * @param msg
 * @param participation
 * @returns             The parent of the root node of the tree built from `nodes`
 */
export function validateProperTree(nodes: LionWebDeltaJsonChunk, parent: LionWebId | null, msg: DeltaCommand, participation: Participation): LionWebJsonNode | undefined {
    // - There is exactly one node with parent `parentNode`, called `rootNode`
    // - All nodes together form a proper tree with root `rootNode`, i.e. no orphans allowed
    //   This can be done through the LionwebReferenceValidator.
    const issues = isProperTree(nodes)
    if (issues.length > 0) {
        throw newErrorDelta("chunkIsNotATree", `the newChild chunk is not a proper tree`, msg, participation, {
            additionalInfos: issuesToProtocolMessages(issues)
        })
    }
    const rootNode = nodes.nodes.find(node => node.parent === parent )
    if (rootNode === undefined) {
        // TODO this check can be moved to the ReferenceValidator by giving the `parent` as parameter
        throw newErrorDelta("childNotFound", `The newChild chunk does not contain a node with parent ${parent}`, msg, participation)
    }
    return rootNode!
}

/**
 * Validate whether `parentNode` has a `containment` with a valid `index`, and currently `expectedChild` at `index`
 * @param parentNode    The node in which the containment is to be changed.
 * @param containment   The containment which is to be changed
 * @param index         The index of the child to be changed / added deleted
 * @param expectedChild The current child at `index`
 * @param msg
 * @param participation
 * @throws              ErrorEvent
 * @throws              ErrorResponse
 * @returns             The containment of the parent node, or a copy of it 
 */
export function validateContainment(
    parentNode: LionWebJsonNode,
    containment: LionWebJsonMetaPointer,
    index: number,
    change: Change,
    expectedChild: LionWebId | undefined,
    msg: DeltaCommand,
    participation: Participation
): LionWebJsonContainment {
    // Check whether containment exists in the parent
    let foundContainment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, containment))
    if (foundContainment === undefined) {
        if (index !== 0) {
            throw newErrorDelta("unknownIndex", `Index '${index}' is out of bounds`, msg, participation)
        } else if (change === "Add") {
            // create new containment with one child
            foundContainment = {
                containment: containment,
                children: []
            }
        } else {
            throw newErrorDelta(
                "unknownContainment",
                `Containment '${JSON.stringify(containment)}' does not exists in parent '${parentNode.id}'`,
                msg,
                participation
            )
        }
    }
    // Check the index is within bounds
    if (change === "Add" && index > foundContainment.children.length) {
        throw newErrorDelta("unknownIndex", "TODO", msg, participation)
    }
    if ((change === "Replace" || change === "Delete") && index > foundContainment.children.length - 1) {
        throw newErrorDelta("unknownIndex", "TODO", msg, participation)
    }
    // Check whether the replaced child is at the given index
    if (expectedChild !== undefined && foundContainment.children[index] !== expectedChild) {
        throw newErrorDelta("indexEntryMismatch", `The child '${expectedChild}' is not at index ${index} `, msg, participation)
    }
    return foundContainment
}

/**
 * Validate whether `parentNode` has a `containment` with a valid `index`, and currently `expectedReference` at `index`
 * @param parentNode    The node in which the containment is to be changed.
 * @param reference     The containment which is to be changed
 * @param index         The index of the child to be changed / added deleted
 * @param expectedReference The current reference at `index`
 * @param msg
 * @param participation
 * @throws              ErrorEvent
 * @throws              ErrorResponse
 * @returns             The reference of the parent node, or a copy of it
 */
export function validateReference(
    parentNode: LionWebJsonNode,
    reference: LionWebJsonMetaPointer,
    index: number,
    expectedReference: LionWebJsonReferenceTarget | undefined,
    msg: DeltaCommand,
    participation: Participation
): LionWebJsonReference {
    // Check whether reference exists in the parent
    let foundReference = parentNode.references.find(c => isEqualMetaPointer(c.reference, reference))
    if (foundReference === undefined) {
        if (index !== 0) {
            // New containment, so index must be zero
            throw newErrorDelta("unknownIndex", `Reference ${JSON.stringify(reference)} undefined in node ${parentNode.id}: index '${index}' is out of bounds`, msg, participation)
        } else if (msg.messageKind === "AddReference") {
            // create new containment with one reference
            foundReference = {
                reference: reference,
                targets: []
            }
        } else {
            // Change or Delete incorrect if the reference does not exist
            throw newErrorDelta(
                "unknownReference",
                `Reference '${JSON.stringify(reference)}' does not exists in node '${parentNode.id}'`,
                msg,
                participation,
                {additionalInfos: [{
                    kind: msg.messageKind,
                        message: "",
                        data: []
                }]}
            )
        }
    }
    // Check the index is within bounds
    if (msg.messageKind === "AddReference" && index > foundReference.targets.length) {
        throw newErrorDelta("unknownIndex", "TODO", msg, participation)
    }
    if (msg.messageKind === "ChangeReference" || msg.messageKind === "DeleteReference") { 
        if (index > foundReference.targets.length - 1) {
            throw newErrorDelta("unknownIndex", "TODO", msg, participation)
        } else {
            if (msg.messageKind === "ChangeReference") {
                const change = msg as ChangeReferenceCommand
                if (
                    change.oldTarget !== foundReference.targets[change.index].reference ||
                    change.oldResolveInfo !== foundReference.targets[change.index].resolveInfo
                ) {
                    throw newErrorDelta(
                        "referenceTargetOrResolveInfoMismatch",
                        "reference not equal to expected values",
                        msg,
                        participation
                    )
                }
            }
            if (msg.messageKind === "DeleteReference") {
                const change = msg as DeleteReferenceCommand
                if (
                    change.deletedTarget !== foundReference.targets[change.index].reference ||
                    change.deletedResolveInfo !== foundReference.targets[change.index].resolveInfo
                ) {
                    throw newErrorDelta(
                        "referenceTargetOrResolveInfoMismatch",
                        `reference not equal to expected values [${foundReference.targets[change.index].resolveInfo}, ${
                            foundReference.targets[change.index].reference
                        }]`,
                        msg,
                        participation
                    )
                }
            }
        }
    }
    // Check whether the replaced child is at the given index
    if (expectedReference !== undefined && !isEqualReferenceTarget(foundReference.targets[index], expectedReference)) {
        throw newErrorDelta(
            "indexEntryMismatch",
            `The reference '${expectedReference.reference}, ${expectedReference.resolveInfo}' is not at index ${index} `,
            msg,
            participation
        )
    }
    return foundReference
}

/**
 * Find node with nodeid `id` in `nodes`.
 * Throw an ErrorEvent or ErrorResponse if the node does not exists in `nodes`.
 * @param id        The node to be found
 * @param nodes     The collection to search
 * @param msg       The message for the potential ErrorEvent or ErrorResponse
 * @param participation The participation for which this is done.
 * @throws              ErrorEvent
 * @throws              ErrorResponse
 */
export function findAndValidateNodeExists(
    id: LionWebId,
    nodes: LionWebJsonNode[],
    msg: DeltaCommand,
    participation: Participation
): LionWebJsonNode {
    const result = nodes.find(n => n.id === id)
    if (result === undefined) {
        throw newErrorDelta("unknownNode", `Node ${id} does not exist`, msg, participation)
    }
    return result
}
