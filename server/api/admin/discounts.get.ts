export default defineEventHandler(async event => {
    await requireAdmin(event)
    const db = database(event)
    await ready(db)
    const {results: discountRows} = await db.prepare(
        `SELECT id,
                label,
                type,
                value,
                active,
                starts_at,
                ends_at,
                created_at
         FROM discounts
         ORDER BY id DESC`
    ).all()
    const {results: ruleRows} = await db.prepare(
        `SELECT id, discount_id, scope, target_id
         FROM discount_rules`
    ).all()
    return (discountRows as any[]).map((d: any) => ({
        id: d.id,
        label: d.label,
        type: d.type,
        value: d.value,
        active: Boolean(d.active),
        startsAt: d.starts_at ?? null,
        endsAt: d.ends_at ?? null,
        createdAt: d.created_at,
        rules: (ruleRows as any[])
            .filter((r: any) => r.discount_id === d.id)
            .map((r: any) => ({id: r.id, scope: r.scope, targetId: r.target_id}))
    }))
})
