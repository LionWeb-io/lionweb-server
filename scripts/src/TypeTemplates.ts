import synchronizedPrettier from "@prettier/sync";
import { DefinitionSchema, isObjectDefinition, isPrimitiveDefinition, PrimitiveDefinition } from "@lionweb/validation"

export class TypeTemplates {

    schema: DefinitionSchema
    doclinkRoot: string
    typePostFix: string
    
    constructor(schema: DefinitionSchema, doclinkRoot: string, typePostFix: string) {
        this.schema = schema
        this.doclinkRoot = doclinkRoot
        this.typePostFix = typePostFix
    }
    /** 
     * Convert a DefinitionSchema to a collection of typescript types
     */
    commandTemplate(): string {
        const referredTypes: Set<string> = new Set<string>()
        let result = `
            import { LionWebId, LionWebJsonMetaPointer } from "@lionweb/json"
            import { ProtocolMessage, LionWebJsonDeltaChunk } from "./SharedTypes.js"
            
            ${this.schema.definitions().map(def => {
                if (isObjectDefinition(def)) {
                    return`
                            /**
                              *  @see ${this.doclinkRoot}-${def.name}
                              */
                            export type ${def.name}${this.typePostFix} = {
                            ${def.properties.map((propDef) => {
                                    referredTypes.add(propDef.type)
                                    const optional = (propDef.isOptional ? "?" : "")
                                    const isList = propDef.isList ? "[]" : ""
                                    const isDiscriminator = this.schema.isTagProperty(propDef.name)
                                    if (isDiscriminator) {
                                        return `${propDef.name} : "${def.name}"`
                                    } else {
                                        return `${propDef.name}${optional} : ${this.tsType(propDef.type)}${isList}`
                                    }
                                }).join(",\n")
                        }
                            }
                            `
                } else if (isPrimitiveDefinition(def) && !this.schema.isUnionDiscriminator(def)){ //schdef.isTag) {
                    return  `
                            export type ${def.name} = ${def.primitiveType}
                            `
                } else if (isPrimitiveDefinition(def) && this.schema.isUnionDiscriminator(def)) {
                    const keyTypes = this.schema.definitions()
                        .filter(alldef => isObjectDefinition(alldef) && (alldef.properties.find(p => p.type === def.name)))
                    return `export type ${def.name} = ${keyTypes.map(key => `${key.name}${this.typePostFix}`).join((" | "))}`
                }
            }).join("\n")}
            `
        const defNames = this.schema.definitions().map(d => d.name)
        const imports = Array.from(referredTypes.values()).filter(ref => !defNames.includes(ref) )
        return `
                ${result}
        `
    }
    
    tsType(type: string): string {
        const typeDef = this.schema.getDefinition(type)
        return isObjectDefinition(typeDef) ? `${type}${this.typePostFix}` : type
    }


    sharedTemplate(typeMap: DefinitionSchema, doclinkRoot: string ): string {
        const referredTypes: Set<string> = new Set<string>()
        let result = `
            import { LionWebJsonNode } from "@lionweb/json"

            ${typeMap.definitions().map(def => {
            if (isObjectDefinition(def)) {
                return`
                            /**
                              *  @see ${doclinkRoot}-${def.name}
                              */
                            export type ${def.name} = {
                                ${def.properties.map((propDef) => {
                                    referredTypes.add(propDef.type)
                                    return`${propDef.name}${(propDef.isOptional ? "?" : "")} : ${propDef.type}${propDef.isList ? "[]" : ""}`
                                }).join(",\n")}
                            }
                            `
            } else if (isPrimitiveDefinition(def) ) {
                return  `
                            export type ${def.name} = ${def.primitiveType}
                            `
            }
        }).join("\n")}
            `
        const defNames = typeMap.definitions().map(d => d.name)
        const imports = Array.from(referredTypes.values()).filter(ref => !defNames.includes(ref) )
        return `
                ${result}
        `
    }

    public static pretty(typescriptFile: string, message: string): string {
        // return typescriptFile
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
