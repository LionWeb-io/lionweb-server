import { CLASSIFIER, GreaterThan, If, Left, Library, MoveCommand, NumbericLiteral, Program } from "./keys.js"
import { LionWebModel } from "./LionWebModel.js"
import { LionWebTree, LionWebTreeConverter } from "./LionWebTree.js"

export const ProgramTree: LionWebTree = {
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
    ]
}

export const LibraryTree: LionWebTree = {
    type: Library,
    id: "id-library",
    INamedName: "Library One"
}
 
const converter = new LionWebTreeConverter()

converter.convert(ProgramTree)
export const ProgramModel = new LionWebModel(converter.getConvertedNodes())
export const newModel = ProgramModel.nodes()
console.log(`Model ${ProgramModel.asString()}`)

converter.convert(LibraryTree)
export const LibraryModel = new LionWebModel(converter.getConvertedNodes())
// ProgramModel.addPartition(converter.getConvertedNodes())
// console.log(`LibraryModel ${ProgramModel.asString()}`)
//
// const ifC = ProgramModel.getNode("id-if")
// const lib = ProgramModel.getNode("id-library")



