import { a as database, b as ready, e as createError } from '../nitro/nitro.mjs';
import { a as applyDiscountsToCheckout } from './discounts.mjs';

async function checkoutLines(event, lines, promoCode) {
  const db = database(event);
  await ready(db);
  const raw = [];
  for (const line of lines.slice(0, 20)) {
    const row = await db.prepare("SELECT id,name,price_cents FROM products WHERE id=? AND active=1").bind(Number(line.id)).first();
    if (row) raw.push({
      id: row.id,
      name: row.name,
      price: row.price_cents,
      quantity: Math.max(1, Math.min(10, Number(line.quantity) || 1))
    });
  }
  if (!raw.length) throw createError({ statusCode: 400, statusMessage: "Panier vide" });
  const { lines: discounted, promoApplied, promoError } = await applyDiscountsToCheckout(event, raw, promoCode);
  return { lines: discounted, promoApplied, promoError };
}
async function paypalToken(clientId, secret) {
  const auth = btoa(`${clientId}:${secret}`);
  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  if (!response.ok) throw createError({ statusCode: 502, statusMessage: "PayPal indisponible" });
  return (await response.json()).access_token;
}

export { checkoutLines as c, paypalToken as p };
//# sourceMappingURL=checkout.mjs.map
