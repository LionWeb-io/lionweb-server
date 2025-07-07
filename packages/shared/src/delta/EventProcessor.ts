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
    EntryMovedInSameReferenceEvent,
    EventType,
    ErrorEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent, ReferenceResolveInfoAddedEvent,
    ReferenceResolveInfoChangedEvent,
    ReferenceResolveInfoDeletedEvent,
    ReferenceTargetAddedEvent,
    ReferenceTargetChangedEvent,
    ReferenceTargetDeletedEvent
} from "./EventTypes.js"

export class EventProcessor {
    process(message: EventType): void {
        switch (message.messageKind) {
            case "ClassifierChanged": {
                this.processClassifierChangedEvent(message);
                break;
            }

            case "PartitionAdded": {
                this.processPartitionAddedEvent(message);
                break;
            }

            case "PartitionDeleted": {
                this.processPartitionDeletedEvent(message);
                break;
            }

            case "PropertyAdded": {
                this.processPropertyAddedEvent(message);
                break;
            }

            case "PropertyDeleted": {
                this.processPropertyDeletedEvent(message);
                break;
            }

            case "PropertyChanged": {
                this.processPropertyChangedEvent(message);
                break;
            }

            case "ChildAdded": {
                this.processChildAddedEvent(message);
                break;
            }

            case "ChildDeleted": {
                this.processChildDeletedEvent(message);
                break;
            }

            case "ChildReplaced": {
                this.processChildReplacedEvent(message);
                break;
            }

            case "ChildMovedFromOtherContainment": {
                this.processChildMovedFromOtherContainmentEvent(message);
                break;
            }

            case "ChildMovedFromOtherContainmentInSameParent": {
                this.processChildMovedFromOtherContainmentInSameParentEvent(message);
                break;
            }

            case "ChildMovedInSameContainment": {
                this.processChildMovedInSameContainmentEvent(message);
                break;
            }

            case "ChildMovedAndReplacedFromOtherContainment": {
                this.processChildMovedAndReplacedFromOtherContainmentEvent(message);
                break;
            }

            case "ChildMovedAndReplacedFromOtherContainmentInSameParent": {
                this.processChildMovedAndReplacedFromOtherContainmentInSameParentEvent(message);
                break;
            }

            case "ChildMovedAndReplacedInSameContainment": {
                this.processChildMovedAndReplacedInSameContainmentEvent(message);
                break;
            }

            case "AnnotationAdded": {
                this.processAnnotationAddedEvent(message);
                break;
            }

            case "AnnotationDeleted": {
                this.processAnnotationDeletedEvent(message);
                break;
            }

            case "AnnotationReplaced": {
                this.processAnnotationReplacedEvent(message);
                break;
            }

            case "AnnotationMovedFromOtherParent": {
                this.processAnnotationMovedFromOtherParentEvent(message);
                break;
            }

            case "AnnotationMovedInSameParent": {
                this.processAnnotationMovedInSameParentEvent(message);
                break;
            }

            case "AnnotationMovedAndReplacedFromOtherParent": {
                this.processAnnotationMovedAndReplacedFromOtherParentEvent(message);
                break;
            }

            case "AnnotationMovedAndReplacedInSameParent": {
                this.processAnnotationMovedAndReplacedInSameParentEvent(message);
                break;
            }

            case "ReferenceAdded": {
                this.processReferenceAddedEvent(message);
                break;
            }

            case "ReferenceDeleted": {
                this.processReferenceDeletedEvent(message);
                break;
            }

            case "ReferenceChanged": {
                this.processReferenceChangedEvent(message);
                break;
            }

            case "EntryMovedFromOtherReference": {
                this.processEntryMovedFromOtherReferenceEvent(message);
                break;
            }

            case "EntryMovedFromOtherReferenceInSameParent": {
                this.processEntryMovedFromOtherReferenceInSameParentEvent(message);
                break;
            }

            case "EntryMovedInSameReference": {
                this.processEntryMovedInSameReferenceEvent(message);
                break;
            }

            case "EntryMovedAndReplacedFromOtherReference": {
                this.processEntryMovedAndReplacedFromOtherReferenceEvent(message);
                break;
            }

            case "EntryMovedAndReplacedFromOtherReferenceInSameParent": {
                this.processEntryMovedAndReplacedFromOtherReferenceInSameParentEvent(message);
                break;
            }

            case "EntryMovedAndReplacedInSameReference": {
                this.processEntryMovedAndReplacedInSameReferenceEvent(message);
                break;
            }

            case "ReferenceResolveInfoAdded": {
                this.processReferenceResolveInfoAddedEvent(message);
                break;
            }

            case "ReferenceResolveInfoDeleted": {
                this.processReferenceResolveInfoDeletedEvent(message);
                break;
            }

            case "ReferenceResolveInfoChanged": {
                this.processReferenceResolveInfoChangedEvent(message);
                break;
            }

            case "ReferenceTargetAdded": {
                this.processReferenceTargetAddedEvent(message);
                break;
            }

            case "ReferenceTargetDeleted": {
                this.processReferenceTargetDeletedEvent(message);
                break;
            }

            case "ReferenceTargetChanged": {
                this.processReferenceTargetChangedEvent(message);
                break;
            }

            case "Error": {
                message
                this.processErrorEvent(message);
                break;
            }
        }
    }

