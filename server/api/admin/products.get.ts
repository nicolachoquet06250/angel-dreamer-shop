export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare(`${productSelect} ORDER BY p.featured DESC,p.featured_position,p.id`).all();
    return mapProductsWithRelations(db, results)
})
