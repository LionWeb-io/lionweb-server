import { RepositoryClient } from "@lionweb/server-http-client"
import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import { PartitionAddedEvent } from "@lionweb/server-delta-shared"
import { HttpSuccessCodes  } from "@lionweb/server-shared"
import { test, describe, beforeAll, beforeEach, afterAll } from "vitest"
import { reportHTML } from "./helpers.js"
import { CLASSIFIER as CLS, CONTAINMENT as CON } from "../models/keys.js"
import { programNodes, resetModels } from "../models/testmodel.js"
import { Logo2String } from "../models/Logo2String.js"
import { beforeAllTests } from "./SharedTest.js"
import { CoverageMap, cmd, expectEvent, expectResponse, expectError, logProtocol } from "./test-helpers.js"

// TOPO Delta : primary key exception when nohistory = false 
const collection = [true]
const log: boolean = false

const config = {
    // hostname: "192.168.100.1",
    hostname: "127.0.0.1",
    port: 3005,
    timeout: 2000,
}

// Run all, tests with and without history
const client1 = new DeltaClient("client1", config, [eventFunctions, responseFunctions, adminResponseFunctions])
const client2 = new DeltaClient("client2", config, [eventFunctions, responseFunctions, adminResponseFunctions])
const client3 = new DeltaClient("client3", config, [eventFunctions, responseFunctions, adminResponseFunctions])
const client4 = new DeltaClient("client4", config, [eventFunctions, responseFunctions, adminResponseFunctions])

