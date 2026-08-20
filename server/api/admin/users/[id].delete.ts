export default defineEventHandler(async event => {
    await requireAdmin(event)
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Utilisateur invalide'})
    const db = database(event)
    await ready(db)
    const user = await db.prepare('SELECT id,role FROM users WHERE id=?').bind(id).first<any>()
    if (!user) throw createError({statusCode: 404, statusMessage: 'Utilisateur introuvable'})
    if (user.role !== 'demo') throw createError({
        statusCode: 403,
        statusMessage: 'Seuls les utilisateurs de démonstration peuvent être supprimés'
    })
    await db.prepare('DELETE FROM users WHERE id=?').bind(id).run()
    return {ok: true}
})
