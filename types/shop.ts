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
    footerText: string
}
export const imageContentKeys = ['heroImage', 'value1Image', 'value2Image', 'value3Image', 'workshopImage'] as const
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
    footerText: 'Objets d’art du quotidien · © 2026'
}
export type CartLine = { product: Product; quantity: number }
