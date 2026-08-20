<script setup lang="ts">
import styles from '~/assets/css/site.module.css'

const route = useRoute()
const {data: auth} = await useFetch<{ user: { email: string } | null }>('/api/auth/me')
const email = ref(auth.value?.user?.email || '')
const token = typeof route.query.token === 'string' ? route.query.token : ''
const userId = Number(route.query.uid)
const isResetLink = token.length >= 32 && Number.isInteger(userId) && userId > 0
const sent = ref(isResetLink), code = ref(''), password = ref(''), confirmation = ref('')
const loading = ref(false), message = ref(''), error = ref('')
const isProfile = computed(() => Boolean(auth.value?.user) && route.query.source === 'profile')
useHead(() => ({
  title: `${isProfile.value ? 'Changer mon mot de passe' : 'Mot de passe oublié'} — Angel Dreamer`,
  meta: [{name: 'robots', content: 'noindex, nofollow'}]
}))

async function requestCode() {
  loading.value = true;
  error.value = '';
  message.value = ''
  try {
    const result = await $fetch<{ message: string }>('/api/auth/password-code/request', {
      method: 'POST',
      body: isProfile.value ? {} : {email: email.value}
    });
    sent.value = true;
    message.value = result.message
  } catch (event: any) {
    error.value = event?.data?.statusMessage || 'Envoi du code impossible'
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  error.value = '';
  message.value = ''
  if (password.value !== confirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return
  }
  loading.value = true
  try {
    await $fetch('/api/auth/password-code/confirm', {
      method: 'POST',
      body: {email: email.value, code: code.value, password: password.value, token, userId}
    });
    await navigateTo('/compte', {external: true})
  } catch (event: any) {
    error.value = event?.data?.statusMessage || 'Modification impossible'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.authPage">
      <form :class="styles.authCard" novalidate @submit.prevent="sent ? changePassword() : requestCode()">
        <small>SÉCURITÉ DU COMPTE</small>
        <h1>{{ isProfile ? 'Changer mon mot de passe' : 'Mot de passe oublié' }}</h1>
        <p v-if="!sent">Nous vous enverrons un code à six chiffres afin de confirmer votre identité.</p>
        <p v-else-if="isResetLink">Choisissez immédiatement votre nouveau mot de passe. Le lien reçu par e-mail confirme
          votre identité.</p>
        <p v-else>Saisissez le code reçu par e-mail puis choisissez votre nouveau mot de passe.</p>
        <label v-if="!isResetLink&&!isProfile">E-mail<input v-model="email" type="email" autocomplete="email" required></label>
        <template v-if="sent"><label v-if="!isResetLink">Code de sécurité<input v-model="code" inputmode="numeric"
                                                                                autocomplete="one-time-code"
                                                                                pattern="[0-9]{6}" maxlength="6"
                                                                                required><em>Le code expire après 10
          minutes et cinq essais.</em></label><label>Nouveau mot de passe<input v-model="password" type="password"
                                                                                autocomplete="new-password"
                                                                                minlength="12" maxlength="128" required><em>12
          caractères minimum.</em></label><label>Confirmer le mot de passe<input v-model="confirmation" type="password"
                                                                                 autocomplete="new-password"
                                                                                 minlength="12" maxlength="128"
                                                                                 required></label></template>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Traitement…' : sent ? 'Changer mon mot de passe' : 'Recevoir mon code' }}
        </button>
        <button v-if="sent&&!isResetLink" type="button" :class="$style.resend" :disabled="loading" @click="requestCode">
          Renvoyer un code
        </button>
        <span v-if="message" :class="$style.success">{{ message }}</span><span v-if="error">{{ error }}</span>
        <p>
          <NuxtLink :to="auth?.user ? '/compte' : '/connexion'">Retour {{
              auth?.user ? 'au profil' : 'à la connexion'
            }}
          </NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>
<style module>
.resend {
  margin-top: 8px !important;
  border: 1px solid var(--line) !important;
  background: transparent !important;
  color: var(--text) !important
}

.success {
  color: #298a4a !important
}
</style>
