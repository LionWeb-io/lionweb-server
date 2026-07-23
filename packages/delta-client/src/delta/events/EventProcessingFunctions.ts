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
    ErrorEvent,
    NoOpEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent
} from "@lionweb/server-delta-shared"
import { ReceivingDelta } from "../ProcessingTypes.js"

const ClassifierChangedFunction = (msg: ClassifierChangedEvent): void => {
    console.log("Called ClassifierChangedFunction " + msg.messageKind)
}

const PartitionAddedFunction = (msg: PartitionAddedEvent): void => {
        console.log("Called PartitionAddedFunction " + msg.messageKind)
    }

const PartitionDeletedFunction = (msg: PartitionDeletedEvent): void => {
        console.log("Called PartitionDeletedFunction " + msg.messageKind)
    }

const PropertyAddedFunction = (msg: PropertyAddedEvent): void => {
        console.log("Called PropertyAddedFunction " + msg.messageKind)
    }

const PropertyDeletedFunction = (msg: PropertyDeletedEvent): void => {
        console.log("Called PropertyDeletedFunction " + msg.messageKind)
    }

const PropertyChangedFunction = (msg: PropertyChangedEvent): void => {
        console.log("Called PropertyChangedFunction " + msg.messageKind)
    }

const ChildAddedFunction = (msg: ChildAddedEvent): void => {
        console.log("Called ChildAddedFunction " + msg.messageKind)
    }

const ChildDeletedFunction = (msg: ChildDeletedEvent): void => {
        console.log("Called ChildDeletedFunction " + msg.messageKind)
    }

const ChildReplacedFunction = (msg: ChildReplacedEvent): void => {
        console.log("Called ChildReplacedFunction " + msg.messageKind)
    }

const ChildMovedFromOtherContainmentFunction = (msg: ChildMovedFromOtherContainmentEvent): void => {
        console.log("Called ChildMovedFromOtherContainmentFunction " + msg.messageKind)
    }

