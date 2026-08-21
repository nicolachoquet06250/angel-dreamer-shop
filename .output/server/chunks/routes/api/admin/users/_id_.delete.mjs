import { d as defineEventHandler, r as requireAdmin, g as getRouterParam, e as createError, a as database, b as ready } from '../../../../nitro/nitro.mjs';
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
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, statusMessage: "Utilisateur invalide" });
  const db = database(event);
  await ready(db);
  const user = await db.prepare("SELECT id,role FROM users WHERE id=?").bind(id).first();
  if (!user) throw createError({ statusCode: 404, statusMessage: "Utilisateur introuvable" });
  if (user.role !== "demo") throw createError({
    statusCode: 403,
    statusMessage: "Seuls les utilisateurs de d\xE9monstration peuvent \xEAtre supprim\xE9s"
  });
  await db.prepare("DELETE FROM users WHERE id=?").bind(id).run();
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
