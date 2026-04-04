import { isEqualMetaPointer, LionWebJsonMetaPointer, LionWebJsonNode } from "@lionweb/json"
import {
    AnnotationAdded,
    AnnotationChange,
    Change,
    ContainmentChange,
    Missing,
    NodeRemoved,
    ParentChanged,
    PropertyValueChanged,
    ReferenceChange
} from "@lionweb/json-diff"
import { DbConnection, LionWebTask } from "@lionweb/server-database"
import { dbLogger, queryLogger } from "@lionweb/server-shared"
import pgPromise, { ColumnSet } from "pg-promise"
import pg from "pg-promise/typescript/pg-subset.js"
import { UnknownObjectType } from "../apiutil/index.js"
import { CONTAINMENTS_TABLE, NODES_TABLE, PROPERTIES_TABLE, REFERENCES_TABLE } from "../database/index.js"
import { TableHelpers } from "../main.js"
import { MetaPointersTracker } from "../metapointers/MetaPointers.js"
import { InitializedMapToArray } from "./InitializedMapToArray.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"

export type DbNodeUpdate = {
    id: string
    column: "annotations" | "parent" 
    newValue: unknown
}

export type DbNodeDelete = {
    id: string
}

export type FeatureUpdate = {
    node_id: string
    missing: Missing
}

export type DbPropertyUpdate = FeatureUpdate & {
    property: LionWebJsonMetaPointer
    column: string
    newValue: unknown
}

export type DbContainmentUpdate = FeatureUpdate & {
    containment: LionWebJsonMetaPointer
    column: string
    children: string[]
}

export type DbReferenceUpdate = FeatureUpdate & {
    reference: LionWebJsonMetaPointer
    column: string
    targets: object[]
}

export type PropertKey = {
    nodeId: string
    property: LionWebJsonMetaPointer
}
export type ContainmentKey = {
    nodeId: string
    containment: LionWebJsonMetaPointer
}
export type ReferenceKey = {
    nodeId: string
    reference: LionWebJsonMetaPointer
}

/**
 * This class captures changes in nodes and creates the Postgres queries to apply these changes to
 * the database tables.
 */
export class DbChanges {
    // The maps of updates that need to be done
    updatesOnNodeTable: InitializedMapToArray<string, DbNodeUpdate> = new InitializedMapToArray<string, DbNodeUpdate>()
    updatesPropertyTable: InitializedMapToArray<PropertKey, DbPropertyUpdate> = new InitializedMapToArray<PropertKey, DbPropertyUpdate>()
    updatesContainmentTable: InitializedMapToArray<ContainmentKey, DbContainmentUpdate> = new InitializedMapToArray<
        ContainmentKey,
        DbContainmentUpdate
    >()
    updatesReferenceTable: InitializedMapToArray<ReferenceKey, DbReferenceUpdate> = new InitializedMapToArray<
        ReferenceKey,
        DbReferenceUpdate
    >()
    // map of nodes to be removed
    deletedNodesTable: InitializedMapToArray<string, DbNodeDelete> = new InitializedMapToArray<string, DbNodeDelete>()

    constructor(private pgp: pgPromise.IMain<object, pg.IClient>) {}

