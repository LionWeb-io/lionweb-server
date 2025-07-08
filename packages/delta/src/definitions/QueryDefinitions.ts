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
// @tslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

const QueryKindProperty: PropertyDefinition = PropertyDef({
    name: "messageKind",
    type: "QueryType"
})
const queryIdProperty: PropertyDefinition = PropertyDef({ name: "queryId", type: "JS_string" })

const IQueryProperties = [QueryKindProperty, queryIdProperty, ProtocolMessageProperty]

export const DeltaQuerySchema: DefinitionSchema = new DefinitionSchema(
    [
        {
            name: "SubscribeToChangingPartitionsRequest",
            properties: [
                PropertyDef({ name: "creation", type: "primitiveBoolean" }),
                PropertyDef({ name: "deletion", type: "primitiveBoolean" }),
                PropertyDef({ name: "partitions", type: "primitiveBoolean" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SubscribeToChangingPartitionsResponse",
            properties: [
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SubscribeToPartitionContentsRequest",
            properties: [
                PropertyDef({ name: "partition", type: "LionWebId" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SubscribeToPartitionContentsResponse",
            properties: [
                PropertyDef({ name: "contents", type: "LionWebJsonDeltaChunk" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "UnsubscribeFromPartitionContentsRequest",
            properties: [
                PropertyDef({ name: "partition", type: "LionWebId" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "UnsubscribeFromPartitionContentsResponse",
            properties: [
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SignOnRequest",
            properties: [
                PropertyDef({ name: "deltaProtocolVersion", type: "JS_string" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SignOnResponse",
            properties: [
                PropertyDef({ name: "participationId", type: "ParticipationId" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SignOffRequest",
            properties: [
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "SignOffResponse",
            properties: [
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "ListPartitionsRequest",
            properties: [
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "ListPartitionsResponse",
            properties: [
                PropertyDef({ name: "partitions", type: "LionWebJsonDeltaChunk" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "GetAvailableIdsRequest",
            properties: [
                PropertyDef({ name: "count", type: "primitiveNumber"}),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "GetAvailableIdsResponse",
            properties: [
                PropertyDef({ name: "ids", type: "LionWebId", isList: true}),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "ReconnectRequest",
            properties: [
                PropertyDef({ name: "participationId", type: "JS_string" }),
                PropertyDef({ name: "lastReceivedSequenceNumber", type: "JS_number" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
        {
            name: "ReconnectResponse",
            properties: [
                PropertyDef({ name: "lastSentSequenceNumber", type: "JS_number" }),
                ...IQueryProperties
            ],
            taggedUnionType: "QueryType"
        },
            PrimitiveDef({ name: "QueryType", primitiveType: "string" }),
            PrimitiveDef({ name: "primitiveBoolean", primitiveType: "boolean" }),
            PrimitiveDef({ name: "primitiveNumber", primitiveType: "number" })
        ],
        {
            unionType: "Query",
            unionDiscriminator: "QueryType",
            unionProperty: "messageKind"
        }
)

