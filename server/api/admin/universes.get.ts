export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare(`${universeSelect} ORDER BY u.position,u.id`).all();
    return results.map(mapUniverse)
})
