let internalSpace: number = undefined

// export function toJsonArray(object: unknown[], space?: number): string {
//     if (object.length <= 1) {
//         return toJsonString(object)
//     } else {
//         let result = "[\n";
//         result += object.map(obj => "  " + toJsonString(obj, space)).join("\n");
//         result += "\n]";
//         return result
//     }
// }

// export function toJsonString(object: unknown, space?: number): string {
//     return JSON.stringify(object, null)
// }

const isArray = (value: any) => {
    return Array.isArray(value) && typeof value === 'object';
};

const isObject = (value: any) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isString = (value: any) => {
    return typeof value === 'string';
};

const isBoolean = (value: any) => {
    return typeof value === 'boolean';
};

const isNumber = (value: any) => {
    return typeof value === 'number';
};

const isNull = (value: any) => {
    return value === null && typeof value === 'object';
};

const isNotNumber = (value: any) => {
    return typeof value === 'number' && isNaN(value);
};

const isInfinity = (value: any) => {
    return typeof value === 'number' && !isFinite(value);
};

const isDate = (value: any) => {
    return typeof value === 'object' && value !== null && typeof value.getMonth === 'function';
};

const isUndefined = (value: any) => {
    return value === undefined && typeof value === 'undefined';
};

const isFunction = (value: any) => {
    return typeof value === 'function';
};

const isSymbol = (value: any) => {
    return typeof value === 'symbol';
};

const restOfDataTypes = (value: any) => {
    return isNumber(value) || isString(value) || isBoolean(value);
};

const ignoreDataTypes = (value: any) => {
    const result =  isUndefined(value) || isFunction(value) || isSymbol(value);
    console.log("ignoreDataTypes => " + result)
    return result
};

const nullDataTypes = (value: any) => {
    return isNotNumber(value) || isInfinity(value) || isNull(value);
}

const arrayValuesNullTypes = (value: any) => {
    return isNotNumber(value) || isInfinity(value) || isNull(value) || ignoreDataTypes(value);
}

const removeComma = (str: string) => {
    const tempArr = str.split('');
    tempArr.pop();
    return tempArr.join('');
};

export function JSONStringify(obj: any): string  {
    const result = JSONStringifyIntern(obj)
    console.log("JSON Strinify: " + result)
    return result
}
function JSONStringifyIntern(obj: any): string {
    if (ignoreDataTypes(obj)) {
        return "ignoredDataTypes";
    }

    if (isDate(obj)) {
        return "isDate"
        // return `"${obj.toISOString()}"`;
    }

    if(nullDataTypes(obj)) {
        return "null"
        // return `${null}`
    }

    if(isSymbol(obj)) {
        return "isSymbol";
    }

    if (restOfDataTypes(obj)) {
        return "rest"
        // const passQuotes = isString(obj) ? `"` : '';
        // return `${passQuotes}${obj}${passQuotes}`;
    }

    if (isArray(obj)) {
        return "array"
        // let arrStr = '';
        // obj.forEach((eachValue) => {
        //     arrStr += arrayValuesNullTypes(eachValue) ? JSONStringify(null) : JSONStringify(eachValue);
        //     arrStr += ','
        // });

        // return  `[` + removeComma(arrStr) + `]`;
    }

    if (isObject(obj)) {
        console.log("isObject")
        let objStr = '';
        const objKeys = Object.keys(obj);
        objKeys.forEach((eachKey) => {
            console.log("object key is " + eachKey)
            const eachValue = obj[eachKey];
            const str = eachKey + ": " + JSONStringify(eachValue)
            console.log("str key = " + str)
            objStr +=  str + ",";// (!ignoreDataTypes(eachValue)) ? str : 'ignored';
        });

        // const xxx = "[" + removeComma(objStr) + "]";
        const xxx = "{aap} twee"
        console.log("xxx is " + xxx);

        // console.log( "{" + removeComma(objStr) + "}");
        console.log(removeComma(objStr));

        return xxx
        // return "{" + removeComma(objStr) + "}"
        // return "{" + removeComma(objStr) + "}";
    }
    
    return "Whatever"
};



