<script setup lang="ts">
import type {Category, ImageAsset, Product, SiteContent, Universe} from '~/types/shop';
import styles from '~/assets/css/content-editor.module.css';
import publicStyles from '~/assets/css/site.module.css';
import engagementStyles from '~/assets/css/engagement-icons.module.css';
import type {ValidationIssue} from '~/utils/admin-validation';

const pickerStyles = useCssModule('pickerStyles');
const fourCardStyles = useCssModule('fourCardStyles');
const previewTheme = useCssModule('previewTheme');
const engagementPreview = useCssModule('engagementPreview')
const props = withDefaults(defineProps<{ products: Product[]; previewDark: boolean; readonly?: boolean; validationIssues?: ValidationIssue[] }>(), {readonly: false});
const model = defineModel<SiteContent>({required: true});
const universes = defineModel<Universe[]>('universes', {required: true});
const categories = defineModel<Category[]>('categories', {required: true});
const favoriteIds = defineModel<number[]>('favoriteIds', {required: true})
const imageFor = useThemedImage()

function previewImage(image: ImageAsset | null) {
  return resolveImageVariant(image, props.previewDark)
}

const pickerOpen = ref(false);
const replaceIndex = ref<number | null>(null);
const selectedProducts = computed(() => favoriteIds.value.map(id => props.products.find(product => product.id === id)).filter((product): product is Product => Boolean(product)))
const topGroups = [{
  title: 'Barre et navigation',
  fields: [['announcement', 'Annonce'], ['paymentLabel', 'Mention de paiement'], ['logoText', 'Nom de la marque']]
}, {
  title: 'Bannière principale',
  fields: [['heroTitle', 'Titre principal'], ['heroSubtitle', 'Sous-titre'], ['heroCta', 'Texte du bouton']]
}] as const
const universeFields = [['universesEyebrow', 'Surtitre'], ['universesTitle', 'Titre']] as const
const selectionFields = [['favoritesEyebrow', 'Surtitre'], ['favoritesTitle', 'Titre']] as const
const workshopFields = [['workshopEyebrow', 'Surtitre'], ['workshopTitle', 'Titre'], ['workshopText', 'Description']] as const
const footerFields = [['footerBrand', 'Marque'], ['footerText', 'Mention de pied de page']] as const

function addUniverse() {
  universes.value.push({
    id: 0,
    title: 'Nouvel univers',
    slug: '',
    image: null,
    position: universes.value?.length,
    active: true
  })
}

function removeUniverse(index: number) {
  universes.value.splice(index, 1)
}

function move(index: number, direction: number) {
  const target = index + direction;
  if (target < 0 || target >= universes.value?.length) return;
  const [item] = universes.value.splice(index, 1);
  universes.value.splice(target, 0, item as Universe)
}

function addCategory() {
  categories.value.push({
    id: 0,
    label: 'Nouveau lien',
    slug: 'nouveau-lien',
    position: categories.value.length,
    active: true
  })
}

function removeCategory(index: number) {
  categories.value.splice(index, 1)
}

function moveCategory(index: number, direction: number) {
  const target = index + direction;
  if (target < 0 || target >= categories.value.length) return;
  const [item] = categories.value.splice(index, 1);
  categories.value.splice(target, 0, item as Category)
}

function openPicker(index: number | null = null) {
  replaceIndex.value = index;
  pickerOpen.value = true
}

function removeFavorite(index: number) {
  favoriteIds.value.splice(index, 1)
}

function pickProduct(id: number) {
  if (replaceIndex.value !== null) {
    if (favoriteIds.value.some((value, index) => value === id && index !== replaceIndex.value)) return;
    favoriteIds.value.splice(replaceIndex.value, 1, id);
    pickerOpen.value = false;
    replaceIndex.value = null;
    return
  }
  const index = favoriteIds.value.indexOf(id);
  if (index >= 0) favoriteIds.value.splice(index, 1); else if (favoriteIds.value.length < 4) favoriteIds.value.push(id)
}

