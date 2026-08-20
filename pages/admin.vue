<script setup lang="ts">
import type {Category, Product, SiteContent, Universe} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import type {ValidationIssue} from '~/utils/admin-validation';
import {
  hasValidationErrors,
  validateCategoryPage,
  validateHomeContent,
  validateProduct,
  validateSeo,
  validateUniversePage
} from '~/utils/admin-validation';
import styles from '~/assets/css/site.module.css';
import mediaIcon from '~/assets/icons/image.png';
import trashIcon from '~/assets/icons/trash.png';
import copyIcon from '~/assets/icons/copy.png';

const actionStyles = useCssModule('actionStyles')
type UserRow = { id: number; email: string; role: 'admin' | 'customer' | 'demo'; active: boolean; createdAt: string };
type AdminTab = 'content' | 'category' | 'universe' | 'seo' | 'products' | 'users'
const previewDark = ref(false)
const categoryPreviewDark = ref(false)
const universePreviewDark = ref(false)
const route = useRoute();
const router = useRouter();
const requested = String(route.params.tab || route.query.tab || 'content');
const activeTab = ref<AdminTab>(['content', 'category', 'universe', 'seo', 'products', 'users'].includes(requested) ? requested as AdminTab : 'content');
if (route.query.tab) await navigateTo(`/admin/${activeTab.value}`, {replace: true});
const {data: me} = await useFetch<{
  email: string;
  role: string;
  allowed: boolean;
  readOnly: boolean
}>('/api/admin/me');
const isDemo = computed(() => Boolean(me.value?.readOnly));
type DemoReadOnlyElement = HTMLElement & {demoObserver?: MutationObserver}
function syncDemoReadOnly(element: DemoReadOnlyElement, active: boolean) {
  element.dataset.demoReadonly = String(active)
  element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>('input,textarea,select,button').forEach(control => {
    const allowed = control.tagName === 'BUTTON' && control.hasAttribute('data-demo-interactive')
    if (active && !allowed) {
      if (!control.disabled) control.dataset.disabledByDemo = 'true'
      control.disabled = true
    } else if (control.dataset.disabledByDemo === 'true') {
      control.disabled = false
      delete control.dataset.disabledByDemo
    }
  })
}
const vDemoReadonly = {
  mounted(element: DemoReadOnlyElement, binding: {value: boolean}) {
    syncDemoReadOnly(element, binding.value)
    element.demoObserver = new MutationObserver(() => syncDemoReadOnly(element, binding.value))
    element.demoObserver.observe(element, {childList: true, subtree: true})
  },
  updated(element: DemoReadOnlyElement, binding: {value: boolean}) { syncDemoReadOnly(element, binding.value) },
  unmounted(element: DemoReadOnlyElement) { element.demoObserver?.disconnect() }
}
const products = ref<Product[]>([]);
const favoriteIds = ref<number[]>([]);
const users = ref<UserRow[]>([]);
const universes = ref<Universe[]>([]);
const categories = ref<Category[]>([]);
const tabs = computed(() => [{id: 'content' as const, label: 'Page d’accueil'}, {
  id: 'category' as const,
  label: 'Page Catégorie'
}, {id: 'universe' as const, label: 'Page univers'}, {
  id: 'seo' as const,
  label: 'Référencement'
}, {
  id: 'products' as const,
  label: 'Produits',
  count: products.value.length
}, {id: 'users' as const, label: 'Utilisateurs', count: users.value.length}]);
const content = reactive<SiteContent>({...defaultSiteContent});
const saving = ref('');
const message = ref('');
const messageIsError = ref(false);
const validation = reactive<Record<string, ValidationIssue[]>>({
  content: [],
  category: [],
  universe: [],
  seo: [],
  product: []
});
const mediaOpen = ref(false);
const resettingUserId = ref<number | null>(null);
const deletingUserId = ref<number | null>(null);
const creatingDemo = ref(false);
const demoCredentials = ref<{ email: string; password: string } | null>(null);
const copiedDemoField = ref<'email' | 'password' | null>(null);
const validationAttempted = reactive<Record<string, boolean>>({
  content: false,
  category: false,
  universe: false,
  seo: false,
  product: false
});
const adminDocumentTitle = computed(() => {
  const section = mediaOpen.value ? 'Médiathèque' : tabs.value.find(tab => tab.id === activeTab.value)?.label || 'Administration';
  return `${section} — Administration — Angel Dreamer`
});
useHead(() => ({
  title: adminDocumentTitle.value,
  meta: [{name: 'robots', content: 'noindex, nofollow'}]
}));
let messageTimer: ReturnType<typeof setTimeout> | undefined;
watch(message, value => {
  if (messageTimer) clearTimeout(messageTimer);
  if (value) messageTimer = setTimeout(() => {
    message.value = ''
  }, 10_000)
});
onBeforeUnmount(() => {
  if (messageTimer) clearTimeout(messageTimer)
});
const blank = (): Product => {
  const novelty = categories.value.find(item => item.slug === 'nouveautes') || categories.value[0];
  const universe = universes.value[0];
  return {
    id: 0,
    slug: 'nouveau-produit',
    name: 'Nouveau produit',
    description: 'Description du produit',
    priceCents: 1990,
    image: null,
    categories: novelty ? [novelty] : [],
    universes: universe ? [universe] : [],
    categoryIds: novelty ? [novelty.id] : [],
    universeIds: universe ? [universe.id] : [],
    featured: false,
    featuredPosition: null,
    active: true
  }
};
const draft = ref<Product | null>(null)

