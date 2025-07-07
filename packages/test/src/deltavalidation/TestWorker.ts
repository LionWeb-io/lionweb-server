import { DeltaValidation } from "@lionweb/repository-delta"
import { ValidationResult } from "@lionweb/validation"
import { assert } from "chai"
import fs from "fs"
import { DirectoryWorker } from "./DirectoryWalker.js"
import { describe, test, expect, beforeEach } from "vitest";

export class TestWorker implements DirectoryWorker {
    validator =  new DeltaValidation(new ValidationResult())

    visitDir(dir: string): void {
    }

    visitFile(file: string): void {
        test("Validating " + file, async () => {
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
