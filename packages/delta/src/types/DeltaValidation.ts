import { JsonContext } from "@lionweb/json-utils"
import { ValidationResult, SyntaxValidator, GenericIssue, expectedTypes } from "@lionweb/validation"
import { commandMap } from "./CommandDefinitions.js"
// import { Event_Definitions_Map } from "./EventDefinitions.js"
import { mapUnion, sharedMap } from "./SharedDefinitions.js"

export type UnknownObjectType = { [key: string]: unknown }

const commandDefinitions = mapUnion(mapUnion(commandMap, sharedMap), expectedTypes)
// const eventDefinitions = mapUnion(Event_Definitions_Map, sharedMap)

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
}
