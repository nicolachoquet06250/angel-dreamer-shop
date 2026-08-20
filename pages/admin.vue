<script setup lang="ts">
import type {Category, Product, SiteContent, Universe} from '~/types/shop';
import {defaultSiteContent} from '~/types/shop';
import styles from '~/assets/css/site.module.css';

const actionStyles = useCssModule('actionStyles')
type UserRow = { id: number; email: string; role: 'admin' | 'customer'; active: boolean; createdAt: string };
type AdminTab = 'content' | 'category' | 'universe' | 'seo' | 'products' | 'users'
const previewDark = ref(false)
const categoryPreviewDark = ref(false)
const universePreviewDark = ref(false)
const route = useRoute();
const router = useRouter();
const requested = String(route.params.tab || route.query.tab || 'content');
const activeTab = ref<AdminTab>(['content', 'category', 'universe', 'seo', 'products', 'users'].includes(requested) ? requested as AdminTab : 'content');
if (route.query.tab) await navigateTo(`/admin/${activeTab.value}`, {replace: true});
const {data: me} = await useFetch<{ email: string; allowed: boolean }>('/api/admin/me');
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
  universes.value = await $fetch('/api/admin/universes');
  categories.value = await $fetch('/api/admin/categories');
  Object.assign(content, defaultSiteContent, await $fetch('/api/content'))
}

onMounted(load)

async function saveContent() {
  saving.value = 'content';
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    categories.value = await $fetch('/api/admin/categories', {method: 'PUT', body: categories.value});
    universes.value = await $fetch('/api/admin/universes', {method: 'PUT', body: universes.value});
    await $fetch('/api/admin/featured', {method: 'PUT', body: {productIds: favoriteIds.value}});
    await refreshNuxtData();
    products.value = await $fetch('/api/admin/products');
    message.value = 'Contenu, navigation, univers et favoris enregistrés'
  } finally {
    saving.value = ''
  }
}

function edit(p?: Product) {
  draft.value = p ? {...p, categoryIds: [...p.categoryIds], universeIds: [...p.universeIds]} : blank()
}

async function saveProduct() {
  if (!draft.value) return;
  saving.value = 'product';
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
  await $fetch(`/api/admin/users/${user.id}`, {method: 'PUT', body: {role: user.role, active: user.active}});
  message.value = 'Droits utilisateur enregistrés'
}

async function saveCategoryPage() {
  saving.value = 'category';
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page catégorie enregistrée'
  } finally {
    saving.value = ''
  }
}

async function saveUniversePage() {
  saving.value = 'universe';
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Page univers enregistrée'
  } finally {
    saving.value = ''
  }
}

