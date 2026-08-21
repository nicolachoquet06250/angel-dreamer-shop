import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    applyDiscountsToLine,
    applyPromoToLine,
    type CartLineWithMeta,
    type Discount,
    type PromoCode
} from '#server/utils/discounts'

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

const line: CartLineWithMeta = {
    id: 1,
    name: 'Mug',
    price: 1490,
    quantity: 1,
    categoryIds: [2, 3],
    universeIds: [10]
}

describe('applyDiscountsToLine — réductions automatiques', () => {
    it('retourne le prix original si aucune réduction ne s\'applique', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Test', type: 'percent', value: 20, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 99}] // autre produit
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(1490)
    })

    it('applique une réduction en % sur un produit ciblé', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Promo', type: 'percent', value: 10, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 1}]
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(1341) // 1490 * 0.9
    })

    it('applique une réduction fixe en centimes', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Promo', type: 'fixed', value: 200, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 1}]
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(1290)
    })

    it('applique une réduction via catégorie si pas de règle produit', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Cat', type: 'percent', value: 20, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'category', targetId: 2}]
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(1192) // 1490 * 0.8
    })

    it('applique une réduction via univers si pas de règle produit/catégorie', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Uni', type: 'percent', value: 5, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'universe', targetId: 10}]
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(1416) // round(1490 * 0.95)
    })

    it('prend la réduction la plus avantageuse parmi plusieurs réductions actives', () => {
        const discounts: Discount[] = [
            {
                id: 1,
                label: 'Uni',
                type: 'percent',
                value: 5,
                active: true,
                startsAt: null,
                endsAt: null,
                rules: [{scope: 'universe', targetId: 10}]
            },
            {
                id: 2,
                label: 'Cat',
                type: 'percent',
                value: 20,
                active: true,
                startsAt: null,
                endsAt: null,
                rules: [{scope: 'category', targetId: 2}]
            },
            {
                id: 3,
                label: 'Prod',
                type: 'percent',
                value: 10,
                active: true,
                startsAt: null,
                endsAt: null,
                rules: [{scope: 'product', targetId: 1}]
            }
        ]
        // Catégorie (20%) → 1192, Produit (10%) → 1341, Univers (5%) → 1416
        // On prend la plus avantageuse pour le client = 1192
        expect(applyDiscountsToLine(line, discounts)).toBe(1192)
    })

    it('ne descend pas en dessous de 0', () => {
        const discounts: Discount[] = [{
            id: 1, label: 'Gratuit', type: 'fixed', value: 9999, active: true,
            startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 1}]
        }]
        expect(applyDiscountsToLine(line, discounts)).toBe(0)
    })

    it('retourne le prix original si la liste de réductions est vide', () => {
        expect(applyDiscountsToLine(line, [])).toBe(1490)
    })
})

describe('applyPromoToLine — codes promo', () => {
    it('retourne null si aucune règle ne s\'applique', () => {
        const promo: PromoCode = {
            id: 1, code: 'TEST', active: true, startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 99, type: 'percent', value: 10}]
        }
        expect(applyPromoToLine(line, promo)).toBeNull()
    })

    it('applique une règle "all" à tout produit', () => {
        const promo: PromoCode = {
            id: 1, code: 'ALL10', active: true, startsAt: null, endsAt: null,
            rules: [{scope: 'all', targetId: null, type: 'percent', value: 10}]
        }
        expect(applyPromoToLine(line, promo)).toBe(1341)
    })

    it('applique une règle produit spécifique', () => {
        const promo: PromoCode = {
            id: 1, code: 'PROD', active: true, startsAt: null, endsAt: null,
            rules: [{scope: 'product', targetId: 1, type: 'fixed', value: 300}]
        }
        expect(applyPromoToLine(line, promo)).toBe(1190)
    })

    it('applique une règle catégorie', () => {
        const promo: PromoCode = {
            id: 1, code: 'CAT', active: true, startsAt: null, endsAt: null,
            rules: [{scope: 'category', targetId: 3, type: 'percent', value: 15}]
        }
        expect(applyPromoToLine(line, promo)).toBe(1267) // round(1490 * 0.85)
    })

    it('respecte la spécificité produit > catégorie dans un code promo', () => {
        const promo: PromoCode = {
            id: 1, code: 'MULTI', active: true, startsAt: null, endsAt: null,
            rules: [
                {scope: 'category', targetId: 2, type: 'percent', value: 20},
                {scope: 'product', targetId: 1, type: 'percent', value: 5}
            ]
        }
        // La règle produit est plus spécifique → 5%
        expect(applyPromoToLine(line, promo)).toBe(1416)
    })

    it('une règle "all" est moins prioritaire qu\'une règle produit', () => {
        const promo: PromoCode = {
            id: 1, code: 'COMBO', active: true, startsAt: null, endsAt: null,
            rules: [
                {scope: 'all', targetId: null, type: 'percent', value: 50},
                {scope: 'product', targetId: 1, type: 'percent', value: 10}
            ]
        }
        // Règle produit prime → 10%
        expect(applyPromoToLine(line, promo)).toBe(1341)
    })
})
