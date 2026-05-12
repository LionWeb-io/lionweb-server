export function sqlArrayFromNodeIdArray(strings: string[]): string {
    return `(${strings.map(id => `'${id}'`).join(", ")})`
}

export function postgresArrayFromStringArray(strings: string[]): string {
    return `{${strings.map(id => `"${id}"`).join(", ")}}`
}

export function SQL_nextRepoVersion(clientId: string) {
    return `SELECT nextRepoVersion('${clientId}');\n`
}

export function SQL_currentRepoVersion(): string {
    return `SELECT currentRepoVersion();\n`
}

