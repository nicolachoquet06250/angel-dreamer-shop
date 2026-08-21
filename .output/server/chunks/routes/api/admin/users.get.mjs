import { d as defineEventHandler, r as requireAdmin, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const users_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results } = await db.prepare("SELECT id,email,role,active,created_at FROM users ORDER BY created_at").all();
  return results.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    active: Boolean(u.active),
    createdAt: u.created_at
  }));
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
