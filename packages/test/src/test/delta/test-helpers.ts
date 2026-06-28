import { LionWebJsonDiff } from "@lionweb/json-diff"
import { RepositoryClient } from "@lionweb/server-http-client"
import { DeltaClient } from "@lionweb/server-delta-client"
import {
    CommandMessageKind,
    DeltaCommand,
    ErrorEvent,
    DeltaCommandMessageKinds,
    DeltaErrorCode,
    DeltaRequest,
    DeltaRequestMessageKinds,
    EventMessageKind,
    LionWebId,
    RequestMessageKind,
    ResponseMessageKind,
    ErrorResponse, isSplitCommand,
} from "@lionweb/server-delta-shared"
import { ast2dot } from "../../Ast2Dot.js"
import { Commands } from "../commands.js"
import { TestCoverage } from "./helpers.js"
import { LionWebModel } from "../models/LionWebModel.js"
import { Logo2String } from "../models/Logo2String.js"
import { expect } from "vitest"

export const cmd: Commands = new Commands()

// Define a coverage map, so we can generate test overview table at the end.
export const CoverageMap: Map<CommandMessageKind | RequestMessageKind, TestCoverage> = new Map<CommandMessageKind | RequestMessageKind, TestCoverage>()

for (const kind of DeltaCommandMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}
for (const kind of DeltaRequestMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}

/**
 * Add `toHaveError` function to vitest so we can write `expect(...).toHaveError`.
 */
expect.extend({
    toHaveError(received, expected) {
        // define Todo object structure with objectContaining
        // const expectDeltaErrorCode = (errorCode?: DeltaErrorCode) =>
        //     expect.toBeOneOf<string>(DeltaErrorCodes)
        // equality check for received todo and expected todo
        const pass = this.equals(received, expected)

        if (pass) {
            return {
                message: () => `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`,
                pass: true,
            }
        }
        return {
            message: () => `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}\n\n${this.utils.diff(expected, received)}`,
            pass: false,
        }
    },
})

/**
 * Add `toHaveError` function to vitest so we can write `expect(...).toHaveError`. 
 */
// NOT NEEDED eslint-disable-next-line @typescript-eslint/no-namespace
declare module "vitest" {
    interface Assertion {
        toHaveError(error: DeltaErrorCode): void
    }
}

/**
 * Expect to get error with error code `error` for `delta` command or request. 
 * @param client    The client to expect the error.
 * @param delta     The delta to result in the error.
 * @param error     The error code to be expected.
 */
export async function expectError(client: DeltaClient, delta: DeltaCommand | DeltaRequest, error: DeltaErrorCode): Promise<void> {
    expect(await cmd.errorFor(client, delta)).toHaveError(error)
    CoverageMap.get(delta.messageKind).receivedErrors.push(error)
}

/**
 * Expect event of kind `eventKind` as a response to command `delta`.
 * @param client        The client to expect the event.
 * @param delta         The command that result in the event.
 * @param eventKind     The kind of event expected.
 */
export async function expectEvent(client: DeltaClient, delta: DeltaCommand, eventKind: EventMessageKind): Promise<void> {
    console.log(`expect for ${delta.messageKind}-${delta.commandId} event ${eventKind}`)
    const event = await  cmd.eventFor(client, delta)
    expect(event.messageKind, `ErrorEvent: ${(event as ErrorEvent)?.message}`).toEqual(eventKind)
    CoverageMap.get(delta.messageKind).receivedEvents++
    if (isSplitCommand(delta) && delta.split === true) {
        CoverageMap.get("ContinuedCommand").receivedEvents++
    }
}

/**
 * Expect event of kind `responseKind` as a response to request `delta`.
 * @param client        The client to expect the response.
 * @param delta         The request that results in the response.
 * @param responseKind  The kind of response expected.
 */
export async function expectResponse(client: DeltaClient, delta: DeltaRequest, responseKind: ResponseMessageKind): Promise<void> {
    const response = await cmd.responseFor(client, delta)
    expect(response.messageKind, `ErrorResponse: ${(response as ErrorResponse)?.message}`).toEqual(responseKind)
    CoverageMap.get(delta.messageKind).receivedEvents++
}

export async function makeSnapShot(bulkApiClient: RepositoryClient, rootIds: LionWebId[]): Promise<string> {
    const partition = await bulkApiClient.bulk.retrieve(rootIds)
    // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
    const string = new Logo2String(partition.body.chunk.nodes).logo2string()
    console.log(string)
    return string
}

/**
 * Expect the repository contents to be equal to the `expectedModel` and log the result.
 * @param client        The client for which to log all delta messages.
 * @param checkClient   The *bulk* client used to get the model from the respository.
 * @param rootIds       The ids of the partitions to get from the client.
 * @param log           When `true`, print log, otherwise be silent.
 * @param expectedModel The model that is expected to be in the respository.
 */
export async function logProtocol(client: DeltaClient, checkClient: RepositoryClient, rootIds: LionWebId[], log: boolean, expectedModel?: LionWebModel): Promise<void> {
    if (log) {
        console.log(`SentMessages ${client.clientId}`)
        // console.log(client.sentMessageHistory)
        console.log(`ReceivedMessages ${client.clientId}`)
        // console.log(client.receivedMessageHistory)
    }
    const chunk = await checkClient.bulk.retrieve(rootIds, 100000)
    if (log) {
        const string = new Logo2String(chunk.body.chunk.nodes).logo2string()
        // console.log("ACTUAL Repo to string")
        console.log(string)
    }

    if (expectedModel !== undefined) {
        const diff = new LionWebJsonDiff()
        diff.diffLwChunk(chunk.body.chunk, expectedModel.asChunk())
        if (log) {
            console.log("EXPECTED Model to string")
            const string = new Logo2String(expectedModel.nodes()).logo2string()
            console.log(string)
            console.log("============= EXPECTED ")
            console.log(expectedModel.asString())
            console.log("Model diff")
        }
        console.log(`Diff has changes ${diff.diffResult.hasChanges()}`)
        diff.diffResult.changes.forEach((ch) => {
            console.log(`change ${ch.changeMsg()}`)
        })
        if (log) {
            console.log(`ACTUAL logoModel ${JSON.stringify(chunk.body.chunk, null, 2)}`)
        }
        expect(diff.diffResult.changes).toStrictEqual([])
    }
}
