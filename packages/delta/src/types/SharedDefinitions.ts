import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PropertyDef, PropertyDefinition, ValidationResult, validateKey } from "@lionweb/validation"

export const MAY_BE_NULL = true
export const NOT_NULL = false

export const ProtocolMessageProperty: PropertyDefinition = PropertyDef({
    property: "protocolMessage",
    expectedType: "ProtocolMessage",
    mayBeNull: MAY_BE_NULL,
    isList: true,
    isOptional: true,
})

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The property definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

export const sharedMap: Map<string, TypeDefinition> = new Map<string, TypeDefinition>([
    [
        "LionWebJsonDeltaChunk",
        [
            PropertyDef({ property: "nodes", expectedType: "LionWebJsonNode", isList: true }),
        ],
    ],
    [
        "ProtocolMessage",
        [
            PropertyDef({ property: "kind", expectedType: "string", validate: validateKey }),
            PropertyDef({ property: "message", expectedType: "string" }),
            PropertyDef({ property: "data", expectedType: "KeyValuePair", isList: true }),
        ],
    ],
    [
        "KeyValuePair",
        [
            PropertyDef({ property: "key", expectedType: "string", validate: validateKey }),
            PropertyDef({ property: "value", expectedType: "string" }),
        ],
    ],
])

/**
 * Return a new Map which is the union of `map1` and `map2`
 */
export function mapUnion(map1: Map<string, TypeDefinition>, map2: Map<string, TypeDefinition>) {
    return new Map([...map1, ...map2])
}

