<script setup lang="ts">
import type {Product, SiteContent} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import cartIcon from '~/assets/icons/shopping-cart-white.png';
import styles from '~/assets/css/site.module.css';
import {renderSeoTemplate} from '~/utils/seo-template';

const productStyles = useCssModule('productStyles');
const imageFor = useThemedImage();
const route = useRoute();
const {data: auth} = await useFetch<{user: {role: string} | null}>('/api/auth/me');
const cartDisabled = computed(() => auth.value?.user?.role === 'demo');
const {data: product, error} = await useFetch<Product>(`/api/products/${route.params.slug}`);
const {data: stored} = await useFetch<Partial<SiteContent>>('/api/content', {default: () => ({})});
const content = computed(() => ({...defaultSiteContent, ...stored.value}));
if (error.value) throw createError({statusCode: 404, statusMessage: 'Produit introuvable'});
const {add} = useShopCart();
const added = ref(false);
const origin = (useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/$/, '');
const productImage = computed(() => product.value?.image ? `${origin}${product.value.image.content}?size=1200x630` : undefined)
const configuredProductImage = computed(() => {
  const image = content.value.seoProductOgImage
  return image ? `${origin}${image.content}?size=1200x630` : undefined
})
const socialImage = computed(() => content.value.seoProductImageMode === 'library'
    ? (configuredProductImage.value || productImage.value)
    : productImage.value)
const seoValues = computed(() => ({
  'Nom du produit': product.value?.name, 'Description du produit': product.value?.description,
  'Prix': product.value ? `${(product.value.priceCents / 100).toFixed(2).replace('.', ',')} €` : '',
  ['Catégories']: product.value?.categories.map(item => item.label).join(', '),
  'Univers': product.value?.universes.map(item => item.title).join(', '), 'Nom du site': content.value.seoSiteName
}))
useSeoMeta({
  title: () => renderSeoTemplate(content.value.seoProductTitle, seoValues.value),
  description: () => renderSeoTemplate(content.value.seoProductDescription, seoValues.value),
  ogType: 'article',
  ogTitle: () => renderSeoTemplate(content.value.seoProductOgTitle, seoValues.value),
  ogDescription: () => renderSeoTemplate(content.value.seoProductOgDescription, seoValues.value),
  ogImage: socialImage,
  twitterTitle: () => renderSeoTemplate(content.value.seoProductOgTitle, seoValues.value),
  twitterDescription: () => renderSeoTemplate(content.value.seoProductOgDescription, seoValues.value),
  twitterImage: socialImage
})
useHead(() => ({
  script: product.value ? [{
    type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: product.value.name,
      description: product.value.description, image: productImage.value,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: (product.value.priceCents / 100).toFixed(2),
        availability: 'https://schema.org/InStock',
        url: `${origin}/produits/${product.value.slug}`
      }
    })
  }] : []
}))

function addNow() {
  if (cartDisabled.value) return;
  if (product.value) add(product.value);
  added.value = true
}
</script>
<style module="productStyles">.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column
}

.detail {
  flex: 1
}

.addToCart {
  justify-content: flex-start;
  gap: 10px
}

.addToCart img {
  width: 20px;
  height: 20px;
  flex: 0 0 auto
}
.addToCart:disabled { cursor:not-allowed; opacity:.55 }
</style>
<template>
  <main :class="productStyles.page">
    <StoreHeader :announcement="content.announcement" :payment-label="content.paymentLabel"
                 :logo-text="content.logoText"/>
    <div v-if="product" :class="[styles.detail,productStyles.detail]">
      <div :class="styles.detailImage">
        <img v-if="imageFor(product.image)"
             :src="imageFor(product.image)?.content + `?size=${imageFor(product.image)?.width}x${imageFor(product.image)?.height}`"
             :alt="product.name"
             :width="imageFor(product.image)?.width"
             :height="imageFor(product.image)?.height">
      </div>
      <div :class="styles.detailCopy">
        <NuxtLink to="/">< Collection</NuxtLink>
        <small>{{ product.categories.map(item => item.label).join(' · ') }}</small>
        <h1>{{ product.name }}</h1><strong>{{ (product.priceCents / 100).toFixed(2).replace('.', ',') }} €</strong>
        <p>{{ product.description }}</p>
        <ul>
          <li>Imprimé à la demande en France</li>
          <li>Encres à base d’eau</li>
          <li>Expédition sous 3 à 5 jours ouvrés</li>
        </ul>
        <button :class="[styles.cta,productStyles.addToCart]" :disabled="cartDisabled" :title="cartDisabled ? 'Panier indisponible en mode démonstration' : undefined" @click="addNow">
          <img :src="cartIcon" alt="" aria-hidden="true">
          <span>{{ cartDisabled ? 'Panier indisponible en mode démo' : added ? 'Ajouté au panier ✓' : 'Ajouter au panier' }}</span>
        </button>
      </div>
    </div>
    <footer :class="styles.footer"><strong>{{ content.footerBrand }}</strong><span>{{ content.footerText }}</span>
    </footer>
  </main>
</template>
