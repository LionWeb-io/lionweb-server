import { JsonContext } from "@lionweb/json-utils"
import { ValidationResult, SyntaxValidator, GenericIssue, LionWebSchema, DefinitionSchema } from "@lionweb/validation"
import { DeltaCommandSchema } from "./CommandDefinitions.js"
import { DeltaEventSchema } from "./EventDefinitions.js"
import { DeltaQuerySchema } from "./QueryDefinitions.js"
import { DeltaSharedSchema } from "./SharedDefinitions.js"

export type UnknownObjectType = { [key: string]: unknown }

const commandDefinitions = DefinitionSchema.join(DeltaCommandSchema, DeltaSharedSchema, LionWebSchema, DeltaEventSchema, DeltaQuerySchema)

export class DeltaValidation extends SyntaxValidator {
    constructor(validationResult: ValidationResult) {
        super(validationResult, commandDefinitions)
    }

    validateCommand(object: UnknownObjectType) {
        const kind = object.messageKind
        if (kind === undefined) {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `Command kind is undefined`))
            console.error("Command kind is undefined")
            return
        } else if (typeof kind !== "string") {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `Command kind should be a string, but is a '${kind}'`))
            console.error(`Command kind should be a string, but is a '${kind}'`)
            return
        }
        // Everything ok
        this.validate(object, kind)
    }
    validateEvent(object: UnknownObjectType) {
        const kind = object.messageKind
        if (kind === undefined) {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `Event kind is undefined`))
            console.error("Event kind is undefined")
            return
        } else if (typeof kind !== "string") {
            this.validationResult.issue(new GenericIssue(new JsonContext(null, ["$"] ), `Event kind should be a string, but is a '${kind}'`))
            console.error(`Event kind should be a string, but is a '${kind}'`)
            return
        }
        // Everything ok
        this.validate(object, kind)
    }
}
