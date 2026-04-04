import { RepositoryClient } from "@lionweb/server-http-client"
import { DeltaClient } from "@lionweb/server-delta-client"
import {
    CommandMessageKind,
    DeltaCommand,
    DeltaCommandMessageKinds,
    DeltaErrorCode,
    DeltaRequest,
    DeltaRequestMessageKinds,
    EventMessageKind,
    RequestMessageKind,
    ResponseMessageKind,
} from "@lionweb/server-delta-shared"
import { Commands } from "../commands.js"
import { TestCoverage } from "./helpers.js"
import { Logo2String } from "./Logo2String.js"

export const cmd: Commands = new Commands()

// Define a coverage map, so we can generate test overview table at the end.
export const CoverageMap: Map<CommandMessageKind | RequestMessageKind, TestCoverage> = new Map<CommandMessageKind | RequestMessageKind, TestCoverage>()

for (const kind of DeltaCommandMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}
for (const kind of DeltaRequestMessageKinds) {
    CoverageMap.set(kind, new TestCoverage(kind))
}

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

// NOT NEEDED eslint-disable-next-line @typescript-eslint/no-namespace
declare module "vitest" {
    interface Assertion {
        toHaveError(error: DeltaErrorCode): void
    }
}
export async function expectError(client: DeltaClient, delta: DeltaCommand | DeltaRequest, error: DeltaErrorCode): Promise<void> {
    expect(await cmd.errorFor(client, delta)).toHaveError(error)
    CoverageMap.get(delta.messageKind).receivedErrors.push(error)
}

export async function expectEvent(client: DeltaClient, delta: DeltaCommand, eventKind: EventMessageKind): Promise<void> {
    console.log(`expect for ${delta.messageKind}-${delta.commandId} event ${eventKind}`)
    expect((await cmd.eventFor(client, delta)).messageKind).toEqual(eventKind)
    CoverageMap.get(delta.messageKind).receivedEvents++
}

export async function expectResponse(client: DeltaClient, delta: DeltaRequest, requestKind: ResponseMessageKind): Promise<void> {
    expect((await cmd.responseFor(client, delta)).messageKind).toEqual(requestKind)
    CoverageMap.get(delta.messageKind).receivedEvents++
}

export async function makeSnapShot(bulkApiClient: RepositoryClient): Promise<string> {
    const partition = await bulkApiClient.bulk.retrieve(["Library-01", "Program-01"])
    // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
    const string = new Logo2String(partition.body.chunk.nodes).logo2string()
    console.log(string)
    return string
}

export function logProtocol(client: DeltaClient, log: boolean): void {
    if (log) {
        console.log(`SentMessages ${client.clientId}`)
        console.log(client.sentMessageHistory)
        console.log(`ReceivedMessages ${client.clientId}`)
        console.log(client.receivedMessageHistory)
    }
}
