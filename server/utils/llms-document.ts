import type {Category, Product, Universe} from '~/types/shop'

type LlmSiteContent = {
    seoSiteName?: string
    seoDescription?: string
    seoOrganizationName?: string
    seoOrganizationEmail?: string
    seoLanguage?: string
}

const clean = (value: unknown) => String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\[\]]/g, '')
    .trim()

const link = (label: unknown, url: string, description?: unknown) =>
    `- [${clean(label)}](${url})${clean(description) ? `: ${clean(description)}` : ''}`

export function formatLlmsDocument(input: {
    origin: string
    content: LlmSiteContent
    products: Product[]
    categories: Category[]
    universes: Universe[]
}) {
    const {origin, content, products, categories, universes} = input
    const siteName = clean(content.seoSiteName || content.seoOrganizationName || 'Boutique en ligne')
    const lines = [
        `# ${siteName}`,
        '',
        `> ${clean(content.seoDescription || 'Boutique en ligne de produits physiques.')}`,
        '',
        `Langue principale : ${clean(content.seoLanguage || 'fr')}.`,
        'Les produits présentés sont des articles physiques vendus en ligne.',
        '',
        '## Pages principales',
        '',
        link('Accueil', `${origin}/`, content.seoDescription),
        link('Plan du site XML', `${origin}/sitemap.xml`)
    ]

    if (categories.length) {
        lines.push('', '## Catégories', '')
        for (const category of categories) lines.push(link(category.label, `${origin}/categories/${encodeURIComponent(category.slug)}`))
    }

    if (universes.length) {
        lines.push('', '## Univers', '')
        for (const universe of universes) {
            const universeKey = encodeURIComponent(universe.slug || String(universe.id))
            lines.push(link(universe.title, `${origin}/univers/${universeKey}`))
            const categoryIds = new Set(products
                .filter(product => product.universeIds.includes(universe.id))
                .flatMap(product => product.categoryIds))
            for (const category of categories.filter(item => categoryIds.has(item.id))) {
                lines.push(`  ${link(`${universe.title} — ${category.label}`, `${origin}/univers/${universeKey}/${encodeURIComponent(category.slug)}`)}`)
            }
        }
    }

    if (products.length) {
        lines.push('', '## Produits', '')
        for (const product of products) {
            const price = `${(product.priceCents / 100).toFixed(2).replace('.', ',')} €`
            const context = [product.description, `Prix : ${price}`,
                product.categories.length ? `Catégories : ${product.categories.map(item => item.label).join(', ')}` : '',
                product.universes.length ? `Univers : ${product.universes.map(item => item.title).join(', ')}` : '']
                .filter(Boolean).join(' — ')
            lines.push(link(product.name, `${origin}/produits/${encodeURIComponent(product.slug)}`, context))
        }
    }

    if (clean(content.seoOrganizationEmail)) {
        lines.push('', '## Contact', '', `- Email : ${clean(content.seoOrganizationEmail)}`)
    }

    return `${lines.join('\n')}\n`
}

export async function buildLlmsDocument(event: any) {
    const db = database(event)
    await ready(db)
    const {results: contentRows} = await db.prepare("SELECT `key`,value FROM site_content WHERE `key` IN ('seoSiteName','seoDescription','seoOrganizationName','seoOrganizationEmail','seoLanguage','seoCanonicalUrl')").all<any>()
    const content = Object.fromEntries(contentRows.map(row => [row.key, row.value])) as LlmSiteContent & {
        seoCanonicalUrl?: string
    }
    const origin = String(content.seoCanonicalUrl || useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, '')
    const {results: productRows} = await db.prepare(`${productSelect} WHERE p.active=1 ORDER BY p.featured DESC,p.featured_position,p.id`).all<any>()
    const products = await mapProductsWithRelations(db, productRows)
    const {results: categoryRows} = await db.prepare('SELECT * FROM categories WHERE active=1 ORDER BY position,id').all<any>()
    const {results: universeRows} = await db.prepare(`${universeSelect} WHERE u.active=1 ORDER BY u.position,u.id`).all<any>()
    return formatLlmsDocument({
        origin,
        content,
        products,
        categories: categoryRows.map(mapCategory),
        universes: universeRows.map(mapUniverse)
    })
}
