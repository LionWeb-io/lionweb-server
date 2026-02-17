import { DeltaClient } from "@lionweb/server-delta-client"
import { isErrorEvent, isErrorResponse } from "@lionweb/delta-server"
import {
    SignOnRequest,
    AddPropertyCommand,
    AddPartitionCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest,
    AddChildCommand,
    DeleteChildCommand,
    AddReferenceCommand,
    DeleteReferenceCommand,
    LionWebJsonMetaPointer,
    LionWebId,
    LionWebJsonProperty,
    DeletePartitionCommand,
    DeltaRequest,
    DeltaResponse,
    DeltaAdminResponse,
    DeltaErrorCode,
    DeltaEvent,
    DeltaCommand,
    DeltaAdminRequest,
    CreateRepositoryAdminRequest,
    DeleteRepositoryAdminRequest,
    MessageToClient
} from "@lionweb/server-delta-shared"
import { waitFor } from "./delta/helpers.js"
import {} from "./utils.js"

let queryId = 1
// let commandId = 1

export type PartitionType = {
    id: LionWebId
    classifier: LionWebJsonMetaPointer
    properties?: LionWebJsonProperty[]
}

export type NewChild = {
    id: LionWebId
    cls: LionWebJsonMetaPointer
    parent: LionWebId
    containment: LionWebJsonMetaPointer
    props: PropValue[]
}
export type PropValue = { prop: LionWebJsonMetaPointer; value: string }


export type DeleteChildType = {
    id: LionWebId
    index: number
    parent: LionWebId
    containment: LionWebJsonMetaPointer
}

export type AddReferenceType = {
    id: LionWebId
    index: number
    target: LionWebId
    resolveInfo: string
    reference: LionWebJsonMetaPointer
}

export class Commands {
    client: DeltaClient
    constructor(client: DeltaClient) {
        this.client = client
    }

    signOnRequest = (repo: string, clientId: string): DeltaRequest => {
        const request: SignOnRequest = {
            messageKind: "SignOnRequest",
            repositoryId: repo,
            deltaProtocolVersion: "2023.1",
            clientId: clientId,
            queryId: `query-id-${queryId++}`,
            additionalInfos: []
        }
        return this.client.sendRequest(request)
    }

    subscribeToPartitionRequest = (partition: string): DeltaRequest => {
        const request: SubscribeToPartitionContentsRequest = {
            messageKind: "SubscribeToPartitionContentsRequest",
            partition: partition,
            queryId: `query-id-${queryId++}`,
            additionalInfos: []
        }
        return this.client.sendRequest(request)
    }

    unSubscribeToPartitionRequest = (repo: string, clientId: string, partition: string): DeltaRequest => {
        const request: UnsubscribeFromPartitionContentsRequest = {
            messageKind: "UnsubscribeFromPartitionContentsRequest",
            partition: partition,
            queryId: `query-id-${queryId++}`,
            additionalInfos: []
        }
        return this.client.sendRequest(request)
    }

