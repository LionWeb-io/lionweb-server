import { deltaLogger, RepositoryData } from "@lionweb/server-common"
import { repositoryStore } from "@lionweb/server-dbadmin"
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
    repositoryData: RepositoryData | undefined
    /**
     * The LionWeb delta protocol version
     */
    deltaProtocolVersion: string = ""
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

    async startParticipation(clientId: string, repositoryId: string): Promise<void> {
        this.participationId = "participation-" + ParticipationInfo.nextIdNumber++
        this.participationStatus = "signedOn"
        this.repositoryData = {
            clientId: clientId,
            repository: await repositoryStore.getRepository(repositoryId)
        }
        deltaLogger.info(`startParticipation repo '${repositoryId}' schema ${JSON.stringify(this.repositoryData)}`)
    }
    
    private nextParticipationId(): string {
        return "participation-" + ParticipationInfo.nextIdNumber++
    }
}
