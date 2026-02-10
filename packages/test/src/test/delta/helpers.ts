


export async function waitFor<T>(fn: () => T, fnCondition: (r: T) => boolean, repeat: number, maxNr: number, timeOutMessage: string) {
    let result = await fn();
    while (fnCondition(result)) {
        if (maxNr-- <= 0) {
            console.error(`waitFor failed: ${timeOutMessage}`)
            break
        }
        await wait(repeat);
        result = await fn();
    }
    return result;
}

async function wait(ms = 500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

