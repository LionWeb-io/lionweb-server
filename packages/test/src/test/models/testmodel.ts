import {
    CLASSIFIER,
    CONTAINMENT,
    GreaterThan,
    If,
    Left,
    Library,
    MoveCommand,
    NumbericLiteral,
    Procedure,
    Program,
    PROPERTY,
    REFERENCE
} from "./keys.js"
import { LionWebModel } from "./LionWebModel.js"
import { LionWebTree, LionWebTreeConverter } from "./LionWebTree.js"

type LionWebLogoTree = LionWebTree<typeof PROPERTY, typeof CONTAINMENT, typeof REFERENCE>
export const ProgramTree: LionWebLogoTree = {
    type: Program,
    id: "id-program",
    INamedName: "Program",
    ProgramCommands: [
        {
            type: CLASSIFIER.HomeCommand,
            id: "id-home"
        },
        {
            type: MoveCommand,
            id: "id-move",
            MoveCommandDistance: "11"
        },
        {
            type: Left,
            id: "id-left"
        },
        {
            type: If,
            id: "id-if",
            IfCondition: [
                {
                    type: GreaterThan,
                    id: "id-gt",
                    GreaterThanLeft: [
                        {
                            type: NumbericLiteral,
                            id: "id-gtl",
                            NumbericLiteralValue: "12"
                        }
                    ],
                    GreaterThanRight: [
                        {
                            type: NumbericLiteral,
                            id: "id-gtr",
                            NumbericLiteralValue: "28"
                        }
                    ]
                }
            ]
        }
    ],
    annotations: [
        {
            id: "id-annotation",
            type: CLASSIFIER.HomeCommand,
            INamedName: "HomeCommand as Annotation"
        },
        {
            id: "id-annotation-penup",
            type: CLASSIFIER.PenUp,
            INamedName: "PenUp as Annotation"
        }
    ]
}

export const LibraryTree: LionWebLogoTree = {
    type: Library,
    id: "id-library",
    INamedName: "Library One",
    LibraryProcedures: [
        {
            type: CLASSIFIER.Procedure,
            id: "id-procedure",
            INamedName: "DoSomething",
            ProcedureBody: [
                {
                    type: CLASSIFIER.HomeCommand,
                    id: "id-p1-home"
                }
            ],
            ProcedureParameter: [
                {
                    type: CLASSIFIER.Parameter,
                    id: "id-p1-param1",
                    INamedName: "param1"
                },
                {
                    type: CLASSIFIER.Parameter,
                    id: "id-p1-param2",
                    INamedName: "param2"
                }
            ]
        }
    ],
    annotations: [ {
        id: "id-annotation-pendown",
        type: CLASSIFIER.PenDown,
        INamedName: "PenDown as Annotation"
    }]
}

export let ProgramModel: LionWebModel = new LionWebModel([])
export let LibraryModel: LionWebModel = new LionWebModel([])
export let programNodes = ProgramModel.nodes()
export let libraryNodes = LibraryModel.nodes()

export function resetModels(): void {
    const converter = new LionWebTreeConverter()
    converter.convert(ProgramTree)
    ProgramModel = new LionWebModel(converter.getConvertedNodes())
    converter.convert(LibraryTree)
    LibraryModel = new LionWebModel(converter.getConvertedNodes())
    programNodes = ProgramModel.nodes()
    programNodes = ProgramModel.nodes()
    libraryNodes = LibraryModel.nodes()
}



// ProgramModel.addPartition(converter.getConvertedNodes())
// console.log(`LibraryModel ${ProgramModel.asString()}`)
//
// const ifC = ProgramModel.getNode("id-if")
// const lib = ProgramModel.getNode("id-library")



