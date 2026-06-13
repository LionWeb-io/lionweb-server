import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LibraryModel, libraryNodes, ProgramModel, resetModels } from "../models/testmodel.js"
import { CLASSIFIER } from "../models/keys.js"
import { cmd, expectError, expectEvent, logProtocol } from "./test-helpers.js"
import { client, beforeAllTests, bulkApiClient, log, afterAllTests, withoutHistoryList } from "./SharedTest.js"

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
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.addAnnotation(client, {
            parent: "id-none",      // incorrect
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation2",
            props: []
            
        })
        await expectError(client, annErr, "unknownNode")

        const annCmd = cmd.addAnnotation(client, {
            parent: "id-if",      // incorrect
            index: 0,
            cls: CLASSIFIER.HomeCommand,
            id: "id-annotation2",
            props: []

        })
        await expectEvent(client, annCmd, "AnnotationAdded")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("DeleteAnnotation", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        // await expectError(client, partitionP, "idsAlreadyInUse")
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.deleteAnnotation(client, "id-none", "id-annotation2", 0)
        await expectError(client, annErr, "unknownNode")

        const annDeleted = cmd.deleteAnnotation(client, "id-program", "id-annotation", 0)
        await expectEvent(client, annDeleted, "AnnotationDeleted")
        ProgramModel.applyDelta(annDeleted)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("ReplaceAnnotation", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")
        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.replaceAnnotation(client, "id-annotation", {
            parent: "id-none",      // incorrect
            index: 0,
            cls: CLASSIFIER.NumbericLiteral,
            id: "id-annotation2",
            props: []

        })
        await expectError(client, annErr, "unknownNode")

        const annCmd = cmd.replaceAnnotation(client, "id-annotation", {
            parent: "id-program",      // incorrect
            index: 0,
            cls: CLASSIFIER.NumbericLiteral,
            id: "id-annotation2",
            props: []

        })
        await expectEvent(client, annCmd, "AnnotationReplaced")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("MoveAnnotationFromOther", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")

        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.moveAnnotationFromOther(client, "id-annotation-none", 0, "id-program", 0, "id-library")
        await expectError(client, annErr, "indexEntryMismatch")

        const annCmd = cmd.moveAnnotationFromOther(client, "id-annotation", 0, "id-program", 0, "id-library")
        await expectEvent(client, annCmd, "AnnotationMovedFromOtherParent")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("MoveAnnotationFromSameParent", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")

        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.moveAnnotationInSameParent(client, "id-annotation-none", "id-program", 0, 1)
        await expectError(client, annErr, "indexEntryMismatch")

        const annCmd = cmd.moveAnnotationInSameParent(client, "id-annotation", "id-program", 0, 1)
        await expectEvent(client, annCmd, "AnnotationMovedInSameParent")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("MoveAndReplaceAnnotationFromOtherParent", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")

        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.moveAndReplaceAnnotationFromOtherParent(client, "id-annotation-none", 0, "id-program", 0, "id-library", "id-annotation")
        await expectError(client, annErr, "unknownNode")

        const annCmd = cmd.moveAndReplaceAnnotationFromOtherParent(client, "id-annotation", 0, "id-program", 0, "id-library", "id-annotation-pendown")
        await expectEvent(client, annCmd, "AnnotationMovedAndReplacedFromOtherParent")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })

    test("MoveAndReplaceAnnotationInSameParent", async () => {
        resetModels()
        cmd.deletePartition(client, "id-program")
        cmd.deletePartition(client, "id-library")

        const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
        const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
        ProgramModel.addPartition(libraryNodes)

        const annErr = cmd.moveAndReplaceAnnotationInSameParent(client, "id-annotation-none","id-program", 0, 1, "id-annotation")
        await expectError(client, annErr, "indexEntryMismatch")

        const annCmd = cmd.moveAndReplaceAnnotationInSameParent(client, "id-annotation","id-program", 0, 1, "id-annotation-penup")
        await expectEvent(client, annCmd, "AnnotationMovedAndReplacedInSameParent")
        ProgramModel.applyDelta(annCmd)
        await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)
    })
})
