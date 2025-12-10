import { isProperTree } from "@lionweb/server-common"
import { DeltaCommand, LionWebDeltaJsonChunk, LionWebId, LionWebJsonMetaPointer, LionWebJsonNode } from "@lionweb/server-delta-shared"
import { isEqualMetaPointer } from "@lionweb/json"
import { newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { issuesToProtocolNessages } from "./DeltaUtil.js"

/**
 * Validate whether `parentNode` has a `containment` with a valid `index`, and currently `expectedChild` at `index`
 * @param parentNode
 * @param containment
 * @param index
 * @param expectedChild
 * @param msg
 * @param participation
 */
export function validateContainment(parentNode: LionWebJsonNode, containment: LionWebJsonMetaPointer, index: number, expectedChild: LionWebId, msg: DeltaCommand, participation: ParticipationInfo): void {
    // Check whether containment exists in the parent
    const foundContainment = parentNode.containments.find(c => isEqualMetaPointer(c.containment, containment))
    if (foundContainment === undefined) {
        throw newErrorEvent(
            "unknownContainment",
            `Containment '${JSON.stringify(containment)}' does not exists in parent '${parentNode.id}'`,
            msg,
            participation
        )
    }
    // Check the index is within bounds
    if (index > foundContainment.children.length - 1) {
        throw newErrorEvent("unknownIndex", "TODO", msg, participation)
    }
    // Check whether the replaced child is at the given index
    if (expectedChild !== undefined && foundContainment.children[index] !== expectedChild) {
        throw newErrorEvent(
            "indexEntryMismatch",
            `The child '${expectedChild}' is not at index ${index} `,
            msg,
            participation
        )
    }
}

export function validateProperTree(nodes: LionWebDeltaJsonChunk, msg: DeltaCommand, participation: ParticipationInfo): void {
    // - There is exactly one node with parent `parentNode`, called `childNode`
    // - All nodes together form a proper tree with root `childNode`, i.e. no orphans allowed
    //   This can be done through the LionwebReferenceValidator.
    const issues = isProperTree(nodes)
    if (issues.length > 0) {
        throw newErrorEvent("NotATree", `the newChild chunk is not a proper tree`, msg, participation, {
            protocolMessages: issuesToProtocolNessages(issues)
        })
    }
}
