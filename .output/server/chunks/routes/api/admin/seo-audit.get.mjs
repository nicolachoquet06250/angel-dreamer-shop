import { d as defineEventHandler, r as requireAdmin, a as database, b as ready, f as defaultSiteContent } from '../../../nitro/nitro.mjs';
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

const seoAudit_get = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = database(event);
  await ready(db);
  const { results: rows } = await db.prepare("SELECT `key`,value FROM site_content").all();
  const content = { ...defaultSiteContent, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
  const image = await db.prepare("SELECT i.width,i.height FROM site_content_images sci JOIN images i ON i.id=sci.image_id WHERE sci.`key`='seoOgImage'").first();
  const products = await db.prepare("SELECT COUNT(*) total, SUM(CASE WHEN active=1 AND image_id IS NOT NULL AND LENGTH(description)>=50 THEN 1 ELSE 0 END) complete FROM products").first();
  const categories = await db.prepare("SELECT COUNT(*) total FROM categories WHERE active=1 AND slug IS NOT NULL AND slug<>''").first();
  const universes = await db.prepare("SELECT COUNT(*) total FROM universes WHERE active=1 AND slug IS NOT NULL AND slug<>''").first();
  const checks = [];
  const add = (label, passed, points, advice) => checks.push({
    label,
    passed,
    points,
    advice
  });
  add("Titre principal", content.seoTitle.length >= 30 && content.seoTitle.length <= 60, 10, "Utilisez un titre unique de 30 \xE0 60 caract\xE8res.");
  add("Meta description", content.seoDescription.length >= 120 && content.seoDescription.length <= 160, 10, "Visez une description attractive de 120 \xE0 160 caract\xE8res.");
  add("URL canonique s\xE9curis\xE9e", /^https:\/\/[^\s/]+/.test(content.seoCanonicalUrl), 10, "Renseignez l\u2019URL HTTPS publique et d\xE9finitive du site.");
  add("Indexation", content.seoRobots.includes("index") && !content.seoRobots.includes("noindex"), 5, "Autorisez index et follow sur la boutique publique.");
  add("Champ lexical", content.seoKeywords.split(",").filter(Boolean).length >= 3, 5, "Renseignez au moins trois expressions d\xE9crivant la boutique.");
  add("Open Graph", Boolean(content.seoOgTitle && content.seoOgDescription && content.seoOgLocale), 10, "Compl\xE9tez le titre, la description et la locale Open Graph.");
  add("Image sociale", Boolean(image && Number(image.width) >= 1200 && Number(image.height) >= 630), 15, "S\xE9lectionnez une image d\u2019au moins 1200 \xD7 630 px.");
  add("Carte X", Boolean(content.seoTwitterCard && content.seoTwitterTitle && content.seoTwitterDescription), 5, "Compl\xE9tez le format, le titre et la description X.");
  add("Donn\xE9es structur\xE9es", Boolean(content.seoOrganizationName && (content.seoOrganizationUrl || content.seoCanonicalUrl)), 10, "Renseignez le nom et l\u2019URL de l\u2019organisation.");
  add("Catalogue descriptif", Number(products == null ? void 0 : products.total) > 0 && Number(products == null ? void 0 : products.complete) === Number(products == null ? void 0 : products.total), 10, "Chaque produit actif doit avoir une image et une description d\u2019au moins 50 caract\xE8res.");
  add("Navigation indexable", Number(categories == null ? void 0 : categories.total) > 0 && Number(universes == null ? void 0 : universes.total) > 0, 5, "Conservez des cat\xE9gories et univers actifs avec des slugs uniques.");
  add("Outils webmasters", Boolean(content.seoGoogleVerification || content.seoBingVerification), 5, "Ajoutez au moins une validation Google ou Bing.");
  const score = checks.reduce((sum, check) => sum + (check.passed ? check.points : 0), 0);
  return {
    score,
    grade: score >= 90 ? "Excellent" : score >= 75 ? "Bon" : score >= 50 ? "\xC0 am\xE9liorer" : "Insuffisant",
    checks,
    auditedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { seoAudit_get as default };
//# sourceMappingURL=seo-audit.get.mjs.map
