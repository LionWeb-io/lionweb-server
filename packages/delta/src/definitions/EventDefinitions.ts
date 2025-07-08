import { JsonContext } from "@lionweb/json-utils"
import { PrimitiveDef, PropertyDef, PropertyDefinition, DefinitionSchema, ValidationResult } from "@lionweb/validation"
import { MAY_BE_NULL, ProtocolMessageProperty } from "./SharedDefinitions.js"

const EventTypeProperty: PropertyDefinition = PropertyDef({ name: "messageKind", type: "EventType" })
const CommandOriginProperty: PropertyDefinition = PropertyDef({ name: "originCommands", type: "CommandSource", isList: true })
const SequenceNumberProperty: PropertyDefinition = PropertyDef({ name: "sequenceNumber", type: "SequenceNumber" })

const CommonEventProperties = [EventTypeProperty, CommandOriginProperty, SequenceNumberProperty, ProtocolMessageProperty]

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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "PartitionAdded",
            properties: [
                // TODO Check type
                PropertyDef({ name: "newPartition", type: "LionWebJsonDeltaChunk" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "PartitionDeleted",
            properties: [
                // TODO Check type
                PropertyDef({ name: "deletedPartition", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "PropertyAdded",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "PropertyDeleted",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "oldValue", type: "JS_string" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "PropertyChanged",
            properties: [
                PropertyDef({ name: "node", type: "LionWebId" }),
                PropertyDef({ name: "property", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newValue", type: "JS_string" }),
                PropertyDef({ name: "oldValue", type: "JS_string" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ChildAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newChild", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ChildDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "deletedChild", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ChildMovedInSameContainment",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "containment", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedChild", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "AnnotationAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "AnnotationDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "deletedDescendants", type: "LionWebId", isList: true }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "AnnotationReplaced",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "newAnnotation", type: "LionWebJsonDeltaChunk" }),
                PropertyDef({ name: "replacedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "replacedDescendants", type: "LionWebId", isList: true }),
                PropertyDef({ name: "index", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "AnnotationMovedFromOtherParent",
            properties: [
                PropertyDef({ name: "newParent", type: "LionWebId" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                PropertyDef({ name: "oldParent", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "AnnotationMovedInSameParent",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "oldIndex", type: "JS_number" }),
                PropertyDef({ name: "newIndex", type: "JS_number" }),
                PropertyDef({ name: "movedAnnotation", type: "LionWebId" }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceResolveInfoAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "newResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceResolveInfoDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "target", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "deletedResolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceTargetAdded",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "newTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "ReferenceTargetDeleted",
            properties: [
                PropertyDef({ name: "parent", type: "LionWebId" }),
                PropertyDef({ name: "reference", type: "LionWebJsonMetaPointer" }),
                PropertyDef({ name: "index", type: "JS_number" }),
                PropertyDef({ name: "deletedTarget", type: "LionWebId", mayBeNull: MAY_BE_NULL }),
                PropertyDef({ name: "resolveInfo", type: "JS_string", mayBeNull: MAY_BE_NULL }),
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
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
                ...CommonEventProperties,
            ],
            taggedUnionType: "EventType",
        },
        {
            name: "CompositeEvent",
            properties: [
                PropertyDef({ name: "parts", type: "EventType", isList: true }),
                EventTypeProperty,
                ProtocolMessageProperty
            ],
        },
        {
            name: "Error",
            properties: [
                PropertyDef({ name: "errorCode", type: "JS_string" }), 
                PropertyDef({ name: "message", type: "JS_string" }),
                ...CommonEventProperties
            ],
            taggedUnionType: "EventType",
        },
        { 
            name: "NoOpEvent",
            properties: [
                ...CommonEventProperties
            ],
            taggedUnionType: "EventType",
        },
        PrimitiveDef({ name: "EventType", primitiveType: "string" }),
        // ["string", PrimitiveDef({ primitiveType: "string" })],
    ],
    {
        unionType: "Event",
        unionDiscriminator: "EventType",
        unionProperty: "messageKind",
    }
)

// Add any Map or Set to another
// function addAll(target: Map<string, TypeDefinition>, source: Map<string, TypeDefinition>) {
//     Array.from(source.entries()).forEach((it) => target.set(it[0], it[1]))
// }
// addAll(commandMap, expectedTypes)
