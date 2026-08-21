import { d as defineEventHandler, o as useRuntimeConfig, e as createError, I as readRawBody, J as getHeader, a as database, b as ready } from '../../../nitro/nitro.mjs';
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

const stripe_post = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig(event);
  if (!config.stripeSecretKey || !config.stripeWebhookSecret) throw createError({ statusCode: 503 });
  const raw = await readRawBody(event);
  const signature = getHeader(event, "stripe-signature");
  if (!raw || !signature) throw createError({ statusCode: 400 });
  const stripe = new Stripe(config.stripeSecretKey);
  const evt = await stripe.webhooks.constructEventAsync(raw, signature, config.stripeWebhookSecret);
  if (evt.type === "checkout.session.completed") {
    const s = evt.data.object;
    const db = database(event);
    await ready(db);
    await db.prepare("INSERT OR IGNORE INTO orders(provider,provider_order_id,amount_cents,status,customer_email,created_at) VALUES('stripe',?,?,?,?,?)").bind(s.id, s.amount_total || 0, s.payment_status, ((_a = s.customer_details) == null ? void 0 : _a.email) || null, (/* @__PURE__ */ new Date()).toISOString()).run();
  }
  return { received: true };
});

export { stripe_post as default };
//# sourceMappingURL=stripe.post.mjs.map
