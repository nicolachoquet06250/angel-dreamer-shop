import type {ImageAsset} from '~/types/shop'

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody<ImageAsset>(event);
    const db = database(event);
    await ready(db);
    const id = await persistImage(db, body);
    if (!id) throw createError({statusCode: 400, statusMessage: 'Image invalide'});
    const row = await db.prepare('SELECT id image_id,mime_type image_mime_type,width image_width,height image_height,natural_width image_natural_width,natural_height image_natural_height FROM images WHERE id=?').bind(id).first<any>();
    return mapImage(row)
})
