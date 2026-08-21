import type {H3Event} from 'h3'
import nodemailer from 'nodemailer'
import {render} from '@vue-email/render'
import type {Component} from 'vue'
import PasswordCodeEmail from '#server/emails/PasswordCodeEmail.vue'
import InitialAdminPasswordEmail from '#server/emails/InitialAdminPasswordEmail.vue'
import AdminPasswordResetEmail from '#server/emails/AdminPasswordResetEmail.vue'
import DemoAccountEndedEmail from '#server/emails/DemoAccountEndedEmail.vue'

export async function sendRawMail(event: H3Event, message: {
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    attachments?: { filename: string; content: Buffer; contentType: string }[]
}) {
    const config = useRuntimeConfig(event)
    if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) throw createError({
        statusCode: 503,
        statusMessage: 'Service d\'envoi d\'e-mails indisponible'
    })
    const secure = config.smtpSecure === true || String(config.smtpSecure).toLowerCase() === 'true'
    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort || 587),
        secure,
        auth: {user: config.smtpUser, pass: config.smtpPassword}
    })
    await transporter.sendMail({
        from: config.emailFrom,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.html,
        attachments: message.attachments
    })
}

export async function sendTransactionalMail(event: H3Event, message: {
    to: string;
    subject: string;
    template: Component;
    props: Record<string, unknown>
}) {
    const config = useRuntimeConfig(event)
    if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) throw createError({
        statusCode: 503,
        statusMessage: 'Service d’envoi d’e-mails indisponible'
    })
    const secure = config.smtpSecure === true || String(config.smtpSecure).toLowerCase() === 'true'
    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort || 587),
        secure,
        auth: {user: config.smtpUser, pass: config.smtpPassword}
    })
    const html = await render(message.template, message.props, {pretty: true})
    const text = await render(message.template, message.props, {plainText: true})
    await transporter.sendMail({from: config.emailFrom, to: message.to, subject: message.subject, html, text})
}

export async function sendPasswordCode(event: H3Event, email: string, code: string) {
    await sendTransactionalMail(event, {
        to: email,
        subject: 'Votre code de sécurité Angel Dreamer',
        template: PasswordCodeEmail,
        props: {code}
    })
}

export async function sendInitialAdminPassword(event: H3Event, email: string, password: string) {
    await sendTransactionalMail(event, {
        to: email,
        subject: 'Votre accès administrateur Angel Dreamer',
        template: InitialAdminPasswordEmail,
        props: {password}
    })
}

export async function sendAdminPasswordReset(event: H3Event, email: string, resetUrl: string) {
    await sendTransactionalMail(event, {
        to: email,
        subject: 'Réinitialisez votre mot de passe Angel Dreamer',
        template: AdminPasswordResetEmail,
        props: {resetUrl}
    })
}

export async function sendDemoAccountEnded(event: H3Event, adminEmail: string, demoEmail: string) {
    await sendTransactionalMail(event, {
        to: adminEmail,
        subject: 'Fin d’utilisation du compte de démonstration',
        template: DemoAccountEndedEmail,
        props: {demoEmail, endedAt: new Date().toLocaleString('fr-FR')}
    })
}
