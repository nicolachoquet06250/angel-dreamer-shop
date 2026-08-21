import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, j as productSelect, k as mapProductsWithRelations } from '../../../nitro/nitro.mjs';
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

const products_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results } = await db.prepare(`${productSelect} ORDER BY p.featured DESC,p.featured_position,p.id`).all();
  return mapProductsWithRelations(db, results);
});

export { products_get as default };
//# sourceMappingURL=products.get.mjs.map