collection.forEach((withoutHistory) => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    const bulkApiClient = new RepositoryClient({ clientId: "BulkClient-01", repository: repository })

    describe("Multi Client Delta tests " + (withoutHistory ? "without history" : "with history"), async () => {
        client1.repository = repository
        client2.repository = repository
        client3.repository = repository
        client4.repository = repository + "_other"

        beforeAll(async function () {
            await beforeAllTests(withoutHistory)
            bulkApiClient.repository = repository
            const delResponse = await bulkApiClient.dbAdmin.deleteRepository(repository, "delete at start og test")
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
            } else {
                console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
            }
            client1.loggingOn = log
            client2.loggingOn = log
            client3.loggingOn = log
            client4.loggingOn = log
            await client1.connect()
            await client2.connect()
            await client3.connect()
            await client4.connect()
            const listReposRequest = cmd.listRepositories(client1)
            // const deleteRepo = deleteRepository(repository)
            // await responseFor(deleteRepo)
            const addRepo = cmd.addRepository(client1, repository)

            expect((await cmd.responseFor(client1, addRepo)).messageKind).toEqual("CreateRepositoryAdminResponse")

            const signOn = cmd.signOnRequest(client1, client1.repository)

            expect((await cmd.responseFor(client1, listReposRequest)).messageKind).toEqual("ListRepositoriesAdminResponse")
            await expectResponse(client1, signOn, "SignOnResponse")
            expect(await cmd.responseFor(client1, signOn)).toMatchObject({
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
            // client1.sentMessageHistory = []
            // client1.receivedMessageHistory = []
        })

        afterAll(async function () {
            // deltaApiClient01.sendRequest(newUnSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "Program-01",))
            console.log("CLOSING")
            client1.socket.close()
            // client2.socket.close()
            // client3.socket.close()
            // client4.socket.close()
            console.log("CLOSED")
            // const reply = await bulkApiClient.dbAdmin.deleteRepository(repository)
            // console.log(`afterEach.deleteRepository ${JSON.stringify(reply.body)}`)
            // console.log("DELETED")
            reportHTML(CoverageMap)
        })

        describe("Multi Client Partition tests", () => {
            test("SignOnOff", async () => {
                // Signing on twice is ok
                const signOn = cmd.signOnRequest(client1, repository)
                await expectResponse(client1, signOn, "SignOnResponse")
                const signOn2 = cmd.signOnRequest(client2, repository)
                await expectResponse(client2, signOn2, "SignOnResponse")
                const signOn3 = cmd.signOnRequest(client3, repository)
                await expectResponse(client3, signOn3, "SignOnResponse")
                const signOn4 = cmd.signOnRequest(client4, repository)
                await expectResponse(client4, signOn4, "SignOnResponse")

                const oldPid = client3.participationId
                client3.socket.close(1000, "Testing close socket.")
                await client3.connect()
                const reconnect = cmd.reconnect(client3, oldPid)
                await expectResponse(client3, reconnect, "ReconnectResponse")

                const inform2 = cmd.informAbout(client2, 3)
                await expectResponse(client2, inform2, "InformAboutChangingPartitionsResponse")
                const sub2 = cmd.subscribeToChangingPartitions(client3)
                await expectResponse(client3, sub2, "SubscribeToChangingPartitionsResponse")

                const oldPid2 = client2.participationId
                client2.socket.close(1000, "Testing close socket.")
                await client2.connect()
                const reconnect2 = cmd.reconnect(client2, "unknownParticipationId")
                await expectResponse(client2, reconnect2, "ErrorResponse")
                await expectError(client2, reconnect2, "invalidParticipation")
                const reconnect3 = cmd.reconnect(client2, oldPid2)
                await expectResponse(client2, reconnect3, "ReconnectResponse")

            })
            test("MultiClient AddPartition", async () => {
                // assert(initError === "", initError)
                const addPartitionCommand1 = cmd.addPartition(client1, { id: "Program-01", classifier: CLS.Program })
                await expectEvent(client1, addPartitionCommand1, "PartitionAdded")
                await expectEvent(client2, addPartitionCommand1, "PartitionAdded")
                await expectEvent(client3, addPartitionCommand1, "PartitionAdded")

                const deletePartition = cmd.deletePartition(client1, "Program-01")
                await expectEvent(client1, deletePartition, "PartitionDeleted")
                await expectEvent(client2, deletePartition, "PartitionDeleted")
                await expectEvent(client3, deletePartition, "PartitionDeleted")
                await expect(cmd.eventFor(client4, deletePartition)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")

                // const unsubscribe = cmd.unsubscribeToChangingPartitions(client3)
                // await expectResponse(client3, unsubscribe, "SubscribeToChangingPartitionsResponse")
                const unsubscribe = cmd.unInformAboutChangingPartitions(client3)
                await expectResponse(client3, unsubscribe, "InformAboutChangingPartitionsResponse")

                const addPartitionCommand2 = cmd.addPartition(client2, { id: "Program-011", classifier: CLS.Program })
                await expectEvent(client2, addPartitionCommand2, "PartitionAdded")
                // await expectEvent(client3, addPartitionCommand2, "PartitionAdded")
                await expect(cmd.eventFor(client1, addPartitionCommand2)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")
                await expect(cmd.eventFor(client3, addPartitionCommand2)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")
                await expect(cmd.eventFor(client4, addPartitionCommand2)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")

                // logProtocol(client1, true)
                // logProtocol(client2, true)
                // logProtocol(client3, true)
                // logProtocol(client4, true)
            })
            test("MultiClient CompositeCommand", async () => {
                const subscribe = cmd.informAbout(client3, 2)
                const composite = cmd.compositeCommandCmd()
                const addP = cmd.addPartitionCmd(client2, { id: "Program-022", classifier: CLS.Program })

                // addP.additionalInfos = undefined
                composite.parts.push(addP)
                const nestedComposite = cmd.compositeCommandCmd()
                const addChildCommand1 = cmd.addChildCmd(client2, { id: "Move-022", cls: CLS.MoveCommand, parent: "Program-022", containment: CON.ProgramCommands, index: 0, props: [] })
                nestedComposite.parts.push(addChildCommand1)
                composite.parts.push(nestedComposite)
                client2.sendCommand(composite)
                await expectResponse(client3, subscribe, "InformAboutChangingPartitionsResponse")

                await expectEvent(client2, composite, "CompositeEvent")
                await expectEvent(client3, composite, "CompositeEvent")
                // console.log(`COMPOSITE EVNT ${JSON.stringify(event, null, 2)}`)
                await expect(cmd.eventFor(client1, composite)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")
                await expect(cmd.eventFor(client4, composite)).rejects.toThrowErrorMatchingInlineSnapshot("[Error: TimeOut]")

            })
            test("AddPartition with depth", async () => {
                resetModels()
                const addPartition = cmd.addPartitionCmd(client2, { id: "Program", classifier: CLS.Program })
                addPartition.newPartition.nodes = programNodes
                client2.sendCommand(addPartition)
                
                await expectEvent(client2, addPartition, "PartitionAdded")

                {
                    const client2Event = (await cmd.eventFor(client2, addPartition)) as PartitionAddedEvent
                    const logo = new Logo2String(client2Event.newPartition.nodes)

                    console.log("Client 2 Depth 3")
                    console.log(logo.logo2string())
                }
                {
                    const depth1 = (await cmd.eventFor(client3, addPartition)) as PartitionAddedEvent
                    const logo3 = new Logo2String(depth1.newPartition.nodes)
                    console.log("Client 3 Depth 1")
                    console.log(logo3.logo2string())
                }
                // logProtocol(client1, true)
                logProtocol(client2, bulkApiClient, ["Program", "Program-22"], true)
                logProtocol(client3, bulkApiClient, ["Program", "Program-22"], true)
                // logProtocol(client4, true)
            })
        })
    })

})


