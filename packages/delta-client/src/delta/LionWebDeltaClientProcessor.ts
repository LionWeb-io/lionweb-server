import WebSocket from 'ws';
import { DeltaValidator } from "@lionweb/server-delta"
import {
    EventType,
    QueryResponseType
} from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import { IEventProcessor } from "./events/IEventProcessor.js"
import { IQueryResponseProcessor } from "./queryresponses/index.js"

type MessageFromServer = EventType | QueryResponseType
type ProcessingFunction = (socket: WebSocket, msg: MessageFromServer) => void;

export class LionWebDeltaClientProcessor {

    processingFunctions: Map<string, ProcessingFunction> = new Map<string, ProcessingFunction>();
    deltaValidator = new DeltaValidator(new ValidationResult())

    constructor(queries: IQueryResponseProcessor, events: IEventProcessor) {
        this.initialize(queries, events)
    }

    processDelta(socket: WebSocket, delta: EventType): void {
        const type = delta.messageKind
        if (typeof type !== "string") {
            console.error(`processDelta: messageKind is not a string but a ${typeof type}`)
            return
        }
        const func = this.processingFunctions.get(type)
        if (func === undefined) {
            console.error(`processDelta: messageKind is not a string but a ${typeof type}`)
            return
        }
        // Now validate the JSON message
        this.deltaValidator.validationResult.reset()
        this.deltaValidator.validate(delta, type)
        if (this.deltaValidator.validationResult.hasErrors()) {
            console.error(`Valoidation errors:`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                console.error(issue.errorMsg())
            })
            return
        }
        // Finally ok
        func(socket, delta)
    }

    initialize(queries: IQueryResponseProcessor, events: IEventProcessor) {
        this.processingFunctions.set("ClassifierChanged", events.ClassifierChangedFunction as ProcessingFunction);
        this.processingFunctions.set("PartitionAdded", events.PartitionAddedFunction as ProcessingFunction);
        this.processingFunctions.set("PartitionDeleted", events.PartitionDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("PropertyAdded", events.PropertyAddedFunction as ProcessingFunction);
        this.processingFunctions.set("PropertyDeleted", events.PropertyDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("PropertyChanged", events.PropertyChangedFunction as ProcessingFunction);
        this.processingFunctions.set("ChildAdded", events.ChildAddedFunction as ProcessingFunction);
        this.processingFunctions.set("ChildDeleted", events.ChildDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("ChildReplaced", events.ChildReplacedFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedFromOtherContainment", events.ChildMovedFromOtherContainmentFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedFromOtherContainmentInSameParent", events.ChildMovedFromOtherContainmentInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedInSameContainment", events.ChildMovedInSameContainmentFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedAndReplacedFromOtherContainment", events.ChildMovedAndReplacedFromOtherContainmentFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedAndReplacedFromOtherContainmentInSameParent", events.ChildMovedAndReplacedFromOtherContainmentInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("ChildMovedAndReplacedInSameContainment", events.ChildMovedAndReplacedInSameContainmentFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationAdded", events.AnnotationAddedFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationDeleted", events.AnnotationDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationReplaced", events.AnnotationReplacedFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationMovedFromOtherParent", events.AnnotationMovedFromOtherParentFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationMovedInSameParent", events.AnnotationMovedInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationMovedAndReplacedFromOtherParent", events.AnnotationMovedAndReplacedFromOtherParentFunction as ProcessingFunction);
        this.processingFunctions.set("AnnotationMovedAndReplacedInSameParent", events.AnnotationMovedAndReplacedInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceAdded", events.ReferenceAddedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceDeleted", events.ReferenceDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceChanged", events.ReferenceChangedFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedFromOtherReference", events.EntryMovedFromOtherReferenceFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedFromOtherReferenceInSameParent", events.EntryMovedFromOtherReferenceInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedInSameReference", events.EntryMovedInSameReferenceFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedAndReplacedFromOtherReference", events.EntryMovedAndReplacedFromOtherReferenceFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedAndReplacedFromOtherReferenceInSameParent", events.EntryMovedAndReplacedFromOtherReferenceInSameParentFunction as ProcessingFunction);
        this.processingFunctions.set("EntryMovedAndReplacedInSameReference", events.EntryMovedAndReplacedInSameReferenceFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceResolveInfoAdded", events.ReferenceResolveInfoAddedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceResolveInfoDeleted", events.ReferenceResolveInfoDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceResolveInfoChanged", events.ReferenceResolveInfoChangedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceTargetAdded", events.ReferenceTargetAddedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceTargetDeleted", events.ReferenceTargetDeletedFunction as ProcessingFunction);
        this.processingFunctions.set("ReferenceTargetChanged", events.ReferenceTargetChangedFunction as ProcessingFunction);
        this.processingFunctions.set("Error", events.ErrorFunction as ProcessingFunction);
        this.processingFunctions.set("NoOpEvent", events.NoOpEventFunction as ProcessingFunction);

        this.processingFunctions.set("SubscribeToChangingPartitionsResponse", queries.SubscribeToChangingPartitionsResponseFunction as ProcessingFunction);
        this.processingFunctions.set("SubscribeToPartitionContentsResponse", queries.SubscribeToPartitionContentsResponseFunction as ProcessingFunction);
        this.processingFunctions.set("UnsubscribeFromPartitionContentsResponse", queries.UnsubscribeFromPartitionContentsResponseFunction as ProcessingFunction);
        this.processingFunctions.set("SignOnResponse", queries.SignOnResponseFunction as ProcessingFunction);
        this.processingFunctions.set("SignOffResponse", queries.SignOffResponseFunction as ProcessingFunction);
        this.processingFunctions.set("ListPartitionsResponse", queries.ListPartitionsResponseFunction as ProcessingFunction);
        this.processingFunctions.set("GetAvailableIdsResponse", queries.GetAvailableIdsResponseFunction as ProcessingFunction);
        this.processingFunctions.set("ReconnectResponse", queries.ReconnectResponseFunction as ProcessingFunction);
    }

 
}
