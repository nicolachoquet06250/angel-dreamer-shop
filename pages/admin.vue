<script setup lang="ts">
import type {Category, Product, SiteContent, Universe} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import type {ValidationIssue} from '~/utils/admin-validation';
import {
  hasValidationErrors,
  validateCartSeo,
  validateCategoryPage,
  validateHomeContent,
  validateProduct,
  validateProfileSeo,
  validateSeo,
  validateUniversePage
} from '~/utils/admin-validation';
import styles from '~/assets/css/site.module.css';
import mediaIcon from '~/assets/icons/image.png';
import trashIcon from '~/assets/icons/trash.png';
import {renderSeoTemplate} from '~/utils/seo-template';
import {
  type AdminMainTab,
  adminPagePath,
  type AdminPageTab,
  adminPageTabs,
  adminSeoPath,
  type AdminSeoSection,
  adminSeoTabs,
  type AdminTab,
  resolveAdminRoute
} from '~/utils/admin-routing';

const TiptapEditor = defineAsyncComponent(() => import('~/components/TiptapEditor.vue'))

const actionStyles = useCssModule('actionStyles')
type UserRow = { id: number; email: string; role: 'admin' | 'customer' | 'demo'; active: boolean; createdAt: string };
type DiscountType = 'percent' | 'fixed'
type DiscountScope = 'product' | 'category' | 'universe'
type PromoScope = 'product' | 'category' | 'universe' | 'all'
type DiscountRule = { scope: DiscountScope; targetId: number }
type PromoRule = { scope: PromoScope; targetId: number | null; type: DiscountType; value: number }
type DiscountRow = {
  id: number;
  label: string;
  type: DiscountType;
  value: number;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  rules: DiscountRule[]
}
type PromoCodeRow = {
  id: number;
  code: string;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  rules: PromoRule[]
}
const previewDark = ref(false)
const categoryPreviewDark = ref(false)
const universePreviewDark = ref(false)
const route = useRoute();
const router = useRouter();
const adminRoute = computed(() => resolveAdminRoute(route.params.path ?? route.params.tab, route.query.tab));
const activeTab = computed<AdminTab>(() => adminRoute.value.activeTab);
const activeMainTab = computed<AdminMainTab>(() => adminRoute.value.mainTab);
const activePageTab = computed<AdminPageTab>(() => adminRoute.value.pageTab);
const activeSeoSection = computed<AdminSeoSection>(() => adminRoute.value.seoSection);
const showPageThemePreview = computed(() => activePageTab.value === 'content'
    || activePageTab.value === 'category'
    || activePageTab.value === 'universe');
