export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody<{ productIds: number[] }>(event);
    const ids = [...new Set((Array.isArray(body.productIds) ? body.productIds : []).map(Number).filter(Number.isInteger))];
    if (ids.length > 4) throw createError({statusCode: 400, statusMessage: 'Quatre produits favoris maximum'});
    const db = database(event);
    await ready(db);
    if (ids.length) {
        const marks = ids.map(() => '?').join(',');
        const count = await db.prepare(`SELECT COUNT(*) total
                                        FROM products
                                        WHERE id IN (${marks})`).bind(...ids).first<{ total: number }>();
        if (count?.total !== ids.length) throw createError({
            statusCode: 400,
            statusMessage: 'Un produit sélectionné est introuvable'
        })
    }
    await db.prepare('UPDATE products SET featured=0,featured_position=NULL').run();
    if (ids.length) await db.batch(ids.map((id, index) => db.prepare('UPDATE products SET featured=1,featured_position=? WHERE id=?').bind(index, id)));
    return {ok: true, productIds: ids}
})
