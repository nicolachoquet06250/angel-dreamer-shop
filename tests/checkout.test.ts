import {afterEach, describe, expect, it, vi} from 'vitest'
import {checkoutLines, paypalToken} from '#server/utils/checkout'

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

function fakeDb(rows: Record<number, { id: number; name: string; price_cents: number } | undefined>) {
    return {
        prepare: vi.fn((sql: string) => ({
            bind: (...args: any[]) => ({
                first: async () => rows[args[0]],
                all: async () => ({results: []})
            }),
            all: async () => ({results: []})
        }))
    }
}

function stubDiscounts() {
    vi.stubGlobal('applyDiscountsToCheckout', async (_event: any, lines: any[]) => ({
        lines: lines.map(l => ({...l, originalPrice: l.price})),
        promoApplied: false
    }))
}

describe('validation serveur du panier', () => {
    it('relit les prix en base, ignore les produits absents et borne les quantités', async () => {
        const db = fakeDb({1: {id: 1, name: 'Mug', price_cents: 1490}, 2: {id: 2, name: 'T-shirt', price_cents: 2990}})
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('ready', vi.fn())
        stubDiscounts()

        const result = await checkoutLines({} as any, [
            {id: 1, quantity: 0}, {id: 2, quantity: 99}, {id: 999, quantity: 3}
        ])
        expect(result.lines).toEqual([
            {id: 1, name: 'Mug', price: 1490, quantity: 1, originalPrice: 1490},
            {id: 2, name: 'T-shirt', price: 2990, quantity: 10, originalPrice: 2990}
        ])
        expect(result.promoApplied).toBe(false)
    })

    it('limite le panier à vingt lignes et normalise une quantité non numérique', async () => {
        const db = fakeDb(Object.fromEntries(Array.from({length: 25}, (_, index) => [index + 1, {
            id: index + 1,
            name: `P${index}`,
            price_cents: 100
        }])))
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('ready', vi.fn())
        stubDiscounts()
        const result = await checkoutLines({} as any, Array.from({length: 25}, (_, index) => ({
            id: index + 1,
            quantity: Number.NaN
        })))
        expect(result.lines).toHaveLength(20)
        expect(result.lines.every((line: any) => line.quantity === 1)).toBe(true)
    })

    it('refuse un panier ne contenant aucun produit actif', async () => {
        vi.stubGlobal('database', () => fakeDb({}))
        vi.stubGlobal('ready', vi.fn())
        vi.stubGlobal('createError', (value: unknown) => value)
        stubDiscounts()
        await expect(checkoutLines({} as any, [{id: 5, quantity: 1}])).rejects.toMatchObject({statusCode: 400})
    })
})

describe('authentification PayPal', () => {
    it('demande un jeton avec une authentification Basic', async () => {
        const fetchMock = vi.fn(async () => ({ok: true, json: async () => ({access_token: 'token-paypal'})}))
        vi.stubGlobal('fetch', fetchMock)
        await expect(paypalToken('client', 'secret')).resolves.toBe('token-paypal')
        expect(fetchMock).toHaveBeenCalledWith('https://api-m.paypal.com/v1/oauth2/token', expect.objectContaining({
            method: 'POST', headers: expect.objectContaining({Authorization: `Basic ${btoa('client:secret')}`})
        }))
    })

    it('transforme une indisponibilité PayPal en erreur de passerelle', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => ({ok: false})))
        vi.stubGlobal('createError', (value: unknown) => value)
        await expect(paypalToken('client', 'secret')).rejects.toMatchObject({statusCode: 502})
    })
})
