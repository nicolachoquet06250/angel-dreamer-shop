<script setup lang="ts">
import type {SiteContent} from '~/types/shop'
import facebookIcon from '~/assets/icons/facebook.png'
import instagramIcon from '~/assets/icons/instagram.png'
import whatsappIcon from '~/assets/icons/whatsapp.png'
import xIcon from '~/assets/icons/x.png'
import type {ValidationIssue} from '~/utils/admin-validation'
import {adminSeoTabs, type AdminSeoSection} from '~/utils/admin-routing'

const props = withDefaults(defineProps<{
  modelValue: SiteContent
  section: AdminSeoSection
  readonly?: boolean
  validationIssues?: ValidationIssue[]
}>(), {readonly: false})
const emit = defineEmits<{
  (event: 'update:modelValue', value: SiteContent): void
  (event: 'update:section', value: AdminSeoSection): void
}>()
const $requestUrl = useRequestURL()
const content = computed({get: () => props.modelValue, set: value => emit('update:modelValue', value)})
type Audit = {
  score: number;
  grade: string;
  checks: { label: string; passed: boolean; points: number; advice: string }[];
  auditedAt: string
}
const audit = ref<Audit | null>(null)
const auditing = ref(false)
const auditError = ref('')
const preview = ref<'facebook' | 'x' | 'whatsapp' | 'instagram'>('facebook')
const socialIcons = {facebook: facebookIcon, x: xIcon, whatsapp: whatsappIcon, instagram: instagramIcon}
const imageUrl = computed(() => content.value.seoOgImage?.content || '/og.png')
const displayUrl = computed(() => content.value.seoCanonicalUrl || (() => {
  const href = $requestUrl.href;
  const url = new URL(href);
  return url.protocol + '//' + url.hostname;
})())

async function runAudit() {
  auditing.value = true
  auditError.value = ''
  try {
    audit.value = await $fetch<Audit>('/api/admin/seo-audit')
  } catch (error: any) {
    auditError.value = error?.data?.statusMessage || 'Audit indisponible'
  } finally {
    auditing.value = false
  }
}

function selectSeoSection(section: string) {
  const selected = adminSeoTabs.find(item => item.id === section)
  if (selected) emit('update:section', selected.id)
}
</script>

