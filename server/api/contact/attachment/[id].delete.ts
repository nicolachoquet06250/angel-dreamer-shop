import {database, ready} from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    if (!id) throw createError({statusCode: 400, statusMessage: 'Identifiant invalide'})
    const db = database(event)
    await ready(db)
    await db.prepare('DELETE FROM contact_attachments WHERE id=?').bind(id).run()
    return {ok: true}
})
