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

const promoCodes_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const body = await readBody(event);
  const code = (_a = body.code) == null ? void 0 : _a.trim().toUpperCase();
  if (!code) throw createError({ statusCode: 400, statusMessage: "Code requis" });
  if (!/^[A-Z0-9_-]{2,32}$/.test(code)) throw createError({
    statusCode: 400,
    statusMessage: "Code invalide (lettres majuscules, chiffres, - ou _, 2-32 caract\xE8res)"
  });
  if (!Array.isArray(body.rules) || !body.rules.length) throw createError({
    statusCode: 400,
    statusMessage: "Au moins une r\xE8gle requise"
  });
  for (const rule of body.rules) {
    if (!["product", "category", "universe", "all"].includes(rule.scope)) throw createError({
      statusCode: 400,
      statusMessage: "Scope invalide"
    });
    if (!["percent", "fixed"].includes(rule.type)) throw createError({
      statusCode: 400,
      statusMessage: "Type invalide"
    });
    if (!Number.isInteger(rule.value) || rule.value < 0) throw createError({
      statusCode: 400,
      statusMessage: "Valeur invalide"
    });
    if (rule.type === "percent" && rule.value > 100) throw createError({
      statusCode: 400,
      statusMessage: "Pourcentage max 100"
    });
    if (rule.scope !== "all" && (!Number.isInteger(rule.targetId) || rule.targetId < 1)) {
      throw createError({ statusCode: 400, statusMessage: "targetId requis pour ce scope" });
    }
  }
  const existing = await db.prepare(`SELECT id
                                       FROM promo_codes
                                       WHERE code = ?`).bind(code).first();
  if (existing) throw createError({ statusCode: 409, statusMessage: "Ce code promo existe d\xE9j\xE0" });
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await db.prepare(
    `INSERT INTO promo_codes (code, active, starts_at, ends_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
  ).bind(code, body.active ? 1 : 0, (_b = body.startsAt) != null ? _b : null, (_c = body.endsAt) != null ? _c : null, now).run();
  const promoId = (_e = (_d = result.meta) == null ? void 0 : _d.last_row_id) != null ? _e : result.lastInsertRowid;
  for (const rule of body.rules) {
    await db.prepare(
      `INSERT INTO promo_code_rules (promo_code_id, scope, target_id, type, value)
             VALUES (?, ?, ?, ?, ?)`
    ).bind(promoId, rule.scope, rule.scope === "all" ? null : rule.targetId, rule.type, rule.value).run();
  }
  return { id: promoId };
});

export { promoCodes_post as default };
//# sourceMappingURL=promo-codes.post.mjs.map
