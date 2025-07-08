// @ts-nocheck
import {
    SubscribeToChangingPartitionsResponseFunction,
    SubscribeToPartitionContentsResponseFunction,
    UnsubscribeFromPartitionContentsResponseFunction
} from "@lionweb/delta-server"
import { DeltaValidator } from "@lionweb/repository-delta"
import {
    AnnotationAddedEvent,
    AnnotationDeletedEvent,
    AnnotationMovedAndReplacedFromOtherParentEvent,
    AnnotationMovedAndReplacedInSameParentEvent,
    AnnotationMovedFromOtherParentEvent,
    AnnotationMovedInSameParentEvent,
    AnnotationReplacedEvent,
    ChildAddedEvent,
    ChildDeletedEvent,
    ChildMovedAndReplacedFromOtherContainmentEvent,
    ChildMovedAndReplacedFromOtherContainmentInSameParentEvent,
    ChildMovedAndReplacedInSameContainmentEvent,
    ChildMovedFromOtherContainmentEvent,
    ChildMovedFromOtherContainmentInSameParentEvent,
    ChildMovedInSameContainmentEvent,
    ChildReplacedEvent,
    ClassifierChangedEvent,
    EntryMovedAndReplacedFromOtherReferenceEvent,
    EntryMovedAndReplacedFromOtherReferenceInSameParentEvent,
    EntryMovedAndReplacedInSameReferenceEvent,
    EntryMovedFromOtherReferenceEvent,
    EntryMovedFromOtherReferenceInSameParentEvent,
    EntryMovedInSameReferenceEvent, ErrorEvent,
    EventType, GetAvailableIdsResponse, ListPartitionsQueryResponse, NoOpEventEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent, ReconnectResponse,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent,
    ReferenceResolveInfoAddedEvent,
    ReferenceResolveInfoChangedEvent,
    ReferenceResolveInfoDeletedEvent,
    ReferenceTargetAddedEvent, ReferenceTargetChangedEvent,
    ReferenceTargetDeletedEvent, SignOffResponse, SignOnResponse
} from "@lionweb/server-delta-shared";
import { ValidationResult } from "@lionweb/validation"
import {
    AnnotationAddedFunction,
    AnnotationDeletedFunction,
    AnnotationMovedAndReplacedFromOtherParentFunction,
    AnnotationMovedAndReplacedInSameParentFunction,
    AnnotationMovedFromOtherParentFunction,
    AnnotationMovedInSameParentFunction,
    AnnotationReplacedFunction,
    ChildAddedFunction,
    ChildDeletedFunction,
    ChildMovedAndReplacedFromOtherContainmentFunction,
    ChildMovedAndReplacedFromOtherContainmentInSameParentFunction,
    ChildMovedAndReplacedInSameContainmentFunction,
    ChildMovedFromOtherContainmentFunction,
    ChildMovedFromOtherContainmentInSameParentFunction,
    ChildMovedInSameContainmentFunction,
    ChildReplacedFunction,
    ClassifierChangedFunction,
    EntryMovedAndReplacedFromOtherReferenceFunction, EntryMovedAndReplacedFromOtherReferenceInSameParentFunction, EntryMovedAndReplacedInSameReferenceFunction,
    EntryMovedFromOtherReferenceFunction,
    EntryMovedFromOtherReferenceInSameParentFunction,
    EntryMovedInSameReferenceFunction, ErrorFunction, NoOpEventFunction,
    PartitionAddedFunction,
    PartitionDeletedFunction,
    PropertyAddedFunction,
    PropertyChangedFunction, PropertyDeletedFunction,
    ReferenceAddedFunction,
    ReferenceChangedFunction,
    ReferenceDeletedFunction, ReferenceResolveInfoAddedFunction, ReferenceResolveInfoChangedFunction, ReferenceResolveInfoDeletedFunction,
    ReferenceTargetAddedFunction, ReferenceTargetChangedFunction, ReferenceTargetDeletedFunction
} from "./events/EventProcessors.js"
import {
    GetAvailableIdsResponseFunction,
    ListPartitionsResponseFunction,
    ReconnectResponseFunction,
    SignOffResponseFunction,
    SignOnResponseFunction
} from "./queryresponses/index.js"

const processingFunctions: Map<string, (msg: EventType) => void> = new Map<string, (msg: EventType) => void>();

