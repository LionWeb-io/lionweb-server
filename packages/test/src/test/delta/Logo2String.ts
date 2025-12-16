import { LionWebJsonNode } from "@lionweb/server-delta-shared"
import { LionWebJsonChunkWrapper, NodeUtils } from "@lionweb/json-utils"
import { isEqualMetaPointer } from "@lionweb/json"
import { CLASSIFIER, CONTAINMENT, PROPERTY, REFERENCE } from "./keys.js"

export class Logo2String {
    chunkWrapper: LionWebJsonChunkWrapper
    constructor(nodes: LionWebJsonNode[]) {
        this.chunkWrapper = new LionWebJsonChunkWrapper({
            languages: [],
            nodes: nodes,
            serializationFormatVersion: "2023.1"
        })

    }

    logo2string(): string {
        let result = ""
        for (const library of this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Library)) {
            result += this.library2string(library, "")
        }
        result += "\n"
        for (const program of this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Program)) {
            result += this.program2string(program, "")
        }
        return result
    }

    program2string(program: LionWebJsonNode, indent: string): string {
        let result = `Program ${this.name(program)}\n`
        const commands = NodeUtils.findContainment(program, CONTAINMENT.ProgramCommands)
        if (commands !== undefined) {
            for (const cmdId of commands.children) {
                const cmd = this.chunkWrapper.getNode(cmdId)
                result += this.cmd2string(cmd, indent + "    ")
            }
        } else {
            result += indent + "<empty>"
        }
        return result
    }

    library2string(library: LionWebJsonNode, indent: string): string {
        let result = `Library ${this.name(library)}\n`
        const procedures = NodeUtils.findContainment(library, CONTAINMENT.LibraryProcedures)
        if (procedures !== undefined) {
            for (const procedureId of procedures.children) {
                const procedure = this.chunkWrapper.getNode(procedureId)
                result += this.procedure2string(procedure, indent + "    ")
            }
        } else {
            result += indent + "<empty>"
        }
        return result
    }

    procedure2string(procedure: LionWebJsonNode, indent: string): string {
        let result = indent + `TO ${this.name(procedure)}\n`
        const commands = NodeUtils.findContainment(procedure, CONTAINMENT.ProcedureBody)
        if (commands !== undefined) {
            for (const cmdId of commands.children) {
                const cmd = this.chunkWrapper.getNode(cmdId)
                result += this.cmd2string(cmd, indent + "    ")
            }
        } else {
            result += "<empty>"
        }
        return result
    }

    cmd2string(node: LionWebJsonNode, indent: string): string {
        let result = indent
        if (isEqualMetaPointer(node.classifier, CLASSIFIER.Forward)) {
            result += `FORWARD ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)?.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.Backward)) {
            result += `BACKWARD ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)?.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.MoveCommand)) {
            result += `abstract MOVE ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)?.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.Left)) {
            result += `LEFT ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)?.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.Right)) {
            result += `RIGHT ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)?.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.PenUp)) {
            result += `PENUP`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.PenDown)) {
            result += `PENDOWN`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.SetPos)) {
            result += `SETPOS ${NodeUtils.findProperty(node, PROPERTY.SetPosX)?.value} ${
                NodeUtils.findProperty(node, PROPERTY.SetPosY)?.value
            }`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.SetHeading)) {
            result += `HEADING ${NodeUtils.findProperty(node, PROPERTY.HeadingDegrees)!.value}`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.HomeCommand)) {
            result += `HOME`
        } else if (isEqualMetaPointer(node.classifier, CLASSIFIER.ProcedureCall)) {
            const reference = NodeUtils.findReference(node, REFERENCE.ProcedureCallProcedure)
            result += `CALL [${reference === undefined ? "<unknown>" : reference.targets.map(t => t.reference)}]`
        } else {
            result += `UNKNOWM COMMAND ${JSON.stringify(node.classifier)}` 
        }
        return result + "\n"
    }

    name(node: LionWebJsonNode): string {
        return NodeUtils.findProperty(node, PROPERTY.INamedName)?.value
    }
}


