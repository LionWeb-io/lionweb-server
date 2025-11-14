export function sqlArrayFromNodeIdArray(strings: string[]): string {
    return `(${strings.map(id => `'${id}'`).join(", ")})`
}

export function postgresArrayFromStringArray(strings: string[]): string {
    return `{${strings.map(id => `"${id}"`).join(", ")}}`
}

export function nextRepoVersionQuery(clientId: string) {
    return `SELECT nextRepoVersion('${clientId}');\n`
}

export function currentRepoVersionQuery(): string {
    return `SELECT currentRepoVersion();\n`
}
