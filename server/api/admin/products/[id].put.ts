export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody(event);
    const db = database(event);
    await ready(db);
    const imageId = await persistImage(db, body.image);
    if (!imageId) throw createError({statusCode: 400, statusMessage: 'Image du produit obligatoire'});
    const id = Number(getRouterParam(event, 'id'));
    await db.prepare('UPDATE products SET slug=?,name=?,description=?,price_cents=?,image_id=?,featured=?,active=? WHERE id=?').bind(body.slug, body.name, body.description, Number(body.priceCents), imageId, body.featured ? 1 : 0, body.active ? 1 : 0, id).run();
    await replaceProductRelations(db, id, body.categoryIds, body.universeIds);
    return {ok: true}
})
