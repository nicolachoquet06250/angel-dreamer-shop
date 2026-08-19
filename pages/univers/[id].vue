<script setup lang="ts">
import type {Category, Product, SiteContent, Universe} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import styles from '~/assets/css/site.module.css';
import catalog from '~/assets/css/catalog.module.css';

const route = useRoute();
const router = useRouter();
const universeKey = String(route.params.id);
const {data: universes} = await useFetch<Universe[]>('/api/universes', {default: () => []});
const universe = computed(() => universes.value.find(item => String(item.id) === universeKey || item.slug === universeKey));
if (!universe.value) throw createError({statusCode: 404, statusMessage: 'Univers introuvable'});
const {data: categories} = await useFetch<Category[]>('/api/categories', {default: () => []});
const activeCategory = computed(() => String(route.params.category || route.query.categorie || ''));
if (route.query.categorie) await navigateTo(`/univers/${universe.value.slug || universe.value.id}/${route.query.categorie}`, {replace: true});
const {data: products} = await useFetch<Product[]>('/api/products', {
  query: computed(() => ({
    universe: universe.value?.id,
    category: activeCategory.value || undefined
  })), watch: [activeCategory], default: () => []
});
const {data: storedContent} = await useFetch<Partial<SiteContent>>('/api/content', {default: () => ({})});
const content = computed(() => ({...defaultSiteContent, ...storedContent.value}));

function filter(slug = '') {
  router.replace(slug ? `/univers/${universe.value?.slug || universe.value?.id}/${slug}` : `/univers/${universe.value?.slug || universe.value?.id}`)
}
</script>
<template>
  <main>
    <StoreHeader :announcement="content.announcement" :payment-label="content.paymentLabel"
                 :logo-text="content.logoText"/>
    <section :class="catalog.catalogPage"><small>{{ content.universeEyebrow }}</small>
      <h1>{{ universe?.title }}</h1>
      <nav :class="catalog.filterNav" aria-label="Filtrer les produits">
        <button :class="!activeCategory?catalog.filterActive:''" @click="filter()">{{ content.universeAllLabel }}
        </button>
        <button v-for="category in categories" :key="category.id"
                :class="activeCategory===category.slug?catalog.filterActive:''" @click="filter(category.slug)">
          {{ category.label }}
        </button>
      </nav>
      <div :class="styles.productGrid">
        <ProductCard v-for="product in products" :key="product.id" :product="product"/>
      </div>
      <p v-if="!products.length" :class="styles.empty">{{ content.universeEmptyText }}</p></section>
    <footer :class="styles.footer"><strong>{{ content.footerBrand }}</strong><span>{{ content.footerText }}</span>
    </footer>
  </main>
</template>
