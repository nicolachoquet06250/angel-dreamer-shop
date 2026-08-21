import {describe, expect, it} from 'vitest'
import {
    adminPagePath,
    adminPageTabs,
    adminSeoPath,
    adminSeoTabs,
    resolveAdminRoute
} from '~/utils/admin-routing'

describe('routage de l’administration', () => {
    it.each([
        ['content', 'accueil'],
        ['category', 'categorie'],
        ['universe', 'univers'],
        ['cart', 'panier'],
        ['profile', 'profil'],
        ['contact', 'contact'],
        ['cgu', 'cgu'],
        ['cgv', 'cgv']
    ] as const)('associe la page %s à sa route', (id, slug) => {
        expect(adminPagePath(id)).toBe(`/admin/pages/${slug}`)
        expect(resolveAdminRoute(['pages', slug])).toMatchObject({
            mainTab: 'pages',
            activeTab: id,
            pageTab: id,
            canonicalPath: `/admin/pages/${slug}`
        })
    })

    it.each([
        ['home', 'accueil'],
        ['product', 'produits'],
        ['universe', 'univers'],
        ['universeCategory', 'categories-univers'],
        ['category', 'categories']
    ] as const)('associe la section SEO %s à sa route', (id, slug) => {
        expect(adminSeoPath(id)).toBe(`/admin/seo/${slug}`)
        expect(resolveAdminRoute(['seo', slug])).toMatchObject({
            mainTab: 'seo',
            activeTab: 'seo',
            seoSection: id,
            canonicalPath: `/admin/seo/${slug}`
        })
    })

    it('conserve les sections principales qui ne contiennent pas de sous-onglets', () => {
        expect(resolveAdminRoute('products')).toMatchObject({mainTab: 'products', activeTab: 'products', canonicalPath: '/admin/products'})
        expect(resolveAdminRoute(['promotions'])).toMatchObject({mainTab: 'promotions', activeTab: 'promotions', canonicalPath: '/admin/promotions'})
        expect(resolveAdminRoute('users')).toMatchObject({mainTab: 'users', activeTab: 'users', canonicalPath: '/admin/users'})
    })

    it.each([
        [undefined, undefined, '/admin/pages/accueil'],
        ['content', undefined, '/admin/pages/accueil'],
        ['category', undefined, '/admin/pages/categorie'],
        ['universe', undefined, '/admin/pages/univers'],
        ['cart', undefined, '/admin/pages/panier'],
        ['profile', undefined, '/admin/pages/profil'],
        ['contact', undefined, '/admin/pages/contact'],
        ['cgu', undefined, '/admin/pages/cgu'],
        ['cgv', undefined, '/admin/pages/cgv'],
        ['seo', undefined, '/admin/seo/accueil'],
        [undefined, 'category', '/admin/pages/categorie']
    ] as const)('canonicalise une ancienne adresse vers %s', (routeParam, queryTab, canonicalPath) => {
        expect(resolveAdminRoute(routeParam, queryTab).canonicalPath).toBe(canonicalPath)
    })

    it.each([
        ['unknown'],
        [['pages', 'inconnue']],
        [['seo', 'inconnue']],
        [['pages', 'accueil', 'extra']],
        [42]
    ])('retombe sur la page d’accueil pour un chemin invalide', routeParam => {
        expect(resolveAdminRoute(routeParam)).toMatchObject({
            mainTab: 'pages',
            activeTab: 'content',
            canonicalPath: '/admin/pages/accueil'
        })
    })

    it('déclare des routes uniques pour tous les sous-onglets', () => {
        const paths = [
            ...adminPageTabs.map(tab => adminPagePath(tab.id)),
            ...adminSeoTabs.map(tab => adminSeoPath(tab.id))
        ]

        expect(new Set(paths).size).toBe(adminPageTabs.length + adminSeoTabs.length)
    })
})