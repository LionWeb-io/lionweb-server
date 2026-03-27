/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    build: {
        sourcemap: true
    },
    test: {
        globals: true,
        hookTimeout: 30000,
        testTimeout: 50000
    }
})
