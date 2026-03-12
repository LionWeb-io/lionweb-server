import { deltaLogger, RepositoryData } from "@lionweb/server-common"
import { repositoryStore } from "@lionweb/server-dbadmin"
import { DeltaAdminResponse, DeltaEvent, DeltaResponse, isDeltaEvent } from "@lionweb/server-delta-shared"
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

export class ChangingPartitionsSubscription {
    creation: boolean = false
    deletion: boolean = false
    depth: number = 0
    
    autoSubscribe: boolean = false
    constructor() {
        
    }
}

export class ParticipationInfo {
    /**
     * Just a number to ensure partitipation id's are uniquely numbered
     */
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
    private eventSequenceNumber: number = 0
    /**
     * The state of this participation.
     */
    participationStatus: ParticipationStatus = "connected"
    /**
     * The partitions that this client is subscribed to
     */
    subscribedPartitions: Set<string> = new Set<string>()
    /**
     * Whether subscribed to adding and deleting partitions.
     */
    partitionChangesSubscription: ChangingPartitionsSubscription | undefined
    /**
     *
     * @param socket
     */
    constructor(socket: WebSocket) {
        this.socket = socket
    }

    async startParticipation(clientId: string, repositoryId: string): Promise<void> {
        this.participationId = this.nextParticipationId()
        this.participationStatus = "signedOn"
        this.repositoryData = {
            clientId: clientId,
            repository: await repositoryStore.getRepository(repositoryId)
        }
        deltaLogger.info(`startParticipation repo '${repositoryId}' schema ${JSON.stringify(this.repositoryData)}`)
    }
    
    nextSequenceNumber(): number {
        return this.eventSequenceNumber++
    }
    private nextParticipationId(): string {
        return "participation-" + ParticipationInfo.nextIdNumber++
    }
    
    send(msg: DeltaEvent | DeltaResponse | DeltaAdminResponse): void {
        if (isDeltaEvent(msg)) {
            msg.sequenceNumber = this.eventSequenceNumber++
        }
        this.socket.send(JSON.stringify(msg))
    }
}
