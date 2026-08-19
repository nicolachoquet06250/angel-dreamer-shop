export default defineEventHandler(async event => {
    const body = await readBody(event);
    const email = String(body.email || "").trim().toLowerCase();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const password = String(body.password || "");
    if (!firstName || firstName.length > 80 || !lastName || lastName.length > 80) throw createError({
        statusCode: 400,
        statusMessage: "Le prénom et le nom sont obligatoires"
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({
        statusCode: 400,
        statusMessage: "Adresse e-mail invalide"
    });
    if (password.length < 10 || password.length > 128) throw createError({
        statusCode: 400,
        statusMessage: "Le mot de passe doit contenir au moins 10 caractères"
    });
    const db = database(event);
    await ready(db);
    if (await db.prepare("SELECT id FROM users WHERE email=?").bind(email).first()) throw createError({
        statusCode: 409,
        statusMessage: "Un compte existe déjà avec cette adresse"
    });
    await db.prepare("INSERT INTO users(email,first_name,last_name,password_hash,role,active,must_change_password,created_at) VALUES(?,?,?,?,?,1,0,?)").bind(email, firstName, lastName, await hashPassword(password), "customer", new Date().toISOString()).run();
    const user = await db.prepare("SELECT id,email,role FROM users WHERE email=?").bind(email).first<any>();
    await signSession(event, user);
    setResponseStatus(event, 201);
    return {user: {id: user.id, email: user.email, role: user.role}};
});
