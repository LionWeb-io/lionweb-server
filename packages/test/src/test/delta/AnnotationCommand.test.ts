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

describe.each(withoutHistoryList)("Annotations-$withoutHistory", async ({ withoutHistory }) => {
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

    test("AddAnnotation", async () => {
        resetModels()
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        console.log(`MY ProgramModel ${ProgramModel.asString()}`)

        const annErr = cmd.addAnnotation(client, {
            parent: "id-none",      // incorrect
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation",
            props: []
            
        })
        await expectError(client, annErr, "unknownNode")

        const annCmd = cmd.addAnnotation(client, {
            parent: "id-if",      // incorrect
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation",
            props: []

        })
        await expectEvent(client, annCmd, "AnnotationAdded")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("DeleteAnnotation", async () => {
        resetModels()
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        console.log(ProgramModel.asString())
        const ifC = ProgramModel.getNode("id-if")
        const lib = LibraryModel.getNode("id-library")
        ProgramModel.addPartition(libraryNodes)

        console.log(`MY ProgramModel ${ProgramModel.asString()}`)

        const annErr = cmd.deleteAnnotation(client, "id-none", "id-annotation", 0)
        await expectError(client, annErr, "unknownNode")

        const annDeleted = cmd.deleteAnnotation(client, "id-if", "id-annotation", 0)
        await expectEvent(client, annDeleted, "AnnotationDeleted")
        ProgramModel.applyDelta(annDeleted)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
