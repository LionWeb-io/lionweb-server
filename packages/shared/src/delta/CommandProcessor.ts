import {
    AddAnnotationCommand,
    AddChildCommand,
    AddPartitionCommand,
    AddPropertyCommand,
    AddReferenceCommand, AddReferenceResolveInfoCommand, AddReferenceTargetCommand,
    ChangeClassifierCommand,
    ChangePropertyCommand,
    ChangeReferenceCommand, ChangeReferenceResolveInfoCommand, ChangeReferenceTargetCommand,
    CommandResponseCommand,
    CommandType, CompositeCommandCommand,
    DeleteAnnotationCommand,
    DeleteChildCommand,
    DeletePartitionCommand,
    DeletePropertyCommand,
    DeleteReferenceCommand, DeleteReferenceResolveInfoCommand, DeleteReferenceTargetCommand,
    MoveAndReplaceAnnotationFromOtherParentCommand,
    MoveAndReplaceAnnotationInSameParentCommand,
    MoveAndReplaceChildFromOtherContainmentCommand,
    MoveAndReplaceChildFromOtherContainmentInSameParentCommand,
    MoveAndReplaceChildInSameContainmentCommand,
    MoveAndReplaceEntryFromOtherReferenceCommand,
    MoveAndReplaceEntryFromOtherReferenceInSameParentCommand,
    MoveAndReplaceEntryInSameReferenceCommand,
    MoveAnnotationFromOtherParentCommand,
    MoveAnnotationInSameParentCommand,
    MoveChildFromOtherContainmentCommand,
    MoveChildFromOtherContainmentInSameParentCommand,
    MoveChildInSameContainmentCommand,
    MoveEntryFromOtherReferenceCommand,
    MoveEntryFromOtherReferenceInSameParentCommand,
    MoveEntryInSameReferenceCommand,
    ReplaceAnnotationCommand,
    ReplaceChildCommand
} from "./CommandTypes.js"

export class CommandProcessor {
    process(message: CommandType): void {
        switch (message.messageKind) {
            case "CommandResponse": {
                this.processCommandResponseCommand(message);
                break;
            }

            case "AddPartition": {
                this.processAddPartitionCommand(message);
                break;
            }

            case "DeletePartition": {
                this.processDeletePartitionCommand(message);
                break;
            }

            case "ChangeClassifier": {
                this.processChangeClassifierCommand(message);
                break;
            }

            case "AddProperty": {
                this.processAddPropertyCommand(message);
                break;
            }

            case "DeleteProperty": {
                this.processDeletePropertyCommand(message);
                break;
            }

            case "ChangeProperty": {
                this.processChangePropertyCommand(message);
                break;
            }

            case "AddChild": {
                this.processAddChildCommand(message);
                break;
            }

            case "DeleteChild": {
                this.processDeleteChildCommand(message);
                break;
            }

            case "ReplaceChild": {
                this.processReplaceChildCommand(message);
                break;
            }

            case "MoveChildFromOtherContainment": {
                this.processMoveChildFromOtherContainmentCommand(message);
                break;
            }

            case "MoveChildFromOtherContainmentInSameParent": {
                this.processMoveChildFromOtherContainmentInSameParentCommand(message);
                break;
            }

            case "MoveChildInSameContainment": {
                this.processMoveChildInSameContainmentCommand(message);
                break;
            }

            case "MoveAndReplaceChildFromOtherContainment": {
                this.processMoveAndReplaceChildFromOtherContainmentCommand(message);
                break;
            }

            case "MoveAndReplaceChildFromOtherContainmentInSameParent": {
                this.processMoveAndReplaceChildFromOtherContainmentInSameParentCommand(message);
                break;
            }

            case "MoveAndReplaceChildInSameContainment": {
                this.processMoveAndReplaceChildInSameContainmentCommand(message);
                break;
            }

            case "AddAnnotation": {
                this.processAddAnnotationCommand(message);
                break;
            }

            case "DeleteAnnotation": {
                this.processDeleteAnnotationCommand(message);
                break;
            }

            case "ReplaceAnnotation": {
                this.processReplaceAnnotationCommand(message);
                break;
            }

            case "MoveAnnotationFromOtherParent": {
                this.processMoveAnnotationFromOtherParentCommand(message);
                break;
            }

            case "MoveAnnotationInSameParent": {
                this.processMoveAnnotationInSameParentCommand(message);
                break;
            }

            case "MoveAndReplaceAnnotationFromOtherParent": {
                this.processMoveAndReplaceAnnotationFromOtherParentCommand(message);
                break;
            }

            case "MoveAndReplaceAnnotationInSameParent": {
                this.processMoveAndReplaceAnnotationInSameParentCommand(message);
                break;
            }

            case "AddReference": {
                this.processAddReferenceCommand(message);
                break;
            }

            case "DeleteReference": {
                this.processDeleteReferenceCommand(message);
                break;
            }

            case "ChangeReference": {
                this.processChangeReferenceCommand(message);
                break;
            }

            case "MoveEntryFromOtherReference": {
                this.processMoveEntryFromOtherReferenceCommand(message);
                break;
            }

            case "MoveEntryFromOtherReferenceInSameParent": {
                this.processMoveEntryFromOtherReferenceInSameParentCommand(message);
                break;
            }

            case "MoveEntryInSameReference": {
                this.processMoveEntryInSameReferenceCommand(message);
                break;
            }

            case "MoveAndReplaceEntryFromOtherReference": {
                this.processMoveAndReplaceEntryFromOtherReferenceCommand(message);
                break;
            }

            case "MoveAndReplaceEntryFromOtherReferenceInSameParent": {
                this.processMoveAndReplaceEntryFromOtherReferenceInSameParentCommand(message);
                break;
            }

            case "MoveAndReplaceEntryInSameReference": {
                this.processMoveAndReplaceEntryInSameReferenceCommand(message);
                break;
            }

            case "AddReferenceResolveInfo": {
                this.processAddReferenceResolveInfoCommand(message);
                break;
            }

            case "DeleteReferenceResolveInfo": {
                this.processDeleteReferenceResolveInfoCommand(message);
                break;
            }

            case "ChangeReferenceResolveInfo": {
                this.processChangeReferenceResolveInfoCommand(message);
                break;
            }

            case "AddReferenceTarget": {
                this.processAddReferenceTargetCommand(message);
                break;
            }

            case "DeleteReferenceTarget": {
                this.processDeleteReferenceTargetCommand(message);
                break;
            }

            case "ChangeReferenceTarget": {
                this.processChangeReferenceTargetCommand(message);
                break;
            }

            case "CompositeCommand": {
                this.processCompositeCommandCommand(message);
                break;
            }
        }
    }

