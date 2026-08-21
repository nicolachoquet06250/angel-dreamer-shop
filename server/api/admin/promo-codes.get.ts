export default defineEventHandler(async event => {
    await requireAdmin(event)
    const db = database(event)
    await ready(db)
    const {results: codeRows} = await db.prepare(
        `SELECT id, code, active, starts_at, ends_at, created_at
         FROM promo_codes
         ORDER BY id DESC`
    ).all()
    const {results: ruleRows} = await db.prepare(
        `SELECT id, promo_code_id, scope, target_id, type, value
         FROM promo_code_rules`
    ).all()
    return (codeRows as any[]).map((c: any) => ({
        id: c.id,
        code: c.code,
        active: Boolean(c.active),
        startsAt: c.starts_at ?? null,
        endsAt: c.ends_at ?? null,
        createdAt: c.created_at,
        rules: (ruleRows as any[])
            .filter((r: any) => r.promo_code_id === c.id)
            .map((r: any) => ({id: r.id, scope: r.scope, targetId: r.target_id ?? null, type: r.type, value: r.value}))
    }))
})
