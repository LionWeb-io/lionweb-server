import { DeltaClient } from "@lionweb/server-delta-client"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { getVersionFromResponse, RepositoryClient } from "@lionweb/server-client"
import { LionWebJsonChunk } from "@lionweb/json"
import { AddPartitionCommand, DeltaCommand, SignOnRequest } from "@lionweb/server-delta-shared"
import { readModel } from "./utils.js"

import { assert } from "chai"
const { deepEqual, equal } = assert
import sm from "source-map-support"

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

sm.install()
const DATA: string = "./data/"

    const repository = "MyFirstRepo"
    const bulkApiClient = new RepositoryClient("TestClient", repository)
    const deltaApiClient = new DeltaClient("TestClient", repository)
        // client.loggingOn = true
    let initialPartition: LionWebJsonChunk
    let initialPartitionVersion: number = 0
    let baseFullChunk: LionWebJsonChunk
    let baseFullChunkVersion: number = 0
    let initError: string = ""

    console.log("BEFORE ALL")
    let initResponse = await bulkApiClient.dbAdmin.createDatabase()
    console.log("BEFORE ALL DB")
    if (initResponse.status !== HttpSuccessCodes.Ok) {
        console.log("Cannot create database: " + JSON.stringify(initResponse.body))
    } else {
        console.log("database created: " + JSON.stringify(initResponse.body))
    }
    console.log("BEFORE ALL 2")
    await deltaApiClient.connect()
    await delay(2000)

    const signOn: SignOnRequest = {
        clientId: "cli",
        repositoryId: "1",
        deltaProtocolVersion: "1",
        messageKind: "SignOn",
        queryId: "12",
        protocolMessages: []
    }
    console.log("BEFORE ALL 3")
    deltaApiClient.sendRequest(signOn)
    console.log("BEFORE ALL 4")
    await delay(2000)
    deltaApiClient.sendCommand({ "messageKind": "AddProperty", node: "123", newValue: "NEW", property: {
            key: "key",
            language: "language",
            version: "version"
        },
        commandId: "C1",
        protocolMessages: []
    }  as DeltaCommand)
    console.log("VEFORE ALL 5")

    bulkApiClient.repository = repository
    initError = ""
    initialPartition = readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk
    baseFullChunk = readModel(DATA + "Disk_A.json") as LionWebJsonChunk
    initResponse = await bulkApiClient.dbAdmin.createRepository(repository, false, "2023.1")
    if (initResponse.status !== HttpSuccessCodes.Ok) {
        console.log("Cannot initialize database: " + JSON.stringify(initResponse.body))
        initError = JSON.stringify(initResponse.body)
        // process.exit(1)
    } else {
        console.log("initialized database: " + JSON.stringify(initResponse.body))
    }
    const partResult = await bulkApiClient.bulk.createPartitions(initialPartition)
    if (partResult.status !== HttpSuccessCodes.Ok) {
        console.log("Cannot create initial partition: " + JSON.stringify(partResult.body))
        initError = JSON.stringify(partResult.body)
        process.exit(1)
    }
    console.log("PARTITION INITIAL " + JSON.stringify(partResult.body.messages))
    initialPartitionVersion = getVersionFromResponse(partResult)
    const result = await bulkApiClient.bulk.store(baseFullChunk)
    if (result.status !== HttpSuccessCodes.Ok) {
        console.log("Cannot store initial chunk: " + JSON.stringify(result.body))
        initError = JSON.stringify(result.body)
        process.exit(1)
    }
    baseFullChunkVersion = getVersionFromResponse(result)
    console.log(
        "repoVersionAfterPartitionCreated " + initialPartitionVersion + "repoVersionAfterPartitionFilled " + baseFullChunkVersion
    )
    const repositories = await bulkApiClient.dbAdmin.listRepositories()
    console.log("repositories: " + JSON.stringify(repositories.body.repositories))

        
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
    console.log("SEND AGAIN")

    deltaApiClient.sendCommand(cmd)
    console.log("LAST SEND DONE, DELETE REPO")

    await bulkApiClient.dbAdmin.deleteRepository(repository)
