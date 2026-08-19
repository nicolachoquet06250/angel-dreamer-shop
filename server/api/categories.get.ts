export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare('SELECT * FROM categories WHERE active=1 ORDER BY position,id').all();
    return results.map(mapCategory)
})
