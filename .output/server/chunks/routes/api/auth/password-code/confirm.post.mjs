import { d as defineEventHandler, c as readBody, e as createError, s as sessionUser, a as database, b as ready, v as hashPassword, w as signSession } from '../../../../nitro/nitro.mjs';
import { s as safeEqual, h as hashSecurityCode } from '../../../../_/password-reset.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'mysql2/promise';
import 'nodemailer';
import '@vue-email/render';
import 'vue';
import '@vue-email/components';

const confirm_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const code = String(body.code || "").trim();
  const token = String(body.token || "").trim();
  const password = String(body.password || "");
  const linkUserId = Number(body.userId);
  const usesLink = token.length >= 32 && Number.isInteger(linkUserId) && linkUserId > 0;
  if (!usesLink && !/^\d{6}$/.test(code)) throw createError({
    statusCode: 400,
    statusMessage: "Le code doit contenir 6 chiffres"
  });
  if (password.length < 12 || password.length > 128) throw createError({
    statusCode: 400,
    statusMessage: "Le mot de passe doit contenir entre 12 et 128 caract\xE8res"
  });
  const session = await sessionUser(event);
  const email = String((session == null ? void 0 : session.email) || body.email || "").trim().toLowerCase();
  const db = database(event);
  await ready(db);
  const user = usesLink ? await db.prepare("SELECT id,email,role,active FROM users WHERE id=?").bind(linkUserId).first() : session || await db.prepare("SELECT id,email,role,active FROM users WHERE email=?").bind(email).first();
  if (!(user == null ? void 0 : user.active)) throw createError({ statusCode: 400, statusMessage: "Code invalide ou expir\xE9" });
  const purpose = usesLink ? "admin-link" : "password";
  const reset = await db.prepare("SELECT id,code_hash,expires_at,attempts FROM password_reset_codes WHERE user_id=? AND purpose=? AND used_at IS NULL ORDER BY id DESC LIMIT 1").bind(user.id, purpose).first();
  if (!reset || Number(reset.attempts) >= 5 || new Date(reset.expires_at).getTime() < Date.now()) throw createError({
    statusCode: 400,
    statusMessage: "Code invalide ou expir\xE9"
  });
  await db.prepare("UPDATE password_reset_codes SET attempts=attempts+1 WHERE id=?").bind(reset.id).run();
  if (!safeEqual(await hashSecurityCode(event, user.id, usesLink ? token : code), String(reset.code_hash))) throw createError({
    statusCode: 400,
    statusMessage: "Code invalide ou expir\xE9"
  });
  const usedAt = (/* @__PURE__ */ new Date()).toISOString();
  await db.batch([db.prepare("UPDATE users SET password_hash=?,must_change_password=0 WHERE id=?").bind(await hashPassword(password), user.id), db.prepare("UPDATE password_reset_codes SET used_at=? WHERE user_id=? AND used_at IS NULL").bind(usedAt, user.id)]);
  if (usesLink || !session) await signSession(event, user);
  return { success: true };
});

export { confirm_post as default };
//# sourceMappingURL=confirm.post.mjs.map
