import type {Category, Product, SiteContent, Universe} from '~/types/shop'

export type ValidationLevel = 'error' | 'warning' | 'info'

export interface ValidationIssue {
    field: string
    level: ValidationLevel
    message: string
}

const issue = (field: string, level: ValidationLevel, message: string): ValidationIssue => ({field, level, message})
const empty = (value: unknown) => !String(value ?? '').trim()
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function hasValidationErrors(issues: ValidationIssue[]) {
    return issues.some(item => item.level === 'error')
}

export function validateHomeContent(content: SiteContent, categories: Category[], universes: Universe[], favoriteIds: number[]) {
    const issues: ValidationIssue[] = []
    for (const key of ['announcement', 'logoText', 'heroTitle', 'heroSubtitle', 'heroCta'] as const) {
        if (empty(content[key])) issues.push(issue(key, 'error', 'Ce champ est obligatoire.'))
    }
    if (!content.heroImage) issues.push(issue('heroImage', 'warning', 'Une image principale améliore fortement la présentation de la page.'))
    if (String(content.heroTitle).trim().length < 20) issues.push(issue('heroTitle', 'info', 'Un titre plus descriptif aide les visiteurs à comprendre immédiatement l’offre.'))

    const categorySlugs = new Set<string>()
    categories.forEach((category, index) => {
        if (empty(category.label)) issues.push(issue(`categories.${index}.label`, 'error', 'Le label est obligatoire.'))
        if (!slugPattern.test(category.slug || '')) issues.push(issue(`categories.${index}.slug`, 'error', 'Utilisez uniquement des minuscules, chiffres et tirets.'))
        if (categorySlugs.has(category.slug)) issues.push(issue(`categories.${index}.slug`, 'error', 'Ce slug est déjà utilisé.'))
        categorySlugs.add(category.slug)
    })

    const universeSlugs = new Set<string>()
    universes.forEach((universe, index) => {
        if (empty(universe.title)) issues.push(issue(`universes.${index}.title`, 'error', 'Le nom de l’univers est obligatoire.'))
        if (universe.slug && !slugPattern.test(universe.slug)) issues.push(issue(`universes.${index}.slug`, 'error', 'Utilisez uniquement des minuscules, chiffres et tirets.'))
        if (universe.slug && universeSlugs.has(universe.slug)) issues.push(issue(`universes.${index}.slug`, 'error', 'Ce slug est déjà utilisé.'))
        if (universe.slug) universeSlugs.add(universe.slug)
        if (!universe.image) issues.push(issue(`universes.${index}.image`, 'warning', 'Cet univers sera plus facilement identifiable avec une image.'))
    })
    if (!universes.length) issues.push(issue('universes', 'warning', 'Ajoutez au moins un univers pour structurer le catalogue.'))
    if (!categories.length) issues.push(issue('categories', 'error', 'Ajoutez au moins une catégorie de navigation.'))
    if (!favoriteIds.length) issues.push(issue('favoriteIds', 'info', 'Aucun favori ne sera affiché sur la page d’accueil.'))
    if (favoriteIds.length > 4) issues.push(issue('favoriteIds', 'error', 'La sélection est limitée à quatre produits.'))
    return issues
}

export function validateCategoryPage(content: SiteContent) {
    const issues: ValidationIssue[] = []
    if (empty(content.categoryEyebrow)) issues.push(issue('categoryEyebrow', 'warning', 'Le surtitre permet de contextualiser la page.'))
    if (empty(content.categoryDescription)) issues.push(issue('categoryDescription', 'error', 'Le texte d’introduction est obligatoire.'))
    if (String(content.categoryDescription).trim().length < 60) issues.push(issue('categoryDescription', 'info', 'Une introduction d’au moins 60 caractères est généralement plus utile.'))
    if (empty(content.categoryEmptyText)) issues.push(issue('categoryEmptyText', 'error', 'Précisez le message affiché lorsqu’aucun produit n’est disponible.'))
    return issues
}

