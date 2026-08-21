import { d as defineEventHandler, c as readBody, e as createError, G as sendRawMail } from '../../../nitro/nitro.mjs';
import { s as storeContactCode } from '../../../_/contact-codes.mjs';
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

const sendCode_post = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: "Adresse e-mail invalide" });
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  storeContactCode(email, code);
  await sendRawMail(event, {
    to: email,
    subject: "Votre code de v\xE9rification Angel Dreamer",
    html: `<p>Votre code de v\xE9rification est : <strong>${code}</strong></p><p>Ce code est valable 10 minutes.</p>`
  });
  return { ok: true };
});

export { sendCode_post as default };
//# sourceMappingURL=send-code.post.mjs.map
