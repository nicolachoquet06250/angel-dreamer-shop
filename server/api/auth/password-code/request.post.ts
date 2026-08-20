export default defineEventHandler(async event => {
    const body = await readBody<{ email?: string }>(event)
    const session = await sessionUser(event)
    const email = String(session?.email || body.email || '').trim().toLowerCase()
    const generic = {message: 'Si ce compte existe, un code de sécurité vient de lui être envoyé.'}
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return generic
    const db = database(event)
    await ready(db)
    const user = session || await db.prepare('SELECT id,email,active FROM users WHERE email=?').bind(email).first<any>()
    if (!user?.active) return generic
    const latest = await db.prepare("SELECT created_at FROM password_reset_codes WHERE user_id=? AND purpose='password' ORDER BY id DESC LIMIT 1").bind(user.id).first<{
        created_at: string
    }>()
    if (latest && Date.now() - new Date(latest.created_at).getTime() < 60_000) return generic
    const code = createSecurityCode()
    const now = new Date()
    await db.prepare("UPDATE password_reset_codes SET used_at=? WHERE user_id=? AND purpose='password' AND used_at IS NULL").bind(now.toISOString(), user.id).run()
    const inserted = await db.prepare("INSERT INTO password_reset_codes(user_id,code_hash,purpose,expires_at,attempts,used_at,created_at) VALUES(?,?,'password',?,0,NULL,?)").bind(user.id, await hashSecurityCode(event, user.id, code), new Date(now.getTime() + 600_000).toISOString(), now.toISOString()).run()
    try {
        await sendPasswordCode(event, user.email, code)
    } catch (error) {
        await db.prepare('DELETE FROM password_reset_codes WHERE id=?').bind(Number(inserted.lastInsertRowid)).run()
        if (session) throw error
        console.error('Envoi du code de sécurité impossible', error)
        return generic
    }
    return generic
})
