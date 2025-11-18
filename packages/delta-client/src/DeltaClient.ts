import WebSocket from 'ws';
import { DeltaCommand, DeltaRequest, } from "@lionweb/server-delta-shared"
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
    
    private TIME_OUT = process.env.TIMEOUT ?? "20000";
    private TIMEOUT = typeof process !== "undefined" ? Number.parseInt(this.TIME_OUT) || 20000 : 20000;

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

    sentMessageHistory: string[] = []
    receivedMessageHistory: string[] = []
    
    async connect(): Promise<void> {
        this.log("Connecting socket")
        this.socket = await new WebSocket('ws://localhost:3005');
        this.socket.onopen = () => {
            this.log("open socket")
        }
        this.socket.onmessage = (ev) => {
            this.log(`Incoming message type '${ev.type}': ` + ev.data)
            this.receivedMessageHistory.push(ev.data.toString().substring(0, 400))
            if (this.socket === undefined) {
                this.logError("Error on message, socket is undefined")
                return
            }
            this.deltaProcessor.processDelta(this.socket, JSON.parse(ev.data.toString()))
        }
        this.socket.onclose = (ev) => {
            this.log("close socket" + ev.reason)
        }
        this.socket.onerror = (ev) => {
            this.log("error socket " + ev.message)
        }
    }

    sendCommand(command: DeltaCommand): void {
        const commandAsString = JSON.stringify(command)
        this.log(`sendCommand: ${commandAsString}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        // set unique id
        // command.commandId = `${this.id++}`
        this.sentMessageHistory.push(commandAsString)
        this.socket.send(commandAsString)
    }

    sendRequest(query: DeltaRequest): void {
        const queryAsString = JSON.stringify(query)
        this.log(`sendRequest: ${queryAsString}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        // set unique id
        // command.commandId = `${this.id++}`
        this.sentMessageHistory.push(queryAsString)
        this.socket.send(JSON.stringify(query))
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

