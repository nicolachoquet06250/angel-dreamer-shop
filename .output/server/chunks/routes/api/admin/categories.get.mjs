import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, m as mapCategory } from '../../../nitro/nitro.mjs';
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

const categories_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results } = await db.prepare("SELECT * FROM categories ORDER BY position,id").all();
  return results.map(mapCategory);
});

export { categories_get as default };
//# sourceMappingURL=categories.get.mjs.map
