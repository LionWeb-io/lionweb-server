import { Missing, NodeClassifierChanged, PropertyValueChanged } from "@lionweb/json-diff"
import { JsonContext } from "@lionweb/json-utils"
import { DbChanges, MetaPointersTracker, SQL_nextRepoVersion, TableHelpers } from "@lionweb/server-common"
import { LionWebTask } from "@lionweb/server-database"
import { deltaLogger } from "@lionweb/server-logging"
import {
    ChangeClassifierCommand,
    DeltaEvent,
    CompositeCommand,
    ContinuedCommand,
    PropertyAddedEvent,
    ClassifierChangedEvent
} from "@lionweb/server-delta-shared"
import { DeltaContext } from "../DeltaContext.js"
import { affectedNodeMessage, affectedPartitionMessage, newErrorDelta } from "../events.js"
import { Participation } from "../participation/index.js"
import { DB_affectedPartition, DB_retrieveNode, DeltaFunction, errorEvent } from "./DeltaUtil.js"
import WebSocket from "ws"
import { validateNodeExists, validatePropertyDoesNotExist } from "./Validations.js"

const ChangeClassifierFunction = async (participation: Participation, msg: ChangeClassifierCommand, ctx: DeltaContext): Promise<ClassifierChangedEvent> => {
    deltaLogger.info("Called ChangeClassifierFunction " + msg.messageKind)
    const result = await ctx.dbConnection.tx(async (task: LionWebTask) => {
        const node = await DB_retrieveNode(msg.node, msg, participation, task)
        validateNodeExists(msg.node, node, msg, participation)

        // OKI, now store the new value
        const change = new NodeClassifierChanged (new JsonContext(null, ["delta"]), node, node.classifier, msg.newClassifier)
        const changes = new DbChanges(TableHelpers.pgp)
        changes.addChanges([change])
        const metaPointersTracker = new MetaPointersTracker(participation.repositoryData!)
        await changes.populateMetaPointersFromDbChanges(metaPointersTracker, [], task)
        deltaLogger.debug(`query: ${changes.createPostgresQuery(metaPointersTracker)}`)
        let query = SQL_nextRepoVersion(participation.participationId)
        query += changes.createPostgresQuery(metaPointersTracker)
        const dbResult = await task.query(participation.repositoryData!, query)
        console.log(`ClassifierChanghed: db result is ${JSON.stringify(dbResult)}`)
        const partition = await DB_affectedPartition(task, msg.node, participation)
        return {
            messageKind: "ClassifierChanged",
            node: msg.node,
            oldClassifier: node.classifier,
            newClassifier: msg.newClassifier,
            originCommands: [{ commandId: msg.commandId, participationId: participation.participationId }],
            sequenceNumber: 0,              // dummy, will be changed for each participation before sending
            additionalInfos: [affectedNodeMessage(node.id), affectedPartitionMessage(partition)]
        } as ClassifierChangedEvent
    })
    return result
}

const CompositeCommandFunction = (participation: Participation, msg: CompositeCommand, _ctx: DeltaContext, _ChunkedCommandsocket?: WebSocket): DeltaEvent => {
    deltaLogger.info("Called CompositeCommandFunction, should be handled by DeltaProcessor")
    return errorEvent(msg)
    throw newErrorDelta("generic", "Called CompositeCommandFunction, should be handled by DeltaProcessor", msg, participation )
}

const ContinuedCommandFunction = (participation: Participation, msg: ContinuedCommand, _ctx: DeltaContext, _socket?: WebSocket): DeltaEvent => {
    deltaLogger.info("Called ContinuedCommandFunction " + msg.messageKind)
    // for(const cmd of msg.parts) {
    //     deltaProcessor.processDelta(socket!, cmd)
    // }
    throw newErrorDelta("generic", "ContinuedCommandFunction not implemenetd yet", msg, participation )
}

export const miscFunctions: DeltaFunction[] = [
    {
        messageKind: "ChangeClassifier",
        // @ts-expect-error TS2332
        processor: ChangeClassifierFunction
    },
    {
        messageKind: "ContinuedCommand",
        // @ts-expect-error TS2332
        processor: ContinuedCommandFunction
    },
    {
        messageKind: "CompositeCommand",
        // @ts-expect-error TS2332
        processor: CompositeCommandFunction
    }
]
