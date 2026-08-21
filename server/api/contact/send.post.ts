import {validateContactCode} from '~/server/utils/contact-codes'
import {sendRawMail} from '~/server/utils/mailer'
import {database, ready} from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const {firstName, lastName, email, subject, message, code, attachmentIds} = await readBody<{
        firstName: string;
        lastName: string;
        email: string;
        subject: string;
        message: string;
        code: string;
        attachmentIds?: number[]
    }>(event)
    if (!firstName || !lastName || !email || !subject || !message || !code) throw createError({statusCode: 400, statusMessage: 'Tous les champs sont requis'})
    if (!validateContactCode(email, code)) throw createError({statusCode: 400, statusMessage: 'Code de vérification invalide ou expiré'})
    const db = database(event)
    await ready(db)
    const contactEmailRow = await db.prepare('SELECT value FROM site_content WHERE key=?').bind('contactEmail').first<{value: string}>()
    const contactEmail = contactEmailRow?.value || useRuntimeConfig(event).contactEmail
    if (!contactEmail) throw createError({statusCode: 503, statusMessage: 'Adresse de contact non configurée'})
    const attachments: {filename: string; content: Buffer; contentType: string}[] = []
    if (attachmentIds?.length) {
        for (const id of attachmentIds) {
            const row = await db.prepare('SELECT filename, mimetype, data FROM contact_attachments WHERE id=?').bind(id).first<{filename: string; mimetype: string; data: Buffer}>()
            if (row) attachments.push({filename: row.filename, content: Buffer.from(row.data), contentType: row.mimetype})
        }
    }
    const html = `<p><strong>De :</strong> ${firstName} ${lastName} &lt;${email}&gt;</p><hr>${message}`
    await sendRawMail(event, {
        to: contactEmail,
        replyTo: email,
        subject: subject,
        html,
        attachments
    })
    return {ok: true}
})
