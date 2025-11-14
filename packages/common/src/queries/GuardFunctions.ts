
import { LionWebJsonNode } from "@lionweb/json"
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
