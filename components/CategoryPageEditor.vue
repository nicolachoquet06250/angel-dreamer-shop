<script setup lang="ts">
import type {SiteContent} from '~/types/shop';
import editor from '~/assets/css/content-editor.module.css';
import category from '~/assets/css/category-page-editor.module.css'
import type {ValidationIssue} from '~/utils/admin-validation'

defineProps<{ previewDark: boolean; validationIssues?: ValidationIssue[] }>();
const model = defineModel<SiteContent>({required: true})
</script>
<template>
  <div :class="editor.layout">
    <div :class="editor.controls">
      <details open>
        <summary>Contenu générique <span>PAGE CATÉGORIE</span></summary>
        <div :class="editor.fields"><label :class="category.full">Titre de la page<input
            value="Nom de la catégorie (dynamique)" disabled><small>Le titre reprend automatiquement le nom de la
          catégorie consultée.</small></label><label>Surtitre<input v-model="model.categoryEyebrow">
          <FieldValidation :issues="validationIssues" field="categoryEyebrow"/>
        </label><label
            :class="category.full">Texte d’introduction<textarea v-model="model.categoryDescription"
                                                                 rows="3"/>
          <FieldValidation :issues="validationIssues" field="categoryDescription"/>
        </label><label :class="category.full">Message
          si la catégorie est vide<textarea v-model="model.categoryEmptyText" rows="3"/>
          <FieldValidation :issues="validationIssues" field="categoryEmptyText"/>
        </label></div>
      </details>
    </div>
    <aside :class="[editor.preview,category.preview,previewDark&&category.previewDark]">
      <div :class="editor.previewLabel">APERÇU · PAGE CATÉGORIE VIDE</div>
      <div :class="editor.miniAnnouncement">{{ model.announcement }}</div>
      <header :class="editor.miniHeader"><span>{{ model.logoText }} <i>•</i></span></header>
      <section :class="category.page"><small>{{ model.categoryEyebrow }}</small>
        <h2>Nom de la catégorie</h2>
        <p>{{ model.categoryDescription }}</p>
        <div :class="category.empty">{{ model.categoryEmptyText }}</div>
      </section>
      <footer><strong>{{ model.footerBrand }}</strong><span>{{ model.footerText }}</span></footer>
    </aside>
  </div>
</template>
