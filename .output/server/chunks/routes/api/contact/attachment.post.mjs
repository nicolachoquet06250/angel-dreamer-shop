import { d as defineEventHandler, F as readMultipartFormData, e as createError, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_SIZE = 5 * 1024 * 1024;
const attachment_post = defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  if (!(parts == null ? void 0 : parts.length)) throw createError({ statusCode: 400, statusMessage: "Aucun fichier re\xE7u" });
  const file = parts[0];
  if (!file.filename) throw createError({ statusCode: 400, statusMessage: "Fichier invalide" });
  const mimetype = file.type || "application/octet-stream";
  const allowed = ALLOWED_MIMETYPES.some((m) => m.endsWith("/*") ? mimetype.startsWith(m.slice(0, -1)) : m === mimetype) || mimetype.startsWith("image/");
  if (!allowed) throw createError({ statusCode: 415, statusMessage: "Type de fichier non autoris\xE9" });
  if (file.data.length > MAX_SIZE) throw createError({ statusCode: 413, statusMessage: "Fichier trop volumineux (max 5 Mo)" });
  const db = database(event);
  await ready(db);
  await db.prepare("INSERT INTO contact_attachments (filename, mimetype, size, data) VALUES (?, ?, ?, ?)").bind(file.filename, mimetype, file.data.length, file.data).run();
  const row = await db.prepare("SELECT id FROM contact_attachments ORDER BY id DESC LIMIT 1").first();
  return { id: row.id, filename: file.filename, size: file.data.length };
});

export { attachment_post as default };
//# sourceMappingURL=attachment.post.mjs.map