<template>
  <div>
    <AdminSubTabs :tabs="adminSeoTabs" :active="section" label="les sous-onglets de référencement"
                  id-prefix="seo-tab" panel-prefix="seo-panel" @select="selectSeoSection"/>
    <div :id="`seo-panel-${section}`" role="tabpanel" :aria-labelledby="`seo-tab-${section}`">
      <SeoPageTemplates v-if="section!=='home'" v-model="content" :page="section" :readonly="readonly"/>
      <div v-else :class="$style.layout">
      <div :class="$style.fields">
        <details open>
          <summary>Référencement général</summary>
          <div :class="$style.grid">
            <label>Nom du site <span>{{ 70 - content.seoSiteName.length }} caractères restants</span><input
                v-model="content.seoSiteName" maxlength="70"></label>
            <label>Titre principal <span>{{ 60 - content.seoTitle.length }} caractères restants</span><input
                v-model="content.seoTitle"
                maxlength="60">
              <FieldValidation :issues="validationIssues" field="seoTitle"/>
            </label>
            <label :class="$style.wide">Meta description <span>{{ 160 - content.seoDescription.length }} caractères restants</span><textarea
                v-model="content.seoDescription" maxlength="160" rows="3"/>
              <FieldValidation :issues="validationIssues" field="seoDescription"/>
            </label>
            <label :class="$style.wide">Mots-clés<textarea v-model="content.seoKeywords" rows="2"
                                                           placeholder="mot-clé, autre mot-clé"/></label>
            <label>URL canonique<input v-model="content.seoCanonicalUrl" type="url"
                                       placeholder="https://example.com">
              <FieldValidation :issues="validationIssues" field="seoCanonicalUrl"/>
            </label>
            <label>Directives robots<select v-model="content.seoRobots">
              <option>index, follow, max-image-preview:large</option>
              <option>index, nofollow</option>
              <option>noindex, follow</option>
              <option>noindex, nofollow</option>
            </select></label>
            <label>Auteur<input v-model="content.seoAuthor"></label><label>Langue<input v-model="content.seoLanguage"
                                                                                        placeholder="fr"></label>
            <label>Couleur du navigateur<input v-model="content.seoThemeColor" type="color"></label>
          </div>
        </details>
        <details>
          <summary>Open Graph et réseaux sociaux</summary>
          <div :class="$style.grid">
            <label>Titre Open Graph <span>{{ 60 - content.seoOgTitle.length }} caractères restants</span><input
                v-model="content.seoOgTitle"
                maxlength="60"></label>
            <label>Type<select v-model="content.seoOgType">
              <option value="website">Site web</option>
              <option value="product.group">Catalogue produit</option>
              <option value="business.business">Entreprise</option>
            </select></label>
            <label :class="$style.wide">Description Open Graph <span>{{
                160 - content.seoOgDescription.length
              }} caractères restants</span><textarea v-model="content.seoOgDescription" maxlength="160"
                                                     rows="3"/></label>
            <label>Locale<input v-model="content.seoOgLocale" placeholder="fr_FR"></label>
            <ImageUpload v-model="content.seoOgImage" :class="$style.wide" :readonly="readonly"
                         label="Image sociale (1200 × 630 px recommandé)"/>
            <FieldValidation :issues="validationIssues" field="seoOgImage"/>
            <label>Format de carte X<select v-model="content.seoTwitterCard">
              <option value="summary_large_image">Grande image</option>
              <option value="summary">Résumé compact</option>
            </select></label>
            <label>Compte X du site<input v-model="content.seoTwitterSite" placeholder="@angel_dreamer"></label>
            <label>Créateur X<input v-model="content.seoTwitterCreator" placeholder="@createur"></label>
            <label>Titre X <span>{{ 70 - content.seoTwitterTitle.length }} caractères restants</span><input
                v-model="content.seoTwitterTitle" maxlength="70"></label>
            <label :class="$style.wide">Description X <span>{{ 200 - content.seoTwitterDescription.length }} caractères restants</span><textarea
                v-model="content.seoTwitterDescription" maxlength="200" rows="2"/></label>
          </div>
        </details>
        <details>
          <summary>Organisation et données structurées</summary>
          <div :class="$style.grid">
            <label>Nom public<input v-model="content.seoOrganizationName"></label><label>Raison sociale<input
              v-model="content.seoOrganizationLegalName"></label>
            <label>Site officiel<input v-model="content.seoOrganizationUrl" type="url"></label><label>Email<input
              v-model="content.seoOrganizationEmail" type="email"></label>
            <label>Téléphone<input v-model="content.seoOrganizationPhone" type="tel"></label><label>Pays (ISO)<input
              v-model="content.seoOrganizationCountry" maxlength="2"></label>
          </div>
        </details>
        <details>
          <summary>Outils pour webmasters</summary>
          <div :class="$style.grid">
            <label>Validation Google Search Console<input v-model="content.seoGoogleVerification"></label>
            <label>Validation Bing Webmaster Tools<input v-model="content.seoBingVerification"></label>
          </div>
        </details>
      </div>

      <aside :class="$style.preview">
        <div :class="$style.googlePreviewHead">
          <small>APERÇU GOOGLE</small>
          <h3>Résultat de recherche</h3>
        </div>
        <article :class="$style.googlePreview">
          <small>{{ displayUrl }}</small>
          <strong>{{ content.seoTitle }}</strong>
          <p>{{ content.seoDescription }}</p>
        </article>
        <div :class="$style.previewHead">
          <small>APERÇU SOCIAL</small>
          <div :class="$style.previewSelector">
            <h3>{{ preview === 'x' ? 'X (Twitter)' : preview[0]!.toUpperCase() + preview.slice(1) }}</h3>
            <div :class="$style.switcher">
              <button v-for="network in ['facebook','x','whatsapp','instagram']" :key="network" type="button" data-demo-interactive
                      :aria-label="`Aperçu ${network}`" :title="network"
                      :aria-pressed="preview===network" @click="preview=network as any">
                <img :src="socialIcons[network as keyof typeof socialIcons]" :class="network === 'x' && $style.xIcon"
                     alt="" aria-hidden="true">
              </button>
            </div>
          </div>
        </div>
        <article :class="[$style.card,$style[preview]]"><img :src="imageUrl" alt="Aperçu Open Graph">
          <div><small>{{
              displayUrl.replace(/^https?:\/\//, '')
            }}</small><strong>{{
              preview === 'x' ? (content.seoTwitterTitle || content.seoOgTitle) : content.seoOgTitle
            }}</strong>
            <p>{{
                preview === 'x' ? (content.seoTwitterDescription || content.seoOgDescription) : content.seoOgDescription
              }}</p></div>
        </article>
        <p :class="$style.hint">Instagram n’affiche pas de carte dans les légendes ; cet aperçu correspond au partage du
          lien en message privé.</p>
        <section :class="$style.audit">
          <header>
            <div><small>AUDIT INTERNE</small>
              <h3>Score SEO</h3></div>
            <strong v-if="audit"
                    :class="audit.score >= 80 ? $style.good : audit.score >= 50 ? $style.medium : $style.bad">{{
                audit.score
              }}/100 · {{ audit.grade }}</strong></header>
          <button type="button" data-demo-interactive :disabled="auditing" @click="runAudit">{{
              auditing ? 'Analyse…' : 'Lancer l’audit complet'
            }}
          </button>
          <p v-if="auditError">{{ auditError }}</p>
          <ul v-if="audit">
            <li v-for="check in audit.checks" :key="check.label" :class="check.passed?$style.pass:$style.fail">
              <b>{{ check.passed ? '✓' : '!' }}</b><span><strong>{{ check.label }}</strong><small>{{
                check.advice
              }}</small></span><em>{{ check.passed ? '+' + check.points : '0' }}</em></li>
          </ul>
        </section>
      </aside>
      </div>
    </div>
  </div>
</template>

<style module>
.layout {
  display: grid;
  grid-template-columns:minmax(0, 1.1fr) minmax(320px, .9fr);
  gap: 22px
}

.fields {
  display: grid;
  align-content: start;
  gap: 10px
}

.fields details {
  align-self: start;
  height: 51px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--surface)
}

