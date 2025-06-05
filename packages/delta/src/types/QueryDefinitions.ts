import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PropertyDef, PropertyDefinition, ValidationResult, validateKey, PrimitiveDef, ObjectDef } from "@lionweb/validation"
import { NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The property definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

const QueryKindProperty: PropertyDefinition = PropertyDef({
    property: "messageKind",
    expectedType: "QueryKind"
})
const queryIdProperty: PropertyDefinition = PropertyDef({ property: "queryId", expectedType: "string" })

const IQueryProperties = [QueryKindProperty, queryIdProperty, ProtocolMessageProperty]

export const queryMEssageDefinitions: Map<string, TypeDefinition> = new Map<string, TypeDefinition>([
    [
        "SubscribeToChangingPartitionsRequest",
        ObjectDef([
            PropertyDef({ property: "creation", expectedType: "boolean" }),
            PropertyDef({ property: "deletion", expectedType: "boolean" }),
            PropertyDef({ property: "partitions", expectedType: "boolean" }),
            ...IQueryProperties
        ]),
    ],
    [
        "SubscribeToPartitionContentsRequest",
        ObjectDef([
            PropertyDef({ property: "partition", expectedType: "LionWebId" }),
            ...IQueryProperties
        ]),
    ],
    [
        "UnsubscribeFromPartitionContentsRequest",
        ObjectDef([
            PropertyDef({ property: "partition", expectedType: "LionWebId" }),
            ...IQueryProperties
        ]),
    ],
    [
        // TODO check name
        "SignOnRequest",
        ObjectDef([
            PropertyDef({ property: "deltaProtocolVersion", expectedType: "string" }),
            ...IQueryProperties
        ]),
    ],
    [
        "SignOffRequest",
        ObjectDef([
            ...IQueryProperties
        ]),
    ],
    [
        "ListPartitionsRequest",
        ObjectDef([
            ...IQueryProperties
        ]),
    ],
    [
        "GetAvailableIdsRequest",
        ObjectDef([
            PropertyDef({ property: "count", expectedType: "primitiveNumber"}),
            ...IQueryProperties
        ]),
    ],
    [
        "ReconnectRequest",
        ObjectDef([
            PropertyDef({ property: "lastReceivedSequenceNumber", expectedType: "string" }),
            PropertyDef({ property: "participationId", expectedType: "string" }),
            ...IQueryProperties
        ]),
    ],
    ["QueryKind", PrimitiveDef({ primitiveType: "string" })],
    ["boolean", PrimitiveDef({ primitiveType: "boolean" })],
    ["primitiveNumber", PrimitiveDef({ primitiveType: "number" })],
])