async function selectTab(tab: AdminTab) {
  activeTab.value = tab;
  await router.replace(`/admin/${tab}`)
}

async function load() {
  if (!me.value?.allowed) return;
  products.value = await $fetch<Product[]>('/api/admin/products');
  favoriteIds.value = products.value.filter(product => product.featured).sort((a, b) => (a.featuredPosition ?? 99) - (b.featuredPosition ?? 99)).slice(0, 4).map(product => product.id);
  users.value = await $fetch<UserRow[]>('/api/admin/users');
  universes.value = await $fetch<Universe[]>('/api/admin/universes');
  categories.value = await $fetch<Category[]>('/api/admin/categories');
  Object.assign(content, defaultSiteContent, await $fetch<SiteContent>('/api/content'))
}

onMounted(load)

async function saveContent() {
  validationAttempted.content = true;
  validation.content = validateHomeContent(content, categories.value, universes.value, favoriteIds.value);
  if (hasValidationErrors(validation.content)) {
    messageIsError.value = true;
    message.value = 'Enregistrement bloqué : corrigez les erreurs indiquées dans le formulaire.';
    return
  }
  saving.value = 'content';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    categories.value = await $fetch<Category[]>('/api/admin/categories', {method: 'PUT', body: categories.value});
    universes.value = await $fetch<Universe[]>('/api/admin/universes', {method: 'PUT', body: universes.value});
    await $fetch('/api/admin/featured', {method: 'PUT', body: {productIds: favoriteIds.value}});
    await refreshNuxtData();
    products.value = await $fetch<Product[]>('/api/admin/products');
    message.value = 'Contenu, navigation, univers et favoris enregistrés'
  } finally {
    saving.value = ''
  }
}

function edit(p?: Product) {
  validationAttempted.product = false;
  validation.product = [];
  draft.value = p ? {...p, categoryIds: [...p.categoryIds], universeIds: [...p.universeIds]} : blank()
}

