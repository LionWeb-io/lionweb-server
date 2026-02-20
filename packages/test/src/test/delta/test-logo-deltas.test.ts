import { RepositoryClient } from "@lionweb/server-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import { DeltaErrorCode } from "@lionweb/server-delta-shared"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { Commands, hasError } from "../commands.js"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { CLASSIFIER as CLS, CONTAINMENT, CONTAINMENT as CON, PROPERTY as PROP, REFERENCE as REF } from "./keys.js"
import { Logo2String } from "./Logo2String.js"
// TOPO Delta : primary key exception when nohistory = false 
const collection = [true]

const bulkApiClient = new RepositoryClient("BulkClient-01")

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


// interface Addition {
//     toHaveError(error: DeltaErrorCode): void
// }

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module "vitest" {
    interface Assertion {
        toHaveError(error: DeltaErrorCode): void
    }
}


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
                expect(await cmd.errorFor(addPartitionCommand2)).toHaveError("idsAlreadyInUse")

                const deletePartition = cmd.deletePartition("Program-02")
                expect(await cmd.errorFor(deletePartition)).toHaveError("unknownNode")
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
                const addPropertyCmd2 = cmd.addProperty("Program-01", "draw rectangle again", "LionCore-builtins-INamed-name")

                const changePropertyCmd = cmd.changeProperty("Program-01", "draw a rectangle", "LionCore-builtins-INamed-name")
                const changePropertyE1 = cmd.changeProperty("Program-21", "draw a line", "LionCore-builtins-INamed-name")
                const changePropertyE2 = cmd.changeProperty("Program-01", "draw a cricle", "-key-Program-name")
                
                // 
                expect(hasError(await cmd.eventFor(deletePropertyCmd), "unknownProperty")).toBeTruthy()
                expect((await cmd.eventFor(addPropertyCmd)).messageKind).toEqual("PropertyAdded")
                expect(await cmd.errorFor(addPropertyCmdE1)).toHaveError("nodeDoesNotExist")

                expect((await cmd.eventFor(deletePropertyCmd2)).messageKind).toEqual("PropertyDeleted")
                expect(await cmd.errorFor(deletePropertyCmd3)).toHaveError("unknownProperty")

                expect((await cmd.eventFor(addPropertyCmd2)).messageKind).toEqual("PropertyAdded")
                expect((await cmd.eventFor(changePropertyCmd)).messageKind).toEqual("PropertyChanged")
                expect(await cmd.errorFor(changePropertyE1)).toHaveError("nodeDoesNotExist")
                expect(await cmd.errorFor(changePropertyE2)).toHaveError("unknownProperty")

                console.log("SentMessages")
                console.log(client.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(client.receivedMessageHistory)
                await makeSnapShot()

            })
            test("Children", async () => {
                const subscribe = cmd.subscribeToPartitionContentsRequest("Program-01")
                const addChild = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE1 = cmd.addChild({ id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
                const addChildE2 = cmd.addChild({ id: "Move-02", cls: CLS.Forward, parent: "Program-02", containment: CON.ProgramCommands, props: [] })
                const addChildE3 = cmd.addChild({ id: "Move-03", cls: CLS.Forward, parent: "Program-01", containment: CON.ProcedureParameter, props: [] }, {index: 1})
                const deleteChildError1 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01", containment: CON.IfCondition })
                const deleteChildError2 = cmd.deleteChild({ id: "Move-01", index: 0, parent: "Program-01-A", containment: CON.ProgramCommands })
                const deleteChildError3 = cmd.deleteChild({ id: "Move-01", index: 1, parent: "Program-01", containment: CON.ProgramCommands })


                expect(await cmd.errorFor(subscribe)).toHaveError("alreadySubscribed")
                expect((await cmd.eventFor(addChild)).messageKind).toEqual("ChildAdded")
                expect(await cmd.errorFor(addChildE1)).toHaveError("nodeAlreadyExists")
                expect(await cmd.errorFor(addChildE2)).toHaveError( "unknownNode")
                expect(await cmd.errorFor(addChildE3)).toHaveError( "unknownIndex")
                expect(await cmd.errorFor(deleteChildError1)).toHaveError( "unknownContainment")
                expect(await cmd.errorFor(deleteChildError2)).toHaveError( "unknownNode")
                expect(await cmd.errorFor(deleteChildError3)).toHaveError( "unknownIndex")

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
            const subscribeRequest = cmd.subscribeToPartitionContentsRequest("Library-01")
            const addPropertyCmd = cmd.addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
            const addChildCommand = cmd.addChild({id: "Procedure-01", cls: CLS.Procedure, parent: "Library-01",  containment: CON.LibraryProcedures,
                props: [{ prop: PROP.INamedName, value: "Proc first" }]
            })
            const addChildCommand1 = cmd.addChild({id: "Move-02", cls: CLS.MoveCommand, parent: "Procedure-01",containment: CON.ProcedureBody,props: []})
            const deleteChildCommand = cmd.deleteChild({id: "Procedure-01",index: 0,parent: "Library-01",containment: CON.LibraryProcedures})
            
            expect((await cmd.eventFor(addPartitionCommand)).messageKind).toEqual("PartitionAdded")
            expect((await cmd.responseFor(subscribeRequest)).messageKind).toEqual("ErrorResponse")
            expect(await cmd.errorFor(addPropertyCmd)).toHaveError("propertyAlreadyExists")
            expect((await cmd.eventFor(addChildCommand)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(addChildCommand1)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(deleteChildCommand)).messageKind).toEqual("ChildDeleted")
            await makeSnapShot()
        })
        test("References", async () => {
            client.loggingOn = true
            const addChild = cmd.addChild({ id: "PCall-01", cls: CLS.ProcedureCall, parent: "Program-01", containment: CON.ProgramCommands, props: [] })
            const addRef = cmd.addReference({ id: "PCall-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })

            expect((await cmd.eventFor(addChild)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(addRef)).messageKind).toEqual("ReferenceAdded")
            console.log("1 add refertences")
            await makeSnapShot()
            
            const addRef2 = cmd.addReference({
                id: "PCall-01",
                index: 2,                   // Error: Is out of bounds
                target: "Procedure-01",
                resolveInfo: "PROC-01",
                reference: REF.ProcedureCallProcedure,
            })
            const addRef3 = cmd.addReference({ id: "PCall-01", index: 1, target: "Procedure-01", resolveInfo: "PROC-01", reference: CONTAINMENT.ProcedureParameter })
            const addRef4 = cmd.addReference({
                id: "PCall-01",
                index: 1,
                target: null,               // Error: both target and resolveReference are null
                resolveInfo: null,
                reference: REF.ProcedureCallProcedure,
            })

            expect((await cmd.eventFor(addChild)).messageKind).toEqual("ChildAdded")
            expect((await cmd.eventFor(addRef)).messageKind).toEqual("ReferenceAdded")
            expect(await cmd.errorFor(addRef2)).toEqual("unknownIndex")
            expect(await cmd.errorFor(addRef3)).toEqual("unknownIndex")
            expect(await cmd.errorFor(addRef4)).toEqual("undefinedReferenceTarget")

            console.log("2 add refertences")
            await makeSnapShot()

            const delRef4 = cmd.deleteReference({ parent: "PCall-01", index: 0, deletedTarget: "Procedure-01", deletedResolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })
            expect((await cmd.eventFor(delRef4)).messageKind).toEqual("ReferenceDeleted")
            console.log("3 deleted  refertence")
            await makeSnapShot()

            const delRef5 = cmd.deleteReference({ parent: "PCall-01", index: 0, deletedTarget: "newTarget", deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })
            await cmd.eventFor(delRef5)
            console.log("4 deleted  refertence")
            await makeSnapShot()

            expect(await cmd.errorFor(delRef5)).toHaveError("unknownReference")
            console.log("5 deleted  refertence")
            await makeSnapShot()

            const delRef6 = cmd.deleteReference({ parent: "PCall-01", index: 0, deletedTarget: null, deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })
            const delRef7 = cmd.deleteReference({ parent: "PCall-000", index: 0, deletedTarget: "target", deletedResolveInfo: null, reference: REF.ProcedureCallProcedure })

            expect((await cmd.eventFor(delRef4)).messageKind).toEqual("ReferenceDeleted")
            expect(await cmd.errorFor(delRef5)).toHaveError( "unknownReference")
            expect(await cmd.errorFor(delRef6)).toHaveError( "undefinedReferenceTarget")
            expect(await cmd.errorFor(delRef7)).toHaveError( "unknownNode")

            console.log("33 deleted refertences")
            await makeSnapShot()

            const addRef9 = cmd.addReference({ id: "PCall-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure })
            expect((await cmd.eventFor(addRef9)).messageKind).toEqual("ReferenceAdded")
            console.log("add refertences")
            await makeSnapShot()

            const changeRef4 = cmd.changeReference({ parent: "PCall-01", index: 0, reference: REF.ProcedureCallProcedure, 
                oldTarget: "Procedure-01", oldResolveInfo: "PROC-01",
                newTarget: "Procedure-00", newResolveInfo: "PROC-00"
            })
            expect((await cmd.eventFor(changeRef4)).messageKind).toEqual("ReferenceChanged")
            console.log("change refertences")
            await makeSnapShot()
            
            const changeRef5 = cmd.changeReference({
                parent: "PCall-01",
                index: 0,
                reference: REF.ProcedureCallProcedure,
                oldTarget: "Procedure-incorrect",
                oldResolveInfo: null,
                newTarget: "newTarget",
                newResolveInfo: null,
            })
            const changeRef6 = cmd.changeReference({ parent: "PCall-01", index: 0, 
                oldTarget: null, oldResolveInfo: null,
                newTarget: null, newResolveInfo: null,
                reference: REF.ProcedureCallProcedure })
            const changeRef7 = cmd.changeReference({ parent: "PCall-000", index: 0,
                oldTarget: "target", oldResolveInfo: null,
                newTarget: "target", newResolveInfo: null,
                reference: REF.ProcedureCallProcedure })

            expect((await cmd.eventFor(addRef)).messageKind).toEqual("ReferenceAdded")
            expect((await cmd.eventFor(changeRef4)).messageKind).toEqual("ReferenceChanged")
            expect(await cmd.errorFor(changeRef5)).toHaveError( "referenceTargetOrResolveInfoMismatch")
            expect(await cmd.errorFor(changeRef6)).toHaveError( "undefinedReferenceTarget")
            expect(await cmd.errorFor(changeRef7)).toHaveError( "unknownNode")

            console.log("SentMessages References")
            console.log(client.sentMessageHistory)
            console.log("ReceivedMessages References")
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
