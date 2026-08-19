<script setup lang="ts">
import styles from '~/assets/css/site.module.css';

const imageFor = useThemedImage();
const {cart, total, remove} = useShopCart();
const loading = ref('');
const error = ref('');

async function pay(provider: 'stripe' | 'paypal') {
  loading.value = provider;
  error.value = '';
  try {
    const data = await $fetch<{ url: string }>(`/api/checkout/${provider}`, {
      method: 'POST',
      body: {lines: cart.value.map(l => ({id: l.product.id, quantity: l.quantity}))}
    });
    if (data.url) location.href = data.url
  } catch (e: any) {
    if (e?.statusCode === 401 || e?.response?.status === 401) {
      await navigateTo('/connexion?returnTo=/panier');
      return
    }
    error.value = e?.data?.statusMessage || 'Le paiement est momentanément indisponible.'
  } finally {
    loading.value = ''
  }
}
</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.cartPage">
      <NuxtLink to="/">< Continuer mes achats</NuxtLink>
      <h1>Votre panier</h1>
      <div v-if="!cart.length" :class="styles.empty">Votre panier est vide.</div>
      <template v-else>
        <div v-for="line in cart" :key="line.product.id" :class="styles.cartLine"><img
            v-if="imageFor(line.product.image)" :src="imageFor(line.product.image)?.content" :alt="line.product.name"
            :width="imageFor(line.product.image)?.width" :height="imageFor(line.product.image)?.height">
          <div><h3>{{ line.product.name }}</h3><span>Quantité : {{ line.quantity }}</span></div>
          <strong>{{ (line.product.priceCents * line.quantity / 100).toFixed(2).replace('.', ',') }} €</strong>
          <button @click="remove(line.product.id)">Retirer</button>
        </div>
        <div :class="styles.checkout">
          <div><span>Total</span><strong>{{ (total / 100).toFixed(2).replace('.', ',') }} €</strong></div>
          <p>Choisissez votre moyen de paiement sécurisé :</p>
          <button @click="pay('stripe')" :disabled="!!loading">
            {{ loading === 'stripe' ? 'Redirection…' : 'Payer par carte avec Stripe' }}
          </button>
          <button :class="styles.paypal" @click="pay('paypal')" :disabled="!!loading">
            {{ loading === 'paypal' ? 'Redirection…' : 'Payer avec PayPal' }}
          </button>
          <small v-if="error">{{ error }}</small></div>
      </template>
    </div>
  </main>
</template>
