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
    ErrorEvent,
    NoOpEvent,
    PartitionAddedEvent,
    PartitionDeletedEvent,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    ReferenceAddedEvent,
    ReferenceChangedEvent,
    ReferenceDeletedEvent,
    ReferenceResolveInfoAddedEvent,
    ReferenceResolveInfoChangedEvent,
    ReferenceResolveInfoDeletedEvent,
    ReferenceTargetAddedEvent,
    ReferenceTargetChangedEvent,
    ReferenceTargetDeletedEvent
} from "@lionweb/server-delta-shared"
import WebSocket from "ws"
import { ReceivingDelta } from "../ProcessingTypes.js"

const ClassifierChangedFunction = (socket: WebSocket, msg: ClassifierChangedEvent): void => {
    console.log("Called ClassifierChangedFunction " + msg.messageKind)
}

const PartitionAddedFunction = (socket: WebSocket, msg: PartitionAddedEvent): void => {
        console.log("Called PartitionAddedFunction " + msg.messageKind)
    }

const PartitionDeletedFunction = (socket: WebSocket, msg: PartitionDeletedEvent): void => {
        console.log("Called PartitionDeletedFunction " + msg.messageKind)
    }

const PropertyAddedFunction = (socket: WebSocket, msg: PropertyAddedEvent): void => {
        console.log("Called PropertyAddedFunction " + msg.messageKind)
    }

const PropertyDeletedFunction = (socket: WebSocket, msg: PropertyDeletedEvent): void => {
        console.log("Called PropertyDeletedFunction " + msg.messageKind)
    }

const PropertyChangedFunction = (socket: WebSocket, msg: PropertyChangedEvent): void => {
        console.log("Called PropertyChangedFunction " + msg.messageKind)
    }

const ChildAddedFunction = (socket: WebSocket, msg: ChildAddedEvent): void => {
        console.log("Called ChildAddedFunction " + msg.messageKind)
    }

const ChildDeletedFunction = (socket: WebSocket, msg: ChildDeletedEvent): void => {
        console.log("Called ChildDeletedFunction " + msg.messageKind)
    }

const ChildReplacedFunction = (socket: WebSocket, msg: ChildReplacedEvent): void => {
        console.log("Called ChildReplacedFunction " + msg.messageKind)
    }

const ChildMovedFromOtherContainmentFunction = (socket: WebSocket, msg: ChildMovedFromOtherContainmentEvent): void => {
        console.log("Called ChildMovedFromOtherContainmentFunction " + msg.messageKind)
    }

