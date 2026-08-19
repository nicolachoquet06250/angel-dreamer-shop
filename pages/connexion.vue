<script setup lang="ts">
import styles from '~/assets/css/site.module.css';

const route = useRoute();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const result = await $fetch<{
      user: {
        mustChangePassword: boolean
      }
    }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: {
            email: email.value,
            password: password.value
          }
        }
    );
    if (result.user.mustChangePassword) {
      await navigateTo('/changer-mot-de-passe', {external: true});
      return
    }
    const target = typeof route.query.returnTo === 'string' && route.query.returnTo.startsWith('/') && !route.query.returnTo.startsWith('//')
        ? route.query.returnTo
        : '/compte';
    await navigateTo(target, {external: true})
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Connexion impossible'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.authPage">
      <form :class="styles.authCard" @submit.prevent="submit"><small>ESPACE CLIENT</small>
        <h1>Connexion</h1>
        <p>
          Connectez-vous pour finaliser vos achats et accéder à votre compte.
        </p>
        <label>
          E-mail
          <input
              v-model="email"
              type="email"
              autocomplete="email"
              required
          >
        </label>
        <label>
          Mot de passe
          <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
          >
        </label>
        <button type="submit">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
        <span v-if="error">{{ error }}</span>

        <p>
          Pas encore de compte ?
          <NuxtLink :to="`/inscription?returnTo=${encodeURIComponent(String(route.query.returnTo || '/compte'))}`">
            Créer un compte
          </NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>
