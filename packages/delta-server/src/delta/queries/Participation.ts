import WebSocket from 'ws';


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

export type ParticipationInfo = {
    /**
     * The socket which created thos participation
     */
    socket: WebSocket,
    /**
     * The unique id of the participation
     */
    participationId: string,
    /**
     * The repository for this participation.
     */
    repository: string,
    /**
     * The LionWeb delta protocol version
     */
    deltaProtocolVersion: string,
    /**
     * The client id as given by the client
     */
    clientId: string,
    /**
     * The first available number for the next event.
     */
    eventSequenceNumber: number,
    /**
     * The state of this participation.
     */
    participationStatus: ParticipationStatus
    /**
     * The partitions that this client is subscribed to
     */
    subscribedPartitions: string[]
}
