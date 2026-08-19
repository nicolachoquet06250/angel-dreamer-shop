export default defineEventHandler(async event => {
    await requireAdmin(event);
    const id = Number(getRouterParam(event, 'id'));
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Image invalide'});
    const db = database(event);
    await ready(db);
    const usage = await db.prepare('SELECT (SELECT COUNT(*) FROM products WHERE image_id=?)+(SELECT COUNT(*) FROM universes WHERE image_id=?)+(SELECT COUNT(*) FROM site_content_images WHERE image_id=?)+(SELECT COUNT(*) FROM images WHERE dark_image_id=?) total').bind(id, id, id, id).first<{
        total: number
    }>();
    if (Number(usage?.total) > 0) throw createError({
        statusCode: 409,
        statusMessage: 'Cette image est encore utilisée. Retirez-la des contenus concernés avant de la supprimer.'
    });
    const result = await db.prepare('DELETE FROM images WHERE id=?').bind(id).run();
    if (!result.changes) throw createError({statusCode: 404, statusMessage: 'Image introuvable'});
    return {ok: true}
})
