import { LionWebJsonNode } from "@lionweb/json"
import { dbLogger } from "@lionweb/server-logging"
import { notNullOrUndefined } from "../apiutil/index.js"
import { NodeRecord } from "../database/index.js"
import { TableHelpers } from "../main.js"
import { MetaPointersTracker } from "../metapointers/MetaPointers.js"

/**
 * Create a query to insert `tbsNodesToCreate` in the lionweb_nodes table
 * These nodes are all new nodes, so all nodes,  properties, containments and references are directly inserted
 * in their respective tables.
 * @param tbsNodesToCreate
 */
export function SQL_insertNodeArray(tbsNodesToCreate: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): string {
    dbLogger.debug("Queries insert new nodes " + tbsNodesToCreate.map(n => n.id))
    {
        let query = "-- create new nodes\n"
        if (tbsNodesToCreate === undefined || tbsNodesToCreate.length === 0) {
            return query
        }
        const node_rows: NodeRecord[] = tbsNodesToCreate.map(node => {
            return {
                id: node.id,
                classifier: metaPointersTracker.forMetaPointer(node.classifier), //TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(node.classifier).toString()),
                annotations: node.annotations,
                parent: node.parent
            }
        })
        query += TableHelpers.pgp.helpers.insert(node_rows, TableHelpers.NODES_COLUMN_SET) + ";\n"
        query += SQL_insertContainments(tbsNodesToCreate, metaPointersTracker)

        // INSERT Properties, filter out null values, as that means that there is no property
        const insertProperties = tbsNodesToCreate.flatMap(node =>
            node.properties.filter(p => p.value !== null).map(prop => ({
                node_id: node.id,
                property: TableHelpers.pgp.as.format(metaPointersTracker.forMetaPointer(prop.property).toString()),
                value: prop.value
            }))
        )
        if (insertProperties.length !== 0) {
            query += TableHelpers.pgp.helpers.insert(insertProperties, TableHelpers.PROPERTIES_COLUMN_SET) + ";\n"
        }

        // INSERT References, filter out empty targets arrays, as that means that there is no reference
        const insertReferences = tbsNodesToCreate.flatMap(node =>
            node.references.filter(ref => ref.targets.length !== 0).map(reference => ({
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

export function SQL_insertContainments(tbsNodesToCreate: LionWebJsonNode[], metaPointersTracker: MetaPointersTracker): string {
    let query = "-- insert containments for new node\n"
    // INSERT Containments, , filter out empty children arrays, as that means that there is no containment
    const insertRowData = tbsNodesToCreate.flatMap(node =>
        node.containments.filter(con => con.children.length !== 0).map(c => ({
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

