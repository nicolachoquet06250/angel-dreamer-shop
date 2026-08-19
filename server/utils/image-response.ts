import type {H3Event} from 'h3'
import sharp from 'sharp'

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const sizePattern = /^(\d{1,4})(?:x(\d{1,4}))?$/
const maxDimension = 4096
const maxPixels = 16_777_216

function requestedSize(event: H3Event) {
    const value = getQuery(event).size
    if (value === undefined || value === '') return null
    if (typeof value !== 'string') throw createError({statusCode: 400, statusMessage: 'Paramètre size invalide'})

    const match = sizePattern.exec(value)
    const width = Number(match?.[1])
    const height = match?.[2] ? Number(match[2]) : undefined
    if (!match || width < 1 || width > maxDimension || (height !== undefined && (height < 1 || height > maxDimension || width * height > maxPixels))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Utilisez size=largeur ou size=largeurxhauteur, avec une dimension maximale de 4096 px'
        })
    }
    return {width, height}
}

export async function imageResponse(event: H3Event) {
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Image invalide'})

    const db = database(event)
    await ready(db)
    const image = await db.prepare('SELECT content,mime_type FROM images WHERE id=?').bind(id).first<{
        content: string;
        mime_type: string
    }>()
    if (!image) throw createError({statusCode: 404, statusMessage: 'Image introuvable'})

    const match = /^data:([^;,]+);base64,([a-zA-Z0-9+/=\r\n]+)$/.exec(image.content)
    const mimeType = allowedMimeTypes.has(image.mime_type) ? image.mime_type : match?.[1]
    if (!match || !mimeType || !allowedMimeTypes.has(mimeType)) throw createError({
        statusCode: 415,
        statusMessage: 'Format d’image non pris en charge'
    })

    const size = requestedSize(event)
    const original = Buffer.from(match[2]!, 'base64')
    const output = size
        ? await sharp(original, {animated: mimeType === 'image/gif', limitInputPixels: 40_000_000})
            .resize({
                width: size.width,
                height: size.height,
                fit: size.height ? 'fill' : 'inside',
                withoutEnlargement: false
            })
            .toBuffer()
        : original

    setHeader(event, 'content-type', mimeType)
    setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
    setHeader(event, 'x-content-type-options', 'nosniff')
    return output
}