function imageScale(image: Universe['image']) {
  return image ? Math.max(.1, Math.min(3, image.width / Math.max(1, image.naturalWidth))) : 1
}

function previewPixels(image: Universe['image'], base: number) {
  return Math.round(base * imageScale(image))
}

function scaled(image: Universe['image']) {
  const selected = previewImage(image);
  if (!selected) return {};
  return {
    backgroundImage: `linear-gradient(#0004,#0009),url(${selected.content})`,
    backgroundSize: `${imageScale(image) * 100}% auto`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }
}
</script>
<style module="pickerStyles">
.selection {
  display: grid;
  gap: 8px;
  padding: 0 14px 16px
}

.selection article {
  display: grid;
  grid-template-columns:54px 1fr auto auto;
  align-items: center;
  gap: 9px;
  padding: 8px;
  border: 1px solid var(--line);
  background: var(--surface)
}

.selection article img {
  width: 54px;
  height: 44px;
  object-fit: cover
}

.selection article div {
  display: grid
}

.selection article small, .selection > p {
  color: var(--muted);
  font-size: 9px
}

.selection article button, .add {
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  padding: 7px;
  cursor: pointer;
  font-size: 9px
}

.selection article button:last-child {
  color: var(--accent)
}

.add {
  padding: 12px;
  border-style: dashed;
  color: var(--accent);
  font-weight: 700
}

.selection > p {
  margin: 0
}

.overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  background: #000b;
  display: grid;
  place-items: center;
  padding: 20px
}

.modal {
  width: min(820px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: var(--surface);
  color: var(--text);
  padding: 24px
}

.modal header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 16px
}

.modal header small {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: .15em
}

.modal h2 {
  margin: 4px 0
}

.modal header p {
  margin: 0;
  color: var(--muted);
  font-size: 11px
}

.modal header > button {
  border: 0;
  background: none;
  color: var(--text);
  font-size: 28px;
  cursor: pointer
}

.grid {
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  gap: 10px;
  padding: 18px 0
}

.grid > button {
  display: grid;
  grid-template-columns:82px 1fr 26px;
  align-items: center;
  gap: 12px;
  padding: 9px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  text-align: left;
  cursor: pointer
}

.grid > button:disabled {
  opacity: .4;
  cursor: not-allowed
}

.grid > button img {
  width: 82px;
  height: 68px;
  object-fit: cover
}

.grid > button span {
  display: grid;
  gap: 4px
}

.grid > button small {
  color: var(--muted)
}

.grid > button b {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--text);
  color: var(--bg)
}

.grid .selected {
  border-color: var(--accent)
}

.grid .selected b {
  background: var(--accent);
  color: white
}

.modal footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  padding-top: 16px;
  font-size: 11px
}

.modal footer button {
  border: 0;
  background: var(--accent);
  color: white;
  padding: 10px 16px;
  cursor: pointer
}

.previewProductGrid {
  grid-template-columns:repeat(2, 1fr) !important;
  gap: 6px !important;
  margin: 0 12px
}

.previewProductGrid article {
  min-width: 0
}

.previewProductGrid article > div:first-child {
  height: 88px
}

.previewProductGrid article > div:last-child {
  padding: 7px
}

.previewProductGrid article h3 {
  font-size: 7px;
  margin: 2px 0
}

.previewProductGrid article small {
  font-size: 5px
}

.previewProductGrid article strong {
  font-size: 7px
}

.previewProductGrid article button {
  width: 24px;
  height: 24px;
  font-size: 14px;
  pointer-events: none
}

