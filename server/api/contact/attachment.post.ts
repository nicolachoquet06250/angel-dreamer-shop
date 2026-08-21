import {database, ready} from '~/server/utils/db'

const ALLOWED_MIMETYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
const MAX_SIZE = 5 * 1024 * 1024

export default defineEventHandler(async (event) => {
    const parts = await readMultipartFormData(event)
    if (!parts?.length) throw createError({statusCode: 400, statusMessage: 'Aucun fichier reçu'})
    const file = parts[0]!
    if (!file.filename) throw createError({statusCode: 400, statusMessage: 'Fichier invalide'})
    const mimetype = file.type || 'application/octet-stream'
    const allowed = ALLOWED_MIMETYPES.some(m => m.endsWith('/*') ? mimetype.startsWith(m.slice(0, -1)) : m === mimetype) || mimetype.startsWith('image/')
    if (!allowed) throw createError({statusCode: 415, statusMessage: 'Type de fichier non autorisé'})
    if (file.data.length > MAX_SIZE) throw createError({statusCode: 413, statusMessage: 'Fichier trop volumineux (max 5 Mo)'})
    const db = database(event)
    await ready(db)
    await db.prepare('INSERT INTO contact_attachments (filename, mimetype, size, data) VALUES (?, ?, ?, ?)').bind(file.filename, mimetype, file.data.length, file.data).run()
    const row = await db.prepare('SELECT id FROM contact_attachments ORDER BY id DESC LIMIT 1').first<{id: number}>()
    return {id: row!.id, filename: file.filename, size: file.data.length}
})
