import { RepositoryClient } from "@lionweb/server-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"

import { HttpSuccessCodes } from "@lionweb/server-shared"
import { Commands, hasError } from "../commands.js"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { CLASSIFIER as CLS, CONTAINMENT as CON, PROPERTY as PROP, REFERENCE as REF } from "./keys.js"
import { Logo2String } from "./Logo2String.js"

// TOPO Delta : primary key exception when nohistory = false 
const collection = [true]

const bulkApiClient = new RepositoryClient("BulkClient-01")

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const client = new DeltaClient({}, [eventFunctions, responseFunctions, adminResponseFunctions])
        // deltaApiClient01.deltaProcessor.
        client.repository = repository
        client.clientId = "DeltaClient-01"
        const cmd = new Commands(client)
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
            client.loggingOn = true
            await client.connect()
            const listRepos = cmd.listRepositories()
            // const deleteRepo = deleteRepository(repository)
            // await responseFor(deleteRepo)
            const addRepo = cmd.addRepository(repository)
            await cmd.responseFor(addRepo)

            const signOn = cmd.signOnRequest(client.repository, client.clientId)

            // expect((await cmd.responseFor(listRepos)).messageKind).toEqual("ListRepositoriesAdminResponse")
            expect(await cmd.responseFor(signOn)).toMatchObject({
                messageKind: "SignOnResponse",
                queryId: signOn.queryId,
                additionalInfos: [
                    {
                        data: [],
                        kind: "Info",
                        message: "SignOnRequest received ok"
                    }
                ]
            })
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
        })

        describe("Partition tests", () => {
            test("AddPartition", async () => {
                // assert(initError === "", initError)
                const addPartitionCommand1 = cmd.addPartition({ id: "Program-01", classifier: CLS.Program })
                expect((await cmd.eventFor(addPartitionCommand1)).messageKind).toEqual("PartitionAdded")

                const addPartitionCommand2 = cmd.addPartition({ id: "Program-01", classifier: CLS.Program })
                expect(hasError(await cmd.eventFor(addPartitionCommand2), "idsAlreadyInUse")).toBeTruthy()

                const deletePartition = cmd.deletePartition("Program-02")
                expect(hasError(await cmd.eventFor(deletePartition), "unknownNode")).toBeTruthy()

                console.log("SentMessages")
                console.log(client.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(client.receivedMessageHistory)

            })
            test("Properties", async () => {
                // client.sendRequest(newSubscribeToPartitionRequest("Program-01"))
                const deletePropertyCmd = cmd.deleteProperty("Program-01", "-key-Partition-name")
                const addPropertyCmd = cmd.addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
                const addPropertyCmdE1 = cmd.addProperty("Program-11", "draw nothing", "LionCore-builtins-INamed-name")

                const deletePropertyCmd2 = cmd.deleteProperty("Program-01", "LionCore-builtins-INamed-name")
                const deletePropertyCmd3 = cmd.deleteProperty("Program-01", "-key-Partition-name")
                const addPropertyCmd2 = cmd.addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")

                const changePropertyCmd = cmd.changeProperty("Program-01", "draw a rectangle", "LionCore-builtins-INamed-name")
                const changePropertyE1 = cmd.changeProperty("Program-21", "draw a line", "LionCore-builtins-INamed-name")
                const changePropertyE2 = cmd.changeProperty("Program-01", "draw a cricle", "-key-Program-name")
                
                // 
                expect(hasError(await cmd.eventFor(deletePropertyCmd), "unknownProperty")).toBeTruthy()
                expect((await cmd.eventFor(addPropertyCmd)).messageKind).toEqual("PropertyAdded")
                expect(hasError(await cmd.eventFor(addPropertyCmdE1), "nodeDoesNotExist")).toBeTruthy()

                expect((await cmd.eventFor(deletePropertyCmd2)).messageKind).toEqual("PropertyDeleted")
                expect(hasError(await cmd.eventFor(deletePropertyCmd3), "unknownProperty")).toBeTruthy()
                
                expect((await cmd.eventFor(changePropertyCmd)).messageKind).toEqual("PropertyChanged")
                expect(hasError(await cmd.eventFor(changePropertyE1), "nodeDoesNotExist")).toBeTruthy()
                expect(hasError(await cmd.eventFor(changePropertyE2), "unknownProperty")).toBeTruthy()
                // assert( deltaApiClient01.receivedEvents.get(deletePropertyCmd2.commandId).messageKind === "PropertyDeleted")

                console.log("SentMessages")
                console.log(client.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(client.receivedMessageHistory)
                await makeSnapShot()

            })
            test("Children", async () => {
                const subscribe = cmd.subscribeToPartitionRequest("Program-01")
                const addChild = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE1 = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE2 = cmd.addChild({ id: "Move-02", cls: CLS.Forward, parent: "Program-02", containment: CON.ProgramCommands, props: [] })
                const deleteChildError1 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01", containment: CON.IfCondition })
                const deleteChildError2 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01-A", containment: CON.ProgramCommands })
                const deleteChildError3 = cmd.deleteChild({ id: "Move-01", index: 1, parent: "Program-01", containment: CON.ProgramCommands })


                expect(hasError(await cmd.responseFor(subscribe), "alreadySubscribed")).toBeTruthy()
                expect((await cmd.eventFor(addChild)).messageKind).toEqual("ChildAdded")
                expect(hasError(await cmd.eventFor(addChildE1), "nodeAlreadyExists")).toBeTruthy()
                expect(hasError(await cmd.eventFor(addChildE2), "unknownNode")).toBeTruthy()
                expect(hasError(await cmd.eventFor(deleteChildError1), "unknownContainment")).toBeTruthy()
                expect(hasError(await cmd.eventFor(deleteChildError2), "unknownNode")).toBeTruthy()
                expect(hasError(await cmd.eventFor(deleteChildError3), "unknownIndex")).toBeTruthy()

                console.log("SentMessages")
                console.log(client.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(client.receivedMessageHistory)
                expect(await makeSnapShot()).toMatchSnapshot()
            })
        })
        test("AddPartition Second", async () => {
            const addPartitionCommand = cmd.addPartition({id: "Library-01", classifier: CLS.Library,
                properties: [{ property: PROP.INamedName, value: "Library first" }]
            })
            const subscribeRequest = cmd.subscribeToPartitionRequest("Library-01")
            const addPropertyCmd = cmd.addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
            const addChildCommand = cmd.addChild({id: "Procedure-01", cls: CLS.Procedure, parent: "Library-01",  containment: CON.LibraryProcedures,
                props: [{ prop: PROP.INamedName, value: "Proc first" }]
            })
            const addChildCommand1 = cmd.addChild({id: "Move-02", cls: CLS.MoveCommand, parent: "Procedure-01",containment: CON.ProcedureBody,props: []})
            const deleteChildCommand = cmd.deleteChild({id: "Procedure-01",index: 0,parent: "Library-01",containment: CON.LibraryProcedures})
            
            expect((await cmd.eventFor(addPartitionCommand)).messageKind).toEqual("PartitionAdded")
            expect((await cmd.responseFor(subscribeRequest)).messageKind).toEqual("ErrorResponse")
            expect(hasError(await cmd.eventFor(addPropertyCmd), "propertyAlreadyExists")).toBeTruthy()
            expect((await cmd.eventFor(addChildCommand)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(addChildCommand1)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(deleteChildCommand)).messageKind).toEqual("ChildDeleted")
        })
        test("References", async () => {
            client.loggingOn = true
            const addChild = cmd.addChild({id: "Call-01",cls: CLS.ProcedureCall,parent: "Program-01",containment: CON.ProgramCommands,props: []})
            const addRef = cmd.addReference({id: "Call-01",index: 0,target: "Procedure-01",resolveInfo: "PROC-01",reference: REF.ProcedureCallProcedure})

            expect((await cmd.eventFor(addChild)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(addRef)).messageKind).toEqual("ReferenceAdded")

            console.log("SentMessages 3")
            console.log(client.sentMessageHistory)
            console.log("ReceivedMessages 3")
            console.log(client.receivedMessageHistory)
            const snapshot = await makeSnapShot()
            expect(snapshot).toMatchSnapshot
        })

    })
})


async function makeSnapShot(): Promise<string> {
    const partition = await bulkApiClient.bulk.retrieve(["Library-01", "Program-01"])
    // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
    const string = new Logo2String(partition.body.chunk.nodes).logo2string()
    console.log(string)
    return string
}
