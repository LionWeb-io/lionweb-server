import { ChangeClassifierCommand } from "@lionweb/server-delta-shared"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, resetModels } from "../models/testmodel.js"
import { CLASSIFIER } from "../models/keys.js"
import { cmd, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("ChangeClassifier-$withoutHistory", async ({ withoutHistory }) => {
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

    test("ChangeClassifier", async () => {
        resetModels()
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        console.log(`MY ProgramModel ${ProgramModel.asString()}`)
        
        const changeClassifier: ChangeClassifierCommand = {
            messageKind: "ChangeClassifier",
            commandId: "chanheC",
            additionalInfos: [],
            node: "id-library",
            newClassifier: CLASSIFIER.Program
        }
        client.sendCommand(changeClassifier)
        // await expectError(client, move, "queryError")
        await expectEvent(client, changeClassifier, "ClassifierChanged")
        ProgramModel.applyDelta(changeClassifier)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
        
        const changeClassifierToNew: ChangeClassifierCommand = {
            messageKind: "ChangeClassifier",
            commandId: "chanheB",
            additionalInfos: [],
            node: "id-library",
            newClassifier: CLASSIFIER.List
        }
        client.sendCommand(changeClassifierToNew)
        // await expectError(client, move, "queryError")
        await expectEvent(client, changeClassifierToNew, "ClassifierChanged")
        ProgramModel.applyDelta(changeClassifierToNew)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
