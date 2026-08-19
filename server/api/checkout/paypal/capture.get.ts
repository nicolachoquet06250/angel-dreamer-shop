export default defineEventHandler(async event => {
    const config = useRuntimeConfig(event);
    const orderId = getQuery(event).token as string;
    if (!orderId) return sendRedirect(event, "/panier?cancelled=1");
    const token = await paypalToken(config.public.paypalClientId, config.paypalClientSecret);
    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
    });
    const data = await response.json() as any;
    if (response.ok) {
        const db = database(event);
        await ready(db);
        await db.prepare("INSERT OR IGNORE INTO orders(provider,provider_order_id,amount_cents,status,customer_email,created_at) VALUES('paypal',?,?,?,?,?)").bind(orderId, Math.round(Number(data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || 0) * 100), data.status, data.payer?.email_address || null, new Date().toISOString()).run();
    }
    return sendRedirect(event, response.ok ? "/commande?success=paypal" : "/panier?error=paypal");
});
