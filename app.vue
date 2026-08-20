<script setup lang="ts">
import {defaultSiteContent, type SiteContent} from '~/types/shop'

const {data} = await useFetch<SiteContent>('/api/content', {default: () => ({...defaultSiteContent})})
const requestUrl = useRequestURL()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const baseUrl = computed(() => (data.value.seoCanonicalUrl || runtimeConfig.public.siteUrl || requestUrl.origin).replace(/\/$/, ''))
const socialImage = computed(() => data.value.seoOgImage ? `${baseUrl.value}${data.value.seoOgImage.content}?size=1200x630` : `${baseUrl.value}/og.png`)
const isHome = computed(() => route.path === '/')

useHead(() => ({
  htmlAttrs: {lang: data.value.seoLanguage || 'fr'},
  title: isHome.value ? data.value.seoTitle : undefined,
  link: [{rel: 'canonical', href: `${baseUrl.value}${route.path === '/' ? '' : route.path}`}],
  meta: [
    {name: 'keywords', content: data.value.seoKeywords},
    {name: 'robots', content: data.value.seoRobots},
    {name: 'author', content: data.value.seoAuthor},
    {name: 'theme-color', content: data.value.seoThemeColor},
    {name: 'google-site-verification', content: data.value.seoGoogleVerification || undefined},
    {name: 'msvalidate.01', content: data.value.seoBingVerification || undefined},
    {property: 'og:site_name', content: data.value.seoSiteName},
    {property: 'og:locale', content: data.value.seoOgLocale},
    {property: 'og:url', content: `${baseUrl.value}${route.path === '/' ? '' : route.path}`},
    {name: 'twitter:card', content: data.value.seoTwitterCard},
    {name: 'twitter:site', content: data.value.seoTwitterSite || undefined},
    {name: 'twitter:creator', content: data.value.seoTwitterCreator || undefined},
    ...(isHome.value ? [
      {name: 'description', content: data.value.seoDescription},
      {property: 'og:title', content: data.value.seoOgTitle || data.value.seoTitle},
      {property: 'og:description', content: data.value.seoOgDescription || data.value.seoDescription},
      {property: 'og:type', content: data.value.seoOgType},
      {property: 'og:image', content: socialImage.value},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {name: 'twitter:title', content: data.value.seoTwitterTitle || data.value.seoOgTitle},
      {name: 'twitter:description', content: data.value.seoTwitterDescription || data.value.seoOgDescription},
      {name: 'twitter:image', content: socialImage.value}
    ] : [])
  ],
  script: [{
    type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'OnlineStore',
      name: data.value.seoOrganizationName || data.value.seoSiteName,
      legalName: data.value.seoOrganizationLegalName || undefined,
      url: data.value.seoOrganizationUrl || baseUrl.value,
      email: data.value.seoOrganizationEmail || undefined,
      telephone: data.value.seoOrganizationPhone || undefined,
      logo: socialImage.value,
      address: data.value.seoOrganizationCountry ? {
        '@type': 'PostalAddress',
        addressCountry: data.value.seoOrganizationCountry
      } : undefined
    })
  }]
}))
</script>

<template>
  <NuxtPage/>
</template>
