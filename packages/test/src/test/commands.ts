import { LionWebJsonNode } from "@lionweb/json"
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
    MessageToClient,
    MessageFromClient,
    ChangeReferenceCommand,
    isDeltaCommand,
    isDeltaAdminRequest,
    isDeltaRequest,
    SignOffRequest,
    ListAndSubscribePartitionsRequest,
    GetAvailableIdsRequest,
    ListPartitionsRequest,
    ReconnectRequest,
    InformAboutChangingPartitionsRequest,
    SubscribeToChangingPartitionsRequest,
    CompositeCommand,
    MoveChildFromOtherContainmentCommand,
    MoveChildFromOtherContainmentInSameParentCommand,
    ReplaceChildCommand,
    MoveAndReplaceChildFromOtherContainmentCommand
} from "@lionweb/server-delta-shared"
import { waitFor } from "./delta/helpers.js"
import {} from "./utils.js"

let queryId = 100
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
    // newTarget: LionWebId
    // newResolveInfo: string
    reference: LionWebJsonMetaPointer
}

/**
 * Test utility class to easily send commands to the server
 */
export class Commands {
    /**
     * The client used to send the commands
     */
    constructor() {}

    nodes: LionWebJsonNode[] = []

    signOnRequest = (client: DeltaClient, repo: string): DeltaRequest => {
        const request: SignOnRequest = {
            messageKind: "SignOnRequest",
            repositoryId: repo,
            deltaProtocolVersion: "2023.1",
            clientId: client.clientId,
            queryId: `signOn-${queryId++}`,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    signOffRequest = (client: DeltaClient): DeltaRequest => {
        const request: SignOffRequest = {
            messageKind: "SignOffRequest",
            queryId: "",
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    reconnect = (client: DeltaClient, participationId: string): DeltaRequest => {
        const request: ReconnectRequest = {
            messageKind: "ReconnectRequest",
            queryId: "",
            participationId: participationId,
            additionalInfos: [],
            lastReceivedSequenceNumber: 0
        }
        return client.sendRequest(request)
    }

    subscribeToPartitionContentsRequest = (client: DeltaClient, partition: string): DeltaRequest => {
        const request: SubscribeToPartitionContentsRequest = {
            messageKind: "SubscribeToPartitionContentsRequest",
            partition: partition,
            queryId: `query-id-${queryId++}`,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    unSubscribeToPartitionRequest = (client: DeltaClient, repo: string, clientId: string, partition: string): DeltaRequest => {
        const request: UnsubscribeFromPartitionContentsRequest = {
            messageKind: "UnsubscribeFromPartitionContentsRequest",
            partition: partition,
            queryId: `query-id-${queryId++}`,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    subscribeToChangingPartitions = (client: DeltaClient): DeltaRequest => {
        const request: SubscribeToChangingPartitionsRequest = {
            messageKind: "SubscribeToChangingPartitionsRequest",
            queryId: `query-id-${queryId++}`,
            creation: true,
            deletion: true,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    unsubscribeToChangingPartitions = (client: DeltaClient): DeltaRequest => {
        const request: SubscribeToChangingPartitionsRequest = {
            messageKind: "SubscribeToChangingPartitionsRequest",
            queryId: `query-id-${queryId++}`,
            creation: false,
            deletion: false,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    unInformAboutChangingPartitions = (client: DeltaClient): DeltaRequest => {
        const request: InformAboutChangingPartitionsRequest = {
            messageKind: "InformAboutChangingPartitionsRequest",
            queryId: `query-id-${queryId++}`,
            creation: false,
            deletion: false,
            depthLimit: 0,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    informAbout = (client: DeltaClient, depth: number): DeltaRequest => {
        const request: InformAboutChangingPartitionsRequest = {
            messageKind: "InformAboutChangingPartitionsRequest",
            queryId: `informAbout-${queryId++}`,
            creation: true,
            deletion: true,
            depthLimit: depth,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    listAndSubscribePartitions = (client: DeltaClient): DeltaRequest => {
        const request: ListAndSubscribePartitionsRequest = {
            messageKind: "ListAndSubscribePartitionsRequest",
            queryId: "",
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    listPartitions = (client: DeltaClient): DeltaRequest => {
        const request: ListPartitionsRequest = {
            messageKind: "ListPartitionsRequest",
            queryId: "",
            depthLimit: 0,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    availableIds = (client: DeltaClient): DeltaRequest => {
        const request: GetAvailableIdsRequest = {
            messageKind: "GetAvailableIdsRequest",
            queryId: "",
            count: 25,
            additionalInfos: []
        }
        return client.sendRequest(request)
    }

    addProperty = (client: DeltaClient, nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
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
        return client.sendCommand(command)
    }

    changeProperty = (client: DeltaClient, nodeid: string, newValue: string, propertyKey: string): DeltaCommand => {
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
        return client.sendCommand(command)
    }

    deleteProperty = (client: DeltaClient, nodeid: string, propertyKey: string): DeltaCommand => {
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
        return client.sendCommand(command)
    }

    compositeCommandCmd = (): CompositeCommand => {
        const composite: CompositeCommand = {
            messageKind: "CompositeCommand",
            commandId: `composite-id-${queryId++}`,
            additionalInfos: [],
            parts: []
        }
        return composite
    }

    addPartitionCmd = (client: DeltaClient, partition: PartitionType): AddPartitionCommand => {
        const newNode: LionWebJsonNode = {
            id: partition.id,
            parent: null,
            properties: partition.properties ?? [],
            containments: [],
            references: [],
            classifier: partition.classifier,
            annotations: []
        }
        this.nodes.push(newNode)
        const command: AddPartitionCommand = {
            messageKind: "AddPartition",
            commandId: `command-id-${queryId++}`,
            newPartition: { nodes: [newNode] },
            additionalInfos: []
        }
        return command
    }

    addFullPartitionCmd = (client: DeltaClient, partition: LionWebJsonNode[]): AddPartitionCommand => {
        const command: AddPartitionCommand = {
            messageKind: "AddPartition",
            commandId: `command-id-${queryId++}`,
            newPartition: { nodes: partition },
            additionalInfos: []
        }
        return command
    }

    addFullPartition = (client: DeltaClient, partition: LionWebJsonNode[]): AddPartitionCommand => {
        return client.sendCommand(this.addFullPartitionCmd(client, partition)) as AddPartitionCommand
    }

    addPartition = (client: DeltaClient, partition: PartitionType): AddPartitionCommand => {
        return client.sendCommand(this.addPartitionCmd(client, partition)) as AddPartitionCommand
    }

    deletePartition = (client: DeltaClient, partition: LionWebId): DeletePartitionCommand => {
        const command: DeletePartitionCommand = {
            messageKind: "DeletePartition",
            commandId: `command-id-${queryId++}`,
            deletedPartition: partition,
            additionalInfos: []
        }
        return client.sendCommand(command) as DeletePartitionCommand
    }

    moveChildFromOtherContainment = (client: DeltaClient, params: Partial<MoveChildFromOtherContainmentCommand>): DeltaCommand => {
        const command: MoveChildFromOtherContainmentCommand = {
            messageKind: "MoveChildFromOtherContainment",
            commandId: `command-id-${queryId++}`,
            movedChild: params.movedChild,
            oldContainment: params.oldContainment,
            oldIndex: params.oldIndex,
            oldParent: params.oldParent,
            newContainment: params.newContainment,
            newIndex: params.newIndex,
            newParent: params.newParent,
            additionalInfos: []
        }
        return client.sendCommand(command) as MoveChildFromOtherContainmentCommand
    }

    moveChildFromOtherContainmentInSameParent = (
        client: DeltaClient,
        params: Partial<MoveChildFromOtherContainmentInSameParentCommand>
    ): DeltaCommand => {
        const command: MoveChildFromOtherContainmentInSameParentCommand = {
            messageKind: "MoveChildFromOtherContainmentInSameParent",
            commandId: `command-id-${queryId++}`,
            parent: params.parent,
            movedChild: params.movedChild,
            oldContainment: params.oldContainment,
            oldIndex: params.oldIndex,
            newContainment: params.newContainment,
            newIndex: params.newIndex,
            additionalInfos: []
        }
        return client.sendCommand(command) as MoveChildFromOtherContainmentInSameParentCommand
    }

    moveAndReplaceChildFromOtherContainment = (
        client: DeltaClient,
        params: Partial<MoveAndReplaceChildFromOtherContainmentCommand>
    ): DeltaCommand => {
        const command: MoveAndReplaceChildFromOtherContainmentCommand = {
            messageKind: "MoveAndReplaceChildFromOtherContainment",
            commandId: `command-id-${queryId++}`,
            movedChild: params.movedChild,
            oldParent: params.oldParent,
            oldContainment: params.oldContainment,
            oldIndex: params.oldIndex,
            newParent: params.newParent,
            newContainment: params.newContainment,
            newIndex: params.newIndex,
            replacedChild: params.replacedChild,
            additionalInfos: []
        }
        return client.sendCommand(command) as MoveAndReplaceChildFromOtherContainmentCommand
    }

    replaceChildCmd = (
        client: DeltaClient,
        child: NewChild,
        index: number,
        replacedChild: LionWebId,
        extra?: Partial<ReplaceChildCommand>
    ): ReplaceChildCommand => {
        const command: ReplaceChildCommand = {
            messageKind: "ReplaceChild",
            commandId: `command-id-${queryId++}`,
            containment: child.containment,
            index: index,
            parent: child.parent,
            replacedChild: replacedChild,
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
        if (extra?.index) {
            command.index = extra.index
        }
        return command
    }

    replaceChild = (
        client: DeltaClient,
        child: NewChild,
        index: number,
        replacedChild: LionWebId,
        extra?: Partial<ReplaceChildCommand>
    ): DeltaCommand => {
        return client.sendCommand(this.replaceChildCmd(client, child, index, replacedChild, extra))
    }

    addChildCmd = (client: DeltaClient, child: NewChild, extra?: Partial<AddChildCommand>): DeltaCommand => {
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
        if (extra?.index) {
            command.index = extra.index
        }
        return command
    }

    addChild = (client: DeltaClient, child: NewChild, extra?: Partial<AddChildCommand>): DeltaCommand => {
        return client.sendCommand(this.addChildCmd(client, child, extra))
    }

    addReference = (client: DeltaClient, addRef: AddReferenceType, extra?: Partial<AddReferenceCommand>): DeltaCommand => {
        const command: AddReferenceCommand = {
            messageKind: "AddReference",
            commandId: `command-id-${queryId++}`,
            parent: addRef.id,
            reference: addRef.reference,
            index: addRef.index,
            newTarget: addRef.target,
            newResolveInfo: addRef.resolveInfo,
            additionalInfos: []
        }
        if (extra?.index) {
            command.index = extra.index
        }
        return client.sendCommand(command)
    }

    changeReference = (client: DeltaClient, addRef: Partial<ChangeReferenceCommand>): DeltaCommand => {
        const command: ChangeReferenceCommand = {
            messageKind: "ChangeReference",
            commandId: `command-id-${queryId++}`,
            parent: addRef.parent,
            reference: addRef.reference,
            index: addRef.index ?? 0,
            oldTarget: addRef.oldTarget,
            oldResolveInfo: addRef.oldResolveInfo,
            newTarget: addRef.newTarget,
            newResolveInfo: addRef.newResolveInfo,
            additionalInfos: []
        }
        return client.sendCommand(command)
    }

    deleteReference = (client: DeltaClient, ref: Partial<DeleteReferenceCommand>): DeltaCommand => {
        const command: DeleteReferenceCommand = {
            messageKind: "DeleteReference",
            commandId: `command-id-${queryId++}`,
            parent: ref.parent,
            reference: ref.reference,
            deletedTarget: ref.deletedTarget,
            deletedResolveInfo: ref.deletedResolveInfo,
            index: ref.index,
            additionalInfos: []
        }
        return client.sendCommand(command)
    }

    deleteChild = (client: DeltaClient, deleteChild: DeleteChildType): DeltaCommand => {
        const command: DeleteChildCommand = {
            messageKind: "DeleteChild",
            commandId: `command-id-${queryId++}`,
            containment: deleteChild.containment,
            index: deleteChild.index,
            parent: deleteChild.parent,
            deletedChild: deleteChild.id,
            additionalInfos: []
        }
        return client.sendCommand(command)
    }

    listRepositories = (client: DeltaClient): DeltaAdminRequest => {
        return client.sendAdminRequest({ messageKind: "ListRepositoriesAdminRequest", queryId: "123", additionalInfos: [] })
    }

    addRepository = (client: DeltaClient, repoName: string): DeltaAdminRequest => {
        const cmd = {
            messageKind: "CreateRepositoryAdminRequest",
            queryId: "",
            repositoryName: repoName,
            additionalInfos: []
        } as CreateRepositoryAdminRequest
        return client.sendAdminRequest(cmd)
    }

    deleteRepository = (client: DeltaClient, repoName: string): DeltaAdminRequest => {
        const cmd = {
            messageKind: "DeleteRepositoryAdminRequest",
            queryId: "",
            repositoryName: repoName,
            additionalInfos: []
        } as DeleteRepositoryAdminRequest
        return client.sendAdminRequest(cmd)
    }

    /**
     * Function that waits for the event corresponding to `command`
     * @param command
     */
    eventFor = async (client: DeltaClient, command: DeltaCommand): Promise<DeltaEvent> => {
        const tmp = await waitFor<DeltaEvent>(
            () => client.receivedEvents.get(command.commandId),
            result => result === undefined,
            50,
            10,
            `query ${command.commandId} ${command.messageKind}`
        )
        if (tmp === undefined) {
            throw new Error("TimeOut")
        }
        return tmp
    }
    responseFor = async (client: DeltaClient, query: DeltaRequest | DeltaAdminRequest): Promise<DeltaResponse | DeltaAdminResponse> => {
        return await waitFor<DeltaResponse | DeltaAdminResponse>(
            () => client.receivedResponses.get(query.queryId),
            result => result === undefined,
            50,
            10,
            `query ${query.queryId} ${query.messageKind}`
        )
    }
    errorFor = async (client: DeltaClient, command: MessageFromClient): Promise<string> => {
        if (isDeltaCommand(command)) {
            const event = await waitFor<DeltaEvent>(
                () => client.receivedEvents.get(command.commandId),
                result => result === undefined,
                50,
                10,
                `query ${command.commandId} ${command.messageKind}`
            )
            if (isErrorEvent(event)) {
                return event.errorCode
            } else {
                return event.messageKind
            }
        } else if (isDeltaAdminRequest(command) || isDeltaRequest(command)) {
            const response = await waitFor<DeltaResponse | DeltaAdminResponse>(
                () => client.receivedResponses.get(command.queryId),
                result => result === undefined,
                50,
                10,
                `query ${command.queryId} ${command.messageKind}`
            )
            if (isErrorResponse(response)) {
                return response.errorCode
            } else {
                return response.messageKind
            }
        }
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
