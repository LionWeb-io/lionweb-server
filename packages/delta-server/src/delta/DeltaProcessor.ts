import { DeltaValidator } from "@lionweb/repository-delta"
import {
    CommandType,
    QueryRequestType,
} from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import {
    AddAnnotationFunction,
    AddChildFunction,
    AddPartitionFunction,
    AddPropertyFunction,
    AddReferenceFunction, AddReferenceResolveInfoFunction, AddReferenceTargetFunction,
    ChangeClassifierFunction,
    ChangePropertyFunction,
    ChangeReferenceFunction, ChangeReferenceResolveInfoFunction, ChangeReferenceTargetFunction,
    CommandResponseFunction, CompositeCommandFunction,
    DeleteAnnotationFunction,
    DeleteChildFunction,
    DeletePartitionFunction,
    DeletePropertyFunction,
    DeleteReferenceFunction, DeleteReferenceResolveInfoFunction,
    DeleteReferenceTargetFunction,
    MoveAndReplaceAnnotationFromOtherParentFunction,
    MoveAndReplaceAnnotationInSameParentFunction,
    MoveAndReplaceChildFromOtherContainmentFunction,
    MoveAndReplaceChildFromOtherContainmentInSameParentFunction,
    MoveAndReplaceChildInSameContainmentFunction,
    MoveAndReplaceEntryFromOtherReferenceFunction,
    MoveAndReplaceEntryFromOtherReferenceInSameParentFunction,
    MoveAndReplaceEntryInSameReferenceFunction,
    MoveAnnotationFromOtherParentFunction,
    MoveAnnotationInSameParentFunction,
    MoveChildFromOtherContainmentFunction,
    MoveChildFromOtherContainmentInSameParentFunction,
    MoveChildInSameContainmentFunction,
    MoveEntryFromOtherReferenceFunction,
    MoveEntryFromOtherReferenceInSameParentFunction,
    MoveEntryInSameReferenceFunction,
    ReplaceAnnotationFunction,
    ReplaceChildFunction
} from "./commands/index.js"
import {
    GetAvailableIdsRequestFunction,
    ListPartitionsRequestFunction, ReconnectRequestFunction,
    SignOffRequestFunction,
    SignOnRequestFunction,
    SubscribeToChangingPartitionsRequestFunction,
    SubscribeToPartitionContentsRequestFunction,
    UnsubscribeFromPartitionContentsRequestFunction
} from "./queries/QueryProcessor.js"

const processingFunctions: Map<string, (msg: CommandType | QueryRequestType) => void> = new Map<string, (msg: CommandType | QueryRequestType) => void>();

// @ts-expect-error TS2345
processingFunctions.set("CommandResponse", CommandResponseFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddPartition", AddPartitionFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeletePartition", DeletePartitionFunction);

// @ts-expect-error TS2345
processingFunctions.set("ChangeClassifier", ChangeClassifierFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddProperty", AddPropertyFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteProperty", DeletePropertyFunction);

// @ts-expect-error TS2345
processingFunctions.set("ChangeProperty", ChangePropertyFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddChild", AddChildFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteChild", DeleteChildFunction);

// @ts-expect-error TS2345
processingFunctions.set("ReplaceChild", ReplaceChildFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveChildFromOtherContainment", MoveChildFromOtherContainmentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveChildFromOtherContainmentInSameParent", MoveChildFromOtherContainmentInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveChildInSameContainment", MoveChildInSameContainmentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceChildFromOtherContainment", MoveAndReplaceChildFromOtherContainmentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceChildFromOtherContainmentInSameParent", MoveAndReplaceChildFromOtherContainmentInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceChildInSameContainment", MoveAndReplaceChildInSameContainmentFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddAnnotation", AddAnnotationFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteAnnotation", DeleteAnnotationFunction);

// @ts-expect-error TS2345
processingFunctions.set("ReplaceAnnotation", ReplaceAnnotationFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAnnotationFromOtherParent", MoveAnnotationFromOtherParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAnnotationInSameParent", MoveAnnotationInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceAnnotationFromOtherParent", MoveAndReplaceAnnotationFromOtherParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceAnnotationInSameParent", MoveAndReplaceAnnotationInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddReference", AddReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteReference", DeleteReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("ChangeReference", ChangeReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveEntryFromOtherReference", MoveEntryFromOtherReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveEntryFromOtherReferenceInSameParent", MoveEntryFromOtherReferenceInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveEntryInSameReference", MoveEntryInSameReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceEntryFromOtherReference", MoveAndReplaceEntryFromOtherReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceEntryFromOtherReferenceInSameParent", MoveAndReplaceEntryFromOtherReferenceInSameParentFunction);

// @ts-expect-error TS2345
processingFunctions.set("MoveAndReplaceEntryInSameReference", MoveAndReplaceEntryInSameReferenceFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddReferenceResolveInfo", AddReferenceResolveInfoFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteReferenceResolveInfo", DeleteReferenceResolveInfoFunction);

// @ts-expect-error TS2345
processingFunctions.set("ChangeReferenceResolveInfo", ChangeReferenceResolveInfoFunction);

// @ts-expect-error TS2345
processingFunctions.set("AddReferenceTarget", AddReferenceTargetFunction);

// @ts-expect-error TS2345
processingFunctions.set("DeleteReferenceTarget", DeleteReferenceTargetFunction);

// @ts-expect-error TS2345
processingFunctions.set("ChangeReferenceTarget", ChangeReferenceTargetFunction);

// @ts-expect-error TS2345
processingFunctions.set("CompositeCommand", CompositeCommandFunction);

// @ts-expect-error TS2345
processingFunctions.set("SubscribeToChangingPartitionsRequest", SubscribeToChangingPartitionsRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("SubscribeToPartitionContentsRequest", SubscribeToPartitionContentsRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("UnsubscribeFromPartitionContentsRequest", UnsubscribeFromPartitionContentsRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("SignOnRequest", SignOnRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("SignOffRequest", SignOffRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("ListPartitionsRequest", ListPartitionsRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("GetAvailableIdsRequest", GetAvailableIdsRequestFunction);

// @ts-expect-error TS2345
processingFunctions.set("ReconnectRequest", ReconnectRequestFunction);

const deltaValidator = new DeltaValidator(new ValidationResult())

export function processDelta(delta: CommandType | QueryRequestType): void {
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
        console.error(`Validation errors:`)
        deltaValidator.validationResult.issues.forEach(issue => {
            console.error(issue.errorMsg())
        })
        return
    }
    // Finally ok
    func(delta)
}


