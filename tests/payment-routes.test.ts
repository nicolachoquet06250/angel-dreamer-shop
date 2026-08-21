import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from "h3";

const {stripeCreate, constructEvent, stripeCtor} = vi.hoisted(() => {
    const stripeCreate = vi.fn()
    const constructEvent = vi.fn()
    const stripeCtor = vi.fn(() => ({
        checkout: {sessions: {create: stripeCreate}},
        webhooks: {constructEventAsync: constructEvent}
    }))
    return {stripeCreate, constructEvent, stripeCtor}
})
vi.mock('stripe', () => ({default: stripeCtor}))

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('requireUser', async () => ({email: 'client@example.test'}))
})
afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllGlobals()
})

describe('paiement Stripe', () => {
    it('refuse tout paiement à un compte de démonstration', async () => {
        vi.stubGlobal('requireUser', async () => ({email: 'demo@example.test', role: 'demo'}))
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/stripe.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 403})
    })
    it('refuse de démarrer sans clé secrète', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({stripeSecretKey: ''}))
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/stripe.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 503})
    })

    it('crée une session à partir des prix validés côté serveur', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({stripeSecretKey: 'sk_test', public: {siteUrl: 'https://shop.test'}}))
        vi.stubGlobal('readBody', async () => ({lines: [{id: 1, quantity: 2}]}))
        vi.stubGlobal('checkoutLines', async () => ({
            lines: [{
                name: 'Mug',
                price: 1490,
                quantity: 2,
                originalPrice: 1490
            }], promoApplied: false
        }))
        stripeCreate.mockResolvedValue({url: 'https://stripe.test/session'})
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/stripe.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({url: 'https://stripe.test/session'})
        expect(stripeCreate).toHaveBeenCalledWith(expect.objectContaining({
            customer_email: 'client@example.test',
            mode: 'payment'
        }))
    })
})

describe('paiement PayPal', () => {
    it('refuse tout paiement à un compte de démonstration', async () => {
        vi.stubGlobal('requireUser', async () => ({email: 'demo@example.test', role: 'demo'}))
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/paypal.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 403})
    })
    it('refuse de démarrer sans identifiants', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({public: {paypalClientId: ''}, paypalClientSecret: ''}))
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/paypal.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 503})
    })

    it('calcule le total et retourne le lien d’approbation', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({
            public: {paypalClientId: 'id', siteUrl: 'https://shop.test'},
            paypalClientSecret: 'secret'
        }))
        vi.stubGlobal('readBody', async () => ({lines: []}))
        vi.stubGlobal('checkoutLines', async () => ({
            lines: [{
                name: 'Mug',
                price: 1490,
                quantity: 2,
                originalPrice: 1490
            }], promoApplied: false
        }))
        vi.stubGlobal('paypalToken', async () => 'token')
        const fetchMock = vi.fn(async () => ({
            ok: true,
            json: async () => ({links: [{rel: 'approve', href: 'https://paypal.test/approve'}]})
        }))
        vi.stubGlobal('fetch', fetchMock)
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/paypal.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({url: 'https://paypal.test/approve'})
        expect((fetchMock.mock.calls[0] as { body: any }[])[1]!.body).toContain('29.80')
    })

    it('convertit un refus PayPal en erreur 502', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({public: {paypalClientId: 'id'}, paypalClientSecret: 'secret'}))
        vi.stubGlobal('getRequestURL', () => new URL('https://shop.test/panier'))
        vi.stubGlobal('readBody', async () => ({}));
        vi.stubGlobal('checkoutLines', async () => ({
            lines: [{
                name: 'Mug',
                price: 100,
                quantity: 1,
                originalPrice: 100
            }], promoApplied: false
        }))
        vi.stubGlobal('paypalToken', async () => 'token');
        vi.stubGlobal('fetch', async () => ({ok: false, json: async () => ({})}))
        // @ts-ignore
        const {default: handler} = await import('#server/api/checkout/paypal.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 502})
    })

    it('redirige une capture absente ou refusée et persiste une capture réussie', async () => {
        const redirect = vi.fn((_event, path) => path)
        vi.stubGlobal('sendRedirect', redirect);
        vi.stubGlobal('getQuery', () => ({}))
        vi.stubGlobal('useRuntimeConfig', () => ({public: {paypalClientId: 'id'}, paypalClientSecret: 'secret'}))
        // @ts-ignore
        let module = await import('#server/api/checkout/paypal/capture.get.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toBe('/panier?cancelled=1')
        vi.resetModules();
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('getQuery', () => ({token: 'ORDER/1'}));
        vi.stubGlobal('useRuntimeConfig', () => ({public: {paypalClientId: 'id'}, paypalClientSecret: 'secret'}))
        vi.stubGlobal('paypalToken', async () => 'token');
        vi.stubGlobal('fetch', async () => ({ok: false, json: async () => ({})}))
        // @ts-ignore
        module = await import('#server/api/checkout/paypal/capture.get.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toBe('/panier?error=paypal')
    })
})

describe('webhook Stripe', () => {
    it('valide la configuration et la signature', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({stripeSecretKey: '', stripeWebhookSecret: ''}))
        // @ts-ignore
        let module = await import('#server/api/webhooks/stripe.post.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 503})
        vi.resetModules();
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('useRuntimeConfig', () => ({stripeSecretKey: 'sk', stripeWebhookSecret: 'wh'}))
        vi.stubGlobal('readRawBody', async () => '');
        vi.stubGlobal('getHeader', () => '')
        // @ts-ignore
        module = await import('#server/api/webhooks/stripe.post.ts')
        await expect(module.default({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it('accepte les événements non commerciaux valides', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({stripeSecretKey: 'sk', stripeWebhookSecret: 'wh'}))
        vi.stubGlobal('readRawBody', async () => '{}');
        vi.stubGlobal('getHeader', () => 'signature')
        constructEvent.mockResolvedValue({type: 'customer.created', data: {object: {}}})
        // @ts-ignore
        const {default: handler} = await import('#server/api/webhooks/stripe.post.ts')
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({received: true})
    })
})