const ChildMovedFromOtherContainmentInSameParentFunction = (msg: ChildMovedFromOtherContainmentInSameParentEvent): void => {
        console.log("Called ChildMovedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

const ChildMovedInSameContainmentFunction = (msg: ChildMovedInSameContainmentEvent): void => {
        console.log("Called ChildMovedInSameContainmentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedFromOtherContainmentFunction = (msg: ChildMovedAndReplacedFromOtherContainmentEvent): void => {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedFromOtherContainmentInSameParentFunction = (msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void => {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedInSameContainmentFunction = (msg: ChildMovedAndReplacedInSameContainmentEvent): void => {
        console.log("Called ChildMovedAndReplacedInSameContainmentFunction " + msg.messageKind)
    }

const AnnotationAddedFunction = (msg: AnnotationAddedEvent): void => {
        console.log("Called AnnotationAddedFunction " + msg.messageKind)
    }

const AnnotationDeletedFunction = (msg: AnnotationDeletedEvent): void => {
        console.log("Called AnnotationDeletedFunction " + msg.messageKind)
    }

const AnnotationReplacedFunction = (msg: AnnotationReplacedEvent): void => {
        console.log("Called AnnotationReplacedFunction " + msg.messageKind)
    }

const AnnotationMovedFromOtherParentFunction = (msg: AnnotationMovedFromOtherParentEvent): void => {
        console.log("Called AnnotationMovedFromOtherParentFunction " + msg.messageKind)
    }

const AnnotationMovedInSameParentFunction = (msg: AnnotationMovedInSameParentEvent): void => {
        console.log("Called AnnotationMovedInSameParentFunction " + msg.messageKind)
    }

const AnnotationMovedAndReplacedFromOtherParentFunction = (msg: AnnotationMovedAndReplacedFromOtherParentEvent): void => {
        console.log("Called AnnotationMovedAndReplacedFromOtherParentFunction " + msg.messageKind)
    }

const AnnotationMovedAndReplacedInSameParentFunction = (msg: AnnotationMovedAndReplacedInSameParentEvent): void => {
        console.log("Called AnnotationMovedAndReplacedInSameParentFunction " + msg.messageKind)
    }

const ReferenceAddedFunction = (msg: ReferenceAddedEvent): void => {
        console.log("Called ReferenceAddedFunction " + msg.messageKind)
    }

const ReferenceDeletedFunction = (msg: ReferenceDeletedEvent): void => {
        console.log("Called ReferenceDeletedFunction " + msg.messageKind)
    }

const ReferenceChangedFunction = (msg: ReferenceChangedEvent): void => {
        console.log("Called ReferenceChangedFunction " + msg.messageKind)
    }

const ErrorFunction = (msg: ErrorEvent): void => {
        console.log("Called ErrorFunction " + msg.messageKind)
    }

const NoOpEventFunction = (msg: NoOpEvent): void => {
        console.log("Called NoOpEventFunction " + msg.messageKind)
}

export const eventFunctions: ReceivingDelta[] = [
    {
        messageKind: "ClassifierChanged",
        // @ts-expect-error TS2322
        processor: ClassifierChangedFunction
    },
    {
        messageKind: "PartitionAdded",
        // @ts-expect-error TS2322
        processor: PartitionAddedFunction
    },
    {
        messageKind: "PartitionDeleted",
        // @ts-expect-error TS2322
        processor: PartitionDeletedFunction
    },
    {
        messageKind: "PropertyAdded",
        // @ts-expect-error TS2322
        processor: PropertyAddedFunction
    },
    {
        messageKind: "PropertyChanged",
        // @ts-expect-error TS2322
        processor: PropertyChangedFunction
    },
    {
        messageKind: "PropertyDeleted",
        // @ts-expect-error TS2322
        processor: PropertyDeletedFunction
    },
    {
        messageKind: "ChildAdded",
        // @ts-expect-error TS2322
        processor: ChildAddedFunction
    },
    {
        messageKind: "ChildDeleted",
        // @ts-expect-error TS2322
        processor: ChildDeletedFunction
    },
    {
        messageKind: "ChildMovedAndReplacedFromOtherContainment",
        // @ts-expect-error TS2322
        processor: ChildMovedAndReplacedFromOtherContainmentFunction
    },
    {
        messageKind: "ChildMovedAndReplacedFromOtherContainmentInSameParent",
        // @ts-expect-error TS2322
        processor: ChildMovedAndReplacedFromOtherContainmentInSameParentFunction
    },
    {
        messageKind: "ChildMovedAndReplacedInSameContainment",
        // @ts-expect-error TS2322
        processor: ChildMovedAndReplacedInSameContainmentFunction
    },
    {
        messageKind: "ChildMovedFromOtherContainment",
        // @ts-expect-error TS2322
        processor: ChildMovedFromOtherContainmentFunction
    },
    {
        messageKind: "ChildMovedFromOtherContainmentInSameParent",
        // @ts-expect-error TS2322
        processor: ChildMovedFromOtherContainmentInSameParentFunction
    },
    {
        messageKind: "ChildMovedInSameContainment",
        // @ts-expect-error TS2322
        processor: ChildMovedInSameContainmentFunction
    },
    {
        messageKind: "ChildReplaced",
        // @ts-expect-error TS2322
        processor: ChildReplacedFunction
    },
    {
        messageKind: "ReferenceAdded",
        // @ts-expect-error TS2322
        processor: ReferenceAddedFunction
    },
    {
        messageKind: "ReferenceChanged",
        // @ts-expect-error TS2322
        processor: ReferenceChangedFunction
    },
    {
        messageKind: "ReferenceDeleted",
        // @ts-expect-error TS2322
        processor: ReferenceDeletedFunction
    },
    {
        messageKind: "AnnotationAdded",
        // @ts-expect-error TS2322
        processor: AnnotationAddedFunction
    },
    {
        messageKind: "AnnotationDeleted",
        // @ts-expect-error TS2322
        processor: AnnotationDeletedFunction
    },
    {
        messageKind: "AnnotationReplaced",
        // @ts-expect-error TS2322
        processor: AnnotationReplacedFunction
    },
    {
        messageKind: "AnnotationMovedFromOtherParent",
        // @ts-expect-error TS2322
        processor: AnnotationMovedFromOtherParentFunction
    },
    {
        messageKind: "AnnotationMovedInSameParent",
        // @ts-expect-error TS2322
        processor: AnnotationMovedInSameParentFunction
    },
    {
        messageKind: "AnnotationMovedAndReplacedFromOtherParent",
        // @ts-expect-error TS2322
        processor: AnnotationMovedAndReplacedFromOtherParentFunction
    },
    {
        messageKind: "AnnotationMovedAndReplacedInSameParent",
        // @ts-expect-error TS2322
        processor: AnnotationMovedAndReplacedInSameParentFunction
    },
    {
        messageKind: "ErrorEvent",
        // @ts-expect-error TS2322
        processor: ErrorFunction
    },
    {
        messageKind: "NoOpEvent",
        // @ts-expect-error TS2322
        processor: NoOpEventFunction
    },
]
