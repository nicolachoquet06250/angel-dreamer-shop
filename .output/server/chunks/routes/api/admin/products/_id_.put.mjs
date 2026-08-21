import { d as defineEventHandler, r as requireAdmin, c as readBody, a as database, b as ready, p as persistImage, e as createError, g as getRouterParam, l as replaceProductRelations } from '../../../../nitro/nitro.mjs';
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
  await requireAdmin(event);
  const body = await readBody(event);
  const db = database(event);
  await ready(db);
  const imageId = await persistImage(db, body.image);
  if (!imageId) throw createError({ statusCode: 400, statusMessage: "Image du produit obligatoire" });
  const id = Number(getRouterParam(event, "id"));
  await db.prepare("UPDATE products SET slug=?,name=?,description=?,price_cents=?,image_id=?,featured=?,active=? WHERE id=?").bind(body.slug, body.name, body.description, Number(body.priceCents), imageId, body.featured ? 1 : 0, body.active ? 1 : 0, id).run();
  await replaceProductRelations(db, id, body.categoryIds, body.universeIds);
  return { ok: true };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
