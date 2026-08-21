import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, u as universeSelect, n as mapUniverse } from '../../../nitro/nitro.mjs';
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

const universes_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results } = await db.prepare(`${universeSelect} ORDER BY u.position,u.id`).all();
  return results.map(mapUniverse);
});

export { universes_get as default };
//# sourceMappingURL=universes.get.mjs.map
