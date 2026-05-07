import { adminResponseFunctions, DeltaClient, eventFunctions, responseFunctions } from "@lionweb/server-delta-client"
import { RepositoryClient } from "@lionweb/server-http-client"
import { HttpSuccessCodes } from "@lionweb/server-shared"
import { afterAll } from "vitest"
import { LionWebModel } from "../models/LionWebModel.js"
import { reportHTML } from "./helpers.js"
import { cmd, CoverageMap, expectResponse } from "./test-helpers.js"

/**
 * Shared "global" variables and initialiozation/teardown for all tests.
 */
// export const withoutHistoryList = [{ withoutHistory: true }, { withoutHistory: false }]
export const withoutHistoryList = [{ withoutHistory: true }]
export const log: boolean = true

export const config = {
    // hostname: "192.168.100.1",
    hostname: "127.0.0.1",
    port: 3005,
    timeout: 2000,
}

// Run all, tests with and without history
export const client = new DeltaClient("test-logo", config, [eventFunctions, responseFunctions, adminResponseFunctions])
client.loggingOn = true
export const checkClient = new DeltaClient("check-logo", config, [eventFunctions, responseFunctions, adminResponseFunctions])

export let repository = "dummy"
export let bulkApiClient = new RepositoryClient({ clientId: "BulkClient-01", repository: repository })
export let logoModel = new LionWebModel([])

export const beforeAllTests = async (withoutHistory: boolean, name: string = ""): Promise<void> => {
console.log(`beforeAllTests ${name}`)
    repository = (withoutHistory ? "LogoRepo" : "LogoHistoryRepo") + name
    bulkApiClient = new RepositoryClient({clientId: "BulkClient-01", repository: repository})
    logoModel = new LionWebModel([])

    client.repository = repository
    client.clientId = "DeltaClient-01"
    bulkApiClient.repository = repository

    const delResponse = await bulkApiClient.dbAdmin.deleteRepository(repository, "delete at start og test")
    if (delResponse.status !== HttpSuccessCodes.Ok) {
        console.log(`Could not delete repository (${repository}): ` + JSON.stringify(delResponse.body))
    } else {
        console.log(`Deleted repository (${repository}): ` + JSON.stringify(delResponse.body))
    }
    const initResponse = await bulkApiClient.dbAdmin.createRepository(repository, !withoutHistory, "2023.1")
    if (initResponse.status !== HttpSuccessCodes.Ok) {
        console.log(`Cannot create repository (${repository}): ` + JSON.stringify(initResponse.body))
    } else {
        console.log(`Created repository (${repository}): ` + JSON.stringify(initResponse.body))
    }
    await client.connect()
    const listReposRequest = cmd.listRepositories(client)
    const addRepo = cmd.addRepository(client, repository)

    expect((await cmd.responseFor(client, addRepo)).messageKind).toEqual("CreateRepositoryAdminResponse")

    const signOn = cmd.signOnRequest(client, client.repository)
    expect((await cmd.responseFor(client, listReposRequest)).messageKind).toEqual("ListRepositoriesAdminResponse")
    await expectResponse(client, signOn, "SignOnResponse")
    expect(await cmd.responseFor(client, signOn)).toMatchObject({
        messageKind: "SignOnResponse",
        queryId: signOn.queryId,
        additionalInfos: [
            {
                data: {},
                kind: "Info",
                message: "SignOnRequest received ok",
            },
        ],
    })
}

export const afterAllTests = (): void => {
    console.log("CLOSING")
    client.socket.close()
    console.log("CLOSED")
    reportHTML(CoverageMap)
}
