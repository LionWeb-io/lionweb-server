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
    validateId,
    AdminTypesDefinitions,
    AdminRequestDefinitions,
    AdminResponseDefinitions,
    MonitorDefinitions
} from "@lionweb/validation"

export type UnknownObjectType = { [key: string]: unknown }

/**
 * All the validator definitions used by the delta protocol.
 */
const definitions = new SyntaxDefinition(
    [CommandDefinitions, ResponseDefinitions, RequestDefinitions, EventDefinitions, AdminRequestDefinitions, AdminResponseDefinitions, MonitorDefinitions], 
    [ChunksDefinitions, DeltaTypesDefinitions, AdminTypesDefinitions]
)
/**
 * Add TypeScript validators for primitive types
 */
definitions.addValidator("LionWebId", validateId )
definitions.addValidator("LionWebKey", validateKey )
definitions.addValidator("LionWebVersion",validateVersion)
definitions.addValidator("LionWebSerializationFormatVersion", validateSerializationFormatVersion)

/**
 * Validator for validating all delta messages.
 */
export class DeltaValidator extends SyntaxValidator {
    constructor(validationResult: ValidationResult) {
        super(validationResult, definitions)
    }

    /**
     * Validate `object` against delta message definitions.
     * Validation errors are stored in `this.validationResult`.
     * When reisung the validator for a new message, call `this.validationResult.reset()` to clear previouis error messages.
     * 
     * @param object The message to validate
     */
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
