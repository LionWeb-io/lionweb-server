import { InternalQueryError } from "./GuardFunctions.js"
import { LionWebJsonNode } from "@lionweb/json"
import { ResponseMessage } from "@lionweb/server-shared"
import { CONTAINMENTS_TABLE, DbConnection, METAPOINTERS_TABLE, NODES_TABLE, PROPERTIES_TABLE, REFERENCES_TABLE, RepositoryData } from "../database/index.js"
import { isLionWebJsonNode } from "./GuardFunctions.js"
import { sqlArrayFromNodeIdArray } from "./PgHelpers.js"

/**
 * Converts the result of queries using Postgres function nextRepoVersion or currentRepoVersion to the version number
 * @param versionResult
 */
export function versionResultToResponse(versionResult: object): ResponseMessage {
    // @ts-expect-error TS5703
    const version = (versionResult[0]?.currentrepoversion ?? versionResult[0]?.nextrepoversion) as number
    return {
        kind: "RepoVersion",
        message: "RepositoryVersion at end of Transaction",
        data: { version: `${version}` }
    }
}

export type NodesForQueryQuery_ResultType = LionWebJsonNode[]

export function is_NodesForQueryQuery_ResultType(o: unknown): o is NodesForQueryQuery_ResultType {
    return Array.isArray(o) && o.every(n => isLionWebJsonNode(n))
}

// function isLionWebJsonNode(object: unknown):object is LionWebJsonNode {
//     const validator = new LionWebSyntaxValidator(new ValidationResult())
//     // Now validate the all the properties of the full JSON message
//     validator.validationResult.reset()
//     validator.validate(object, "LionWebJsonNode")
//     return !validator.validationResult.hasErrors()
// }

export const retrieveFullNodesDB = async (dbConnection: DbConnection, repo: RepositoryData, nodeQuery: string): Promise<LionWebJsonNode[]> => {
    const queryResult =  await dbConnection.query(repo, retrieveFullNodesFromQuerySQL(nodeQuery))
    if (is_NodesForQueryQuery_ResultType(queryResult)) {
        return queryResult
    } else {
        const error: InternalQueryError = {
            kind: "InternalQueryError",
            message: `Query return type incorrect, expected NodesForQueryQuery_ResultType`,
            data: [{
                key: "query",
                value: retrieveFullNodesFromQuerySQL(nodeQuery)
                },
                {
                    key: "queryResult",
                    value: JSON.stringify(queryResult)
                }
            ]
        }
        throw error
    }
}
/**
 * Query to retrieve the full LionWeb nodes from the database.
 * @param nodesQuery string SQL query to select the set of nodes to retrieve.
 *                   Must have an `id` property.
 */
export const retrieveFullNodesFromQuerySQL = (nodesQuery: string): string => {
    return `-- Get the nodes for the nodes query
    WITH relevant_nodes AS (
        ${nodesQuery}
    ),
    -- Get full nodes from the different tables
    node_properties AS ( 
        SELECT
            relevant_nodes.id ,
            array_remove(
                array_agg(
                    CASE
                      WHEN prop.property IS NOT NULL THEN
                        jsonb_build_object(
                            'property', 
                            json_build_object(
                                'version',mp._version,
                                'language', mp.language,
                                'key', mp.key
                            ),
                            'value', prop.value
                        )
                      WHEN TRUE THEN
                        null
                    END
                ),
                null
            ) properties
        FROM relevant_nodes
        left join ${PROPERTIES_TABLE} prop  on prop.node_id  = relevant_nodes.id 
        left join ${METAPOINTERS_TABLE} mp on mp.id = prop.property 
        group by relevant_nodes.id, prop.node_id
    ),
    node_containments AS (
        SELECT    
            n1.id ,
            array_remove(
                array_agg(
                    CASE 
                        WHEN con.containment IS NOT NULL THEN
                            jsonb_build_object(
                                'containment',
                                json_build_object(
                                    'version', mp._version,
                                    'language', mp.language,
                                    'key', mp.key
                                ),     
                                'children', con.children
                            )
                        WHEN TRUE THEN
                            null
                    END
                ),
                null
            )
        containments
        FROM node_properties n1
        LEFT JOIN ${CONTAINMENTS_TABLE} con  ON con.node_id  = n1.id
        left join ${METAPOINTERS_TABLE} mp on mp.id = con.containment
        group by n1.id, con.node_id
    ),
    node_references AS (
        SELECT    
            n1.id ,
            array_remove(array_agg(
                CASE 
                    WHEN rref.reference IS NOT NULL THEN
                        jsonb_build_object(
                            'reference',
                                json_build_object(
                                    'version', mp._version,
                                    'language', mp.language,
                                    'key', mp.key
                                ),     
                              'targets', rref.targets
                          )
                    WHEN TRUE THEN
                        null
                END), null)        rreferences
        from node_properties n1
        left join ${REFERENCES_TABLE} rref  on rref.node_id  = n1.id
        left join ${METAPOINTERS_TABLE} mp on mp.id = rref.reference 
        group by n1.id, rref.node_id
    )

select 
    relevant_nodes.id,
    jsonb_build_object(
            'key', classifier.key,
            'language', classifier.language,
            'version', classifier._version) classifier,
    relevant_nodes.parent,
    array_to_json(prop.properties) properties,
    array_to_json(containments) containments,
    array_to_json(rreferences) references,
    annotations annotations
from relevant_nodes
left join node_properties prop on prop.id = relevant_nodes.id
left join node_containments con on con.id = relevant_nodes.id
left join node_references rref on rref.id = relevant_nodes.id
left join ${METAPOINTERS_TABLE} classifier on classifier.id = relevant_nodes.classifier
`
}

export const retrieveNodeForIdListSQL = (nodeid: string[]): string => {
    const sqlNodeCollection = sqlArrayFromNodeIdArray(nodeid)
    return retrieveFullNodesFromQuerySQL(`SELECT * FROM ${NODES_TABLE} WHERE id IN ${sqlNodeCollection}\n`)
}

/**
 * Query that will recursively get all child (ids) of all nodes in _nodeIdList_
 * Note that annotations are also considered children for this method.
 * This works ok because we use the _parent_ column to find the children, not the containment or annotation.
 * @param nodeidlist
 * @param depthLimit
 */
export const retrieveNodeTreeForIdListSQL = (nodeidlist: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeidlist)
    return `-- Recursively retrieve node tree
            WITH RECURSIVE tmp AS (
                SELECT id, parent, 0 as depth
                FROM ${NODES_TABLE}
                WHERE id IN ${sqlArray}    
                UNION
                    SELECT nn.id, nn.parent, tmp.depth + 1
                    FROM ${NODES_TABLE} as nn
                    INNER JOIN tmp ON tmp.id = nn.parent
                    WHERE tmp.depth < ${depthLimit} -- AND nn.id NOT in ${"otherArray"}
            )
            SELECT * FROM tmp;
    `
}
