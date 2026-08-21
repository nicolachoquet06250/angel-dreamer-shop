import { d as defineEventHandler, B as requireUser, c as readBody, e as createError, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const profile_put = defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const body = await readBody(event);
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  if (!firstName || !lastName) throw createError({
    statusCode: 400,
    statusMessage: "Le pr\xE9nom et le nom sont obligatoires"
  });
  if (firstName.length > 80 || lastName.length > 80) throw createError({
    statusCode: 400,
    statusMessage: "Le pr\xE9nom et le nom ne peuvent pas d\xE9passer 80 caract\xE8res"
  });
  const db = database(event);
  await ready(db);
  await db.prepare("UPDATE users SET first_name=?,last_name=? WHERE id=?").bind(firstName, lastName, user.id).run();
  return { user: { firstName, lastName } };
});

export { profile_put as default };
//# sourceMappingURL=profile.put.mjs.map
