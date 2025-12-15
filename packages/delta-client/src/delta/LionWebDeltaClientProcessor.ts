import WebSocket from "ws"
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import { DeltaEvent } from "@lionweb/server-delta-shared"
import { ValidationResult } from "@lionweb/validation"
import { ReceivingDelta, ReceivingFunction } from "./ProcessingTypes.js"

export class LionWebDeltaClientProcessor {
    processingFunctions: Map<string, ReceivingFunction> = new Map<string, ReceivingFunction>()
    deltaValidator = new DeltaValidator(new ValidationResult())

    constructor(pfs: ReceivingDelta[][]) {
        this.initialize(pfs)
    }

    initialize(pfs: ReceivingDelta[][]) {
        pfs.forEach(pf => {
            pf.forEach( f => {
                this.processingFunctions.set(f.messageKind, f.processor)
            })
        })
    }

    processDelta(socket: WebSocket, delta: DeltaEvent): void {
        const type = delta.messageKind
        if (typeof type !== "string") {
            console.error(`1 : messageKind is not a string but a '${typeof type}'`)
            return
        }
        const func = this.processingFunctions.get(type)
        if (func === undefined) {
            console.error(`LionWebDeltaClientProcessor.processDelta(): processing function not found for '${type}'`)
            return
        }
        // Now validate the JSON message
        this.deltaValidator.validationResult.reset()
        this.deltaValidator.validate(delta, type)
        if (this.deltaValidator.validationResult.hasErrors()) {
            console.error(`3 Validation errors in: ${JSON.stringify(delta)}`)
            this.deltaValidator.validationResult.issues.forEach(issue => {
                console.error(issue.errorMsg())
            })
            return
        }
        // Finally ok
        func(socket, delta)
    }
}
