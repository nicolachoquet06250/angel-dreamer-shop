import { d as defineEventHandler, s as sessionUser } from '../../../nitro/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const user = await sessionUser(event);
  const allowed = ["admin", "demo"].includes(String((user == null ? void 0 : user.role) || ""));
  return { email: (user == null ? void 0 : user.email) || "", role: (user == null ? void 0 : user.role) || "", allowed, readOnly: (user == null ? void 0 : user.role) === "demo" };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
