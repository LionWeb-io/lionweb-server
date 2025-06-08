import { JsonContext } from "@lionweb/json-utils"
import { PrimitiveDef, PropertyDef, PropertyDefinition, DefinitionSchema, ValidationResult } from "@lionweb/validation"
import { MAY_BE_NULL, NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const CommandKindProperty: PropertyDefinition = PropertyDef({
    name: "messageKind",
    type: "CommandKind",
    mayBeNull: NOT_NULL,
    validate: emptyValidation,
})
const CommandIdProperty: PropertyDefinition = PropertyDef({ name: "commandId", type: "JS_string" })

const ICommandProperties = [CommandKindProperty, CommandIdProperty, ProtocolMessageProperty]

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
            unionType: "ICommand",
            unionDiscriminator: "CommandKind",
            unionProperty: "messageKind",
        },
    ],
    [
        {
            name: "AddPartition",
            properties: [PropertyDef({ name: "newPartition", type: "LionWebJsonDeltaChunk" }), ...ICommandProperties],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeletePartition",
            properties: [PropertyDef({ name: "deletedPartition", type: "LionWebId" }), ...ICommandProperties],
            taggedUnionType: "ICommand",
        },
        {
            name: "ChangeClassifier",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "newClassifier", type: "LionWebJsonMetaPointer" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ChangeProperty",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ReplaceChild",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveChildFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveChildFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveChildInSameContainment",
            properties: [
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceChildFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceChildFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceChildInSameContainment",
            properties: [
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddAnnotation",
            properties: [
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteAnnotation",
            properties: [PropertyDef({ name: "parent", type: "LionWebId" }), PropertyDef({ name: "index", type: "numberString" }), ...ICommandProperties],
            taggedUnionType: "ICommand",
        },
        {
            name: "ReplaceAnnotation",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAnnotationFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAnnotationInSameParent",
            properties: [
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceAnnotationFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceAnnotationInSameParent",
            properties: [
                PropertyDef({ name: "newIndex", type: "numberString" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ChangeReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveEntryFromOtherReference",
            properties: [
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveEntryFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveEntryInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceEntryFromOtherReference",
            properties: [
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceEntryFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "MoveAndReplaceEntryInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "numberString" }),
                PropertyDef({ name: "newIndex", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ChangeReferenceResolveInfo",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "AddReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "DeleteReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ChangeReferenceTarget",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "numberString" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                ...ICommandProperties,
            ],
            taggedUnionType: "ICommand",
        },
        {
            name: "ICommand",
            properties: [...ICommandProperties],
        },
        {
            name: "CompositeCommand",
            properties: [PropertyDef({ name: "parts", type: "ICommand", isList: true }), ...ICommandProperties],
            taggedUnionType: "ICommand",
        },
        PrimitiveDef({ name: "CommandKind", primitiveType: "string" }),
        // ["string", PrimitiveDef({ primitiveType: "string" })],
    ],
)

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
