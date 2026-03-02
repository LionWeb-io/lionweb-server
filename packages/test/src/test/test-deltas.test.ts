import { RepositoryClient } from "@lionweb/server-client"
import { DeltaClient, eventFunctions } from "@lionweb/server-delta-client"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { LionWebJsonChunk } from "@lionweb/json"
import { Commands } from "./commands.js"
import { printChunk, readModel } from "./utils.js"

import { test, assert, describe, beforeAll, beforeEach, afterEach } from "vitest"
// const { deepEqual, equal } = assert
// import sm from "source-map-support"

// sm.install()
const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "MyFirstRepo" : "MyFirstHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const bulkApiClient = new RepositoryClient({clientId: "TestClient", repository: repository})
        const deltaApiClient = new DeltaClient({}, [eventFunctions])
        deltaApiClient.clientId = "TestClient"
        deltaApiClient.repository = repository
        const cmd = new Commands(deltaApiClient)
        // client.loggingOn = true
        let initialPartition: LionWebJsonChunk
        // let initialPartitionVersion: number = 0
        // let baseFullChunk: LionWebJsonChunk
        // let baseFullChunkVersion: number = 0
        let initError: string = ""

        beforeAll(async function () {
            // const initResponse = await bulkApiClient.dbAdmin.createDatabase()
            // if (initResponse.status !== HttpSuccessCodes.Ok) {
            //     console.log("Cannot create database: " + JSON.stringify(initResponse.body))
            // } else {
            //     console.log("Database created: " + JSON.stringify(initResponse.body))
            // }
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create repository: " + JSON.stringify(initResponse.body))
                // initError = JSON.stringify(initResponse.body)
                // return
            } else {
                console.log("Created repository: " + JSON.stringify(initResponse.body))
            }
            const repositories = await bulkApiClient.dbAdmin.listRepositories()
            console.log("repositories: " + JSON.stringify(repositories.body.repositories))

            await deltaApiClient.connect()
            const signOn = cmd.signOnRequest(repository, "TestClient")
            expect((await cmd.responseFor(signOn)).messageKind).toEqual("SignOnResponse")

            // await deltaApiClient.sendRequest(newSubscribeToPartitionRequest(repository, "TestClient", "ID-2"))
            // await delay(200)
        })

        beforeEach(async function () {
            bulkApiClient.repository = repository
            initError = ""
            initialPartition = readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk
            const baseFullChunk = readModel(DATA + "Disk_A.json") as LionWebJsonChunk
            const partResult = await bulkApiClient.bulk.createPartitions(initialPartition)
            if (partResult.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create initial partition: " + JSON.stringify(partResult.body))
                // initError = JSON.stringify(partResult.body)
                // return
            }
            const result = await bulkApiClient.bulk.store(baseFullChunk)
            printChunk(baseFullChunk)
            if (result.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot store initial chunk: " + JSON.stringify(result.body))
                // initError = JSON.stringify(result.body)
                // return
            }
            
            const sub = cmd.subscribeToPartitionContentsRequest("ID-2")
            const addProp = cmd.addProperty("node-122", "value-1", "-key-Concept-name")
            const changeProp = cmd.changeProperty("node-124", "value-2", "-key-Concept-name")

            expect((await cmd.responseFor(sub)).messageKind).toEqual("SubscribeToPartitionContentsResponse")
            expect((await cmd.eventFor(addProp)).messageKind).toEqual("PropertyAdded")
            expect((await cmd.eventFor(changeProp)).messageKind).toEqual("PropertyChanged")

            const repositories = await bulkApiClient.dbAdmin.listRepositories()
            console.log("repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterEach( async function () {
            // await bulkApiClient.dbAdmin.deleteRepository(repository)
        })
        
        describe("Simple Delta tests", () => {
            test("AddPartition", async () => {
                assert(initError === "", initError)
                cmd.addPartition({ id: "ID-NewPartition20", classifier: {key: "key", language: "l", version: "`1.0"}})

                cmd.subscribeToPartitionContentsRequest("ID-NewPartition20",)
                cmd.deleteProperty("ID-NewPartition20", "-key-Partition-name")
                cmd.deleteProperty("ID-2", "-key-Partition-name")
                // deltaApiClient.sendCommand(newDeletePropertyCommand("ID-2", "LionCore-builtins-INamed-name"))
                cmd.changeProperty("ID-12", "NEW value", "LionCore-builtins-INamed-name")
                cmd.addProperty("ID-NewPartition20", "value-1", "Lione-builtins-INamed-name")

                await delay(200)
                console.log("SentMessages")
                console.log(deltaApiClient.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(deltaApiClient.receivedMessageHistory)
                // assert(deltaApiClient.receivedMessageHistory[4].includes("PartitionAdded"), "Expected PartitionAdded")
            })
        })
    })
})
