import { d as defineEventHandler, r as requireAdmin, a as database, g as getRouterParam } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await db.prepare("DELETE FROM products WHERE id=?").bind(Number(getRouterParam(event, "id"))).run();
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
