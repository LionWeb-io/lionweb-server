import { LionWebJsonNode } from "@lionweb/json"
import { LionWebJsonChunkWrapper } from "@lionweb/json-utils"
import { LionWebId, LionWebJsonMetaPointer, LionWebJsonProperty } from "@lionweb/server-delta-shared"
import { CLASSIFIER, CONTAINMENT, PROPERTY } from "./keys.js"

function newNode(mp: LionWebJsonMetaPointer, id: LionWebId): LionWebJsonNode {
    return {
        id: id,
        properties: [],
        containments: [],
        annotations: [],
        references: [],
        parent: null,
        classifier: mp,
    }
}

function property(property: LionWebJsonMetaPointer, value: string): LionWebJsonProperty {
    return { property: property, value: value}
}

function addChild(parent: LionWebJsonNode, containment: LionWebJsonMetaPointer,  child: LionWebJsonNode) {
    const nodeWrapper: LionWebJsonChunkWrapper = LionWebJsonChunkWrapper.fromNodesArray([parent, child])
    nodeWrapper.addChild(parent, containment, child)
    child.parent = parent.id
}

export const program = newNode(CLASSIFIER.Program, "Program")
const Move111 = newNode(CLASSIFIER.MoveCommand, "Move111")
Move111.properties = [ property(PROPERTY.MoveCommandDistance,"12") ]
addChild(program, CONTAINMENT.ProgramCommands, Move111)

const Left1 = newNode(CLASSIFIER.Left, "Left1")
addChild(program, CONTAINMENT.ProgramCommands, Left1)

const Move222 = newNode(CLASSIFIER.MoveCommand, "Move2")
addChild(program, CONTAINMENT.ProgramCommands, Move222)

const If2 = newNode(CLASSIFIER.If, "if2")
const gt = newNode(CLASSIFIER.GreaterThan, "gt")
const leftNum = newNode(CLASSIFIER.NumbericLiteral, "12")
leftNum.properties = [property(PROPERTY.NumbericLiteralValue, "12")]
const rightNum = newNode(CLASSIFIER.NumbericLiteral, "28")
rightNum.properties = [property(PROPERTY.NumbericLiteralValue, "28")]
addChild(gt, CONTAINMENT.GreaterThanLeft, leftNum)
addChild(gt, CONTAINMENT.GreaterThanRight, rightNum)
addChild(If2, CONTAINMENT.IfCondition, gt)
addChild(program, CONTAINMENT.ProgramCommands, If2)

export const ProgramNodes: LionWebJsonNode[] = [
    program, Move111, Move222, If2, gt, leftNum, rightNum, Left1
] 
