import { HttpClientErrors, HttpSuccessCodes, RetrieveResponse } from "@lionweb/server-shared"
import { getVersionFromResponse, RepositoryClient } from "@lionweb/server-http-client"
import { LionWebJsonChunk } from "@lionweb/json"
import { LanguageChange, LionWebJsonDiff } from "@lionweb/json-diff"
import { readModel } from "./utils.js"
import { describe, afterEach, beforeAll, beforeEach, it, expect } from "vitest"

const DATA: string = "./data/"

const collection = [true, false]

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "MyFirstRepo" : "MyFirstHistoryRepo"
    const config = {
        clientId: "TestClient",
        repository: repository,
        // hostname: "192.168.100.1",
        hostname: "127.0.0.1",
        port: "3005"
    }
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), () => {
        const client = new RepositoryClient(config)
        // client.hostname = "192.168.100.1"
        // client.loggingOn = true
        let initialPartition: LionWebJsonChunk
        let initialPartitionVersion: number = 0
        let baseFullChunk: LionWebJsonChunk
        let baseFullChunkVersion: number = 0
        let initError: string = ""

        beforeAll(async function () {
            const initResponse = await client.dbAdmin.createDatabase()
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create database: " + JSON.stringify(initResponse.body))
            } else {
                console.log("database created: " + JSON.stringify(initResponse.body))
            }
        })

        beforeEach(async function () {
            client.repository = repository
            initError = ""
            initialPartition = readModel(DATA + "Disk_A_partition.json") as LionWebJsonChunk
            baseFullChunk = readModel(DATA + "Disk_A.json") as LionWebJsonChunk
            const initResponse = await client.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository: ${repository}` + JSON.stringify(initResponse.body))
                initError = JSON.stringify(initResponse.body)
                return
            } else {
                console.log(`created repository ${repository}: ` + JSON.stringify(initResponse.body))
            }
            const partResult = await client.bulk.createPartitions(initialPartition)
            if (partResult.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot create initial partition: " + JSON.stringify(partResult.body))
                initError = JSON.stringify(partResult.body)
                return
            }
            console.log("PARTITION INITIAL " + JSON.stringify(partResult.body))
            initialPartitionVersion = getVersionFromResponse(partResult)
            const result = await client.bulk.store(baseFullChunk)
            // console.log("CHUNK " + JSON.stringify(baseFullChunk, null, 2))
            if (result.status !== HttpSuccessCodes.Ok) {
                console.log("Cannot store initial chunk: " + JSON.stringify(result.body))
                initError = JSON.stringify(result.body)
                return
            }
            baseFullChunkVersion = getVersionFromResponse(result)
            console.log(
                `repoVersionAfterPartitionCreated ${initialPartitionVersion} => ${baseFullChunkVersion}`
            )
            const repositories = await client.dbAdmin.listRepositories()
            console.log("before each (end) repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterEach(async function () {
            const blist = await client.dbAdmin.listRepositories()
            console.log(`Start afterEach list repositories ${JSON.stringify(blist)}`)
            const del = await client.dbAdmin.deleteRepository(repository)
            console.log(`afterEach delete repository ${repository}: ${JSON.stringify(del.body)}`)
            const list = await client.dbAdmin.listRepositories()
            console.log(`End afterEach list repositories ${JSON.stringify(list)}`)
        })

        describe("Repository does not exist", () => {
            it("repository may not be null", async () => {
                client.repository = null
                const retrieve = await client.bulk.retrieve(["ID-2"])
                console.log("Retrieve Result: " + JSON.stringify(JSON.stringify(retrieve.body.messages)))
                expect(retrieve.body.success, "Repository === null failed").toBe(false)
            })
            it("repository name must exist", async () => {
                client.repository = "nothing"
                const retrieve = await client.bulk.retrieve(["ID-2"])
                console.log("Retrieve Result: " + JSON.stringify(JSON.stringify(retrieve.body.messages)))
                expect(retrieve.body.success, "Non existing repository should fail").toBe(false)
            })
        })

        describe("Partition tests", () => {
            it("retrieve nodes", async () => {
                const retrieve = await client.bulk.retrieve(["ID-2"])
                console.log("Retrieve Result: " + JSON.stringify(JSON.stringify(retrieve.body.messages)))
                const retrieveResponse = retrieve.body as RetrieveResponse
                const diff = new LionWebJsonDiff()
                console.log(`${JSON.stringify(baseFullChunk, null, 2)}`)
                console.log(`retrive `)
                console.log(`${JSON.stringify(retrieveResponse, null, 2)}`)
                diff.diffLwChunk(baseFullChunk, retrieveResponse.chunk)
                expect(diff.diffResult.changes).toEqual([])
            })

            it("retrieve partitions", async () => {
                const model = structuredClone(baseFullChunk)
                model.nodes = model.nodes.filter(node => node.parent === null)
                const partitions = await client.bulk.listPartitions()
                console.log("Retrieve partitions Result: " + JSON.stringify(partitions))
                const diff = new LionWebJsonDiff()
                diff.diffLwChunk(model, partitions.body.chunk)
                expect(diff.diffResult.changes).toEqual([])
            })

            it("delete partitions", async () => {
                expect(initError, initError).toBe("")
                await client.bulk.deletePartitions(["ID-2"])
                const partitions = await client.bulk.listPartitions()
                expect(partitions.body.chunk).toEqual({ serializationFormatVersion: "2023.1", languages: [], nodes: [] })
            })

            it("recreate partitions", async () => {
                expect(initError).toBe("")

                const partResult = await client.bulk.createPartitions(initialPartition)
                if (partResult.status !== HttpSuccessCodes.Ok) {
                    console.error("Cannot recreate partition: " + JSON.stringify(partResult.body))
                    initError = JSON.stringify(partResult.body)
                    return
                }
                // Now retrieve the partition again.
                const model = structuredClone(baseFullChunk)
                model.nodes = model.nodes.filter(node => node.parent === null)
                const partitions = await client.bulk.listPartitions()
                console.log("Retrieve partitions Result: " + JSON.stringify(partitions))
                const diff = new LionWebJsonDiff()
                diff.diffLwChunk(model, partitions.body.chunk)
                expect(diff.diffResult.changes).toEqual([])
            })
        })

        describe("Move node (9) to from parent (4) to (5)", () => {
            it("test update full partition", async () => {
                await testResult(DATA + "move-child/Disk-move-child-partition.json", DATA + "move-child/Disk-move-child-partition.json")
                await testHistory()
            })
            it("test update node (5)", async () => {
                await testResult(DATA + "move-child/Disk-move-child-partition.json", DATA + "move-child/Disk-move-child-single-node.json")
                await testHistory()
            })
            it("test update nodes (5) and (4)", async () => {
                await testResult(DATA + "move-child/Disk-move-child-partition.json", DATA + "move-child/Disk-move-child-two-nodes.json")
            })

            it("test update nodes (5) and (9)", async () => {
                await testResult(DATA + "move-child/Disk-move-child-partition.json", DATA + "move-child/Disk-move-child-two-nodes-2.json")
                await testHistory()
            })
        })

        describe("Change value of node (3) property 'name' to 'root-new-value'", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "change-property-value/Disk_Property_value_changed-partition.json",
                    DATA + "change-property-value/Disk_Property_value_changed-partition.json"
                )
                await testHistory()
            })
            it("test update node (3)", async () => {
                await testResult(
                    DATA + "change-property-value/Disk_Property_value_changed-partition.json",
                    DATA + "change-property-value/Disk_Property_value_changed-single-node.json"
                )
                await testHistory()
            })
        })

        describe("Add new property ", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "add-new-property-with-value/Disk-Property-add-property-partition.json",
                    DATA + "add-new-property-with-value/Disk-Property-add-property-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "add-new-property-with-value/Disk-Property-add-property-partition.json",
                    DATA + "add-new-property-with-value/Disk-Property-add-property-single-node.json"
                )
                await testHistory()
            })
        })

        describe("Remove node (4) from parent (3) and mode child (9) to (5)", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "remove-child/Disk-remove-child-partition.json",
                    DATA + "remove-child/Disk-remove-child-partition.json"
                )
                await testHistory()
            })
            it("test update (3)", async () => {
                await testResult(
                    DATA + "remove-child/Disk-remove-child-partition.json",
                    DATA + "remove-child/Disk-remove-child-single-node.json"
                )
                await testHistory()
            })
        })

        describe("Add reference", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "add-reference/Disk_add-reference-partition.json",
                    DATA + "add-reference/Disk_add-reference-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "add-reference/Disk_add-reference-partition.json",
                    DATA + "add-reference/Disk_add-reference-single-node.json"
                )
                await testHistory()
            })
        })
        describe("Remove reference", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "remove-reference/Disk-remove-reference-partition.json",
                    DATA + "remove-reference/Disk-remove-reference-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "remove-reference/Disk-remove-reference-partition.json",
                    DATA + "remove-reference/Disk-remove-reference-single-node.json"
                )
                await testHistory()
            })
        })
        describe("Remove annotation", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "remove-annotation/Disk-remove-annotation-partition.json",
                    DATA + "remove-annotation/Disk-remove-annotation-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "remove-annotation/Disk-remove-annotation-partition.json",
                    DATA + "remove-annotation/Disk-remove-annotation-single-node.json"
                )
                await testHistory()
            })
        })
        describe("Add new annotation", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "add-new-annotation/Disk-add-new-annotation-partition.json",
                    DATA + "add-new-annotation/Disk-add-new-annotation-partition.json"
                )
                await testHistory()
            })
            it("test update two nodes node", async () => {
                await testResult(
                    DATA + "add-new-annotation/Disk-add-new-annotation-partition.json",
                    DATA + "add-new-annotation/Disk-add-new-annotation-two-nodes.json"
                )
                await testHistory()
            })
        })
        describe("Add new node", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "add-new-nodes/Disk-add-new-nodes-partition.json",
                    DATA + "add-new-nodes/Disk-add-new-nodes-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "add-new-nodes/Disk-add-new-nodes-partition.json",
                    DATA + "add-new-nodes/Disk-add-new-nodes-single-node.json"
                )
                await testHistory()
            })
        })
        describe("Reorder children", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "reorder-children/reorder-children-partition.json",
                    DATA + "reorder-children/reorder-children-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "reorder-children/reorder-children-partition.json",
                    DATA + "reorder-children/reorder-children-single-node.json"
                )
                await testHistory()
            })
        })

        describe("Reorder annotations", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "reorder-annotations/reorder-annotations-partition.json",
                    DATA + "reorder-annotations/reorder-annotations-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "reorder-annotations/reorder-annotations-partition.json",
                    DATA + "reorder-annotations/reorder-annotations-single-node.json"
                )
                await testHistory()
            })
        })
        describe("Reorder reference targets", () => {
            it("test update full partition", async () => {
                await testResult(
                    DATA + "reorder-reference-targets/reorder-reference-targets-partition.json",
                    DATA + "reorder-reference-targets/reorder-reference-targets-partition.json"
                )
                await testHistory()
            })
            it("test update single node", async () => {
                await testResult(
                    DATA + "reorder-reference-targets/reorder-reference-targets-partition.json",
                    DATA + "reorder-reference-targets/reorder-reference-targets-single-node.json"
                )
                await testHistory()
            })
        })

        describe("Use reserved ids", () => {
            it("test using ids reserved by same client", async () => {
                const reservedIds = await client.bulk.ids(42)
                console.log("Reserving ids " + JSON.stringify(reservedIds))
            })
            it("test using ids reserved by other client", async () => {
                // Reserve ids by other client
                client.clientId = "OtherClient"
                const reservedIds = await client.bulk.ids(10)
                // Use other client ids with test client
                client.clientId = "TestClient"
                const testIncorrect = await client.bulk.store({
                    languages: [
                        {
                            key: "-default-key-FileSystem",
                            version: "2023.1"
                        },
                        {
                            key: "LionCore-builtins",
                            version: "2023.1"
                        }
                    ],
                    nodes: [
                        {
                            id: "ANN-1",
                            classifier: {
                                language: "-default-key-FileSystem",
                                version: "2023.1",
                                key: "Folder-key"
                            },
                            properties: [],
                            containments: [
                                {
                                    containment: {
                                        language: "-default-key-FileSystem",
                                        version: "2023.1",
                                        key: "Folder-listing-key"
                                    },
                                    children: [reservedIds.body["ids"][0]]
                                }
                            ],
                            references: [],
                            annotations: [],
                            parent: "ID-2"
                        },
                        {
                            id: reservedIds.body["ids"][0],
                            classifier: {
                                language: "-default-key-FileSystem",
                                version: "2023.1",
                                key: "Folder-key"
                            },
                            properties: [],
                            containments: [],
                            references: [],
                            annotations: [],
                            parent: "ANN-1"
                        }
                    ],
                    serializationFormatVersion: "2023.1"
                })
                expect(testIncorrect.status, "Failed reserved id").toEqual(HttpClientErrors.PreconditionFailed)
            })
        })

        describe("Multi-repo test", () => {
            it("Check current repository", async () => {
                expect(initError).toBe("")
                const currentrepo = withoutHistory ? "MyFirstRepo" : "MyFirstHistoryRepo"
                {
                    const repositories = await client.dbAdmin.listRepositories()
                    console.log(`multi repo test repositores ${JSON.stringify(repositories)}`)
                    console.log(`length ${repositories?.body?.repositories?.length}`)
                    expect(repositories.body.repositories.length, "There should be exactly one repository").toBe(1)
                    expect(
                        repositories.body.repositories.some(repo => repo.name === currentrepo),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                    expect(
                        repositories.body.repositories.some(repo => repo.history === !withoutHistory),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                }
                // console.log(`listRepositories 1a: ${repositories.body.repositories.map(r => r.name)}`)
                await client.dbAdmin.createRepository("Repo2", !withoutHistory, "2023.1")                    
                const repositories1 = await client.dbAdmin.listRepositories()

                console.log(`listRepositories 1b: ${repositories1.body.repositories.map(r => r.name)}`)
                {
                    const repositories = await client.dbAdmin.listRepositories()
                    console.log(`listRepositories 1c ${repositories.body.repositories.map(r => r.name)}`)
                    expect(repositories.body.repositories.length, "There should be exactly two repositories").toBe(2)
                    expect(
                        repositories.body.repositories.every(repo => repo.name === currentrepo || repo.name === "Repo2"),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                    expect(
                        repositories.body.repositories.every(repo => repo.name === currentrepo || repo.lionweb_version === "2023.1"),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                    expect(
                        repositories.body.repositories.every(repo => repo.name === currentrepo || repo.history === !withoutHistory),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                }

                const createResult = await client.dbAdmin.createRepository("Repo2", true, "2023.1")
                expect(createResult.body.success, "Should not be able to create existing repo").toBe(false)
                const delete2 = await client.dbAdmin.deleteRepository("Repo2")
                {
                    expect(delete2.body.success, "Should be able to delete existiung repository").toBe(true)
                    const repositories = await client.dbAdmin.listRepositories()
                    console.log(`listRepositories 3: ${repositories.body.repositories.map(r => r.name)}`)
                    expect(repositories.body.repositories.length, "There should be exactly one repository").toBe(1)
                    expect(
                        repositories.body.repositories.some(repo => repo.name === currentrepo),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                }
                const createResult2 = await client.dbAdmin.createRepository("Repo2", !withoutHistory, "2023.1")
                console.log(`createREsult ${JSON.stringify(createResult2)}`)
                {
                    expect(
                        createResult2.body.success,
                        "Should  be able to create new repository: " + JSON.stringify(createResult2.body.messages)
                    ).toBe(true)
                    const repositories = await client.dbAdmin.listRepositories()
                    console.log(`Repositories 22: ${JSON.stringify(repositories)}`)
                    expect(repositories.body.repositories.length, "There should be exactly two repositories").toBe(2)
                    expect(
                        repositories.body.repositories.every(repo => repo.name === currentrepo || repo.name === "Repo2"),
                        "Incorrect repository found: " + JSON.stringify(repositories.body.repositories)
                    ).toBe(true)
                }
            })
        })

        describe("Multiple LionWeb versions test", () => {
            it("Check repository LionWeb versions does not accept other versions", async () => {
                expect(initError).toBe("")
                const incorrectVersion: LionWebJsonChunk = {
                    serializationFormatVersion: "2024.1",
                    nodes: [],
                    languages: []
                }
                const nonsenseVersion: LionWebJsonChunk = {
                    serializationFormatVersion: "nonsense-version",
                    nodes: [],
                    languages: []
                }
                const correctVersion: LionWebJsonChunk = {
                    serializationFormatVersion: "2023.1",
                    nodes: [],
                    languages: []
                }
                const incorrect = await client.bulk.createPartitions(incorrectVersion)
                expect(
                    incorrect.body.success,
                    "incorrect LionWeb version should be refused: " + +incorrect.body.messages.map(m => m.message)
                ).toBe(false)
                const nonsense = await client.bulk.createPartitions(nonsenseVersion)
                expect(
                    nonsense.body.success,
                    "nonsense LionWeb version should be refused: " + nonsense.body.messages.map(m => m.message)
                ).toBe(false)
                const correct = await client.bulk.createPartitions(correctVersion)
                expect(
                    correct.body.success,
                    "correct LionWeb version should be accepted: " + correct.body.messages.map(m => m.message)
                ).toBe(true)
            })
        })

        async function testResult(originalJsonFile: string, changesFile: string) {
            console.log(`Test result of '${originalJsonFile}' with '${changesFile}'`)
            expect(initError).toBe("")
            const changesChunk = readModel(changesFile) as LionWebJsonChunk

            const result = await client.bulk.store(changesChunk)
            console.log(`============ ${JSON.stringify(result)}`)
            expect(result.status).toEqual(HttpSuccessCodes.Ok)

            const jsonModelFull = readModel(originalJsonFile) as LionWebJsonChunk
            const afterRetrieve = await client.bulk.retrieve(["ID-2"])
            console.log("Retrieve Result: " + afterRetrieve.status + " messages " + JSON.stringify(afterRetrieve.body.messages))
            const retrieveResponse = afterRetrieve.body as RetrieveResponse
            if (!retrieveResponse.success) {
                console.log(retrieveResponse.messages)
                expect(afterRetrieve.status).toBe(HttpSuccessCodes.Ok)
            } else {
                const diff2 = new LionWebJsonDiff()
                diff2.diffLwChunk(jsonModelFull, retrieveResponse.chunk)
                expect(diff2.diffResult.changes.filter(ch => !(ch instanceof LanguageChange))).toEqual([])
            }
        }

        async function testHistory(): Promise<void> {
            if (withoutHistory) {
                return
            }
            // test historical data
            const repoAt_1 = await client.history.listPartitions(initialPartitionVersion)
            const diff = new LionWebJsonDiff()
            diff.diffLwChunk(initialPartition, repoAt_1.body.chunk)
            expect(diff.diffResult.changes.filter(ch => !(ch instanceof LanguageChange)), "one").toEqual([])
            
            const repoAt_2 = await client.history.retrieve(baseFullChunkVersion, ["ID-2"])
            const diff2 = new LionWebJsonDiff()
            diff2.diffLwChunk(baseFullChunk, repoAt_2.body.chunk)
            expect(diff2.diffResult.changes.filter(ch => !(ch instanceof LanguageChange)), "two").toEqual([])
        }
    })
})
