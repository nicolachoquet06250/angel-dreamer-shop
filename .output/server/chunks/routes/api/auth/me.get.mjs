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
  return {
    user: user ? {
      id: user.id,
      email: user.email,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      role: user.role,
      mustChangePassword: Boolean(user.must_change_password),
      createdAt: user.created_at
    } : null
  };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
