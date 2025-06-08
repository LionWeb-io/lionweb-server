import { JsonContext } from "@lionweb/json-utils"
import { PropertyDef, PropertyDefinition, ValidationResult, PrimitiveDef, DefinitionSchema } from "@lionweb/validation"
import { ProtocolMessageProperty } from "./SharedDefinitions.js"

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
    name: "messageKind",
    type: "QueryKind"
})
const queryIdProperty: PropertyDefinition = PropertyDef({ name: "queryId", type: "JS_string" })

const IQueryProperties = [QueryKindProperty, queryIdProperty, ProtocolMessageProperty]

export const DeltaQuerySchema: DefinitionSchema = new DefinitionSchema(
    [
        {
            unionType: "",
            unionDiscriminator: "QueryKind",
            unionProperty: "messageKind"
        }    
    ],
    [
    {
        name: "SubscribeToChangingPartitionsRequest",
        properties: [
            PropertyDef({ name: "creation", type: "primitiveBoolean" }),
            PropertyDef({ name: "deletion", type: "primitiveBoolean" }),
            PropertyDef({ name: "partitions", type: "primitiveBoolean" }),
            ...IQueryProperties
        ]
    },
    {
        name: "SubscribeToPartitionContentsRequest",
        properties: [
            PropertyDef({ name: "partition", type: "LionWebId" }),
            ...IQueryProperties
        ]
    },
    {
        name: "UnsubscribeFromPartitionContentsRequest",
        properties: [
            PropertyDef({ name: "partition", type: "LionWebId" }),
            ...IQueryProperties
        ]
    },
    {
        // TODO check name
        name: "SignOnRequest",
        properties: [
            PropertyDef({ name: "deltaProtocolVersion", type: "JS_string" }),
            ...IQueryProperties
        ]
    },
    {
        name: "SignOffRequest",
        properties: [
            ...IQueryProperties
        ]
    },
    {
        name: "ListPartitionsRequest",
        properties: [
            ...IQueryProperties
        ]
    },
    {
        name: "GetAvailableIdsRequest",
        properties: [
            PropertyDef({ name: "count", type: "primitiveNumber"}),
            ...IQueryProperties
        ]
    },
    {
        name: "ReconnectRequest",
        properties: [
            PropertyDef({ name: "lastReceivedSequenceNumber", type: "JS_string" }),
            PropertyDef({ name: "participationId", type: "JS_string" }),
            ...IQueryProperties
        ]
    },
    PrimitiveDef({ name: "QueryKind", primitiveType: "string" }),
    PrimitiveDef({ name: "primitiveBoolean", primitiveType: "boolean" }),
    PrimitiveDef({ name: "primitiveNumber", primitiveType: "number" })
])

