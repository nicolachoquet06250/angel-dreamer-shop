export default defineEventHandler(async event => {
    await requireAdmin(event)
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Identifiant invalide'})
    const db = database(event)
    await ready(db)
    const existing = await db.prepare(`SELECT id
                                       FROM promo_codes
                                       WHERE id = ?`).bind(id).first<any>()
    if (!existing) throw createError({statusCode: 404, statusMessage: 'Code promo introuvable'})
    await db.prepare(`DELETE
                      FROM promo_codes
                      WHERE id = ?`).bind(id).run()
    return {ok: true}
})
