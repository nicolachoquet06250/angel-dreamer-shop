<script setup lang="ts">
import type {Category} from '~/types/shop';
import styles from '~/assets/css/site.module.css'

withDefaults(defineProps<{
  announcement?: string;
  paymentLabel?: string;
  logoText?: string
}>(), {paymentLabel: 'Paiement sécurisé', logoText: 'ANGEL DREAMER'})
const {count} = useShopCart();
const menu = ref(false);
const dark = useState('theme', () => false);
const {data: session} = await useFetch<{ user: { email: string; role: string } | null }>('/api/auth/me');
const {data: categories} = await useFetch<Category[]>('/api/categories', {default: () => []})
onMounted(() => {
  dark.value = localStorage.getItem('angel-theme') === 'dark';
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
})

function toggle() {
  dark.value = !dark.value;
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light';
  localStorage.setItem('angel-theme', dark.value ? 'dark' : 'light')
}
</script>
<template>
  <div :class="styles.announcement">
    {{ announcement || '🇫🇷 Imprimé en France · Livraison dès 3,90 €' }}<span>{{ paymentLabel }}</span></div>
  <header :class="styles.header">
    <button :class="styles.menuButton" @click="menu=!menu" aria-label="Menu">☰</button>
    <NuxtLink to="/" :class="styles.logo">{{ logoText }}<i>.</i></NuxtLink>
    <nav :class="[styles.nav,menu&&styles.navOpen]">
      <NuxtLink v-for="category in categories" :key="category.id" :to="`/categories/${category.slug}`">
        {{ category.label }}
      </NuxtLink>
      <NuxtLink v-if="['admin','demo'].includes(session?.user?.role || '')" to="/admin">Administrer</NuxtLink>
    </nav>
    <div :class="styles.headerActions">
      <button @click="toggle" :aria-label="dark?'Mode clair':'Mode sombre'">{{ dark ? '☾' : '☀' }}</button>
      <NuxtLink :to="session?.user?'/compte':'/connexion'" :aria-label="session?.user?'Mon compte':'Se connecter'">♙
      </NuxtLink>
      <NuxtLink v-if="session?.user?.role!=='demo'" to="/panier" :class="styles.bag">▢<b>{{ count }}</b></NuxtLink>
    </div>
  </header>
</template>