const ChildMovedFromOtherContainmentInSameParentFunction = (socket: WebSocket, msg: ChildMovedFromOtherContainmentInSameParentEvent): void => {
        console.log("Called ChildMovedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

const ChildMovedInSameContainmentFunction = (socket: WebSocket, msg: ChildMovedInSameContainmentEvent): void => {
        console.log("Called ChildMovedInSameContainmentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedFromOtherContainmentFunction = (socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentEvent): void => {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedFromOtherContainmentInSameParentFunction = (socket: WebSocket, msg: ChildMovedAndReplacedFromOtherContainmentInSameParentEvent): void => {
        console.log("Called ChildMovedAndReplacedFromOtherContainmentInSameParentFunction " + msg.messageKind)
    }

const ChildMovedAndReplacedInSameContainmentFunction = (socket: WebSocket, msg: ChildMovedAndReplacedInSameContainmentEvent): void => {
        console.log("Called ChildMovedAndReplacedInSameContainmentFunction " + msg.messageKind)
    }

const AnnotationAddedFunction = (socket: WebSocket, msg: AnnotationAddedEvent): void => {
        console.log("Called AnnotationAddedFunction " + msg.messageKind)
    }

const AnnotationDeletedFunction = (socket: WebSocket, msg: AnnotationDeletedEvent): void => {
        console.log("Called AnnotationDeletedFunction " + msg.messageKind)
    }

const AnnotationReplacedFunction = (socket: WebSocket, msg: AnnotationReplacedEvent): void => {
        console.log("Called AnnotationReplacedFunction " + msg.messageKind)
    }

const AnnotationMovedFromOtherParentFunction = (socket: WebSocket, msg: AnnotationMovedFromOtherParentEvent): void => {
        console.log("Called AnnotationMovedFromOtherParentFunction " + msg.messageKind)
    }

const AnnotationMovedInSameParentFunction = (socket: WebSocket, msg: AnnotationMovedInSameParentEvent): void => {
        console.log("Called AnnotationMovedInSameParentFunction " + msg.messageKind)
    }

const AnnotationMovedAndReplacedFromOtherParentFunction = (socket: WebSocket, msg: AnnotationMovedAndReplacedFromOtherParentEvent): void => {
        console.log("Called AnnotationMovedAndReplacedFromOtherParentFunction " + msg.messageKind)
    }

const AnnotationMovedAndReplacedInSameParentFunction = (socket: WebSocket, msg: AnnotationMovedAndReplacedInSameParentEvent): void => {
        console.log("Called AnnotationMovedAndReplacedInSameParentFunction " + msg.messageKind)
    }

const ReferenceAddedFunction = (socket: WebSocket, msg: ReferenceAddedEvent): void => {
        console.log("Called ReferenceAddedFunction " + msg.messageKind)
    }

const ReferenceDeletedFunction = (socket: WebSocket, msg: ReferenceDeletedEvent): void => {
        console.log("Called ReferenceDeletedFunction " + msg.messageKind)
    }

const ReferenceChangedFunction = (socket: WebSocket, msg: ReferenceChangedEvent): void => {
        console.log("Called ReferenceChangedFunction " + msg.messageKind)
    }

const EntryMovedFromOtherReferenceFunction = (socket: WebSocket, msg: EntryMovedFromOtherReferenceEvent): void => {
        console.log("Called EntryMovedFromOtherReferenceFunction " + msg.messageKind)
    }

const EntryMovedFromOtherReferenceInSameParentFunction = (socket: WebSocket, msg: EntryMovedFromOtherReferenceInSameParentEvent): void => {
        console.log("Called EntryMovedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

const EntryMovedInSameReferenceFunction = (socket: WebSocket, msg: EntryMovedInSameReferenceEvent): void => {
        console.log("Called EntryMovedInSameReferenceFunction " + msg.messageKind)
    }

const EntryMovedAndReplacedFromOtherReferenceFunction = (socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceEvent): void => {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceFunction " + msg.messageKind)
    }

const EntryMovedAndReplacedFromOtherReferenceInSameParentFunction = (socket: WebSocket, msg: EntryMovedAndReplacedFromOtherReferenceInSameParentEvent): void => {
        console.log("Called EntryMovedAndReplacedFromOtherReferenceInSameParentFunction " + msg.messageKind)
    }

const EntryMovedAndReplacedInSameReferenceFunction = (socket: WebSocket, msg: EntryMovedAndReplacedInSameReferenceEvent): void => {
        console.log("Called EntryMovedAndReplacedInSameReferenceFunction " + msg.messageKind)
    }

const ReferenceResolveInfoAddedFunction = (socket: WebSocket, msg: ReferenceResolveInfoAddedEvent): void => {
        console.log("Called ReferenceResolveInfoAddedFunction " + msg.messageKind)
    }

const ReferenceResolveInfoDeletedFunction = (socket: WebSocket, msg: ReferenceResolveInfoDeletedEvent): void => {
        console.log("Called ReferenceResolveInfoDeletedFunction " + msg.messageKind)
    }

const ReferenceResolveInfoChangedFunction = (socket: WebSocket, msg: ReferenceResolveInfoChangedEvent): void => {
        console.log("Called ReferenceResolveInfoChangedFunction " + msg.messageKind)
    }

const ReferenceTargetAddedFunction = (socket: WebSocket, msg: ReferenceTargetAddedEvent): void => {
        console.log("Called ReferenceTargetAddedFunction " + msg.messageKind)
    }

const ReferenceTargetDeletedFunction = (socket: WebSocket, msg: ReferenceTargetDeletedEvent): void => {
        console.log("Called ReferenceTargetDeletedFunction " + msg.messageKind)
    }

const ReferenceTargetChangedFunction = (socket: WebSocket, msg: ReferenceTargetChangedEvent): void => {
        console.log("Called ReferenceTargetChangedFunction " + msg.messageKind)
    }

const ErrorFunction = (socket: WebSocket, msg: ErrorEvent): void => {
        console.log("Called ErrorFunction " + msg.messageKind)
    }

const NoOpEventFunction = (socket: WebSocket, msg: NoOpEvent): void => {
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
        messageKind: "ReferenceResolveInfoAdded",
        // @ts-expect-error TS2322
        processor: ReferenceResolveInfoAddedFunction
    },
    {
        messageKind: "ReferenceResolveInfoChanged",
        // @ts-expect-error TS2322
        processor: ReferenceResolveInfoChangedFunction
    },
    {
        messageKind: "ReferenceResolveInfoDeleted",
        // @ts-expect-error TS2322
        processor: ReferenceResolveInfoDeletedFunction
    },
    {
        messageKind: "ReferenceTargetAdded",
        // @ts-expect-error TS2322
        processor: ReferenceTargetAddedFunction
    },
    {
        messageKind: "ReferenceTargetChanged",
        // @ts-expect-error TS2322
        processor: ReferenceTargetChangedFunction
    },
    {
        messageKind: "ReferenceTargetDeleted",
        // @ts-expect-error TS2322
        processor: ReferenceTargetDeletedFunction
    },
    {
        messageKind: "EntryMovedAndReplacedFromOtherReference",
        // @ts-expect-error TS2322
        processor: EntryMovedAndReplacedFromOtherReferenceFunction
    },
    {
        messageKind: "EntryMovedFromOtherReferenceInSameParent",
        // @ts-expect-error TS2322
        processor: EntryMovedFromOtherReferenceInSameParentFunction
    },
    {
        messageKind: "EntryMovedInSameReference",
        // @ts-expect-error TS2322
        processor: EntryMovedInSameReferenceFunction
    },
    {
        messageKind: "EntryMovedFromOtherReference",
        // @ts-expect-error TS2322
        processor: EntryMovedFromOtherReferenceFunction
    },
    {
        messageKind: "EntryMovedAndReplacedInSameReference",
        // @ts-expect-error TS2322
        processor: EntryMovedAndReplacedInSameReferenceFunction
    },
    {
        messageKind: "EntryMovedAndReplacedFromOtherReferenceInSameParent",
        // @ts-expect-error TS2322
        processor: EntryMovedAndReplacedFromOtherReferenceInSameParentFunction
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
        messageKind: "NoOp",
        // @ts-expect-error TS2322
        processor: NoOpEventFunction
    },
]
