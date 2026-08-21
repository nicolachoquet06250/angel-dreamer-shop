import { d as defineEventHandler, B as requireUser, e as createError, o as useRuntimeConfig, c as readBody, q as getRequestURL } from '../../../nitro/nitro.mjs';
import { c as checkoutLines } from '../../../_/checkout.mjs';
import Stripe from 'stripe';
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
import '../../../_/discounts.mjs';

const stripe_post = defineEventHandler(async (event) => {
  const user = await requireUser(event);
  if (user.role === "demo") throw createError({ statusCode: 403, statusMessage: "Le paiement est indisponible avec un compte de d\xE9monstration" });
  const config = useRuntimeConfig(event);
  if (!config.stripeSecretKey) throw createError({
    statusCode: 503,
    statusMessage: "Stripe n\u2019est pas encore configur\xE9"
  });
  const body = await readBody(event);
  const { lines, promoError } = await checkoutLines(event, body.lines || [], body.promoCode);
  if (promoError) throw createError({ statusCode: 400, statusMessage: promoError });
  const stripe = new Stripe(config.stripeSecretKey);
  const origin = config.public.siteUrl || getRequestURL(event).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "eur",
        unit_amount: l.price,
        product_data: { name: l.name + (l.originalPrice !== l.price ? ` (remis\xE9)` : "") }
      }
    })),
    success_url: `${origin}/commande?success=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/panier?cancelled=1`,
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["FR", "BE", "LU", "DE", "ES", "IT", "NL"] }
  });
  return { url: session.url };
});

export { stripe_post as default };
//# sourceMappingURL=stripe.post.mjs.map
