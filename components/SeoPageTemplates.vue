<script setup lang="ts">
import type {SiteContent} from '~/types/shop'
import facebookIcon from '~/assets/icons/facebook.png'
import instagramIcon from '~/assets/icons/instagram.png'
import whatsappIcon from '~/assets/icons/whatsapp.png'
import xIcon from '~/assets/icons/x.png'

type PageType = 'product' | 'universe' | 'category' | 'universeCategory'
const props = withDefaults(defineProps<{ modelValue: SiteContent; page: PageType; readonly?: boolean }>(), {readonly: false})
const emit = defineEmits<{ (event: 'update:modelValue', value: SiteContent): void }>()
const content = computed({get: () => props.modelValue, set: value => emit('update:modelValue', value)})
const preview = ref<'facebook' | 'x' | 'whatsapp' | 'instagram'>('facebook')
const socialIcons = {facebook: facebookIcon, x: xIcon, whatsapp: whatsappIcon, instagram: instagramIcon}
const definitions = {
  product: {
    label: 'Page produit', path: '/produits/t-shirt-horizon', image: true,
    fields: {
      title: 'seoProductTitle',
      description: 'seoProductDescription',
      ogTitle: 'seoProductOgTitle',
      ogDescription: 'seoProductOgDescription'
    },
    variables: {
      'Nom du produit': 'T-shirt Horizon',
      'Description du produit': 'Un t-shirt en coton doux, imprimé à la demande en France.',
      'Prix': '29,90 €',
      ['Catégories']: 'Vêtements',
      'Univers': 'Manga & Japon',
      'Nom du site': 'Angel Dreamer'
    }
  },
  universe: {
    label: 'Page univers', path: '/univers/manga-japon', image: true,
    fields: {
      title: 'seoUniverseTitle',
      description: 'seoUniverseDescription',
      ogTitle: 'seoUniverseOgTitle',
      ogDescription: 'seoUniverseOgDescription'
    },
    variables: {['Nom de l’univers']: 'Manga & Japon', 'Nom du site': 'Angel Dreamer'}
  },
  category: {
    label: 'Page catégorie', path: '/categories/vetements', image: false,
    fields: {
      title: 'seoCategoryTitle',
      description: 'seoCategoryDescription',
      ogTitle: 'seoCategoryOgTitle',
      ogDescription: 'seoCategoryOgDescription'
    },
    variables: {['Nom de la catégorie']: 'Vêtements', 'Nom du site': 'Angel Dreamer'}
  },
  universeCategory: {
    label: 'Catégorie d’univers', path: '/univers/manga-japon/vetements', image: true,
    fields: {
      title: 'seoUniverseCategoryTitle',
      description: 'seoUniverseCategoryDescription',
      ogTitle: 'seoUniverseCategoryOgTitle',
      ogDescription: 'seoUniverseCategoryOgDescription'
    },
    variables: {
      ['Nom de l’univers']: 'Manga & Japon',
      ['Nom de la catégorie']: 'Vêtements',
      'Nom du site': 'Angel Dreamer'
    }
  }
} as const
const definition = computed(() => definitions[props.page])
type SeoKey = keyof SiteContent
const value = (key: SeoKey) => String(content.value[key] ?? '')
const replace = (template: string) => Object.entries(definition.value.variables).reduce((text, [label, example]) => text.replaceAll(`[${label}]`, label === 'Nom du site' ? content.value.seoSiteName : example), template)
const renderedTitle = computed(() => replace(value(definition.value.fields.title)))
const renderedDescription = computed(() => replace(value(definition.value.fields.description)))
const renderedOgTitle = computed(() => replace(value(definition.value.fields.ogTitle)))
const renderedOgDescription = computed(() => replace(value(definition.value.fields.ogDescription)))
const productUsesLibraryImage = computed(() => content.value.seoProductImageMode === 'library')
const socialPreviewImageUrl = computed(() => {
  if (props.page === 'product' && productUsesLibraryImage.value) return content.value.seoProductOgImage?.content || '/og.png'
  return content.value.seoOgImage?.content || '/og.png'
})

