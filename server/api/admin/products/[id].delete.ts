export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await db.prepare("DELETE FROM products WHERE id=?").bind(Number(getRouterParam(event, "id"))).run();
    return {ok: true};
});
