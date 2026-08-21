export default defineEventHandler(async event => {
    await requireAdmin(event)
    const db = database(event)
    await ready(db)
    const body = await readBody<{
        label: string
        type: 'percent' | 'fixed'
        value: number
        active: boolean
        startsAt?: string | null
        endsAt?: string | null
        rules: Array<{ scope: 'product' | 'category' | 'universe'; targetId: number }>
    }>(event)

    if (!body.label?.trim()) throw createError({statusCode: 400, statusMessage: 'Libellé requis'})
    if (!['percent', 'fixed'].includes(body.type)) throw createError({statusCode: 400, statusMessage: 'Type invalide'})
    if (!Number.isInteger(body.value) || body.value < 0) throw createError({
        statusCode: 400,
        statusMessage: 'Valeur invalide'
    })
    if (body.type === 'percent' && body.value > 100) throw createError({
        statusCode: 400,
        statusMessage: 'Pourcentage max 100'
    })
    if (!Array.isArray(body.rules) || !body.rules.length) throw createError({
        statusCode: 400,
        statusMessage: 'Au moins une règle requise'
    })

    const now = new Date().toISOString()
    const result = await db.prepare(
        `INSERT INTO discounts (label, type, value, active, starts_at, ends_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        body.label.trim(),
        body.type,
        body.value,
        body.active ? 1 : 0,
        body.startsAt ?? null,
        body.endsAt ?? null,
        now
    ).run()

    const discountId = result.meta?.last_row_id ?? result.lastInsertRowid
    for (const rule of body.rules) {
        if (!['product', 'category', 'universe'].includes(rule.scope)) continue
        if (!Number.isInteger(rule.targetId) || rule.targetId < 1) continue
        await db.prepare(
            `INSERT INTO discount_rules (discount_id, scope, target_id)
             VALUES (?, ?, ?)`
        ).bind(discountId, rule.scope, rule.targetId).run()
    }

    return {id: discountId}
})
