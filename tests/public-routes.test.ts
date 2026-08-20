import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from "h3";

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('ready', vi.fn())
})
afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
})

describe('fichiers de découverte publics', () => {
    it('génère robots.txt avec l’origine configurée et protège les zones privées', async () => {
        vi.stubGlobal('database', () => ({prepare: () => ({first: async () => ({value: 'https://shop.test/'})})}))
        vi.stubGlobal('useRuntimeConfig', () => ({public: {siteUrl: ''}}))
        vi.stubGlobal('getRequestURL', () => new URL('https://fallback.test/robots.txt'))
        const setHeader = vi.fn()
        vi.stubGlobal('setHeader', setHeader)
        // @ts-ignore
        const {default: handler} = await import('~/server/routes/robots.txt.get.ts')
        const output = await handler({} as H3Event<EventHandlerRequest>)
        expect(output).toContain('Disallow: /admin')
        expect(output).toContain('Disallow: /api/')
        expect(output).toContain('Sitemap: https://shop.test/sitemap.xml')
        expect(setHeader).toHaveBeenCalledWith({}, 'content-type', 'text/plain; charset=utf-8')
    })

    it('génère un sitemap échappé pour toutes les pages publiques', async () => {
        const db = {
            prepare: vi.fn((sql: string) => ({
                first: async () => sql.includes('seoCanonicalUrl') ? null : undefined,
                all: async () => sql.includes('FROM products') ? {results: [{slug: 'mug-vague'}]}
                    : sql.includes('FROM categories') ? {results: [{slug: 'maison&deco'}]}
                        : {results: [{id: 7, slug: ''}]}
            }))
        }
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('useRuntimeConfig', () => ({public: {siteUrl: 'https://shop.test/'}}))
        vi.stubGlobal('getRequestURL', () => new URL('https://fallback.test/sitemap.xml'))
        vi.stubGlobal('setHeader', vi.fn())
        // @ts-ignore
        const {default: handler} = await import('~/server/routes/sitemap.xml.get.ts')
        const output = await handler({} as H3Event<EventHandlerRequest>)
        expect(output).toContain('<loc>https://shop.test/</loc>')
        expect(output).toContain('/produits/mug-vague')
        expect(output).toContain('/categories/maison%26deco')
        expect(output).toContain('/univers/7')
        expect(output).not.toContain('maison&deco')
    })
})

describe('catalogue public', () => {
    it('retourne les catégories et univers actifs après mapping', async () => {
        vi.stubGlobal('database', () => ({prepare: () => ({all: async () => ({results: [{id: 1}]})})}))
        vi.stubGlobal('mapCategory', () => ({id: 1, label: 'Déco'}))
        // @ts-ignore
        let module = await import('~/server/api/categories.get.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toEqual([{id: 1, label: 'Déco'}])
        vi.resetModules()
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('universeSelect', 'UNIVERSES')
        vi.stubGlobal('mapUniverse', () => ({id: 1, title: 'Design'}))
        // @ts-ignore
        module = await import('~/server/api/universes.get.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toEqual([{id: 1, title: 'Design'}])
    })

    it('filtre les produits par catégorie et univers', async () => {
        const products = [
            {id: 1, categories: [{slug: 'deco'}], universeIds: [2]},
            {id: 2, categories: [{slug: 'vetements'}], universeIds: [3]}
        ]
        vi.stubGlobal('database', () => ({prepare: () => ({all: async () => ({results: [{id: 1}, {id: 2}]})})}))
        vi.stubGlobal('productSelect', 'PRODUCTS')
        vi.stubGlobal('mapProductsWithRelations', async () => products)
        vi.stubGlobal('getQuery', () => ({category: 'deco', universe: '2'}))
        // @ts-ignore
        const {default: handler} = await import('~/server/api/products/index.get.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual([products[0]])
    })

    it('retourne un produit par slug ou une erreur 404', async () => {
        let row: any = {id: 1}
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => row})})}))
        vi.stubGlobal('productSelect', 'PRODUCTS')
        vi.stubGlobal('getRouterParam', () => 'mug')
        vi.stubGlobal('mapProductsWithRelations', async () => [{id: 1, slug: 'mug'}])
        // @ts-ignore
        const {default: handler} = await import('~/server/api/products/[slug].get.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toMatchObject({slug: 'mug'})
        row = null
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 404})
    })

    it('hydrate les images du contenu et initialise les emplacements absents à null', async () => {
        let call = 0
        vi.stubGlobal('database', () => ({
            prepare: () => ({
                all: async () => ++call === 1
                    ? {results: [{key: 'seoTitle', value: 'Titre dynamique'}]}
                    : {results: [{key: 'heroImage', image_id: 4}]}
            })
        }))
        vi.stubGlobal('mapImage', () => ({id: 4, content: '/images/4'}))
        // @ts-ignore
        const {default: handler} = await import('~/server/api/content.get.ts')
        const output = await handler({} as H3Event<EventHandlerRequest>)
        expect(output.seoTitle).toBe('Titre dynamique')
        expect(output.heroImage).toEqual({id: 4, content: '/images/4'})
        expect(output.seoOgImage).toBeNull()
    })

    it('n’expose que l’autorisation administrateur minimale', async () => {
        vi.stubGlobal('sessionUser', async () => ({email: 'admin@example.test', role: 'admin'}))
        // @ts-ignore
        const {default: handler} = await import('~/server/api/admin/me.get.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({
            email: 'admin@example.test',
            role: 'admin',
            allowed: true,
            readOnly: false
        })
        vi.stubGlobal('sessionUser', async () => null)
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({
            email: '',
            role: '',
            allowed: false,
            readOnly: false
        })
    })
})
