export function sqlArrayFromNodeIdArray(strings: string[]): string {
    return `(${strings.map(id => `'${id}'`).join(", ")})`
}

export function postgresArrayFromStringArray(strings: string[]): string {
    return `{${strings.map(id => `"${id}"`).join(", ")}}`
}

function nextRepoVersionSQL(clientId: string) {
    return `SELECT nextRepoVersion('${clientId}');\n`
}

function currentRepoVersionSQL(): string {
    return `SELECT currentRepoVersion();\n`
}

export const VERSIONS_SQL = {
    currentRepoVersionSQL,
    nextRepoVersionSQL
}
