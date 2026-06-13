import { RepositoryClient } from "@lionweb/server-http-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import { GetAvailableIdsResponse, ListPartitionsResponse } from "@lionweb/server-delta-shared"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LionWebTreeConverter } from "../models/LionWebTree.js"
import { LibraryModel, libraryNodes, LibraryTree, ProgramModel, programNodes, ProgramTree, resetModels } from "../models/testmodel.js"
import { CLASSIFIER, ProcedureBody, ProgramCommands } from "../models/keys.js"
import { CoverageMap, cmd, expectError, expectEvent, expectResponse, logProtocol } from "./test-helpers.js"
import { client, checkClient, logoModel, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

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
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
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
        
        await expectEvent(client, partitionCmd, "PartitionAdded")
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
    
})
