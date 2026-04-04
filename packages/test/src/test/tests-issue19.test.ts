import { HttpSuccessCodes } from "@lionweb/server-shared"
import { RepositoryClient } from "@lionweb/server-http-client"
import { LionWebJsonChunk } from "@lionweb/json"
import { afterEach } from "vitest"
import { readModel } from "./utils.js"

import { assert } from "chai"
const DATA: string = "./data/"

describe("Repository tests", () => {
    const t = new RepositoryClient({ clientId: "TestClient", repository: "default" })
    t.loggingOn = true

    beforeEach(async function () {
        const createResponse = await t.dbAdmin.createDatabase()
        if (createResponse.status !== HttpSuccessCodes.Ok) {
            console.log("Cannot create database: " + JSON.stringify(createResponse.body))
        } else {
            console.log("database created: " + JSON.stringify(createResponse.body))
        }
        const delRepo = await t.dbAdmin.deleteRepository("default")
        console.log(`delRepo ${JSON.stringify(delRepo)}`)
        const creRepo = await t.dbAdmin.createRepository("default", true, "2023.1")
        console.log(`creaRepo ${JSON.stringify(creRepo)}`)
        const createPart = await t.bulk.createPartitions(readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk)
        console.log(`createPart ${JSON.stringify(createPart)}`)
    })

    afterEach( async function()  {
        const reply = await t.dbAdmin.deleteRepository("default")
        console.log(`afterEach.deleteReposigtory ${JSON.stringify(reply.body)}`)
    })
    
    describe("Add new node", async () => {
        it("test update single node", async () => {
            await storeFiles(["./data/Disk_A.json", "./data/add-new-nodes/Disk-add-new-nodes-single-node.json", "./data/Disk_A.json"])
        })
    })

    async function storeFiles(files: string[]) {
        for (const file of files) {
            const changesChunk = readModel(file) as LionWebJsonChunk
            const result = await t.bulk.store(changesChunk)
            assert.isTrue(result.status === HttpSuccessCodes.Ok, "Incorrect HTTP status: something went wrong")
        }
    }
})
