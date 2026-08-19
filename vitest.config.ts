import {fileURLToPath} from 'node:url'
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vitest/config'

export default defineConfig({
    plugins: [vue()],
    define: {'import.meta.client': 'true', 'import.meta.server': 'false'},
    resolve: {alias: {'~': fileURLToPath(new URL('.', import.meta.url))}},
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            include: [
                'composables/**/*.ts',
                'components/HorizontalCarousel.vue',
                'components/ProductCard.vue',
                'components/StoreHeader.vue',
            ],
            thresholds: {lines: 95, functions: 95, statements: 95, branches: 90},
        },
    },
})
