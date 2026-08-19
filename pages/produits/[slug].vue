<script setup lang="ts">
import type {Product, SiteContent} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import cartIcon from '~/assets/icons/shopping-cart-white.png';
import styles from '~/assets/css/site.module.css';

const productStyles = useCssModule('productStyles');
const imageFor = useThemedImage();
const route = useRoute();
const {data: product, error} = await useFetch<Product>(`/api/products/${route.params.slug}`);
const {data: stored} = await useFetch<Partial<SiteContent>>('/api/content', {default: () => ({})});
const content = computed(() => ({...defaultSiteContent, ...stored.value}));
if (error.value) throw createError({statusCode: 404, statusMessage: 'Produit introuvable'});
const {add} = useShopCart();
const added = ref(false);

function addNow() {
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
}</style>
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
        <button :class="[styles.cta,productStyles.addToCart]" @click="addNow">
          <img :src="cartIcon" alt="" aria-hidden="true">
          <span>{{ added ? 'Ajouté au panier ✓' : 'Ajouter au panier' }}</span>
        </button>
      </div>
    </div>
    <footer :class="styles.footer"><strong>{{ content.footerBrand }}</strong><span>{{ content.footerText }}</span>
    </footer>
  </main>
</template>