    /**
     * Add _changes_ and convert them to (virtual) updates in the underlying tables.
     * @param changes
     */
    addChanges(changes: Change[]): void {
        changes.forEach(change => {
            switch (change.changeType) {
                case "NodeRemoved":
                    this.deletedNodesTable.add((change as NodeRemoved).node.id, { id: (change as NodeRemoved).node.id })
                    break
                case "AnnotationAdded":
                case "AnnotationOrderChanged":
                case "AnnotationRemoved": {
                    const update: DbNodeUpdate = {
                        id: (change as AnnotationChange).nodeAfter.id,
                        column: "annotations",
                        newValue: (change as AnnotationAdded).nodeAfter.annotations
                    }
                    this.updatesOnNodeTable.add(update.id, update)
                    break
                }
                case "ParentChanged": {
                    const update: DbNodeUpdate = {
                        id: (change as ParentChanged).node.id,
                        column: "parent",
                        newValue: (change as ParentChanged).afterParentId
                    }
                    this.updatesOnNodeTable.add(update.id, update)
                    break
                }
                case "PropertyValueChanged": {
                    const update: DbPropertyUpdate = {
                        node_id: (change as PropertyValueChanged).nodeId,
                        property: (change as PropertyValueChanged).property,
                        column: "value",
                        newValue: (change as PropertyValueChanged).newValue,
                        missing: (change as PropertyValueChanged).missing
                    }
                    this.updatesPropertyTable.add({ nodeId: update.node_id, property: update.property }, update)
                    break
                }
                case "ChildRemoved":
                case "ChildAdded":
                case "ChildOrderChanged": {
                    const update: DbContainmentUpdate = {
                        node_id: (change as ContainmentChange).parentNode.id,
                        containment: (change as ContainmentChange).containment,
                        column: "children",
                        children: (change as ContainmentChange).afterContainment?.children ?? [],
                        missing: (change as ContainmentChange).missing
                    }
                    this.updatesContainmentTable.add({ nodeId: update.node_id, containment: update.containment }, update)
                    break
                }
                case "TargetAdded":
                case "TargetRemoved":
                case "TargetOrderChanged": {
                    queryLogger.info(`==> ${change.changeType}: ${change.changeMsg()}`)
                    const update: DbReferenceUpdate = {
                        node_id: (change as ReferenceChange).node.id,
                        reference: (change as ReferenceChange).beforeReference.reference,
                        column: "targets",
                        targets: (change as ReferenceChange).afterReference?.targets ?? [],
                        missing: (change as ReferenceChange).missing
                    }
                    this.updatesReferenceTable.add({ nodeId: update.node_id, reference: update.reference }, update)
                    break
                }
                default: throw new Error("case missing", )
            }
        })
    }

    /**
     * Create a Postgres query for all the changes added to this DbCommand.
     */
    createPostgresQuery(metaPointersTracker: MetaPointersTracker): string {
        let result = `-- Update generated by DbChanges\n`
        this.updatesOnNodeTable.values().forEach((values: DbNodeUpdate[]) => {
            const newValue: UnknownObjectType = {}
            values.forEach(v => (newValue[v.column] = v.newValue))
            result += `-- update nodes
                        UPDATE ${NODES_TABLE}
                            SET ${this.pgp.helpers.sets(newValue, Object.keys(newValue))}
                        WHERE
                            id = '${values[0].id}';
                      `
        })
        this.updatesReferenceTable.values().forEach((values: DbReferenceUpdate[]) => {
            const tmp = `updatesReferenceTable ${values.map(v => JSON.stringify(v))}`
            result += `-- ${tmp}
            `
            // Ensure that there is at most one query created for each reference metapointer
            const valuesProcessed: DbReferenceUpdate[] = []
            for(const refChange of values) {
                if (valuesProcessed.some(vp =>
                    (vp.node_id === refChange.node_id) && isEqualMetaPointer(vp.reference, refChange.reference))
                ) {
                    continue
                } else {
                    valuesProcessed.push(refChange)
                }
                const metaPointerIndex = metaPointersTracker.forMetaPointer(refChange.reference)
                const data = {
                    node_id: refChange.node_id,
                    reference: metaPointerIndex,
                    targets: refChange.targets
                }
                // TODO missing means one element in the list wasn't there before?
                //      so a delete (as generated below) is not what we want.
                result += this.createQueryForFeatures(
                    data,
                    "reference",
                    REFERENCES_TABLE,
                    TableHelpers.REFERENCES_COLUMN_SET,
                    refChange.missing
                )
            }
        })
        this.updatesContainmentTable.values().forEach((values: DbContainmentUpdate[]) => {
            // Ensure that there is at most one query created for each containment metapointer
            const valuesProcessed: DbContainmentUpdate[] = []
            for (const change of values) {
                if (valuesProcessed.some(vp =>
                    (vp.node_id === change.node_id) && isEqualMetaPointer(vp.containment, change.containment))
                ) {
                    continue
                } else {
                    valuesProcessed.push(change)
                }
                const metaPointerIndex = metaPointersTracker.forMetaPointer(change.containment)
                const data = {
                    node_id: change.node_id,
                    containment: metaPointerIndex,
                    children: change.children
                }
                result += this.createQueryForFeatures(
                    data,
                    "containment",
                    CONTAINMENTS_TABLE,
                    TableHelpers.CONTAINMENTS_COLUMN_SET,
                    change.missing
                )
            }
        })
        this.updatesPropertyTable.values().forEach((values: DbPropertyUpdate[]) => {
            // Ensure that there is at most one query created for each containment metapointer
            const valuesProcessed: DbPropertyUpdate[] = []
            for (const change of values) {
                if (valuesProcessed.some(vp =>
                    vp.node_id === change.node_id && isEqualMetaPointer(vp.property, change.property))
                ) {
                    continue
                } else {
                    valuesProcessed.push(change)
                }
                const metaPointerIndex = metaPointersTracker.forMetaPointer(change.property)
                const data = {
                    node_id: change.node_id,
                    property: metaPointerIndex,
                    value: change.newValue
                }
                result += this.createQueryForFeatures(
                    data,
                    "property",
                    PROPERTIES_TABLE,
                    TableHelpers.PROPERTIES_COLUMN_SET,
                    change.missing
                )
            }
        })
        // Deletes at the end, so any (useles) upodates on deleted nodes don't give errors.
        const idsToDelete = this.deletedNodesTable.values().map(v => v[0].id)
        if (idsToDelete.length > 0) {
            const sqlIds = sqlArrayFromNodeIdArray(idsToDelete)
            result += `-- Remove orphans by moving them to the orphan tables
                DELETE FROM ${NODES_TABLE} n
                WHERE n.id IN ${sqlIds};
                
                DELETE FROM ${PROPERTIES_TABLE} p
                WHERE p.node_id IN ${sqlIds};

                DELETE FROM ${CONTAINMENTS_TABLE} c
                WHERE c.node_id IN ${sqlIds};

                DELETE FROM ${REFERENCES_TABLE} r
                WHERE r.node_id IN ${sqlIds};
                `
        }

        dbLogger.debug("DATABASE INSERT " + result)
        return result
    }

