import {
    ContinuedCommand,
    DeltaCommand,
    isAddPartitionCommand,
    isNewAnnotationCommand,
    isNewChildCommand,
    SplitCommandType
} from "@lionweb/server-delta-shared"
import { newErrorDelta } from "../events.js"
import { Participation } from "../participation/index.js"

export type SplitCommand = {
    delta: SplitCommandType
    lastSequenceNumber: number
}
export class SplitCommands {
    /**
     * Map from Participation Id to the current unfinished split command (if any)
     */
    unfinishedSplitCommands: Map<string, SplitCommand> = new Map<string, SplitCommand>()

    addSplitCommand(participation: Participation, cmd: SplitCommandType): void {
        console.log(`SPLIT add command ${cmd.messageKind}`)
        this.unfinishedSplitCommands.set(participation.participationId, { delta: cmd, lastSequenceNumber: -1} )
    }

    addContinuedCommand(participation: Participation, continuedCommand: ContinuedCommand): void {
        console.log(`SPLIT add contunuation ${continuedCommand.messageKind} seq ${continuedCommand.continuedChunkSequenceNumber}`)
        const unfinishedSplitCommand = this.unfinishedSplitCommands.get(participation.participationId)
        if (unfinishedSplitCommand === undefined) {
            throw newErrorDelta("noActiveSplitCommand", "Incorrect continued command, there is no split command active", continuedCommand, participation)
        }
        if (continuedCommand.continuedChunkSequenceNumber !== unfinishedSplitCommand.lastSequenceNumber + 1) {
            throw newErrorDelta(
                "incorrectSequenceNumber", 
                `Sequence number of ContinuedCommand incorrect, should be ${unfinishedSplitCommand.lastSequenceNumber + 1}, is ${continuedCommand.continuedChunkSequenceNumber}`,
                continuedCommand,
                participation
                )
        }
        unfinishedSplitCommand.lastSequenceNumber++
        if (isAddPartitionCommand(unfinishedSplitCommand.delta)) {
            unfinishedSplitCommand.delta.newPartition.nodes.push(...continuedCommand.chunk.nodes)
        } else if (isNewChildCommand(unfinishedSplitCommand.delta)) {
            unfinishedSplitCommand.delta.newChild.nodes.push(...continuedCommand.chunk.nodes)
        } else if (isNewAnnotationCommand(unfinishedSplitCommand.delta)) {
            unfinishedSplitCommand.delta.newAnnotation.nodes.push(...continuedCommand.chunk.nodes)
        } else {
            throw newErrorDelta("generic", "Internal error, unknown split command type", continuedCommand, participation)
        }
    }

    /**
     * Returns the current split command for `participation` and removes it from the map.
     * Throws an exception if there is no split command for `participation`
     * @param participation
     */
    getSplitCommand(participation: Participation): SplitCommandType {
        const result = this.unfinishedSplitCommands.get(participation.participationId)
        if (result === undefined) {
            // @ts-ignore
            throw newErrorDelta("generic", "Missing split command", null, participation)
        } else {
            this.unfinishedSplitCommands.delete(participation.participationId)
            return result.delta;
        }
    }
}
