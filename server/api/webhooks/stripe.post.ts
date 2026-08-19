import Stripe from "stripe";

export default defineEventHandler(async event => {
    const config = useRuntimeConfig(event);
    if (!config.stripeSecretKey || !config.stripeWebhookSecret) throw createError({statusCode: 503});
    const raw = await readRawBody(event);
    const signature = getHeader(event, "stripe-signature");
    if (!raw || !signature) throw createError({statusCode: 400});
    const stripe = new Stripe(config.stripeSecretKey);
    const evt = await stripe.webhooks.constructEventAsync(raw, signature, config.stripeWebhookSecret);
    if (evt.type === "checkout.session.completed") {
        const s = evt.data.object;
        const db = database(event);
        await ready(db);
        await db.prepare("INSERT OR IGNORE INTO orders(provider,provider_order_id,amount_cents,status,customer_email,created_at) VALUES('stripe',?,?,?,?,?)").bind(s.id, s.amount_total || 0, s.payment_status, s.customer_details?.email || null, new Date().toISOString()).run();
    }
    return {received: true};
});
