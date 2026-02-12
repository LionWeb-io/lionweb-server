import { VERSIONS_SQL, sqlArrayFromNodeIdArray, postgresArrayFromStringArray} from "./PgHelpers.js"
export * from "./DbChanges.js"
export * from "./InitializedMapToArray.js"
export * from "./GuardFunctions.js"
import {
    retrieveFullNodesFromQuerySQL,
    retrieveFullNodesFromIdListSQL,
    is_NodesForQueryQuery_ResultType,
    versionResultToResponse,
    retrieveFullNodesFromIdListDB,
    retrieveFullNodesFromQueryDB
} from "./QueryNode.js"
import { QUERIES } from "./InsertNodeArry.js"
import { RESERVED_IDS_DB, RESERVED_IDS_SQL } from "./ReservedIds.js"
import { RETRIEVE_NODES_SQL, RETRIEVE_NODES_DB, NodeWithParent} from "./RetrieveNodes.js"
import { QUERIES_SQL, QUERIES_DB} from "./queries.js"
import { getAvailableIds } from "./getAvailableIds.js"
import { retrievePartitionsFromDB } from "./PartitionQueries.js"

/**
 * All functions returning an SQL query as a string.
 */
export const SQL = {
    is_NodesForQueryQuery_ResultType,
    retrieveFullNodesFromQuerySQL,
    retrieveFullNodesFromIdListSQL,
    versionResultToResponse,
    ...RESERVED_IDS_SQL,
    ...RETRIEVE_NODES_SQL,
    ...QUERIES,
    ...VERSIONS_SQL,
    ...QUERIES_SQL
}

/**
 * All functions doing an actual database query, resulting in data from the database.
 */
export const DB = {
    retrieveFullNodesFromIdListDB,
    retrieveFullNodesFromQueryDB,
    getAvailableIds,
    retrievePartitionsFromDB,
    ...RESERVED_IDS_DB,
    ...RETRIEVE_NODES_DB,
    ...QUERIES_DB
}

export { 
    type NodeWithParent,
    postgresArrayFromStringArray,
    sqlArrayFromNodeIdArray
}

