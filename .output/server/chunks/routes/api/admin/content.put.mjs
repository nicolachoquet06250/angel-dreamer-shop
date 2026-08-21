import { d as defineEventHandler, r as requireAdmin, c as readBody, f as defaultSiteContent, e as createError, a as database, b as ready, i as imageContentKeys, p as persistImage } from '../../../nitro/nitro.mjs';
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

const content_put = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  const allowed = new Set(Object.keys(defaultSiteContent));
  if (Object.keys(body).filter((key) => allowed.has(key)).length !== allowed.size) throw createError({
    statusCode: 400,
    statusMessage: "Contenu incomplet"
  });
  const db = database(event);
  await ready(db);
  const textEntries = Object.entries(body).filter(([key]) => allowed.has(key) && !imageContentKeys.includes(key)).map(([key, value]) => [key, String(value != null ? value : "")]);
  const longTextKeys = /* @__PURE__ */ new Set(["cguContent", "cgvContent"]);
  for (const [key, value] of textEntries) {
    const max = longTextKeys.has(key) ? 2e5 : 500;
    if (value.length > max) throw createError({ statusCode: 400, statusMessage: `Texte trop long : ${key}` });
  }
  await db.batch(textEntries.map(([key, value]) => db.prepare("INSERT INTO site_content(`key`,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(key, value)));
  for (const key of imageContentKeys) {
    const imageId = await persistImage(db, body[key]);
    if (imageId) await db.prepare("INSERT INTO site_content_images(`key`,image_id) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET image_id=excluded.image_id").bind(key, imageId).run();
    else await db.prepare("DELETE FROM site_content_images WHERE `key`=?").bind(key).run();
  }
  return { ok: true };
});

export { content_put as default };
//# sourceMappingURL=content.put.mjs.map
