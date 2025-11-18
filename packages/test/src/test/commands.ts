import { SignOnRequest, AddPropertyCommand, AddPartitionCommand, ChangePropertyCommand, DeletePropertyCommand } from "@lionweb/server-delta-shared"

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

export const newAddPropertyCommand = (nodeid: string, newValue: string, propertyKey: string): AddPropertyCommand => {
    return {
        messageKind: "AddProperty",
        commandId: `command-id-${queryId++}`,
        node: nodeid,
        newValue: newValue,
        property: {
            language: "language",
            key: propertyKey,
            version: "1"
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
        commandId: "2",
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

export const ALL = {
}

