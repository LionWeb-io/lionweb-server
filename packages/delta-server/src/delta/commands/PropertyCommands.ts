import { isEqualMetaPointer } from "@lionweb/json"
import { PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { deltaLogger, nodesForQueryQuery, is_NodesForQueryQuery_ResultType, DbChanges, MetaPointersTracker } from "@lionweb/server-common"
import { retrieveNode } from "@lionweb/server-common/dist/queries/queries.js"
import {
    AddPropertyCommand,
    ChangePropertyCommand,
    DeletePropertyCommand,
    PropertyAddedEvent,
    PropertyChangedEvent,
    PropertyDeletedEvent,
    DeltaEvent,
    ErrorEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { newErrorEvent } from "../events.js"
import { ParticipationInfo } from "../queries/index.js"
import { DeltaFunction } from "./DeltaUtil.js"

const AddPropertyFunction = (
    participation: ParticipationInfo,
    msg: AddPropertyCommand,
    _ctx: DeltaContext
): PropertyAddedEvent | ErrorEvent => {
    deltaLogger.info("Called AddPropertyFunction " + msg.messageKind)
    // get node with properties
    // CHECK: node exists, property does not exist (not there or value is null)
    // Set value in Postgress
    // Send event
    const event: PropertyAddedEvent = {
        messageKind: "PropertyAdded",
        newValue: msg.newValue,
        node: msg.node,
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        property: msg.property,
        sequenceNumber: 0, // dummy, will be changed for each participation before sending
        protocolMessages: []
    }
    return event
}

const DeletePropertyFunction = (
    participation: ParticipationInfo,
    msg: DeletePropertyCommand,
    _ctx: DeltaContext
): PropertyDeletedEvent | ErrorEvent => {
    deltaLogger.info("Called DeletePropertyFunction " + msg.messageKind)
    const event: PropertyDeletedEvent = {
        messageKind: "PropertyDeleted",
        node: msg.node,
        originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
        property: msg.property,
        sequenceNumber: 0, // dummy, will be changed for each participation before sending
        protocolMessages: [],
        oldValue: "any dummy"
    }
    return event
}

const ChangePropertyFunction = async (
    participation: ParticipationInfo,
    msg: ChangePropertyCommand,
    _ctx: DeltaContext
): Promise<DeltaEvent> => {
    deltaLogger.info(`Called ChangePropertyFunction ${msg.node} pinfo ${JSON.stringify(participation.repositoryInfo)}`)
    // 1. Query to get the node
    const query = retrieveNode(msg.node)
    const q = nodesForQueryQuery(query)
    const retrievedNode = await _ctx.dbConnection.query({ clientId: participation.clientId, repository: participation.repositoryInfo! }, q)
    // eaasert isArry(retroeveNode) && retr
    deltaLogger.info(`Result of retrieveNode: '${JSON.stringify(retrievedNode)}'`)
    
    if (Array.isArray(retrievedNode) && retrievedNode.length === 0) {
        return newErrorEvent("NodeDoesNotExist", `The node with id '${msg.node}' does not exist`, msg, participation, retrievedNode)
    }
    // Validate return type
    if (is_NodesForQueryQuery_ResultType(retrievedNode)) {
        const node = retrievedNode[0]
        const oldProperty = node.properties.find(prop => isEqualMetaPointer(prop.property, msg.property))
        if (oldProperty === undefined) {
            return newErrorEvent("PropertyDoesNotExist", `The property with key '${msg.property.key}' does not exist`, msg, participation, retrievedNode)
        }

        // OKI, now store the new value
        // TODO
        const change = new PropertyValueChanged(new JsonContext(null, ["delta"]), msg.node, msg.property, oldProperty.value, msg.newValue)
        const dbch = new DbChanges(_ctx.pgp)
        dbch.addChanges([change])
        // const metaPointersTracker = new MetaPointersTracker(participation.repositoryInfo)
        // await _ctx.dbConnection.query({ clientId: participation.clientId, repository: participation.repositoryInfo! }, dbch.createPostgresQuery())
        const event: PropertyChangedEvent = {
            messageKind: "PropertyChanged",
            newValue: msg.newValue,
            node: msg.node,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            property: msg.property,
            sequenceNumber: 0, // dummy, will be changed for each participation before sending
            protocolMessages: [
                {
                    kind: "Info",
                    message: JSON.stringify(retrievedNode),
                    data: []
                }
            ],
            oldValue: "any dummy"
        }
        return event
    } else {
        return newErrorEvent("Internal", "Query result has incorrect type", msg, participation, retrievedNode)
    }
}

export const propertyFunctions: DeltaFunction[] = [
    {
        messageKind: "AddProperty",
        // @ts-expect-error TS2332
        processor: AddPropertyFunction
    },
    {
        messageKind: "DeleteProperty",
        // @ts-expect-error TS2332
        processor: DeletePropertyFunction
    },
    {
        messageKind: "ChangeProperty",
        // @ts-expect-error TS2332
        processor: ChangePropertyFunction
    }
]
