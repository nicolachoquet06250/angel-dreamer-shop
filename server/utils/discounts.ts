import type {H3Event} from 'h3'

export type DiscountType = 'percent' | 'fixed'
export type DiscountScope = 'product' | 'category' | 'universe' | 'all'

export interface DiscountRule {
    scope: DiscountScope
    targetId: number | null
    type: DiscountType
    value: number
}

export interface Discount {
    id: number
    label: string
    type: DiscountType
    value: number
    active: boolean
    startsAt: string | null
    endsAt: string | null
    rules: Array<{ scope: DiscountScope; targetId: number }>
}

export interface PromoCode {
    id: number
    code: string
    active: boolean
    startsAt: string | null
    endsAt: string | null
    rules: DiscountRule[]
}

export interface CartLineWithMeta {
    id: number
    name: string
    price: number
    quantity: number
    categoryIds: number[]
    universeIds: number[]
}

export interface AppliedDiscount {
    originalPrice: number
    discountedPrice: number
    discountCents: number
    label: string
}

function isActive(item: { active: boolean | number; startsAt: string | null; endsAt: string | null }): boolean {
    if (!item.active) return false
    const now = new Date().toISOString()
    if (item.startsAt && now < item.startsAt) return false
    return !(item.endsAt && now > item.endsAt);

}

function applyReduction(price: number, type: DiscountType, value: number): number {
    if (type === 'percent') {
        return Math.max(0, Math.round(price * (1 - value / 100)))
    }
    return Math.max(0, price - value)
}

/**
 * Finds the best matching discount rule for a product, following specificity:
 * product > category > universe
 */
function bestRuleForProduct(
    rules: DiscountRule[],
    productId: number,
    categoryIds: number[],
    universeIds: number[]
): DiscountRule | null {
    // product-level (most specific)
    const productRule = rules.find(r => r.scope === 'product' && r.targetId === productId)
    if (productRule) return productRule

    // category-level
    const categoryRule = rules.find(r => r.scope === 'category' && categoryIds.includes(r.targetId as number))
    if (categoryRule) return categoryRule

    // universe-level
    const universeRule = rules.find(r => r.scope === 'universe' && universeIds.includes(r.targetId as number))
    if (universeRule) return universeRule

    // all (promo codes only)
    const allRule = rules.find(r => r.scope === 'all')
    if (allRule) return allRule

    return null
}

/**
 * Loads all active discounts with their rules from the DB.
 */
async function loadActiveDiscounts(db: any): Promise<Discount[]> {
    const {results: discountRows} = await db.prepare(
        `SELECT id, label, type, value, active, starts_at, ends_at
         FROM discounts
         WHERE active = 1`
    ).all()
    if (!discountRows?.length) return []

    const {results: ruleRows} = await db.prepare(
        `SELECT discount_id, scope, target_id
         FROM discount_rules`
    ).all()

    return (discountRows as any[])
        .map((d: any) => ({
            id: d.id,
            label: d.label,
            type: d.type as DiscountType,
            value: d.value,
            active: Boolean(d.active),
            startsAt: d.starts_at ?? null,
            endsAt: d.ends_at ?? null,
            rules: (ruleRows as any[])
                .filter((r: any) => r.discount_id === d.id)
                .map((r: any) => ({scope: r.scope as DiscountScope, targetId: r.target_id}))
        }))
        .filter(isActive)
}

/**
 * Applies automatic discounts to a cart line.
 * Returns the discounted price (specificity rule: product > category > universe).
 */
export function applyDiscountsToLine(
    line: CartLineWithMeta,
    discounts: Discount[]
): number {
    // Find the best matching discount across all active discounts
    // For each discount, find the best rule; then pick the discount that gives the lowest price
    let bestPrice = line.price

    for (const discount of discounts) {
        const rule = bestRuleForProduct(
            discount.rules.map(r => ({...r, type: discount.type, value: discount.value})),
            line.id,
            line.categoryIds,
            line.universeIds
        )
        if (!rule) continue
        const discounted = applyReduction(line.price, discount.type, discount.value)
        if (discounted < bestPrice) bestPrice = discounted
    }

    return bestPrice
}

/**
 * Applies a promo code to a cart line.
 * Returns the discounted price or null if the code doesn't apply to this product.
 * Promo code takes priority over automatic discounts.
 */
export function applyPromoToLine(
    line: CartLineWithMeta,
    promo: PromoCode
): number | null {
    const rule = bestRuleForProduct(promo.rules, line.id, line.categoryIds, line.universeIds)
    if (!rule) return null
    return applyReduction(line.price, rule.type, rule.value)
}

/**
 * Enriches checkout lines with product relations (categoryIds, universeIds).
 */