processingFunctions.set("ClassifierChanged", ClassifierChangedFunction);
processingFunctions.set("PartitionAdded", PartitionAddedFunction);
processingFunctions.set("PartitionDeleted", PartitionDeletedFunction);
processingFunctions.set("PropertyAdded", PropertyAddedFunction);
processingFunctions.set("PropertyDeleted", PropertyDeletedFunction);
processingFunctions.set("PropertyChanged", PropertyChangedFunction);
processingFunctions.set("ChildAdded", ChildAddedFunction);
processingFunctions.set("ChildDeleted", ChildDeletedFunction);
processingFunctions.set("ChildReplaced", ChildReplacedFunction);
processingFunctions.set("ChildMovedFromOtherContainment", ChildMovedFromOtherContainmentFunction);
processingFunctions.set("ChildMovedFromOtherContainmentInSameParent", ChildMovedFromOtherContainmentInSameParentFunction);
processingFunctions.set("ChildMovedInSameContainment", ChildMovedInSameContainmentFunction);
processingFunctions.set("ChildMovedAndReplacedFromOtherContainment", ChildMovedAndReplacedFromOtherContainmentFunction);
processingFunctions.set("ChildMovedAndReplacedFromOtherContainmentInSameParent", ChildMovedAndReplacedFromOtherContainmentInSameParentFunction);
processingFunctions.set("ChildMovedAndReplacedInSameContainment", ChildMovedAndReplacedInSameContainmentFunction);
processingFunctions.set("AnnotationAdded", AnnotationAddedFunction);
processingFunctions.set("AnnotationDeleted", AnnotationDeletedFunction);
processingFunctions.set("AnnotationReplaced", AnnotationReplacedFunction);
processingFunctions.set("AnnotationMovedFromOtherParent", AnnotationMovedFromOtherParentFunction);
processingFunctions.set("AnnotationMovedInSameParent", AnnotationMovedInSameParentFunction);
processingFunctions.set("AnnotationMovedAndReplacedFromOtherParent", AnnotationMovedAndReplacedFromOtherParentFunction);
processingFunctions.set("AnnotationMovedAndReplacedInSameParent", AnnotationMovedAndReplacedInSameParentFunction);
processingFunctions.set("ReferenceAdded", ReferenceAddedFunction);
processingFunctions.set("ReferenceDeleted", ReferenceDeletedFunction);
processingFunctions.set("ReferenceChanged", ReferenceChangedFunction);
processingFunctions.set("EntryMovedFromOtherReference", EntryMovedFromOtherReferenceFunction);
processingFunctions.set("EntryMovedFromOtherReferenceInSameParent", EntryMovedFromOtherReferenceInSameParentFunction);
processingFunctions.set("EntryMovedInSameReference", EntryMovedInSameReferenceFunction);
processingFunctions.set("EntryMovedAndReplacedFromOtherReference", EntryMovedAndReplacedFromOtherReferenceFunction);
processingFunctions.set("EntryMovedAndReplacedFromOtherReferenceInSameParent", EntryMovedAndReplacedFromOtherReferenceInSameParentFunction);
processingFunctions.set("EntryMovedAndReplacedInSameReference", EntryMovedAndReplacedInSameReferenceFunction);
processingFunctions.set("ReferenceResolveInfoAdded", ReferenceResolveInfoAddedFunction);
processingFunctions.set("ReferenceResolveInfoDeleted", ReferenceResolveInfoDeletedFunction);
processingFunctions.set("ReferenceResolveInfoChanged", ReferenceResolveInfoChangedFunction);
processingFunctions.set("ReferenceTargetAdded", ReferenceTargetAddedFunction);
processingFunctions.set("ReferenceTargetDeleted", ReferenceTargetDeletedFunction);
processingFunctions.set("ReferenceTargetChanged", ReferenceTargetChangedFunction);
processingFunctions.set("Error", ErrorFunction);
processingFunctions.set("NoOpEvent", NoOpEventFunction);

processingFunctions.set("SubscribeToChangingPartitionsResponse", SubscribeToChangingPartitionsResponseFunction);
processingFunctions.set("SubscribeToPartitionContentsResponse", SubscribeToPartitionContentsResponseFunction);
processingFunctions.set("UnsubscribeFromPartitionContentsResponse", UnsubscribeFromPartitionContentsResponseFunction);
processingFunctions.set("SignOnResponse", SignOnResponseFunction);
processingFunctions.set("SignOffResponse", SignOffResponseFunction);
processingFunctions.set("ListPartitionsResponse", ListPartitionsResponseFunction);
processingFunctions.set("GetAvailableIdsResponse", GetAvailableIdsResponseFunction);
processingFunctions.set("ReconnectResponse", ReconnectResponseFunction);

const deltaValidator = new DeltaValidator(new ValidationResult())
export function processDelta(delta: EventType): void {
    const type = delta.messageKind
    if (typeof type !== "string") {
        console.error(`processDelta: messageKind is not a string but a ${typeof type}`)
        return
    }
    const func = processingFunctions.get(type)
    if (func === undefined) {
        console.error(`processDelta: messageKind is not a string but a ${typeof type}`)
        return
    }
    // Now validate the JSON message
    deltaValidator.validationResult.reset()
    deltaValidator.validate(delta, type)
    if (deltaValidator.validationResult.hasErrors()) {
        console.error(`Valoidation errors:`)
        deltaValidator.validationResult.issues.forEach(issue => {
            console.error(issue.errorMsg())
        })
        return
    }
    // Finally ok
    func(delta)
}
