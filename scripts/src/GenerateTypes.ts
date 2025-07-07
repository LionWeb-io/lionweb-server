import { DeltaCommandSchema, DeltaEventSchema, DeltaQuerySchema, DeltaSharedSchema } from "@lionweb/repository-delta"
import fs from "fs"
import { ProcessorTemplate } from "./ProcessorTemplate.js"
import { TypeTemplates } from "./TypeTemplates.js"

const commandTargetFile = "../packages/shared/src/delta/CommandTypes.ts"
const eventTargetFile = "../packages/shared/src/delta/EventTypes.ts"
const sharedTargetFile = "../packages/shared/src/delta/SharedTypes.ts"
const queryTargetFile = "../packages/shared/src/delta/QueryTypes.ts"

const processEventFile = "../packages/shared/src/delta/EventProcessor.ts"
const processCommandFile = "../packages/shared/src/delta/CommandProcessor.ts"

const eventTemplate = new TypeTemplates(DeltaEventSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt", "Event")
const commandTemplate = new TypeTemplates(DeltaCommandSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd", "Command")
const eventProcessorTemplate = new ProcessorTemplate(DeltaEventSchema, "Event")
const commandProcessorTemplate = new ProcessorTemplate(DeltaCommandSchema, "Command")



const commands = commandTemplate.commandTemplate()
const events = eventTemplate.commandTemplate()
const shared = eventTemplate.sharedTemplate(DeltaSharedSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#")
const queries = eventTemplate.sharedTemplate(DeltaQuerySchema, "https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#")

const processEvents = eventProcessorTemplate.classTemplate()
const processCommands = commandProcessorTemplate.classTemplate()

fs.writeFileSync(commandTargetFile, TypeTemplates.pretty(commands, "LionWeb Types Generator"));
fs.writeFileSync(eventTargetFile, TypeTemplates.pretty(events, "LionWeb Types Generator"));
fs.writeFileSync(sharedTargetFile, TypeTemplates.pretty(shared, "LionWeb Types Generator"));
fs.writeFileSync(queryTargetFile, TypeTemplates.pretty(queries, "LionWeb Types Generator"));

fs.writeFileSync(processEventFile, TypeTemplates.pretty(processEvents, "LionWeb Types Generator"));
fs.writeFileSync(processCommandFile, TypeTemplates.pretty(processCommands, "LionWeb Types Generator"));
