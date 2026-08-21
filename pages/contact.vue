<script setup lang="ts">
import styles from '~/assets/css/site.module.css'

const {data: content} = await useFetch<any>('/api/content')
const {data: session} = await useFetch<{
  user: { email: string; firstName?: string; lastName?: string; role: string } | null
}>('/api/auth/me')

useSeoMeta({title: 'Contact | Angel Dreamer'})

const step = ref<'form' | 'code' | 'success'>('form')
const firstName = ref(session.value?.user?.firstName || '')
const lastName = ref(session.value?.user?.lastName || '')
const email = ref(session.value?.user?.email || '')
const subject = ref('')
const message = ref('')
const code = ref('')
const error = ref('')
const loading = ref(false)

interface Attachment {
  id: number;
  filename: string;
  size: number
}

const attachments = ref<Attachment[]>([])

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  for (const file of Array.from(input.files)) {
    const form = new FormData()
    form.append('file', file)
    try {
      const result = await $fetch<Attachment>('/api/contact/attachment', {method: 'POST', body: form})
      attachments.value.push(result)
    } catch (e: any) {
      error.value = e?.data?.statusMessage || 'Erreur lors de l\'envoi du fichier'
    }
  }
  input.value = ''
}

async function removeAttachment(id: number) {
  await $fetch(`/api/contact/attachment/${id}`, {method: 'DELETE'})
  attachments.value = attachments.value.filter(a => a.id !== id)
}

async function submitForm() {
  error.value = ''
  if (!firstName.value || !lastName.value || !email.value || !subject.value || !message.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/contact/send-code', {method: 'POST', body: {email: email.value}})
    step.value = 'code'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Erreur lors de l\'envoi du code'
  } finally {
    loading.value = false
  }
}

async function submitCode() {
  error.value = ''
  if (!code.value) {
    error.value = 'Veuillez saisir le code'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/contact/send', {
      method: 'POST',
      body: {
        firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
        code: code.value,
        attachmentIds: attachments.value.map(a => a.id)
      }
    })
    step.value = 'success'
    setTimeout(() => {
      step.value = 'form'
      firstName.value = session.value?.user?.firstName || ''
      lastName.value = session.value?.user?.lastName || ''
      email.value = session.value?.user?.email || ''
      subject.value = ''
            message.value = ''
      code.value = ''
      attachments.value = []
    }, 3000)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Erreur lors de l\'envoi du message'
  } finally {
    loading.value = false
  }
}
</script>
<style module="contactStyles">
</style>
<template>
  <main :class="styles.contactPage">
    <StoreHeader/>
    <div :class="styles.contactCard">
      <h1>Contact</h1>
      <div v-if="step === 'success'" :class="styles.successMsg">✓ Message envoyé ! Nous vous répondrons rapidement.
      </div>
      <div v-else-if="step === 'code'" :class="styles.codeStep">
        <p>Un code de vérification a été envoyé à <strong>{{ email }}</strong></p>
        <div>
          <input
              v-model="code"
              :class="styles.codeInput"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="000000"
              autocomplete="one-time-code"
          >
        </div>
        <p v-if="error" style="color:var(--accent);margin-bottom:12px">{{ error }}</p>
        <button :class="styles.contactBtn" @click="submitCode" :disabled="loading">
          {{ loading ? 'Envoi…' : 'Valider et envoyer' }}
        </button>
        <br><br>
        <button style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px"
                @click="step='form'">← Retour
        </button>
      </div>
      <form v-else @submit.prevent="submitForm">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <label style="display:grid;gap:7px;font-size:12px">
            Prénom
            <input v-model="firstName" type="text" autocomplete="given-name" maxlength="80" required
                   :disabled="!!session?.user"
                   style="padding:12px;background:var(--bg);color:var(--text);border:1px solid var(--line)">
          </label>
          <label style="display:grid;gap:7px;font-size:12px">
            Nom
            <input v-model="lastName" type="text" autocomplete="family-name" maxlength="80" required
                   :disabled="!!session?.user"
                   style="padding:12px;background:var(--bg);color:var(--text);border:1px solid var(--line)">
          </label>
        </div>
        <label style="display:grid;gap:7px;font-size:12px;margin-bottom:14px">
          Adresse e-mail
          <input v-model="email" type="email" autocomplete="email" required :disabled="!!session?.user"
                 style="padding:12px;background:var(--bg);color:var(--text);border:1px solid var(--line)">
        </label>
        <label style="display:grid;gap:7px;font-size:12px;margin-bottom:14px">
          Sujet
          <input v-model="subject" type="text" maxlength="200" required
                 style="padding:12px;background:var(--bg);color:var(--text);border:1px solid var(--line)">
        </label>
        <label style="display:grid;gap:7px;font-size:12px;margin-bottom:14px">
          Message
          <TiptapEditor v-model="message" :class="$style.editor"/>
        </label>
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:12px;margin-bottom:6px;cursor:pointer">
            Pièces jointes
            <input type="file" multiple style="display:none" @change="onFileChange"
                   accept="image/*,.pdf,.txt,.doc,.docx">
          </label>
          <label
              style="display:inline-block;padding:8px 14px;border:1px solid var(--line);font-size:12px;cursor:pointer;background:var(--bg);color:var(--text)">
            + Ajouter un fichier
            <input type="file" multiple style="display:none" @change="onFileChange"
                   accept="image/*,.pdf,.txt,.doc,.docx">
          </label>
          <div v-if="attachments.length" :class="styles.attachmentList">
            <div v-for="att in attachments" :key="att.id" :class="styles.attachmentItem">
              <span>{{ att.filename }}</span>
              <span style="color:var(--muted)">({{ Math.round(att.size / 1024) }} Ko)</span>
              <button type="button" @click="removeAttachment(att.id)" aria-label="Supprimer">×</button>
            </div>
          </div>
        </div>
        <p v-if="error" style="color:var(--accent);margin-bottom:12px;font-size:13px">{{ error }}</p>
        <button type="submit" :class="styles.contactBtn" :disabled="loading">
          {{ loading ? 'Envoi…' : 'Envoyer' }}
        </button>
      </form>
    </div>
    <footer :class="styles.footer">
      <div :class="styles.footerMain">
        {{ content?.footerBrand }}
        <span><span><span>{{ content?.footerText }}</span></span><span :class="styles.footerCopyright"/></span>
      </div>
      <nav :class="styles.footerLinks">
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink v-if="content?.cguContent" to="/cgu">CGU</NuxtLink>
        <NuxtLink v-if="content?.cgvContent" to="/cgv">CGV</NuxtLink>
      </nav>
    </footer>
  </main>
</template>

<style module>
.editor {
  cursor: text;
}
</style>