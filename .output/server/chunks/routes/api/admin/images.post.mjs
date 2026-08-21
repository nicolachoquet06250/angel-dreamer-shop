import { d as defineEventHandler, r as requireAdmin, c as readBody, a as database, b as ready, p as persistImage, e as createError, h as mapImage } from '../../../nitro/nitro.mjs';
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

const images_post = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  const db = database(event);
  await ready(db);
  const id = await persistImage(db, body);
  if (!id) throw createError({ statusCode: 400, statusMessage: "Image invalide" });
  const row = await db.prepare("SELECT id image_id,mime_type image_mime_type,width image_width,height image_height,natural_width image_natural_width,natural_height image_natural_height FROM images WHERE id=?").bind(id).first();
  return mapImage(row);
});

export { images_post as default };
//# sourceMappingURL=images.post.mjs.map
