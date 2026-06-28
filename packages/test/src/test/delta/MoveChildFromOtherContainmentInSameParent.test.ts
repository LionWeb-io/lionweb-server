import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, programNodes, resetModels } from "../models/testmodel.js"
import { LibraryProcedures, ProcedureBody, ProgramCommands } from "../models/keys.js"
import { cmd, expectError, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("MoveChildFromOtherContainmentInSameParent-$withoutHistory ", async ({ withoutHistory }) => {
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

    test("MoveChildFromOtherContainmentInSameParent", async () => {
        resetModels()

        const partitionP = cmd.addFullPartition(client, programNodes)
        const partitionL = cmd.addFullPartition(client, libraryNodes)
        await expectEvent(client, partitionP, "PartitionAdded")
        await expectEvent(client, partitionL, "PartitionAdded")
        // console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        console.log(`MY ProgramModel ${ProgramModel.asString()}`)

        const moveErr1 = cmd.moveChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-never", // incorrect
            parent: ifC.parent,
            oldContainment: ProgramCommands,
            oldIndex: 3,
            newContainment: ProcedureBody,
            newIndex: 0,
        })
        await expectError(client, moveErr1, "unknownNode")
        const moveErr2 = cmd.moveChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-if",
            parent: "id-library", // incorrect
            oldContainment: LibraryProcedures,
            oldIndex: 3,
            newContainment: ProcedureBody,
            newIndex: 0,
        })
        await expectError(client, moveErr2, "indexEntryMismatch")
        const moveErr3 = cmd.moveChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-if",
            parent: "id-program",
            oldContainment: ProgramCommands,
            oldIndex: 2, // incorrect
            newContainment: ProcedureBody,
            newIndex: 0,
        })
        await expectError(client, moveErr3, "indexEntryMismatch")
        const moveErr4 = cmd.moveChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-if",
            parent: "id-program",
            oldContainment: ProgramCommands,
            oldIndex: 3,
            newContainment: ProcedureBody,
            newIndex: 6, // incorrect
        })
        await expectError(client, moveErr4, "unknownIndex")
        const move = cmd.moveChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-if",
            parent: "id-program",
            oldContainment: ProgramCommands,
            oldIndex: 3,
            newContainment: ProcedureBody,
            newIndex: 0,
        })
        await expectEvent(client, move, "ChildMovedFromOtherContainmentInSameParent")
        ProgramModel.applyDelta(move)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
