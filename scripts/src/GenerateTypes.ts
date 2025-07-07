import { DeltaCommandSchema, DeltaEventSchema, DeltaQuerySchema, DeltaSharedSchema } from "@lionweb/repository-delta"
import fs from "fs"
import { TypeTemplates } from "./TypeTemplates.js"

const commandTargetFile = "../packages/shared/src/delta/CommandTypes.ts"
const eventTargetFile = "../packages/shared/src/delta/EventTypes.ts"
const sharedTargetFile = "../packages/shared/src/delta/SharedTypes.ts"
const queryTargetFile = "../packages/shared/src/delta/QueryTypes.ts"

const typesTemplate = new TypeTemplates()



const commands = typesTemplate.commandTemplate(DeltaCommandSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/commands.adoc#cmd")
const events = typesTemplate.commandTemplate(DeltaEventSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/events.adoc#evnt")
const shared = typesTemplate.sharedTemplate(DeltaSharedSchema, "https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#")
const queries = typesTemplate.sharedTemplate(DeltaQuerySchema, "https://github.com/LionWeb-io/specification/blob/main/delta/introduction.adoc#")

fs.writeFileSync(commandTargetFile, TypeTemplates.pretty(commands, "LionWeb Types Generator"));
fs.writeFileSync(eventTargetFile, TypeTemplates.pretty(events, "LionWeb Types Generator"));
fs.writeFileSync(sharedTargetFile, TypeTemplates.pretty(shared, "LionWeb Types Generator"));
fs.writeFileSync(queryTargetFile, TypeTemplates.pretty(queries, "LionWeb Types Generator"));
