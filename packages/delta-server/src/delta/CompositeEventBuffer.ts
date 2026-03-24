import { deltaLogger } from "@lionweb/server-common"
import { CompositeCommand, DeltaCommand, DeltaEvent } from "@lionweb/server-delta-shared"
import { Participation } from "./participation/index.js"

export class CompositeEventBufferStack {
    eventBuffers: CompositeEventBuffer[] = []

    shouldBuffer(): boolean {
        deltaLogger.info(`shoulod buffer ${this.eventBuffers.length > 0}`)
        return this.eventBuffers.length > 0
    }

    startComposite(participation: Participation, composite: CompositeCommand): void {
        deltaLogger.info(`start composite`)
        this.eventBuffers.push(new CompositeEventBuffer(participation, composite))
    }
    endComposite(): void {
        deltaLogger.info(`end composite`)
        this.eventBuffers.pop()
    }

    buffer(participation: Participation, originalMessage: DeltaCommand, responseOrEvent: DeltaEvent): void {
        deltaLogger.info(`buffer ${responseOrEvent.messageKind}`)
        this.activeBuffer().events.push({
            participation: participation,
            originalMessage: originalMessage,
            responseOrEvent: responseOrEvent
        })
    }

    activeBuffer(): CompositeEventBuffer {
        return this.eventBuffers[this.eventBuffers.length - 1]
    }
}

export class CompositeEventBuffer {
    compositeParticipation: Participation
    composite: CompositeCommand
    events: {
        participation: Participation
        originalMessage: DeltaCommand
        responseOrEvent: DeltaEvent
    }[] = []

    constructor(participation: Participation, composite: CompositeCommand) {
        this.compositeParticipation = participation
        this.composite = composite
    }

    addEvent(participation: Participation, originalMessage: DeltaCommand, responseOrEvent: DeltaEvent) {
        this.events.push({
            participation: participation,
            originalMessage: originalMessage,
            responseOrEvent: responseOrEvent
        })
    }
}