function update(key: SeoKey, event: Event) {
  ;(content.value as any)[key] = (event.target as HTMLInputElement).value
}

function insert(key: SeoKey, label: string) {
  const current = value(key)
  ;(content.value as any)[key] = `${current}${current && !current.endsWith(' ') ? ' ' : ''}[${label}]`
}
</script>

<template>
  <div :class="$style.layout">
    <section :class="$style.editor">
      <header><small>MODÈLE DYNAMIQUE</small>
        <h3>{{ definition.label }}</h3>
        <p>Cliquez sur les informations à insérer. Elles seront remplacées automatiquement pour chaque page.</p>
      </header>
      <article v-for="field in [
        {key:definition.fields.title,label:'Titre SEO',limit:60,rows:2},
        {key:definition.fields.description,label:'Meta description',limit:160,rows:4},
        {key:definition.fields.ogTitle,label:'Titre du partage social',limit:60,rows:2},
        {key:definition.fields.ogDescription,label:'Description du partage social',limit:160,rows:4}
      ]" :key="field.key" :class="$style.field">
        <label><strong>{{ field.label }}</strong><span
            :class="replace(value(field.key as SeoKey)).length>field.limit?$style.over:''">{{
            field.limit - replace(value(field.key as SeoKey)).length
          }} caractères restants dans l’exemple</span></label>
        <textarea :value="value(field.key as SeoKey)" :rows="field.rows" @input="update(field.key as SeoKey,$event)"/>
        <div :class="$style.variables"><small>Insérer :</small>
          <button v-for="(_,label) in definition.variables" :key="label" type="button"
                  @click="insert(field.key as SeoKey,String(label))">+ {{ label }}
          </button>
        </div>
      </article>
      <article v-if="page === 'product'" :class="$style.field">
        <label><strong>Meta image</strong></label>
        <div :class="$style.imageChoice" role="radiogroup" aria-label="Source de la meta image produit">
          <label><input v-model="content.seoProductImageMode" type="radio" value="product"> Utiliser l’image du produit</label>
          <label><input v-model="content.seoProductImageMode" type="radio" value="library"> Choisir une image dans la
            médiathèque</label>
        </div>
        <ImageUpload v-if="productUsesLibraryImage" v-model="content.seoProductOgImage" :readonly="readonly"
                     label="Image sociale des pages produit"/>
      </article>
    </section>
    <aside :class="$style.preview">
      <small>EXEMPLE RÉEL</small>
      <h3>{{ definition.label }}</h3>
      <section :class="$style.google"><small>{{
          (content.seoCanonicalUrl || 'https://votre-boutique.fr') + definition.path
        }}</small><strong>{{ renderedTitle }}</strong>
        <p>{{ renderedDescription }}</p></section>
      <div :class="$style.socialPreviewHead">
        <small>APERÇU SOCIAL</small>
        <div :class="$style.previewSelector">
          <h3>{{ preview === 'x' ? 'X (Twitter)' : preview[0]!.toUpperCase() + preview.slice(1) }}</h3>
          <div :class="$style.switcher">
            <button v-for="network in ['facebook','x','whatsapp','instagram']" :key="network" type="button" data-demo-interactive
                    :aria-label="`Aperçu ${network}`" :title="network" :aria-pressed="preview === network"
                    @click="preview = network as any">
              <img :src="socialIcons[network as keyof typeof socialIcons]"
                   :class="network === 'x' && $style.xIcon" alt="" aria-hidden="true">
            </button>
          </div>
        </div>
      </div>
      <section :class="[$style.social,$style[preview]]"><img :src="socialPreviewImageUrl" alt="Aperçu de l’image sociale">
        <div><small>{{ content.seoSiteName }}</small><strong>{{ renderedOgTitle }}</strong>
          <p>{{ renderedOgDescription }}</p></div>
      </section>
      <p v-if="preview === 'instagram'" :class="$style.platformNote">Instagram n’affiche pas de carte dans les légendes
        ; cet aperçu correspond au partage du lien en message privé.</p>
      <p :class="$style.note">{{
          page === 'product' ? (productUsesLibraryImage ? 'L’image sélectionnée dans la médiathèque sera utilisée pour tous les produits.' : 'L’image propre à chaque produit sera utilisée automatiquement.') : definition.image ? 'L’image propre à l’univers sera utilisée en priorité.' : 'L’image Open Graph générale sera utilisée pour les catégories.'
        }}</p>
    </aside>
  </div>