.previewEmpty {
  grid-column: 1/-1;
  margin: 0;
  padding: 18px;
  border: 1px dashed #bbb;
  text-align: center;
  color: #777;
  font-size: 7px
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns:1fr
  }

  .selection article {
    grid-template-columns:45px 1fr
  }

  .selection article button {
    grid-row: 2
  }

  .selection article img {
    width: 45px
  }
}
</style>
<style module="fourCardStyles">
.grid {
  grid-template-columns:repeat(4, minmax(0, 1fr)) !important;
  gap: 4px !important
}

.grid article {
  min-width: 0
}

.grid article > div:first-child {
  height: 62px
}

.grid article > div:last-child {
  min-width: 0;
  padding: 4px
}

.grid article > div:last-child > div {
  min-width: 0
}

.grid article h3 {
  font-size: 6px
}

.grid article small {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 4px
}

.grid article strong {
  font-size: 6px
}

.grid article button {
  width: 18px;
  height: 18px;
  font-size: 11px
}
</style>
<style module="previewTheme">
.light {
  --bg: #f5f2eb;
  --surface: #fffdf8;
  --text: #0e0e0d;
  --muted: #6c675e;
  --line: #d7d1c8;
  background: #f5f2eb !important;
  color: #0e0e0d !important;
  border-color: #d7d1c8 !important
}

.light > div {
  border-color: #d7d1c8 !important
}

.dark {
  --bg: #111210;
  --surface: #181916;
  --text: #f1eadf;
  --muted: #aaa399;
  --line: #383a35;
  background: #111210 !important;
  color: #f1eadf !important;
  border-color: #383a35 !important
}

.dark > div {
  border-color: #383a35 !important
}

.heroLight {
  background-color: #f5f2eb !important;
  color: #111 !important
}

.heroDark {
  background-color: #222 !important;
  color: white !important
}

.workshopDark {
  background: #181916 !important;
  border-color: #383a35 !important
}

