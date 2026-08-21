import {enrichProductsWithDiscounts} from "#server/utils/discounts";

export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const row = await db.prepare(`${productSelect} WHERE p.slug=? AND p.active=1`).bind(getRouterParam(event, 'slug')).first();
    if (!row) throw createError({statusCode: 404, statusMessage: 'Produit introuvable'});
    const products = await mapProductsWithRelations(db, [row]);
    const discountMap = await enrichProductsWithDiscounts(db, products);
    const p = products[0];
    return {...p, discountedPriceCents: discountMap.get(p!.id) ?? null}
})
