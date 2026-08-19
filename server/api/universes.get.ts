export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare(`${universeSelect} WHERE u.active=1 ORDER BY u.position,u.id`).all();
    return results.map(mapUniverse)
})