async function saveProduct() {
  if (!draft.value) return;
  validationAttempted.product = true;
  validation.product = validateProduct(draft.value);
  if (hasValidationErrors(validation.product)) {
    messageIsError.value = true;
    message.value = 'Produit non enregistré : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'product';
  messageIsError.value = false;
  const isNew = !draft.value.id;
  await $fetch(isNew ? '/api/admin/products' : `/api/admin/products/${draft.value.id}`, {
    method: isNew ? 'POST' : 'PUT',
    body: draft.value
  });
  draft.value = null;
  await load();
  saving.value = '';
  message.value = 'Produit enregistré'
}

async function removeProduct(p: Product) {
  if (!confirm(`Supprimer ${p.name} ?`)) return;
  await $fetch(`/api/admin/products/${p.id}`, {method: 'DELETE'});
  await load()
}

async function saveUser(user: UserRow) {
  messageIsError.value = false;
  await $fetch(`/api/admin/users/${user.id}`, {method: 'PUT', body: {role: user.role, active: user.active}});
  message.value = 'Droits utilisateur enregistrés'
}

async function resetUserPassword(user: UserRow) {
  if (!confirm(`Envoyer un lien de réinitialisation à ${user.email} ?`)) return
  resettingUserId.value = user.id
  messageIsError.value = false
  try {
    const result = await $fetch<{ message: string }>(`/api/admin/users/${user.id}/password-reset`, {method: 'POST'})
    message.value = result.message
  } catch (event: any) {
    messageIsError.value = true
    message.value = event?.data?.statusMessage || 'Envoi du lien impossible'
  } finally {
    resettingUserId.value = null
  }
}

async function createDemoUser() {
  creatingDemo.value = true
  messageIsError.value = false
  try {
    const result = await $fetch<{ user: UserRow; password: string }>('/api/admin/users/demo', {method: 'POST'})
    users.value.push(result.user)
    demoCredentials.value = {email: result.user.email, password: result.password}
    message.value = 'Utilisateur temporaire de démonstration créé'
  } catch (event: any) {
    messageIsError.value = true
    message.value = event?.data?.statusMessage || 'Création du compte de démonstration impossible'
  } finally {
    creatingDemo.value = false
  }
}

async function removeDemoUser(user: UserRow) {
  if (user.role !== 'demo' || !confirm(`Supprimer définitivement le compte de démonstration ${user.email} ?`)) return
  deletingUserId.value = user.id
  messageIsError.value = false
  try {
    await $fetch(`/api/admin/users/${user.id}`, {method: 'DELETE'})
    users.value = users.value.filter(item => item.id !== user.id)
    if (demoCredentials.value?.email === user.email) demoCredentials.value = null
    message.value = 'Utilisateur de démonstration supprimé'
  } catch (event: any) {
    messageIsError.value = true
    message.value = event?.data?.statusMessage || 'Suppression du compte impossible'
  } finally {
    deletingUserId.value = null
  }
}

async function copyDemoValue(value: string, field: 'email' | 'password') {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value)
    else {
      const input = document.createElement('textarea')
      input.value = value
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    copiedDemoField.value = field
    messageIsError.value = false
    message.value = field === 'email' ? 'E-mail copié dans le presse-papiers' : 'Mot de passe copié dans le presse-papiers'
    setTimeout(() => {
      if (copiedDemoField.value === field) copiedDemoField.value = null
    }, 2000)
  } catch {
    messageIsError.value = true
    message.value = 'Copie dans le presse-papiers impossible'
  }
}

async function saveCategoryPage() {
  validationAttempted.category = true;
  validation.category = validateCategoryPage(content);
  if (hasValidationErrors(validation.category)) {
    messageIsError.value = true;
    message.value = 'Page non enregistrée : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'category';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page catégorie enregistrée'
  } finally {
    saving.value = ''
  }
}

async function saveUniversePage() {
  validationAttempted.universe = true;
  validation.universe = validateUniversePage(content);
  if (hasValidationErrors(validation.universe)) {
    messageIsError.value = true;
    message.value = 'Page non enregistrée : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'universe';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page univers enregistrée'
  } finally {
    saving.value = ''
  }
}

async function saveSeo() {
  validationAttempted.seo = true;
  validation.seo = validateSeo(content);
  if (hasValidationErrors(validation.seo)) {
    messageIsError.value = true;
    message.value = 'Référencement non enregistré : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'seo';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Référencement enregistré'
  } finally {
    saving.value = ''
  }
}

watch([content, categories, universes, favoriteIds], () => {
  if (validationAttempted.content) validation.content = validateHomeContent(content, categories.value, universes.value, favoriteIds.value)
  if (validationAttempted.category) validation.category = validateCategoryPage(content)
  if (validationAttempted.universe) validation.universe = validateUniversePage(content)
  if (validationAttempted.seo) validation.seo = validateSeo(content)
}, {deep: true})

watch(draft, value => {
  if (value && validationAttempted.product) validation.product = validateProduct(value)
}, {deep: true})
</script>
<style module="actionStyles">
.actions, .bottomSave {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px
}

.bottomSave {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--line)
}

.actions button, .bottomSave button {
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer
}

