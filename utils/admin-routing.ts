export type AdminPageTab = 'content' | 'category' | 'universe' | 'cart' | 'profile' | 'contact' | 'cgu' | 'cgv'
export type AdminSeoSection = 'home' | 'product' | 'universe' | 'universeCategory' | 'category'
export type AdminMainTab = 'pages' | 'seo' | 'products' | 'promotions' | 'users'
export type AdminTab = AdminPageTab | Exclude<AdminMainTab, 'pages'>

type AdminSubTab<T extends string> = Readonly<{
    id: T
    label: string
    slug: string
}>

export const adminPageTabs = [
    {id: 'content', label: 'Page d’accueil', slug: 'accueil'},
    {id: 'category', label: 'Page catégorie', slug: 'categorie'},
    {id: 'universe', label: 'Page univers', slug: 'univers'},
    {id: 'cart', label: 'Page panier', slug: 'panier'},
    {id: 'profile', label: 'Page profil', slug: 'profil'},
    {id: 'contact', label: 'Page contact', slug: 'contact'},
    {id: 'cgu', label: 'Page CGU', slug: 'cgu'},
    {id: 'cgv', label: 'Page CGV', slug: 'cgv'}
] as const satisfies readonly AdminSubTab<AdminPageTab>[]

export const adminSeoTabs = [
    {id: 'home', label: 'Page d’accueil', slug: 'accueil'},
    {id: 'product', label: 'Pages produit', slug: 'produits'},
    {id: 'universe', label: 'Pages univers', slug: 'univers'},
    {id: 'universeCategory', label: 'Page catégories d’univers', slug: 'categories-univers'},
    {id: 'category', label: 'Pages catégorie', slug: 'categories'}
] as const satisfies readonly AdminSubTab<AdminSeoSection>[]

export type AdminRouteState = Readonly<{
    mainTab: AdminMainTab
    activeTab: AdminTab
    pageTab: AdminPageTab
    seoSection: AdminSeoSection
    canonicalPath: string
}>

export function adminPagePath(id: AdminPageTab): string {
    const tab = adminPageTabs.find(item => item.id === id)
    return `/admin/pages/${tab!.slug}`
}

export function adminSeoPath(id: AdminSeoSection): string {
    const tab = adminSeoTabs.find(item => item.id === id)
    return `/admin/seo/${tab!.slug}`
}

function routeSegments(value: unknown): string[] {
    if (typeof value === 'string' && value) return [value]
    if (Array.isArray(value) && value.every(segment => typeof segment === 'string')) return value
    return []
}

function pageState(pageTab: AdminPageTab): AdminRouteState {
    return {
        mainTab: 'pages',
        activeTab: pageTab,
        pageTab,
        seoSection: 'home',
        canonicalPath: adminPagePath(pageTab)
    }
}

function seoState(seoSection: AdminSeoSection): AdminRouteState {
    return {
        mainTab: 'seo',
        activeTab: 'seo',
        pageTab: 'content',
        seoSection,
        canonicalPath: adminSeoPath(seoSection)
    }
}

function mainState(mainTab: 'products' | 'promotions' | 'users'): AdminRouteState {
    return {
        mainTab,
        activeTab: mainTab,
        pageTab: 'content',
        seoSection: 'home',
        canonicalPath: `/admin/${mainTab}`
    }
}

export function resolveAdminRoute(routeParam?: unknown, queryTab?: unknown): AdminRouteState {
    const path = routeSegments(routeParam)
    const segments = path.length ? path : routeSegments(queryTab)

    if (segments.length === 2 && segments[0] === 'pages') {
        const page = adminPageTabs.find(item => item.slug === segments[1])
        if (page) return pageState(page.id)
    }

    if (segments.length === 2 && segments[0] === 'seo') {
        const section = adminSeoTabs.find(item => item.slug === segments[1])
        if (section) return seoState(section.id)
    }

    if (segments.length === 1) {
        const legacyPage = adminPageTabs.find(item => item.id === segments[0])
        if (legacyPage) return pageState(legacyPage.id)
        if (segments[0] === 'seo') return seoState('home')
        if (segments[0] === 'products' || segments[0] === 'promotions' || segments[0] === 'users') {
            return mainState(segments[0])
        }
    }

    return pageState('content')
}