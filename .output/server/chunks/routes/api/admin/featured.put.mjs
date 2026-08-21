import { d as defineEventHandler, r as requireAdmin, c as readBody, e as createError, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const featured_put = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  const ids = [...new Set((Array.isArray(body.productIds) ? body.productIds : []).map(Number).filter(Number.isInteger))];
  if (ids.length > 4) throw createError({ statusCode: 400, statusMessage: "Quatre produits favoris maximum" });
  const db = database(event);
  await ready(db);
  if (ids.length) {
    const marks = ids.map(() => "?").join(",");
    const count = await db.prepare(`SELECT COUNT(*) total
                                        FROM products
                                        WHERE id IN (${marks})`).bind(...ids).first();
    if ((count == null ? void 0 : count.total) !== ids.length) throw createError({
      statusCode: 400,
      statusMessage: "Un produit s\xE9lectionn\xE9 est introuvable"
    });
  }
  await db.prepare("UPDATE products SET featured=0,featured_position=NULL").run();
  if (ids.length) await db.batch(ids.map((id, index) => db.prepare("UPDATE products SET featured=1,featured_position=? WHERE id=?").bind(index, id)));
  return { ok: true, productIds: ids };
});

export { featured_put as default };
//# sourceMappingURL=featured.put.mjs.map
