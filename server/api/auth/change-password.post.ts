export default defineEventHandler(async event => {
    const user = await sessionUser(event);
    if (!user) throw createError({statusCode: 401, statusMessage: "Connexion requise"});
    const body = await readBody(event);
    const password = String(body.password || "");
    if (password.length < 12 || password.length > 128) throw createError({
        statusCode: 400,
        statusMessage: "Le nouveau mot de passe doit contenir au moins 12 caractères"
    });
    const db = database(event);
    await ready(db);
    await db.prepare("UPDATE users SET password_hash=?,must_change_password=0 WHERE id=?").bind(await hashPassword(password), user.id).run();
    await signSession(event, user);
    return {ok: true};
});
