import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PrimitiveDef, PropertyDef, PropertyDefinition, ValidationResult } from "@lionweb/validation"
import { MAY_BE_NULL, NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const CommandKindProperty: PropertyDefinition = PropertyDef({ property: "messageKind", expectedType: "CommandKind", mayBeNull: NOT_NULL, validate: emptyValidation })

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
    [
        "AddPartition",
        [
            PropertyDef({ property: "newPartition", expectedType: "LionWebJsonDeltaChunk" }),
            CommandKindProperty,
            ProtocolMessageProperty
        ]
    ],
    [
        "DeletePartition",
        [
            PropertyDef({ property: "deletedPartition", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty
        ]]
    ,
    [
        "ChangeClassifier",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "newClassifier", expectedType: "LionWebJsonMetaPointer" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddProperty",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId"}),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteProperty",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChangeProperty",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddChild",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteChild",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReplaceChild",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveChildFromOtherContainment",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveChildFromOtherContainmentInSameParent",
        [
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveChildInSameContainment",
        [
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceChildFromOtherContainment",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceChildFromOtherContainmentInSameParent",
        [
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceChildInSameContainment",
        [
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddAnnotation",
        [
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteAnnotation",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReplaceAnnotation",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAnnotationFromOtherParent",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAnnotationInSameParent",
        [
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceAnnotationFromOtherParent",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceAnnotationInSameParent",
        [
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChangeReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveEntryFromOtherReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveEntryFromOtherReferenceInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveEntryInSameReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceEntryFromOtherReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceEntryFromOtherReferenceInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "MoveAndReplaceEntryInSameReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddReferenceResolveInfo",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteReferenceResolveInfo",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChangeReferenceResolveInfo",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AddReferenceTarget",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "DeleteReferenceTarget",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChangeReferenceTarget",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "CompositeCommand",
        [
            PropertyDef({ property: "parts", expectedType: "ICommand" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            CommandKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    ["CommandKind", PrimitiveDef({ primitiveType: "string" })],
    // ["string", PrimitiveDef({ primitiveType: "string" })],
])

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
