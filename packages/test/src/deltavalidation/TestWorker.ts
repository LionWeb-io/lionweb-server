import { DeltaValidator } from "@lionweb/server-delta-definitions"
import { ValidationResult } from "@lionweb/validation"
import fs from "fs"
import { DirectoryWorker } from "./DirectoryWalker.js"
import { expect, test } from "vitest";

export class TestWorker implements DirectoryWorker {
    validator =  new DeltaValidator(new ValidationResult())

    visitDir(_dir: string): void {
    }

    visitFile(file: string): void {
        test("Validating " + file, async () => {
            const message = JSON.parse(fs.readFileSync(file).toString());
            this.validator.validationResult.reset()
            this.validator.validateDelta(message)
            this.validator.validationResult.issues.forEach(issue => {
                console.log(`ISSIE ISSUE Issue ${issue.issueType}: ${issue.errorMsg()}`)
            })
            expect(this.validator.validationResult.hasErrors(), `Command ${file} has errors`).toBeFalsy()
        })
    }
}
