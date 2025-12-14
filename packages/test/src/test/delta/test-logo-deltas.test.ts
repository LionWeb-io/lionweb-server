import { isErrorEvent } from "@lionweb/delta-server"
import { RepositoryClient } from "@lionweb/server-client"
import { DeltaClient } from "@lionweb/server-delta-client"
import { DeltaEvent } from "@lionweb/server-delta-shared"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import {
    addReference,
    deleteChild,
    newAddChild,
    newAddPartitionCommand,
    newAddPropertyCommand,
    newChangePropertyCommand,
    newDeletePropertyCommand,
    newSignOnRequest,
    newSubscribeToPartitionRequest,
} from "../commands.js"

import { test, assert, describe, beforeAll, beforeEach } from "vitest"
import { CLASSIFIER, CONTAINMENT, PROPERTY, REFERENCE } from "./keys.js"
// const { deepEqual, equal } = assert
// import sm from "source-map-support"
// sm.install()
// const DATA: string = "./data/"

const collection = [true]
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const bulkApiClient = new RepositoryClient("BulkClient-01")

// Run all, tests with and without history
collection.forEach(withoutHistory => {
    const repository = withoutHistory ? "LogoRepo" : "LogoHistoryRepo"
    describe("Repository tests " + (withoutHistory ? "without history" : "with history"), async () => {
        // client.loggingOn = true
        // let initialPartition: LionWebJsonChunk
        let initError: string = ""
        let deltaApiClient01 = new DeltaClient("DeltaClient-01", repository)

        
        beforeAll(async function () {
            // const initResponse = await bulkApiClient.dbAdmin.createDatabase()
            // if (initResponse.status !== HttpSuccessCodes.Ok) {
            //     console.log("Cannot create database: " + JSON.stringify(initResponse.body))
            // } else {
            //     console.log("Database created: " + JSON.stringify(initResponse.body))
            // }
            bulkApiClient.repository = repository
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

            deltaApiClient01 = new DeltaClient("DeltaClient-01", repository)
            // deltaApiClient01.eventFunction = makeSnapShot
            // deltaApiClient01.loggingOn = false

            await deltaApiClient01.connect()
            // wait until connection is probably established ...... 
            await delay(2000)
            await deltaApiClient01.sendRequest(newSignOnRequest(deltaApiClient01.repository, deltaApiClient01.clientId))
            await delay(200)

        })

        beforeEach(async function () {
            // deltaApiClient01.eventFunction = makeSnapShot
            // deltaApiClient01.loggingOn = false


            // await deltaApiClient01.connect()
            // // wait until connection is probably established ...... 
            // await delay(200)
            // await deltaApiClient01.sendRequest(newSignOnRequest(deltaApiClient01.repository, deltaApiClient01.clientId))
            // await delay(200)
            // const repositories = await bulkApiClient.dbAdmin.listRepositories()
            // console.log("repositories: " + JSON.stringify(repositories.body.repositories))
        })

        afterAll( async function () {
            // deltaApiClient01.sendRequest(newUnSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "ID-Program-01",))
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
                const addChildCommand = newAddChild({
                    id: "ID-Move-01", cls: CLASSIFIER.HomeCommand, parent: "ID-Program-01", containment: CONTAINMENT.ProgramCommands, props: []
                })
                deltaApiClient01.sendCommand(addChildCommand)

                // wait until done ... hopefully this is enough
                await delay(200)
                assert( deltaApiClient01.receivedEvents.get(addChildCommand.commandId).messageKind === "ChildAdded")

                const deleteChildCommandError1 = deltaApiClient01.sendCommand(deleteChild({ id: "ID-Move-01", index: 0, parent: "ID-Program-01", containment: CONTAINMENT.IfCondition}))
                const deleteChildCommandError2 = deltaApiClient01.sendCommand(deleteChild({ id: "ID-Move-01", index: 0, parent: "ID-Program-01-A", containment: CONTAINMENT.ProgramCommands}))
                const deleteChildCommandError3 = deltaApiClient01.sendCommand(deleteChild({ id: "ID-Move-01", index: 1, parent: "ID-Program-01", containment: CONTAINMENT.ProgramCommands}))
                const deleteChildCommandOk = deltaApiClient01.sendCommand(deleteChild({ id: "ID-Move-01", index: 0, parent: "ID-Program-01", containment: CONTAINMENT.ProgramCommands}))

                // wait until done ... hopefully this is enough
                await delay(200)
                console.log("SentMessages")
                console.log(deltaApiClient01.sentMessageHistory)
                console.log("ReceivedMessages")
                console.log(deltaApiClient01.receivedMessageHistory)

                assert( deltaApiClient01.receivedEvents.get(deleteChildCommandOk.commandId).messageKind === "ChildDeleted")
                assert( hasError(deltaApiClient01.receivedEvents.get(deleteChildCommandError1.commandId),"unknownContainment") )
                assert( hasError(deltaApiClient01.receivedEvents.get(deleteChildCommandError2.commandId), "err-unknownNode") )
                assert( hasError(deltaApiClient01.receivedEvents.get(deleteChildCommandError3.commandId), "unknownIndex") )
            })
        })
        test("AddPartition Second", async () => {
            const addPartitionCommand = deltaApiClient01.sendCommand(newAddPartitionCommand("ID-Library-01","-key-Library"))
            deltaApiClient01.sendRequest(newSubscribeToPartitionRequest(deltaApiClient01.repository, deltaApiClient01.clientId, "ID-Library-01",))
            const addPropertyCmd = deltaApiClient01.sendCommand(newAddPropertyCommand(   "ID-Program-01", "draw rectangle", "LionCore-builtins-INamed-name"))
            const addChildCommand = newAddChild({
                id: "ID-Procedure-01", cls: CLASSIFIER.Procedure, parent:"ID-Library-01", containment: CONTAINMENT.LibraryProcedures, props: []
            })
            deltaApiClient01.sendCommand(addChildCommand)
            const addChildCommand1 = newAddChild(
                { id: "ID-Move-02", cls: CLASSIFIER.MoveCommand, parent: "ID-Procedure-01", containment: CONTAINMENT.ProcedureBody, props: []})
            deltaApiClient01.sendCommand(addChildCommand1)
            // const addChildCommand2 = newAddChildCommand("ID-Move-03","ID-Procedure-01", "-key-Procedure-body")
            // snapshots.push(addChildCommand2.commandId)
            // deltaApiClient01.sendCommand(addChildCommand2)
            await makeSnapShot()
            // await delay(4000)
            const deleteChildCommand2 = deleteChild({ id: "ID-Procedure-01", index: 0, parent: "ID-Library-01",containment: CONTAINMENT.LibraryProcedures})
            deltaApiClient01.sendCommand(deleteChildCommand2)
            
            await delay(2000)
            assert( deltaApiClient01.receivedEvents.get(addPartitionCommand.commandId).messageKind === "PartitionAdded")
            assert( deltaApiClient01.receivedEvents.get(addChildCommand.commandId).messageKind === "ChildAdded")
        })
        test("References", async () => {
            deltaApiClient01.loggingOn = true
            const addChildCommand = newAddChild({
                id: "ID-Call-01", cls: CLASSIFIER.ProcedureCall, parent: "ID-Program-01", containment: CONTAINMENT.ProgramCommands, props: []
            })
            deltaApiClient01.sendCommand(addChildCommand)
            const refCmd = addReference({
                id: "ID-Call-01", index: 0, target: "ID-Procedure-01", resolveInfo: "ID-PROC-01", reference: REFERENCE.ProcedureCallProcedure
            })
            deltaApiClient01.sendCommand(refCmd)

            // wait until done ... hopefully this is enough
            await delay(2000)
            assert( deltaApiClient01.receivedEvents.get(addChildCommand.commandId).messageKind === "ChildAdded")

            // wait until done ... hopefully this is enough
            await delay(200)
            console.log("SentMessages")
            console.log(deltaApiClient01.sentMessageHistory)
            console.log("ReceivedMessages")
            console.log(deltaApiClient01.receivedMessageHistory)

        })

    })
})

function hasError(event: DeltaEvent, errorCode: string): boolean {
    return isErrorEvent(event) && event.errorCode === errorCode
}

async function makeSnapShot(): Promise<void>{
        const partition = await bulkApiClient.bulk.retrieve(["ID-Library-01", "ID-Program-01"])
        const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
        console.log(string)
}
