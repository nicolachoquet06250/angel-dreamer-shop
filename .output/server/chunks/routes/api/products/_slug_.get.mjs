import { d as defineEventHandler, a as database, b as ready, j as productSelect, g as getRouterParam, e as createError, k as mapProductsWithRelations } from '../../../nitro/nitro.mjs';
import { e as enrichProductsWithDiscounts } from '../../../_/discounts.mjs';
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

const _slug__get = defineEventHandler(async (event) => {
  var _a;
  const db = database(event);
  await ready(db);
  const row = await db.prepare(`${productSelect} WHERE p.slug=? AND p.active=1`).bind(getRouterParam(event, "slug")).first();
  if (!row) throw createError({ statusCode: 404, statusMessage: "Produit introuvable" });
  const products = await mapProductsWithRelations(db, [row]);
  const discountMap = await enrichProductsWithDiscounts(db, products);
  const p = products[0];
  return { ...p, discountedPriceCents: (_a = discountMap.get(p.id)) != null ? _a : null };
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
