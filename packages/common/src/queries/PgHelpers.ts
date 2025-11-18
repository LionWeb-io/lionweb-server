export function sqlArrayFromNodeIdArray(strings: string[]): string {
    return `(${strings.map(id => `'${id}'`).join(", ")})`
}

export function postgresArrayFromStringArray(strings: string[]): string {
    return `{${strings.map(id => `"${id}"`).join(", ")}}`
}

export function nextRepoVersionSQL(clientId: string) {
    return `SELECT nextRepoVersion('${clientId}');\n`
}

export function currentRepoVersionSQL(): string {
    return `SELECT currentRepoVersion();\n`
}
