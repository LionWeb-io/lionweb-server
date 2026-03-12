import { CommandMessageKind, RequestMessageKind } from "@lionweb/server-delta-shared"
import fs from "fs"


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


export class TestCoverage {
    commandKind: CommandMessageKind | RequestMessageKind
    receivedEvents: number = 0
    receivedErrors: string[] = []

    constructor(kind: CommandMessageKind | RequestMessageKind) {
        this.commandKind = kind
    }
}

export function reportHTML(CoverageMap: Map<CommandMessageKind | RequestMessageKind, TestCoverage>) {
    let result: string = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LionWeb Server Test Results</title>
  <style>
    body {
        font-family: "Arial"
    }
    table {
      margin: 0 auto;
      height: 20vh;
      width: 40vh;
    }
    table,
    th,
    td {
      border-collapse: collapse;
      align-content: center;
      text-align: center;
    }
    .CMD {
      text-align: left;
    }
    .ERR {
      text-align: left;
    }
  </style>
</head>
<table border="1">
<thead>
<tr><th>Command</th><th>Server</th><th>Freon</th><th>Freon</th><th>Tests Ok</th><th>Expected Errors</th></tr>
</thead>
<tbody>
`
    for (const entry of CoverageMap.entries()) {
        const ok = entry[1].receivedEvents > 0 ? "✅" : ""
        result += `<tr><td class="CMD"> ${entry[0]} </td><td> ${ok} </td><td> </td><td> </td><td> ${entry[1].receivedEvents} </td>
            <td class="ERR"> ${entry[1].receivedErrors.map((e) => `${e}` + "<br/>").join(" ")} </td><tr>\n`
    }
    result += `</tbody></table>
</body>
</html>
`
    console.log(result)
    fs.writeFileSync("./lionweb-server-test.html", result)
}

