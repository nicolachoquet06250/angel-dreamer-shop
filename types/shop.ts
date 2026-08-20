export type ImageAsset = {
    id: number;
    content: string;
    mimeType: string;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
    darkVariant?: ImageAsset | null
}
export type Universe = {
    id: number;
    title: string;
    slug: string;
    image: ImageAsset | null;
    position: number;
    active: boolean
}
export type Category = { id: number; label: string; slug: string; position: number; active: boolean }
export type Product = {
    id: number;
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    image: ImageAsset | null;
    categories: Category[];
    universes: Universe[];
    categoryIds: number[];
    universeIds: number[];
    featured: boolean;
    featuredPosition: number | null;
    active: boolean
}
export type SiteContent = {
    announcement: string;
    paymentLabel: string;
    logoText: string;
    navNew: string;
    navClothes: string;
    navHome: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroImage: ImageAsset | null;
    value1: string;
    value1Image: ImageAsset | null;
    value2: string;
    value2Image: ImageAsset | null;
    value3: string;
    value3Image: ImageAsset | null;
    universesEyebrow: string;
    universesTitle: string;
    favoritesEyebrow: string;
    favoritesTitle: string;
    workshopEyebrow: string;
    workshopTitle: string;
    workshopText: string;
    workshopImage: ImageAsset | null;
    categoryEyebrow: string;
    categoryDescription: string;
    categoryEmptyText: string;
    universeEyebrow: string;
    universeAllLabel: string;
    universeEmptyText: string;
    footerBrand: string;
    footerText: string;
    seoSiteName: string;
    seoTitle: string;
    seoTitleTemplate: string;
    seoDescription: string;
    seoKeywords: string;
    seoCanonicalUrl: string;
    seoRobots: string;
    seoAuthor: string;
    seoLanguage: string;
    seoThemeColor: string;
    seoGoogleVerification: string;
    seoBingVerification: string;
    seoOgTitle: string;
    seoOgDescription: string;
    seoOgType: string;
    seoOgLocale: string;
    seoOgImage: ImageAsset | null;
    seoTwitterCard: string;
    seoTwitterSite: string;
    seoTwitterCreator: string;
    seoTwitterTitle: string;
    seoTwitterDescription: string;
    seoOrganizationName: string;
    seoOrganizationLegalName: string;
    seoOrganizationUrl: string;
    seoOrganizationEmail: string;
    seoOrganizationPhone: string;
    seoOrganizationCountry: string;
    seoProductTitle: string;
    seoProductDescription: string;
    seoProductOgTitle: string;
    seoProductOgDescription: string;
    seoProductImageMode: string;
    seoProductOgImage: ImageAsset | null;
    seoUniverseTitle: string;
    seoUniverseDescription: string;
    seoUniverseOgTitle: string;
    seoUniverseOgDescription: string;
    seoCategoryTitle: string;
    seoCategoryDescription: string;
    seoCategoryOgTitle: string;
    seoCategoryOgDescription: string;
    seoUniverseCategoryTitle: string;
    seoUniverseCategoryDescription: string;
    seoUniverseCategoryOgTitle: string;
    seoUniverseCategoryOgDescription: string
}
export const imageContentKeys = ['heroImage', 'value1Image', 'value2Image', 'value3Image', 'workshopImage', 'seoOgImage', 'seoProductOgImage'] as const
export type ImageContentKey = typeof imageContentKeys[number]
export const defaultSiteContent: SiteContent = {
    announcement: '🇫🇷 Imprimé en France · Livraison dès 3,90 €',
    paymentLabel: 'Paiement sécurisé',
    logoText: 'ANGEL DREAMER',
    navNew: 'Nouveautés',
    navClothes: 'Vêtements',
    navHome: 'Maison & déco',
    heroTitle: 'DES OBJETS QUI VOUS RESSEMBLENT.',
    heroSubtitle: 'Imprimés à la demande dans notre atelier en France.',
    heroCta: 'Découvrir la collection',
    heroImage: null,
    value1: 'Imprimé en France',
    value1Image: null,
    value2: 'À la demande',
    value2Image: null,
    value3: 'Encres à base d’eau',
    value3Image: null,
    universesEyebrow: 'EXPLOREZ',
    universesTitle: 'Nos univers',
    favoritesEyebrow: 'SÉLECTION',
    favoritesTitle: 'Les favoris du moment',
    workshopEyebrow: 'NOTRE SAVOIR-FAIRE',
    workshopTitle: 'Un atelier en France',
    workshopText: 'Chaque commande est imprimée avec soin, uniquement pour vous.',
    workshopImage: null,
    categoryEyebrow: 'COLLECTION',
    categoryDescription: 'Découvrez tous les produits disponibles dans cette catégorie.',
    categoryEmptyText: 'Aucun produit n’est encore disponible dans cette catégorie.',
    universeEyebrow: 'UNIVERS',
    universeAllLabel: 'Tout',
    universeEmptyText: 'Aucun produit ne correspond à ce filtre dans cet univers.',
    footerBrand: 'ANGEL DREAMER.',
    footerText: 'Objets d’art du quotidien · © 2026',
    seoSiteName: 'Angel Dreamer',
    seoTitle: 'Angel Dreamer — Objets imprimés en France',
    seoTitleTemplate: '',
    seoDescription: 'Objets physiques originaux, imprimés à la demande en France.',
    seoKeywords: 'objets imprimés, décoration, vêtements, fabrication française',
    seoCanonicalUrl: '',
    seoRobots: 'index, follow, max-image-preview:large',
    seoAuthor: 'Angel Dreamer',
    seoLanguage: 'fr',
    seoThemeColor: '#ef402d',
    seoGoogleVerification: '',
    seoBingVerification: '',
    seoOgTitle: 'Angel Dreamer — Des objets qui vous ressemblent',
    seoOgDescription: 'Découvrez des objets originaux imprimés à la demande dans notre atelier en France.',
    seoOgType: 'website',
    seoOgLocale: 'fr_FR',
    seoOgImage: null,
    seoTwitterCard: 'summary_large_image',
    seoTwitterSite: '',
    seoTwitterCreator: '',
    seoTwitterTitle: 'Angel Dreamer — Des objets qui vous ressemblent',
    seoTwitterDescription: 'Objets originaux imprimés à la demande en France.',
    seoOrganizationName: 'Angel Dreamer',
    seoOrganizationLegalName: '',
    seoOrganizationUrl: '',
    seoOrganizationEmail: '',
    seoOrganizationPhone: '',
    seoOrganizationCountry: 'FR',
    seoProductTitle: '[Nom du produit] · [Nom du site]',
    seoProductDescription: '[Description du produit] Disponible à [Prix] sur [Nom du site].',
    seoProductOgTitle: '[Nom du produit] · [Nom du site]',
    seoProductOgDescription: '[Description du produit]',
    seoProductImageMode: 'product',
    seoProductOgImage: null,
    seoUniverseTitle: '[Nom de l’univers] · [Nom du site]',
    seoUniverseDescription: 'Découvrez les produits de l’univers [Nom de l’univers] sur [Nom du site].',
    seoUniverseOgTitle: '[Nom de l’univers] · [Nom du site]',
    seoUniverseOgDescription: 'Explorez notre sélection [Nom de l’univers].',
    seoCategoryTitle: '[Nom de la catégorie] · [Nom du site]',
    seoCategoryDescription: 'Découvrez tous nos produits [Nom de la catégorie] sur [Nom du site].',
    seoCategoryOgTitle: '[Nom de la catégorie] · [Nom du site]',
    seoCategoryOgDescription: 'Découvrez notre sélection [Nom de la catégorie].',
    seoUniverseCategoryTitle: '[Nom de la catégorie] — [Nom de l’univers] · [Nom du site]',
    seoUniverseCategoryDescription: 'Découvrez les produits [Nom de la catégorie] de l’univers [Nom de l’univers] sur [Nom du site].',
    seoUniverseCategoryOgTitle: '[Nom de la catégorie] — [Nom de l’univers]',
    seoUniverseCategoryOgDescription: 'Explorez notre sélection [Nom de la catégorie] dans l’univers [Nom de l’univers].'
}
export type CartLine = { product: Product; quantity: number }
