import {enrichProductsWithDiscounts} from "#server/utils/discounts";

export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const query = getQuery(event);
    const {results} = await db.prepare(`${productSelect} WHERE p.active=1 ORDER BY p.featured DESC,p.featured_position,p.id`).all();
    let products = await mapProductsWithRelations(db, results);
    if (query.category) products = products.filter(product => product.categories.some(category => category.slug === String(query.category)));
    if (query.universe) products = products.filter(product => product.universeIds.includes(Number(query.universe)));
    const discountMap = await enrichProductsWithDiscounts(db, products);
    return products.map(p => ({...p, discountedPriceCents: discountMap.get(p.id) ?? null}))
})
