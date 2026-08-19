export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare('SELECT * FROM categories ORDER BY position,id').all();
    return results.map(mapCategory)
})
