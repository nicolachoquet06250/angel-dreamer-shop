import type {Universe} from '~/types/shop'

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody<Universe[]>(event);
    if (!Array.isArray(body) || body.length > 50) throw createError({
        statusCode: 400,
        statusMessage: 'Liste d’univers invalide'
    });
    const db = database(event);
    await ready(db);
    const kept: number[] = [];
    const slugs = new Set<string>();
    for (const [index, item] of body.entries()) {
        const title = String(item.title || '').trim();
        const slug = String(item.slug || '').trim().toLowerCase();
        if (!title || title.length > 100 || Boolean(slug) && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug))) throw createError({
            statusCode: 400,
            statusMessage: `Univers invalide à la ligne ${index + 1}`
        });
        if (slug) slugs.add(slug);
        const imageId = await persistImage(db, item.image);
        if (!imageId) throw createError({
            statusCode: 400,
            statusMessage: `Une image est obligatoire pour l’univers « ${title} »`
        });
        if (Number(item.id) > 0) {
            await db.prepare('UPDATE universes SET title=?,slug=?,image_id=?,position=?,active=? WHERE id=?').bind(title, slug || null, imageId, index, item.active === false ? 0 : 1, Number(item.id)).run();
            kept.push(Number(item.id))
        } else {
            const result = await db.prepare('INSERT INTO universes(title,slug,image_id,position,active) VALUES(?,?,?,?,?)').bind(title, slug || null, imageId, index, item.active === false ? 0 : 1).run();
            kept.push(Number(result.lastInsertRowid))
        }
    }
    const {results: existing} = await db.prepare('SELECT id FROM universes').all<{ id: number }>();
    const removed = existing.map(item => item.id).filter(id => !kept.includes(id));
    if (removed.length) {
        const marks = removed.map(() => '?').join(',');
        const used = await db.prepare(`SELECT COUNT(*) total
                                       FROM product_universes
                                       WHERE universe_id IN (${marks})`).bind(...removed).first<{ total: number }>();
        if (used?.total) throw createError({
            statusCode: 409,
            statusMessage: 'Impossible de supprimer un univers utilisé par un produit'
        });
        await db.prepare(`DELETE
                          FROM universes
                          WHERE id IN (${marks})`).bind(...removed).run()
    }
    const {results} = await db.prepare(`${universeSelect} ORDER BY u.position,u.id`).all();
    return results.map(mapUniverse)
})
