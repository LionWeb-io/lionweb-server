
import synchronizedPrettier from "@prettier/sync";
import { TypeDefinition, isObjectDefinition, isPrimitiveDefinition, PrimitiveDefinition, PropertyDef, PropertyDefinition } from "@lionweb/validation"

type tmp = {
    key: string,
    value: TypeDefinition
}
export class TypeTemplates {

    commandTemplate(typeMap: Map<string, TypeDefinition>, doclinkRoot: string ): string {
        let result = `
            import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json"
            import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js"
            
            ${Array.from(typeMap).map((tuple: [string, TypeDefinition]) => {
            const key = tuple[0]
            const value = tuple[1]
                if (isObjectDefinition(value)) {
                    const extend = (value.extends ? `${value.extends} & ` : "")
                    return`
                            /**
                              *  @see ${doclinkRoot}-${key}
                              */
                            export type ${key} = ${extend} {
                            ${value.properties.map((propDef) => {
                                    const optional = (propDef.isOptional ? "?" : "")
                                    const isList = propDef.isList ? "[]" : ""
                                    return `${propDef.property}${optional} : ${propDef.expectedType}${isList} ${(propDef.isKey?`   // === "${key}"`:"")}`
                                }).join(",\n")
                            }
                            }
                            `
                } else if (isPrimitiveDefinition(value) && !value.isKey) {
                    return  `
                            export type ${key} = ${value.primitiveType}
                            `
                } else if (isPrimitiveDefinition(value) && value.isKey) {
                    const keyTypes = Array.from(typeMap.entries())
                        .filter(v => isObjectDefinition(v[1]) && (v[1].properties.find(p => p.expectedType === value.primitiveType)))
                    return `export type ${tuple[0]} = ${keyTypes.map(key => `"${key[0]}"`).join((" | "))}`
                }
            }).join("\n")}
            `
        return result
    }

    eventTemplate(typeMap: Map<string, TypeDefinition>, doclinkRoot: string ): string {
        let result = `
            import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json"
            import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js"
            
            ${Array.from(typeMap).map((tuple: [string, TypeDefinition]) => {
            const key = tuple[0]
            const value = tuple[1]
            if (isObjectDefinition(value)) {
                const extend = (value.extends ? `${value.extends} & ` : "")
                return`
                            /**
                              *  @see ${doclinkRoot}-${key}
                              */
                            export type ${key} = ${extend} {
                            ${value.properties.map((propDef) => `${propDef.property}${(propDef.isOptional ? "?" : "")} : ${propDef.expectedType}${propDef.isList ? "[]" : ""} ${(propDef.isKey?`   // === "${key}"`:"")}`).join(",\n")}
                            }
                            `
            } else if (isPrimitiveDefinition(value) && !value.isKey) {
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
                            ${value.properties.map((propDef) => `${propDef.property}${(propDef.isOptional ? "?" : "")} : ${propDef.expectedType}${propDef.isList ? "[]" : ""}`).join(",\n")}
                            }
                            `
            } else if (isPrimitiveDefinition(value) ) {
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