.actions button:last-child, .bottomSave button:last-child {
  border: 0;
  background: var(--accent);
  color: white
}

.themeToggle {
  border: 1px solid var(--line) !important;
  background: var(--surface) !important;
  color: var(--text) !important
}

.actions button:disabled, .bottomSave button:disabled {
  opacity: .55;
  cursor: wait
}

.titleActions {
  display: flex;
  align-items: center;
  gap: 10px
}

.mediaButton {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: border-color .15s, background .15s, transform .15s
}

.mediaButton:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface));
  transform: translateY(-1px)
}

.mediaButton img {
  width: 21px;
  height: 21px;
  object-fit: contain
}

.resetPassword {
  min-width: 180px;
  color: var(--accent);
  border-color: var(--accent) !important
}

.deleteUser {
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #c94a3a !important;
  background: transparent !important;
  color: #c94a3a;
  cursor: pointer
}

.deleteUser img {
  width: 12px;
  height: 12px;
  object-fit: contain
}

:global(:root[data-theme="dark"]) .deleteUser img {
  filter: invert(1)
}

.readOnlyScope {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0
}

.readOnlyScope[data-demo-readonly="true"] :disabled {
  cursor: not-allowed;
  opacity: .58
}

.demoNotice {
  margin: 12px 0;
  padding: 11px 14px;
  border: 1px solid var(--accent);
  background: color-mix(in srgb, var(--accent) 7%, var(--surface));
  color: var(--text);
  font-size: 12px
}

.usersHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px
}

.usersHeading button {
  flex: 0 0 auto
}

.secondaryButton {
  padding: 11px 16px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s
}

.secondaryButton:hover:not(:disabled) {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 7%, transparent);
  color: var(--accent)
}

.demoCredentials {
  display: grid;
  gap: 6px;
  margin: 16px 0;
  padding: 14px;
  border: 1px solid var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, var(--surface))
}

.demoCredentialLine {
  display: grid;
  grid-template-columns:auto minmax(0, 1fr) 32px;
  align-items: center;
  gap: 7px
}

.demoCredentials code {
  user-select: all;
  font-size: 12px
}

.demoCredentials small {
  color: var(--muted)
}

.copyButton {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  padding: 0 !important;
  border: 1px solid var(--line) !important;
  background: transparent !important;
  cursor: pointer
}

.copyButton img {
  width: 14px;
  height: 14px;
  object-fit: contain
}

.copyButton.copied {
  border-color: var(--accent) !important;
  background: color-mix(in srgb, var(--accent) 8%, transparent) !important
}

:global(:root[data-theme="dark"]) .copyButton img {
  filter: invert(1)
}

.userRowsWithReset article {
  grid-template-columns:minmax(170px, 1fr) 130px 75px 180px auto;
  gap: 12px
}

.userRowsWithReset .resetPassword {
  grid-column: 4
}

.userRowsWithReset .deleteUser {
  grid-column: 4
}

.userRowsWithReset .saveUser {
  grid-column: 5
}

@media (max-width: 760px) {
  .userRowsWithReset article {
    grid-template-columns:1fr auto
  }

  .userRowsWithReset article > div {
    grid-column: 1/-1
  }

  .userRowsWithReset .resetPassword, .userRowsWithReset .deleteUser {
    width: 100%;
    min-width: 0;
    grid-column: 1/-1
  }

  .userRowsWithReset .saveUser {
    grid-column: auto
  }
}

@media (max-width: 700px) {
  .usersHeading {
    align-items: stretch;
    flex-direction: column
  }

  .usersHeading button {
    width: 100%
  }
}

:global(:root[data-theme="dark"]) .mediaButton img {
  filter: invert(1)
}

@media (max-width: 530px) {
  .responsiveTitle {
    flex-wrap: wrap
  }

  .titleActions {
    flex: 0 0 100%;
    justify-content: flex-end;
    margin-top: 10px
  }
}

