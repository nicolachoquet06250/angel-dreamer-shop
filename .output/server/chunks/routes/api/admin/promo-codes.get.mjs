import { d as defineEventHandler, r as requireAdmin, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const promoCodes_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results: codeRows } = await db.prepare(
    `SELECT id, code, active, starts_at, ends_at, created_at
         FROM promo_codes
         ORDER BY id DESC`
  ).all();
  const { results: ruleRows } = await db.prepare(
    `SELECT id, promo_code_id, scope, target_id, type, value
         FROM promo_code_rules`
  ).all();
  return codeRows.map((c) => {
    var _a, _b;
    return {
      id: c.id,
      code: c.code,
      active: Boolean(c.active),
      startsAt: (_a = c.starts_at) != null ? _a : null,
      endsAt: (_b = c.ends_at) != null ? _b : null,
      createdAt: c.created_at,
      rules: ruleRows.filter((r) => r.promo_code_id === c.id).map((r) => {
        var _a2;
        return { id: r.id, scope: r.scope, targetId: (_a2 = r.target_id) != null ? _a2 : null, type: r.type, value: r.value };
      })
    };
  });
});

export { promoCodes_get as default };
//# sourceMappingURL=promo-codes.get.mjs.map
