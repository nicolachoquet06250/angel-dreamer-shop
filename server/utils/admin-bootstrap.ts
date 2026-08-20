import type {H3Event} from "h3";

function initialPassword() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_";
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, value => alphabet[value % alphabet.length]).join("");
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
    await sendInitialAdminPassword(event, email, password);
    const passwordHash = await hashPassword(password);
    await db.prepare("INSERT INTO users(email,password_hash,role,active,must_change_password,created_at) VALUES(?,?,'admin',1,1,?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,role='admin',active=1,must_change_password=1").bind(email, passwordHash, new Date().toISOString()).run();
}
