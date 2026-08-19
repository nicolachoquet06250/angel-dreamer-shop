<script setup lang="ts">
import type {Category, Product, SiteContent} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import styles from '~/assets/css/site.module.css';
import catalog from '~/assets/css/catalog.module.css';

const route = useRoute();
const {data: categories} = await useFetch<Category[]>('/api/categories', {default: () => []});
const category = computed(() => categories.value.find(item => item.slug === String(route.params.slug)));
if (!category.value) throw createError({statusCode: 404, statusMessage: 'Catégorie introuvable'});
const {data: products} = await useFetch<Product[]>('/api/products', {
  query: {category: String(route.params.slug)},
  default: () => []
});
const {data: storedContent} = await useFetch<Partial<SiteContent>>('/api/content', {default: () => ({})});
const content = computed(() => ({...defaultSiteContent, ...storedContent.value}))
</script>
<template>
  <main>
    <StoreHeader :announcement="content.announcement" :payment-label="content.paymentLabel"
                 :logo-text="content.logoText"/>
    <section :class="catalog.catalogPage"><small>{{ content.categoryEyebrow }}</small>
      <h1>{{ category?.label }}</h1>
      <p>{{ content.categoryDescription }}</p>
      <div :class="styles.productGrid">
        <ProductCard v-for="product in products" :key="product.id" :product="product"/>
      </div>
      <p v-if="!products.length" :class="styles.empty">{{ content.categoryEmptyText }}</p></section>
    <footer :class="styles.footer"><strong>{{ content.footerBrand }}</strong><span>{{ content.footerText }}</span>
    </footer>
  </main>
</template>
