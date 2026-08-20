export default defineEventHandler(async event => {
    const admin = await requireAdmin(event);
    const id = Number(getRouterParam(event, "id"));
    const body = await readBody(event);
    if (id === admin.id && body.active === false) throw createError({
        statusCode: 400,
        statusMessage: "Vous ne pouvez pas désactiver votre propre compte"
    });
    if (!["admin", "customer", "demo"].includes(body.role)) throw createError({statusCode: 400});
    const db = database(event);
    await db.prepare("UPDATE users SET role=?,active=? WHERE id=?").bind(body.role, body.active ? 1 : 0, id).run();
    return {ok: true};
});