export function validateUniversePage(content: SiteContent) {
    const issues: ValidationIssue[] = []
    if (empty(content.universeEyebrow)) issues.push(issue('universeEyebrow', 'warning', 'Le surtitre permet de contextualiser la page.'))
    if (empty(content.universeAllLabel)) issues.push(issue('universeAllLabel', 'error', 'Le libellé du filtre global est obligatoire.'))
    if (empty(content.universeEmptyText)) issues.push(issue('universeEmptyText', 'error', 'Précisez le message affiché lorsqu’aucun produit ne correspond.'))
    return issues
}

export function validateSeo(content: SiteContent) {
    const issues: ValidationIssue[] = []
    const title = String(content.seoTitle || '').trim()
    const description = String(content.seoDescription || '').trim()
    if (!title) issues.push(issue('seoTitle', 'error', 'Le titre SEO est obligatoire.'))
    else if (title.length < 30) issues.push(issue('seoTitle', 'warning', 'Un titre entre 30 et 60 caractères est recommandé.'))
    if (title.length > 60) issues.push(issue('seoTitle', 'warning', 'Le titre risque d’être tronqué au-delà de 60 caractères.'))
    if (!description) issues.push(issue('seoDescription', 'error', 'La meta description est obligatoire.'))
    else if (description.length < 120) issues.push(issue('seoDescription', 'warning', 'Visez 120 à 160 caractères pour une description plus informative.'))
    if (description.length > 160) issues.push(issue('seoDescription', 'error', 'La meta description ne doit pas dépasser 160 caractères.'))
    if (content.seoCanonicalUrl) {
        try {
            new URL(content.seoCanonicalUrl)
        } catch {
            issues.push(issue('seoCanonicalUrl', 'error', 'Saisissez une URL absolue valide.'))
        }
    } else issues.push(issue('seoCanonicalUrl', 'info', 'Sans URL canonique explicite, l’adresse courante sera utilisée.'))
    if (!content.seoOgImage) issues.push(issue('seoOgImage', 'warning', 'Ajoutez une image Open Graph pour les partages sociaux.'))
    return issues
}

export function validateCartSeo(content: SiteContent) {
    const issues: ValidationIssue[] = []
    if (empty(content.seoCartTitle)) issues.push(issue('seoCartTitle', 'error', 'Le titre de la page panier est obligatoire.'))
    return issues
}

export function validateProfileSeo(content: SiteContent) {
    const issues: ValidationIssue[] = []
    if (empty(content.seoProfileTitle)) issues.push(issue('seoProfileTitle', 'error', 'Le titre de la page profil est obligatoire.'))
    return issues
}

export function validateProduct(product: Product) {
    const issues: ValidationIssue[] = []
    if (empty(product.name)) issues.push(issue('product.name', 'error', 'Le nom du produit est obligatoire.'))
    if (!slugPattern.test(product.slug || '')) issues.push(issue('product.slug', 'error', 'Utilisez uniquement des minuscules, chiffres et tirets.'))
    if (!Number.isInteger(product.priceCents) || product.priceCents < 1) issues.push(issue('product.priceCents', 'error', 'Le prix doit être un nombre entier supérieur à zéro.'))
    if (!product.categoryIds.length) issues.push(issue('product.categoryIds', 'error', 'Sélectionnez au moins une catégorie.'))
    if (!product.universeIds.length) issues.push(issue('product.universeIds', 'error', 'Sélectionnez au moins un univers.'))
    if (empty(product.description)) issues.push(issue('product.description', 'error', 'La description est obligatoire.'))
    else if (product.description.trim().length < 80) issues.push(issue('product.description', 'warning', 'Une description plus détaillée rassurera davantage les acheteurs.'))
    if (!product.image) issues.push(issue('product.image', 'warning', 'Le produit sera enregistré sans image.'))
    if (!product.active) issues.push(issue('product.active', 'info', 'Le produit restera masqué dans la boutique.'))
    return issues
}
