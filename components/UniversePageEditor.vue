<script setup lang="ts">
import type {Category, SiteContent} from '~/types/shop';
import editor from '~/assets/css/content-editor.module.css';
import page from '~/assets/css/category-page-editor.module.css';
import catalog from '~/assets/css/catalog.module.css'

defineProps<{ previewDark: boolean; categories: Category[] }>();
const model = defineModel<SiteContent>({required: true})
</script>
<template>
  <div :class="editor.layout">
    <div :class="editor.controls">
      <details open>
        <summary>Contenu générique <span>PAGE UNIVERS</span></summary>
        <div :class="editor.fields"><label :class="page.full">Titre de la page<input
            value="Nom de l’univers (dynamique)" disabled><small>Le titre reprend automatiquement le nom de l’univers
          consulté.</small></label><label>Surtitre<input v-model="model.universeEyebrow"></label><label>Libellé du
          filtre global<input v-model="model.universeAllLabel"></label><label :class="page.full">Message si aucun
          produit ne correspond<textarea v-model="model.universeEmptyText" rows="3"/></label></div>
      </details>
    </div>
    <aside :class="[editor.preview,page.preview,previewDark&&page.previewDark]">
      <div :class="editor.previewLabel">APERÇU · PAGE UNIVERS VIDE</div>
      <div :class="editor.miniAnnouncement">{{ model.announcement }}</div>
      <header :class="editor.miniHeader"><span>{{ model.logoText }} <i>•</i></span></header>
      <section :class="page.page"><small>{{ model.universeEyebrow }}</small>
        <h2>Nom de l’univers</h2>
        <nav :class="catalog.filterNav">
          <button :class="catalog.filterActive">{{ model.universeAllLabel }}</button>
          <button v-for="item in categories.slice(0,3)" :key="item.id">{{ item.label }}</button>
        </nav>
        <div :class="page.empty">{{ model.universeEmptyText }}</div>
      </section>
      <footer><strong>{{ model.footerBrand }}</strong><span>{{ model.footerText }}</span></footer>
    </aside>
  </div>
</template>
