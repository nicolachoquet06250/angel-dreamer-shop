import {afterEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from "h3";

afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
})

const routes = [
    // @ts-ignore
    {name: 'llms.txt', load: () => import('~/server/routes/llms.txt.get.ts')}
]

describe.each(routes)('route $name', ({name, load}) => {
    it('renvoie le document dynamique en texte brut sans cache périmé', async () => {
        const setHeader = vi.fn()
        const buildLlmsDocument = vi.fn(async () => '# Catalogue dynamique\n')
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('setHeader', setHeader)
        vi.stubGlobal('buildLlmsDocument', buildLlmsDocument)
        const module = await load()
        const event = {path: `/${name}`} as H3Event<EventHandlerRequest>

        await expect(module.default(event)).resolves.toBe('# Catalogue dynamique\n')
        expect(setHeader).toHaveBeenCalledWith(event, 'content-type', 'text/plain; charset=utf-8')
        expect(setHeader).toHaveBeenCalledWith(event, 'cache-control', 'public, max-age=0, must-revalidate')
        expect(buildLlmsDocument).toHaveBeenCalledWith(event)
    })
})
