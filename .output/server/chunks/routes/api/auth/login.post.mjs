import { d as defineEventHandler, c as readBody, a as database, b as ready, x as verifyPassword, e as createError, w as signSession } from '../../../nitro/nitro.mjs';
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

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const db = database(event);
  await ready(db);
  const user = await db.prepare("SELECT id,email,password_hash,role,active,must_change_password FROM users WHERE email=?").bind(email).first();
  if (!user || !user.active || !await verifyPassword(password, user.password_hash)) throw createError({
    statusCode: 401,
    statusMessage: "E-mail ou mot de passe incorrect"
  });
  await signSession(event, user);
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      mustChangePassword: Boolean(user.must_change_password)
    }
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
