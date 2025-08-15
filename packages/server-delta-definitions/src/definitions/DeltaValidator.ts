import { JsonContext } from "@lionweb/json-utils"
import { ValidationResult, SyntaxValidator, GenericIssue, LionWebSchema, DefinitionSchema } from "@lionweb/validation"
import { DeltaCommandSchema } from "./CommandDefinitions.js"
import { DeltaEventSchema } from "./EventDefinitions.js"
import { DeltaQuerySchema } from "./QueryDefinitions.js"
import { DeltaSharedSchema } from "./SharedDefinitions.js"

export type UnknownObjectType = { [key: string]: unknown }

const alldefinitionSchema = new DefinitionSchema([
    ...DeltaCommandSchema.definitions(),
    ...DeltaSharedSchema.definitions(),
    ...DeltaQuerySchema.definitions(),
    ...DeltaEventSchema.definitions(),
    ...LionWebSchema.definitions()])


export class DeltaValidator extends SyntaxValidator {
    constructor(validationResult: ValidationResult) {
        super(validationResult, alldefinitionSchema)
    }

    validateDelta(object: UnknownObjectType) {
        const kind = object.messageKind
        if (kind === undefined) {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `'messageKind' is undefined, should have a value`))
            console.error("'messageKind' is undefined")
            return
        } else if (typeof kind !== "string") {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `'messageKind' should be a string, but is a '${kind}'`))
            console.error(`'messageKind' should be a string, but is a '${kind}'`)
            return
        }
        // Everything ok
        this.validate(object, kind)
    }
}
