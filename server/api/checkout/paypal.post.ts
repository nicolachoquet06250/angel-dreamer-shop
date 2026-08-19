export default defineEventHandler(async event => {
    await requireUser(event);
    const config = useRuntimeConfig(event);
    const clientId = config.public.paypalClientId;
    if (!clientId || !config.paypalClientSecret) throw createError({
        statusCode: 503,
        statusMessage: "PayPal n’est pas encore configuré"
    });
    const lines = await checkoutLines(event, (await readBody(event)).lines || []);
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const origin = config.public.siteUrl || getRequestURL(event).origin;
    const token = await paypalToken(clientId, config.paypalClientSecret);
    const response = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {currency_code: "EUR", value: (total / 100).toFixed(2)},
                items: lines.map(l => ({
                    name: l.name,
                    quantity: String(l.quantity),
                    unit_amount: {currency_code: "EUR", value: (l.price / 100).toFixed(2)}
                }))
            }],
            application_context: {
                return_url: `${origin}/api/checkout/paypal/capture`,
                cancel_url: `${origin}/panier?cancelled=1`
            }
        })
    });
    const order = await response.json() as any;
    if (!response.ok) throw createError({statusCode: 502, statusMessage: "Impossible de créer le paiement PayPal"});
    return {url: order.links?.find((l: any) => l.rel === "approve")?.href};
});
