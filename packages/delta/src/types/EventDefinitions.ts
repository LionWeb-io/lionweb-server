import { JsonContext } from "@lionweb/json-utils"
import { TypeDefinition, PrimitiveDef, PropertyDef, PropertyDefinition, ValidationResult, ObjectDef } from "@lionweb/validation"
import { MAY_BE_NULL, NOT_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"



const EventKindProperty: PropertyDefinition = PropertyDef({ property: "messageKind", expectedType: "EventKind", isKey: true })
const CommandOriginProperty: PropertyDefinition = PropertyDef({ property: "originCommands", expectedType: "CommandSource", isList: true })
const SequenceNumberProperty: PropertyDefinition = PropertyDef({ property: "sequenceNumber", expectedType: "SequenceNumber" })

const ICommonEventProperties = [
    EventKindProperty,
    CommandOriginProperty,
    SequenceNumberProperty,
    ProtocolMessageProperty,
]

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
        "CommandSource",
        ObjectDef(
            [PropertyDef({ property: "participationId", expectedType: "ParticipationId" }), PropertyDef({ property: "commandId", expectedType: "CommandId" })],
        ),
    ],
    ["SequenceNumber", PrimitiveDef({ primitiveType: "string" })],
    ["CommandId", PrimitiveDef({ primitiveType: "string" })],
    ["ParticipationId", PrimitiveDef({ primitiveType: "string" })],

    // Events
    [
        "ClassifierChanged",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldClassifier", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newClassifier", expectedType: "LionWebJsonMetaPointer" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "PartitionAdded",
        ObjectDef([
            // TODO Check type
            PropertyDef({ property: "newPartition", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "PartitionDeleted",
        ObjectDef([
            // TODO Check type
            PropertyDef({ property: "deletedPartition", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "PropertyAdded",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            ...ICommonEventProperties,
        ], "IEvent")
    ],
    [
        "PropertyDeleted",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldValue", expectedType: "string" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "PropertyChanged",
        ObjectDef([
            PropertyDef({ property: "node", expectedType: "LionWebId" }),
            PropertyDef({ property: "property", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newValue", expectedType: "string" }),
            PropertyDef({ property: "oldValue", expectedType: "string" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildAdded",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildDeleted",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "deletedChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildReplaced",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedFromOtherContainment",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedFromOtherContainmentInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedInSameContainment",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedAndReplacedFromOtherContainment",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedAndReplacedFromOtherContainmentInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldContainment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ChildMovedAndReplacedInSameContainment",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "containment", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedChild", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "replacedChild", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationAdded",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationDeleted",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "deletedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationReplaced",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationMovedFromOtherParent",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationMovedInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationMovedAndReplacedFromOtherParent",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "AnnotationMovedAndReplacedInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedAnnotation", expectedType: "LionWebId" }),
            PropertyDef({ property: "replacedAnnotation", expectedType: "LionWebJsonDeltaChunk" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceAdded",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceDeleted",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "deletedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "deletedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceChanged",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedFromOtherReference",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedFromOtherReferenceInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedInSameReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedAndReplacedFromOtherReference",
        ObjectDef([
            PropertyDef({ property: "newParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldParent", expectedType: "LionWebId" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedAndReplacedFromOtherReferenceInSameParent",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "newReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "oldReference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "EntryMovedAndReplacedInSameReference",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "newIndex", expectedType: "numberString" }),
            PropertyDef({ property: "movedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "movedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "oldIndex", expectedType: "numberString" }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceResolveInfoAdded",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceResolveInfoDeleted",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "deletedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceResolveInfoChanged",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "target", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "newResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedResolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceTargetAdded",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceTargetDeleted",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "deletedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    [
        "ReferenceTargetChanged",
        ObjectDef([
            PropertyDef({ property: "parent", expectedType: "LionWebId" }),
            PropertyDef({ property: "reference", expectedType: "LionWebJsonMetaPointer" }),
            PropertyDef({ property: "index", expectedType: "numberString" }),
            PropertyDef({ property: "newTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "replacedTarget", expectedType: "LionWebId", mayBeNull: MAY_BE_NULL }),
            PropertyDef({ property: "resolveInfo", expectedType: "string", mayBeNull: MAY_BE_NULL }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    ["IEvent", ObjectDef([...ICommonEventProperties])],
    ["CompositeEvent", ObjectDef([PropertyDef({ property: "parts", expectedType: "IEvent" }), ...ICommonEventProperties])],
    [
        "Error",
        ObjectDef([
            PropertyDef({ property: "errorCode", expectedType: "string" }),
            PropertyDef({ property: "message", expectedType: "string" }),
            ...ICommonEventProperties,
        ], "IEvent"),
    ],
    ["NoOpEvent", ObjectDef([...ICommonEventProperties])],
    ["EventKind", PrimitiveDef({ primitiveType: "string", isKey:true })],
    // ["string", PrimitiveDef({ primitiveType: "string" })],
])

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
