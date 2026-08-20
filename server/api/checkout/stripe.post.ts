import Stripe from "stripe";

export default defineEventHandler(async event => {
    const user = await requireUser(event);
    if (user.role === 'demo') throw createError({statusCode: 403, statusMessage: 'Le paiement est indisponible avec un compte de démonstration'});
    const config = useRuntimeConfig(event);
    if (!config.stripeSecretKey) throw createError({
        statusCode: 503,
        statusMessage: "Stripe n’est pas encore configuré"
    });
    const body = await readBody(event);
    const lines = await checkoutLines(event, body.lines || []);
    const stripe = new Stripe(config.stripeSecretKey);
    const origin = config.public.siteUrl || getRequestURL(event).origin;
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email,
        line_items: lines.map(l => ({
            quantity: l.quantity,
            price_data: {currency: "eur", unit_amount: l.price, product_data: {name: l.name}}
        })),
        success_url: `${origin}/commande?success=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/panier?cancelled=1`,
        billing_address_collection: "required",
        shipping_address_collection: {allowed_countries: ["FR", "BE", "LU", "DE", "ES", "IT", "NL"]}
    });
    return {url: session.url};
});