    /**
     * Creates a query (update, insert or delete) for a features table.
     * Generic for properties, references and containments.
     * @param data
     * @param languageColum
     * @param versionColumn
     * @param keyColum
     * @param tableName
     * @param columnSet
     * @param missing
     */
    private createQueryForFeatures(
        data: UnknownObjectType,
        metapointerColumn: string,
        tableName: string,
        columnSet: ColumnSet,
        missing: Missing
    ): string {
        let result = ""
        switch (missing) {
            case Missing.MissingBefore:
                result += `-- insert new feature for existing node
                                ${this.pgp.helpers.insert(data, columnSet)};`
                // result += `-- insert new feature for existing node
                //                 ${this.pgp.helpers.insert(data, columnSet)}
                //                 ON CONFLICT ON CONSTRAINT ${tableName}_pkey DO
                //                     UPDATE 
                //                     SET ${this.pgp.helpers.sets(data, columnSet)}
                //                 WHERE
                //                     ${tableName}.node_id = '${data["node_id"]}' AND
                //                     ${tableName}.${metapointerColumn} = ${data[metapointerColumn]};`
                break
            case Missing.MissingAfter:
                result += `-- delete feature for existing node
                                -- table is a reserved word, so we use tabl instead
                                DELETE FROM ${tableName} tabl
                                WHERE 
                                    tabl.node_id = '${data["node_id"]}' AND tabl.${metapointerColumn} = ${data[metapointerColumn]};
                    `
                break
            case Missing.NotMissing:
                result += `-- update feature for existing node
                                UPDATE ${tableName} tabl
                                    SET ${this.pgp.helpers.sets(data, columnSet)}
                                WHERE
                                    tabl.node_id = '${data["node_id"]}' AND
                                    tabl.${metapointerColumn} = ${data[metapointerColumn]};
                              `
                break
            default:
                result += `DbChanged.createQueryForFreatures switch unknown`
                throw new Error("DbChanged.createQueryForFreatures switch unknown")
        }
        return result
    }

    /**
     * Populate the MetaPointers table with metapointers from all the changes in this.
     * @param metaPointersTracker
     * @param dbCommands
     * @param nodes
     * @param task
     */
    async populateMetaPointersFromDbChanges(
        metaPointersTracker: MetaPointersTracker,
        newNodes: LionWebJsonNode[],
        task: LionWebTask
    ): Promise<void> {
        // deltaLogger.info(`populateFromDbChanges`)
        await metaPointersTracker.populate(collector => {
            this.updatesPropertyTable.values().forEach(table => table.forEach(e => collector.considerAddingMetaPointer(e.property)))
            this.updatesContainmentTable.values().forEach(table => table.forEach(e => collector.considerAddingMetaPointer(e.containment)))
            this.updatesReferenceTable.values().forEach(table => table.forEach(e => collector.considerAddingMetaPointer(e.reference)))
            newNodes.forEach((node: LionWebJsonNode) => collector.considerNode(node))
        }, task)
    }
}