async function enrichLinesWithRelations(
    db: any,
    lines: Array<{ id: number; name: string; price: number; quantity: number }>
): Promise<CartLineWithMeta[]> {
    const enriched: CartLineWithMeta[] = []
    for (const line of lines) {
        const {results: catRows} = await db.prepare(
            `SELECT category_id
             FROM product_categories
             WHERE product_id = ?`
        ).bind(line.id).all()
        const {results: uniRows} = await db.prepare(
            `SELECT universe_id
             FROM product_universes
             WHERE product_id = ?`
        ).bind(line.id).all()
        enriched.push({
            ...line,
            categoryIds: (catRows as any[]).map((r: any) => r.category_id),
            universeIds: (uniRows as any[]).map((r: any) => r.universe_id)
        })
    }
    return enriched
}

/**
 * Applies all active discounts and an optional promo code to checkout lines.
 * Returns lines with discounted prices and a summary.
 */
export async function applyDiscountsToCheckout(
    event: H3Event,
    lines: Array<{ id: number; name: string; price: number; quantity: number }>,
    promoCode?: string
): Promise<{
    lines: Array<{ id: number; name: string; price: number; quantity: number; originalPrice: number }>
    promoApplied: boolean
    promoError?: string
}> {
    const db = database(event)
    const enriched = await enrichLinesWithRelations(db, lines)
    const discounts = await loadActiveDiscounts(db)

    let promo: PromoCode | null = null
    let promoError: string | undefined

    if (promoCode) {
        const row = await db.prepare(
            `SELECT id, code, active, starts_at, ends_at
             FROM promo_codes
             WHERE code = ?`
        ).bind(promoCode.trim().toUpperCase()).first<any>()

        if (!row) {
            promoError = 'Code promo invalide.'
        } else if (!isActive({
            active: Boolean(row.active),
            startsAt: row.starts_at ?? null,
            endsAt: row.ends_at ?? null
        })) {
            promoError = 'Ce code promo n\'est plus actif.'
        } else {
            const {results: ruleRows} = await db.prepare(
                `SELECT scope, target_id, type, value
                 FROM promo_code_rules
                 WHERE promo_code_id = ?`
            ).bind(row.id).all()
            promo = {
                id: row.id,
                code: row.code,
                active: Boolean(row.active),
                startsAt: row.starts_at ?? null,
                endsAt: row.ends_at ?? null,
                rules: (ruleRows as any[]).map((r: any) => ({
                    scope: r.scope as DiscountScope,
                    targetId: r.target_id ?? null,
                    type: r.type as DiscountType,
                    value: r.value
                }))
            }
        }
    }

    const resultLines = enriched.map(line => {
        const originalPrice = line.price
        let finalPrice: number

        if (promo) {
            // Promo code takes priority
            const promoPrice = applyPromoToLine(line, promo)
            if (promoPrice !== null) {
                finalPrice = promoPrice
            } else {
                // Promo doesn't apply to this product, fall back to automatic discounts
                finalPrice = applyDiscountsToLine(line, discounts)
            }
        } else {
            finalPrice = applyDiscountsToLine(line, discounts)
        }

        return {id: line.id, name: line.name, price: finalPrice, quantity: line.quantity, originalPrice}
    })

    return {
        lines: resultLines,
        promoApplied: promo !== null,
        promoError
    }
}

/**
 * Enriches a list of products with their discounted price (automatic discounts only).
 * Sets discountedPriceCents when a discount applies, null otherwise.
 */
export async function enrichProductsWithDiscounts(
    db: any,
    products: Array<{ id: number; priceCents: number; categoryIds: number[]; universeIds: number[] }>
): Promise<Map<number, number | null>> {
    const discounts = await loadActiveDiscounts(db)
    const result = new Map<number, number | null>()
    for (const product of products) {
        const line: CartLineWithMeta = {
            id: product.id,
            name: '',
            price: product.priceCents,
            quantity: 1,
            categoryIds: product.categoryIds,
            universeIds: product.universeIds
        }
        const discounted = applyDiscountsToLine(line, discounts)
        result.set(product.id, discounted < product.priceCents ? discounted : null)
    }
    return result
}

/**
 * Validates a promo code and returns applicable rules for the given product ids.
 * Used by the public validation endpoint.
 */
export async function validatePromoCode(
    event: H3Event,
    code: string,
    productIds: number[]
): Promise<{ valid: boolean; error?: string; rules?: DiscountRule[] }> {
    const db = database(event)
    const row = await db.prepare(
        `SELECT id, active, starts_at, ends_at
         FROM promo_codes
         WHERE code = ?`
    ).bind(code.trim().toUpperCase()).first<any>()

    if (!row) return {valid: false, error: 'Code promo invalide.'}
    if (!isActive({active: Boolean(row.active), startsAt: row.starts_at ?? null, endsAt: row.ends_at ?? null})) {
        return {valid: false, error: 'Ce code promo n\'est plus actif.'}
    }

    const {results: ruleRows} = await db.prepare(
        `SELECT scope, target_id, type, value
         FROM promo_code_rules
         WHERE promo_code_id = ?`
    ).bind(row.id).all()

    return {
        valid: true,
        rules: (ruleRows as any[]).map((r: any) => ({
            scope: r.scope as DiscountScope,
            targetId: r.target_id ?? null,
            type: r.type as DiscountType,
            value: r.value
        }))
    }
}