    processClassifierChangedEvent(message: ClassifierChangedEvent) {
        console.log("Processing message ClassifierChanged");
    }
    processPartitionAddedEvent(message: PartitionAddedEvent) {
        console.log("Processing message PartitionAdded");
    }
    processPartitionDeletedEvent(message: PartitionDeletedEvent) {
        console.log("Processing message PartitionDeleted");
    }
    processPropertyAddedEvent(message: PropertyAddedEvent) {
        console.log("Processing message PropertyAdded");
    }
    processPropertyDeletedEvent(message: PropertyDeletedEvent) {
        console.log("Processing message PropertyDeleted");
    }
    processPropertyChangedEvent(message: PropertyChangedEvent) {
        console.log("Processing message PropertyChanged");
    }
    processChildAddedEvent(message: ChildAddedEvent) {
        console.log("Processing message ChildAdded");
    }
    processChildDeletedEvent(message: ChildDeletedEvent) {
        console.log("Processing message ChildDeleted");
    }
    processChildReplacedEvent(message: ChildReplacedEvent) {
        console.log("Processing message ChildReplaced");
    }
    processChildMovedFromOtherContainmentEvent(message: ChildMovedFromOtherContainmentEvent) {
        console.log("Processing message ChildMovedFromOtherContainment");
    }
    processChildMovedFromOtherContainmentInSameParentEvent(message: ChildMovedFromOtherContainmentInSameParentEvent) {
        console.log("Processing message ChildMovedFromOtherContainmentInSameParent");
    }
    processChildMovedInSameContainmentEvent(message: ChildMovedInSameContainmentEvent) {
        console.log("Processing message ChildMovedInSameContainment");
    }
    processChildMovedAndReplacedFromOtherContainmentEvent(message: ChildMovedAndReplacedFromOtherContainmentEvent) {
        console.log("Processing message ChildMovedAndReplacedFromOtherContainment");
    }
    processChildMovedAndReplacedFromOtherContainmentInSameParentEvent(message: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent) {
        console.log("Processing message ChildMovedAndReplacedFromOtherContainmentInSameParent");
    }
    processChildMovedAndReplacedInSameContainmentEvent(message: ChildMovedAndReplacedInSameContainmentEvent) {
        console.log("Processing message ChildMovedAndReplacedInSameContainment");
    }
    processAnnotationAddedEvent(message: AnnotationAddedEvent) {
        console.log("Processing message AnnotationAdded");
    }
    processAnnotationDeletedEvent(message: AnnotationDeletedEvent) {
        console.log("Processing message AnnotationDeleted");
    }
    processAnnotationReplacedEvent(message: AnnotationReplacedEvent) {
        console.log("Processing message AnnotationReplaced");
    }
    processAnnotationMovedFromOtherParentEvent(message: AnnotationMovedFromOtherParentEvent) {
        console.log("Processing message AnnotationMovedFromOtherParent");
    }
    processAnnotationMovedInSameParentEvent(message: AnnotationMovedInSameParentEvent) {
        console.log("Processing message AnnotationMovedInSameParent");
    }
    processAnnotationMovedAndReplacedFromOtherParentEvent(message: AnnotationMovedAndReplacedFromOtherParentEvent) {
        console.log("Processing message AnnotationMovedAndReplacedFromOtherParent");
    }
    processAnnotationMovedAndReplacedInSameParentEvent(message: AnnotationMovedAndReplacedInSameParentEvent) {
        console.log("Processing message AnnotationMovedAndReplacedInSameParent");
    }
    processReferenceAddedEvent(message: ReferenceAddedEvent) {
        console.log("Processing message ReferenceAdded");
    }
    processReferenceDeletedEvent(message: ReferenceDeletedEvent) {
        console.log("Processing message ReferenceDeleted");
    }
    processReferenceChangedEvent(message: ReferenceChangedEvent) {
        console.log("Processing message ReferenceChanged");
    }
    processEntryMovedFromOtherReferenceEvent(message: EntryMovedFromOtherReferenceEvent) {
        console.log("Processing message EntryMovedFromOtherReference");
    }
    processEntryMovedFromOtherReferenceInSameParentEvent(message: EntryMovedFromOtherReferenceInSameParentEvent) {
        console.log("Processing message EntryMovedFromOtherReferenceInSameParent");
    }
    processEntryMovedInSameReferenceEvent(message: EntryMovedInSameReferenceEvent) {
        console.log("Processing message EntryMovedInSameReference");
    }
    processEntryMovedAndReplacedFromOtherReferenceEvent(message: EntryMovedAndReplacedFromOtherReferenceEvent) {
        console.log("Processing message EntryMovedAndReplacedFromOtherReference");
    }
    processEntryMovedAndReplacedFromOtherReferenceInSameParentEvent(message: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent) {
        console.log("Processing message EntryMovedAndReplacedFromOtherReferenceInSameParent");
    }
    processEntryMovedAndReplacedInSameReferenceEvent(message: EntryMovedAndReplacedInSameReferenceEvent) {
        console.log("Processing message EntryMovedAndReplacedInSameReference");
    }
    processReferenceResolveInfoAddedEvent(message: ReferenceResolveInfoAddedEvent) {
        console.log("Processing message ReferenceResolveInfoAdded");
    }
    processReferenceResolveInfoDeletedEvent(message: ReferenceResolveInfoDeletedEvent) {
        console.log("Processing message ReferenceResolveInfoDeleted");
    }
    processReferenceResolveInfoChangedEvent(message: ReferenceResolveInfoChangedEvent) {
        console.log("Processing message ReferenceResolveInfoChanged");
    }
    processReferenceTargetAddedEvent(message: ReferenceTargetAddedEvent) {
        console.log("Processing message ReferenceTargetAdded");
    }
    processReferenceTargetDeletedEvent(message: ReferenceTargetDeletedEvent) {
        console.log("Processing message ReferenceTargetDeleted");
    }
    processReferenceTargetChangedEvent(message: ReferenceTargetChangedEvent) {
        console.log("Processing message ReferenceTargetChanged");
    }
    processErrorEvent(message: ErrorEvent) {
        console.log("Processing message Error");
    }
}
