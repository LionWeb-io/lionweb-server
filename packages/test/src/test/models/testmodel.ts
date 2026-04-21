import { CLASSIFIER, GreaterThan, If, Left, MoveCommand, NumbericLiteral, Program } from "./keys.js"
import { LionWebModel } from "./LionWebModel.js"
import { LionWebTree, LionWebTreeConverter } from "./LionWebTree.js"

const TXT11: LionWebTree = {
    type: Program,
    id: "id-program",
    INamedName: "Program",
    ProgramCommands: [
        {
            type: CLASSIFIER.HomeCommand,
            id: "id-home",
        },
        {
            type: MoveCommand,
            id: "id-move",
            MoveCommandDistance: "11",
        },
        {
            type: Left,
            id: "id-left",
        },
        {
            type: If,
            id: "if-id",
            IfCondition: [
                {
                    type: GreaterThan,
                    id: "gt",
                    GreaterThanLeft: [
                        {
                            type: NumbericLiteral,
                            id: "id-gtl",
                            NumbericLiteralValue: "12",
                        },
                    ],
                    GreaterThanRight: [
                        {
                            type: NumbericLiteral,
                            id: "id-gtr",
                            NumbericLiteralValue: "28",
                        },
                    ],
                },
            ],
        },
    ],
}


const converter = new LionWebTreeConverter()
converter.convert(TXT11)
const model = new LionWebModel(converter.getConvertedNodes())
console.log(`Model ${model.asString()}`)

export const newModel = model.nodes()
