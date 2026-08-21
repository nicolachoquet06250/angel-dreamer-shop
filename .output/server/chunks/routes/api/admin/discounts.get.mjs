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

const discounts_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results: discountRows } = await db.prepare(
    `SELECT id,
                label,
                type,
                value,
                active,
                starts_at,
                ends_at,
                created_at
         FROM discounts
         ORDER BY id DESC`
  ).all();
  const { results: ruleRows } = await db.prepare(
    `SELECT id, discount_id, scope, target_id
         FROM discount_rules`
  ).all();
  return discountRows.map((d) => {
    var _a, _b;
    return {
      id: d.id,
      label: d.label,
      type: d.type,
      value: d.value,
      active: Boolean(d.active),
      startsAt: (_a = d.starts_at) != null ? _a : null,
      endsAt: (_b = d.ends_at) != null ? _b : null,
      createdAt: d.created_at,
      rules: ruleRows.filter((r) => r.discount_id === d.id).map((r) => ({ id: r.id, scope: r.scope, targetId: r.target_id }))
    };
  });
});

export { discounts_get as default };
//# sourceMappingURL=discounts.get.mjs.map
