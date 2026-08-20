import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {imageResponse} from '~/server/utils/image-response'

const {sharpMock} = vi.hoisted(() => ({sharpMock: vi.fn()}))
vi.mock('sharp', () => ({default: sharpMock}))

const png = {content: `data:image/png;base64,${btoa('image-binaire')}`, mime_type: 'image/png'}

beforeEach(() => {
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('ready', vi.fn())
    vi.stubGlobal('setHeader', vi.fn())
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

function setup({id = '1', size, image = png}: { id?: string; size?: unknown; image?: any } = {}) {
    vi.stubGlobal('getRouterParam', () => id)
    vi.stubGlobal('getQuery', () => size === undefined ? {} : {size})
    vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => image})})}))
    return {} as any
}

describe('réponse d’image', () => {
    it.each(['0', '-1', 'abc', '1.5'])('refuse l’identifiant invalide %s', async id => {
        await expect(imageResponse(setup({id}))).rejects.toMatchObject({statusCode: 400})
    })

    it('renvoie 404 lorsque l’image n’existe pas', async () => {
        await expect(imageResponse(setup({image: null}))).rejects.toMatchObject({statusCode: 404})
    })

    it.each([['tableau', ['100']], ['texte', 'abc'], ['zéro', '0'], ['largeur trop grande', '4097'], ['hauteur trop grande', '100x4097']])(
        'refuse une taille invalide : %s', async (_label, size) => {
            await expect(imageResponse(setup({size}))).rejects.toMatchObject({statusCode: 400})
        })

    it('refuse les données et types MIME non pris en charge', async () => {
        await expect(imageResponse(setup({image: {content: 'texte', mime_type: 'text/plain'}})))
            .rejects.toMatchObject({statusCode: 415})
    })

    it('renvoie l’original avec les en-têtes de sécurité et de cache', async () => {
        const event = setup()
        const result = await imageResponse(event)
        expect(Buffer.isBuffer(result)).toBe(true)
        expect(sharpMock).not.toHaveBeenCalled()
        expect(setHeader).toHaveBeenCalledWith(event, 'content-type', 'image/png')
        expect(setHeader).toHaveBeenCalledWith(event, 'cache-control', 'public, max-age=31536000, immutable')
        expect(setHeader).toHaveBeenCalledWith(event, 'x-content-type-options', 'nosniff')
    })

    it.each([
        ['300', {width: 300, height: undefined, fit: 'inside', withoutEnlargement: false}],
        ['300x200', {width: 300, height: 200, fit: 'fill', withoutEnlargement: false}]
    ])('redimensionne à la volée avec size=%s', async (size, expected) => {
        const toBuffer = vi.fn(async () => Buffer.from('redimensionnee'))
        const resize = vi.fn(() => ({toBuffer}))
        sharpMock.mockReturnValue({resize})
        await expect(imageResponse(setup({size}))).resolves.toEqual(Buffer.from('redimensionnee'))
        expect(resize).toHaveBeenCalledWith(expected)
    })

    it('active le traitement animé pour un GIF', async () => {
        const toBuffer = vi.fn(async () => Buffer.from('gif'))
        sharpMock.mockReturnValue({resize: () => ({toBuffer})})
        const image = {content: `data:image/gif;base64,${btoa('gif')}`, mime_type: 'image/gif'}
        await imageResponse(setup({size: '100', image}))
        expect(sharpMock).toHaveBeenCalledWith(expect.any(Buffer), {animated: true, limitInputPixels: 40_000_000})
    })
})
