const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS'])

export default defineEventHandler(event => {
    const method = event.method.toUpperCase()
    const path = getRequestURL(event).pathname
    const isWebhook = path === '/api/webhooks/stripe'

    if (!safeMethods.has(method) && !isWebhook && getHeader(event, 'sec-fetch-site') === 'cross-site') {
        throw createError({statusCode: 403, statusMessage: 'Requête intersite refusée'})
    }
})
