import { d as defineEventHandler, s as sessionUser, y as clearAuthSession, a as database, b as ready, z as sendDemoAccountEnded } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  const user = await sessionUser(event);
  clearAuthSession(event);
  if ((user == null ? void 0 : user.role) !== "demo") return { ok: true };
  const db = database(event);
  await ready(db);
  const account = await db.prepare(`SELECT demo.email demo_email, creator.email creator_email
        FROM users demo
        LEFT JOIN users creator ON creator.id=demo.created_by_admin_id
        WHERE demo.id=? AND demo.role='demo'`).bind(user.id).first();
  if (!account) return { ok: true };
  await db.prepare("DELETE FROM users WHERE id=? AND role='demo'").bind(user.id).run();
  if (account.creator_email) {
    try {
      await sendDemoAccountEnded(event, account.creator_email, account.demo_email);
    } catch (error) {
      console.error("Le compte de d\xE9monstration a \xE9t\xE9 supprim\xE9, mais la notification n\u2019a pas pu \xEAtre envoy\xE9e.", error);
    }
  }
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
