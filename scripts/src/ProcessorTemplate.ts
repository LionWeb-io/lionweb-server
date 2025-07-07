import { Definition, DefinitionSchema, isObjectDefinition, TaggedUnionDefinition } from "@lionweb/validation"

export class ProcessorTemplate {

    schema: DefinitionSchema
    typePostFix: string

    constructor(schema: DefinitionSchema, typePostFix: string) {
        this.schema = schema
        this.typePostFix = typePostFix
    }
    
    classTemplate(): string {
        return `export class ${this.typePostFix}Processor {
            ${this.switchTemplate()}
            ${this.processorTemplate()}
        }`
    }
    
    switchTemplate(): string {
        return this.schema.unionDefinitions.map(tu => {
            const dis = tu.unionType
            const messagesForType = this.messageForTag(tu)
            return `
                process(message: ${dis}): void {
                    switch (message.${tu.unionProperty}) {
                        ${messagesForType.map(msg =>
                        `case "${msg.name}" : {
                                 this.process${this.tsType(msg.name)}(message)
                                 break;
                             }
                        `).join("\n")}
                    }
                }
            `
        }).join("\n")
    }

    tsType(type: string): string {
        const typeDef = this.schema.getDefinition(type)
        return isObjectDefinition(typeDef) ? `${type}${this.typePostFix}` : type
    }


    processorTemplate(): string {
        return this.schema.unionDefinitions.map(tu => {
            const dis = tu.unionType
            const messagesForType = this.messageForTag(tu)
            return `
                ${messagesForType.map(msg => 
                    `process${this.tsType(msg.name)}(message: ${this.tsType(msg.name)}) {
                        console.log("Processing message ${msg.name}")    
                    }`).join("\n")}
                `}).join("\n")
    }
    
    private messageForTag(type: TaggedUnionDefinition): Definition[] {
        return this.schema.definitions().filter(def => isObjectDefinition(def) && def.taggedUnionType === type.unionType)

    }
}
