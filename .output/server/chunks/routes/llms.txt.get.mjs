import { a as database, b as ready, o as useRuntimeConfig, q as getRequestURL, j as productSelect, k as mapProductsWithRelations, u as universeSelect, n as mapUniverse, m as mapCategory, d as defineEventHandler, H as setHeader } from '../nitro/nitro.mjs';
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

const clean = (value) => String(value != null ? value : "").replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").replace(/[\[\]]/g, "").trim();
const link = (label, url, description) => `- [${clean(label)}](${url})${clean(description) ? `: ${clean(description)}` : ""}`;
function formatLlmsDocument(input) {
  const { origin, content, products, categories, universes } = input;
  const siteName = clean(content.seoSiteName || content.seoOrganizationName || "Boutique en ligne");
  const lines = [
    `# ${siteName}`,
    "",
    `> ${clean(content.seoDescription || "Boutique en ligne de produits physiques.")}`,
    "",
    `Langue principale : ${clean(content.seoLanguage || "fr")}.`,
    "Les produits pr\xE9sent\xE9s sont des articles physiques vendus en ligne.",
    "",
    "## Pages principales",
    "",
    link("Accueil", `${origin}/`, content.seoDescription),
    link("Plan du site XML", `${origin}/sitemap.xml`)
  ];
  if (categories.length) {
    lines.push("", "## Cat\xE9gories", "");
    for (const category of categories) lines.push(link(category.label, `${origin}/categories/${encodeURIComponent(category.slug)}`));
  }
  if (universes.length) {
    lines.push("", "## Univers", "");
    for (const universe of universes) {
      const universeKey = encodeURIComponent(universe.slug || String(universe.id));
      lines.push(link(universe.title, `${origin}/univers/${universeKey}`));
      const categoryIds = new Set(products.filter((product) => product.universeIds.includes(universe.id)).flatMap((product) => product.categoryIds));
      for (const category of categories.filter((item) => categoryIds.has(item.id))) {
        lines.push(`  ${link(`${universe.title} \u2014 ${category.label}`, `${origin}/univers/${universeKey}/${encodeURIComponent(category.slug)}`)}`);
      }
    }
  }
  if (products.length) {
    lines.push("", "## Produits", "");
    for (const product of products) {
      const price = `${(product.priceCents / 100).toFixed(2).replace(".", ",")} \u20AC`;
      const context = [
        product.description,
        `Prix : ${price}`,
        product.categories.length ? `Cat\xE9gories : ${product.categories.map((item) => item.label).join(", ")}` : "",
        product.universes.length ? `Univers : ${product.universes.map((item) => item.title).join(", ")}` : ""
      ].filter(Boolean).join(" \u2014 ");
      lines.push(link(product.name, `${origin}/produits/${encodeURIComponent(product.slug)}`, context));
    }
  }
  if (clean(content.seoOrganizationEmail)) {
    lines.push("", "## Contact", "", `- Email : ${clean(content.seoOrganizationEmail)}`);
  }
  return `${lines.join("\n")}
`;
}
async function buildLlmsDocument(event) {
  const db = database(event);
  await ready(db);
  const { results: contentRows } = await db.prepare("SELECT `key`,value FROM site_content WHERE `key` IN ('seoSiteName','seoDescription','seoOrganizationName','seoOrganizationEmail','seoLanguage','seoCanonicalUrl')").all();
  const content = Object.fromEntries(contentRows.map((row) => [row.key, row.value]));
  const origin = String(content.seoCanonicalUrl || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, "");
  const { results: productRows } = await db.prepare(`${productSelect} WHERE p.active=1 ORDER BY p.featured DESC,p.featured_position,p.id`).all();
  const products = await mapProductsWithRelations(db, productRows);
  const { results: categoryRows } = await db.prepare("SELECT * FROM categories WHERE active=1 ORDER BY position,id").all();
  const { results: universeRows } = await db.prepare(`${universeSelect} WHERE u.active=1 ORDER BY u.position,u.id`).all();
  return formatLlmsDocument({
    origin,
    content,
    products,
    categories: categoryRows.map(mapCategory),
    universes: universeRows.map(mapUniverse)
  });
}

const llms_txt_get = defineEventHandler(async (event) => {
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=0, must-revalidate");
  return buildLlmsDocument(event);
});

export { llms_txt_get as default };
//# sourceMappingURL=llms.txt.get.mjs.map
