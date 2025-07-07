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
            name: "SubscribeToChangingPartitionsResponse",
            properties: [
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
            name: "SubscribeToPartitionContentsResponse",
            properties: [
                PropertyDef({ name: "contents", type: "LionWebJsonDeltaChunk" }),
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
            name: "UnsubscribeFromPartitionContentsResponse",
            properties: [
                ...IQueryProperties
            ]
        },
        {
            name: "SignOnRequest",
            properties: [
                PropertyDef({ name: "deltaProtocolVersion", type: "JS_string" }),
                ...IQueryProperties
            ]
        },
        {
            name: "SignOnResponse",
            properties: [
                PropertyDef({ name: "participationId", type: "ParticipationId" }),
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
            name: "SignOffResponse",
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
            name: "ListPartitionsResponse",
            properties: [
                PropertyDef({ name: "partitions", type: "LionWebJsonDeltaChunk" }),
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
            name: "GetAvailableIdsResponse",
            properties: [
                PropertyDef({ name: "ids", type: "LionWebId", isList: true}),
                ...IQueryProperties
            ]
        },
        {
            name: "ReconnectRequest",
            properties: [
                PropertyDef({ name: "participationId", type: "JS_string" }),
                PropertyDef({ name: "lastReceivedSequenceNumber", type: "JS_number" }),
                ...IQueryProperties
            ]
        },
        {
            name: "ReconnectResponse",
            properties: [
                PropertyDef({ name: "lastSentSequenceNumber", type: "JS_number" }),
                ...IQueryProperties
            ]
        },
    PrimitiveDef({ name: "QueryKind", primitiveType: "string" }),
    PrimitiveDef({ name: "primitiveBoolean", primitiveType: "boolean" }),
    PrimitiveDef({ name: "primitiveNumber", primitiveType: "number" })
])

