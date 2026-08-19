import type {Category} from '~/types/shop'

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const body = await readBody<Category[]>(event);
    if (!Array.isArray(body) || !body.length || body.length > 30) throw createError({
        statusCode: 400,
        statusMessage: 'Liste de navigation invalide'
    });
    const db = database(event);
    await ready(db);
    const kept: number[] = [];
    const slugs = new Set<string>();
    for (const [index, item] of body.entries()) {
        const label = String(item.label || '').trim();
        const slug = String(item.slug || '').trim().toLowerCase();
        if (!label || label.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw createError({
            statusCode: 400,
            statusMessage: `Lien invalide à la ligne ${index + 1}`
        });
        slugs.add(slug);
        if (Number(item.id) > 0) {
            await db.prepare('UPDATE categories SET label=?,slug=?,position=?,active=? WHERE id=?').bind(label, slug, index, item.active === false ? 0 : 1, Number(item.id)).run();
            kept.push(Number(item.id))
        } else {
            const result = await db.prepare('INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,?)').bind(label, slug, index, item.active === false ? 0 : 1).run();
            kept.push(Number(result.lastInsertRowid))
        }
    }
    const {results: existing} = await db.prepare('SELECT id FROM categories').all<{ id: number }>();
    const removed = existing.map(item => item.id).filter(id => !kept.includes(id));
    if (removed.length) {
        const marks = removed.map(() => '?').join(',');
        const used = await db.prepare(`SELECT COUNT(*) total
                                       FROM product_categories
                                       WHERE category_id IN (${marks})`).bind(...removed).first<{ total: number }>();
        if (used?.total) throw createError({
            statusCode: 409,
            statusMessage: 'Impossible de supprimer une catégorie utilisée par un produit'
        });
        await db.prepare(`DELETE
                          FROM categories
                          WHERE id IN (${marks})`).bind(...removed).run()
    }
    const {results} = await db.prepare('SELECT * FROM categories ORDER BY position,id').all();
    return results.map(mapCategory)
})
