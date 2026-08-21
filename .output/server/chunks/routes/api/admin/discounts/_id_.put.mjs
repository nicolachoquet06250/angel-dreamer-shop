import { d as defineEventHandler, r as requireAdmin, g as getRouterParam, e as createError, a as database, b as ready, c as readBody } from '../../../../nitro/nitro.mjs';
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
  var _a, _b, _c;
  await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, statusMessage: "Identifiant invalide" });
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
  const existing = await db.prepare(`SELECT id
                                       FROM discounts
                                       WHERE id = ?`).bind(id).first();
  if (!existing) throw createError({ statusCode: 404, statusMessage: "R\xE9duction introuvable" });
  await db.prepare(
    `UPDATE discounts
         SET label=?,
             type=?,
             value=?,
             active=?,
             starts_at=?,
             ends_at=?
         WHERE id = ?`
  ).bind(body.label.trim(), body.type, body.value, body.active ? 1 : 0, (_b = body.startsAt) != null ? _b : null, (_c = body.endsAt) != null ? _c : null, id).run();
  await db.prepare(`DELETE
                      FROM discount_rules
                      WHERE discount_id = ?`).bind(id).run();
  for (const rule of body.rules) {
    if (!["product", "category", "universe"].includes(rule.scope)) continue;
    if (!Number.isInteger(rule.targetId) || rule.targetId < 1) continue;
    await db.prepare(
      `INSERT INTO discount_rules (discount_id, scope, target_id)
             VALUES (?, ?, ?)`
    ).bind(id, rule.scope, rule.targetId).run();
  }
  return { ok: true };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