@media (max-width: 500px) {
  .responsivePanelTitle {
    flex-wrap: wrap;
    gap: 12px
  }

  .responsivePanelTitle > div:first-child {
    flex: 0 0 100%
  }

  .responsivePanelTitle > .actions {
    flex: 0 0 100%;
    justify-content: flex-end
  }

  .responsivePanelTitle > button {
    margin-left: auto
  }
}
</style>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.admin">
      <div :class="[styles.adminTitle,actionStyles.responsiveTitle]">
        <div><small>ESPACE ADMINISTRATEUR</small>
          <h1>Administration</h1></div>
        <div :class="actionStyles.titleActions">
          <button type="button" :class="actionStyles.mediaButton" title="Ouvrir la médiathèque"
                  aria-label="Ouvrir la médiathèque" @click="mediaOpen=true"><img :src="mediaIcon" alt=""></button>
          <NuxtLink to="/">Voir la boutique ></NuxtLink>
        </div>
      </div>
      <div v-if="!me?.allowed" :class="styles.adminNotice"><h2>Accès protégé</h2>
        <p>Connectez-vous avec un compte disposant du rôle administrateur.</p>
        <NuxtLink to="/connexion?returnTo=/admin" :class="styles.cta">Se connecter</NuxtLink>
      </div>
      <template v-else>
        <p v-if="isDemo" :class="actionStyles.demoNotice">Mode démonstration — toutes les zones administratives sont
          accessibles en lecture seule.</p>
        <HorizontalCarousel :track-class="styles.adminTabs" label="les onglets d’administration">
          <button v-for="tab in tabs" :id="`tab-${tab.id}`" :key="tab.id" type="button" role="tab"
                  :aria-selected="activeTab===tab.id" :aria-controls="`panel-${tab.id}`"
                  :class="activeTab===tab.id?styles.adminTabActive:''" @click="selectTab(tab.id)">
            <span>{{ tab.label }}</span><b v-if="tab.count!==undefined">{{ tab.count }}</b></button>
        </HorizontalCarousel>
        <fieldset v-demo-readonly="isDemo" :class="actionStyles.readOnlyScope">
          <section v-if="activeTab==='content'" id="panel-content" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-content">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>PAGE D’ACCUEIL</small>
                <h2>Éditeur visuel</h2>
                <p>Contrôlez les textes, la navigation, les univers et leurs images avec un aperçu immédiat.</p></div>
              <div :class="actionStyles.actions">
                <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="previewDark"
                        @click="previewDark=!previewDark">{{ previewDark ? '☾ Dark' : '☀ Light' }}
                </button>
                <button @click="saveContent">{{ saving === 'content' ? 'Enregistrement…' : 'Enregistrer la page' }}
                </button>
              </div>
            </div>
            <HomeContentEditor v-model="content" v-model:universes="universes" v-model:categories="categories"
                               v-model:favorite-ids="favoriteIds" :products="products" :preview-dark="previewDark"
                               :readonly="isDemo" :validation-issues="validation.content"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="previewDark"
                      @click="previewDark=!previewDark">{{ previewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button type="button" :disabled="saving==='content'" @click="saveContent">
                {{ saving === 'content' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
          <section v-else-if="activeTab==='category'" id="panel-category" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-category">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>PAGE CATÉGORIE</small>
                <h2>Éditeur visuel</h2>
                <p>Personnalisez les contenus génériques de toutes les pages catégorie. Leur titre reste déterminé par
                  la
                  catégorie consultée.</p></div>
              <div :class="actionStyles.actions">
                <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="categoryPreviewDark"
                        @click="categoryPreviewDark=!categoryPreviewDark">{{
                    categoryPreviewDark ? '☾ Dark' : '☀ Light'
                  }}
                </button>
                <button type="button" :disabled="saving==='category'" @click="saveCategoryPage">
                  {{ saving === 'category' ? 'Enregistrement…' : 'Enregistrer la page' }}
                </button>
              </div>
            </div>
            <CategoryPageEditor v-model="content" :preview-dark="categoryPreviewDark"
                                :validation-issues="validation.category"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="categoryPreviewDark"
                      @click="categoryPreviewDark=!categoryPreviewDark">{{ categoryPreviewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button type="button" :disabled="saving==='category'" @click="saveCategoryPage">
                {{ saving === 'category' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
          <section v-else-if="activeTab==='universe'" id="panel-universe" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-universe">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>PAGE UNIVERS</small>
                <h2>Éditeur visuel</h2>
                <p>Personnalisez les libellés communs à toutes les pages univers. Le titre reprend automatiquement
                  l’univers consulté.</p></div>
              <div :class="actionStyles.actions">
                <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="universePreviewDark"
                        @click="universePreviewDark=!universePreviewDark">{{
                    universePreviewDark ? '☾ Dark' : '☀ Light'
                  }}
                </button>
                <button type="button" :disabled="saving==='universe'" @click="saveUniversePage">
                  {{ saving === 'universe' ? 'Enregistrement…' : 'Enregistrer la page' }}
                </button>
              </div>
            </div>
            <UniversePageEditor v-model="content" :categories="categories" :preview-dark="universePreviewDark"
                                :validation-issues="validation.universe"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="universePreviewDark"
                      @click="universePreviewDark=!universePreviewDark">{{ universePreviewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button type="button" :disabled="saving==='universe'" @click="saveUniversePage">
                {{ saving === 'universe' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
          <section v-else-if="activeTab==='seo'" id="panel-seo" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-seo">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>VISIBILITÉ ET PARTAGE</small>
                <h2>Référencement</h2>
                <p>Configurez les moteurs de recherche, les aperçus sociaux et les données structurées du site.</p>
              </div>
              <div :class="actionStyles.actions">
                <button type="button" :disabled="saving==='seo'" @click="saveSeo">
                  {{ saving === 'seo' ? 'Enregistrement…' : 'Enregistrer le référencement' }}
                </button>
              </div>
            </div>
            <SeoEditor v-model="content" :readonly="isDemo" :validation-issues="validation.seo"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" :disabled="saving==='seo'" @click="saveSeo">
                {{ saving === 'seo' ? 'Enregistrement…' : 'Enregistrer le référencement' }}
              </button>
            </div>
          </section>
          <section v-else-if="activeTab==='products'" id="panel-products" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-products">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>CATALOGUE</small>
                <h2>Produits</h2>
                <p>Créez, modifiez ou masquez les articles de la boutique.</p></div>
              <button data-demo-interactive @click="edit()">+ Nouveau produit</button>
            </div>
            <div v-if="products.length" :class="styles.adminProducts">
              <article v-for="p in products" :key="p.id">
                <img v-if="p.image"
                     :src="p.image.content + `?size=${p.image.width}x${p.image?.height}`"
                     :alt="p.name"
                     :width="p.image.width"
                     :height="p.image.height">
                <div><h3>{{ p.name }}</h3>
                  <span>{{ (p.priceCents / 100).toFixed(2) }} € · {{ p.active ? 'En ligne' : 'Masqué' }}</span></div>
                <button data-demo-interactive @click="edit(p)">Modifier</button>
                <button @click="removeProduct(p)">Supprimer</button>
              </article>
            </div>
            <p v-else :class="styles.adminEmpty">Aucun produit dans le catalogue.</p></section>
          <section v-else id="panel-users" :class="styles.adminPanel" role="tabpanel" aria-labelledby="tab-users">
            <div :class="[styles.panelHeading,actionStyles.usersHeading]">
              <div><small>ACCÈS ET DROITS</small>
                <h2>Utilisateurs</h2>
                <p>Gérez les rôles administrateur et l’activation des comptes.</p></div>
              <button type="button" :class="actionStyles.secondaryButton" :disabled="creatingDemo"
                      @click="createDemoUser">{{
                  creatingDemo ? 'Création…' : 'Créer un utilisateur temporaire de démo'
                }}
              </button>
            </div>
            <div v-if="demoCredentials" :class="actionStyles.demoCredentials">
              <strong>Identifiants temporaires à transmettre</strong>
              <span :class="actionStyles.demoCredentialLine"><b>E-mail :</b><code>{{ demoCredentials.email }}</code><button
                  type="button" :class="[actionStyles.copyButton,copiedDemoField==='email'&&actionStyles.copied]"
                  aria-label="Copier l’e-mail" :title="copiedDemoField==='email'?'E-mail copié':'Copier l’e-mail'"
                  @click="copyDemoValue(demoCredentials.email,'email')"><img :src="copyIcon" alt=""></button></span>
              <span :class="actionStyles.demoCredentialLine"><b>Mot de passe :</b><code>{{
                  demoCredentials.password
                }}</code><button type="button"
                                 :class="[actionStyles.copyButton,copiedDemoField==='password'&&actionStyles.copied]"
                                 aria-label="Copier le mot de passe"
                                 :title="copiedDemoField==='password'?'Mot de passe copié':'Copier le mot de passe'"
                                 @click="copyDemoValue(demoCredentials.password,'password')"><img :src="copyIcon"
                                                                                                  alt=""></button></span>
              <small>Le mot de passe n’est affiché qu’après la création de ce compte.</small>
            </div>
            <div v-if="users.length" :class="[styles.userRows,actionStyles.userRowsWithReset]">
              <article v-for="user in users" :key="user.id">
                <div><strong>{{ user.email }}</strong><small>Créé le
                  {{ new Date(user.createdAt).toLocaleDateString('fr-FR') }}</small></div>
                <select v-model="user.role" :aria-label="`Rôle de ${user.email}`">
                  <option value="customer">Client</option>
                  <option value="admin">Administrateur</option>
                  <option value="demo">Démonstration — lecture seule</option>
                </select><label><input v-model="user.active" type="checkbox"> Actif</label>
                <button v-if="user.role!=='demo'" type="button" :class="actionStyles.resetPassword"
                        :disabled="resettingUserId===user.id" @click="resetUserPassword(user)">
                  {{ resettingUserId === user.id ? 'Envoi…' : 'Réinitialiser le mot de passe' }}
                </button>
                <button v-if="user.role==='demo'" type="button" :class="actionStyles.deleteUser"
                        :disabled="deletingUserId===user.id" :aria-label="`Supprimer ${user.email}`"
                        :title="`Supprimer ${user.email}`" @click="removeDemoUser(user)"><img :src="trashIcon"
                                                                                              alt=""><span>Supprimer</span>
                </button>
                <button :class="actionStyles.saveUser" @click="saveUser(user)">Enregistrer</button>
              </article>
            </div>
            <p v-else :class="styles.adminEmpty">Aucun utilisateur inscrit.</p></section>
        </fieldset>
      </template>
      <p v-if="message" :class="styles.adminMessage">{{ messageIsError ? '⚠' : '✓' }} {{ message }}</p></div>
    <div v-if="draft" :class="styles.modal" @click.self="draft=null">
      <form v-demo-readonly="isDemo" :class="styles.editor" @submit.prevent="saveProduct">
        <button type="button" data-demo-interactive aria-label="Fermer" @click="draft=null">×</button>
        <h2>{{ draft.id ? 'Modifier' : 'Créer' }} un produit</h2><label>Nom<input v-model="draft!.name" required>
        <FieldValidation :issues="validation.product" field="product.name"/>
      </label><label>Adresse
        de la page<input v-model="draft!.slug" required>
        <FieldValidation :issues="validation.product" field="product.slug"/>
      </label><label>Catégories<select v-model="draft!.categoryIds"
                                       multiple required>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.label }}</option>
      </select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs catégories.</small>
        <FieldValidation :issues="validation.product" field="product.categoryIds"/>
      </label><label>Univers<select
          v-model="draft!.universeIds" multiple required>
        <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.title }}</option>
      </select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs univers.</small>
        <FieldValidation :issues="validation.product" field="product.universeIds"/>
      </label><label>Prix en
        centimes<input v-model.number="draft!.priceCents" type="number" min="1" required>
        <FieldValidation :issues="validation.product" field="product.priceCents"/>
      </label>
        <ImageUpload v-model="draft!.image" label="Image du produit" :readonly="isDemo" required/>
        <FieldValidation :issues="validation.product" field="product.image"/>
        <label>Description<textarea v-model="draft!.description" rows="5" required/>
          <FieldValidation :issues="validation.product" field="product.description"/>
        </label>
        <div :class="styles.checks"><label><input v-model="draft!.active" type="checkbox"> En ligne
          <FieldValidation :issues="validation.product" field="product.active"/>
        </label></div>
        <button type="submit">{{ saving === 'product' ? 'Enregistrement…' : 'Enregistrer le produit' }}</button>
      </form>
    </div>
    <MediaLibrary v-if="mediaOpen" :readonly="isDemo" @close="mediaOpen=false"/>
  </main>
</template>
