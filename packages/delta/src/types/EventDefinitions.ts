import { JsonContext } from "@lionweb/json-utils"
import { PrimitiveDef, PropertyDef, PropertyDefinition, DefinitionSchema, ValidationResult } from "@lionweb/validation"
import { MAY_BE_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const EventKindProperty: PropertyDefinition = PropertyDef({ name: "messageKind", type: "EventKind" })
const CommandOriginProperty: PropertyDefinition = PropertyDef({ name: "originCommands", type: "CommandSource", isList: true })
const SequenceNumberProperty: PropertyDefinition = PropertyDef({ name: "sequenceNumber", type: "SequenceNumber" })

const ICommonEventProperties = [EventKindProperty, CommandOriginProperty, SequenceNumberProperty, ProtocolMessageProperty]

/**
 * No-op validation function used as default value.
 * @param object Object to validate.
 * @param result Object where issues should be stored.
 * @param ctx    The JsonContext, to be used for issue location.
 * @param pdef   The property definitions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emptyValidation<T>(object: T, result: ValidationResult, ctx: JsonContext, pdef?: PropertyDefinition): void {}

export const DeltaEventSchema: DefinitionSchema = new DefinitionSchema(
    [
        {
            unionType: "IEvent",
            unionDiscriminator: "CommandKind",
            unionProperty: "messageKind",
        },
    ],
    [
        {
            name: "CommandSource",
            properties: [
                PropertyDef({ name: "participationId", type: "ParticipationId" }),
                PropertyDef({ name: "commandId", type: "CommandId" })
            ],
        },
        PrimitiveDef({ name: "SequenceNumber", primitiveType: "number" }),
        PrimitiveDef({ name: "CommandId", primitiveType: "string" }),
        PrimitiveDef({ name: "ParticipationId", primitiveType: "string" }),

        // Events
        {
            name: "ClassifierChanged",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "oldClassifier", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newClassifier", type: "LionWebJsonMetaPointer" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "PartitionAdded",
            properties: [
                // TODO Check type
                PropertyDef({ name: "newPartition", type: "LionWebJsonDeltaChunk" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "PartitionDeleted",
            properties: [
                // TODO Check type
                PropertyDef({ name: "deletedPartition", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "PropertyAdded",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "PropertyDeleted",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldValue", type: "JS_string" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "PropertyChanged",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                PropertyDef({ name: "oldValue", type: "JS_string" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "deletedChild", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildReplaced",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedInSameContainment",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedAndReplacedFromOtherContainment",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedAndReplacedFromOtherContainmentInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldContainment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ChildMovedAndReplacedInSameContainment",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "replacedChild", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationReplaced",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationMovedFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationMovedInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationMovedAndReplacedFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "AnnotationMovedAndReplacedInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceChanged",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedFromOtherReference",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedAndReplacedFromOtherReference",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedAndReplacedFromOtherReferenceInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "oldReference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "EntryMovedAndReplacedInSameReference",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "movedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceResolveInfoAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceResolveInfoDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceResolveInfoChanged",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceTargetAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceTargetDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "ReferenceTargetChanged",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "replacedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...ICommonEventProperties,
            ],
            taggedUnionType: "IEvent",
        },
        {
            name: "IEvent",
            properties: [...ICommonEventProperties],
        },
        {
            name: "CompositeEvent",
            properties: [
                PropertyDef({ name: "parts", type: "IEvent", isList: true }),
                EventKindProperty,
                ProtocolMessageProperty
            ],
        },
        {
            name: "Error",
            properties: [
                PropertyDef({ name: "errorCode", type: "JS_string" }), 
                PropertyDef({ name: "message", type: "JS_string" }),
                ...ICommonEventProperties
            ],
            taggedUnionType: "IEvent",
        },
        { name: "NoOpEvent", properties: [
            ...ICommonEventProperties
            ]
        },
        PrimitiveDef({ name: "EventKind", primitiveType: "string" }),
        // ["string", PrimitiveDef({ primitiveType: "string" })],
    ],
)

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
