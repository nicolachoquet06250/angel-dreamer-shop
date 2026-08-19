export default defineEventHandler(async event => {
    const body = await readBody(event);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const db = database(event);
    await ready(db);
    const user = await db.prepare("SELECT id,email,password_hash,role,active,must_change_password FROM users WHERE email=?").bind(email).first<any>();
    if (!user || !user.active || !await verifyPassword(password, user.password_hash)) throw createError({
        statusCode: 401,
        statusMessage: "E-mail ou mot de passe incorrect"
    });
    await signSession(event, user);
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            mustChangePassword: Boolean(user.must_change_password)
        }
    };
});
