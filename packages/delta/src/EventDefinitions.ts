import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PrimitiveDef, PropertyDef, PropertyDefinition, ValidationResult, expectedTypes } from "@lionweb/validation"

// Make boolean argument more readable.
export const MAY_BE_NULL = true
export const NOT_NULL = false

const EventKindProperty: PropertyDefinition = PropertyDef({ property: "kind", expectedType: "EventKind", mayBeNull: NOT_NULL, validate: emptyValidation })
const CommandOriginProperty: PropertyDefinition = PropertyDef({ property: "originCommands", expectedType: "CommandSource", isList: true, mayBeNull: NOT_NULL, validate: emptyValidation })
const SequenceNumberProperty: PropertyDefinition = PropertyDef({ property: "sequenceNumber", expectedType: "SequenceNumber", mayBeNull: NOT_NULL, validate: emptyValidation })
const ProtocolMessageProperty: PropertyDefinition = PropertyDef({
    property: "protocolMessage",
    expectedType: "ResponseMessage",
    mayBeNull: MAY_BE_NULL,
    isOptional: true,
})
// const ResponseMessage: PropertyDefinition = { property: "protocolMessage", expectedType: "ResponseMessage", mayBeNull: MAY_BE_NULL }

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The property definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

export const Event_Definitions_Map: Map<string, TypeDefinition> = new Map<string, TypeDefinition>([
    [
        "LionWebJsonDeltaChunk",
        [
            PropertyDef({ property: "nodes", expectedType: "LionWebJsonNode", isList: true }),
        ],
    ],
    [
        "CommandSource",
        [
            PropertyDef({ property: "participationId", expectedType: "ParticipationId", isList: true }),
            PropertyDef({ property: "commandId", expectedType: "CommandId", isList: true }),
        ],
    ],
    [
        "SequenceNumber",  PrimitiveDef({ primitiveType: "string" })
    ],
    [
        "CommandId",  PrimitiveDef({ primitiveType: "string" })
    ],
    [
        "ParticipationId",  PrimitiveDef({ primitiveType: "string" })
    ],

    // Commands
    ["PartitionAdded", 
        [
            // TODO Check type
            PropertyDef({ property: "newPartition", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    ["PartitionDeleted",
        [
            // TODO Check type
            PropertyDef({ property: "deletedPartition", expectedType: "LionWebId" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty
        ]
    ],
    [
        "ClassifierEntryMovedAndReplacedFromOtherReferenceChanged",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "newClassifier", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldClassifier", expectedType: "LionWebJsonMetaPointer" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "PropertyAdded",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId"}),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "PropertyDeleted",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "PropertyChanged",
        [
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            PropertyDef({ property: "oldValue", expectedType: "string" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildAdded",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            SequenceNumberProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildDeleted",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildReplaced",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedFromOtherContainment",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedFromOtherContainmentInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedInSameContainment",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedAndReplacedFromOtherContainment",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedAndReplacedFromOtherContainmentInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ChildMovedAndReplacedInSameContainment",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationAdded",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationDeleted",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "deletedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationReplaced",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationMovedFromOtherParent",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationMovedInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationMovedAndReplacedFromOtherParent",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "AnnotationMovedAndReplacedInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceAdded",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL  }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceDeleted",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "deletedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "deletedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceChanged",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedFromOtherReference",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedFromOtherReferenceInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedInSameReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedAndReplacedFromOtherReference",
        [
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedAndReplacedFromOtherReferenceInSameParent",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "EntryMovedAndReplacedInSameReference",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "number" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "oldIndex", expectedType: "number" }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceResolveInfoAdded",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceResolveInfoDeleted",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "deletedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceResolveInfoChanged",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceTargetAdded",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceTargetDeleted",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "deletedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "ReferenceTargetChanged",
        [
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "number" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            EventKindProperty,
            CommandOriginProperty,
            ProtocolMessageProperty,
        ],
    ],
    [
        "Composite",
        [
            PropertyDef({ property: "parts", expectedType: "IEvent" }),
            EventKindProperty,
            ProtocolMessageProperty,
        ],
    ],
    ["EventKind", PrimitiveDef({ primitiveType: "string" })],
    // ["string", PrimitiveDef({ primitiveType: "string" })],
])

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
