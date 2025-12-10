import {
    SignOnRequest,
    AddPropertyCommand,
    AddPartitionCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    SubscribeToPartitionContentsRequest,
    UnsubscribeFromPartitionContentsRequest,
    AddChildCommand,
    DeleteChildCommand
} from "@lionweb/server-delta-shared"

let queryId = 1
// let commandId = 1

export const newSignOnRequest = (repo: string, clientId: string): SignOnRequest => {
    return {
        messageKind: "SignOn",
        repositoryId: repo,
        deltaProtocolVersion: "2023.1",
        clientId: clientId,
        queryId: `query-id-${queryId++}`,
        protocolMessages: []
    }
}

export const newSubscribeToPartitionRequest = (repo: string, clientId: string, partition: string): SubscribeToPartitionContentsRequest => {
    return {
        messageKind: "SubscribeToPartitionContents",
        partition: partition,
        queryId: `query-id-${queryId++}`,
        protocolMessages: []
    }
}

export const newUnSubscribeToPartitionRequest = (repo: string, clientId: string, partition: string): UnsubscribeFromPartitionContentsRequest => {
    return {
        messageKind: "UnsubscribeFromPartitionContents",
        partition: partition,
        queryId: `query-id-${queryId++}`,
        protocolMessages: []
    }
}

export const newAddPropertyCommand = (nodeid: string, newValue: string, propertyKey: string): AddPropertyCommand => {
    return {
        messageKind: "AddProperty",
        commandId: `command-id-${queryId++}`,
        node: nodeid,
        newValue: newValue,
        property: {
            language: "LionCore-builtins",
            key: propertyKey,
            version: "2023.1"
        },
        protocolMessages: []
    }
}

export const newChangePropertyCommand = (nodeid: string, newValue: string, propertyKey: string): ChangePropertyCommand => {
    return {
        messageKind: "ChangeProperty",
        commandId: `command-id-${queryId++}`,
        node: nodeid,
        newValue: newValue,
        property: {
            language: "LionCore-builtins",
            key: propertyKey,
            version: "2023.1"
        },
        protocolMessages: []
    }
}

export const newDeletePropertyCommand = (nodeid: string, propertyKey: string): DeletePropertyCommand => {
    return {
        messageKind: "DeleteProperty",
        commandId: `command-id-${queryId++}`,
        node: nodeid,
        property: {
            language: "LionCore-builtins",
            key: propertyKey,
            version: "2023.1"
        },
        protocolMessages: []
    }
}

export const newAddPartitionCommand = (nodeid: string, classifierKey: string): AddPartitionCommand => {
    return {
        messageKind: "AddPartition",
        commandId: `command-id-${queryId++}`,
        newPartition: {
            nodes: [{
                id: nodeid,
                parent: null,
                properties: [],
                containments: [],
                references: [],
                classifier: {
                    language: "LionCore-builtins",
                    key: classifierKey,
                    version: "2023.1"
                },
                annotations: []
            }]
        },
        protocolMessages: []
    }
}

export const newAddChildCommand = (nodeid: string, parent: string, containmentKey: string): AddChildCommand => {
    return {
        messageKind: "AddChild",
        commandId: `command-id-${queryId++}`,
        containment: {
            language: "LogoProgram",
            key: containmentKey,
            version: "1"
        },
        index: 0,
        parent: parent,
        newChild: {
            nodes: [{
                id: nodeid,
                parent: parent,
                properties: [
                    { property: { language: "LogoProgram", key: "-key-MoveCommand-distance", version: "1"}, value: "20"}
                ],
                containments: [],
                references: [],
                classifier: { language: "LogoProgram", key: "-key-MoveCommand", version: "1"},
                annotations: []
            }]
        },
        protocolMessages: []
    }
}

export const newDeleteChildCommand = (nodeid: string, index: number, parent: string, containmentKey: string): DeleteChildCommand => {
    return {
        messageKind: "DeleteChild",
        commandId: `command-id-${queryId++}`,
        containment: {
            language: "LogoProgram",
            key: containmentKey,
            version: "1"
        },
        index: index,
        parent: parent,
        deletedChild: nodeid,
        protocolMessages: []
    }
}

export const ALL = {
}

