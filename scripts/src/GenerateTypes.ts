import { commandMap, Event_Definitions_Map, sharedMap } from "@lionweb/repository-delta"
import fs from "fs"
import { TypeTemplates } from "./TypeTemplates.js"

const commandTargetFile = "../packages/shared/src/delta/CommandTypes.ts"
const eventTargetFile = "../packages/shared/src/delta/EventTypes.ts"
const sharedTargetFile = "../packages/shared/src/delta/SharedTypes.ts"

const typesTemplate = new TypeTemplates()



const commands = typesTemplate.commandTemplate(commandMap, "https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/commands.adoc#cmd")
const events = typesTemplate.eventTemplate(Event_Definitions_Map, "https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/events.adoc#evnt")
const shared = typesTemplate.sharedTemplate(sharedMap, "https://github.com/LionWeb-io/specification/blob/niko/delta-api-spec/delta/introduction.adoc#")

fs.writeFileSync(commandTargetFile, TypeTemplates.pretty(commands, "LionWeb Types Generator"));
fs.writeFileSync(eventTargetFile, TypeTemplates.pretty(events, "LionWeb Types Generator"));
fs.writeFileSync(sharedTargetFile, TypeTemplates.pretty(shared, "LionWeb Types Generator"));
