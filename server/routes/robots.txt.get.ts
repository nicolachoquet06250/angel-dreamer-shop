export default defineEventHandler(async event => {
    const db = database(event)
    await ready(db)
    const canonical = await db.prepare("SELECT value FROM site_content WHERE `key`='seoCanonicalUrl'").first<{
        value: string
    }>()
    const origin = String(canonical?.value || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, '')
    setHeader(event, 'content-type', 'text/plain; charset=utf-8')
    return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /compte\nDisallow: /commande\nDisallow: /panier\nSitemap: ${origin}/sitemap.xml\n`
})
