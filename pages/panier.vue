<script setup lang="ts">
import styles from '~/assets/css/site.module.css';
import {renderSeoTemplate} from '~/utils/seo-template';

const {data: content} = await useFetch<any>('/api/content');
useSeoMeta({
  title: () => renderSeoTemplate(content.value?.seoCartTitle, {'Nom du site': content.value?.seoSiteName})
});

const imageFor = useThemedImage();
const {data: auth} = await useFetch<{user: {role: string} | null}>('/api/auth/me');
const cartDisabled = computed(() => auth.value?.user?.role === 'demo');
const {cart, total, remove} = useShopCart();
const totalDiscounted = computed(() => cart.value.reduce((s, l) => {
  const price = l.product.discountedPriceCents ?? l.product.priceCents;
  return s + price * l.quantity;
}, 0));
const loading = ref('');
const error = ref('');

const promoCode = ref('');
const promoInput = ref('');
const promoError = ref('');
const promoSuccess = ref('');
const promoLoading = ref(false);

async function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (!code) return;
  promoLoading.value = true;
  promoError.value = '';
  promoSuccess.value = '';
  try {
    await $fetch('/api/promo-codes/validate', {
      method: 'POST',
      body: {code, lines: cart.value.map(l => ({id: l.product.id, quantity: l.quantity}))}
    });
    promoCode.value = code;
    promoSuccess.value = `Code « ${code} » appliqué.`;
  } catch (e: any) {
    promoCode.value = '';
    promoError.value = e?.data?.statusMessage || 'Code promo invalide.';
  } finally {
    promoLoading.value = false;
  }
}

function removePromo() {
  promoCode.value = '';
  promoInput.value = '';
  promoError.value = '';
  promoSuccess.value = '';
}

async function pay(provider: 'stripe' | 'paypal') {
  if (cartDisabled.value) return;
  loading.value = provider;
  error.value = '';
  try {
    const body: Record<string, unknown> = {lines: cart.value.map(l => ({id: l.product.id, quantity: l.quantity}))};
    if (promoCode.value) body.promoCode = promoCode.value;
    const data = await $fetch<{ url: string }>(`/api/checkout/${provider}`, {method: 'POST', body});
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
      <div v-if="cartDisabled" :class="styles.empty">Le panier est indisponible avec un compte de démonstration.</div>
      <div v-else-if="!cart.length" :class="styles.empty">Votre panier est vide.</div>
      <template v-else>
        <div v-for="line in cart" :key="line.product.id" :class="styles.cartLine"><img
            v-if="imageFor(line.product.image)" :src="imageFor(line.product.image)?.content" :alt="line.product.name"
            :width="imageFor(line.product.image)?.width" :height="imageFor(line.product.image)?.height">
          <div><h3>{{ line.product.name }}</h3><span>Quantité : {{ line.quantity }}</span></div>
          <div :class="styles.cartLinePrice">
            <template v-if="line.product.discountedPriceCents != null">
              <strong :class="styles.cartLineDiscounted">{{
                  (line.product.discountedPriceCents * line.quantity / 100).toFixed(2).replace('.', ',')
                }} €</strong>
              <span :class="styles.cartLineOriginal">{{
                  (line.product.priceCents * line.quantity / 100).toFixed(2).replace('.', ',')
                }} €</span>
            </template>
            <strong v-else>{{ (line.product.priceCents * line.quantity / 100).toFixed(2).replace('.', ',') }} €</strong>
          </div>
          <button @click="remove(line.product.id)">Retirer</button>
        </div>
        <div :class="styles.checkout">
          <div :class="styles.promoSection">
            <span :class="styles.promoLabel">Code promo</span>
            <template v-if="!promoCode">
              <div :class="styles.promoRow">
                <input id="promo-input" v-model="promoInput" type="text" placeholder="Entrez votre code"
                       :disabled="promoLoading" @keyup.enter="applyPromo"/>
                <button type="button" @click="applyPromo" :disabled="promoLoading || !promoInput.trim()">
                  {{ promoLoading ? '…' : 'Appliquer' }}
                </button>
              </div>
              <small v-if="promoError" :class="styles.promoError">{{ promoError }}</small>
            </template>
            <template v-else>
              <div :class="styles.promoApplied">
                <span>{{ promoSuccess }}</span>
                <button type="button" @click="removePromo">Retirer</button>
              </div>
            </template>
          </div>
          <div v-if="totalDiscounted < total" :class="styles.checkoutTotalRow">
            <span>Sous-total</span><span
              :class="styles.checkoutTotalStrike">{{ (total / 100).toFixed(2).replace('.', ',') }} €</span>
          </div>
          <div :class="styles.checkoutTotalRow">
            <span>Total</span><strong :class="totalDiscounted < total ? styles.checkoutTotalAccent : ''">{{
              (totalDiscounted / 100).toFixed(2).replace('.', ',')
            }} €</strong>
          </div>
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
