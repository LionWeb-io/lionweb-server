import { DeltaValidation } from "@lionweb/repository-delta"
import { ValidationResult } from "@lionweb/validation"
import { assert } from "chai"
import fs from "fs"

// const { deepEqual, equal } = assert
import sm from "source-map-support"
import { DirectoryWalker, DirectoryWorker } from "./DirectoryWalker.js"

sm.install()
const DATA: string = "./delta"

class TestWalker implements DirectoryWorker {

    validator =  new DeltaValidation(new ValidationResult())
    
    visitDir(dir: string): void {
        console.log("Visiting dir " + dir)
    }

    visitFile(file: string): void {
        console.log("visiting file " + file)
        it("Validating " + file, async () => {
            const message = JSON.parse(fs.readFileSync(file).toString());
            this.validator.validationResult.reset()
            this.validator.validateCommand(message)
            this.validator.validationResult.issues.forEach(issue => {
                console.log(`Issue ${issue.issueType}: ${issue.errorMsg()}`)
            })
            assert(!this.validator.validationResult.hasErrors(), `Command ${file} has errors`)
        })
    }
    
}
describe("Validate messages", () => {
    const worker = new TestWalker()
    const walker = new DirectoryWalker(worker)
    walker.walk(DATA)

})
