
import synchronizedPrettier from "@prettier/sync";
import { TypeDefinition, isObjectDefinition, isPrimitiveDefinition } from "@lionweb/validation"

type tmp = {
    key: string,
    value: TypeDefinition
}
export class TypeTemplates {

    commandTemplate(typeMap: Map<string, TypeDefinition>, doclinkRoot: string ): string {
        let result = `
            import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json"
            import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js"
            
            export type ICommand = {
                messageKind: CommandKind
                commandId: string
                protocolMessage?: ProtocolMessage
            }

            ${Array.from(typeMap).map((tuple: [string, TypeDefinition]) => {
            const key = tuple[0]
            const value = tuple[1]
                if (isObjectDefinition(value)) {
                    return`
                            /**
                              *  @see ${doclinkRoot}-${key}
                              */
                            export type ${key} = ICommand & {
                            ${value.map((propDef) => `${propDef.property}${(propDef.isOptional ? "?" : "")} : ${propDef.expectedType}${propDef.isList ? "[]" : ""} ${(propDef.expectedType === "CommandKind"?`   // === "${key}"`:"")}`).join(",\n")}
                            }
                            `
                } else if (isPrimitiveDefinition(value) && key !== "CommandKind") {
                    return  `
                            export type ${key} = ${value.primitiveType}
                            `
                }
            }).join("\n")}
            export type CommandKind = ${Array.from(typeMap.keys())
                                        .filter(key => key !== "CommandKind")
                                        .map(key => `"${key}"`).join((" | "))}
            `
        return result
    }

    eventTemplate(typeMap: Map<string, TypeDefinition>, doclinkRoot: string ): string {
        let result = `
            import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json"
            import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js"
            
            export type IEvent = {
                messageKind: EventKind
                protocolMessage?: ProtocolMessage
            }

            ${Array.from(typeMap).map((tuple: [string, TypeDefinition]) => {
            const key = tuple[0]
            const value = tuple[1]
            if (isObjectDefinition(value)) {
                return`
                            /**
                              *  @see ${doclinkRoot}-${key}
                              */
                            export type ${key} = IEvent & {
                            ${value.map((propDef) => `${propDef.property}${(propDef.isOptional ? "?" : "")} : ${propDef.expectedType}${propDef.isList ? "[]" : ""} ${(propDef.expectedType === "EventKind"?`   // === "${key}"`:"")}`).join(",\n")}
                            }
                            `
            } else if (isPrimitiveDefinition(value) && key !== "EventKind") {
                return  `
                            export type ${key} = ${value.primitiveType}
                            `
            }
        }).join("\n")}
        export type EventKind = ${Array.from(typeMap.keys()).filter(key => key !== "EventKind").map(key => `"${key}"`).join((" | "))}
        `
        return result
    }

    sharedTemplate(typeMap: Map<string, TypeDefinition>, doclinkRoot: string ): string {
        let result = `
            import { LionWebJsonNode } from "@lionweb/json"

            ${Array.from(typeMap).map((tuple: [string, TypeDefinition]) => {
            const key = tuple[0]
            const value = tuple[1]
            if (isObjectDefinition(value)) {
                return`
                            /**
                              *  @see ${doclinkRoot}-${key}
                              */
                            export type ${key} = {
                            ${value.map((propDef) => `${propDef.property}${(propDef.isOptional ? "?" : "")} : ${propDef.expectedType}${propDef.isList ? "[]" : ""}`).join(",\n")}
                            }
                            `
            } else if (isPrimitiveDefinition(value)) {
                return  `
                            export type ${key} = ${value.primitiveType}
                            `
            }
        }).join("\n")}
            `
        return result
    }

    public static pretty(typescriptFile: string, message: string): string {
        try {
            return (
                // parser: the language used
                // printWidth: the width of the lines
                // tabWidth: the width of a tab
                // plugins: the programming language used -- adds a predefined plugin for typescript
                synchronizedPrettier.format(typescriptFile, {
                    parser: "typescript",
                    plugins: [],
                    printWidth: 140,
                    tabWidth: 4,
                })
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Syntax error in generated code: " + message);
                console.log(typescriptFile)
            }
            return "// Generated by the Freon Language Generator." + "\n" + typescriptFile;
        }
    }
}