    processCommandResponseCommand(message: CommandResponseCommand) {
        console.log("Processing message CommandResponse");
    }
    processAddPartitionCommand(message: AddPartitionCommand) {
        console.log("Processing message AddPartition");
    }
    processDeletePartitionCommand(message: DeletePartitionCommand) {
        console.log("Processing message DeletePartition");
    }
    processChangeClassifierCommand(message: ChangeClassifierCommand) {
        console.log("Processing message ChangeClassifier");
    }
    processAddPropertyCommand(message: AddPropertyCommand) {
        console.log("Processing message AddProperty");
    }
    processDeletePropertyCommand(message: DeletePropertyCommand) {
        console.log("Processing message DeleteProperty");
    }
    processChangePropertyCommand(message: ChangePropertyCommand) {
        console.log("Processing message ChangeProperty");
    }
    processAddChildCommand(message: AddChildCommand) {
        console.log("Processing message AddChild");
    }
    processDeleteChildCommand(message: DeleteChildCommand) {
        console.log("Processing message DeleteChild");
    }
    processReplaceChildCommand(message: ReplaceChildCommand) {
        console.log("Processing message ReplaceChild");
    }
    processMoveChildFromOtherContainmentCommand(message: MoveChildFromOtherContainmentCommand) {
        console.log("Processing message MoveChildFromOtherContainment");
    }
    processMoveChildFromOtherContainmentInSameParentCommand(message: MoveChildFromOtherContainmentInSameParentCommand) {
        console.log("Processing message MoveChildFromOtherContainmentInSameParent");
    }
    processMoveChildInSameContainmentCommand(message: MoveChildInSameContainmentCommand) {
        console.log("Processing message MoveChildInSameContainment");
    }
    processMoveAndReplaceChildFromOtherContainmentCommand(message: MoveAndReplaceChildFromOtherContainmentCommand) {
        console.log("Processing message MoveAndReplaceChildFromOtherContainment");
    }
    processMoveAndReplaceChildFromOtherContainmentInSameParentCommand(message: MoveAndReplaceChildFromOtherContainmentInSameParentCommand) {
        console.log("Processing message MoveAndReplaceChildFromOtherContainmentInSameParent");
    }
    processMoveAndReplaceChildInSameContainmentCommand(message: MoveAndReplaceChildInSameContainmentCommand) {
        console.log("Processing message MoveAndReplaceChildInSameContainment");
    }
    processAddAnnotationCommand(message: AddAnnotationCommand) {
        console.log("Processing message AddAnnotation");
    }
    processDeleteAnnotationCommand(message: DeleteAnnotationCommand) {
        console.log("Processing message DeleteAnnotation");
    }
    processReplaceAnnotationCommand(message: ReplaceAnnotationCommand) {
        console.log("Processing message ReplaceAnnotation");
    }
    processMoveAnnotationFromOtherParentCommand(message: MoveAnnotationFromOtherParentCommand) {
        console.log("Processing message MoveAnnotationFromOtherParent");
    }
    processMoveAnnotationInSameParentCommand(message: MoveAnnotationInSameParentCommand) {
        console.log("Processing message MoveAnnotationInSameParent");
    }
    processMoveAndReplaceAnnotationFromOtherParentCommand(message: MoveAndReplaceAnnotationFromOtherParentCommand) {
        console.log("Processing message MoveAndReplaceAnnotationFromOtherParent");
    }
    processMoveAndReplaceAnnotationInSameParentCommand(message: MoveAndReplaceAnnotationInSameParentCommand) {
        console.log("Processing message MoveAndReplaceAnnotationInSameParent");
    }
    processAddReferenceCommand(message: AddReferenceCommand) {
        console.log("Processing message AddReference");
    }
    processDeleteReferenceCommand(message: DeleteReferenceCommand) {
        console.log("Processing message DeleteReference");
    }
    processChangeReferenceCommand(message: ChangeReferenceCommand) {
        console.log("Processing message ChangeReference");
    }
    processMoveEntryFromOtherReferenceCommand(message: MoveEntryFromOtherReferenceCommand) {
        console.log("Processing message MoveEntryFromOtherReference");
    }
    processMoveEntryFromOtherReferenceInSameParentCommand(message: MoveEntryFromOtherReferenceInSameParentCommand) {
        console.log("Processing message MoveEntryFromOtherReferenceInSameParent");
    }
    processMoveEntryInSameReferenceCommand(message: MoveEntryInSameReferenceCommand) {
        console.log("Processing message MoveEntryInSameReference");
    }
    processMoveAndReplaceEntryFromOtherReferenceCommand(message: MoveAndReplaceEntryFromOtherReferenceCommand) {
        console.log("Processing message MoveAndReplaceEntryFromOtherReference");
    }
    processMoveAndReplaceEntryFromOtherReferenceInSameParentCommand(message: MoveAndReplaceEntryFromOtherReferenceInSameParentCommand) {
        console.log("Processing message MoveAndReplaceEntryFromOtherReferenceInSameParent");
    }
    processMoveAndReplaceEntryInSameReferenceCommand(message: MoveAndReplaceEntryInSameReferenceCommand) {
        console.log("Processing message MoveAndReplaceEntryInSameReference");
    }
    processAddReferenceResolveInfoCommand(message: AddReferenceResolveInfoCommand) {
        console.log("Processing message AddReferenceResolveInfo");
    }
    processDeleteReferenceResolveInfoCommand(message: DeleteReferenceResolveInfoCommand) {
        console.log("Processing message DeleteReferenceResolveInfo");
    }
    processChangeReferenceResolveInfoCommand(message: ChangeReferenceResolveInfoCommand) {
        console.log("Processing message ChangeReferenceResolveInfo");
    }
    processAddReferenceTargetCommand(message: AddReferenceTargetCommand) {
        console.log("Processing message AddReferenceTarget");
    }
    processDeleteReferenceTargetCommand(message: DeleteReferenceTargetCommand) {
        console.log("Processing message DeleteReferenceTarget");
    }
    processChangeReferenceTargetCommand(message: ChangeReferenceTargetCommand) {
        console.log("Processing message ChangeReferenceTarget");
    }
    processCompositeCommandCommand(message: CompositeCommandCommand) {
        console.log("Processing message CompositeCommand");
    }
}
