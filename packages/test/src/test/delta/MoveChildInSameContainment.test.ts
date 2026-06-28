import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, programNodes, resetModels } from "../models/testmodel.js"
import { CONTAINMENT, LibraryProcedures, ProcedureBody, ProgramCommands } from "../models/keys.js"
import { cmd, expectError, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("MoveInSameContainment-$withoutHistory ", async ({ withoutHistory }) => {
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

    test("MoveChildInSameContainment", async () => {
        resetModels()

        const partitionP = cmd.addFullPartition(client, programNodes)
        const partitionL = cmd.addFullPartition(client, libraryNodes)
        await expectEvent(client, partitionP, "PartitionAdded")
        await expectEvent(client, partitionL, "PartitionAdded")
        // console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        const moveErr2 = cmd.moveChildInSameContainment(client,
            CONTAINMENT.ProcedureParameter,  ProgramModel.getNode("id-p1-param1"), 1, 0)
        await expectError(client, moveErr2, "indexEntryMismatch")
        // const moveErr3 = cmd.moveChildInSameContainment(client,
        // Validate old and new index are different.
        //     CONTAINMENT.ProcedureParameter,  ProgramModel.getNode("id-p1-param1"), 0, 0)
        // await expectError(client, moveErr3, "indexEntryMismatch")
        const moveErr4 = cmd.moveChildInSameContainment(client,
            CONTAINMENT.ProcedureParameter,  ProgramModel.getNode("id-p1-param1"), 10, 20)
        await expectError(client, moveErr4, "indexEntryMismatch")

        const move = cmd.moveChildInSameContainment(client,
            CONTAINMENT.ProcedureParameter,  ProgramModel.getNode("id-p1-param2"), 1, 0)
        await expectEvent(client, move, "ChildMovedInSameContainment")
        ProgramModel.applyDelta(move)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
    
})
