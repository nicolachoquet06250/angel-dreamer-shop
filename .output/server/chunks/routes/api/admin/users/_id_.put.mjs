import { d as defineEventHandler, r as requireAdmin, g as getRouterParam, c as readBody, e as createError, a as database } from '../../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  if (id === admin.id && body.active === false) throw createError({
    statusCode: 400,
    statusMessage: "Vous ne pouvez pas d\xE9sactiver votre propre compte"
  });
  if (!["admin", "customer", "demo"].includes(body.role)) throw createError({ statusCode: 400 });
  const db = database(event);
  await db.prepare("UPDATE users SET role=?,active=? WHERE id=?").bind(body.role, body.active ? 1 : 0, id).run();
  return { ok: true };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
