import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, resetModels } from "../models/testmodel.js"
import { cmd, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("ContinuedCommand-$withoutHistory", async ({ withoutHistory }) => {
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

    test("ContinuedComment", async () => {
        resetModels()
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        console.log(ProgramModel.asString())
        // For the in-memory model, just add the full partition.
        ProgramModel.addPartition(libraryNodes)

        const partitionCmd = cmd.addFullPartitionCmd(client, [])
        const allNodes = LibraryModel.nodes()
        const nrNodes = allNodes.length
        partitionCmd.newPartition.nodes.push(allNodes[0])
        partitionCmd.split = true
        console.log(`PartitionCommand id is ${partitionCmd.commandId}`)
        client.sendCommand(partitionCmd)
        for (let i = 1; i < allNodes.length; i++) {
            const continuedCommand = cmd.continuedCommand(i-1, [allNodes[i]], i === allNodes.length-1)
            client.sendCommand(continuedCommand)
        }

        await expectEvent(client, partitionP, "PartitionAdded")
        await expectEvent(client, partitionCmd, "PartitionAdded")
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
    
})
