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

const xml = (value) => String(value != null ? value : "").replace(/[<>&"']/g, (char) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;"
})[char]);
const sitemap_xml_get = defineEventHandler(async (event) => {
  const db = database(event);
  await ready(db);
  const canonical = await db.prepare("SELECT value FROM site_content WHERE `key`='seoCanonicalUrl'").first();
  const origin = String((canonical == null ? void 0 : canonical.value) || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, "");
  const { results: products } = await db.prepare("SELECT slug FROM products WHERE active=1 ORDER BY id").all();
  const { results: categories } = await db.prepare("SELECT slug FROM categories WHERE active=1 ORDER BY position,id").all();
  const { results: universes } = await db.prepare("SELECT id,slug FROM universes WHERE active=1 ORDER BY position,id").all();
  const paths = ["/", ...products.map((item) => `/produits/${encodeURIComponent(item.slug)}`), ...categories.map((item) => `/categories/${encodeURIComponent(item.slug)}`), ...universes.map((item) => `/univers/${encodeURIComponent(item.slug || item.id)}`)];
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `
  <url><loc>${xml(origin + path)}</loc></url>`).join("")}
</urlset>`;
});

export { sitemap_xml_get as default };
//# sourceMappingURL=sitemap.xml.get.mjs.map
