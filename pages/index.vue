<script setup lang="ts">
import type {Product, SiteContent, Universe} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import styles from '~/assets/css/site.module.css';
import engagementStyles from '~/assets/css/engagement-icons.module.css';
import catalog from '~/assets/css/catalog.module.css'

const managed = useCssModule('managed')
const imageFor = useThemedImage();
const {data: auth} = await useFetch<{ user: { role: string } | null }>('/api/auth/me');
const cartDisabled = computed(() => auth.value?.user?.role === 'demo');
const {data: allProducts} = await useFetch<Product[]>('/api/products', {default: () => []});
const products = computed(() => allProducts.value.filter(product => product.featured).slice(0, 4));
const {data: universes} = await useFetch<Universe[]>('/api/universes', {default: () => []});
const {data: stored} = await useFetch<Partial<SiteContent>>('/api/content', {default: () => ({})});
const content = computed(() => ({...defaultSiteContent, ...stored.value}))
</script>
<style module="managed">.hero {
  background-image: none
}</style>
<template>
  <main>
    <StoreHeader :announcement="content.announcement" :payment-label="content.paymentLabel"
                 :logo-text="content.logoText"/>
    <section :class="styles.hero">
      <div :class="styles.heroCopy"><h1>{{ content.heroTitle }}</h1><i></i>
        <p>{{ content.heroSubtitle }}</p><a href="#selection" :class="styles.cta">{{ content.heroCta }} <b>></b></a>
      </div>
      <div :class="[styles.heroImage,managed.hero]">
        <img v-if="imageFor(content.heroImage)"
             :src="imageFor(content.heroImage)?.content + `?size=${imageFor(content.heroImage)?.width}x${imageFor(content.heroImage)?.height}`"
             alt=""
             fetchpriority="high" loading="eager" decoding="async">
      </div>
    </section>
    <section :class="styles.values"><span :class="engagementStyles.publicItem">
      <img v-if="imageFor(content.value1Image)"
           :src="imageFor(content.value1Image)?.content + `?size=${imageFor(content.value1Image)?.width}x${imageFor(content.value1Image)?.height}`"
           alt=""><b>{{ content.value1 }}</b></span><span
        :class="engagementStyles.publicItem">
      <img v-if="imageFor(content.value2Image)"
           :src="imageFor(content.value2Image)?.content + `?size=${imageFor(content.value2Image)?.width}x${imageFor(content.value2Image)?.height}`"
           alt="">
      <b>{{ content.value2 }}</b></span><span
        :class="engagementStyles.publicItem">
      <img v-if="imageFor(content.value3Image)"
           :src="imageFor(content.value3Image)?.content + `?size=${imageFor(content.value3Image)?.width}x${imageFor(content.value3Image)?.height}`"
           alt="">
      <b>{{ content.value3 }}</b></span></section>
    <div :class="styles.container">
      <section id="univers">
        <div :class="styles.sectionTitle"><small>{{ content.universesEyebrow }}</small>
          <h2>{{ content.universesTitle }}</h2></div>
        <HorizontalCarousel :track-class="styles.universes" label="les univers">
          <NuxtLink v-for="item in universes" :key="item.id" :to="`/univers/${item.slug||item.id}`"
                    :class="catalog.universeCard"
                    :style="imageFor(item.image)?{backgroundImage:`linear-gradient(#0002,#0008),url(${imageFor(item.image)?.content})`,backgroundSize:'cover',backgroundPosition:'center'}:{}">
            <span>{{ item.title }}</span><b>></b></NuxtLink>
        </HorizontalCarousel>
      </section>
      <section id="selection">
        <div :class="styles.sectionTitle"><small>{{ content.favoritesEyebrow }}</small>
          <h2>{{ content.favoritesTitle }}</h2></div>
        <div :class="styles.productGrid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" :cart-disabled="cartDisabled"/>
        </div>
      </section>
      <section :class="styles.workshop">
        <img v-if="imageFor(content.workshopImage)"
             :src="imageFor(content.workshopImage)?.content + `?size=${imageFor(content.workshopImage)?.width}x${imageFor(content.workshopImage)?.height}`"
             :width="imageFor(content.workshopImage)?.width"
             :height="imageFor(content.workshopImage)?.height"
             alt="">
        <b v-else>▤</b>
        <div><small>{{ content.workshopEyebrow }}</small>
          <h2>{{ content.workshopTitle }}</h2>
          <p>{{ content.workshopText }}</p></div>
      </section>
    </div>
    <footer :class="styles.footer">
      <div :class="styles.footerMain">
        <span>
          {{ content.footerBrand }}<i>•</i>
        </span>
        <span>
          <span>
            <span>{{ content.footerText }}</span>
          </span>
          <span :class="styles.footerCopyright"/>
        </span>
      </div>
      <nav :class="styles.footerLinks">
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink v-if="content.cguContent" to="/cgu">CGU</NuxtLink>
        <NuxtLink v-if="content.cgvContent" to="/cgv">CGV</NuxtLink>
      </nav>
    </footer>
  </main>
</template>
