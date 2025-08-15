import WebSocket from 'ws';
import { CommandType, QueryRequestType, QueryType } from "@lionweb/server-delta-shared"
import { DefaultEventProcessor, LionWebDeltaClientProcessor, QueryResponseProcessor } from "./delta/index.js"

// getVersionFromResponse(response: ClientResponse<LionwebResponse>): number {
//     return Number.parseInt(response.body.messages.find(m => m.data["version"] !== undefined).data["version"])
// }
//
// // export type LionWebVersionType = "2023.1" | "2024.1"
//
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

    loggingOn = false
    logMessage(logMessage: string): string {
        return this.loggingOn && logMessage !== undefined ? `&clientLog=${logMessage}` : ""
    }
    logMessageSolo(logMessage: string): string {
        return this.loggingOn && logMessage !== undefined ? `clientLog=${logMessage}` : ""
    }
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

    withClientId(id: string): DeltaClient {
        this.clientId = id
        return this
    }

    withRepository(repository: string): DeltaClient {
        this.repository = repository
        return this
    }

    withClientIdAndRepository(id: string, repository: string | null): DeltaClient {
        this.clientId = id
        this.repository = repository
        return this
    }

    socket: WebSocket | undefined
    id: number = 0
    deltaProcessor = new LionWebDeltaClientProcessor(new QueryResponseProcessor(), new DefaultEventProcessor())
    
    async connect(): Promise<void> {
        console.log("Connecting socket")
        this.socket = await new WebSocket('ws://localhost:3005');
        this.socket.onopen = () => {
            console.log("open socket")
        }
        this.socket.onmessage = (ev) => {
            console.log(`Incoming message type '${ev.type}': ` + JSON.stringify(ev.data))
            if (this.socket === undefined) {
                console.log("Error on message, socket is undefined")
                return
            }
            this.deltaProcessor.processDelta(this.socket, JSON.parse(ev.data.toString()))
        }
        this.socket.onclose = (ev) => {
            console.log("close socket", ev.reason)
        }
        this.socket.onerror = (ev) => {
            console.log("erro socket")
        }
    }

    sendCommand(command: CommandType): void {
        console.log(`sendCommand: ${JSON.stringify(command)}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        // set unique id
        // command.commandId = `${this.id++}`
        this.socket.send(JSON.stringify(command))
    }

    sendRequest(query: QueryRequestType): void {
        console.log(`sendRequest: ${JSON.stringify(query)}`)
        if (this.socket === undefined) {
            throw new Error("No socket object")
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Socket has no open connection")
        }
        // set unique id
        // command.commandId = `${this.id++}`
        this.socket.send(JSON.stringify(query))
    }

    private handleError(e: Error, method: string = ""): void {
        let errorMess: string = e.message
        if (e.message.includes("aborted")) {
            errorMess = `Time out: no response from ${this._SERVER_URL}.`
            console.error(errorMess)
        }
        if (method == "") {
            console.error("handleError: " + JSON.stringify(e))
        } else {
            console.error(`handleError on /${method}: ` + JSON.stringify(e))
        }
    }

    /**
     * Log wne logging turned on
     * @param message
     */
    log(message: string): void {
        if (this.loggingOn) {
            console.log("RepositoryDeltaClient: " + message)
        }
    }

    /**
     * Always log errors
     * @param message
     */
    logError(message: string): void {
        console.log("RepositoryDeltaClient error: " + message)
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

