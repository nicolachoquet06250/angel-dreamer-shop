<script setup lang="ts">
import type {Category, SiteContent} from '~/types/shop';
import editor from '~/assets/css/content-editor.module.css';
import page from '~/assets/css/category-page-editor.module.css';
import catalog from '~/assets/css/catalog.module.css'
import type {ValidationIssue} from '~/utils/admin-validation'

defineProps<{ previewDark: boolean; categories: Category[]; validationIssues?: ValidationIssue[] }>();
const model = defineModel<SiteContent>({required: true})
</script>
<template>
  <div :class="editor.layout">
    <div :class="[editor.controls, $style.controls]">
      <details open style="cursor: default" @click.prevent.stop>
        <summary>Contenu générique <span>PAGE UNIVERS</span></summary>
        <div :class="editor.fields"><label :class="page.full">Titre de la page<input
            value="Nom de l’univers (dynamique)" disabled><small>Le titre reprend automatiquement le nom de l’univers
          consulté.</small></label><label>Surtitre<input v-model="model.universeEyebrow">
          <FieldValidation :issues="validationIssues" field="universeEyebrow"/>
        </label><label>Libellé du
          filtre global<input v-model="model.universeAllLabel">
          <FieldValidation :issues="validationIssues" field="universeAllLabel"/>
        </label><label :class="page.full">Message si aucun
          produit ne correspond<textarea v-model="model.universeEmptyText" rows="3"/>
          <FieldValidation :issues="validationIssues" field="universeEmptyText"/>
        </label></div>
      </details>
    </div>
    <aside :class="[editor.preview,page.preview,previewDark&&page.previewDark]">
      <div :class="editor.previewLabel">APERÇU · PAGE UNIVERS VIDE</div>
      <div :class="editor.miniAnnouncement">{{ model.announcement }}</div>
      <header :class="[editor.miniHeader, $style.miniHeader]"><span>{{ model.logoText }} <i>•</i></span></header>
      <section :class="page.page"><small>{{ model.universeEyebrow }}</small>
        <h2>Nom de l’univers</h2>
        <nav :class="catalog.filterNav">
          <button data-demo-interactive :class="catalog.filterActive">{{ model.universeAllLabel }}</button>
          <button v-for="item in categories.slice(0,3)" :key="item.id" data-demo-interactive>{{ item.label }}</button>
        </nav>
        <div :class="page.empty">{{ model.universeEmptyText }}</div>
      </section>
      <footer :class="$style.footerMain">
        <strong>{{ model.footerBrand }}<i>•</i></strong>
        <span>{{ model.footerText }}</span>
      </footer>
    </aside>
  </div>
</template>

<style module>
.footerMain, .miniHeader {
  i {
    color: var(--accent);
    font-style: normal;

    &:last-of-type {
      display: inline-block;
      translate: 0 5px;
    }
  }
}

.controls > details > summary::marker {
  content: "";
}
</style>
