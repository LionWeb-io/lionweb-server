
import { LionWebJsonNode } from "@lionweb/json"
import { KeyValuePair } from "@lionweb/server-delta-shared"
import { LionWebValidator } from "@lionweb/validation"
import { deltaLogger } from "../apiutil/index.js"

const validator = new LionWebValidator({}, null)

export function isLionWebJsonNode(o: unknown): o is LionWebJsonNode {
    validator.object = o
    validator.validationResult.reset()
    validator.syntaxValidator.validate(o, "LionWebJsonNode")
    validator.validationResult.issues.forEach(issue => {
        deltaLogger.info(`guard issue: ${issue.errorMsg()}`)
    })
    return !validator.validationResult.hasErrors()
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
