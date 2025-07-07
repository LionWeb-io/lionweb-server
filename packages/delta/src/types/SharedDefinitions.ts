import { JsonContext } from "@lionweb/json-utils"
import { PropertyDef, PropertyDefinition, ValidationResult, validateKey, PrimitiveDef, DefinitionSchema } from "@lionweb/validation"

export const MAY_BE_NULL = true
export const NOT_NULL = false

export const ProtocolMessageProperty: PropertyDefinition = PropertyDef({
    name: "protocolMessages",
    type: "ProtocolMessage",
    mayBeNull: MAY_BE_NULL,
    isList: true,
    isOptional: true
})

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The name definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {
}

export const DeltaSharedSchema: DefinitionSchema = new DefinitionSchema([], [
    {
        name: "LionWebJsonDeltaChunk",
        properties: [
            PropertyDef({ name: "nodes", type: "LionWebJsonNode", isList: true })
        ]
    },
    {
        name: "ProtocolMessage",
        properties: [
            PropertyDef({ name: "kind", type: "JS_string", validate: validateKey }),
            PropertyDef({ name: "message", type: "JS_string" }),
            PropertyDef({ name: "data", type: "KeyValuePair", isList: true })
        ]
    },
    {
        name: "KeyValuePair",
        properties: [
            PropertyDef({ name: "key", type: "JS_string", validate: validateKey }),
            PropertyDef({ name: "value", type: "JS_string" })
        ]
    },
    // JavaScript primitive types
    PrimitiveDef({ name: "JS_number", primitiveType: "number" }),
    PrimitiveDef({ name: "JS_string", primitiveType: "string" })
])

