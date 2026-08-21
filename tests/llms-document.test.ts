import {afterEach, describe, expect, it, vi} from 'vitest'
import {buildLlmsDocument, formatLlmsDocument} from '#server/utils/llms-document'

afterEach(() => vi.unstubAllGlobals())

describe('document public pour les assistants IA', () => {
    it('publie les contenus dynamiques et uniquement les croisements disponibles', () => {
        const category = {id: 2, label: 'Maison & déco', slug: 'maison-deco', position: 0, active: true}
        const universe = {id: 3, title: 'Art japonais', slug: 'art-japonais', image: null, position: 0, active: true}
        const document = formatLlmsDocument({
            origin: 'https://example.test',
            content: {seoSiteName: 'Angel Dreamer', seoDescription: 'Objets physiques originaux.', seoLanguage: 'fr'},
            categories: [category],
            universes: [universe],
            products: [{
                id: 1, slug: 'mug-vague', name: 'Mug Vague', description: 'Mug imprimé en France.', priceCents: 1490,
                image: null, categories: [category], universes: [universe], categoryIds: [2], universeIds: [3],
                featured: true, featuredPosition: 0, active: true
            }]
        })

        expect(document).toContain('# Angel Dreamer')
        expect(document).toContain('[Art japonais — Maison & déco](https://example.test/univers/art-japonais/maison-deco)')
        expect(document).toContain('[Mug Vague](https://example.test/produits/mug-vague)')
        expect(document).toContain('Prix : 14,90 €')
        expect(document).not.toContain('/admin')
    })

    it('produit un document minimal cohérent lorsque le catalogue et les réglages sont vides', () => {
        const document = formatLlmsDocument({
            origin: 'https://example.test', content: {}, categories: [], universes: [], products: []
        })

        expect(document).toContain('# Boutique en ligne')
        expect(document).toContain('> Boutique en ligne de produits physiques.')
        expect(document).toContain('Langue principale : fr.')
        expect(document).toContain('[Accueil](https://example.test/)')
        expect(document).not.toContain('## Catégories')
        expect(document).not.toContain('## Univers')
        expect(document).not.toContain('## Produits')
        expect(document).not.toContain('## Contact')
        expect(document.endsWith('\n')).toBe(true)
    })

    it('nettoie les textes, encode les slugs et utilise l’identifiant d’un univers sans slug', () => {
        const category = {id: 4, label: '[Objets]\n  rares', slug: 'objets rares', position: 0, active: true}
        const universe = {id: 7, title: 'Sans [slug]', slug: '', image: null, position: 0, active: true}
        const document = formatLlmsDocument({
            origin: 'https://example.test',
            content: {seoOrganizationName: '[Atelier]\nFrance', seoOrganizationEmail: 'bonjour@example.test'},
            categories: [category], universes: [universe],
            products: [{
                id: 9, slug: 'mug/vague', name: '[Mug]\nVague', description: '', priceCents: 5,
                image: null, categories: [], universes: [], categoryIds: [], universeIds: [],
                featured: false, featuredPosition: null, active: true
            }]
        })

        expect(document).toContain('# Atelier France')
        expect(document).toContain('[Objets rares](https://example.test/categories/objets%20rares)')
        expect(document).toContain('[Sans slug](https://example.test/univers/7)')
        expect(document).toContain('[Mug Vague](https://example.test/produits/mug%2Fvague): Prix : 0,05 €')
        expect(document).toContain('## Contact\n\n- Email : bonjour@example.test')
    })

    it('ne publie pas de fausse combinaison univers/catégorie', () => {
        const used = {id: 1, label: 'Utilisée', slug: 'utilisee', position: 0, active: true}
        const unused = {id: 2, label: 'Inutilisée', slug: 'inutilisee', position: 1, active: true}
        const universe = {id: 1, title: 'Design', slug: 'design', image: null, position: 0, active: true}
        const product = {
            id: 1, slug: 'affiche', name: 'Affiche', description: '', priceCents: 1000, image: null,
            categories: [used], universes: [universe], categoryIds: [used.id], universeIds: [universe.id],
            featured: false, featuredPosition: null, active: true
        }
        const document = formatLlmsDocument({
            origin: 'https://example.test',
            content: {},
            products: [product],
            categories: [used, unused],
            universes: [universe]
        })

        expect(document).toContain('/univers/design/utilisee')
        expect(document).not.toContain('/univers/design/inutilisee')
    })

    it('construit le document à partir des données publiques de la base', async () => {
        const categoryRow = {id: 1, label: 'Déco', slug: 'deco', position: 0, active: 1}
        const universeRow = {id: 2, title: 'Design', slug: 'design', position: 0, active: 1}
        const product = {
            id: 3, slug: 'cadre', name: 'Cadre', description: 'Cadre physique.', priceCents: 2500,
            image: null, categories: [], universes: [], categoryIds: [], universeIds: [],
            featured: false, featuredPosition: null, active: true
        }
        const db = {
            prepare: vi.fn((sql: string) => ({
                all: vi.fn(async () => {
                    if (sql.includes('site_content')) return {
                        results: [
                            {key: 'seoSiteName', value: 'Boutique dynamique'},
                            {key: 'seoCanonicalUrl', value: 'https://canonical.test/'}
                        ]
                    }
                    if (sql.includes('PRODUCT_SELECT')) return {results: [{id: 3}]}
                    if (sql.includes('FROM categories')) return {results: [categoryRow]}
                    return {results: [universeRow]}
                })
            }))
        }
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('ready', vi.fn())
        vi.stubGlobal('productSelect', 'PRODUCT_SELECT')
        vi.stubGlobal('universeSelect', 'UNIVERSE_SELECT')
        vi.stubGlobal('mapProductsWithRelations', vi.fn(async () => [product]))
        vi.stubGlobal('mapCategory', (row: typeof categoryRow) => ({...row, active: true}))
        vi.stubGlobal('mapUniverse', (row: typeof universeRow) => ({...row, image: null, active: true}))
        vi.stubGlobal('useRuntimeConfig', () => ({public: {siteUrl: 'https://runtime.test'}}))
        vi.stubGlobal('getRequestURL', () => new URL('https://request.test/llms.txt'))

        const document = await buildLlmsDocument({})

        expect(document).toContain('# Boutique dynamique')
        expect(document).toContain('https://canonical.test/produits/cadre')
        expect(db.prepare).toHaveBeenCalledTimes(4)
    })
})
