const xml = (value: unknown) => String(value ?? '').replace(/[<>&"']/g, char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
}[char]!))

export default defineEventHandler(async event => {
    const db = database(event)
    await ready(db)
    const canonical = await db.prepare("SELECT value FROM site_content WHERE `key`='seoCanonicalUrl'").first<{
        value: string
    }>()
    const origin = String(canonical?.value || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, '')
    const {results: products} = await db.prepare('SELECT slug FROM products WHERE active=1 ORDER BY id').all<{
        slug: string
    }>()
    const {results: categories} = await db.prepare('SELECT slug FROM categories WHERE active=1 ORDER BY position,id').all<{
        slug: string
    }>()
    const {results: universes} = await db.prepare('SELECT id,slug FROM universes WHERE active=1 ORDER BY position,id').all<{
        id: number;
        slug: string
    }>()
    const paths = ['/', ...products.map(item => `/produits/${encodeURIComponent(item.slug)}`), ...categories.map(item => `/categories/${encodeURIComponent(item.slug)}`), ...universes.map(item => `/univers/${encodeURIComponent(item.slug || item.id)}`)]
    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `\n  <url><loc>${xml(origin + path)}</loc></url>`).join('')}\n</urlset>`
})
