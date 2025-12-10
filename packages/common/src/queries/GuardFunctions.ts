
import { LionWebJsonChunk, LionWebJsonNode } from "@lionweb/json"
import { LionWebJsonChunkWrapper } from "@lionweb/json-utils"
import { KeyValuePair, LionWebDeltaJsonChunk } from "@lionweb/server-delta-shared"
import { LionWebValidator, ValidationIssue } from "@lionweb/validation"
import { deltaLogger } from "../apiutil/index.js"

let validator = new LionWebValidator({}, null)

export function isLionWebJsonNode(o: unknown): o is LionWebJsonNode {
    validator = new LionWebValidator({}, null)
    validator.object = o
    validator.validationResult.reset()
    validator.syntaxValidator.validate(o, "LionWebJsonNode")
    validator.validationResult.issues.forEach(issue => {
        deltaLogger.info(`guard issue: ${issue.errorMsg()}`)
    })
    return !validator.validationResult.hasErrors()
}

export function isProperTree(deltaChunk: LionWebDeltaJsonChunk): ValidationIssue[] {
    validator = new LionWebValidator({}, null)
    // Create a full LionWebChunk for the validator
    const chunk: LionWebJsonChunk = {
        serializationFormatVersion: "2023.1",
        languages: [],
        nodes: deltaChunk.nodes
    } 
    validator.referenceValidator.mustBeProperTree = true
    validator.referenceValidator.validate(new LionWebJsonChunkWrapper(chunk))
    const issues = validator.validationResult.issues.filter(issue => issue.issueType !== "LanguageUnknown")
    return issues
}

export interface InternalQueryError extends Error {
    name: "InternalQueryError"
    data: KeyValuePair[]
}

export function isInternalQueryError(o: unknown): o is InternalQueryError {
    return (o as InternalQueryError)?.name !== "InternalQueryError"
}

export function InternalQueryError(msg: string, data?: KeyValuePair[]): InternalQueryError {
    const result = new Error(msg) as InternalQueryError
    result.name = "InternalQueryError"
    result.data = data ?? []
    return result
}
