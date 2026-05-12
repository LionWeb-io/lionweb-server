import { LionWebVersionType } from "@lionweb/server-shared"

/**
 * Data determining the repository and user for which a command should be executed.
 */
export type RepositoryData = {
    clientId: string
    repository: RepositoryInfo
}

/**
 * Indicates the configuration of a repository that may have yet to be created.
 */
export type RepositoryInfo = {
    repository_name: string
    schema_name: string
    history: boolean
    lionweb_version: LionWebVersionType
    created?: string
}

/**
 * Adds a SET search_path in from of the query to make it work in the context of the schema of the repository requested.
 * Also checks whether the required schema exists by calling the PSQL `existsschema` function.
 * @param query             The query to adapt
 * @param repositoryData    The data of the repository on which the query should work
 * @returns                 The original query preceded by the set path and exits schema queries
 */
export function addRepositorySchema(query: string, repositoryData: RepositoryData) {
    if (!query.startsWith("SET search_path TO")) {
        query =
            `SET search_path TO '${repositoryData.repository.schema_name}', 'public';
                select public.existsschema('${repositoryData.repository.schema_name}'::text);\n` + query
    }
    return query
}
