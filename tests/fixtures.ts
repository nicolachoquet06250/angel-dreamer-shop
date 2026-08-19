import type {ImageAsset, Product} from '~/types/shop'

export const lightImage: ImageAsset = {
    id: 1,
    content: 'light.png',
    mimeType: 'image/png',
    width: 300,
    height: 200,
    naturalWidth: 600,
    naturalHeight: 400
}
export const darkImage: ImageAsset = {
    id: 2,
    content: 'dark.png',
    mimeType: 'image/png',
    width: 900,
    height: 700,
    naturalWidth: 900,
    naturalHeight: 700
}

export const product: Product = {
    id: 7,
    slug: 'mug-vague',
    name: 'Mug Vague rouge',
    description: 'Un mug imprimé en France.',
    priceCents: 1490,
    image: lightImage,
    categories: [{id: 2, label: 'Maison', slug: 'maison', position: 1, active: true}],
    universes: [], categoryIds: [2], universeIds: [], featured: true, featuredPosition: 1, active: true,
}
