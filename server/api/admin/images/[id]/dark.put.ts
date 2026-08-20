import type {ImageAsset} from '~/types/shop'

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const id = Number(getRouterParam(event, 'id'));
    if (!Number.isInteger(id) || id < 1) throw createError({statusCode: 400, statusMessage: 'Image invalide'});
    const body = await readBody<ImageAsset>(event);
    const db = database(event);
    await ready(db);
    const base = await db.prepare('SELECT id,dark_image_id FROM images WHERE id=?').bind(id).first<{
        id: number;
        dark_image_id: number | null
    }>();
    if (!base) throw createError({statusCode: 404, statusMessage: 'Image introuvable'});
    const darkImageId = await persistImage(db, {...body, id: Number(base.dark_image_id) || 0, darkVariant: null});
    if (!darkImageId) throw createError({statusCode: 400, statusMessage: 'Alternative sombre invalide'});
    await db.prepare('UPDATE images SET dark_image_id=?,updated_at=? WHERE id=?').bind(darkImageId, new Date().toISOString(), id).run();
    const row = await db.prepare('SELECT i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM images i LEFT JOIN images di ON di.id=i.dark_image_id WHERE i.id=?').bind(id).first<any>();
    return mapImage(row)
})
