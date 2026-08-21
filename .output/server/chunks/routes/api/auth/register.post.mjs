import { d as defineEventHandler, c as readBody, e as createError, a as database, b as ready, v as hashPassword, w as signSession, C as setResponseStatus } from '../../../nitro/nitro.mjs';
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

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body.email || "").trim().toLowerCase();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const password = String(body.password || "");
  if (!firstName || firstName.length > 80 || !lastName || lastName.length > 80) throw createError({
    statusCode: 400,
    statusMessage: "Le pr\xE9nom et le nom sont obligatoires"
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({
    statusCode: 400,
    statusMessage: "Adresse e-mail invalide"
  });
  if (password.length < 10 || password.length > 128) throw createError({
    statusCode: 400,
    statusMessage: "Le mot de passe doit contenir au moins 10 caract\xE8res"
  });
  const db = database(event);
  await ready(db);
  if (await db.prepare("SELECT id FROM users WHERE email=?").bind(email).first()) throw createError({
    statusCode: 409,
    statusMessage: "Un compte existe d\xE9j\xE0 avec cette adresse"
  });
  await db.prepare("INSERT INTO users(email,first_name,last_name,password_hash,role,active,must_change_password,created_at) VALUES(?,?,?,?,?,1,0,?)").bind(email, firstName, lastName, await hashPassword(password), "customer", (/* @__PURE__ */ new Date()).toISOString()).run();
  const user = await db.prepare("SELECT id,email,role FROM users WHERE email=?").bind(email).first();
  await signSession(event, user);
  setResponseStatus(event, 201);
  return { user: { id: user.id, email: user.email, role: user.role } };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
