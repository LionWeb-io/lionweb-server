import { TypeDefinition, isObjectDefinition, isPrimitiveDefinition } from "@lionweb/validation"
import { commandMap } from "./CommandDefinitions.js"
import { Event_Definitions_Map } from "./EventDefinitions.js"

let result = `import { LionWebId, LionWebJsonNode, LionWebJsonMetaPointer } from "@lionweb/json"
import { ResponseMessage } from "@lionweb/repository-shared"
import { ICommand } from "./DeltaCommands.js"
`
Event_Definitions_Map.forEach((value: TypeDefinition, key: string) => {
    if (isObjectDefinition(value)) {
        result += `
/**
  *  @see https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd-${key}
  */
export type ${key} = ICommand & {
${value.map((propDef) => `    ${propDef.property}${(propDef.isOptional? "?":"")} : ${propDef.expectedType}${propDef.isList?"[]":""}`).join(",\n")}
}
`
    } else if (isPrimitiveDefinition(value)) {
        result += `
export type ${key} = ${value.primitiveType}
`
    }
})
console.log(result)
