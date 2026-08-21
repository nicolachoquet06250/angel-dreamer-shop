import { d as defineEventHandler, o as useRuntimeConfig, D as getQuery, E as sendRedirect, a as database, b as ready } from '../../../../nitro/nitro.mjs';
import { p as paypalToken } from '../../../../_/checkout.mjs';
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
import '../../../../_/discounts.mjs';

const capture_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const config = useRuntimeConfig(event);
  const orderId = getQuery(event).token;
  if (!orderId) return sendRedirect(event, "/panier?cancelled=1");
  const token = await paypalToken(config.public.paypalClientId, config.paypalClientSecret);
  const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  });
  const data = await response.json();
  if (response.ok) {
    const db = database(event);
    await ready(db);
    await db.prepare("INSERT OR IGNORE INTO orders(provider,provider_order_id,amount_cents,status,customer_email,created_at) VALUES('paypal',?,?,?,?,?)").bind(orderId, Math.round(Number(((_f = (_e = (_d = (_c = (_b = (_a = data.purchase_units) == null ? void 0 : _a[0]) == null ? void 0 : _b.payments) == null ? void 0 : _c.captures) == null ? void 0 : _d[0]) == null ? void 0 : _e.amount) == null ? void 0 : _f.value) || 0) * 100), data.status, ((_g = data.payer) == null ? void 0 : _g.email_address) || null, (/* @__PURE__ */ new Date()).toISOString()).run();
  }
  return sendRedirect(event, response.ok ? "/commande?success=paypal" : "/panier?error=paypal");
});

export { capture_get as default };
//# sourceMappingURL=capture.get.mjs.map