.workshopDark p {
  color: #aaa399 !important
}
</style>
<style module="engagementPreview">.item img {
  width: 1.6em !important;
  height: 1.6em !important
}</style>
<template>
  <div :class="styles.layout">
    <div :class="styles.controls">
      <template v-for="(group, index) in topGroups" :key="group.title">
        <details :open="index === 0">
          <summary>{{ group.title }}<span>{{ group.fields?.length }} champs</span></summary>
          <div :class="styles.fields"><label v-for="field in group.fields" :key="field[0]">{{ field[1] }}<textarea
              v-if="field[0] === 'heroTitle' || field[0] === 'heroSubtitle' || (field[0] as unknown as 'workshopText') === 'workshopText'"
              v-model="model[field[0]]" rows="3" maxlength="500"/><input v-else v-model="model[field[0]]"
                                                                         maxlength="500">
            <FieldValidation :issues="validationIssues" :field="field[0]"/>
          </label></div>
          <div v-if="group.title === 'Bannière principale'" :class="styles.images">
            <ImageUpload v-model="model.heroImage" label="Image principale" :readonly="readonly"/>
            <FieldValidation :issues="validationIssues" field="heroImage"/>
          </div>
        </details>
        <details v-if="index === 0">
          <summary>Liens de navigation<span>{{ categories.length }} liens</span></summary>
          <div :class="styles.universeEditor">
            <article v-for="(category, categoryIndex) in categories" :key="category.id || `category-${categoryIndex}`">
              <div :class="styles.universeToolbar"><strong>Lien {{ categoryIndex + 1 }}</strong><span><button
                  type="button" :disabled="categoryIndex===0" @click="moveCategory(categoryIndex,-1)">↑</button><button
                  type="button" :disabled="categoryIndex===categories.length-1"
                  @click="moveCategory(categoryIndex,1)">↓</button><button type="button"
                                                                           @click="removeCategory(categoryIndex)">Supprimer</button></span>
              </div>
              <label>Label<input v-model="category.label" maxlength="80" required>
                <FieldValidation :issues="validationIssues" :field="`categories.${categoryIndex}.label`"/>
              </label><label>Slug<input
                v-model="category.slug" maxlength="80" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required>
              <FieldValidation :issues="validationIssues" :field="`categories.${categoryIndex}.slug`"/>
            </label><label
                :class="styles.active"><input v-model="category.active" type="checkbox"> Visible dans la
              navigation</label></article>
            <button type="button" :class="styles.addUniverse" @click="addCategory">+ Ajouter un lien</button>
          </div>
        </details>
      </template>
      <details>
        <summary>Engagements<span>3 engagements</span></summary>
        <div :class="styles.universeEditor">
          <article><label>Premier engagement<input v-model="model.value1" maxlength="500"></label>
            <ImageUpload v-model="model.value1Image" label="Icône du premier engagement" :readonly="readonly" required/>
          </article>
          <article><label>Deuxième engagement<input v-model="model.value2" maxlength="500"></label>
            <ImageUpload v-model="model.value2Image" label="Icône du deuxième engagement" :readonly="readonly" required/>
          </article>
          <article><label>Troisième engagement<input v-model="model.value3" maxlength="500"></label>
            <ImageUpload v-model="model.value3Image" label="Icône du troisième engagement" :readonly="readonly" required/>
          </article>
        </div>
      </details>
      <details>
        <summary>Univers<span>{{ universes?.length }} univers</span></summary>
        <div :class="styles.fields"><label v-for="field in universeFields" :key="field[0]">{{ field[1] }}<input
            v-model="model[field[0]]" maxlength="500"></label></div>
        <div :class="styles.universeEditor">
          <article v-for="(universe, index) in universes" :key="universe.id || `new-${index}`">
            <div :class="styles.universeToolbar"><strong>Univers {{ index + 1 }}</strong><span><button
                type="button" :disabled="index === 0" @click="move(index, -1)">↑</button><button
                type="button" :disabled="index === universes?.length - 1"
                @click="move(index, 1)">↓</button><button type="button"
                                                          @click="removeUniverse(index)">Supprimer</button></span></div>
            <label>Nom<input
                v-model="universe.title" maxlength="100" required>
              <FieldValidation :issues="validationIssues" :field="`universes.${index}.title`"/>
            </label><label>Slug (facultatif)<input
              v-model="universe.slug" maxlength="100" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="L’identifiant sera utilisé si vide">
            <FieldValidation :issues="validationIssues" :field="`universes.${index}.slug`"/>
          </label>
            <ImageUpload v-model="universe.image" :label="`Image de ${universe.title}`" :readonly="readonly" required/>
            <FieldValidation :issues="validationIssues" :field="`universes.${index}.image`"/>
            <label
                :class="styles.active"><input v-model="universe.active" type="checkbox"> Visible sur la
              boutique</label>
          </article>
          <button type="button" :class="styles.addUniverse" @click="addUniverse">+ Ajouter un
            univers
          </button>
        </div>
      </details>
      <details>
        <summary>Sélection produits<span>{{ selectionFields.length }} champs</span></summary>
        <div :class="styles.fields"><label v-for="field in selectionFields" :key="field[0]">{{ field[1] }}<input
            v-model="model[field[0]]" maxlength="500"></label></div>
        <div :class="pickerStyles.selection">
          <article v-for="(product,index) in selectedProducts" :key="product.id">
            <img v-if="imageFor(product.image)"
                 :src="imageFor(product.image)?.content + `?size=${imageFor(product.image)?.width}x${imageFor(product.image)?.height}`"
                 :alt="product.name">
            <div><strong>{{ product.name }}</strong><small>{{ (product.priceCents / 100).toFixed(2).replace('.', ',') }}
              €</small></div>
            <button type="button" data-demo-interactive @click="openPicker(index)">Modifier</button>
            <button type="button" @click="removeFavorite(index)">Supprimer</button>
          </article>
          <button v-if="favoriteIds.length<4" type="button" data-demo-interactive :class="pickerStyles.add" @click="openPicker()">+
            Sélectionner un produit
          </button>
          <p>{{ favoriteIds.length }} produit{{ favoriteIds.length > 1 ? 's' : '' }} sur 4
            sélectionné{{ favoriteIds.length > 1 ? 's' : '' }}</p>
          <FieldValidation :issues="validationIssues" field="favoriteIds"/>
        </div>
      </details>
      <details>
        <summary>Atelier<span>{{ workshopFields.length }} champs</span></summary>
        <div :class="styles.fields"><label v-for="field in workshopFields" :key="field[0]">{{ field[1] }}<textarea
            v-if="field[0] === 'workshopText'" v-model="model[field[0]]" rows="3" maxlength="500"/><input v-else
                                                                                                          v-model="model[field[0]]"
                                                                                                          maxlength="500"></label>
        </div>
        <div :class="styles.images">
          <ImageUpload v-model="model.workshopImage" label="Image de l’atelier" :readonly="readonly"/>
        </div>
      </details>
      <details>
        <summary>Pied de page<span>{{ footerFields.length }} champs</span></summary>
        <div :class="styles.fields"><label v-for="field in footerFields" :key="field[0]">{{ field[1] }}<input
            v-model="model[field[0]]" maxlength="500"></label></div>
      </details>
    </div>
    <aside :class="[styles.preview,props.previewDark ? previewTheme.dark : previewTheme.light]">
      <div :class="styles.previewLabel">APERÇU EN DIRECT</div>
      <div :class="styles.miniAnnouncement">{{ model.announcement }}</div>
      <div :class="styles.miniHeader">{{ model.logoText }}.</div>
      <div :class="[styles.miniHero,props.previewDark?previewTheme.heroDark:previewTheme.heroLight]"
           :style="previewImage(model.heroImage) ? { backgroundImage: `linear-gradient(90deg,${props.previewDark?'#111d,#1114':'#f5f2ebee,#f5f2eb33'}),url(${previewImage(model.heroImage)?.content})`, backgroundSize: `${imageScale(model.heroImage) * 100}% auto`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : {}">
        <h2>{{ model.heroTitle }}</h2>
        <p>{{ model.heroSubtitle }}</p>
        <button>{{ model.heroCta }}</button>
      </div>
      <div :class="styles.miniValues">
        <span :class="[engagementStyles.publicItem,engagementPreview.item]">
          <img v-if="previewImage(model.value1Image)"
               :src="previewImage(model.value1Image)?.content + `?size=${previewImage(model.value1Image)?.width}x${previewImage(model.value1Image)?.height}`"
               alt="">
          <b>{{ model.value1 }}</b></span><span
          :class="[engagementStyles.publicItem,engagementPreview.item]">
        <img v-if="previewImage(model.value2Image)"
             :src="previewImage(model.value2Image)?.content + `?size=${previewImage(model.value2Image)?.width}x${previewImage(model.value2Image)?.height}`"
             alt="">
        <b>{{ model.value2 }}</b></span><span :class="[engagementStyles.publicItem,engagementPreview.item]"><img
          v-if="previewImage(model.value3Image)" :src="previewImage(model.value3Image)?.content"
          alt=""><b>{{ model.value3 }}</b></span></div>
      <div :class="styles.miniSectionTitle"><small>{{ model.universesEyebrow }}</small>
        <h3>{{ model.universesTitle }}</h3>
      </div>
      <div :class="styles.miniUniverses">
        <div v-for="universe in universes.filter(item => item.active)" :key="universe.id || universe.title"
             :style="scaled(universe.image)">{{ universe.title }}
        </div>
      </div>
      <div :class="styles.miniSectionTitle"><small>{{ model.favoritesEyebrow }}</small>
        <h3>{{ model.favoritesTitle }}</h3>
      </div>
      <div :class="[publicStyles.productGrid,pickerStyles.previewProductGrid,fourCardStyles.grid]">
        <article v-for="product in selectedProducts" :key="product.id" :class="publicStyles.productCard">
          <div :class="publicStyles.productImage">
            <img v-if="previewImage(product.image)"
                 :src="previewImage(product.image)?.content + `?size=${previewImage(product.image)?.width}x${previewImage(product.image)?.height}`"
                 :alt="product.name">
          </div>
          <div :class="publicStyles.productInfo">
            <div><small>{{ product.categories.map(category => category.label).join(' · ') }}</small>
              <h3>{{ product.name }}</h3><strong>{{ (product.priceCents / 100).toFixed(2).replace('.', ',') }}
                €</strong></div>
            <button type="button" tabindex="-1" aria-hidden="true">+</button>
          </div>
        </article>
        <p v-if="!selectedProducts.length" :class="pickerStyles.previewEmpty">Sélectionnez jusqu’à 4 produits
          favoris</p></div>
      <div :class="[styles.miniWorkshop,props.previewDark&&previewTheme.workshopDark]"
           :style="previewImage(model.workshopImage) ? { gridTemplateColumns: `${previewPixels(model.workshopImage, 58)}px minmax(0,1fr)` } : {}">
        <img v-if="previewImage(model.workshopImage)"
             :src="previewImage(model.workshopImage)?.content + `?size=${previewImage(model.workshopImage)?.width}x${previewImage(model.workshopImage)?.height}`"
             :style="{
               width: `${previewPixels(model.workshopImage, 20)}px`,
               height: `${previewPixels(model.workshopImage, 20) * (previewImage(model.workshopImage)?.naturalHeight||1) / (previewImage(model.workshopImage)?.naturalWidth||1)}px`,
               maxWidth: '100%',
               maxHeight: '100%'
             }"
             alt="">
        <span v-else :class="styles.miniWorkshopIcon" aria-hidden="true">▤</span>
        <div :class="styles.miniWorkshopCopy"><small>{{ model.workshopEyebrow }}</small>
          <h3>{{ model.workshopTitle }}</h3>
          <p>{{ model.workshopText }}</p>
        </div>
      </div>
      <footer>{{ model.footerBrand }} <span>{{ model.footerText }}</span></footer>
    </aside>
    <Teleport to="body">
      <div v-if="pickerOpen" :class="pickerStyles.overlay" @click.self="pickerOpen=false">
        <section :class="pickerStyles.modal" role="dialog" aria-modal="true"
                 aria-label="Sélection des produits favoris">
          <header>
            <div><small>FAVORIS DU MOMENT</small>
              <h2>{{ replaceIndex === null ? 'Sélectionner les produits' : 'Choisir un produit de remplacement' }}</h2>
              <p>
                {{
                  replaceIndex === null ? 'Vous pouvez retenir jusqu’à quatre articles.' : 'Le produit choisi remplacera le favori actuel.'
                }}</p>
            </div>
            <button type="button" aria-label="Fermer" @click="pickerOpen=false">×</button>
          </header>
          <div :class="pickerStyles.grid">
            <button v-for="product in products" :key="product.id" type="button"
                    :class="favoriteIds.includes(product.id)?pickerStyles.selected:''"
                    :disabled="readonly||(replaceIndex!==null&&favoriteIds.some((id,index)=>id===product.id&&index!==replaceIndex))"
                    @click="pickProduct(product.id)">
              <img v-if="imageFor(product.image)"
                   :src="imageFor(product.image)?.content + `?size=${imageFor(product.image)?.width}x${imageFor(product.image)?.height}`"
                   :alt="product.name"><span><strong>{{
                product.name
              }}</strong><small>{{
                (product.priceCents / 100).toFixed(2).replace('.', ',')
              }} €</small></span><b>{{ favoriteIds.includes(product.id) ? '✓' : '+' }}</b>
            </button>
          </div>
          <footer><span>{{ favoriteIds.length }} / 4 sélectionnés</span>
            <button type="button" @click="pickerOpen=false">Terminer</button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>
