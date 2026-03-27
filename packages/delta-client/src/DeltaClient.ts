import {
    CommandSource,
    DeltaAdminRequest,
    DeltaAdminResponse,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    DeltaResponse,
    isDeltaAdminResponse,
    isDeltaEvent,
    isDeltaResponse,
    MessageToClient,
    type ReconnectResponse,
    type SignOffResponse,
    type SignOnResponse
} from "@lionweb/server-delta-shared"
import { LionWebDeltaClientProcessor, ReceivingDelta } from "./delta/index.js"
import { notNullOrUndefined } from "./util.js"

export type DeltaConfiguration = {
    port?: number
    hostname?: string
    timeout?: number
}

export type ClientState = "Disconnected" | "Connected" | "Connecting" | "SignedOn" | "SignedOff"

const DEFAULT_TIMEOUT = 2000
const DEFAULT_SERVER_IP = "ws://127.0.0.1"
const DEFAULT_PORT = 3005

/**
 *  Access to the LionWeb repository API's.
 *  Can be configured by environment variables:
 *      REPO_IP  : the ip address of the repository server
 *      NODE: the port of the repository server
 *      TIMEOUT: the timeout in ms for a server call
 */
export class DeltaClient {
    get state(): ClientState {
        return this._state
    }

    set state(value: ClientState) {
        this._state = value
    }

    // Delta Server parameters
    private port: number
    private hostname: string
    private serverUrl: string
    private timeout: number
    private _state: ClientState = "Disconnected"

    loggingOn = true
    /**
     * The Client id that is used for all Api requests
     */
    clientId: string = "<missiong-client-id>"
    participationId: string = ""
    /**
     * When true, will not call the event processing functions for events that are caused
     * by messages of this client.
     */
    ignoreMyOwnEvents: boolean = true

    /**
     * The name of the repository used for all Api calls
     */
    repository: string | null = "default"

    /**
     * @param clientId
     * @param repository we may want to pass a null repository if we are interested only in using the APIs that list,
     * create, or delete repositories and do not operate on a specific repository.
     */
    constructor(clientId: string, config: DeltaConfiguration, deltaProcessingFunctions: ReceivingDelta[][]) {
        this.port = config.port ?? DEFAULT_PORT
        this.hostname = config.hostname ?? DEFAULT_SERVER_IP
        this.serverUrl = `ws://${this.hostname}:${this.port}/`
        this.timeout = config.timeout ?? DEFAULT_TIMEOUT
        this.clientId = clientId
        
        const tmp = deltaProcessingFunctions
        tmp.push(
            [
                {
                    messageKind: "SignOnResponse",
                    // @ts-expect-error TS2322
                    processor: this.SignOnResponseFunction,
                },
                {
                    messageKind: "SignOffResponse",
                    // @ts-expect-error TS2322
                    processor: this.SignOffResponseFunction,
                },
                {
                    messageKind: "ReconnectResponse",
                    // @ts-expect-error TS2322
                    processor: this.ReconnectResponseFunction,
                }
            ]
        )
        this.deltaProcessor = new LionWebDeltaClientProcessor(tmp)
    }

    socket: WebSocket | undefined
    deltaProcessor: LionWebDeltaClientProcessor
    customFunction: ((msg: MessageToClient) => void) = () => {}
    messageIndex = 0

    sentMessageHistory: string[] = []
    receivedMessageHistory: string[] = []
    // Map from command-id to event =>
    receivedEvents: Map<string, DeltaEvent> = new Map<string, DeltaEvent>()
    // Map from response-id to response =>
    receivedResponses: Map<string, DeltaResponse | DeltaAdminResponse> = new Map<string, DeltaResponse | DeltaAdminResponse>()

