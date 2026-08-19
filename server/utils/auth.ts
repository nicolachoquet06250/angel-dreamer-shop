import type {H3Event} from "h3";

const encoder = new TextEncoder();
const b64 = (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
const fromB64 = (value: string) =>
    Uint8Array.from(
        atob(value.replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(value.length / 4) * 4, "=")),
        c => c.charCodeAt(0)
    );

export async function hashPassword(password: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({name: "PBKDF2", hash: "SHA-256", salt, iterations: 210000}, key, 256);
    return `${b64(salt)}.${b64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string) {
    const [salt, expected] = stored.split(".");
    if (!salt || !expected)
        return false;
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await crypto.subtle.deriveBits({
        name: "PBKDF2",
        hash: "SHA-256",
        salt: fromB64(salt),
        iterations: 210000
    }, key, 256));
    const target = fromB64(expected);
    if (bits.length !== target.length)
        return false;
    let diff = 0;
    for (let i = 0; i < bits.length; i++)
        diff |= bits[i]! ^ target[i]!;
    return diff === 0;
}

async function jwtKey(secret: string) {
    return crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        {
            name: "HMAC",
            hash: "SHA-256"
        },
        false,
        ["sign", "verify"]
    );
}

export async function signSession(event: H3Event, user: { id: number; email: string; role: string }) {
    const secret = useRuntimeConfig(event).jwtSecret;
    if (!secret)
        throw createError({
            statusCode: 503,
            statusMessage: "Authentification non configurée"
        });
    const header = b64(encoder.encode(JSON.stringify({
        alg: "HS256",
        typ: "JWT"
    })));
    const payload = b64(encoder.encode(JSON.stringify({
        sub: String(user.id),
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 604800
    })));
    const signature = b64(new Uint8Array(await crypto.subtle.sign("HMAC", await jwtKey(secret), encoder.encode(`${header}.${payload}`))));
    setCookie(
        event,
        "angel_session",
        `${header}.${payload}.${signature}`,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
            maxAge: 604800
        });
}

export async function sessionUser(event: H3Event) {
    try {
        const token = getCookie(event, "angel_session");
        if (!token)
            return null;
        const [h, p, s] = token.split(".");
        if (!h || !p || !s)
            return null;
        const secret = useRuntimeConfig(event).jwtSecret;
        if (!secret)
            return null;
        const valid = await crypto.subtle.verify("HMAC", await jwtKey(secret), fromB64(s), encoder.encode(`${h}.${p}`));
        if (!valid)
            return null;
        const header = JSON.parse(new TextDecoder().decode(fromB64(h)));
        const claims = JSON.parse(new TextDecoder().decode(fromB64(p)));
        const now = Math.floor(Date.now() / 1000);
        if (header.alg !== "HS256" || header.typ !== "JWT")
            return null;
        if (!/^\d+$/.test(String(claims.sub || "")) || !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp))
            return null;
        if (claims.iat > now + 60 || claims.exp < now || claims.exp - claims.iat > 604800)
            return null;
        const db = database(event);
        await ready(db);
        return await db.prepare("SELECT id,email,first_name,last_name,role,active,must_change_password,created_at FROM users WHERE id=? AND active=1").bind(Number(claims.sub)).first<any>();
    } catch {
        return null;
    }
}

export async function requireUser(event: H3Event) {
    const user = await sessionUser(event);
    if (!user)
        throw createError({statusCode: 401, statusMessage: "Connexion requise"});
    if (user.must_change_password)
        throw createError({statusCode: 428, statusMessage: "Changement de mot de passe requis"});
    return user;
}

export async function requireAdmin(event: H3Event) {
    const user = await requireUser(event);
    if (user.role !== "admin")
        throw createError({statusCode: 403, statusMessage: "Droits administrateur requis"});
    return user;
}

export function clearAuthSession(event: H3Event) {
    deleteCookie(event, "angel_session", {path: "/"});
}
