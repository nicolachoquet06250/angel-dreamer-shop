import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from "h3";

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
})
afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
})

describe('protection des requêtes intersites', () => {
    it.each(['GET', 'HEAD', 'OPTIONS'])('autorise la méthode sûre %s', async method => {
        vi.stubGlobal('getRequestURL', () => new URL('https://example.test/api/content'))
        vi.stubGlobal('getHeader', () => 'cross-site')
        const {default: middleware} = await import('#server/middleware/security')
        expect(() => middleware({method} as H3Event<EventHandlerRequest>)).not.toThrow()
    })

    it('refuse une mutation provenant d’un autre site', async () => {
        vi.stubGlobal('getRequestURL', () => new URL('https://example.test/api/admin/content'))
        vi.stubGlobal('getHeader', () => 'cross-site')
        const {default: middleware} = await import('#server/middleware/security')
        expect(() => middleware({method: 'POST'} as H3Event<EventHandlerRequest>)).toThrow(expect.objectContaining({statusCode: 403}))
    })

    it('autorise une mutation interne et le webhook Stripe', async () => {
        vi.stubGlobal('getHeader', () => 'same-origin')
        vi.stubGlobal('getRequestURL', () => new URL('https://example.test/api/admin/content'))
        let module = await import('#server/middleware/security')
        expect(() => module.default({method: 'PUT'} as H3Event<EventHandlerRequest>)).not.toThrow()
        vi.resetModules()
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('getHeader', () => 'cross-site')
        vi.stubGlobal('getRequestURL', () => new URL('https://example.test/api/webhooks/stripe'))
        module = await import('#server/middleware/security')
        expect(() => module.default({method: 'POST'} as H3Event<EventHandlerRequest>)).not.toThrow()
    })
})
