import {describe, expect, it} from 'vitest'
import {defaultSiteContent, type Product} from '~/types/shop'
import {
    hasValidationErrors,
    validateCategoryPage,
    validateHomeContent,
    validateProduct,
    validateSeo,
    validateUniversePage
} from '~/utils/admin-validation'

describe('validation des formulaires administrateur', () => {
    it('bloque une page d’accueil invalide et conserve les conseils non bloquants', () => {
        const content = {
            ...defaultSiteContent,
            announcement: '',
            logoText: '',
            heroTitle: '',
            heroSubtitle: '',
            heroCta: '',
            heroImage: null
        }
        const issues = validateHomeContent(content, [
            {id: 1, label: '', slug: 'Mauvais slug', position: 0, active: true},
            {id: 2, label: 'Doublon', slug: 'Mauvais slug', position: 1, active: true},
        ], [
            {id: 1, title: '', slug: 'Mauvais', image: null, position: 0, active: true},
            {id: 2, title: 'Deux', slug: 'double', image: null, position: 1, active: true},
            {id: 3, title: 'Trois', slug: 'double', image: null, position: 2, active: true},
        ], [1, 2, 3, 4, 5])
        expect(hasValidationErrors(issues)).toBe(true)
        expect(issues.some(item => item.level === 'warning')).toBe(true)
        expect(issues.some(item => item.level === 'info')).toBe(true)
        expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({
            field: 'categories.1.slug',
            level: 'error'
        }), expect.objectContaining({field: 'universes.2.slug', level: 'error'})]))
    })

    it('accepte une page d’accueil complète et signale les sélections facultatives', () => {
        const content = {
            ...defaultSiteContent,
            heroTitle: 'Des objets originaux qui vous ressemblent vraiment',
            heroImage: {id: 1} as any
        }
        const categories = [{id: 1, label: 'Nouveautés', slug: 'nouveautes', position: 0, active: true}]
        const universes = [{id: 1, title: 'Design', slug: '', image: {id: 1} as any, position: 0, active: true}]
        const issues = validateHomeContent(content, categories, universes, [])
        expect(hasValidationErrors(issues)).toBe(false)
        expect(issues).toContainEqual(expect.objectContaining({field: 'favoriteIds', level: 'info'}))
    })

    it('valide les contenus génériques des pages catégorie et univers', () => {
        const invalid = {
            ...defaultSiteContent,
            categoryEyebrow: '',
            categoryDescription: '',
            categoryEmptyText: '',
            universeEyebrow: '',
            universeAllLabel: '',
            universeEmptyText: ''
        }
        expect(hasValidationErrors(validateCategoryPage(invalid))).toBe(true)
        expect(hasValidationErrors(validateUniversePage(invalid))).toBe(true)
        const short = validateCategoryPage({...defaultSiteContent, categoryDescription: 'Trop court'})
        expect(short).toContainEqual(expect.objectContaining({level: 'info'}))
        expect(hasValidationErrors(validateCategoryPage(defaultSiteContent))).toBe(false)
        expect(hasValidationErrors(validateUniversePage(defaultSiteContent))).toBe(false)
    })

    it('contrôle les longueurs SEO et les URL canoniques', () => {
        const invalid = validateSeo({
            ...defaultSiteContent,
            seoTitle: '',
            seoDescription: '',
            seoCanonicalUrl: 'pas une url',
            seoOgImage: null
        })
        expect(hasValidationErrors(invalid)).toBe(true)
        expect(invalid).toEqual(expect.arrayContaining([expect.objectContaining({
            field: 'seoCanonicalUrl',
            level: 'error'
        }), expect.objectContaining({field: 'seoOgImage', level: 'warning'})]))
        const long = validateSeo({
            ...defaultSiteContent,
            seoTitle: 'x'.repeat(61),
            seoDescription: 'x'.repeat(161),
            seoCanonicalUrl: ''
        })
        expect(long).toEqual(expect.arrayContaining([expect.objectContaining({
            field: 'seoTitle',
            level: 'warning'
        }), expect.objectContaining({
            field: 'seoDescription',
            level: 'error'
        }), expect.objectContaining({field: 'seoCanonicalUrl', level: 'info'})]))
        const short = validateSeo({
            ...defaultSiteContent,
            seoTitle: 'Court',
            seoDescription: 'Courte',
            seoCanonicalUrl: 'https://example.com'
        })
        expect(short.filter(item => item.level === 'warning').length).toBeGreaterThanOrEqual(2)
    })

    it('empêche l’enregistrement d’un produit incomplet', () => {
        const product: Product = {
            id: 0,
            name: '',
            slug: 'Slug invalide',
            description: '',
            priceCents: 0,
            image: null,
            categories: [],
            universes: [],
            categoryIds: [],
            universeIds: [],
            featured: false,
            featuredPosition: null,
            active: false
        }
        const issues = validateProduct(product)
        expect(hasValidationErrors(issues)).toBe(true)
        expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({
            field: 'product.image',
            level: 'warning'
        }), expect.objectContaining({field: 'product.active', level: 'info'})]))
    })

    it('autorise un produit valide tout en conseillant une description plus riche', () => {
        const product: Product = {
            id: 1,
            name: 'T-shirt',
            slug: 't-shirt',
            description: 'Description courte',
            priceCents: 2990,
            image: {id: 1} as any,
            categories: [],
            universes: [],
            categoryIds: [1],
            universeIds: [1],
            featured: false,
            featuredPosition: null,
            active: true
        }
        const issues = validateProduct(product)
        expect(hasValidationErrors(issues)).toBe(false)
        expect(issues).toContainEqual(expect.objectContaining({field: 'product.description', level: 'warning'}))
    })
})
