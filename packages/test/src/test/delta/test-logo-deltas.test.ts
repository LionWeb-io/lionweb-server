import { RepositoryClient } from "@lionweb/server-http-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import {
    GetAvailableIdsResponse,
    ListPartitionsResponse
} from "@lionweb/server-delta-shared"
import { HttpSuccessCodes  } from "@lionweb/server-shared"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { LionWebTreeConverter } from "../models/LionWebTree.js"
import { LibraryModel, LibraryTree, ProgramModel, ProgramTree } from "../models/testmodel.js"
import { reportHTML } from "./helpers.js"
import { CLASSIFIER as CLS, CONTAINMENT, CONTAINMENT as CON, LibraryProcedures, ProgramCommands, PROPERTY as PROP, REFERENCE as REF } from "../models/keys.js"
import { LionWebModel } from "../models/LionWebModel.js"
import { CoverageMap, cmd, expectError, expectEvent, expectResponse, logProtocol } from "./test-helpers.test.js"

// TOPO Delta : primary key exception when nohistory = false 
const collection = [true]
const log: boolean = true

const config = {
    // hostname: "192.168.100.1",
    hostname: "127.0.0.1",
    port: 3005,
    timeout: 2000,
}

// Run all, tests with and without history
const client = new DeltaClient("test-logo", config, [eventFunctions, responseFunctions, adminResponseFunctions])
const checkClient = new DeltaClient("check-logo", config, [eventFunctions, responseFunctions, adminResponseFunctions])

collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    const bulkApiClient = new RepositoryClient({clientId: "BulkClient-01", repository: repository})
    const logoModel = new LionWebModel([])
    
    describe("Delta tests " + (withoutHistory ? "without history" : "with history"), async () => {
        // deltaApiClient01.deltaProcessor.
        client.repository = repository
        client.clientId = "DeltaClient-01"
        client.loggingOn = false
        // deltaApiClient01.customFunction = receiveDelta

        beforeAll(async function () {
            bulkApiClient.repository = repository
            const delResponse = await bulkApiClient.dbAdmin.deleteRepository(repository, "delete at start og test")
            if (delResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Could not delete repository (${repository}): ` + JSON.stringify(delResponse.body))
            } else {
                console.log(`Deleted repository (${repository}): ` + JSON.stringify(delResponse.body))
            }
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
            } else {
                console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
            }
            client.loggingOn = log
            await client.connect()
            const listReposRequest = cmd.listRepositories(client)
            // const deleteRepo = deleteRepository(repository)
            // await responseFor(deleteRepo)
            const addRepo = cmd.addRepository(client, repository)
            
            expect((await cmd.responseFor(client, addRepo)).messageKind).toEqual("CreateRepositoryAdminResponse")

            const signOn = cmd.signOnRequest(client, client.repository)

            expect((await cmd.responseFor(client, listReposRequest)).messageKind).toEqual("ListRepositoriesAdminResponse")
            await expectResponse(client, signOn, "SignOnResponse")
            expect(await cmd.responseFor(client, signOn)).toMatchObject({
                messageKind: "SignOnResponse",
                queryId: signOn.queryId,
                additionalInfos: [
                    {
                        data: [],
                        kind: "Info",
                        message: "SignOnRequest received ok",
                    },
                ],
            })
            
            // const subscribeToPartitionChanges = 
        })

        beforeEach(async function () {
            client.sentMessageHistory = []
            client.receivedMessageHistory = []
        })

        afterAll(async function () {
            // deltaApiClient01.sendRequest(newUnSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "Program-01",))
            console.log("CLOSING")
            client.socket.close()
            console.log("CLOSED")
            // const reply = await bulkApiClient.dbAdmin.deleteRepository(repository)
            // console.log(`afterEach.deleteRepository ${JSON.stringify(reply.body)}`)
            // console.log("DELETED")
            reportHTML(CoverageMap)
        })

        describe("Partition tests", () => {
            test("SignOnOff", async () => {
                // Signing on twice is ok
                const signOn = cmd.signOnRequest(client, repository)
                await expectResponse(client, signOn, "SignOnResponse")

                const signOff = cmd.signOffRequest(client)
                await expectResponse(client, signOff, "SignOffResponse")

                // SignOff twice is ok
                const signOff2 = cmd.signOffRequest(client)
                await expectError(client, signOff2, "notSignedOn")

                const availableIdsErr = cmd.availableIds(client)
                await expectError(client, availableIdsErr, "invalidParticipation")
                const listPartitions = cmd.listPartitions(client)
                await expectError(client, listPartitions, "invalidParticipation")
                const listAndSubscribePartitions = cmd.listAndSubscribePartitions(client)
                await expectError(client, listAndSubscribePartitions, "invalidParticipation")
                const inform = cmd.informAbout(client, 1)
                await expectError(client, inform, "invalidParticipation")
                const sub = cmd.subscribeToChangingPartitions(client)
                await expectError(client, sub, "invalidParticipation")
                
                const signOn2 = cmd.signOnRequest(client, repository)
                await expectResponse(client, signOn2, "SignOnResponse")

                const inform2 = cmd.informAbout(client, 1)
                await expectResponse(client, inform2, "InformAboutChangingPartitionsResponse")
                const sub2 = cmd.subscribeToChangingPartitions(client)
                await expectResponse(client, sub2, "SubscribeToChangingPartitionsResponse")

                const availableIds = cmd.availableIds(client)
                await expectResponse(client, availableIds, "GetAvailableIdsResponse")
                const ids = (await cmd.responseFor(client, availableIds)) as GetAvailableIdsResponse
                expect(ids.ids.length).toEqual(25)
            })
            test("AddPartition", async () => {
                
                // assert(initError === "", initError)
                const addPartitionCommand1 = cmd.addPartition(client, { id: "Program-01", classifier: CLS.Program })
                await expectEvent(client, addPartitionCommand1, "PartitionAdded")
                logoModel.applyDelta(addPartitionCommand1)

                const addPartitionCommand2 = cmd.addPartition(client, { id: "Program-01", classifier: CLS.Program })
                await expectError(client, addPartitionCommand2, "idsAlreadyInUse")

                const deletePartition = cmd.deletePartition(client, "Program-02")
                await expectError(client, deletePartition, "unknownNode")
                
                const deletePartitionOk = cmd.deletePartition(client, "Program-01")
                await expectEvent(client, deletePartitionOk, "PartitionDeleted")
                logoModel.applyDelta(deletePartitionOk)

                const addPartitionCommand3 = cmd.addPartition(client, { id: "Program-01", classifier: CLS.Program })
                await expectEvent(client, addPartitionCommand3, "PartitionAdded")
                logoModel.applyDelta(addPartitionCommand3)

                const unsubscribe = cmd.unSubscribeToPartitionRequest(client, repository, client.clientId, "Program-01")
                await expectResponse(client, unsubscribe, "UnsubscribeFromPartitionContentsResponse")
                const unsubscribe2 = cmd.unSubscribeToPartitionRequest(client, repository, client.clientId, "Program-01")
                await expectError(client, unsubscribe2, "notSubscribed")

                const subscribe = cmd.subscribeToPartitionContentsRequest(client, "Program-01")
                await expectResponse(client, subscribe, "SubscribeToPartitionContentsResponse")

                const unsubscribe3 = cmd.unSubscribeToPartitionRequest(client, repository, client.clientId, "Program-01")
                await expectResponse(client, unsubscribe3, "UnsubscribeFromPartitionContentsResponse")

                await logProtocol(client, bulkApiClient, ["Program-01"], log)   
                console.log("LionWebModel")
                console.log(logoModel.asString())
                // const snapshot = await makeSnapShot()
            })
            
            test("Properties", async () => {
                const subscribeAll = cmd.listAndSubscribePartitions(client)
                await expectResponse(client, subscribeAll, "ListAndSubscribePartitionsResponse")
                
                const deletePropertyCmd = cmd.deleteProperty(client, "Program-01", "-key-Partition-name")
                const addPropertyCmd = cmd.addProperty(client, "Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
                const addPropertyCmdE1 = cmd.addProperty(client, "Program-11", "draw nothing", "LionCore-builtins-INamed-name")

                const deletePropertyCmd2 = cmd.deleteProperty(client, "Program-01", "LionCore-builtins-INamed-name")
                const deletePropertyCmd3 = cmd.deleteProperty(client, "Program-01", "-key-Partition-name")
                const addPropertyCmd2 = cmd.addProperty(client, "Program-01", "draw rectangle again", "LionCore-builtins-INamed-name")

                const changePropertyCmd = cmd.changeProperty(client, "Program-01", "draw a rectangle", "LionCore-builtins-INamed-name")
                const changePropertyE1 = cmd.changeProperty(client, "Program-21", "draw a line", "LionCore-builtins-INamed-name")
                const changePropertyE2 = cmd.changeProperty(client, "Program-01", "draw a cricle", "-key-Program-name")

                await expectError(client, deletePropertyCmd, "unknownProperty")
                await expectEvent(client, addPropertyCmd, "PropertyAdded")
                logoModel.applyDelta(addPropertyCmd)
                await expectError(client, addPropertyCmdE1, "nodeDoesNotExist")
                await expectEvent(client, deletePropertyCmd2, "PropertyDeleted")
                logoModel.applyDelta(deletePropertyCmd2)
                await expectError(client, deletePropertyCmd3, "unknownProperty")
                const event = await cmd.eventFor(client, addPropertyCmd2)
                console.log(`Error ${JSON.stringify(addPropertyCmd2)}`)
                console.log(`Error ${JSON.stringify(event)}`)
                await expectEvent(client, addPropertyCmd2, "PropertyAdded")
                logoModel.applyDelta(addPropertyCmd2)
                await expectEvent(client, changePropertyCmd, "PropertyChanged")
                logoModel.applyDelta(changePropertyCmd)
                await expectError(client, changePropertyE1, "nodeDoesNotExist")
                await expectError(client, changePropertyE2, "unknownProperty")

                await logProtocol(client, bulkApiClient, ["Program-01"], log)
                console.log("LionWebModel")
                console.log(logoModel.asString())
                // await makeSnapShot()
            })
            test("Children", async () => {
                const subscribe = cmd.subscribeToPartitionContentsRequest(client, "Program-01")
                const addChild = cmd.addChild(client, { id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [{ prop: PROP.MoveCommandDistance, value: "42" }] })
                const addChildE1 = cmd.addChild(client, { id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE2 = cmd.addChild(client, { id: "Move-02", cls: CLS.Forward, parent: "Program-02", containment: CON.ProgramCommands, props: [] })
                const addChildE3 = cmd.addChild(client, { id: "Move-03", cls: CLS.Forward, parent: "Program-01", containment: CON.ProcedureParameter, props: [] }, { index: 1 })
                const deleteChildError1 = cmd.deleteChild(client, { id: "Move-01", index: 0, parent: "Program-01", containment: CON.IfCondition })
                const deleteChildError2 = cmd.deleteChild(client, { id: "Move-01", index: 0, parent: "Program-01-A", containment: CON.ProgramCommands })
                const deleteChildError3 = cmd.deleteChild(client, { id: "Move-01", index: 1, parent: "Program-01", containment: CON.ProgramCommands })

                await expectError(client, subscribe, "alreadySubscribed")
                await expectEvent(client, addChild, "ChildAdded")
                logoModel.applyDelta(addChild)
                await expectError(client, addChildE1, "nodeAlreadyExists")
                await expectError(client, addChildE2, "unknownNode")
                await expectError(client, addChildE3, "unknownIndex")
                await expectError(client, deleteChildError1, "unknownContainment")
                await expectError(client, deleteChildError2, "unknownNode")
                await expectError(client, deleteChildError3, "unknownIndex")

                await logProtocol(client, bulkApiClient, ["Program-01"], log, logoModel)
                console.log("LionWebModel")
                console.log(logoModel.asString())
                // expect(await makeSnapShot()).toMatchSnapshot()
            })
        })
        test("AddPartition Second", async () => {
            const addPartitionCommand = cmd.addPartition(client, { id: "Library-01", classifier: CLS.Library, properties: [{ property: PROP.INamedName, value: "Library first" }] })
            const subscribeRequest = cmd.subscribeToPartitionContentsRequest(client, "Library-01")
            const addPropertyCmd = cmd.addProperty(client, "Program-01", "draw rectangle three", "LionCore-builtins-INamed-name")
            const addChildCommand = cmd.addChild(client, {
                id: "Procedure-01",
                cls: CLS.Procedure,
                parent: "Library-01",
                containment: CON.LibraryProcedures,
                props: [{ prop: PROP.INamedName, value: "Proc first" }],
            })
            const addChildCommand1 = cmd.addChild(client, { id: "Move-02", cls: CLS.MoveCommand, parent: "Procedure-01", containment: CON.ProcedureBody, props: [] })
            const deleteChildCommand = cmd.deleteChild(client, { id: "Procedure-01", index: 0, parent: "Library-01", containment: CON.LibraryProcedures })
            const listPartitions = cmd.listPartitions(client)
            
            await expectEvent(client, addPartitionCommand, "PartitionAdded")
            logoModel.applyDelta(addPartitionCommand)
            await expectError(client, subscribeRequest, "alreadySubscribed")
            await expectError(client, addPropertyCmd, "propertyAlreadyExists")
            
            await expectEvent(client, addChildCommand, "ChildAdded")
            logoModel.applyDelta(addChildCommand)
            await expectEvent(client, addChildCommand1, "ChildAdded")
            logoModel.applyDelta(addChildCommand1)
            await expectEvent(client, deleteChildCommand, "ChildDeleted")
            logoModel.applyDelta(deleteChildCommand)
            await expectResponse(client, listPartitions, "ListPartitionsResponse")
            const listResp = (await cmd.responseFor(client, listPartitions)) as ListPartitionsResponse
            expect (listResp.partitions.nodes.filter(n => n.parent === null).length).toEqual(2)

            await logProtocol(client, bulkApiClient, ["Program-01", "Library-01"], log, logoModel)

            // await makeSnapShot()
        })
        test("References", async () => {
            const addChild = cmd.addChild(client, { id: "PCall-01", cls: CLS.ProcedureCall, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
            const addRef = cmd.addReference(client, { id: "PCall-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })
            
            await expectEvent(client, addChild, "ChildAdded")
            logoModel.applyDelta(addChild)
            await expectEvent(client, addRef, "ReferenceAdded")
            logoModel.applyDelta(addRef)

            const addRef2 = cmd.addReference(client, {id: "PCall-01",index: 2,target: "Procedure-01",resolveInfo: "PROC-01",reference: REF.ProcedureCallProcedure})
            const addRef3 = cmd.addReference(client, {id: "PCall-01", index: 1, target: "Procedure-01", resolveInfo: "PROC-01", reference: CONTAINMENT.ProcedureParameter })
            const addRef4 = cmd.addReference(client, {id: "PCall-01",index: 1,target: null,resolveInfo: null,reference: REF.ProcedureCallProcedure})
            await expectError(client, addRef2, "unknownIndex")
            await expectError(client, addRef3, "unknownIndex")
            await expectError(client, addRef4, "undefinedReferenceTarget")

            console.log("22: " + logoModel.asString())

            const delRef4 = cmd.deleteReference(client, {parent: "PCall-01",index: 0,deletedTarget: "Procedure-01",deletedResolveInfo: "PROC-01",reference: REF.ProcedureCallProcedure})
            await expectEvent(client, delRef4, "ReferenceDeleted")
            logoModel.applyDelta(delRef4)

            const delRef5 = cmd.deleteReference(client, {parent: "PCall-01",index: 0,deletedTarget: "newTarget",deletedResolveInfo: null,reference: REF.ProcedureCallProcedure})
            const delRef6 = cmd.deleteReference(client, { parent: "PCall-01", index: 0, deletedTarget: null, deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })
            const delRef7 = cmd.deleteReference(client, { parent: "PCall-000", index: 0, deletedTarget: "target", deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })

            await expectError(client, delRef6, "undefinedReferenceTarget")
            await expectError(client, delRef5, "unknownIndex")
            await expectError(client, delRef7, "unknownNode")

            const addRef9 = cmd.addReference(client, { id: "PCall-01", index: 0, target: "Procedure-02", resolveInfo: "PROC-02", reference: REF.ProcedureCallProcedure })
            await expectEvent(client, addRef9, "ReferenceAdded")
            logoModel.applyDelta(addRef9)

            console.log("11: " + logoModel.asString())


            const changeRef4 = cmd.changeReference(client, {
                parent: "PCall-01",
                index: 0,
                reference: REF.ProcedureCallProcedure,
                oldTarget: "Procedure-02",
                oldResolveInfo: "PROC-02",
                newTarget: "Procedure-00",
                newResolveInfo: "PROC-00",
            })

            const changeRef5 = cmd.changeReference(client, {
                parent: "PCall-01",
                index: 0,
                reference: REF.ProcedureCallProcedure,
                oldTarget: "Procedure-incorrect",
                oldResolveInfo: null,
                newTarget: "newTarget",
                newResolveInfo: null,
            })
            const changeRef6 = cmd.changeReference(client, {
                parent: "PCall-01",
                index: 0,
                oldTarget: null,
                oldResolveInfo: null,
                newTarget: null,
                newResolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })
            const changeRef7 = cmd.changeReference(client, {
                parent: "PCall-000",
                index: 0,
                oldTarget: "target",
                oldResolveInfo: null,
                newTarget: "target",
                newResolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })

            await expectEvent(client, changeRef4, "ReferenceChanged")
            logoModel.applyDelta(changeRef4)
            await expectError(client, changeRef5, "referenceTargetOrResolveInfoMismatch")
            await expectError(client, changeRef6, "undefinedReferenceTarget")
            await expectError(client, changeRef7, "unknownNode")

            await logProtocol(client, bulkApiClient, ["Program-01", "Library-01"], log, logoModel)
            // const snapshot = await makeSnapShot()
            // expect(snapshot).toMatchSnapshot
        })
        test("MoveChildren", async () => {
            const partitionP = cmd.addFullPartition(client, ProgramModel.nodes())
            const partitionL = cmd.addFullPartition(client, LibraryModel.nodes())
            console.log(ProgramModel.asString())
            const ifC = ProgramModel.getNode("id-if")
            const lib = LibraryModel.getNode("id-library")
            const converter = new LionWebTreeConverter()
            converter.convert(LibraryTree)
            ProgramModel.addPartition(converter.getConvertedNodes())

            console.log(`MY ProgramModel ${ProgramModel.asString()}`)

            const move = cmd.moveChildFromOtherContainment(client, {
                movedChild: "id-if",
                oldParent: ifC.parent,
                oldContainment: ProgramCommands,
                oldIndex: 3,
                newIndex: 0,
                newParent: "id-library",
                newContainment: LibraryProcedures
            })
            await expectEvent(client, move, "ChildMovedFromOtherContainment")
            ProgramModel.applyDelta(move)
            console.log(`QAFTER ProgramModel ${ProgramModel.asString()}`)
            await logProtocol(client, bulkApiClient, ["id-program", "id-library"], log, ProgramModel)

        })
    })
})
/**
 * Run the other tests
 */
// import "./test-logo-participation.test.js"


