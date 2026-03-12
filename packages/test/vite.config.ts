/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    // plugins: [react()],
    build: {
        sourcemap: true
    },
    test: {
        // coverage: {
        //     provider: 'v8',
        //     reporter: ["text", "json", "html"]
        // },
        // reporters: ["verbose", "junit", "json", "html"],
        // outputFile: {
        //     html: "./junit-report.html",
        //     junit: "./junit-report.xml",
        //     json: "./json-report.json"
        // },
        globals: true,
        hookTimeout: 30000,
        testTimeout: 50000
    }
})
