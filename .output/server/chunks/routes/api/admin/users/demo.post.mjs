import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, v as hashPassword } from '../../../../nitro/nitro.mjs';
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

function demoPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_";
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}
function demoIdentifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}
const demo_post = defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const password = demoPassword();
  const email = `demo-${demoIdentifier()}@demo.angel-dreamer.local`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const inserted = await db.prepare("INSERT INTO users(email,password_hash,role,active,must_change_password,created_by_admin_id,created_at) VALUES(?,?,'demo',1,0,?,?)").bind(email, await hashPassword(password), admin.id, now).run();
  return { user: { id: Number(inserted.lastInsertRowid), email, role: "demo", active: true, createdAt: now }, password };
});

export { demo_post as default };
//# sourceMappingURL=demo.post.mjs.map
