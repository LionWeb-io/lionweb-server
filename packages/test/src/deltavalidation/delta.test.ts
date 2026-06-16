
import { DeltaValidator } from "@lionweb/server-delta-definitions"
import { ValidationResult } from "@lionweb/validation"
import fs from "node:fs"
import { describe, test, expect } from "vitest";

const addPropertyJson = fs.readFileSync("./src/deltavalidation/addProperty.json").toString()
const addPropertyTests = JSON.parse(addPropertyJson)

const validator = new DeltaValidator(new ValidationResult())

addPropertyTests.tests.forEach((propTest: unknown, index: number) => {
    describe(`Repository tests addProperty[${index}]`, () => {

        test(`test addProperty ${index}`, async () => {
            validator.validationResult.issues = []
            console.log(JSON.stringify(propTest))
            // @ts-expect-error TS2339
            const kind = propTest?.command?.messageKind
            console.log(`kind ${kind}`)

            // @ts-expect-error TS2339
            const command = propTest.command
            validator.validateDelta(command)
            validator.validationResult.issues.forEach(issue => {
                console.log(`Issue ${issue.issueType}: ${issue.errorMsg()}`)
            })
            // @ts-expect-error TS2339
            if ((propTest.expectedError === null) || (propTest.expectedError === undefined)) {
                assert(
                    validator.validationResult.issues.length === 0,
                    `expected no errors, got ${validator.validationResult.issues.length} errors`
                )
            } else {
                assert(
                    validator.validationResult.issues.length > 0,
                    `expected at least 1 error, got ${validator.validationResult.issues.length}`
                )
                // @ts-expect-error TS2339
                expect(validator.validationResult.issues[0].issueType === propTest.expectedError, "unexpected error").toBe(true)
            }
        })
    })
})
