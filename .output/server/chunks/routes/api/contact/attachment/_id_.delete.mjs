import { d as defineEventHandler, g as getRouterParam, e as createError, a as database, b as ready } from '../../../../nitro/nitro.mjs';
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
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, statusMessage: "Identifiant invalide" });
  const db = database(event);
  await ready(db);
  await db.prepare("DELETE FROM contact_attachments WHERE id=?").bind(id).run();
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
