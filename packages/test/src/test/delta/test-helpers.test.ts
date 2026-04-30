import { LionWebJsonDiff } from "@lionweb/json-diff"
import { collectUsedLanguages } from "@lionweb/server-common"
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
    LionWebId,
    RequestMessageKind,
    ResponseMessageKind,
    SubscribeToPartitionContentsResponse,
} from "@lionweb/server-delta-shared"
import { ast2dot } from "../../Ast2Dot.js"
import { Commands } from "../commands.js"
import { TestCoverage } from "./helpers.js"
import { LionWebModel } from "../models/LionWebModel.js"
import { Logo2String } from "../models/Logo2String.js"

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

export async function makeSnapShot(bulkApiClient: RepositoryClient, rootIds: LionWebId[]): Promise<string> {
    const partition = await bulkApiClient.bulk.retrieve(rootIds)
    // const string = JSON.stringify(partition.body.chunk.nodes, null, 4)
    const string = new Logo2String(partition.body.chunk.nodes).logo2string()
    console.log(string)
    return string
}

export async function logProtocol(client: DeltaClient, checkClient: RepositoryClient, rootIds: LionWebId[], log: boolean, expectedModel?: LionWebModel): Promise<void> {
    if (log) {
        console.log(`SentMessages ${client.clientId}`)
        // console.log(client.sentMessageHistory)
        console.log(`ReceivedMessages ${client.clientId}`)
        // console.log(client.receivedMessageHistory)

        const chunk = await checkClient.bulk.retrieve(rootIds, 100000)
        const string = new Logo2String(chunk.body.chunk.nodes).logo2string()
        console.log("Repo to string")
        console.log(string)

        if (expectedModel !== undefined) {
            console.log("Model to string")
            const string = new Logo2String(expectedModel.nodes()).logo2string()
            console.log(string)
            console.log("=============")
            console.log(expectedModel.asString())
            console.log("Model diff")
            const diff = new LionWebJsonDiff()
            // diff.diffLwChunk(expectedModel.asChunk(), chunk.body.chunk)
            diff.diffLwChunk(chunk.body.chunk, expectedModel.asChunk())
            // console.log(`RETRIEVED CHUNK ${JSON.stringify(chunk.body.chunk, null, 2)}`)
            console.log(`Diff has changes ${diff.diffResult.hasChanges()}`)
            diff.diffResult.changes.forEach((ch) => {
                console.log(`change ${ch.changeMsg()}`)
            })
            console.log(`logoModel ${JSON.stringify(chunk.body.chunk, null, 2)}`)
            expect(diff.diffResult.changes).toStrictEqual([])
            // console.log(`logoModel ${JSON.stringify(logoChunk, null, 2)}`)
        }
    }
}
