import {storeContactCode} from '~/server/utils/contact-codes'
import {sendRawMail} from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
    const {email} = await readBody<{email: string}>(event)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({statusCode: 400, statusMessage: 'Adresse e-mail invalide'})
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    storeContactCode(email, code)
    await sendRawMail(event, {
        to: email,
        subject: 'Votre code de vérification Angel Dreamer',
        html: `<p>Votre code de vérification est : <strong>${code}</strong></p><p>Ce code est valable 10 minutes.</p>`
    })
    return {ok: true}
})
