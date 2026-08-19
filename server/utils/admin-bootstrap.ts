import type {H3Event} from "h3";
import nodemailer from "nodemailer";

function initialPassword() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_";
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, value => alphabet[value % alphabet.length]).join("");
}

async function sendInitialPassword(event: H3Event, email: string, password: string) {
    const config = useRuntimeConfig(event);
    if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) throw new Error("Configuration SMTP administrateur incomplète");
    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort || 587),
        secure: Boolean(config.smtpSecure),
        auth: {user: config.smtpUser, pass: config.smtpPassword}
    });
    await transporter.sendMail({
        from: config.emailFrom,
        to: email,
        subject: "Votre accès administrateur Angel Dreamer",
        text: `Votre mot de passe administrateur temporaire est : ${password}\n\nConnectez-vous puis choisissez immédiatement un nouveau mot de passe.`,
        html: `<h1>Votre compte administrateur</h1><p>Votre mot de passe temporaire est :</p><p style="font-size:20px"><strong>${password}</strong></p><p>Connectez-vous puis choisissez immédiatement un nouveau mot de passe. Ce code ne pourra plus être utilisé après ce changement.</p>`
    });
}

export async function bootstrapDefaultAdmin(event: H3Event) {
    const config = useRuntimeConfig(event);
    const email = String(config.adminEmail || "").trim().toLowerCase();
    if (!email) return;
    const db = database(event);
    await ready(db);
    const existingAdmin = await db.prepare("SELECT id FROM users WHERE role='admin' LIMIT 1").first();
    if (existingAdmin) return;
    const password = initialPassword();
    await sendInitialPassword(event, email, password);
    const passwordHash = await hashPassword(password);
    await db.prepare("INSERT INTO users(email,password_hash,role,active,must_change_password,created_at) VALUES(?,?,'admin',1,1,?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,role='admin',active=1,must_change_password=1").bind(email, passwordHash, new Date().toISOString()).run();
}
