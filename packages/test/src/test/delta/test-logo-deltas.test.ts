import { isErrorEvent } from "@lionweb/delta-server"
import { RepositoryClient } from "@lionweb/server-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import { DeltaAdminResponse, DeltaCommand, DeltaEvent, DeltaRequest, DeltaResponse } from "@lionweb/server-delta-shared"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import {
    addReference,
    DeleteChildType,
    newAddChild,
    newAddPartitionCommand,
    newAddPropertyCommand,
    newChangePropertyCommand,
    NewChild,
    newDeleteChild,
    newDeletePropertyCommand,
    newSignOnRequest,
    newSubscribeToPartitionRequest
} from "../commands.js"
import { assert } from "chai"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { waitFor } from "./helpers.js"
import { CLASSIFIER as CLS, CONTAINMENT as CON, PROPERTY as PROP, REFERENCE as REF } from "./keys.js"
import { Logo2String } from "./Logo2String.js"
// const { deepEqual, equal } = assert
// import sm from "source-map-support"
// sm.install()
// const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const bulkApiClient = new RepositoryClient("BulkClient-01")

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const client = new DeltaClient({}, [eventFunctions, responseFunctions, adminResponseFunctions])
        // deltaApiClient01.deltaProcessor.
        client.repository = repository
        client.clientId = "DeltaClient-01"
        // deltaApiClient01.customFunction = receiveDelta

        beforeAll(async function () {
            bulkApiClient.repository = repository
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
            } else {
                console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
            }
            const repositories = await bulkApiClient.dbAdmin.listRepositories()

            client.loggingOn = true
            await client.connect()
            client.sendAdminRequest({ messageKind: "ListRepositoriesAdminRequest", queryId: "123", additionalInfo: []})
            client.sendRequest(newSignOnRequest(client.repository, client.clientId))
            await delay(200)
        })

        beforeEach(async function () {
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
                const addPartitionCommand = client.sendCommand(
                    newAddPartitionCommand({ id: "Program-01", classifier: CLS.Program })
                )
                expect( (await eventFor(addPartitionCommand)).messageKind).toEqual("PartitionAdded")
            })
            test("Properties", async () => {
                client.sendRequest(newSubscribeToPartitionRequest("Program-01"))
                const deletePropertyCmd = deleteProperty("Program-01", "-key-Partition-name")
                const addPropertyCmd = addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
                // const changePropertyCmd = changeProperty("Program-01", "draw a rectangle", "LionCore-builtins-INamed-name")

                expect((await eventFor(deletePropertyCmd)).messageKind).toEqual("ErrorEvent")
                expect((await eventFor(addPropertyCmd)).messageKind).toEqual("PropertyAdded")
                // expect((await eventFor(changePropertyCmd)).messageKind).toEqual("PropertyChanged")
                // assert( deltaApiClient01.receivedEvents.get(deletePropertyCmd2.commandId).messageKind === "PropertyDeleted")

                await makeSnapShot()

            })
            test.skip("Children", async () => {
                client.sendRequest(newSubscribeToPartitionRequest("Program-01"))
                const addChildCommand = addChild({id: "Move-01", cls: CLS.Forward, parent: "Program-01", containment: CON.ProgramCommands, props: []})
                const deleteChildCommandError1 = deleteChild({ id: "Move-01", index: 0, parent: "Program-01", containment: CON.IfCondition })
                const deleteChildCommandError2 = deleteChild({ id: "Move-01", index: 0, parent: "Program-01-A", containment: CON.ProgramCommands })
                const deleteChildCommandError3 = deleteChild({ id: "Move-01", index: 1, parent: "Program-01", containment: CON.ProgramCommands })

                console.log("SentMessages")
                console.log(client.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(client.receivedMessageHistory)

                expect((await eventFor(addChildCommand)).messageKind).toEqual("ChildAdded")
                expect(hasError(await eventFor(deleteChildCommandError1), "unknownContainment")).toBeTruthy
                expect(hasError(await eventFor(deleteChildCommandError2), "err-unknownNode")).toBeTruthy
                expect(hasError(await eventFor(deleteChildCommandError3), "unknownIndex")).toBeTruthy
                
                await makeSnapShot()
            })
        })
        test.skip("AddPartition Second", async () => {
            const addPartitionCommand = client.sendCommand(
                newAddPartitionCommand({
                    id: "Library-01",
                    classifier: CLS.Library,
                    properties: [{ property: PROP.INamedName, value: "Library first" }]
                })
            )
            const subscribeRequest = client.sendRequest(newSubscribeToPartitionRequest("Library-01"))
            const addPropertyCmd = addProperty("Program-01", "draw rectangle", "LionCore-builtins-INamed-name")
            const addChildCommand = addChild({id: "Procedure-01", cls: CLS.Procedure, parent: "Library-01", containment: CON.LibraryProcedures, props: [{ prop: PROP.INamedName, value: "Proc first" }]})
            const addChildCommand1 = addChild({id: "Move-02", cls: CLS.MoveCommand, parent: "Procedure-01", containment: CON.ProcedureBody,props: []})
            const deleteChildCommand = deleteChild({ id: "Procedure-01", index: 0, parent: "Library-01", containment: CON.LibraryProcedures })
            
            expect((await eventFor(addPartitionCommand)).messageKind).toEqual("PartitionAdded")
            expect((await responseFor(subscribeRequest)).messageKind).toEqual("ErrorResponse")
            expect((await eventFor(addPropertyCmd)).messageKind).toEqual("ErrorEvent")
            expect((await eventFor(addChildCommand)).messageKind).toEqual("ChildAdded")
            expect((await eventFor(addChildCommand1)).messageKind).toEqual("ChildAdded")
            expect((await eventFor(deleteChildCommand)).messageKind).toEqual("ChildDeleted")
        })
        test.skip("References", async () => {
            client.loggingOn = true
            const addChildCommand = addChild({id: "Call-01", cls: CLS.ProcedureCall, parent: "Program-01", containment: CON.ProgramCommands, props: []})
            const refCmd = addReference({id: "Call-01", index: 0, target: "Procedure-01", resolveInfo: "PROC-01", reference: REF.ProcedureCallProcedure})
            client.sendCommand(refCmd)

            expect((await eventFor(addChildCommand)).messageKind).toEqual("ChildAdded")
            expect((await eventFor(refCmd)).messageKind).toEqual("ReferenceAdded")

            console.log("SentMessages 3")
            console.log(client.sentMessageHistory)
            console.log("ReceivedMessages 3")
            console.log(client.receivedMessageHistory)
            await makeSnapShot()
        })

        /**
         * Function that waits for the event corresponding to `command`
         * @param command
         */
        const eventFor = async (command: DeltaCommand): Promise<DeltaEvent> => {
            return await waitFor<DeltaEvent>(
                () => client.receivedEvents.get(command.commandId),
                result => result === undefined,
                50,
                10,
                `query ${command.commandId} ${command.messageKind}`
            )
        }
        const responseFor = async (query: DeltaRequest): Promise<DeltaResponse | DeltaAdminResponse> => {
            return await waitFor<DeltaResponse | DeltaAdminResponse>(
                () => client.receivedResponses.get(query.queryId),
                result => result === undefined,
                50,
                10,
                `query ${query.queryId} ${query.messageKind}`
            )
        }

        const addChild = (child: NewChild): DeltaCommand => {
            const cmd = newAddChild(child)
            return client.sendCommand(cmd)
        }
        const deleteChild = (child: DeleteChildType): DeltaCommand => {
            const cmd = newDeleteChild(child)
            return client.sendCommand(cmd)
        }
        const addProperty = (nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
            const cmd = newAddPropertyCommand(nodeid, newValue, propertyKey)
            return client.sendCommand(cmd)
        }
        const changeProperty = (nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
            const cmd = newChangePropertyCommand(nodeid, newValue, propertyKey)
            return client.sendCommand(cmd)
        }
        const deleteProperty = (nodeid: string, propertyKey: string): DeltaCommand => {
            const cmd = newDeletePropertyCommand(nodeid, propertyKey)
            return client.sendCommand(cmd)
        }
    })
})

function hasError(event: DeltaEvent, errorCode: string): boolean {
    return isErrorEvent(event) && event.errorCode === errorCode
}

async function makeSnapShot(): Promise<void> {
    const partition = await bulkApiClient.bulk.retrieve(["Library-01", "Program-01"])
    // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
    const string = new Logo2String(partition.body.chunk.nodes).logo2string()
    console.log(string)
}
