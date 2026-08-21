export default defineEventHandler(async event => {
    await requireAdmin(event)
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Identifiant invalide'})
    const db = database(event)
    await ready(db)
    const body = await readBody<{
        code: string
        active: boolean
        startsAt?: string | null
        endsAt?: string | null
        rules: Array<{
            scope: 'product' | 'category' | 'universe' | 'all';
            targetId?: number | null;
            type: 'percent' | 'fixed';
            value: number
        }>
    }>(event)

    const code = body.code?.trim().toUpperCase()
    if (!code) throw createError({statusCode: 400, statusMessage: 'Code requis'})
    if (!/^[A-Z0-9_-]{2,32}$/.test(code)) throw createError({statusCode: 400, statusMessage: 'Code invalide'})
    if (!Array.isArray(body.rules) || !body.rules.length) throw createError({
        statusCode: 400,
        statusMessage: 'Au moins une règle requise'
    })

    for (const rule of body.rules) {
        if (!['product', 'category', 'universe', 'all'].includes(rule.scope)) throw createError({
            statusCode: 400,
            statusMessage: 'Scope invalide'
        })
        if (!['percent', 'fixed'].includes(rule.type)) throw createError({
            statusCode: 400,
            statusMessage: 'Type invalide'
        })
        if (!Number.isInteger(rule.value) || rule.value < 0) throw createError({
            statusCode: 400,
            statusMessage: 'Valeur invalide'
        })
        if (rule.type === 'percent' && rule.value > 100) throw createError({
            statusCode: 400,
            statusMessage: 'Pourcentage max 100'
        })
        if (rule.scope !== 'all' && (!Number.isInteger(rule.targetId) || (rule.targetId as number) < 1)) {
            throw createError({statusCode: 400, statusMessage: 'targetId requis pour ce scope'})
        }
    }

    const existing = await db.prepare(`SELECT id
                                       FROM promo_codes
                                       WHERE id = ?`).bind(id).first<any>()
    if (!existing) throw createError({statusCode: 404, statusMessage: 'Code promo introuvable'})

    const conflict = await db.prepare(`SELECT id
                                       FROM promo_codes
                                       WHERE code = ?
                                         AND id != ?`).bind(code, id).first<any>()
    if (conflict) throw createError({statusCode: 409, statusMessage: 'Ce code promo existe déjà'})

    await db.prepare(
        `UPDATE promo_codes
         SET code=?,
             active=?,
             starts_at=?,
             ends_at=?
         WHERE id = ?`
    ).bind(code, body.active ? 1 : 0, body.startsAt ?? null, body.endsAt ?? null, id).run()

    await db.prepare(`DELETE
                      FROM promo_code_rules
                      WHERE promo_code_id = ?`).bind(id).run()
    for (const rule of body.rules) {
        await db.prepare(
            `INSERT INTO promo_code_rules (promo_code_id, scope, target_id, type, value)
             VALUES (?, ?, ?, ?, ?)`
        ).bind(id, rule.scope, rule.scope === 'all' ? null : rule.targetId, rule.type, rule.value).run()
    }

    return {ok: true}
})
