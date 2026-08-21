import {defaultSiteContent, type ImageAsset, imageContentKeys} from '~/types/shop'

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody<Record<string, unknown>>(event);
    const allowed = new Set(Object.keys(defaultSiteContent));
    if (Object.keys(body).filter(key => allowed.has(key)).length !== allowed.size) throw createError({
        statusCode: 400,
        statusMessage: 'Contenu incomplet'
    });
    const db = database(event);
    await ready(db);
    const textEntries = Object.entries(body).filter(([key]) => allowed.has(key) && !imageContentKeys.includes(key as any)).map(([key, value]) => [key, String(value ?? '')] as const);
    const longTextKeys = new Set(['cguContent', 'cgvContent']);
    for (const [key, value] of textEntries) {
        const max = longTextKeys.has(key) ? 200_000 : 500;
        if (value.length > max) throw createError({statusCode: 400, statusMessage: `Texte trop long : ${key}`});
    }
    await db.batch(textEntries.map(([key, value]) => db.prepare('INSERT INTO site_content(`key`,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key, value)));
    for (const key of imageContentKeys) {
        const imageId = await persistImage(db, body[key] as ImageAsset | null);
        if (imageId) await db.prepare('INSERT INTO site_content_images(`key`,image_id) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET image_id=excluded.image_id').bind(key, imageId).run(); else await db.prepare('DELETE FROM site_content_images WHERE `key`=?').bind(key).run()
    }
    return {ok: true}
})
