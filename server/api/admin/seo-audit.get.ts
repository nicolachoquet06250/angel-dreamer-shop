import {defaultSiteContent} from '~/types/shop'

type Check = { label: string; passed: boolean; points: number; advice: string }

export default defineEventHandler(async event => {
    await requireAdmin(event)
    const db = database(event)
    await ready(db)
    const {results: rows} = await db.prepare('SELECT `key`,value FROM site_content').all<{
        key: string;
        value: string
    }>()
    const content = {...defaultSiteContent, ...Object.fromEntries(rows.map(row => [row.key, row.value]))}
    const image = await db.prepare("SELECT i.width,i.height FROM site_content_images sci JOIN images i ON i.id=sci.image_id WHERE sci.`key`='seoOgImage'").first<{
        width: number;
        height: number
    }>()
    const products = await db.prepare('SELECT COUNT(*) total, SUM(CASE WHEN active=1 AND image_id IS NOT NULL AND LENGTH(description)>=50 THEN 1 ELSE 0 END) complete FROM products').first<{
        total: number;
        complete: number
    }>()
    const categories = await db.prepare('SELECT COUNT(*) total FROM categories WHERE active=1 AND slug IS NOT NULL AND slug<>\'\'').first<{
        total: number
    }>()
    const universes = await db.prepare('SELECT COUNT(*) total FROM universes WHERE active=1 AND slug IS NOT NULL AND slug<>\'\'').first<{
        total: number
    }>()
    const checks: Check[] = []
    const add = (label: string, passed: boolean, points: number, advice: string) => checks.push({
        label,
        passed,
        points,
        advice
    })
    add('Titre principal', content.seoTitle.length >= 30 && content.seoTitle.length <= 60, 10, 'Utilisez un titre unique de 30 à 60 caractères.')
    add('Meta description', content.seoDescription.length >= 120 && content.seoDescription.length <= 160, 10, 'Visez une description attractive de 120 à 160 caractères.')
    add('URL canonique sécurisée', /^https:\/\/[^\s/]+/.test(content.seoCanonicalUrl), 10, 'Renseignez l’URL HTTPS publique et définitive du site.')
    add('Indexation', content.seoRobots.includes('index') && !content.seoRobots.includes('noindex'), 5, 'Autorisez index et follow sur la boutique publique.')
    add('Champ lexical', content.seoKeywords.split(',').filter(Boolean).length >= 3, 5, 'Renseignez au moins trois expressions décrivant la boutique.')
    add('Open Graph', Boolean(content.seoOgTitle && content.seoOgDescription && content.seoOgLocale), 10, 'Complétez le titre, la description et la locale Open Graph.')
    add('Image sociale', Boolean(image && Number(image.width) >= 1200 && Number(image.height) >= 630), 15, 'Sélectionnez une image d’au moins 1200 × 630 px.')
    add('Carte X', Boolean(content.seoTwitterCard && content.seoTwitterTitle && content.seoTwitterDescription), 5, 'Complétez le format, le titre et la description X.')
    add('Données structurées', Boolean(content.seoOrganizationName && (content.seoOrganizationUrl || content.seoCanonicalUrl)), 10, 'Renseignez le nom et l’URL de l’organisation.')
    add('Catalogue descriptif', Number(products?.total) > 0 && Number(products?.complete) === Number(products?.total), 10, 'Chaque produit actif doit avoir une image et une description d’au moins 50 caractères.')
    add('Navigation indexable', Number(categories?.total) > 0 && Number(universes?.total) > 0, 5, 'Conservez des catégories et univers actifs avec des slugs uniques.')
    add('Outils webmasters', Boolean(content.seoGoogleVerification || content.seoBingVerification), 5, 'Ajoutez au moins une validation Google ou Bing.')
    const score = checks.reduce((sum, check) => sum + (check.passed ? check.points : 0), 0)
    return {
        score,
        grade: score >= 90 ? 'Excellent' : score >= 75 ? 'Bon' : score >= 50 ? 'À améliorer' : 'Insuffisant',
        checks,
        auditedAt: new Date().toISOString()
    }
})