</template>

<style module>
.layout {
  display: grid;
  grid-template-columns:minmax(0, 1.1fr) minmax(320px, .9fr);
  gap: 22px
}

.editor {
  display: grid;
  gap: 12px
}

.editor header, .field, .preview {
  padding: 16px;
  border: 1px solid var(--line);
  background: var(--surface)
}

.editor h3, .preview h3 {
  margin: 4px 0;
  font-size: 24px
}

.editor header p {
  margin: 6px 0 0;
  color: var(--muted)
}

.field {
  display: grid;
  gap: 9px
}

.field label {
  display: flex;
  justify-content: space-between;
  gap: 12px
}

.field label span {
  color: var(--muted);
  font-size: 10px
}

.field label span.over {
  color: #cf493a
}

.field textarea {
  width: 100%;
  resize: vertical;
  padding: 11px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  font: inherit
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

.imageChoice {
  display: flex;
  flex-wrap: wrap;
  gap: 8px
}

.imageChoice label {
  justify-content: flex-start;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: var(--bg);
  cursor: pointer
}

.preview {
  position: sticky;
  top: 16px;
  align-self: start;
  display: grid;
  gap: 14px
}

.google {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--line);
  background: #fff
}

.google small {
  overflow: hidden;
  color: #202124;
  text-overflow: ellipsis;
  white-space: nowrap
}

.google strong {
  color: #1a0dab;
  font: 20px Arial, sans-serif
}

.google p {
  margin: 0;
  color: #4d5156;
  font: 14px/1.45 Arial, sans-serif
}

.socialPreviewHead {
  display: grid;
  gap: 3px;
  padding-top: 8px
}

.previewSelector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px
}

.previewSelector h3 {
  font-size: 22px
}

.switcher {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px
}

.switcher button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  cursor: pointer
}

.switcher button[aria-pressed=true] {
  outline: 2px solid var(--accent);
  outline-offset: 2px
}

.switcher img {
  width: 21px;
  height: 21px;
  object-fit: contain
}

:global(:root:not([data-theme="dark"])) .xIcon {
  filter: invert(1)
}

.social {
  overflow: hidden;
  border: 1px solid #ccd0d5;
  border-radius: 8px;
  background: #fff;
  color: #1c1e21
}

.social img {
  display: block;
  width: 100%;
  aspect-ratio: 1.91/1;
  object-fit: cover
}

.social div {
  display: grid;
  gap: 4px;
  padding: 12px
}

.social p {
  margin: 0;
  color: #606770;
  font-size: 13px
}

.social.x {
  border-radius: 14px;
  background: #000;
  color: #fff
}

.social.x div {
  background: #000
}

.social.x small, .social.x p {
  color: #9aa0a6
}

.social.whatsapp {
  border-color: #d6ddd9;
  background: #f7f8f5
}

.social.instagram {
  border-radius: 12px
}

.platformNote, .note {
  margin: 0;
  color: var(--muted);
  font-size: 10px
}

@media (max-width: 1000px) {
  .layout {
    grid-template-columns:1fr
  }

  .preview {
    position: static
  }
}

@media (max-width: 600px) {
  .field label {
    display: grid
  }

  .previewSelector {
    display: grid
  }

  .switcher {
    justify-content: flex-start
  }
}
</style>
