<script setup lang="ts">import styles from '~/assets/css/site.module.css';

const route = useRoute();
</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.success"><b>✓</b>
      <h1>Merci pour votre commande !</h1>
      <p>Votre paiement {{ route.query.success === 'paypal' ? 'PayPal' : 'Stripe' }} a bien été reçu. Vous recevrez
        bientôt votre confirmation.</p>
      <NuxtLink to="/" :class="styles.cta">Retour à la boutique</NuxtLink>
    </div>
  </main>
</template>
