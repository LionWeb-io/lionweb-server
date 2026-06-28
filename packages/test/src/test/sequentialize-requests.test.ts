import { ClientResponse, RepositoryClient } from "@lionweb/server-http-client"
import { StoreResponse } from "@lionweb/server-shared"
import { LionWebJsonChunk } from "@lionweb/json"
import { VAR } from "../data.js"

// import sm from "source-map-support"
import { afterEach, describe, beforeEach, it, expect } from "vitest"
import { readModel } from "./utils.js"

console.log(`Var 1 is '${VAR.value}'`)

// sm.install()

describe("Transaction isolation tests", () => {
    const t = new RepositoryClient({ clientId: "TestClient", repository: "isolation" })
    t.loggingOn = true
    console.log(`Var 2 is '${VAR.value}'`)

    beforeEach(async function () {
        console.log(`Var 3 is '${VAR.value}'`)
        const delRepo = await t.dbAdmin.listRepositories()
        console.log(`delRepo ${JSON.stringify(delRepo)}`)
        
        const deleteResult = await t.dbAdmin.deleteRepository("isolation")
        const createResult = await t.dbAdmin.createRepository("isolation", true, "2023.1")

        console.log(`deleteResult ${JSON.stringify(deleteResult)}`)
        console.log(`createResult ${JSON.stringify(createResult)}`)
        
        const delRepo2 = await t.dbAdmin.listRepositories()
        console.log(`delRepo ${JSON.stringify(delRepo2)}`)
        
        await t.bulk.createPartitions(readModel("./data/Disk_A_partition.json") as LionWebJsonChunk)
    })

    afterEach( async function()  {
        // const reply = await t.dbAdmin.deleteRepository("isolation")
        // console.log(`afterEach.deleteRepository ${JSON.stringify(reply.body)}`)
    })

    describe("Nowait", () => {
        it("test sending requests without waiting, so they will be sequentialized.", async () => {
            console.log(`Var is '${VAR.value}'`)
            await storeFiles([
                "./data/Disk_A.json",
                "./data/add-new-annotation/Disk-add-new-annotation-partition.json",
                "./data/add-new-nodes/Disk-add-new-nodes-partition.json",
                "./data/add-new-property-with-value/Disk-Property-add-property-partition.json"
            ])
        })
    })

    async function storeFiles(files: string[]) {
        const chunks = []
        const results: Promise<ClientResponse<StoreResponse>>[] = []
        for (const file of files) {
            const changesChunk = readModel(file) as LionWebJsonChunk
            chunks.push(changesChunk)
        }
        let i = 1
        for (const ch of chunks) {
            console.log("request " + i++)
            results.push(t.bulk.store(ch))
        }
        for (const result of results) {
            result.then(answer => {
                expect(answer.body.success).toBeTruthy()
                // assert(answer.body.success, `Request should be done correctly: ${JSON.stringify(answer)}`)
                // console.log(`===== Result ok: ${answer.body.success}, messages: ${answer.body.messages.map(m => m.kind + ": " + m.message) + "\n"}`)
            })
        }
    }
})
