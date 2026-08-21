<script setup lang="ts">import styles from '~/assets/css/site.module.css';
import {renderSeoTemplate} from '~/utils/seo-template';

const {data: content} = await useFetch<any>('/api/content');
const profileStyles = useCssModule('profileStyles');
type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  mustChangePassword: boolean;
  createdAt: string
};
const {data} = await useFetch<{ user: Profile | null }>('/api/auth/me');

useSeoMeta({
  title: () => renderSeoTemplate(content.value?.seoProfileTitle, {
    'Nom du site': content.value?.seoSiteName,
    ['Prénom']: data.value?.user?.firstName,
    'Nom': data.value?.user?.lastName,
    'Email': data.value?.user?.email
  })
});
if (!data.value?.user) await navigateTo('/connexion?returnTo=/compte'); else if (data.value.user.mustChangePassword) await navigateTo('/changer-mot-de-passe');
const firstName = ref(data.value?.user?.firstName || '');
const lastName = ref(data.value?.user?.lastName || '');
const message = ref('');
const error = ref('');
const saving = ref(false);

async function saveProfile() {
  saving.value = true;
  message.value = '';
  error.value = '';
  try {
    await $fetch('/api/auth/profile', {method: 'PUT', body: {firstName: firstName.value, lastName: lastName.value}});
    message.value = 'Profil enregistré'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Enregistrement impossible'
  } finally {
    saving.value = false
  }
}

async function logout() {
  await $fetch('/api/auth/logout', {method: 'POST'});
  await navigateTo('/', {external: true})
}</script>
<style module="profileStyles">
.form {
  padding: 20px 0;
  border-bottom: 1px solid var(--line)
}

.names {
  display: grid;
  grid-template-columns:1fr 1fr;
  gap: 14px
}

.form label {
  display: grid;
  gap: 7px;
  font-size: 12px
}

.form input {
  width: 100%;
  padding: 12px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line)
}

.form button {
  margin-top: 15px;
  padding: 12px 16px;
  border: 0;
  background: var(--accent);
  color: white;
  font-weight: 700;
  cursor: pointer
}

.success, .error {
  margin: 10px 0 0;
  font-size: 12px
}

.success {
  color: #298a4a
}

.error {
  color: var(--accent)
}

.passwordLink {
  display: block;
  margin: 20px 0;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline
}

@media (max-width: 560px) {
  .names {
    grid-template-columns:1fr
  }
}
</style>
<template>
  <main>
    <StoreHeader/>
    <div v-if="data?.user" :class="styles.account"><small>MON COMPTE</small>
      <h1>Bonjour {{ data.user.firstName || '' }}</h1>
      <form :class="profileStyles.form" @submit.prevent="saveProfile">
        <div :class="profileStyles.names"><label>Prénom<input v-model="firstName" autocomplete="given-name"
                                                              maxlength="80" required></label><label>Nom<input
            v-model="lastName" autocomplete="family-name" maxlength="80" required></label></div>
        <button type="submit">{{ saving ? 'Enregistrement…' : 'Enregistrer mon profil' }}</button>
        <p v-if="message" :class="profileStyles.success">✓ {{ message }}</p>
        <p v-if="error" :class="profileStyles.error">{{ error }}</p></form>
      <div><span>Adresse e-mail</span><strong>{{ data.user.email }}</strong></div>
      <div><span>Type de compte</span><strong>{{
          data.user.role === 'admin' ? 'Administrateur' : data.user.role === 'demo' ? 'Démonstration (lecture seule)' : 'Client'
        }}</strong>
      </div>
      <NuxtLink to="/mot-de-passe-oublie?source=profile" :class="profileStyles.passwordLink">Changer mon mot de passe
      </NuxtLink>
      <NuxtLink v-if="['admin','demo'].includes(data.user.role)" to="/admin" :class="styles.cta">Ouvrir
        l’administration
      </NuxtLink>
      <button @click="logout">Se déconnecter</button>
    </div>
  </main>
</template>
