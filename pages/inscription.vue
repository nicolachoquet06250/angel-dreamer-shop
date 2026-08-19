<script setup lang="ts">
import styles from '~/assets/css/site.module.css';

const route = useRoute();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return
  }
  loading.value = true;
  error.value = '';
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value}
    });
    const target = typeof route.query.returnTo === 'string' && route.query.returnTo.startsWith('/') && !route.query.returnTo.startsWith('//') ? route.query.returnTo : '/compte';
    await navigateTo(target, {external: true})
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Inscription impossible'
  } finally {
    loading.value = false
  }
}</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.authPage">
      <form :class="styles.authCard" @submit.prevent="submit"><small>NOUVEAU COMPTE</small>
        <h1>Créer un compte</h1>
        <p>Ces informations servent uniquement à votre compte et au traitement de vos commandes.</p><label>Prénom<input
            v-model="firstName" type="text" autocomplete="given-name" maxlength="80" required></label><label>Nom<input
            v-model="lastName" type="text" autocomplete="family-name" maxlength="80"
            required></label><label>E-mail<input v-model="email" type="email" autocomplete="email"
                                                 required></label><label>Mot de passe<input v-model="password"
                                                                                            type="password"
                                                                                            minlength="10"
                                                                                            autocomplete="new-password"
                                                                                            required><em>10 caractères
          minimum</em></label><label>Confirmer le mot de passe<input v-model="confirmPassword" type="password"
                                                                     minlength="10" autocomplete="new-password"
                                                                     required></label>
        <button type="submit">{{ loading ? 'Création…' : 'Créer mon compte' }}</button>
        <span v-if="error">{{ error }}</span>
        <p>Déjà inscrit ?
          <NuxtLink to="/connexion">Se connecter</NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>
