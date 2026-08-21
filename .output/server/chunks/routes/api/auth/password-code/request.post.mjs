import { d as defineEventHandler, c as readBody, s as sessionUser, a as database, b as ready, A as sendPasswordCode } from '../../../../nitro/nitro.mjs';
import { a as createSecurityCode, h as hashSecurityCode } from '../../../../_/password-reset.mjs';
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

const request_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await sessionUser(event);
  const email = String((session == null ? void 0 : session.email) || body.email || "").trim().toLowerCase();
  const generic = { message: "Si ce compte existe, un code de s\xE9curit\xE9 vient de lui \xEAtre envoy\xE9." };
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return generic;
  const db = database(event);
  await ready(db);
  const user = session || await db.prepare("SELECT id,email,active FROM users WHERE email=?").bind(email).first();
  if (!(user == null ? void 0 : user.active)) return generic;
  const latest = await db.prepare("SELECT created_at FROM password_reset_codes WHERE user_id=? AND purpose='password' ORDER BY id DESC LIMIT 1").bind(user.id).first();
  if (latest && Date.now() - new Date(latest.created_at).getTime() < 6e4) return generic;
  const code = createSecurityCode();
  const now = /* @__PURE__ */ new Date();
  await db.prepare("UPDATE password_reset_codes SET used_at=? WHERE user_id=? AND purpose='password' AND used_at IS NULL").bind(now.toISOString(), user.id).run();
  const inserted = await db.prepare("INSERT INTO password_reset_codes(user_id,code_hash,purpose,expires_at,attempts,used_at,created_at) VALUES(?,?,'password',?,0,NULL,?)").bind(user.id, await hashSecurityCode(event, user.id, code), new Date(now.getTime() + 6e5).toISOString(), now.toISOString()).run();
  try {
    await sendPasswordCode(event, user.email, code);
  } catch (error) {
    await db.prepare("DELETE FROM password_reset_codes WHERE id=?").bind(Number(inserted.lastInsertRowid)).run();
    if (session) throw error;
    console.error("Envoi du code de s\xE9curit\xE9 impossible", error);
    return generic;
  }
  return generic;
});

export { request_post as default };
//# sourceMappingURL=request.post.mjs.map
