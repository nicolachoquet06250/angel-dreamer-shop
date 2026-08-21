import { d as defineEventHandler, c as readBody, e as createError, a as database, b as ready, o as useRuntimeConfig, G as sendRawMail } from '../../../nitro/nitro.mjs';
import { v as validateContactCode } from '../../../_/contact-codes.mjs';
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

const send_post = defineEventHandler(async (event) => {
  const { firstName, lastName, email, subject, message, code, attachmentIds } = await readBody(event);
  if (!firstName || !lastName || !email || !subject || !message || !code) throw createError({ statusCode: 400, statusMessage: "Tous les champs sont requis" });
  if (!validateContactCode(email, code)) throw createError({ statusCode: 400, statusMessage: "Code de v\xE9rification invalide ou expir\xE9" });
  const db = database(event);
  await ready(db);
  const contactEmailRow = await db.prepare("SELECT value FROM site_content WHERE key=?").bind("contactEmail").first();
  const contactEmail = (contactEmailRow == null ? void 0 : contactEmailRow.value) || useRuntimeConfig(event).contactEmail;
  if (!contactEmail) throw createError({ statusCode: 503, statusMessage: "Adresse de contact non configur\xE9e" });
  const attachments = [];
  if (attachmentIds == null ? void 0 : attachmentIds.length) {
    for (const id of attachmentIds) {
      const row = await db.prepare("SELECT filename, mimetype, data FROM contact_attachments WHERE id=?").bind(id).first();
      if (row) attachments.push({ filename: row.filename, content: Buffer.from(row.data), contentType: row.mimetype });
    }
  }
  const html = `<p><strong>De :</strong> ${firstName} ${lastName} &lt;${email}&gt;</p><hr>${message}`;
  await sendRawMail(event, {
    to: contactEmail,
    replyTo: email,
    subject,
    html,
    attachments
  });
  return { ok: true };
});

export { send_post as default };
//# sourceMappingURL=send.post.mjs.map
