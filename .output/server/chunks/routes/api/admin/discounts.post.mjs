import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, c as readBody, e as createError } from '../../../nitro/nitro.mjs';
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

const discounts_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const body = await readBody(event);
  if (!((_a = body.label) == null ? void 0 : _a.trim())) throw createError({ statusCode: 400, statusMessage: "Libell\xE9 requis" });
  if (!["percent", "fixed"].includes(body.type)) throw createError({ statusCode: 400, statusMessage: "Type invalide" });
  if (!Number.isInteger(body.value) || body.value < 0) throw createError({
    statusCode: 400,
    statusMessage: "Valeur invalide"
  });
  if (body.type === "percent" && body.value > 100) throw createError({
    statusCode: 400,
    statusMessage: "Pourcentage max 100"
  });
  if (!Array.isArray(body.rules) || !body.rules.length) throw createError({
    statusCode: 400,
    statusMessage: "Au moins une r\xE8gle requise"
  });
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await db.prepare(
    `INSERT INTO discounts (label, type, value, active, starts_at, ends_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.label.trim(),
    body.type,
    body.value,
    body.active ? 1 : 0,
    (_b = body.startsAt) != null ? _b : null,
    (_c = body.endsAt) != null ? _c : null,
    now
  ).run();
  const discountId = (_e = (_d = result.meta) == null ? void 0 : _d.last_row_id) != null ? _e : result.lastInsertRowid;
  for (const rule of body.rules) {
    if (!["product", "category", "universe"].includes(rule.scope)) continue;
    if (!Number.isInteger(rule.targetId) || rule.targetId < 1) continue;
    await db.prepare(
      `INSERT INTO discount_rules (discount_id, scope, target_id)
             VALUES (?, ?, ?)`
    ).bind(discountId, rule.scope, rule.targetId).run();
  }
  return { id: discountId };
});

export { discounts_post as default };
//# sourceMappingURL=discounts.post.mjs.map