const activePagePreviewDark = computed<boolean>({
  get() {
    if (activePageTab.value === 'category') return categoryPreviewDark.value;
    if (activePageTab.value === 'universe') return universePreviewDark.value;
    return previewDark.value
  },
  set(value) {
    if (activePageTab.value === 'category') categoryPreviewDark.value = value;
    else if (activePageTab.value === 'universe') universePreviewDark.value = value;
    else previewDark.value = value
  }
});
if (route.path !== adminRoute.value.canonicalPath || route.query.tab) {
  await navigateTo(adminRoute.value.canonicalPath, {replace: true})
}
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
const discounts = ref<DiscountRow[]>([]);
const promoCodes = ref<PromoCodeRow[]>([]);
const tabs = computed(() => [{
  id: 'pages' as const,
  label: 'Pages'
}, {
  id: 'seo' as const,
  label: 'Référencement'
}, {
  id: 'products' as const,
  label: 'Produits',
  count: products.value.length
}, {
  id: 'promotions' as const,
  label: 'Promotions',
  count: discounts.value.length + promoCodes.value.length
}, {
  id: 'users' as const,
  label: 'Utilisateurs',
  count: users.value.length
}]);
const content = reactive<SiteContent>({...defaultSiteContent});
const saving = ref('');
const message = ref('');
const messageIsError = ref(false);
const validation = reactive<Record<string, ValidationIssue[]>>({
  content: [],
  category: [],
  universe: [],
  seo: [],
  cart: [],
  profile: [],
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
  cart: false,
  profile: false,
  product: false
});
const adminDocumentTitle = computed(() => {
  const section = mediaOpen.value
      ? 'Médiathèque'
      : activeMainTab.value === 'pages'
          ? adminPageTabs.find(tab => tab.id === activePageTab.value)?.label
          : activeMainTab.value === 'seo'
              ? `${adminSeoTabs.find(tab => tab.id === activeSeoSection.value)?.label} — Référencement`
              : tabs.value.find(tab => tab.id === activeMainTab.value)?.label;
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

async function selectTab(tab: AdminMainTab) {
  const destination = tab === 'pages'
      ? adminPagePath(activePageTab.value)
      : tab === 'seo'
          ? adminSeoPath(activeSeoSection.value)
          : `/admin/${tab}`;
  await router.replace(destination)
}

async function selectPageTab(tab: string) {
  const selected = adminPageTabs.find(item => item.id === tab);
  if (selected) await router.replace(adminPagePath(selected.id))
}

async function selectSeoSection(section: AdminSeoSection) {
  await router.replace(adminSeoPath(section))
}

async function load() {
  if (!me.value?.allowed) return;
  products.value = await $fetch<Product[]>('/api/admin/products');
  favoriteIds.value = products.value.filter(product => product.featured).sort((a, b) => (a.featuredPosition ?? 99) - (b.featuredPosition ?? 99)).slice(0, 4).map(product => product.id);
  users.value = await $fetch<UserRow[]>('/api/admin/users');
  universes.value = await $fetch<Universe[]>('/api/admin/universes');
  categories.value = await $fetch<Category[]>('/api/admin/categories');
  Object.assign(content, defaultSiteContent, await $fetch<SiteContent>('/api/content'));
  discounts.value = await $fetch<DiscountRow[]>('/api/admin/discounts');
  promoCodes.value = await $fetch<PromoCodeRow[]>('/api/admin/promo-codes');
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
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
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
  try {
    const isNew = !draft.value.id;
    await $fetch(isNew ? '/api/admin/products' : `/api/admin/products/${draft.value.id}`, {
      method: isNew ? 'POST' : 'PUT',
      body: draft.value
    });
    draft.value = null;
    await load();
    message.value = 'Produit enregistré'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function removeProduct(p: Product) {
  if (!confirm(`Supprimer ${p.name} ?`)) return;
  await $fetch(`/api/admin/products/${p.id}`, {method: 'DELETE'});
  await load()
}

async function saveUser(user: UserRow) {
  messageIsError.value = false;
  try {
    await $fetch(`/api/admin/users/${user.id}`, {method: 'PUT', body: {role: user.role, active: user.active}});
    message.value = 'Droits utilisateur enregistrés'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  }
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
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
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
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
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
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function saveCartSeo() {
  validationAttempted.cart = true;
  validation.cart = validateCartSeo(content);
  if (hasValidationErrors(validation.cart)) {
    messageIsError.value = true;
    message.value = 'Page panier non enregistrée : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'cart';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page panier enregistrée'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function saveCgu() {
  saving.value = 'cgu';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'CGU enregistrées'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function saveContact() {
  saving.value = 'contact';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page contact enregistrée'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function saveCgv() {
  saving.value = 'cgv';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'CGV enregistrées'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

async function saveProfileSeo() {
  validationAttempted.profile = true;
  validation.profile = validateProfileSeo(content);
  if (hasValidationErrors(validation.profile)) {
    messageIsError.value = true;
    message.value = 'Page profil non enregistrée : corrigez les erreurs du formulaire.';
    return
  }
  saving.value = 'profile';
  messageIsError.value = false;
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page profil enregistrée'
  } catch (e: any) {
    messageIsError.value = true;
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = ''
  }
}

const pageSaveActions: Record<AdminPageTab, () => Promise<void>> = {
  content: saveContent,
  category: saveCategoryPage,
  universe: saveUniversePage,
  cart: saveCartSeo,
  profile: saveProfileSeo,
  contact: saveContact,
  cgu: saveCgu,
  cgv: saveCgv
};
const activePageSaveLabel = computed(() => {
  if (activePageTab.value === 'cgu') return 'Enregistrer les CGU';
  if (activePageTab.value === 'cgv') return 'Enregistrer les CGV';
  if (activePageTab.value === 'contact') return 'Enregistrer';
  return 'Enregistrer la page'
});

async function saveActivePage() {
  await pageSaveActions[activePageTab.value]()
}

watch([content, categories, universes, favoriteIds], () => {
  if (validationAttempted.content) validation.content = validateHomeContent(content, categories.value, universes.value, favoriteIds.value)
  if (validationAttempted.category) validation.category = validateCategoryPage(content)
  if (validationAttempted.universe) validation.universe = validateUniversePage(content)
  if (validationAttempted.seo) validation.seo = validateSeo(content)
  if (validationAttempted.cart) validation.cart = validateCartSeo(content)
  if (validationAttempted.profile) validation.profile = validateProfileSeo(content)
}, {deep: true})

watch(draft, value => {
  if (value && validationAttempted.product) validation.product = validateProduct(value)
}, {deep: true})

// --- Promotions ---
const discountDraft = ref<DiscountRow | null>(null)
const promoCodeDraft = ref<PromoCodeRow | null>(null)
const promotionSaving = ref(false)

const discountValueEuros = computed({
  get: () => discountDraft.value && discountDraft.value.type === 'fixed' ? discountDraft.value.value / 100 : (discountDraft.value?.value ?? 0),
  set: (v: number) => {
    if (discountDraft.value) discountDraft.value.value = discountDraft.value.type === 'fixed' ? Math.round(v * 100) : v
  }
})

function blankDiscount(): DiscountRow {
  return {
    id: 0,
    label: '',
    type: 'percent',
    value: 10,
    active: true,
    startsAt: null,
    endsAt: null,
    rules: [{scope: 'product', targetId: 0}]
  }
}

function blankPromoCode(): PromoCodeRow {
  return {
    id: 0,
    code: '',
    active: true,
    startsAt: null,
    endsAt: null,
    rules: [{scope: 'all', targetId: null, type: 'percent', value: 10}]
  }
}

function editDiscount(d?: DiscountRow) {
  discountDraft.value = d ? JSON.parse(JSON.stringify(d)) : blankDiscount()
}

function editPromoCode(p?: PromoCodeRow) {
  promoCodeDraft.value = p ? JSON.parse(JSON.stringify(p)) : blankPromoCode()
}

function addDiscountRule() {
  discountDraft.value?.rules.push({scope: 'product', targetId: 0})
}

function removeDiscountRule(index: number) {
  discountDraft.value?.rules.splice(index, 1)
}

function addPromoRule() {
  promoCodeDraft.value?.rules.push({scope: 'all', targetId: null, type: 'percent', value: 10})
}

function removePromoRule(index: number) {
  promoCodeDraft.value?.rules.splice(index, 1)
}

async function saveDiscount() {
  if (!discountDraft.value) return
  promotionSaving.value = true
  messageIsError.value = false
  try {
    const isNew = !discountDraft.value.id
    await $fetch(isNew ? '/api/admin/discounts' : `/api/admin/discounts/${discountDraft.value.id}`, {
      method: isNew ? 'POST' : 'PUT',
      body: discountDraft.value
    })
    discountDraft.value = null
    discounts.value = await $fetch<DiscountRow[]>('/api/admin/discounts')
    message.value = 'Réduction enregistrée'
  } catch (e: any) {
    messageIsError.value = true
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    promotionSaving.value = false
  }
}

async function removeDiscount(d: DiscountRow) {
  if (!confirm(`Supprimer la réduction « ${d.label} » ?`)) return
  await $fetch(`/api/admin/discounts/${d.id}`, {method: 'DELETE'})
  discounts.value = discounts.value.filter(item => item.id !== d.id)
  message.value = 'Réduction supprimée'
}

async function savePromoCode() {
  if (!promoCodeDraft.value) return
  promotionSaving.value = true
  messageIsError.value = false
  try {
    const isNew = !promoCodeDraft.value.id
    await $fetch(isNew ? '/api/admin/promo-codes' : `/api/admin/promo-codes/${promoCodeDraft.value.id}`, {
      method: isNew ? 'POST' : 'PUT',
      body: promoCodeDraft.value
    })
    promoCodeDraft.value = null
    promoCodes.value = await $fetch<PromoCodeRow[]>('/api/admin/promo-codes')
    message.value = 'Code promo enregistré'
  } catch (e: any) {
    messageIsError.value = true
    message.value = e?.data?.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    promotionSaving.value = false
  }
}

async function removePromoCode(p: PromoCodeRow) {
  if (!confirm(`Supprimer le code promo « ${p.code} » ?`)) return
  await $fetch(`/api/admin/promo-codes/${p.id}`, {method: 'DELETE'})
  promoCodes.value = promoCodes.value.filter(item => item.id !== p.id)
  message.value = 'Code promo supprimé'
}

function insertSeoVar(field: 'seoCartTitle' | 'seoProfileTitle', label: string) {
  const current = String(content[field] ?? '')
  ;(content as any)[field] = `${current}${current && !current.endsWith(' ') ? ' ' : ''}[${label}]`
}

function scopeLabel(scope: string, targetId: number | null): string {
  if (scope === 'all') return 'Tout le catalogue'
  if (scope === 'product') {
    const p = products.value.find(item => item.id === targetId)
    return p ? `Produit : ${p.name}` : `Produit #${targetId}`
  }
  if (scope === 'category') {
    const c = categories.value.find(item => item.id === targetId)
    return c ? `Catégorie : ${c.label}` : `Catégorie #${targetId}`
  }
  if (scope === 'universe') {
    const u = universes.value.find(item => item.id === targetId)
    return u ? `Univers : ${u.title}` : `Univers #${targetId}`
  }
  return scope
}
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

.pagePanel {
  min-width: 0
}

.pagePanel > label {
  display: grid;
  gap: 7px;
  margin: 14px 0;
  font-size: 12px
}

.pageEditorHeader {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid var(--line);
  background: var(--bg)
}

.pageEditorHeader h3 {
  margin: 4px 0;
  font-size: 24px
}

.pageEditorHeader p {
  margin: 6px 0 0;
  color: var(--muted)
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

.previewTitle {
  margin: 15px 0 5px;
  padding: 12px;
  border: 1px solid var(--line);
  background: var(--bg);
  font-weight: 700;
  font-size: 14px
}

.variables {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px
}

.variables small {
  color: var(--muted)
}

.variables button {
  padding: 6px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  color: var(--text);
  font-size: 10px;
  cursor: pointer
}

.variables button:hover {
  border-color: var(--accent);
  color: var(--accent)
}

.discountProductCard {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden
}

.discountProductCard img {
  height: 60px;
  width: auto;
  max-width: 200px;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0
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
                  :aria-selected="activeMainTab===tab.id"
                  :aria-controls="tab.id==='pages'?`panel-${activePageTab}`:`panel-${tab.id}`"
                  :class="activeMainTab===tab.id?styles.adminTabActive:''" @click="selectTab(tab.id)">
            <span>{{ tab.label }}</span><b v-if="tab.count!==undefined">{{ tab.count }}</b></button>
        </HorizontalCarousel>
        <fieldset v-demo-readonly="isDemo" :class="actionStyles.readOnlyScope">
          <section v-if="activeMainTab==='pages'" :class="styles.adminPanel">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>CONTENU ET APPARENCE</small>
                <h2>Pages</h2>
                <p>Gérez le contenu et l’apparence des différentes pages de votre boutique.</p></div>
              <div :class="actionStyles.actions">
                <button v-if="showPageThemePreview" type="button" data-demo-interactive
                        :class="actionStyles.themeToggle" :aria-pressed="activePagePreviewDark"
                        @click="activePagePreviewDark=!activePagePreviewDark">
                  {{ activePagePreviewDark ? '☾' : '☀' }}
                </button>
                <button type="button" :disabled="saving===activePageTab" @click="saveActivePage">
                  {{ saving === activePageTab ? 'Enregistrement…' : activePageSaveLabel }}
                </button>
              </div>
            </div>
            <AdminSubTabs :tabs="adminPageTabs" :active="activePageTab" label="les sous-onglets des pages"
                          id-prefix="page-tab" panel-prefix="panel" @select="selectPageTab"/>
            <section v-if="activeTab==='content'" id="panel-content" :class="actionStyles.pagePanel" role="tabpanel"
                     aria-labelledby="page-tab-content">
              <header :class="actionStyles.pageEditorHeader"><small>PAGE D’ACCUEIL</small>
                <h3>Éditeur visuel</h3>
                <p>Contrôlez les textes, la navigation, les univers et leurs images avec un aperçu immédiat.</p>
              </header>
            <HomeContentEditor v-model="content" v-model:universes="universes" v-model:categories="categories"
                               v-model:favorite-ids="favoriteIds" :products="products" :preview-dark="previewDark"
                               :readonly="isDemo" :validation-issues="validation.content"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="previewDark"
                      @click="previewDark=!previewDark">{{ previewDark ? '☾' : '☀' }}
              </button>
              <button type="button" :disabled="saving==='content'" @click="saveContent">
                {{ saving === 'content' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
            <section v-else-if="activeTab==='category'" id="panel-category" :class="actionStyles.pagePanel"
                     role="tabpanel"
                     aria-labelledby="page-tab-category">
              <header :class="actionStyles.pageEditorHeader"><small>PAGE CATÉGORIE</small>
                <h3>Éditeur visuel</h3>
                <p>Personnalisez les contenus génériques de toutes les pages catégorie. Leur titre reste déterminé par
                  la
                  catégorie consultée.</p>
              </header>
            <CategoryPageEditor v-model="content" :preview-dark="categoryPreviewDark"
                                :validation-issues="validation.category"/>
            <div :class="actionStyles.bottomSave">
              <button type="button" data-demo-interactive :class="actionStyles.themeToggle" :aria-pressed="categoryPreviewDark"
                      @click="categoryPreviewDark=!categoryPreviewDark">{{ categoryPreviewDark ? '☾' : '☀' }}
              </button>
              <button type="button" :disabled="saving==='category'" @click="saveCategoryPage">
                {{ saving === 'category' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
            <section v-else-if="activeTab==='universe'" id="panel-universe" :class="actionStyles.pagePanel"
                     role="tabpanel"
                     aria-labelledby="page-tab-universe">
              <header :class="actionStyles.pageEditorHeader"><small>PAGE UNIVERS</small>
                <h3>Éditeur visuel</h3>
                <p>Personnalisez les libellés communs à toutes les pages univers. Le titre reprend automatiquement
                  l’univers consulté.</p>
              </header>
              <UniversePageEditor v-model="content" :categories="categories" :preview-dark="universePreviewDark"
                                  :validation-issues="validation.universe"/>
              <div :class="actionStyles.bottomSave">
                <button type="button" data-demo-interactive :class="actionStyles.themeToggle"
                        :aria-pressed="universePreviewDark"
                        @click="universePreviewDark=!universePreviewDark">{{
                    universePreviewDark ? '☾' : '☀'
                  }}
                </button>
                <button type="button" :disabled="saving==='universe'" @click="saveUniversePage">
                  {{ saving === 'universe' ? 'Enregistrement…' : 'Enregistrer la page' }}
                </button>
              </div>
            </section>
            <section v-else-if="activeTab==='cart'" id="panel-cart" :class="actionStyles.pagePanel" role="tabpanel"
                     aria-labelledby="page-tab-cart">
              <header :class="actionStyles.pageEditorHeader"><small>VOTRE PANIER</small>
                <h3>Page panier</h3>
                <p>Configurez le titre affiché dans l’onglet du navigateur pour la page panier.</p>
              </header>
              <label>Modèle du titre<input v-model="content.seoCartTitle"
                                           placeholder="Votre panier | [Nom du site]"></label>
              <div :class="actionStyles.variables">
                <small>Insérer :</small>
                <button type="button" @click="insertSeoVar('seoCartTitle', 'Nom du site')">+ Nom du site</button>
              </div>
              <div :class="actionStyles.previewTitle">Aperçu :
                {{ renderSeoTemplate(content.seoCartTitle, {'Nom du site': content.seoSiteName}) }}
            </div>
            <div :class="actionStyles.bottomSave">
              <button type="button" :disabled="saving==='cart'" @click="saveCartSeo">
                {{ saving === 'cart' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
            </section>
            <section v-else-if="activeTab==='profile'" id="panel-profile" :class="actionStyles.pagePanel"
                     role="tabpanel"
                     aria-labelledby="page-tab-profile">
              <header :class="actionStyles.pageEditorHeader"><small>MON COMPTE</small>
                <h3>Page profil</h3>
                <p>Personnalisez le titre de la page de gestion du compte client.</p>
              </header>
              <label>Modèle du titre<input v-model="content.seoProfileTitle"
                                           placeholder="Mon compte | [Nom du site]"></label>
              <div :class="actionStyles.variables">
                <small>Insérer :</small>
                <button type="button" @click="insertSeoVar('seoProfileTitle', 'Nom du site')">+ Nom du site</button>
                <button type="button" @click="insertSeoVar('seoProfileTitle', 'Prénom')">+ Prénom</button>
                <button type="button" @click="insertSeoVar('seoProfileTitle', 'Nom')">+ Nom</button>
                <button type="button" @click="insertSeoVar('seoProfileTitle', 'Email')">+ Email</button>
              </div>
              <div :class="actionStyles.previewTitle">Aperçu : {{
                  renderSeoTemplate(content.seoProfileTitle, {
                    'Nom du site': content.seoSiteName,
                    ['Prénom']: 'Jean',
                    'Nom': 'Dupont',
                    'Email': 'jean.dupont@example.com'
                  })
                }}
              </div>
              <div :class="actionStyles.bottomSave">
                <button type="button" :disabled="saving==='profile'" @click="saveProfileSeo">
                  {{ saving === 'profile' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </section>
            <section v-else-if="activeTab==='cgu'" id="panel-cgu" :class="actionStyles.pagePanel" role="tabpanel"
                     aria-labelledby="page-tab-cgu">
              <header :class="actionStyles.pageEditorHeader"><small>MENTIONS LÉGALES</small>
                <h3>CGU</h3>
                <p>Rédigez les Conditions Générales d'Utilisation. Le lien apparaîtra dans le footer si le contenu n'est
                  pas vide.</p>
              </header>
              <ClientOnly>
                <TiptapEditor :is-demo="isDemo" v-model="content.cguContent" placeholder="Rédigez ici vos CGU…"/>
              </ClientOnly>
              <div :class="actionStyles.bottomSave">
                <button type="button" :disabled="saving==='cgu'" @click="saveCgu">
                  {{ saving === 'cgu' ? 'Enregistrement…' : 'Enregistrer les CGU' }}
                </button>
              </div>
            </section>
            <section v-else-if="activeTab==='cgv'" id="panel-cgv" :class="actionStyles.pagePanel" role="tabpanel"
                     aria-labelledby="page-tab-cgv">
              <header :class="actionStyles.pageEditorHeader"><small>MENTIONS LÉGALES</small>
                <h3>CGV</h3>
                <p>Rédigez les Conditions Générales de Vente. Le lien apparaîtra dans le footer si le contenu n'est pas
                  vide.</p>
              </header>
              <ClientOnly>
                <TiptapEditor :is-demo="isDemo" v-model="content.cgvContent" placeholder="Rédigez ici vos CGV…"/>
              </ClientOnly>
              <div :class="actionStyles.bottomSave">
                <button type="button" :disabled="saving==='cgv'" @click="saveCgv">
                  {{ saving === 'cgv' ? 'Enregistrement…' : 'Enregistrer les CGV' }}
                </button>
              </div>
            </section>
            <section v-else-if="activeTab==='contact'" id="panel-contact" :class="actionStyles.pagePanel"
                     role="tabpanel"
                     aria-labelledby="page-tab-contact">
              <header :class="actionStyles.pageEditorHeader"><small>FORMULAIRE DE CONTACT</small>
                <h3>Page contact</h3>
                <p>Configurez l'adresse e-mail qui recevra les messages envoyés via le formulaire de contact.</p>
              </header>
              <label :class="styles.panelHeading">
                Email de contact
                <input v-model="content.contactEmail" type="email" placeholder="contact@example.com">
              </label>
              <div :class="actionStyles.bottomSave">
                <button type="button" :disabled="saving==='contact'" @click="saveContact">
                  {{ saving === 'contact' ? 'Enregistrement…' : 'Enregistrer' }}
                </button>
              </div>
            </section>
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
            <SeoEditor v-model="content" :section="activeSeoSection" :readonly="isDemo"
                       :validation-issues="validation.seo" @update:section="selectSeoSection"/>
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
          <section v-else-if="activeTab==='promotions'" id="panel-promotions" :class="styles.adminPanel" role="tabpanel"
                   aria-labelledby="tab-promotions">
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]">
              <div><small>RÉDUCTIONS ET CODES PROMO</small>
                <h2>Promotions</h2>
                <p>Gérez les réductions automatiques et les codes promo applicables au catalogue.</p></div>
            </div>

            <!-- Réductions ponctuelles -->
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]" style="margin-top:24px">
              <div><small>RÉDUCTIONS AUTOMATIQUES</small>
                <h2>Réductions</h2></div>
              <button type="button" data-demo-interactive @click="editDiscount()">+ Nouvelle réduction</button>
            </div>
            <div v-if="discounts.length" :class="styles.userRows">
              <article v-for="d in discounts" :key="d.id">
                <div :class="actionStyles.discountProductCard">
                  <template v-for="r in d.rules.filter(r => r.scope === 'product').slice(0,1)" :key="r.targetId">
                    <img v-if="products.find(p => p.id === r.targetId)?.image"
                         :src="products.find(p => p.id === r.targetId)!.image!.content"
                         :alt="products.find(p => p.id === r.targetId)!.name">
                  </template>
                  <div>
                    <strong>{{ d.label }}</strong>
                    <small>{{ d.type === 'percent' ? `${d.value} %` : `${(d.value / 100).toFixed(2)} €` }} ·
                      {{ d.active ? 'Active' : 'Inactive' }}</small>
                    <small v-if="d.startsAt || d.endsAt">{{
                        d.startsAt ? `Du ${d.startsAt.slice(0, 10)}` : ''
                      }}{{ d.endsAt ? ` au ${d.endsAt.slice(0, 10)}` : '' }}</small>
                    <small>{{ d.rules.map(r => scopeLabel(r.scope, r.targetId)).join(' · ') }}</small>
                  </div>
                </div>
                <button type="button" data-demo-interactive @click="editDiscount(d)">Modifier</button>
                <button type="button" @click="removeDiscount(d)">Supprimer</button>
              </article>
            </div>
            <p v-else :class="styles.adminEmpty">Aucune réduction configurée.</p>

            <!-- Codes promo -->
            <div :class="[styles.panelTitle,actionStyles.responsivePanelTitle]" style="margin-top:24px">
              <div><small>CODES PROMO</small>
                <h2>Codes promo</h2></div>
              <button type="button" data-demo-interactive @click="editPromoCode()">+ Nouveau code promo</button>
            </div>
            <div v-if="promoCodes.length" :class="styles.userRows">
              <article v-for="p in promoCodes" :key="p.id">
                <div>
                  <strong>{{ p.code }}</strong>
                  <small>{{
                      p.active ? 'Actif' : 'Inactif'
                    }}{{
                      (p.startsAt || p.endsAt) ? ` · ${p.startsAt ? `Du ${p.startsAt.slice(0, 10)}` : ''}${p.endsAt ? ` au ${p.endsAt.slice(0, 10)}` : ''}` : ''
                    }}</small>
                  <small>{{
                      p.rules.map(r => `${scopeLabel(r.scope, r.targetId)} — ${r.type === 'percent' ? `${r.value} %` : `${(r.value / 100).toFixed(2)} €`}`).join(' · ')
                    }}</small>
                </div>
                <button type="button" data-demo-interactive @click="editPromoCode(p)">Modifier</button>
                <button type="button" @click="removePromoCode(p)">Supprimer</button>
              </article>
            </div>
            <p v-else :class="styles.adminEmpty">Aucun code promo configuré.</p>

            <!-- Modal réduction -->
            <div v-if="discountDraft" :class="styles.modal" @click.self="discountDraft=null">
              <form v-demo-readonly="isDemo" :class="styles.editor" @submit.prevent="saveDiscount">
                <button type="button" data-demo-interactive aria-label="Fermer" @click="discountDraft=null">×</button>
                <h2>{{ discountDraft.id ? 'Modifier' : 'Créer' }} une réduction</h2>
                <label>Libellé<input v-model="discountDraft.label" required placeholder="Ex : Soldes été"></label>
                <label>Type
                  <select v-model="discountDraft.type">
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </label>
                <label>Valeur
                  <div :class="styles.inputSuffix">
                    <input v-model.number="discountValueEuros" type="number" min="0" step="0.01"
                           :max="discountDraft.type==='percent'?100:9999.99" required>
                    <span>{{ discountDraft.type === 'percent' ? '%' : '€' }}</span>
                  </div>
                </label>
                <div :class="styles.checks"><label><input v-model="discountDraft.active" type="checkbox"> Active</label>
                </div>
                <label>Date de début (optionnel)<input v-model="discountDraft.startsAt" type="date"></label>
                <label>Date de fin (optionnel)<input v-model="discountDraft.endsAt" type="date"></label>
                <fieldset>
                  <legend>Règles d'application</legend>
                  <div v-for="(rule, index) in discountDraft.rules" :key="index" :class="actionStyles.titleActions"
                       style="flex-wrap:wrap;margin-bottom:8px">
                    <select v-model="rule.scope" :aria-label="`Scope règle ${index+1}`">
                      <option value="product">Produit</option>
                      <option value="category">Catégorie</option>
                      <option value="universe">Univers</option>
                    </select>
                    <select v-if="rule.scope==='product'" v-model.number="rule.targetId"
                            :aria-label="`Produit règle ${index+1}`">
                      <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }}</option>
                    </select>
                    <select v-else-if="rule.scope==='category'" v-model.number="rule.targetId"
                            :aria-label="`Catégorie règle ${index+1}`">
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                    </select>
                    <select v-else v-model.number="rule.targetId" :aria-label="`Univers règle ${index+1}`">
                      <option v-for="uni in universes" :key="uni.id" :value="uni.id">{{ uni.title }}</option>
                    </select>
                    <button type="button" @click="removeDiscountRule(index)" :disabled="discountDraft.rules.length<=1">
                      −
                    </button>
                  </div>
                  <button type="button" @click="addDiscountRule">+ Ajouter une règle</button>
                </fieldset>
                <div :class="actionStyles.actions">
                  <button type="button" @click="discountDraft=null">Annuler</button>
                  <button type="submit" :disabled="promotionSaving">
                    {{ promotionSaving ? 'Enregistrement…' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Modal code promo -->
            <div v-if="promoCodeDraft" :class="styles.modal" @click.self="promoCodeDraft=null">
              <form v-demo-readonly="isDemo" :class="styles.editor" @submit.prevent="savePromoCode">
                <button type="button" data-demo-interactive aria-label="Fermer" @click="promoCodeDraft=null">×</button>
                <h2>{{ promoCodeDraft.id ? 'Modifier' : 'Créer' }} un code promo</h2>
                <label>Code<input v-model="promoCodeDraft.code" required placeholder="Ex : ETE2025"
                                  style="text-transform:uppercase"></label>
                <div :class="styles.checks"><label><input v-model="promoCodeDraft.active" type="checkbox"> Actif</label>
                </div>
                <label>Date de début (optionnel)<input v-model="promoCodeDraft.startsAt" type="date"></label>
                <label>Date de fin (optionnel)<input v-model="promoCodeDraft.endsAt" type="date"></label>
                <fieldset>
                  <legend>Règles de réduction</legend>
                  <div v-for="(rule, index) in promoCodeDraft.rules" :key="index" :class="actionStyles.titleActions"
                       style="flex-wrap:wrap;margin-bottom:8px">
                    <select v-model="rule.scope" :aria-label="`Scope règle ${index+1}`">
                      <option value="all">Tout le catalogue</option>
                      <option value="product">Produit</option>
                      <option value="category">Catégorie</option>
                      <option value="universe">Univers</option>
                    </select>
                    <select v-if="rule.scope==='product'" v-model.number="rule.targetId"
                            :aria-label="`Produit règle ${index+1}`">
                      <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }}</option>
                    </select>
                    <select v-else-if="rule.scope==='category'" v-model.number="rule.targetId"
                            :aria-label="`Catégorie règle ${index+1}`">
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                    </select>
                    <select v-else-if="rule.scope==='universe'" v-model.number="rule.targetId"
                            :aria-label="`Univers règle ${index+1}`">
                      <option v-for="uni in universes" :key="uni.id" :value="uni.id">{{ uni.title }}</option>
                    </select>
                    <select v-model="rule.type" :aria-label="`Type règle ${index+1}`">
                      <option value="percent">%</option>
                      <option value="fixed">€ fixe</option>
                    </select>
                    <div :class="styles.inputSuffix">
                      <input v-model.number="rule.value" type="number" min="0" :max="rule.type==='percent'?100:999999"
                             :aria-label="`Valeur règle ${index+1}`">
                      <span>{{ rule.type === 'percent' ? '%' : '€' }}</span>
                    </div>
                    <button type="button" @click="removePromoRule(index)" :disabled="promoCodeDraft.rules.length<=1">−
                    </button>
                  </div>
                  <button type="button" @click="addPromoRule">+ Ajouter une règle</button>
                </fieldset>
                <div :class="actionStyles.actions">
                  <button type="button" @click="promoCodeDraft=null">Annuler</button>
                  <button type="submit" :disabled="promotionSaving">
                    {{ promotionSaving ? 'Enregistrement…' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </section>
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
      <p v-if="message" :class="[styles.adminMessage, messageIsError && styles.adminMessageError]">
        {{ messageIsError ? '⚠' : '✓' }} {{ message }}
      </p></div>
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
