import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PrimitiveDef, PropertyDef, PropertyDefinition, ValidationResult, ObjectDef } from "@lionweb/validation"
import { MAY_BE_NULL, NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const CommandKindProperty: PropertyDefinition = PropertyDef({
    property: "messageKind",
    expectedType: "CommandKind",
    mayBeNull: NOT_NULL,
    validate: emptyValidation,
    isKey: true
})
const CommandIdProperty: PropertyDefinition = PropertyDef({ property: "commandId", expectedType: "string" })

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

export const commandMap: Map<string, TypeDefinition> = new Map<string, TypeDefinition>([
    ["AddPartition", ObjectDef([PropertyDef({ property: "newPartition", expectedType: "LionWebJsonDeltaChunk" }), ...ICommandProperties])],
    ["DeletePartition", ObjectDef([PropertyDef({ property: "deletedPartition", expectedType: "LionWebId" }), ...ICommandProperties])],
    [
        "ChangeClassifier",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "newClassifier", expectedType: "LionWebJsonMetaPointer" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "AddProperty",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteProperty",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "ChangeProperty",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "AddChild",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteChild",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "ReplaceChild",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveChildFromOtherContainment",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveChildFromOtherContainmentInSameParent",
        ObjectDef([
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveChildInSameContainment",
        ObjectDef([
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceChildFromOtherContainment",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceChildFromOtherContainmentInSameParent",
        ObjectDef([
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceChildInSameContainment",
        ObjectDef([
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "AddAnnotation",
        ObjectDef([
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteAnnotation",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties
        ], "ICommand"),
    ],
    [
        "ReplaceAnnotation",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAnnotationFromOtherParent",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAnnotationInSameParent",
        ObjectDef([
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceAnnotationFromOtherParent",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceAnnotationInSameParent",
        ObjectDef([
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            ...ICommandProperties,
        ],)
    ],
    [
        "AddReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "ChangeReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveEntryFromOtherReference",
        ObjectDef([
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveEntryFromOtherReferenceInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveEntryInSameReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceEntryFromOtherReference",
        ObjectDef([
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceEntryFromOtherReferenceInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "MoveAndReplaceEntryInSameReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "AddReferenceResolveInfo",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteReferenceResolveInfo",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "ChangeReferenceResolveInfo",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "AddReferenceTarget",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "DeleteReferenceTarget",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    [
        "ChangeReferenceTarget",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            ...ICommandProperties,
        ],
            "ICommand"),
    ],
    [
        "ICommand",
        ObjectDef([
            ...ICommandProperties,
        ]),
    ],
    [
        "CompositeCommand",
        ObjectDef([
            PropertyDef({ property: "parts", expectedType: "ICommand", isList: true }),
            ...ICommandProperties,
        ], "ICommand"),
    ],
    ["CommandKind", PrimitiveDef({ primitiveType: "string", isKey: true })]
    // ["string", PrimitiveDef({ primitiveType: "string" })],
])

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
