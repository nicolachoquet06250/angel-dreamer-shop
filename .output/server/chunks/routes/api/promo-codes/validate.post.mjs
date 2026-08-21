import { d as defineEventHandler, c as readBody, e as createError } from '../../../nitro/nitro.mjs';
import { v as validatePromoCode } from '../../../_/discounts.mjs';
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

const validate_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const code = (_a = body.code) == null ? void 0 : _a.trim().toUpperCase();
  if (!code) throw createError({ statusCode: 400, statusMessage: "Code requis" });
  (body.lines || []).map((l) => Number(l.id)).filter(Number.isInteger);
  const result = await validatePromoCode(event, code);
  if (!result.valid) throw createError({ statusCode: 422, statusMessage: (_b = result.error) != null ? _b : "Code invalide" });
  return { valid: true, rules: result.rules };
});

export { validate_post as default };
//# sourceMappingURL=validate.post.mjs.map
