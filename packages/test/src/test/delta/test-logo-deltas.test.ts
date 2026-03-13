import { RepositoryClient } from "@lionweb/server-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import {
    CommandMessageKind,
    DeltaCommand,
    DeltaCommandMessageKinds,
    DeltaErrorCode,
    DeltaRequest,
    DeltaRequestMessageKinds,
    EventMessageKind,
    GetAvailableIdsResponse,
    RequestMessageKind,
    ResponseMessageKind,
    ListPartitionsResponse
} from "@lionweb/server-delta-shared"
import { HttpSuccessCodes  } from "@lionweb/server-shared"
import { Commands } from "../commands.js"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { reportHTML, TestCoverage } from "./helpers.js"
import { CLASSIFIER as CLS, CONTAINMENT, CONTAINMENT as CON, PROPERTY as PROP, REFERENCE as REF } from "./keys.js"
import { Logo2String } from "./Logo2String.js"
// TOPO Delta : primary key exception when nohistory = false 
const collection = [true]
const log: boolean = false

// Define a coverage map, so we can generate test overview table at the end.
const CoverageMap: Map<CommandMessageKind | RequestMessageKind, TestCoverage> = new Map<CommandMessageKind | RequestMessageKind, TestCoverage>()

for (const kind of DeltaCommandMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}
for (const kind of DeltaRequestMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}

