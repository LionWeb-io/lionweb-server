import { LionWebJsonNode } from "@lionweb/server-delta-shared"
import { LionWebJsonChunkWrapper, NodeUtils } from "@lionweb/json-utils"
import { CLASSIFIER, CONTAINMENT, PROPERTY } from "./keys.js"

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
        console.log(`Fopund libraries ${this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Library).length}`)
        for (const library of this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Library)) {
            result += this.library2string(library)
        }
        result += "\n"
        console.log(`Found programs ${this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Program).length}`)
        for (const program of this.chunkWrapper.findNodesOfClassifier(CLASSIFIER.Program)) {
            result += this.program2string(program, 0)
        }
        return result
    }

    program2string(program: LionWebJsonNode, indent: number): string {
        let result = `Program ${this.name(program)}\n`
        const commands = NodeUtils.findContainment(program, CONTAINMENT.ProgramCommands)
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

    library2string(library: LionWebJsonNode): string {
        let result = `Library ${this.name(library)}\n`
        const procedures = NodeUtils.findContainment(library, CONTAINMENT.LibraryProcedures)
        if (procedures !== undefined) {
            for (const procedureId of procedures.children) {
                const procedure = this.chunkWrapper.getNode(procedureId)
                result += this.procedure2string(procedure, "    ")
            }
        } else {
            result += "<empty>"
        }
        return result
    }

    procedure2string(procedure: LionWebJsonNode, indent: string): string {
        let result = indent + `TO ${this.name(procedure)}\n`
        for (const cmdId of NodeUtils.findContainment(procedure, CONTAINMENT.ProcedureBody).children) {
            const cmd = this.chunkWrapper.getNode(cmdId)
            result += this.cmd2string(cmd, indent + "    ")
        }
        return result
    }

    cmd2string(node: LionWebJsonNode, indent: string): string {
        let result = indent
        if (node.classifier === CLASSIFIER.Forward) {
            result += `FORWARD ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)!.value}`
        } else if (node.classifier === CLASSIFIER.Backward) {
            result += `BACKWARD ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)!.value}`
        } else if (node.classifier === CLASSIFIER.MoveCommand) {
            result += `abstract MOVE ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)!.value}`
        } else if (node.classifier === CLASSIFIER.Left) {
            result += `LEFT ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)!.value}`
        } else if (node.classifier === CLASSIFIER.Right) {
            result += `RIGHT ${NodeUtils.findProperty(node, PROPERTY.MoveCommandDistance)!.value}`
        } else if (node.classifier === CLASSIFIER.PenUp) {
            result += `PENUP`
        } else if (node.classifier === CLASSIFIER.PenDown) {
            result += `PENDOWN`
        } else if (node.classifier === CLASSIFIER.SetPos) {
            result += `SETPOS ${NodeUtils.findProperty(node, PROPERTY.SetPosX)!.value} ${
                NodeUtils.findProperty(node, PROPERTY.SetPosY)!.value
            }`
        } else if (node.classifier === CLASSIFIER.SetHeading) {
            result += `HEADING ${NodeUtils.findProperty(node, PROPERTY.HeadingDegrees)!.value}`
        } else if (node.classifier === CLASSIFIER.HomeCommand) {
            result += `HOME`
        }
        return result + "\n"
    }

    name(node: LionWebJsonNode): string {
        return NodeUtils.findProperty(node, PROPERTY.INamedName)?.value
    }
}