    asyncConnect(): Promise<WebSocket | Event> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        return new Promise(function(resolve, reject) {
            const server = new WebSocket(self.serverUrl);
            server.onopen = function() {
                resolve(server);
            };
            server.onerror = function(err) {
                reject(err);
            };

        });
    }
    
    async connect(): Promise<void> {
        this.log("Connecting socket")
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }
        const connectionResult = await this.asyncConnect()
        if (connectionResult instanceof Event) {
            this.log(`Error connecting: ${JSON.stringify(connectionResult)} `)
            return
        }
        this.socket = connectionResult
        this._state = "Connecting"
        if (this.socket.readyState === WebSocket.OPEN) {
            this._state = "Connected"
        } else {
            console.log(`CURRENT READY STATE ${this.socket.readyState}`)
        }
        this.socket.onopen = () => {
            this.log("Received onopen socket event")
        }
        this.socket.onmessage = async ev => {
            this.log(`Incoming message type '${ev.type}': ` + ev.data)
            let ignoreMessage: boolean = false
            this.receivedMessageHistory.push(ev.data.toString())
            if (this.socket === undefined) {
                this.logError("Error on message: socket is undefined")
                return
            }
            const incomingEventOrResponse = JSON.parse(ev.data.toString())
            // Run user provided function first
            if (notNullOrUndefined(this.customFunction)) {
                this.customFunction(incomingEventOrResponse)
            }
            // Store the incoming events, so they can be examined later on.
            if (isDeltaEvent(incomingEventOrResponse)) {
                incomingEventOrResponse.originCommands.forEach(cmd => {
                    this.receivedEvents.set(cmd.commandId, incomingEventOrResponse)
                })
                ignoreMessage = this.ignoreMyOwnEvents &&  incomingEventOrResponse.originCommands.some((oc: CommandSource)  => oc.participationId === this.participationId)
            } else if (isDeltaResponse(incomingEventOrResponse) ) {
                this.receivedResponses.set(incomingEventOrResponse.queryId, incomingEventOrResponse)
            } else if (isDeltaAdminResponse(incomingEventOrResponse)) {
                this.receivedResponses.set(incomingEventOrResponse.queryId, incomingEventOrResponse)
            }
            
            // Don't act upon the client's own events.
            if (!ignoreMessage) {
                this.deltaProcessor.processDelta(this.socket, incomingEventOrResponse)
            }
        }
        
        this.socket.onclose = ev => {
            this.log("close socket event received: " + ev.reason)
            this.state = "Disconnected"
        }
        this.socket.onerror = _ev => {
            console.error("socket error event received ")
        }
    }

    sendCommand(command: DeltaCommand): DeltaCommand {
        this.setCommandId(command)
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
        this.setQueryId(request)
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

    sendAdminRequest(request: DeltaAdminRequest): DeltaAdminRequest {
        this.setQueryId(request)
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

    disconnect(): void {
        this.socket?.close()
        this.state = "Disconnected"
    }

    /**
     * Ensure unique command id's
     * @private
     */
    private commandNumber = 0;
    private setCommandId(command: DeltaCommand): void {
        if (command.commandId === "") {
            command.commandId = command.messageKind + "-" + this.commandNumber++
        }
    }

    private queryNumber = 0;
    private setQueryId(query: DeltaRequest | DeltaAdminRequest): void {
        if (query.queryId === "") {
            query.queryId = query.messageKind + "-" + this.queryNumber++
        }
    }

    private handleError(e: Error, method: string = ""): void {
        let errorMess: string = e.message
        if (e.message.includes("aborted")) {
            errorMess = `Time out: no response from ${this.serverUrl}.`
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
            console.log(`DeltaClient ${this.clientId}: ${message}`)
        }
    }

    /**
     * Always log errors
     * @param message
     */
    logError(message: string): void {
        console.log(`DeltaClient error ${this.clientId}: ${message}`)
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

    /**
     * PROTOCOL FUNCTION FOR DEALING WITH CONNECTIONS.
     * Part of the client class, as it changes the state of the client, and it never
     * needs to be handled by the applicatioin using this DeltaClient
     * @param msg
     */
    SignOnResponseFunction = (msg: SignOnResponse): void => {
        console.log("Called SignOnResponseFunction " + msg.messageKind)
        this.state = "SignedOn"
        this.participationId = msg.participationId
    }

    SignOffResponseFunction = (msg: SignOffResponse): void => {
        console.log("Called SignOffResponseFunction " + msg.messageKind)
        this.state = "SignedOff"
    }

    ReconnectResponseFunction = (msg: ReconnectResponse): void => {
        console.log("Called ReconnectResponseFunction " + msg.messageKind)
        this.state = "Connected"
    }
}
