import sm from "source-map-support"
import { DirectoryWalker } from "./DirectoryWalker.js"
import { TestWorker } from "./TestWorker.js"
import { describe, test, expect, beforeEach } from "vitest";

sm.install()
const DATA: string = "./delta"

describe("Validate messages", () => {
    const worker = new TestWorker()
    const walker = new DirectoryWalker(worker)
    walker.walk(DATA)

})
