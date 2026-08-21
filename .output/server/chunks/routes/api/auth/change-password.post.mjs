import { d as defineEventHandler, s as sessionUser, e as createError, c as readBody, a as database, b as ready, v as hashPassword, w as signSession } from '../../../nitro/nitro.mjs';
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

const changePassword_post = defineEventHandler(async (event) => {
  const user = await sessionUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Connexion requise" });
  const body = await readBody(event);
  const password = String(body.password || "");
  if (password.length < 12 || password.length > 128) throw createError({
    statusCode: 400,
    statusMessage: "Le nouveau mot de passe doit contenir au moins 12 caract\xE8res"
  });
  const db = database(event);
  await ready(db);
  await db.prepare("UPDATE users SET password_hash=?,must_change_password=0 WHERE id=?").bind(await hashPassword(password), user.id).run();
  await signSession(event, user);
  return { ok: true };
});

export { changePassword_post as default };
//# sourceMappingURL=change-password.post.mjs.map
