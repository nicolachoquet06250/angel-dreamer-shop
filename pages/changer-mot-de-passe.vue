<script setup lang="ts">
import styles from '~/assets/css/site.module.css';

const password = ref('');
const confirmation = ref('');
const error = ref('');
const loading = ref(false);
const {data} = await useFetch<{ user: { mustChangePassword: boolean } | null }>('/api/auth/me');
if (!data.value?.user) await navigateTo('/connexion?returnTo=/changer-mot-de-passe');

async function submit() {
  error.value = '';
  if (password.value !== confirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return
  }
  loading.value = true;
  try {
    await $fetch('/api/auth/change-password', {method: 'POST', body: {password: password.value}});
    await navigateTo('/admin', {external: true})
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Modification impossible'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.authPage">
      <form :class="styles.authCard" @submit.prevent="submit"><small>SÉCURITÉ</small>
        <h1>Nouveau mot de passe</h1>
        <p>Pour protéger l’administration, vous devez remplacer le mot de passe temporaire avant de continuer.</p>
        <label>Nouveau mot de passe<input v-model="password" type="password" autocomplete="new-password" minlength="12"
                                          required><em>12 caractères minimum.</em></label><label>Confirmer le mot de
          passe<input v-model="confirmation" type="password" autocomplete="new-password" minlength="12"
                      required></label>
        <button type="submit">{{ loading ? 'Enregistrement…' : 'Enregistrer mon mot de passe' }}</button>
        <span v-if="error">{{ error }}</span></form>
    </div>
  </main>
</template>
