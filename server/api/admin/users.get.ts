export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare("SELECT id,email,role,active,created_at FROM users ORDER BY created_at").all<any>();
    return results.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        active: Boolean(u.active),
        createdAt: u.created_at
    }));
});
