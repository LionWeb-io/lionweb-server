import sm from "source-map-support"
import { DirectoryWalker } from "./DirectoryWalker.js"
import { TestWalker } from "./TestWalker.js"

sm.install()
const DATA: string = "./delta"

describe("Validate messages", () => {
    const worker = new TestWalker()
    const walker = new DirectoryWalker(worker)
    walker.walk(DATA)

})
