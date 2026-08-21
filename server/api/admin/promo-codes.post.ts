export default defineEventHandler(async event => {
    await requireAdmin(event)
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
    if (!/^[A-Z0-9_-]{2,32}$/.test(code)) throw createError({
        statusCode: 400,
        statusMessage: 'Code invalide (lettres majuscules, chiffres, - ou _, 2-32 caractères)'
    })
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
                                       WHERE code = ?`).bind(code).first<any>()
    if (existing) throw createError({statusCode: 409, statusMessage: 'Ce code promo existe déjà'})

    const now = new Date().toISOString()
    const result = await db.prepare(
        `INSERT INTO promo_codes (code, active, starts_at, ends_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
    ).bind(code, body.active ? 1 : 0, body.startsAt ?? null, body.endsAt ?? null, now).run()

    const promoId = result.meta?.last_row_id ?? result.lastInsertRowid
    for (const rule of body.rules) {
        await db.prepare(
            `INSERT INTO promo_code_rules (promo_code_id, scope, target_id, type, value)
             VALUES (?, ?, ?, ?, ?)`
        ).bind(promoId, rule.scope, rule.scope === 'all' ? null : rule.targetId, rule.type, rule.value).run()
    }

    return {id: promoId}
})
