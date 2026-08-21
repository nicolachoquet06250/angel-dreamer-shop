import { d as defineEventHandler, r as requireAdmin, g as getRouterParam, e as createError, a as database, b as ready, o as useRuntimeConfig, q as getRequestURL, t as sendAdminPasswordReset } from '../../../../../nitro/nitro.mjs';
import { c as createResetToken, h as hashSecurityCode } from '../../../../../_/password-reset.mjs';
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

const passwordReset_post = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const userId = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(userId) || userId < 1) throw createError({
    statusCode: 400,
    statusMessage: "Utilisateur invalide"
  });
  const db = database(event);
  await ready(db);
  const user = await db.prepare("SELECT id,email,active FROM users WHERE id=?").bind(userId).first();
  if (!(user == null ? void 0 : user.active)) throw createError({ statusCode: 404, statusMessage: "Utilisateur actif introuvable" });
  const token = createResetToken();
  const now = /* @__PURE__ */ new Date();
  await db.prepare("UPDATE password_reset_codes SET used_at=? WHERE user_id=? AND used_at IS NULL").bind(now.toISOString(), user.id).run();
  const inserted = await db.prepare("INSERT INTO password_reset_codes(user_id,code_hash,purpose,expires_at,attempts,used_at,created_at) VALUES(?,?,'admin-link',?,0,NULL,?)").bind(user.id, await hashSecurityCode(event, user.id, token), new Date(now.getTime() + 30 * 6e4).toISOString(), now.toISOString()).run();
  const configured = String(useRuntimeConfig(event).public.siteUrl || "").replace(/\/$/, "");
  const origin = configured || getRequestURL(event).origin;
  const resetUrl = `${origin}/mot-de-passe-oublie?uid=${user.id}&token=${encodeURIComponent(token)}`;
  try {
    await sendAdminPasswordReset(event, user.email, resetUrl);
  } catch (error) {
    await db.prepare("DELETE FROM password_reset_codes WHERE id=?").bind(Number(inserted.lastInsertRowid)).run();
    throw error;
  }
  return { message: "Le lien de r\xE9initialisation a \xE9t\xE9 envoy\xE9." };
});

export { passwordReset_post as default };
//# sourceMappingURL=password-reset.post.mjs.map
