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
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, statusMessage: "Image invalide" });
  const db = database(event);
  await ready(db);
  const usage = await db.prepare("SELECT (SELECT COUNT(*) FROM products WHERE image_id=?)+(SELECT COUNT(*) FROM universes WHERE image_id=?)+(SELECT COUNT(*) FROM site_content_images WHERE image_id=?)+(SELECT COUNT(*) FROM images WHERE dark_image_id=?) total").bind(id, id, id, id).first();
  if (Number(usage == null ? void 0 : usage.total) > 0) throw createError({
    statusCode: 409,
    statusMessage: "Cette image est encore utilis\xE9e. Retirez-la des contenus concern\xE9s avant de la supprimer."
  });
  const result = await db.prepare("DELETE FROM images WHERE id=?").bind(id).run();
  if (!result.changes) throw createError({ statusCode: 404, statusMessage: "Image introuvable" });
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
