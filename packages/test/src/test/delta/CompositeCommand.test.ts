import { CompositeEvent } from "@lionweb/server-delta-shared"
import { test, describe, beforeAll, beforeEach, afterAll, expect } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, resetModels } from "../models/testmodel.js"
import { CLASSIFIER } from "../models/keys.js"
import { cmd, expectEvent, logProtocol } from "./test-helpers.js"
import { client, checkClient, logoModel, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("Composite-$withoutHistory", async ({ withoutHistory }) => {
    beforeAll(async function () {
        await beforeAllTests(withoutHistory)
    })

    afterAll(async function () {
        afterAllTests()
    })

    beforeEach(async function () {
        client.sentMessageHistory = []
        client.receivedMessageHistory = []
    })

    test("CompositeCommand", async () => {
        resetModels()
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        // console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        // console.log(`MY ProgramModel ${ProgramModel.asString()}`)

        const composite = cmd.compositeCommandCmd();
        const annCmd1 = cmd.addAnnotationCmd(client, {
            parent: "id-if",  
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation2",
            props: []
            
        })
 
        const annCmd2 = cmd.addAnnotationCmd(client, {
            parent: "id-if",      
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation4",
            props: []

        })
        composite.parts.push(annCmd1)
        composite.parts.push(annCmd2)
        client.sendCommand(composite)
        await expectEvent(client, composite, "CompositeEvent")
        const compositeEvent = await cmd.eventFor(client, composite) as CompositeEvent

        expect(compositeEvent.parts[0].messageKind).toBe("AnnotationAdded")
        expect(compositeEvent.parts[1].messageKind).toBe("AnnotationAdded")
        
        ProgramModel.applyDelta(composite)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
