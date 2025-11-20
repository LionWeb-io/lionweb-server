import { LionWebJsonNode } from "@lionweb/server-delta-shared"
import { dbLogger } from "../apiutil/index.js"
import { TableHelpers } from "../main.js"
import { MetaPointersTracker } from "../metapointers/MetaPointers.js"

/**
 * Create a query to insert `tbsNodesToCreate` in the lionweb_nodes table
 * These nodes are all new nodes, so all nodes,  properties, containments and references are directly inserted
 * in their respective tables.
 * @param tbsNodesToCreate
 */
export function insertNodeArraySQL(tbsNodesToCreate: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): string {
    dbLogger.debug("Queries insert new nodes " + tbsNodesToCreate.map(n => n.id))
    {
        let query = "-- create new nodes\n"
        if (tbsNodesToCreate === undefined || tbsNodesToCreate.length === 0) {
            return query
        }
        const node_rows = tbsNodesToCreate.map(node => {
            return {
                id: node.id,
                classifier: TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(node.classifier).toString()),
                annotations: node.annotations,
                parent: node.parent
            }
        })
        query += TableHelpers.pgp.helpers.insert(node_rows, TableHelpers.NODES_COLUMN_SET) + ";\n"
        query += insertContainmentsSQL(tbsNodesToCreate, metaPointersTracker)

        // INSERT Properties
        const insertProperties = tbsNodesToCreate.flatMap(node =>
            node.properties.map(prop => ({
                node_id: node.id,
                property: TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(prop.property).toString()),
                value: prop.value
            }))
        )
        if (insertProperties.length !== 0) {
            query += TableHelpers.pgp.helpers.insert(insertProperties, TableHelpers.PROPERTIES_COLUMN_SET) + ";\n"
        }

        // INSERT References
        const insertReferences = tbsNodesToCreate.flatMap(node =>
            node.references.map(reference => ({
                node_id: node.id,
                reference: TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(reference.reference).toString()),
                targets: reference.targets
            }))
        )
        if (insertReferences.length !== 0) {
            query += TableHelpers.pgp.helpers.insert(insertReferences, TableHelpers.REFERENCES_COLUMN_SET) + ";\n"
        }
        return query
    }
}

export function insertContainmentsSQL(tbsNodesToCreate: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): string {
    let query = "-- insert containments for new node\n"
    // INSERT Containments
    const insertRowData = tbsNodesToCreate.flatMap(node =>
        node.containments.map(c => ({
            node_id: node.id,
            containment: TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(c.containment).toString()),
            children: c.children
        }))
    )
    if (insertRowData.length > 0) {
        query += TableHelpers.pgp.helpers.insert(insertRowData, TableHelpers.CONTAINMENTS_COLUMN_SET) + ";\n"
    }
    return query
}
