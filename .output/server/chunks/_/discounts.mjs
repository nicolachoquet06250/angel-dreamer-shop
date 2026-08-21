import { a as database } from '../nitro/nitro.mjs';

function isActive(item) {
  if (!item.active) return false;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (item.startsAt && now < item.startsAt) return false;
  return !(item.endsAt && now > item.endsAt);
}
function applyReduction(price, type, value) {
  if (type === "percent") {
    return Math.max(0, Math.round(price * (1 - value / 100)));
  }
  return Math.max(0, price - value);
}
function bestRuleForProduct(rules, productId, categoryIds, universeIds) {
  const productRule = rules.find((r) => r.scope === "product" && r.targetId === productId);
  if (productRule) return productRule;
  const categoryRule = rules.find((r) => r.scope === "category" && categoryIds.includes(r.targetId));
  if (categoryRule) return categoryRule;
  const universeRule = rules.find((r) => r.scope === "universe" && universeIds.includes(r.targetId));
  if (universeRule) return universeRule;
  const allRule = rules.find((r) => r.scope === "all");
  if (allRule) return allRule;
  return null;
}
async function loadActiveDiscounts(db) {
  const { results: discountRows } = await db.prepare(
    `SELECT id, label, type, value, active, starts_at, ends_at
         FROM discounts
         WHERE active = 1`
  ).all();
  if (!(discountRows == null ? void 0 : discountRows.length)) return [];
  const { results: ruleRows } = await db.prepare(
    `SELECT discount_id, scope, target_id
         FROM discount_rules`
  ).all();
  return discountRows.map((d) => {
    var _a, _b;
    return {
      id: d.id,
      label: d.label,
      type: d.type,
      value: d.value,
      active: Boolean(d.active),
      startsAt: (_a = d.starts_at) != null ? _a : null,
      endsAt: (_b = d.ends_at) != null ? _b : null,
      rules: ruleRows.filter((r) => r.discount_id === d.id).map((r) => ({ scope: r.scope, targetId: r.target_id }))
    };
  }).filter(isActive);
}
function applyDiscountsToLine(line, discounts) {
  let bestPrice = line.price;
  for (const discount of discounts) {
    const rule = bestRuleForProduct(
      discount.rules.map((r) => ({ ...r, type: discount.type, value: discount.value })),
      line.id,
      line.categoryIds,
      line.universeIds
    );
    if (!rule) continue;
    const discounted = applyReduction(line.price, discount.type, discount.value);
    if (discounted < bestPrice) bestPrice = discounted;
  }
  return bestPrice;
}
function applyPromoToLine(line, promo) {
  const rule = bestRuleForProduct(promo.rules, line.id, line.categoryIds, line.universeIds);
  if (!rule) return null;
  return applyReduction(line.price, rule.type, rule.value);
}
async function enrichLinesWithRelations(db, lines) {
  const enriched = [];
  for (const line of lines) {
    const { results: catRows } = await db.prepare(
      `SELECT category_id
             FROM product_categories
             WHERE product_id = ?`
    ).bind(line.id).all();
    const { results: uniRows } = await db.prepare(
      `SELECT universe_id
             FROM product_universes
             WHERE product_id = ?`
    ).bind(line.id).all();
    enriched.push({
      ...line,
      categoryIds: catRows.map((r) => r.category_id),
      universeIds: uniRows.map((r) => r.universe_id)
    });
  }
  return enriched;
}
async function applyDiscountsToCheckout(event, lines, promoCode) {
  var _a, _b, _c, _d;
  const db = database(event);
  const enriched = await enrichLinesWithRelations(db, lines);
  const discounts = await loadActiveDiscounts(db);
  let promo = null;
  let promoError;
  if (promoCode) {
    const row = await db.prepare(
      `SELECT id, code, active, starts_at, ends_at
             FROM promo_codes
             WHERE code = ?`
    ).bind(promoCode.trim().toUpperCase()).first();
    if (!row) {
      promoError = "Code promo invalide.";
    } else if (!isActive({
      active: Boolean(row.active),
      startsAt: (_a = row.starts_at) != null ? _a : null,
      endsAt: (_b = row.ends_at) != null ? _b : null
    })) {
      promoError = "Ce code promo n'est plus actif.";
    } else {
      const { results: ruleRows } = await db.prepare(
        `SELECT scope, target_id, type, value
                 FROM promo_code_rules
                 WHERE promo_code_id = ?`
      ).bind(row.id).all();
      promo = {
        id: row.id,
        code: row.code,
        active: Boolean(row.active),
        startsAt: (_c = row.starts_at) != null ? _c : null,
        endsAt: (_d = row.ends_at) != null ? _d : null,
        rules: ruleRows.map((r) => {
          var _a2;
          return {
            scope: r.scope,
            targetId: (_a2 = r.target_id) != null ? _a2 : null,
            type: r.type,
            value: r.value
          };
        })
      };
    }
  }
  const resultLines = enriched.map((line) => {
    const originalPrice = line.price;
    let finalPrice;
    if (promo) {
      const promoPrice = applyPromoToLine(line, promo);
      if (promoPrice !== null) {
        finalPrice = promoPrice;
      } else {
        finalPrice = applyDiscountsToLine(line, discounts);
      }
    } else {
      finalPrice = applyDiscountsToLine(line, discounts);
    }
    return { id: line.id, name: line.name, price: finalPrice, quantity: line.quantity, originalPrice };
  });
  return {
    lines: resultLines,
    promoApplied: promo !== null,
    promoError
  };
}
async function enrichProductsWithDiscounts(db, products) {
  const discounts = await loadActiveDiscounts(db);
  const result = /* @__PURE__ */ new Map();
  for (const product of products) {
    const line = {
      id: product.id,
      price: product.priceCents,
      categoryIds: product.categoryIds,
      universeIds: product.universeIds
    };
    const discounted = applyDiscountsToLine(line, discounts);
    result.set(product.id, discounted < product.priceCents ? discounted : null);
  }
  return result;
}
async function validatePromoCode(event, code, productIds) {
  var _a, _b;
  const db = database(event);
  const row = await db.prepare(
    `SELECT id, active, starts_at, ends_at
         FROM promo_codes
         WHERE code = ?`
  ).bind(code.trim().toUpperCase()).first();
  if (!row) return { valid: false, error: "Code promo invalide." };
  if (!isActive({ active: Boolean(row.active), startsAt: (_a = row.starts_at) != null ? _a : null, endsAt: (_b = row.ends_at) != null ? _b : null })) {
    return { valid: false, error: "Ce code promo n'est plus actif." };
  }
  const { results: ruleRows } = await db.prepare(
    `SELECT scope, target_id, type, value
         FROM promo_code_rules
         WHERE promo_code_id = ?`
  ).bind(row.id).all();
  return {
    valid: true,
    rules: ruleRows.map((r) => {
      var _a2;
      return {
        scope: r.scope,
        targetId: (_a2 = r.target_id) != null ? _a2 : null,
        type: r.type,
        value: r.value
      };
    })
  };
}

export { applyDiscountsToCheckout as a, enrichProductsWithDiscounts as e, validatePromoCode as v };
//# sourceMappingURL=discounts.mjs.map
