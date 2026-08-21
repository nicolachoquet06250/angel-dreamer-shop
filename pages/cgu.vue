<script setup lang="ts">
import {defaultSiteContent, type SiteContent} from '~/types/shop'
import styles from '~/assets/css/site.module.css'

const {data: content} = await useFetch<SiteContent>('/api/content', {default: () => ({...defaultSiteContent})})

if (!content.value?.cguContent) {
  throw createError({statusCode: 404, statusMessage: 'Page introuvable'})
}


useSeoMeta({
  title: `Conditions Générales d'Utilisation | ${content.value?.seoSiteName || 'Angel Dreamer'}`,
  robots: 'index, follow'
})
</script>
<template>
  <main>
    <StoreHeader
      :announcement="content?.announcement"
      :payment-label="content?.paymentLabel"
      :logo-text="content?.logoText"
    />
    <div :class="styles.legalPage">
      <NuxtLink to="/">← Retour à l'accueil</NuxtLink>
      <div :class="styles.legalContent" v-html="content?.cguContent ?? ''"></div>
    </div>
    <footer :class="styles.footer">
       <div :class="styles.footerMain">
         {{ content.footerBrand }}<i>•</i>
         <span>
          <span>
            <span>{{ content.footerText }}</span>
          </span>
          <span :class="styles.footerCopyright" />
        </span>
       </div>
       <nav :class="styles.footerLinks">
         <NuxtLink to="/contact">Contact</NuxtLink>
         <NuxtLink v-if="content?.cguContent" to="/cgu">CGU</NuxtLink>
         <NuxtLink v-if="content?.cgvContent" to="/cgv">CGV</NuxtLink>
       </nav>
     </footer>
  </main>
</template>
