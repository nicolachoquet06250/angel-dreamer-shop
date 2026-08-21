import { d as defineEventHandler, r as requireAdmin, g as getRouterParam, e as createError, c as readBody, a as database, b as ready, p as persistImage, h as mapImage } from '../../../../../nitro/nitro.mjs';
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

const dark_put = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, statusMessage: "Image invalide" });
  const body = await readBody(event);
  const db = database(event);
  await ready(db);
  const base = await db.prepare("SELECT id,dark_image_id FROM images WHERE id=?").bind(id).first();
  if (!base) throw createError({ statusCode: 404, statusMessage: "Image introuvable" });
  const darkImageId = await persistImage(db, { ...body, id: Number(base.dark_image_id) || 0});
  if (!darkImageId) throw createError({ statusCode: 400, statusMessage: "Alternative sombre invalide" });
  await db.prepare("UPDATE images SET dark_image_id=?,updated_at=? WHERE id=?").bind(darkImageId, (/* @__PURE__ */ new Date()).toISOString(), id).run();
  const row = await db.prepare("SELECT i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM images i LEFT JOIN images di ON di.id=i.dark_image_id WHERE i.id=?").bind(id).first();
  return mapImage(row);
});

export { dark_put as default };
//# sourceMappingURL=dark.put.mjs.map
