import { d as defineEventHandler, B as requireUser, e as createError, o as useRuntimeConfig, c as readBody, q as getRequestURL } from '../../../nitro/nitro.mjs';
import { c as checkoutLines, p as paypalToken } from '../../../_/checkout.mjs';
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

const paypal_post = defineEventHandler(async (event) => {
  var _a, _b;
  const user = await requireUser(event);
  if (user.role === "demo") throw createError({ statusCode: 403, statusMessage: "Le paiement est indisponible avec un compte de d\xE9monstration" });
  const config = useRuntimeConfig(event);
  const clientId = config.public.paypalClientId;
  if (!clientId || !config.paypalClientSecret) throw createError({
    statusCode: 503,
    statusMessage: "PayPal n\u2019est pas encore configur\xE9"
  });
  const body = await readBody(event);
  const { lines, promoError } = await checkoutLines(event, body.lines || [], body.promoCode);
  if (promoError) throw createError({ statusCode: 400, statusMessage: promoError });
  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const origin = config.public.siteUrl || getRequestURL(event).origin;
  const token = await paypalToken(clientId, config.paypalClientSecret);
  const response = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "EUR", value: (total / 100).toFixed(2) },
        items: lines.map((l) => ({
          name: l.name,
          quantity: String(l.quantity),
          unit_amount: { currency_code: "EUR", value: (l.price / 100).toFixed(2) }
        }))
      }],
      application_context: {
        return_url: `${origin}/api/checkout/paypal/capture`,
        cancel_url: `${origin}/panier?cancelled=1`
      }
    })
  });
  const order = await response.json();
  if (!response.ok) throw createError({ statusCode: 502, statusMessage: "Impossible de cr\xE9er le paiement PayPal" });
  return { url: (_b = (_a = order.links) == null ? void 0 : _a.find((l) => l.rel === "approve")) == null ? void 0 : _b.href };
});

export { paypal_post as default };
//# sourceMappingURL=paypal.post.mjs.map
