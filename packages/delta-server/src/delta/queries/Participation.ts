import WebSocket from "ws"

/**
 * Allowed state transitions:
 * START     => connected
 * connected => signedOn
 * signedOn  => signedOff    NB should this not be "connected again?
 * signedOff => signedOn
 *
 * connected => disconnected
 * signedOn  => dicponnected
 * signedOff => disconnected */
export type ParticipationStatus = "connected" | "signedOn" | "signedOff" | "disconnected"

export class ParticipationInfo {
    static nextIdNumber = 0
    /**
     * The socket which created this participation
     */
    socket: WebSocket
    /**
     * The unique id of the participation
     */
    participationId: string = ""
    /**
     * The repository for this participation.
     */
    repository: string = ""
    /**
     * The LionWeb delta protocol version
     */
    deltaProtocolVersion: string = ""
    /**
     * The client id as given by the client
     */
    clientId: string = ""
    /**
     * The first available number for the next event.
     */
    eventSequenceNumber: number = 0
    /**
     * The state of this participation.
     */
    participationStatus: ParticipationStatus = "connected"
    /**
     * The partitions that this client is subscribed to
     */
    subscribedPartitions: string[] = []

    constructor(socket: WebSocket) {
        this.socket = socket
    }

    startParticipation(): void {
        this.participationId = "participation-" + ParticipationInfo.nextIdNumber++
    }
    
    private nextParticipationId(): string {
        return "participation-" + ParticipationInfo.nextIdNumber++
    }
}
