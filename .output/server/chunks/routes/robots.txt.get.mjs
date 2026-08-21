import { d as defineEventHandler, a as database, b as ready, o as useRuntimeConfig, q as getRequestURL, H as setHeader } from '../nitro/nitro.mjs';
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

const robots_txt_get = defineEventHandler(async (event) => {
  const db = database(event);
  await ready(db);
  const canonical = await db.prepare("SELECT value FROM site_content WHERE `key`='seoCanonicalUrl'").first();
  const origin = String((canonical == null ? void 0 : canonical.value) || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, "");
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /compte
Disallow: /commande
Disallow: /panier
Sitemap: ${origin}/sitemap.xml
`;
});

export { robots_txt_get as default };
//# sourceMappingURL=robots.txt.get.mjs.map
