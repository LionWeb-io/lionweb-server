export function toJsonString(object: unknown): string {
    return JSON.stringify(object, replacer).replace(/\\"/g, '"')
}

function replacer(key: unknown, value: unknown) {
    // Filtering out properties
    const isArray = Array.isArray(value)
    if (value === undefined) {
        return `isUndefined`
    } else if (value === null) {
        return `isNull`
    } else if (isArray) {
        return value
    } else if (typeof value === "object") {
        return (
            "{{ " +
            Object.getOwnPropertyNames(value)
                .map(prop => prop + " : " + JSON.stringify((value as any)[prop], replacer))
                .join(", ")
                .replace(/\\"/g, '"') +
            " }}"
        )
    } else if (typeof value === "string") {
        return value
    } else if (typeof value === "number") {
        return value
    }
    return "type-" + typeof value
}
