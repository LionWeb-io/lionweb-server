import { JsonContext } from "@lionweb/json-utils"
import { PrimitiveDef, PropertyDef, PropertyDefinition, DefinitionSchema, ValidationResult } from "@lionweb/validation"
import { MAY_BE_NULL, NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const CommandTypeProperty: PropertyDefinition = PropertyDef({
    name: "messageKind",
    type: "CommandType",
    mayBeNull: NOT_NULL,
    validate: emptyValidation,
})
const CommandIdProperty: PropertyDefinition = PropertyDef({ name: "commandId", type: "JS_string" })

const CommonCommandProperties = [CommandTypeProperty, CommandIdProperty, ProtocolMessageProperty]

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The property definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

export const DeltaCommandSchema: DefinitionSchema = new DefinitionSchema(
    [
        {
            unionType: "Command",
            unionDiscriminator: "CommandType",
            unionProperty: "messageKind",
        },
    ],
    [
        {
            name: "CommandResponse",
            properties: [
                ...CommonCommandProperties
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddPartition",
            properties: [
                PropertyDef({ name: "newPartition", type: "LionWebJsonDeltaChunk" }),
                ...CommonCommandProperties
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeletePartition",
            properties: [
                PropertyDef({ name: "deletedPartition", type: "LionWebId" }),
                ...CommonCommandProperties
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ChangeClassifier",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "newClassifier", type: "LionWebJsonMetaPointer" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ChangeProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedChild", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ReplaceChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveChildFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveChildFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveChildInSameContainment",
            properties: [
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceChildFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceChildFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceChildInSameContainment",
            properties: [
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddAnnotation",
            properties: [
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteAnnotation",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }), 
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ReplaceAnnotation",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAnnotationFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAnnotationInSameParent",
            properties: [
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceAnnotationFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceAnnotationInSameParent",
            properties: [
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ChangeReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveEntryFromOtherReference",
            properties: [
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveEntryFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveEntryInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceEntryFromOtherReference",
            properties: [
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceEntryFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "MoveAndReplaceEntryInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", isOptional: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", isOptional: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId" }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string" }),
                PropertyDef({ name: "target", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ChangeReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string" }),
                PropertyDef({ name: "oldResolveInfo", type: "JS_string" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "AddReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "resolveInfo", type: "JS_string" }),
                PropertyDef({ name: "newTarget", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "DeleteReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "resolveInfo", type: "JS_string" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId" }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "ChangeReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "resolveInfo", type: "JS_string" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                ...CommonCommandProperties,
            ],
            taggedUnionType: "CommandType",
        },
        {
            name: "CompositeCommand",
            properties: [
                PropertyDef({ name: "parts", type: "CommandType", isList: true }),
                ...CommonCommandProperties
            ],
            taggedUnionType: "CommandType",
        },
        PrimitiveDef({ name: "CommandType", primitiveType: "string" }),
        // ["string", PrimitiveDef({ primitiveType: "string" })],
    ],
)

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
