import { JsonContext } from "@lionweb/json-utils"
import {
    ValidationResult,
    SyntaxValidator,
    GenericIssue,
    SyntaxDefinition,
    CommandDefinitions,
    EventDefinitions,
    ChunksDefinitions,
    DeltaTypesDefinitions,
    RequestDefinitions,
    ResponseDefinitions,
    validateSerializationFormatVersion,
    validateVersion,
    validateKey,
    validateId
} from "@lionweb/validation"

export type UnknownObjectType = { [key: string]: unknown }

const definitions = new SyntaxDefinition([CommandDefinitions, ResponseDefinitions, RequestDefinitions, EventDefinitions], [ChunksDefinitions, DeltaTypesDefinitions])
definitions.addValidator("LionWebId", validateId ),
    definitions.addValidator("LionWebKey", validateKey ),
    definitions.addValidator("LionWebVersion",validateVersion),
    definitions.addValidator("LionWebSerializationFormatVersion", validateSerializationFormatVersion)

export class DeltaValidator extends SyntaxValidator {
    constructor(validationResult: ValidationResult) {
        super(validationResult, definitions)
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