    addProperty = (nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
        const command: AddPropertyCommand = {
            messageKind: "AddProperty",
            commandId: `command-id-${queryId++}`,
            node: nodeid,
            newValue: newValue,
            property: {
                language: "LionCore-builtins",
                key: propertyKey,
                version: "2023.1"
            },
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    changeProperty = (nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
        const command: ChangePropertyCommand = {
            messageKind: "ChangeProperty",
            commandId: `command-id-${queryId++}`,
            node: nodeid,
            newValue: newValue,
            property: {
                language: "LionCore-builtins",
                key: propertyKey,
                version: "2023.1"
            },
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    deleteProperty = (nodeid: string, propertyKey: string): DeltaCommand => {
        const command: DeletePropertyCommand = {
            messageKind: "DeleteProperty",
            commandId: `command-id-${queryId++}`,
            node: nodeid,
            property: {
                language: "LionCore-builtins",
                key: propertyKey,
                version: "2023.1"
            },
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    addPartition = (partition: PartitionType): DeltaCommand => {
        const command: AddPartitionCommand = {
            messageKind: "AddPartition",
            commandId: `command-id-${queryId++}`,
            newPartition: {
                nodes: [
                    {
                        id: partition.id,
                        parent: null,
                        properties: partition.properties ?? [],
                        containments: [],
                        references: [],
                        classifier: partition.classifier,
                        annotations: []
                    }
                ]
            },
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    deletePartition = (partition: LionWebId): DeltaCommand => {
        const command: DeletePartitionCommand = {
            messageKind: "DeletePartition",
            commandId: `command-id-${queryId++}`,
            deletedPartition: partition,
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    addChild = (child: NewChild): DeltaCommand => {
        const command: AddChildCommand = {
            messageKind: "AddChild",
            commandId: `command-id-${queryId++}`,
            containment: child.containment,
            index: 0,
            parent: child.parent,
            newChild: {
                nodes: [
                    {
                        id: child.id,
                        parent: child.parent,
                        properties: child.props.map(p => {
                            return { property: p.prop, value: p.value }
                        }),
                        containments: [],
                        references: [],
                        classifier: child.cls,
                        annotations: []
                    }
                ]
            },
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    addReference = (addRef: AddReferenceType, marker?: string): DeltaCommand => {
        const command: AddReferenceCommand = {
            messageKind: "AddReference",
            commandId: `command-id-${queryId++}`,
            parent: addRef.id,
            reference: addRef.reference,
            index: addRef.index,
            newTarget: addRef.target,
            newResolveInfo: addRef.resolveInfo,
            additionalInfos: marker
                ? [
                      {
                          kind: "TestMarker",
                          message: "Marker to tell test client that all evebt should be received.",
                          data: [
                              {
                                  key: "TestReady",
                                  value: marker
                              }
                          ],
                          distribute: true
                      }
                  ]
                : []
        }
        return this.client.sendCommand(command)
    }

    deleteReference = (ref: AddReferenceType): DeltaCommand => {
        const command: DeleteReferenceCommand = {
            messageKind: "DeleteReference",
            commandId: `command-id-${queryId++}`,
            parent: ref.id,
            reference: ref.reference,
            deletedTarget: ref.target,
            deletedResolveInfo: ref.resolveInfo,
            index: ref.index,
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    deleteChild = (deleteChild: DeleteChildType): DeltaCommand => {
        const command: DeleteChildCommand = {
            messageKind: "DeleteChild",
            commandId: `command-id-${queryId++}`,
            containment: deleteChild.containment,
            index: deleteChild.index,
            parent: deleteChild.parent,
            deletedChild: deleteChild.id,
            additionalInfos: []
        }
        return this.client.sendCommand(command)
    }

    listRepositories = (): DeltaAdminRequest => {
        return this.client.sendAdminRequest({ messageKind: "ListRepositoriesAdminRequest", queryId: "123", additionalInfos: [] })
    }

    addRepository = (repoName: string): DeltaAdminRequest => {
        const cmd = {
            messageKind: "CreateRepositoryAdminRequest",
            queryId: "aa",
            repositoryName: repoName,
            additionalInfos: []
        } as CreateRepositoryAdminRequest
        return this.client.sendAdminRequest(cmd)
    }

    deleteRepository = (repoName: string): DeltaAdminRequest => {
        const cmd = {
            messageKind: "DeleteRepositoryAdminRequest",
            queryId: "aa",
            repositoryName: repoName,
            additionalInfos: []
        } as DeleteRepositoryAdminRequest
        return this.client.sendAdminRequest(cmd)
    }

    /**
     * Function that waits for the event corresponding to `command`
     * @param command
     */
    eventFor = async (command: DeltaCommand): Promise<DeltaEvent> => {
        return await waitFor<DeltaEvent>(
            () => this.client.receivedEvents.get(command.commandId),
            result => result === undefined,
            50,
            10,
            `query ${command.commandId} ${command.messageKind}`
        )
    }
    responseFor = async (query: DeltaRequest | DeltaAdminRequest): Promise<DeltaResponse | DeltaAdminResponse> => {
        return await waitFor<DeltaResponse | DeltaAdminResponse>(
            () => this.client.receivedResponses.get(query.queryId),
            result => result === undefined,
            50,
            10,
            `query ${query.queryId} ${query.messageKind}`
        )
    }
}

export function hasError(event: MessageToClient, errorCode: DeltaErrorCode): boolean {
    const result =
        (isErrorEvent(event) && event.errorCode === errorCode) ||
        (isErrorResponse(event) && event.errorCode === errorCode) 
        // console.log(
        //     `HasError result '${result}', expecting '${errorCode}' was  '${isErrorEvent(event) ? event.errorCode : "not an error event"}'`
        // )
    return result
}