expect.extend({
    toHaveError(received, expected) {
        // define Todo object structure with objectContaining
        // const expectDeltaErrorCode = (errorCode?: DeltaErrorCode) =>
        //     expect.toBeOneOf<string>(DeltaErrorCodes)
        // equality check for received todo and expected todo
        const pass = this.equals(received, expected)

        if (pass) {
            return {
                message: () => `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`,
                pass: true,
            }
        }
        return {
            message: () => `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}\n\n${this.utils.diff(expected, received)}`,
            pass: false,
        }
    }
})

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module "vitest" {
    interface Assertion {
        toHaveError(error: DeltaErrorCode): void
    }
}

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    const bulkApiClient = new RepositoryClient({clientId: "BulkClient-01", repository: repository})

    let cmd!: Commands
    describe("Delta tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const client = new DeltaClient({}, [eventFunctions, responseFunctions, adminResponseFunctions])
        // deltaApiClient01.deltaProcessor.
        client.repository = repository
        client.clientId = "DeltaClient-01"
        cmd = new Commands(client)
        // deltaApiClient01.customFunction = receiveDelta

        beforeAll(async function () {
            bulkApiClient.repository = repository
            const delResponse = await bulkApiClient.dbAdmin.deleteRepository(repository, "delete at start og test")
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
            } else {
                console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
            }
            client.loggingOn = log
            await client.connect()
            const listReposRequest = cmd.listRepositories()
            // const deleteRepo = deleteRepository(repository)
            // await responseFor(deleteRepo)
            const addRepo = cmd.addRepository(repository)
            
            expect((await cmd.responseFor(addRepo)).messageKind).toEqual("CreateRepositoryAdminResponse")

            const signOn = cmd.signOnRequest(client.repository, client.clientId)

            expect((await cmd.responseFor(listReposRequest)).messageKind).toEqual("ListRepositoriesAdminResponse")
            await expectResponse(signOn, "SignOnResponse")
            expect(await cmd.responseFor(signOn)).toMatchObject({
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
                const signOn = cmd.signOnRequest(repository, client.clientId)
                await expectResponse(signOn, "SignOnResponse")

                const signOff = cmd.signOffRequest()
                await expectResponse(signOff, "SignOffResponse")

                // SignOff twice is ok
                const signOff2 = cmd.signOffRequest()
                await expectError(signOff2, "notSignedOn")

                const availableIdsErr = cmd.availableIds()
                await expectError(availableIdsErr, "invalidParticipation")
                const listPartitions = cmd.listPartitions()
                await expectError(listPartitions, "invalidParticipation")
                const listAndSubscribePartitions = cmd.listAndSubscribePartitions()
                await expectError(listAndSubscribePartitions, "invalidParticipation")
                const inform = cmd.informAbout()
                await expectError(inform, "invalidParticipation")
                const sub = cmd.subscribeToChangingPartitions()
                await expectError(sub, "invalidParticipation")
                
                const signOn2 = cmd.signOnRequest(repository, client.clientId)
                await expectResponse(signOn2, "SignOnResponse")

                const inform2 = cmd.informAbout()
                await expectResponse(inform2, "InformAboutChangingPartitionsResponse")
                const sub2 = cmd.subscribeToChangingPartitions()
                await expectResponse(sub2, "SubscribeToChangingPartitionsResponse")

                const availableIds = cmd.availableIds()
                await expectResponse(availableIds, "GetAvailableIdsResponse")
                const ids = await cmd.responseFor(availableIds) as GetAvailableIdsResponse
                expect(ids.ids.length).toEqual(25)
            })
            test("AddPartition", async () => {
                
                // assert(initError === "", initError)
                const addPartitionCommand1 = cmd.addPartition({ id: "Program-01", classifier: CLS.Program })
                await expectEvent(addPartitionCommand1, "PartitionAdded")

                const addPartitionCommand2 = cmd.addPartition({ id: "Program-01", classifier: CLS.Program })
                await expectError(addPartitionCommand2, "idsAlreadyInUse")

                const deletePartition = cmd.deletePartition("Program-02")
                await expectError(deletePartition, "unknownNode")

                const deletePartitionOk = cmd.deletePartition("Program-01")
                await expectEvent(deletePartitionOk, "PartitionDeleted")

                const addPartitionCommand3 = cmd.addPartition({ id: "Program-01", classifier: CLS.Program })
                await expectEvent(addPartitionCommand3, "PartitionAdded")

                const unsubscribe = cmd.unSubscribeToPartitionRequest(repository, client.clientId, "Program-01")
                await expectResponse(unsubscribe, "UnsubscribeFromPartitionContentsResponse")
                const unsubscribe2 = cmd.unSubscribeToPartitionRequest(repository, client.clientId, "Program-01")
                await expectError(unsubscribe2, "notSubscribed")

                const subscribe = cmd.subscribeToPartitionContentsRequest("Program-01")
                await expectResponse(subscribe, "SubscribeToPartitionContentsResponse")

                const unsubscribe3 = cmd.unSubscribeToPartitionRequest(repository, client.clientId, "Program-01")
                await expectResponse(unsubscribe3, "UnsubscribeFromPartitionContentsResponse")

                logProtocol(client)            
                // const snapshot = await makeSnapShot()
            })
            
            test("Properties", async () => {
                const subscribeAll = cmd.listAndSubscribePartitions()
                await expectResponse(subscribeAll, "ListAndSubscribePartitionsResponse")
                
                const deletePropertyCmd = cmd.deleteProperty("Program-01", "-key-Partition-name")
                const addPropertyCmd = cmd.addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
                const addPropertyCmdE1 = cmd.addProperty("Program-11", "draw nothing", "LionCore-builtins-INamed-name")

                const deletePropertyCmd2 = cmd.deleteProperty("Program-01", "LionCore-builtins-INamed-name")
                const deletePropertyCmd3 = cmd.deleteProperty("Program-01", "-key-Partition-name")
                const addPropertyCmd2 = cmd.addProperty("Program-01", "draw rectangle again", "LionCore-builtins-INamed-name")

                const changePropertyCmd = cmd.changeProperty("Program-01", "draw a rectangle", "LionCore-builtins-INamed-name")
                const changePropertyE1 = cmd.changeProperty("Program-21", "draw a line", "LionCore-builtins-INamed-name")
                const changePropertyE2 = cmd.changeProperty("Program-01", "draw a cricle", "-key-Program-name")

                await expectError(deletePropertyCmd, "unknownProperty")
                await expectEvent(addPropertyCmd, "PropertyAdded")
                await expectError(addPropertyCmdE1, "nodeDoesNotExist")
                await expectEvent(deletePropertyCmd2, "PropertyDeleted")
                await expectError(deletePropertyCmd3, "unknownProperty")
                const event = await cmd.eventFor(addPropertyCmd2)
                console.log(`Error ${JSON.stringify(addPropertyCmd2)}`)
                console.log(`Error ${JSON.stringify(event)}`)
                await expectEvent(addPropertyCmd2, "PropertyAdded")
                await expectEvent(changePropertyCmd, "PropertyChanged")
                await expectError(changePropertyE1, "nodeDoesNotExist")
                await expectError(changePropertyE2, "unknownProperty")
                
                logProtocol(client)
                // await makeSnapShot()
            })
            test("Children", async () => {
                const subscribe = cmd.subscribeToPartitionContentsRequest("Program-01")
                const addChild = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE1 = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE2 = cmd.addChild({ id: "Move-02", cls: CLS.Forward, parent: "Program-02", containment: CON.ProgramCommands, props: [] })
                const addChildE3 = cmd.addChild({ id: "Move-03", cls: CLS.Forward, parent: "Program-01", containment: CON.ProcedureParameter, props: [] }, { index: 1 })
                const deleteChildError1 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01", containment: CON.IfCondition })
                const deleteChildError2 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01-A", containment: CON.ProgramCommands })
                const deleteChildError3 = cmd.deleteChild({ id: "Move-01", index: 1, parent: "Program-01", containment: CON.ProgramCommands })

                await expectError(subscribe, "alreadySubscribed")
                await expectEvent(addChild, "ChildAdded")
                await expectError(addChildE1, "nodeAlreadyExists")
                await expectError(addChildE2, "unknownNode")
                await expectError(addChildE3, "unknownIndex")
                await expectError(deleteChildError1, "unknownContainment")
                await expectError(deleteChildError2, "unknownNode")
                await expectError(deleteChildError3, "unknownIndex")

                logProtocol(client)
                // expect(await makeSnapShot()).toMatchSnapshot()
            })
        })
        test("AddPartition Second", async () => {
            const addPartitionCommand = cmd.addPartition({ id: "Library-01", classifier: CLS.Library, properties: [{ property: PROP.INamedName, value: "Library first" }] })
            const subscribeRequest = cmd.subscribeToPartitionContentsRequest("Library-01")
            const addPropertyCmd = cmd.addProperty("Program-01", "draw rectangle three", "LionCore-builtins-INamed-name")
            const addChildCommand = cmd.addChild({
                id: "Procedure-01",
                cls: CLS.Procedure,
                parent: "Library-01",
                containment: CON.LibraryProcedures,
                props: [{ prop: PROP.INamedName, value: "Proc first" }],
            })
            const addChildCommand1 = cmd.addChild({ id: "Move-02", cls: CLS.MoveCommand, parent: "Procedure-01", containment: CON.ProcedureBody, props: [] })
            const deleteChildCommand = cmd.deleteChild({ id: "Procedure-01", index: 0, parent: "Library-01", containment: CON.LibraryProcedures })
            const listPartitions = cmd.listPartitions()
            
            await expectEvent(addPartitionCommand, "PartitionAdded")
            await expectError(subscribeRequest, "alreadySubscribed")
            await expectError(addPropertyCmd, "propertyAlreadyExists")
            await expectEvent(addChildCommand, "ChildAdded")
            await expectEvent(addChildCommand1, "ChildAdded")
            await expectEvent(deleteChildCommand, "ChildDeleted")
            await expectResponse(listPartitions, "ListPartitionsResponse")
            const listResp = await cmd.responseFor(listPartitions) as ListPartitionsResponse
            expect (listResp.partitions.nodes.filter(n => n.parent === null).length).toEqual(2)
            // await makeSnapShot()
        })
        test("References", async () => {
            const addChild = cmd.addChild({ id: "PCall-01", cls: CLS.ProcedureCall, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
            const addRef = cmd.addReference({ id: "PCall-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })

            await expectEvent(addChild, "ChildAdded")
            await expectEvent(addRef, "ReferenceAdded")

            const addRef2 = cmd.addReference({
                id: "PCall-01",
                index: 2, // Error: Is out of bounds
                target: "Procedure-01",
                resolveInfo: "PROC-01",
                reference: REF.ProcedureCallProcedure,
            })
            const addRef3 = cmd.addReference({ id: "PCall-01", index: 1, target: "Procedure-01", resolveInfo: "PROC-01", reference: CONTAINMENT.ProcedureParameter })
            const addRef4 = cmd.addReference({
                id: "PCall-01",
                index: 1,
                target: null, // Error: both target and resolveReference are null
                resolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })

            await expectEvent(addChild, "ChildAdded")
            await expectEvent(addRef, "ReferenceAdded")
            await expectError(addRef2, "unknownIndex")
            await expectError(addRef3, "unknownIndex")
            await expectError(addRef4, "undefinedReferenceTarget")

            const delRef4 = cmd.deleteReference({
                parent: "PCall-01",
                index: 0,
                deletedTarget: "Procedure-01",
                deletedResolveInfo: "PROC-01",
                reference: REF.ProcedureCallProcedure,
            })
            await expectEvent(delRef4, "ReferenceDeleted")

            const delRef5 = cmd.deleteReference({ parent: "PCall-01", index: 0, deletedTarget: "newTarget", deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })
            await expectError(delRef5, "unknownIndex")

            const delRef6 = cmd.deleteReference({ parent: "PCall-01", index: 0, deletedTarget: null, deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })
            const delRef7 = cmd.deleteReference({ parent: "PCall-000", index: 0, deletedTarget: "target", deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })

            await expectError(delRef6, "undefinedReferenceTarget")
            await expectError(delRef7, "unknownNode")

            const addRef9 = cmd.addReference({ id: "PCall-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })
            await expectEvent(addRef9, "ReferenceAdded")

            const changeRef4 = cmd.changeReference({
                parent: "PCall-01",
                index: 0,
                reference: REF.ProcedureCallProcedure,
                oldTarget: "Procedure-01",
                oldResolveInfo: "PROC-01",
                newTarget: "Procedure-00",
                newResolveInfo: "PROC-00",
            })
            await expectEvent(changeRef4, "ReferenceChanged")

            const changeRef5 = cmd.changeReference({
                parent: "PCall-01",
                index: 0,
                reference: REF.ProcedureCallProcedure,
                oldTarget: "Procedure-incorrect",
                oldResolveInfo: null,
                newTarget: "newTarget",
                newResolveInfo: null,
            })
            const changeRef6 = cmd.changeReference({
                parent: "PCall-01",
                index: 0,
                oldTarget: null,
                oldResolveInfo: null,
                newTarget: null,
                newResolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })
            const changeRef7 = cmd.changeReference({
                parent: "PCall-000",
                index: 0,
                oldTarget: "target",
                oldResolveInfo: null,
                newTarget: "target",
                newResolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })

            await expectEvent(addRef, "ReferenceAdded")
            await expectEvent(changeRef4, "ReferenceChanged")
            await expectError(changeRef5, "referenceTargetOrResolveInfoMismatch")
            await expectError(changeRef6, "undefinedReferenceTarget")
            await expectError(changeRef7, "unknownNode")

            logProtocol(client)
            // const snapshot = await makeSnapShot()
            // expect(snapshot).toMatchSnapshot
        })
    })

    async function expectError(delta: DeltaCommand | DeltaRequest, error: DeltaErrorCode): Promise<void> {
        expect(await cmd.errorFor(delta)).toHaveError(error)
        CoverageMap.get(delta.messageKind).receivedErrors.push(error)
    }

    async function expectEvent(delta: DeltaCommand, eventKind: EventMessageKind): Promise<void> {
        expect((await cmd.eventFor(delta)).messageKind).toEqual(eventKind)
        CoverageMap.get(delta.messageKind).receivedEvents++
    }

    async function expectResponse(delta: DeltaRequest, requestKind: ResponseMessageKind): Promise<void> {
        expect((await cmd.responseFor(delta)).messageKind).toEqual(requestKind)
        CoverageMap.get(delta.messageKind).receivedEvents++
    }

    async function makeSnapShot(): Promise<string> {
        const partition = await bulkApiClient.bulk.retrieve(["Library-01", "Program-01"])
        // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
        const string = new Logo2String(partition.body.chunk.nodes).logo2string()
        console.log(string)
        return string
    }
    
    function logProtocol(client: DeltaClient): void {
        if (log ) {
            console.log("SentMessages References")
            console.log(client.sentMessageHistory)
            console.log("ReceivedMessages References")
            console.log(client.receivedMessageHistory)
        }
    }
})


