import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, programNodes, resetModels } from "../models/testmodel.js"
import { CONTAINMENT, ProcedureBody, ProgramCommands } from "../models/keys.js"
import { cmd, expectError, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

describe.each(withoutHistoryList)("MoveAndReplaceChildFromOtherContainmentInSameParent-$withoutHistory ", async ({ withoutHistory }) => {

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

    test("MoveAndReplaceChildFromOtherContainmentInSameParent", async () => {
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

        const moveErr1 = cmd.moveAndReplaceChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-never", // incorrect
            parent: ifC.parent,
            oldContainment: ProgramCommands,
            oldIndex: 3,
            newContainment: ProcedureBody,
            newIndex: 0,
            replacedChild: "id-any",
        })
        await expectError(client, moveErr1, "unknownNode")
        const moveErr3 = cmd.moveAndReplaceChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-if",
            parent: "id-program", // incorrect
            oldContainment: ProgramCommands,
            oldIndex: 1,
            newContainment: ProcedureBody,
            newIndex: 0,
            replacedChild: "id-procedure",
        })
        await expectError(client, moveErr3, "indexEntryMismatch")

        const move = cmd.moveAndReplaceChildFromOtherContainmentInSameParent(client, {
            movedChild: "id-p1-param1",
            parent: "id-procedure", // incorrect
            oldContainment: CONTAINMENT.ProcedureParameter,
            oldIndex: 0,
            newContainment: CONTAINMENT.ProcedureBody,
            newIndex: 0,
            replacedChild: "id-p1-home",
        })

        await expectEvent(client, move, "ChildMovedAndReplacedFromOtherContainmentInSameParent")
        ProgramModel.applyDelta(move)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
