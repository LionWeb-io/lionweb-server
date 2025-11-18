import { NODES_TABLE, retrieveFullNodesFromQuerySQL, sqlArrayFromNodeIdArray } from "@lionweb/server-common"

export const retrieveWithSQL = (nodeid: string[], depthLimit: number): string => {
    const sqlArray = sqlArrayFromNodeIdArray(nodeid)
    return retrieveFullNodesFromQuerySQL(`--
            WITH RECURSIVE tmp AS (
                SELECT id, parent, 0 as depth
                FROM ${NODES_TABLE}
                WHERE id IN ${sqlArray}    
                UNION
                    SELECT nn.id, nn.parent, tmp.depth + 1
                    FROM ${NODES_TABLE} as nn
                    INNER JOIN tmp ON tmp.id = nn.parent
                    WHERE tmp.depth < ${depthLimit}
            )
            SELECT * FROM ${NODES_TABLE} as nodesTable
            WHERE nodesTable.id IN (SELECT id FROM tmp)
    `)
}