async function saveSeo() {
  saving.value = 'seo';
  try {
    await $fetch('/api/admin/content', {method: 'PUT', body: content});
    message.value = 'Référencement enregistré'
  } finally {
    saving.value = ''
  }
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

.actions button:disabled, .bottomSave button:disabled {
  opacity: .55;
  cursor: wait
}
</style>
<template>
  <main>
    <StoreHeader/>
    <div :class="styles.admin">
      <div :class="styles.adminTitle">
        <div><small>ESPACE ADMINISTRATEUR</small>
          <h1>Administration</h1></div>
        <NuxtLink to="/">Voir la boutique ></NuxtLink>
      </div>
      <div v-if="!me?.allowed" :class="styles.adminNotice"><h2>Accès protégé</h2>
        <p>Connectez-vous avec un compte disposant du rôle administrateur.</p>
        <NuxtLink to="/connexion?returnTo=/admin" :class="styles.cta">Se connecter</NuxtLink>
      </div>
      <template v-else>
        <HorizontalCarousel :track-class="styles.adminTabs" label="les onglets d’administration">
          <button v-for="tab in tabs" :id="`tab-${tab.id}`" :key="tab.id" type="button" role="tab"
                  :aria-selected="activeTab===tab.id" :aria-controls="`panel-${tab.id}`"
                  :class="activeTab===tab.id?styles.adminTabActive:''" @click="selectTab(tab.id)">
            <span>{{ tab.label }}</span><b v-if="tab.count!==undefined">{{ tab.count }}</b></button>
        </HorizontalCarousel>
        <section v-if="activeTab==='content'" id="panel-content" :class="styles.adminPanel" role="tabpanel"
                 aria-labelledby="tab-content">
          <div :class="styles.panelTitle">
            <div><small>PAGE D’ACCUEIL</small>
              <h2>Éditeur visuel</h2>
              <p>Contrôlez les textes, la navigation, les univers et leurs images avec un aperçu immédiat.</p></div>
            <div :class="actionStyles.actions">
              <button type="button" :class="actionStyles.themeToggle" :aria-pressed="previewDark"
                      @click="previewDark=!previewDark">{{ previewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button @click="saveContent">{{ saving === 'content' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </div>
          <HomeContentEditor v-model="content" v-model:universes="universes" v-model:categories="categories"
                             v-model:favorite-ids="favoriteIds" :products="products" :preview-dark="previewDark"/>
          <div :class="actionStyles.bottomSave">
            <button type="button" :class="actionStyles.themeToggle" :aria-pressed="previewDark"
                    @click="previewDark=!previewDark">{{ previewDark ? '☾ Dark' : '☀ Light' }}
            </button>
            <button type="button" :disabled="saving==='content'" @click="saveContent">
              {{ saving === 'content' ? 'Enregistrement…' : 'Enregistrer la page' }}
            </button>
          </div>
        </section>
        <section v-else-if="activeTab==='category'" id="panel-category" :class="styles.adminPanel" role="tabpanel"
                 aria-labelledby="tab-category">
          <div :class="styles.panelTitle">
            <div><small>PAGE CATÉGORIE</small>
              <h2>Éditeur visuel</h2>
              <p>Personnalisez les contenus génériques de toutes les pages catégorie. Leur titre reste déterminé par la
                catégorie consultée.</p></div>
            <div :class="actionStyles.actions">
              <button type="button" :class="actionStyles.themeToggle" :aria-pressed="categoryPreviewDark"
                      @click="categoryPreviewDark=!categoryPreviewDark">{{ categoryPreviewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button type="button" :disabled="saving==='category'" @click="saveCategoryPage">
                {{ saving === 'category' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </div>
          <CategoryPageEditor v-model="content" :preview-dark="categoryPreviewDark"/>
          <div :class="actionStyles.bottomSave">
            <button type="button" :class="actionStyles.themeToggle" :aria-pressed="categoryPreviewDark"
                    @click="categoryPreviewDark=!categoryPreviewDark">{{ categoryPreviewDark ? '☾ Dark' : '☀ Light' }}
            </button>
            <button type="button" :disabled="saving==='category'" @click="saveCategoryPage">
              {{ saving === 'category' ? 'Enregistrement…' : 'Enregistrer la page' }}
            </button>
          </div>
        </section>
        <section v-else-if="activeTab==='universe'" id="panel-universe" :class="styles.adminPanel" role="tabpanel"
                 aria-labelledby="tab-universe">
          <div :class="styles.panelTitle">
            <div><small>PAGE UNIVERS</small>
              <h2>Éditeur visuel</h2>
              <p>Personnalisez les libellés communs à toutes les pages univers. Le titre reprend automatiquement
                l’univers consulté.</p></div>
            <div :class="actionStyles.actions">
              <button type="button" :class="actionStyles.themeToggle" :aria-pressed="universePreviewDark"
                      @click="universePreviewDark=!universePreviewDark">{{ universePreviewDark ? '☾ Dark' : '☀ Light' }}
              </button>
              <button type="button" :disabled="saving==='universe'" @click="saveUniversePage">
                {{ saving === 'universe' ? 'Enregistrement…' : 'Enregistrer la page' }}
              </button>
            </div>
          </div>
          <UniversePageEditor v-model="content" :categories="categories" :preview-dark="universePreviewDark"/>
          <div :class="actionStyles.bottomSave">
            <button type="button" :class="actionStyles.themeToggle" :aria-pressed="universePreviewDark"
                    @click="universePreviewDark=!universePreviewDark">{{ universePreviewDark ? '☾ Dark' : '☀ Light' }}
            </button>
            <button type="button" :disabled="saving==='universe'" @click="saveUniversePage">
              {{ saving === 'universe' ? 'Enregistrement…' : 'Enregistrer la page' }}
            </button>
          </div>
        </section>
        <section v-else-if="activeTab==='seo'" id="panel-seo" :class="styles.adminPanel" role="tabpanel"
                 aria-labelledby="tab-seo">
          <div :class="styles.panelTitle">
            <div><small>VISIBILITÉ ET PARTAGE</small>
              <h2>Référencement</h2>
              <p>Configurez les moteurs de recherche, les aperçus sociaux et les données structurées du site.</p></div>
            <div :class="actionStyles.actions">
              <button type="button" :disabled="saving==='seo'" @click="saveSeo">
                {{ saving === 'seo' ? 'Enregistrement…' : 'Enregistrer le référencement' }}
              </button>
            </div>
          </div>
          <SeoEditor v-model="content"/>
          <div :class="actionStyles.bottomSave">
            <button type="button" :disabled="saving==='seo'" @click="saveSeo">
              {{ saving === 'seo' ? 'Enregistrement…' : 'Enregistrer le référencement' }}
            </button>
          </div>
        </section>
        <section v-else-if="activeTab==='products'" id="panel-products" :class="styles.adminPanel" role="tabpanel"
                 aria-labelledby="tab-products">
          <div :class="styles.panelTitle">
            <div><small>CATALOGUE</small>
              <h2>Produits</h2>
              <p>Créez, modifiez ou masquez les articles de la boutique.</p></div>
            <button @click="edit()">+ Nouveau produit</button>
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
              <button @click="edit(p)">Modifier</button>
              <button @click="removeProduct(p)">Supprimer</button>
            </article>
          </div>
          <p v-else :class="styles.adminEmpty">Aucun produit dans le catalogue.</p></section>
        <section v-else id="panel-users" :class="styles.adminPanel" role="tabpanel" aria-labelledby="tab-users">
          <div :class="styles.panelHeading"><small>ACCÈS ET DROITS</small>
            <h2>Utilisateurs</h2>
            <p>Gérez les rôles administrateur et l’activation des comptes.</p></div>
          <div v-if="users.length" :class="styles.userRows">
            <article v-for="user in users" :key="user.id">
              <div><strong>{{ user.email }}</strong><small>Créé le
                {{ new Date(user.createdAt).toLocaleDateString('fr-FR') }}</small></div>
              <select v-model="user.role" :aria-label="`Rôle de ${user.email}`">
                <option value="customer">Client</option>
                <option value="admin">Administrateur</option>
              </select><label><input v-model="user.active" type="checkbox"> Actif</label>
              <button @click="saveUser(user)">Enregistrer</button>
            </article>
          </div>
          <p v-else :class="styles.adminEmpty">Aucun utilisateur inscrit.</p></section>
      </template>
      <p v-if="message" :class="styles.adminMessage">✓ {{ message }}</p></div>
    <div v-if="draft" :class="styles.modal" @click.self="draft=null">
      <form :class="styles.editor" @submit.prevent="saveProduct">
        <button type="button" aria-label="Fermer" @click="draft=null">×</button>
        <h2>{{ draft.id ? 'Modifier' : 'Créer' }} un produit</h2><label>Nom<input v-model="draft!.name" required></label><label>Adresse
        de la page<input v-model="draft!.slug" required></label><label>Catégories<select v-model="draft!.categoryIds"
                                                                                        multiple required>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.label }}</option>
      </select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs catégories.</small></label><label>Univers<select
          v-model="draft!.universeIds" multiple required>
        <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.title }}</option>
      </select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs univers.</small></label><label>Prix en
        centimes<input v-model.number="draft!.priceCents" type="number" min="1" required></label>
        <ImageUpload v-model="draft!.image" label="Image du produit" required/>
        <label>Description<textarea v-model="draft!.description" rows="5" required/></label>
        <div :class="styles.checks"><label><input v-model="draft!.active" type="checkbox"> En ligne</label></div>
        <button type="submit">{{ saving === 'product' ? 'Enregistrement…' : 'Enregistrer le produit' }}</button>
      </form>
    </div>
  </main>
</template>
