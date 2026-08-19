export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const row = await db.prepare(`${productSelect} WHERE p.slug=? AND p.active=1`).bind(getRouterParam(event, 'slug')).first();
    if (!row) throw createError({statusCode: 404, statusMessage: 'Produit introuvable'});
    return (await mapProductsWithRelations(db, [row]))[0]
})
