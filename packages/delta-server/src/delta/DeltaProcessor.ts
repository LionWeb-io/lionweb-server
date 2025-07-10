import { DeltaValidator } from "@lionweb/server-delta"
import { CommandType, QueryRequestType } from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import { ICommandProcessor } from "./commands/ICommandProcessor.js"
import { IQueryRequestProcessor } from "./queries/IQueryRequestProcessor.js"

type MessageFromClient = CommandType | QueryRequestType
type MessageFunction =  (msg: MessageFromClient) => void
    
export class DeltaProcessor {
    processingFunctions: Map<string, MessageFunction> = new Map<string, MessageFunction>()
    deltaValidator = new DeltaValidator(new ValidationResult())

    constructor(commands: ICommandProcessor, queries: IQueryRequestProcessor) {
        this.initialize(commands, queries)
    }

    initialize(commands: ICommandProcessor, queries: IQueryRequestProcessor) {
        this.processingFunctions.set("CommandResponse", commands.CommandResponseFunction as MessageFunction)
        this.processingFunctions.set("AddPartition", commands.AddPartitionFunction as MessageFunction)
        this.processingFunctions.set("DeletePartition", commands.DeletePartitionFunction as MessageFunction)
        this.processingFunctions.set("ChangeClassifier", commands.ChangeClassifierFunction as MessageFunction)
        this.processingFunctions.set("AddProperty", commands.AddPropertyFunction as MessageFunction)
        this.processingFunctions.set("DeleteProperty", commands.DeletePropertyFunction as MessageFunction)
        this.processingFunctions.set("ChangeProperty", commands.ChangePropertyFunction as MessageFunction)
        this.processingFunctions.set("AddChild", commands.AddChildFunction as MessageFunction)
        this.processingFunctions.set("DeleteChild", commands.DeleteChildFunction as MessageFunction)
        this.processingFunctions.set("ReplaceChild", commands.ReplaceChildFunction as MessageFunction)
        this.processingFunctions.set("MoveChildFromOtherContainment", commands.MoveChildFromOtherContainmentFunction as MessageFunction)
        this.processingFunctions.set("MoveChildFromOtherContainmentInSameParent", commands.MoveChildFromOtherContainmentInSameParentFunction as MessageFunction)
        this.processingFunctions.set("MoveChildInSameContainment", commands.MoveChildInSameContainmentFunction as MessageFunction)
        this.processingFunctions.set("MoveAndReplaceChildFromOtherContainment", commands.MoveAndReplaceChildFromOtherContainmentFunction as MessageFunction)
        this.processingFunctions.set(
            "MoveAndReplaceChildFromOtherContainmentInSameParent",
            commands.MoveAndReplaceChildFromOtherContainmentInSameParentFunction as MessageFunction
        )
        this.processingFunctions.set("MoveAndReplaceChildInSameContainment", commands.MoveAndReplaceChildInSameContainmentFunction as MessageFunction)
        this.processingFunctions.set("AddAnnotation", commands.AddAnnotationFunction as MessageFunction)
        this.processingFunctions.set("DeleteAnnotation", commands.DeleteAnnotationFunction as MessageFunction)
        this.processingFunctions.set("ReplaceAnnotation", commands.ReplaceAnnotationFunction as MessageFunction)
        this.processingFunctions.set("MoveAnnotationFromOtherParent", commands.MoveAnnotationFromOtherParentFunction as MessageFunction)
        this.processingFunctions.set("MoveAnnotationInSameParent", commands.MoveAnnotationInSameParentFunction as MessageFunction)
        this.processingFunctions.set("MoveAndReplaceAnnotationFromOtherParent", commands.MoveAndReplaceAnnotationFromOtherParentFunction as MessageFunction)
        this.processingFunctions.set("MoveAndReplaceAnnotationInSameParent", commands.MoveAndReplaceAnnotationInSameParentFunction as MessageFunction)
        this.processingFunctions.set("AddReference", commands.AddReferenceFunction as MessageFunction)
        this.processingFunctions.set("DeleteReference", commands.DeleteReferenceFunction as MessageFunction)
        this.processingFunctions.set("ChangeReference", commands.ChangeReferenceFunction as MessageFunction)
        this.processingFunctions.set("MoveEntryFromOtherReference", commands.MoveEntryFromOtherReferenceFunction as MessageFunction)
        this.processingFunctions.set("MoveEntryFromOtherReferenceInSameParent", commands.MoveEntryFromOtherReferenceInSameParentFunction as MessageFunction)
        this.processingFunctions.set("MoveEntryInSameReference", commands.MoveEntryInSameReferenceFunction as MessageFunction)
        this.processingFunctions.set("MoveAndReplaceEntryFromOtherReference", commands.MoveAndReplaceEntryFromOtherReferenceFunction as MessageFunction)
        this.processingFunctions.set(
            "MoveAndReplaceEntryFromOtherReferenceInSameParent",
            commands.MoveAndReplaceEntryFromOtherReferenceInSameParentFunction as MessageFunction)
        this.processingFunctions.set("MoveAndReplaceEntryInSameReference", commands.MoveAndReplaceEntryInSameReferenceFunction as MessageFunction)
        this.processingFunctions.set("AddReferenceResolveInfo", commands.AddReferenceResolveInfoFunction as MessageFunction)
        this.processingFunctions.set("DeleteReferenceResolveInfo", commands.DeleteReferenceResolveInfoFunction as MessageFunction)
        this.processingFunctions.set("ChangeReferenceResolveInfo", commands.ChangeReferenceResolveInfoFunction as MessageFunction)
        this.processingFunctions.set("AddReferenceTarget", commands.AddReferenceTargetFunction as MessageFunction)
        this.processingFunctions.set("DeleteReferenceTarget", commands.DeleteReferenceTargetFunction as MessageFunction)
        this.processingFunctions.set("ChangeReferenceTarget", commands.ChangeReferenceTargetFunction as MessageFunction)
        this.processingFunctions.set("CompositeCommand", commands.CompositeCommandFunction as MessageFunction)
        this.processingFunctions.set("SubscribeToChangingPartitionsRequest", queries.SubscribeToChangingPartitionsRequestFunction as MessageFunction)
        this.processingFunctions.set("SubscribeToPartitionContentsRequest", queries.SubscribeToPartitionContentsRequestFunction as MessageFunction)
        this.processingFunctions.set("UnsubscribeFromPartitionContentsRequest", queries.UnsubscribeFromPartitionContentsRequestFunction as MessageFunction)
        this.processingFunctions.set("SignOnRequest", queries.SignOnRequestFunction as MessageFunction)
        this.processingFunctions.set("SignOffRequest", queries.SignOffRequestFunction as MessageFunction)
        this.processingFunctions.set("ListPartitionsRequest", queries.ListPartitionsRequestFunction as MessageFunction)
        this.processingFunctions.set("GetAvailableIdsRequest", queries.GetAvailableIdsRequestFunction as MessageFunction)
        this.processingFunctions.set("ReconnectRequest", queries.ReconnectRequestFunction as MessageFunction)
    }

    processDelta(delta: CommandType | QueryRequestType): void {
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
            console.error(`Validation errors:`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                console.error(issue.errorMsg())
            })
            return
        }
        // Finally ok
        func(delta)
    }
}
