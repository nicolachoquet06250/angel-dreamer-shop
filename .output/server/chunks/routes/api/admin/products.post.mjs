import { d as defineEventHandler, r as requireAdmin, c as readBody, a as database, b as ready, p as persistImage, e as createError, l as replaceProductRelations } from '../../../nitro/nitro.mjs';
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

const products_post = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  const db = database(event);
  await ready(db);
  const imageId = await persistImage(db, body.image);
  if (!imageId) throw createError({ statusCode: 400, statusMessage: "Image du produit obligatoire" });
  const result = await db.prepare("INSERT INTO products(slug,name,description,price_cents,image_id,category,featured,active) VALUES(?,?,?,?,?,'',?,?)").bind(body.slug, body.name, body.description, Number(body.priceCents), imageId, body.featured ? 1 : 0, body.active === false ? 0 : 1).run();
  await replaceProductRelations(db, Number(result.lastInsertRowid), body.categoryIds, body.universeIds);
  return { ok: true, result };
});

export { products_post as default };
//# sourceMappingURL=products.post.mjs.map
