export default defineEventHandler(async event => {
    const user = await requireUser(event);
    const body = await readBody(event);
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    if (!firstName || !lastName) throw createError({
        statusCode: 400,
        statusMessage: 'Le prénom et le nom sont obligatoires'
    });
    if (firstName.length > 80 || lastName.length > 80) throw createError({
        statusCode: 400,
        statusMessage: 'Le prénom et le nom ne peuvent pas dépasser 80 caractères'
    });
    const db = database(event);
    await ready(db);
    await db.prepare('UPDATE users SET first_name=?,last_name=? WHERE id=?').bind(firstName, lastName, user.id).run();
    return {user: {firstName, lastName}}
});
