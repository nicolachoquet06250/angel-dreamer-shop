import {fileURLToPath} from 'node:url'
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vitest/config'

export default defineConfig({
    plugins: [vue()],
    define: {'import.meta.client': 'true', 'import.meta.server': 'false'},
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('.', import.meta.url)),
            '#server': fileURLToPath(new URL('./server', import.meta.url))
        }
    },
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
                'server/utils/llms-document.ts',
                'server/routes/llms.txt.get.ts',
                'utils/**/*.ts',
                'server/utils/auth.ts',
                'server/utils/checkout.ts',
                'server/utils/image-response.ts',
                'server/api/auth/**/*.ts',
                'server/api/checkout/**/*.ts',
                'server/api/webhooks/stripe.post.ts',
                'server/api/categories.get.ts',
                'server/api/universes.get.ts',
                'server/api/products/**/*.ts',
                'server/api/content.get.ts',
                'server/api/admin/me.get.ts',
                'server/middleware/security.ts',
                'server/routes/robots.txt.get.ts',
                'server/routes/sitemap.xml.get.ts',
            ],
            thresholds: {lines: 95, functions: 95, statements: 95, branches: 90},
        },
    },
})