.fields details[open] {
  height: auto;
  overflow: visible
}

.fields summary {
  padding: 16px;
  font-weight: 800;
  cursor: pointer
}

.grid {
  display: grid;
  grid-template-columns:1fr 1fr;
  gap: 14px;
  padding: 0 16px 18px
}

.grid label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 700
}

.grid label span {
  justify-self: end;
  margin-top: -20px;
  color: var(--muted);
  font-size: 10px
}

.grid input, .grid textarea, .grid select {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  font: inherit
}

.wide {
  grid-column: 1/-1
}

.preview {
  position: sticky;
  top: 16px;
  align-self: start;
  display: grid;
  gap: 16px
}

.audit header, .previewSelector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px
}

.previewHead {
  display: grid;
  gap: 3px;
  padding-top: 10px
}

.googlePreviewHead {
  display: grid;
  gap: 3px
}

.googlePreview {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--line);
  background: #fff
}

.googlePreview small {
  overflow: hidden;
  color: #202124;
  text-overflow: ellipsis;
  white-space: nowrap
}

.googlePreview strong {
  color: #1a0dab;
  font: 20px Arial, sans-serif
}

.googlePreview p {
  margin: 0;
  color: #4d5156;
  font: 14px/1.45 Arial, sans-serif
}

.preview h3, .audit h3 {
  margin: 3px 0;
  font-size: 22px
}

.switcher {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 4px
}

.switcher button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: 50%;
  font-size: 18px;
  font-weight: 800;
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

.card {
  overflow: hidden;
  border: 1px solid #ccd0d5;
  border-radius: 8px;
  background: #fff;
  color: #1c1e21
}

.card img {
  display: block;
  width: 100%;
  aspect-ratio: 1.91/1;
  object-fit: cover
}

.card div {
  display: grid;
  gap: 4px;
  padding: 12px
}

.card small {
  color: #606770;
  text-transform: uppercase
}

.card strong {
  font-size: 17px
}

.card p {
  margin: 0;
  color: #606770;
  font-size: 13px
}

.x {
  border-radius: 14px;
  background: #000;
  color: #fff
}

.x div {
  background: #000
}

.x small, .x p {
  color: #9aa0a6
}

.whatsapp {
  border-color: #d6ddd9;
  background: #f7f8f5
}

.instagram {
  border-radius: 12px
}

.hint {
  margin: 0;
  color: var(--muted);
  font-size: 10px
}

.audit {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--line);
  background: var(--surface)
}

.audit > button {
  padding: 11px;
  border: 0;
  background: var(--accent);
  color: #fff;
  font-weight: 800;
  cursor: pointer
}

.audit ul {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none
}

.audit li {
  display: grid;
  grid-template-columns:22px 1fr auto;
  gap: 8px;
  align-items: start;
  padding: 8px;
  background: var(--bg)
}

.audit li > b {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff
}

.audit li span {
  display: grid;
  gap: 2px
}

.audit li small {
  color: var(--muted)
}

.audit li em {
  font-style: normal
}

.pass > b {
  background: #1e8e5a
}

.fail > b {
  background: #cf493a
}

.good {
  color: #1e8e5a
}

.medium {
  color: #c77b00
}

.bad, .fail em {
  color: #cf493a
}

@media (max-width: 1000px) {
  .layout {
    grid-template-columns:1fr
  }

  .preview {
    position: static
  }
}

@media (max-width: 620px) {
  .grid {
    grid-template-columns:1fr
  }

  .wide {
    grid-column: auto
  }

  .previewSelector {
    display: grid
  }

  .switcher {
    justify-content: start
  }
}
</style>
