import { DeltaClient } from "@lionweb/server-delta-client"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { getVersionFromResponse, RepositoryClient } from "@lionweb/server-client"
import { LionWebJsonChunk } from "@lionweb/json"
import {
    newAddPartitionCommand,
    newAddPropertyCommand,
    newChangePropertyCommand,
    newDeletePropertyCommand,
    newSignOnRequest
} from "./commands.js"
import { readModel } from "./utils.js"

import { test, assert, describe, beforeAll, beforeEach, afterEach, expect } from "vitest"
// const { deepEqual, equal } = assert
import sm from "source-map-support"

sm.install()
const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "MyFirstRepo" : "MyFirstHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const bulkApiClient = new RepositoryClient("TestClient", repository)
        const deltaApiClient = new DeltaClient("TestClient", repository)
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
            await delay(200)
            await deltaApiClient.sendRequest(newSignOnRequest(repository, "TestClient"))
            // await delay(200)
            await deltaApiClient.sendCommand(newAddPropertyCommand("node-12", "value-1", "-key-Concept-name"))
            await deltaApiClient.sendCommand(newChangePropertyCommand("node-12", "value-2", "-key-Concept-name"))
        })

        beforeEach(async function () {
            bulkApiClient.repository = repository
            initError = ""
            initialPartition = readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk
            // baseFullChunk = readModel(DATA + "Disk_A.json") as LionWebJsonChunk
            const partResult = await bulkApiClient.bulk.createPartitions(initialPartition)
            if (partResult.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create initial partition: " + JSON.stringify(partResult.body))
                // initError = JSON.stringify(partResult.body)
                // return
            }
            // // initialPartitionVersion = getVersionFromResponse(partResult)
            // const result = await bulkApiClient.bulk.store(baseFullChunk)
            // if (result.status !== HttpSuccessCodes.Ok) {
            //     console.log("Cannot store initial chunk: " + JSON.stringify(result.body))
            //     initError = JSON.stringify(result.body)
            //     return
            // }
            // baseFullChunkVersion = getVersionFromResponse(result)
            // console.log(
            //     "repoVersionAfterPartitionCreated " + initialPartitionVersion + "repoVersionAfterPartitionFilled " + baseFullChunkVersion
            // )
            const repositories = await bulkApiClient.dbAdmin.listRepositories()
            console.log("repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterEach( async function () {
            await bulkApiClient.dbAdmin.deleteRepository(repository)
        })
        
        describe("Partition tests", () => {
            test("AddPartition", async () => {
                assert(initError === "", initError)
                const cmd = newAddPartitionCommand("ID-NewPartition","key")
                deltaApiClient.sendCommand(cmd)
                deltaApiClient.sendCommand(newDeletePropertyCommand("ID-NewPartition", "-key-Partition-name"))
                deltaApiClient.sendCommand(newChangePropertyCommand("ID-2", "nw value", "LionCore-builtins-INamed-name"))
                await delay(200)
                console.log("SentMessages")
                console.log(deltaApiClient.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(deltaApiClient.receivedMessageHistory)
                assert(deltaApiClient.receivedMessageHistory[deltaApiClient.receivedMessageHistory.length-3].includes("PartitionAdded"), "Expected PartitionAdded")
            })
        })
    })
})
