import {sendDemoAccountEnded} from "#server/utils/mailer";

export default defineEventHandler(async event => {
    const user = await sessionUser(event)
    clearAuthSession(event)
    if (user?.role !== 'demo') return {ok: true}

    const db = database(event)
    await ready(db)
    const account = await db.prepare(`SELECT demo.email demo_email, creator.email creator_email
        FROM users demo
        LEFT JOIN users creator ON creator.id=demo.created_by_admin_id
        WHERE demo.id=? AND demo.role='demo'`).bind(user.id).first<{demo_email:string; creator_email:string | null}>()
    if (!account) return {ok: true}

    await db.prepare("DELETE FROM users WHERE id=? AND role='demo'").bind(user.id).run()
    if (account.creator_email) {
        try {
            await sendDemoAccountEnded(event, account.creator_email, account.demo_email)
        } catch (error) {
            console.error('Le compte de démonstration a été supprimé, mais la notification n’a pas pu être envoyée.', error)
        }
    }
    return {ok: true}
})
