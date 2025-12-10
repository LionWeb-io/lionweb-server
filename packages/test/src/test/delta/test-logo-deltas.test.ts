import { RepositoryClient } from "@lionweb/server-client"
import { DeltaClient } from "@lionweb/server-delta-client"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import {
    newAddChildCommand,
    newAddPartitionCommand,
    newAddPropertyCommand,
    newChangePropertyCommand,
    newDeleteChildCommand,
    newDeletePropertyCommand,
    newSignOnRequest,
    newSubscribeToPartitionRequest,
    newUnSubscribeToPartitionRequest
} from "../commands.js"

import { test, assert, describe, beforeAll, beforeEach } from "vitest"
// const { deepEqual, equal } = assert
// import sm from "source-map-support"

// sm.install()
// const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        const bulkApiClient = new RepositoryClient("BulkClient-01", repository)
        let deltaApiClient01 = new DeltaClient("DeltaClient-01", repository)
        // client.loggingOn = true
        // let initialPartition: LionWebJsonChunk
        let initError: string = ""

        beforeAll(async function () {
            // const initResponse = await bulkApiClient.dbAdmin.createDatabase()
            // if (initResponse.status !== HttpSuccessCodes.Ok) {
            //     console.log("Cannot create database: " + JSON.stringify(initResponse.body))
            // } else {
            //     console.log("Database created: " + JSON.stringify(initResponse.body))
            // }
        })

        beforeEach(async function () {
            bulkApiClient.repository = repository
            deltaApiClient01 = new DeltaClient("DeltaClient-01", repository)

            const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
            if (initResponse.status !== HttpSuccessCodes.Ok) {
                console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
                initError = JSON.stringify(initResponse.body)
                // return
            } else {
                console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
            }
            const repositories = await bulkApiClient.dbAdmin.listRepositories()
            console.log("repositories: " + JSON.stringify(repositories.body.repositories))

            await deltaApiClient01.connect()
            // wait until connection is probably established ...... 
            await delay(200)
            await deltaApiClient01.sendRequest(newSignOnRequest(deltaApiClient01.repository, deltaApiClient01.clientId))
            await delay(200)
            // const repositories = await bulkApiClient.dbAdmin.listRepositories()
            // console.log("repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterAll( async function () {
            deltaApiClient01.sendRequest(newUnSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "ID-Program-01",))
            await bulkApiClient.dbAdmin.deleteRepository(repository)
        })

        describe("Partition tests", () => {
            test("AddPartition", async () => {
                // assert(initError === "", initError)
                const addPartitionCommand = deltaApiClient01.sendCommand(newAddPartitionCommand("ID-Program-01","-key-Program"))
                await delay(200)
                assert( deltaApiClient01.receivedEvents.get(addPartitionCommand.commandId).messageKind === "PartitionAdded")

            })
            test("Properties", async () => {
                deltaApiClient01.sendRequest(newSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "ID-Program-01",))
                const deletePropertyCmd = deltaApiClient01.sendCommand(newDeletePropertyCommand("ID-Program-01", "-key-Partition-name"))
                const addPropertyCmd = deltaApiClient01.sendCommand(newAddPropertyCommand(   "ID-Program-01", "draw rectangle", "LionCore-builtins-INamed-name"))
                const changePropertyCmd = deltaApiClient01.sendCommand(newChangePropertyCommand("ID-Program-01", "draw a rectangle", "LionCore-builtins-INamed-name"))
                const deletePropertyCmd2 = deltaApiClient01.sendCommand(newDeletePropertyCommand("ID-Program-01", "LionCore-builtins-INamed-name"))

                // wait until done .. hopefully this is enough
                await delay(200)
                console.log("SentMessages")
                console.log(deltaApiClient01.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(deltaApiClient01.receivedMessageHistory)

                assert( deltaApiClient01.receivedEvents.get(deletePropertyCmd.commandId).messageKind === "ErrorEvent")
                assert( deltaApiClient01.receivedEvents.get(addPropertyCmd.commandId).messageKind === "PropertyAdded")
                assert( deltaApiClient01.receivedEvents.get(changePropertyCmd.commandId).messageKind === "PropertyChanged")
                assert( deltaApiClient01.receivedEvents.get(deletePropertyCmd2.commandId).messageKind === "PropertyDeleted")
            })
            test("Children", async () => {
                deltaApiClient01.sendRequest(newSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "ID-Program-01",))
                const addChildCommand = deltaApiClient01.sendCommand(newAddChildCommand("ID-Move-01","ID-Program-01", "-key-LogoProgram-commands"))

                // wait until done ... hopefully this is enough
                await delay(200)
                assert( deltaApiClient01.receivedEvents.get(addChildCommand.commandId).messageKind === "ChildAdded")

                const deleteChildCommandError1 = deltaApiClient01.sendCommand(newDeleteChildCommand("ID-Move-01", 0,"ID-Program-01", "-key-LogoProgram-cmds"))
                const deleteChildCommandError2 = deltaApiClient01.sendCommand(newDeleteChildCommand("ID-Move-01", 0,"ID-Program-01-A", "-key-LogoProgram-commands"))
                const deleteChildCommandError3 = deltaApiClient01.sendCommand(newDeleteChildCommand("ID-Move-01", 1,"ID-Program-01", "-key-LogoProgram-commands"))
                const deleteChildCommandOk = deltaApiClient01.sendCommand(newDeleteChildCommand("ID-Move-01", 0,"ID-Program-01", "-key-LogoProgram-commands"))

                // wait until done ... hopefully this is enough
                await delay(200)
                console.log("SentMessages")
                console.log(deltaApiClient01.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(deltaApiClient01.receivedMessageHistory)

                assert( deltaApiClient01.receivedEvents.get(deleteChildCommandOk.commandId).messageKind === "ChildDeleted")
                assert( deltaApiClient01.receivedEvents.get(deleteChildCommandError1.commandId).messageKind === "ErrorEvent")
                assert( deltaApiClient01.receivedEvents.get(deleteChildCommandError2.commandId).messageKind === "ErrorEvent")
                assert( deltaApiClient01.receivedEvents.get(deleteChildCommandError3.commandId).messageKind === "ErrorEvent")
            })
        })
    })
})
