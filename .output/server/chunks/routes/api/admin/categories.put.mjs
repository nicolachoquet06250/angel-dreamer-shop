import { d as defineEventHandler, r as requireAdmin, c as readBody, e as createError, a as database, b as ready, m as mapCategory } from '../../../nitro/nitro.mjs';
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

const categories_put = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);
  if (!Array.isArray(body) || !body.length || body.length > 30) throw createError({
    statusCode: 400,
    statusMessage: "Liste de navigation invalide"
  });
  const db = database(event);
  await ready(db);
  const kept = [];
  const slugs = /* @__PURE__ */ new Set();
  for (const [index, item] of body.entries()) {
    const label = String(item.label || "").trim();
    const slug = String(item.slug || "").trim().toLowerCase();
    if (!label || label.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw createError({
      statusCode: 400,
      statusMessage: `Lien invalide \xE0 la ligne ${index + 1}`
    });
    slugs.add(slug);
    if (Number(item.id) > 0) {
      await db.prepare("UPDATE categories SET label=?,slug=?,position=?,active=? WHERE id=?").bind(label, slug, index, item.active === false ? 0 : 1, Number(item.id)).run();
      kept.push(Number(item.id));
    } else {
      const result = await db.prepare("INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,?)").bind(label, slug, index, item.active === false ? 0 : 1).run();
      kept.push(Number(result.lastInsertRowid));
    }
  }
  const { results: existing } = await db.prepare("SELECT id FROM categories").all();
  const removed = existing.map((item) => item.id).filter((id) => !kept.includes(id));
  if (removed.length) {
    const marks = removed.map(() => "?").join(",");
    const used = await db.prepare(`SELECT COUNT(*) total
                                       FROM product_categories
                                       WHERE category_id IN (${marks})`).bind(...removed).first();
    if (used == null ? void 0 : used.total) throw createError({
      statusCode: 409,
      statusMessage: "Impossible de supprimer une cat\xE9gorie utilis\xE9e par un produit"
    });
    await db.prepare(`DELETE
                          FROM categories
                          WHERE id IN (${marks})`).bind(...removed).run();
  }
  const { results } = await db.prepare("SELECT * FROM categories ORDER BY position,id").all();
  return results.map(mapCategory);
});

export { categories_put as default };
//# sourceMappingURL=categories.put.mjs.map
