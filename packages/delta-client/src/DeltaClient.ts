import WebSocket from 'ws';
import { DeltaCommand, DeltaEvent, DeltaRequest, DeltaResponse, isDeltaEvent, isDeltaResponse } from "@lionweb/server-delta-shared"
import { eventFunctions } from "./delta/events/EventProcessingFunctions.js"
import { LionWebDeltaClientProcessor } from "./delta/index.js"
import { responseFunctions } from "./delta/queryresponses/ResponseProcessingFunctions.js"

/**
 *  Access to the LionWeb repository API's.
 *  Can be configured by environment variables:
 *      REPO_IP  : the ip address of the repository server
 *      NODE_PORT: the port of the repository server
 *      TIMEOUT: the timeout in ms for a server call
 */
export class DeltaClient {
    // Server parameters
    private _nodePort = (typeof process !== "undefined" && process.env.NODE_PORT) || 3005
    private _SERVER_IP = (typeof process !== "undefined" && process.env.REPO_IP) || "ws://127.0.0.1"
    private _SERVER_URL = `${this._SERVER_IP}:${this._nodePort}/`

    private TIME_OUT = process.env.TIMEOUT ?? "20000"
    private TIMEOUT = typeof process !== "undefined" ? Number.parseInt(this.TIME_OUT) || 20000 : 20000

    loggingOn = true
    /**
     * The Client id that is used for all Api requests
     */
    clientId: string

    /**
     * The name of the repository used for all Api calls
     */
    repository: string | null = "default"

    /**
     * @param clientId
     * @param repository we may want to pass a null repository if we are interested only in using the APIs that list,
     * create, or delete repositories and do not operate on a specific repository.
     */
    constructor(clientId: string, repository: string | null = "default") {
        this.clientId = clientId
        this.repository = repository
    }

    socket: WebSocket | undefined
    deltaProcessor = new LionWebDeltaClientProcessor([eventFunctions, responseFunctions])
    eventFunction: ((event: DeltaEvent) => Promise<void>) | undefined
    responseFunction: ((response: DeltaResponse) => Promise<void>) | undefined = undefined
    messageIndex = 0

    sentMessageHistory: string[] = []
    receivedMessageHistory: string[] = []
    // Map from command-id to event =>
    receivedEvents: Map<string, DeltaEvent> = new Map<string, DeltaEvent>()
    // Map from response-id to response =>
    receivedResponses: Map<string, DeltaResponse> = new Map<string, DeltaResponse>()

    async connect(): Promise<void> {
        this.log("Connecting socket")
        this.socket = await new WebSocket("ws://localhost:3005")
        this.socket.onopen = () => {
            this.log("open socket")
        }
        this.socket.onmessage = async ev => {
            this.log(`Incoming message type '${ev.type}': ` + ev.data)
            this.receivedMessageHistory.push(ev.data.toString())
            if (this.socket === undefined) {
                this.logError("Error on message, socket is undefined")
                return
            }
            const incomingEventOrResponse = JSON.parse(ev.data.toString())
            if (isDeltaEvent(incomingEventOrResponse)) {
                if (this.eventFunction !== undefined) {
                    console.log("============================================")
                    await this.eventFunction(incomingEventOrResponse)
                }
                incomingEventOrResponse.originCommands.forEach(cmd => {
                    this.receivedEvents.set(cmd.commandId, incomingEventOrResponse)
                })
            } else if (isDeltaResponse(incomingEventOrResponse)) {
                if (this.responseFunction !== undefined) {
                    await this.responseFunction(incomingEventOrResponse)
                }
            }
            this.deltaProcessor.processDelta(this.socket, incomingEventOrResponse)
        }
        this.socket.onclose = ev => {
            this.log("close socket" + ev.reason)
        }
        this.socket.onerror = ev => {
            this.log("error socket " + ev.message)
        }
    }

    sendCommand(command: DeltaCommand): DeltaCommand {
        // set unique id
        // command.commandId = `command-${this.messageIndex++}`

        const commandAsString = JSON.stringify(command)
        this.log(`sendCommand: ${commandAsString}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        this.sentMessageHistory.push(commandAsString)
        this.socket.send(commandAsString)
        return command
    }

    sendRequest(request: DeltaRequest): DeltaRequest {
        // set unique id
        request.queryId = `request-${this.messageIndex++}`
        const queryAsString = JSON.stringify(request)
        this.log(`sendRequest: ${queryAsString}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        this.sentMessageHistory.push(queryAsString)
        this.socket.send(queryAsString)
        return request
    }

    private handleError(e: Error, method: string = ""): void {
        let errorMess: string = e.message
        if (e.message.includes("aborted")) {
            errorMess = `Time out: no response from ${this._SERVER_URL}.`
            this.logError(errorMess)
        }
        if (method == "") {
            this.logError("handleError: " + JSON.stringify(e))
        } else {
            this.logError(`handleError on /${method}: ` + JSON.stringify(e))
        }
    }

    /**
     * Log wne logging turned on
     * @param message
     */
    log(message: string): void {
        if (this.loggingOn) {
            console.log("DeltaClient: " + message)
        }
    }

    /**
     * Always log errors
     * @param message
     */
    logError(message: string): void {
        console.log("DeltaClient error: " + message)
    }

    /**
     * Return _error_ as en Error, just return itself if it already is.
     * @param error
     */
    // NB Copy from repository-common
    asError(error: unknown): Error {
        if (error instanceof Error) return error
        return new Error(JSON.stringify(error))
    }
}

