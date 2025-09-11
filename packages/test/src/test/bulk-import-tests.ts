import { BulkImport, HttpSuccessCodes } from "@lionweb/server-shared"
import { RepositoryClient, TransferFormat } from "@lionweb/server-client"
import { assert } from "chai"
const { deepEqual } = assert

console.log("bulk-import-tests")

describe("Repository tests for bulkImport API", () => {
    const repository: string = "MyBulkImportRepo"
    const client = new RepositoryClient("TestClient", repository)
    const withHistory = false
    let initError: string = ""
    const lwVersion = "2023.1"

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
        const repos = await client.dbAdmin.listRepositories()
        deepEqual(repos.body.success, true)
        if (repos.body.repositories.find(r => r.name == repository) != null) {
            console.log("Deleting repository " + repository)
            await client.dbAdmin.deleteRepository(repository)
        } else {
            console.log("Repository " + repository + " does not exist")
        }
        const initResponse = await client.dbAdmin.createRepository(repository, withHistory, lwVersion)
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

    it("we can do an empty bulk import using JSON without compression", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
    })

    it("we can do a proper bulk import using JSON without compression", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node1",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [
                        {
                            property: {
                                language: "my-language",
                                version: "v1",
                                key: "prop-key1"
                            },
                            value: "qwerty"
                        }
                    ],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null,
                }
            ],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node1"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
            id: "node1",
            classifier: {
            language: "my-language",
                version: "v1",
                key: "concept-key1"
        },
        properties: [
            {
                property: {
                    language: "my-language",
                    version: "v1",
                    key: "prop-key1"
                },
                value: "qwerty"
            }
        ],
            containments: [],
            references: [],
            annotations: [],
            parent: null,
    }])
        });

    it("we can do a proper bulk import using JSON with compression", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node2",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [
                        {
                            property: {
                                language: "my-language",
                                version: "v1",
                                key: "prop-key1"
                            },
                            value: "qwerty"
                        }
                    ],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null,
                }
            ],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node2"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
                id: "node2",
                classifier: {
                    language: "my-language",
                    version: "v1",
                    key: "concept-key1"
                },
                properties: [
                    {
                        property: {
                            language: "my-language",
                            version: "v1",
                            key: "prop-key1"
                        },
                        value: "qwerty"
                    }
                ],
                containments: [],
                references: [],
                annotations: [],
                parent: null,
            }])
    });

    it("we can do a proper bulk import using Protobuf without compression", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node3",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [
                        {
                            property: {
                                language: "my-language",
                                version: "v1",
                                key: "prop-key1"
                            },
                            value: "qwerty"
                        }
                    ],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null,
                }
            ],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node3"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
                id: "node3",
                classifier: {
                    language: "my-language",
                    version: "v1",
                    key: "concept-key1"
                },
                properties: [
                    {
                        property: {
                            language: "my-language",
                            version: "v1",
                            key: "prop-key1"
                        },
                        value: "qwerty"
                    }
                ],
                containments: [],
                references: [],
                annotations: [],
                parent: null,
            }])
    });
});