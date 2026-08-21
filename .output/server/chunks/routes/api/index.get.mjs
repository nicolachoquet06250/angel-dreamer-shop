import { d as defineEventHandler, a as database, b as ready, D as getQuery, j as productSelect, k as mapProductsWithRelations } from '../../nitro/nitro.mjs';
import { e as enrichProductsWithDiscounts } from '../../_/discounts.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const db = database(event);
  await ready(db);
  const query = getQuery(event);
  const { results } = await db.prepare(`${productSelect} WHERE p.active=1 ORDER BY p.featured DESC,p.featured_position,p.id`).all();
  let products = await mapProductsWithRelations(db, results);
  if (query.category) products = products.filter((product) => product.categories.some((category) => category.slug === String(query.category)));
  if (query.universe) products = products.filter((product) => product.universeIds.includes(Number(query.universe)));
  const discountMap = await enrichProductsWithDiscounts(db, products);
  return products.map((p) => {
    var _a;
    return { ...p, discountedPriceCents: (_a = discountMap.get(p.id)) != null ? _a : null };
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
