import { DeltaClient } from "@lionweb/server-delta-client"
import { HttpSuccessCodes, RetrieveResponse } from "@lionweb/server-shared"
import { getVersionFromResponse, RepositoryClient } from "@lionweb/server-client"
import { LionWebJsonChunk } from "@lionweb/json"
// import { LanguageChange, LionWebJsonDiff } from "@lionweb/json-diff"
import { AddPartitionCommand, DeltaCommand } from "@lionweb/server-delta-shared"
// import { describe, before, beforeEach, beforeAll, test } from "vitest"
import { readDelta, readModel } from "./utils.js"

import { assert } from "chai"
const { deepEqual, equal } = assert
import sm from "source-map-support"

sm.install()
const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "MyFirstRepo" : "MyFirstHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), () => {
        const bulkApiClient = new RepositoryClient("TestClient", repository)
        const deltaApiClient = new DeltaClient("TestClient", repository)
        // client.loggingOn = true
        let initialPartition: LionWebJsonChunk
        let initialPartitionVersion: number = 0
        let baseFullChunk: LionWebJsonChunk
        let baseFullChunkVersion: number = 0
        let initError: string = ""

        beforeAll(async function () {
            console.log("VEFORE ALL")
            const initResponse = await bulkApiClient.dbAdmin.createDatabase()
            console.log("VEFORE ALL DB")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create database: " + JSON.stringify(initResponse.body))
            } else {
                console.log("database created: " + JSON.stringify(initResponse.body))
            }
            console.log("VEFORE ALL 2")
            await deltaApiClient.connect()
            await delay(20000)
            deltaApiClient.sendCommand({ "messageKind": "AddProperty" }  as DeltaCommand)
            console.log("VEFORE ALL 3")
        })

        beforeEach(async function () {
            bulkApiClient.repository = repository
            initError = ""
            initialPartition = readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk
            baseFullChunk = readModel(DATA + "Disk_A.json") as LionWebJsonChunk
            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot initialize database: " + JSON.stringify(initResponse.body))
                initError = JSON.stringify(initResponse.body)
                return
            } else {
                console.log("initialized database: " + JSON.stringify(initResponse.body))
            }
            const partResult = await bulkApiClient.bulk.createPartitions(initialPartition)
            if (partResult.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create initial partition: " + JSON.stringify(partResult.body))
                initError = JSON.stringify(partResult.body)
                return
            }
            console.log("PARTITION INITIAL " + JSON.stringify(partResult.body.messages))
            initialPartitionVersion = getVersionFromResponse(partResult)
            const result = await bulkApiClient.bulk.store(baseFullChunk)
            if (result.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot store initial chunk: " + JSON.stringify(result.body))
                initError = JSON.stringify(result.body)
                return
            }
            baseFullChunkVersion = getVersionFromResponse(result)
            console.log(
                "repoVersionAfterPartitionCreated " + initialPartitionVersion + "repoVersionAfterPartitionFilled " + baseFullChunkVersion
            )
            const repositories = await bulkApiClient.dbAdmin.listRepositories()
            console.log("repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterEach( async function () {
            await bulkApiClient.dbAdmin.deleteRepository(repository)
        })
        
        describe("Partition tests", () => {
            test("AddPartition", async () => {
                console.log("START")
                assert(initError === "", initError)
                console.log("START 2")
                const cmd: AddPartitionCommand = {
                    messageKind: "AddPartition",
                    newPartition: { 
                        nodes: [
                            {
                                id: "ID-NewPartition",
                                parent: null,
                                classifier: {
                                    key: "key",
                                    language: "language",
                                    version: "version"
                                },
                                properties: [],
                                containments: [],
                                references: [],
                                annotations: []
                            }
                        ]
                    },
                    commandId: "0",
                    protocolMessages: [
                        {
                            kind: "Info",
                            message: "Add a new partition",
                            data:[]
                        }
                    ]
                }
                deltaApiClient.sendCommand(cmd)
                console.log("START 3")

                await delay(20000)
                console.log("START 3")

            })
        })
    })
})
