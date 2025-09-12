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
                    id: "node4",
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
        const retrievedNodes = (await client.bulk.retrieve(["node4"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
                id: "node4",
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

    it("we can do a proper bulk import with references", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node5",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [
                        {
                            reference: {
                                language: "my-language",
                                version: "v1",
                                key: "ref-key1"
                            },
                            targets: [
                                {
                                    reference: "a",
                                    resolveInfo: "b"
                                },
                                {
                                    reference: "a2",
                                    resolveInfo: "b2"
                                }
                            ]
                        }
                    ],
                    annotations: [],
                    parent: null,
                }
            ],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node5"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
                id: "node5",
                classifier: {
                    language: "my-language",
                    version: "v1",
                    key: "concept-key1"
                },
                properties: [],
                containments: [],
                references: [
                    {
                        reference: {
                            language: "my-language",
                            version: "v1",
                            key: "ref-key1"
                        },
                        targets: [
                            {
                                reference: "a",
                                resolveInfo: "b"
                            },
                            {
                                reference: "a2",
                                resolveInfo: "b2"
                            }
                        ]
                    }
                ],
                annotations: [],
                parent: null,
            }])
    });
    it("we can do a proper bulk import with annotations", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node6",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: ["ann1", "ann2"],
                    parent: null
                },
                {
                    id: "ann1",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "annotation-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: "node6"
                },
                {
                    id: "ann2",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "annotation-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: "node6"
                },
            ],
            attachPoints: []
        };

        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node6"])).body.chunk.nodes
        deepEqual(retrievedNodes.length, 3)
        const retrievedNode3 = retrievedNodes.find(n => n.id == "node6")
        deepEqual(retrievedNode3,
            {
                id: "node6",
                classifier: {
                    language: "my-language",
                    version: "v1",
                    key: "concept-key1"
                },
                properties: [],
                containments: [],
                references: [],
                annotations: ["ann1", "ann2"],
                parent: null,
            })
    });
    it("bulk import with annotations with parent not set fails", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node10",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "concept-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: ["ann1", "ann2"],
                    parent: null
                },
                {
                    id: "ann1",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "annotation-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null
                },
                {
                    id: "ann2",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "annotation-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null
                },
            ],
            attachPoints: []
        };

        const result = await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        deepEqual(result.body.success, false)
    });
    it("we can do a proper bulk import with attach points", async () => {
        assert(initError === "", initError)

        const bulkImport:BulkImport = {
            nodes: [
                {
                    id: "node7",
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
            attachPoints: [
                {
                    container: "root1",
                    containment: {
                        language: "my-language",
                        version: "v1",
                        key: "root-key1"
                    },
                    root: "node7"
                }
            ]
        };

        await client.bulk.createPartitions({
            serializationFormatVersion: lwVersion,
            languages: [],
            nodes: [
                {
                    id: "root1",
                    classifier: {
                        language: "my-language",
                        version: "v1",
                        key: "root-key1"
                    },
                    properties: [],
                    containments: [],
                    references: [],
                    annotations: [],
                    parent: null,
                }
            ]
        })
        await client.additional.bulkImport(bulkImport, TransferFormat.JSON, false)
        const retrievedNodes = (await client.bulk.retrieve(["node7"])).body.chunk.nodes
        deepEqual(retrievedNodes, [
            {
                id: "node7",
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
                parent: "root1",
            }])
    });
});