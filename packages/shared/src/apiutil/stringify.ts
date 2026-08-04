let internalSpace: number = undefined

export function toJsonArray(object: unknown[], space?: number): string {
    if (object.length <= 1) {
        return toJsonString(object)
    } else {
        let result = "[\n";
        result += object.map(obj => "  " + toJsonString(obj, space)).join("\n");
        result += "\n]";
        return result
    }
}

export function toJsonString(object: unknown, space?: number): string {
    internalSpace = space
    return JSON.stringify(object, replacer, space).replace(/\\"/g, '"')
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
    } else if (value instanceof Set) {
        return Array.from(value)
    } else if (typeof value === "object") {
        return (
            "{{ " +
            Object.getOwnPropertyNames(value)
                .map(prop => prop + " : " + JSON.stringify((value as any)[prop], replacer, internalSpace))
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
