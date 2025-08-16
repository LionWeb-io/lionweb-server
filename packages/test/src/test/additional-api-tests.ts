import { HttpSuccessCodes } from "@lionweb/server-shared"
import { RepositoryClient, TransferFormat } from "@lionweb/server-client"
import { LionWebJsonChunk } from "@lionweb/json"
import { LionWebJsonDiff } from "@lionweb/json-diff"

import { assert } from "chai"
import sm from "source-map-support"
import { BulkImport } from "@lionweb/server-shared"

const { deepEqual, fail, strictEqual } = assert

sm.install()

describe("Client - Additional API tests", () => {
    const repository = "clientAdditionalAPIRepo";
    const client = new RepositoryClient("TestClient", repository)
    let initError: string = ""

    before("create database", async function () {
        const initResponse = await client.dbAdmin.createDatabase()
        if (initResponse.status !== HttpSuccessCodes.Ok) {
            console.log("Cannot create database: " + JSON.stringify(initResponse.body))
        } else {
            console.log("database created: " + JSON.stringify(initResponse.body))
        }
    })

    beforeEach("a", async function () {
        client.repository = repository
        initError = ""
        const initResponse = await client.dbAdmin.createRepository(repository, false, "2023.1")
        if (initResponse.status !== HttpSuccessCodes.Ok) {
            console.log("Cannot initialize database: " + JSON.stringify(initResponse.body))
            initError = JSON.stringify(initResponse.body)
            return
        } else {
            console.log("initialized database: " + JSON.stringify(initResponse.body))
        }
        const repositories = await client.dbAdmin.listRepositories()
        console.log("repositories: " + JSON.stringify(repositories.body.repositories))
    })

    afterEach("a", async function () {
        await client.dbAdmin.deleteRepository(repository)
    })

    describe("TS Tests", () => {
        it('Verify what happens when throwing in async', async function () {
            async function throwingFunction(): Promise<void> {
                throw new Error("Throwing, to see what happens")
            }
            return throwingFunction().then(()=>{
                fail("This should not happen")
            }).catch((err)=>{
                console.log("This was expected", err)
                strictEqual((err as Error).message, "Throwing, to see what happens");
            })
        })
    })

    describe("Bulk import", () => {
        const combinations = [{format: TransferFormat.JSON, compression: false},
            {format: TransferFormat.JSON, compression: true}, {format: TransferFormat.FLATBUFFERS, compression: false}]
        combinations.forEach(combination => {
            const format = combination.format;
            const compression = combination.compression;
            it(`bulk import, ${compression? 'with compression' : 'without compression'}, ${format}`, async function () {
                this.timeout(15_000)
                assert(initError === "", initError)

                const bulkImport: BulkImport = {
                    attachPoints: [],
                    nodes: [
                        {
                            id: "bi-id1",
                            classifier: {
                                language: "bi-language",
                                version: "v1.1",
                                key: "bi-language-key"
                            },
                            properties: [
                                {
                                    property: {
                                        language: "bi-language",
                                        version: "v1.1",
                                        key: "bi-p1"
                                    },
                                    value: "qwerty"
                                }
                            ],
                            containments: [],
                            references: [
                                {
                                    reference: {
                                        language: "bi-language",
                                        version: "v1.1",
                                        key: "bi-r1"
                                    },
                                    targets: [
                                        {
                                            reference: "id-a",
                                            resolveInfo: "resolveInfo-a"
                                        },
                                        {
                                            reference: "id-b",
                                            resolveInfo: "resolveInfo-b"
                                        }
                                    ]
                                }
                            ],
                            annotations: [],
                            parent: null
                        }
                    ]
                }

                const bulkImportResult = await client.additional.bulkImport(bulkImport, format, compression)
                if (bulkImportResult.status !== HttpSuccessCodes.Ok) {
                    const errMsg = "Cannot create partition using bulk import: " + JSON.stringify(bulkImportResult.body)
                    console.error(errMsg)
                    const err = JSON.stringify(bulkImportResult.body)
                    fail(err)
                }
                // Now retrieve the partition again.
                const partitions = await client.bulk.retrieve(["bi-id1"])
                const diff = new LionWebJsonDiff()
                const expectedModel: LionWebJsonChunk = {
                    serializationFormatVersion: "2023.1",
                    languages: [
                        {
                            key: "bi-language",
                            version: "v1.1"
                        }
                    ],
                    nodes: bulkImport.nodes
                }
                diff.diffLwChunk(expectedModel, partitions.body.chunk)
                deepEqual(diff.diffResult.changes, [])

                await client.bulk.deletePartitions(["bi-id1"])
            })
        })
    })
})
