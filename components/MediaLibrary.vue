<script setup lang="ts">
import type {ImageAsset} from '~/types/shop'
import type {ValidationIssue} from '~/utils/admin-validation'
import {hasValidationErrors} from '~/utils/admin-validation'
import imageIcon from '~/assets/icons/image.png'

type LibraryImage = ImageAsset & { usageCount: number }
const props = withDefaults(defineProps<{ readonly?: boolean }>(), {readonly: false})
const emit = defineEmits<{ close: [] }>()
const library = ref<LibraryImage[]>([])
const loading = ref(false)
const issues = ref<ValidationIssue[]>([])
const lightFile = ref<File | null>(null)
const darkFile = ref<File | null>(null)
const lightInput = ref<HTMLInputElement>()
const darkInput = ref<HTMLInputElement>()
const dragging = reactive({light: false, dark: false})
const dragDepth = reactive({light: 0, dark: 0})
const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const lightFileName = computed(() => lightFile.value?.name || 'Choisir la version claire')
const darkFileName = computed(() => darkFile.value?.name || 'Choisir une alternative sombre')

async function load() {
  loading.value = true
  try {
    library.value = await $fetch<LibraryImage[]>('/api/admin/images')
  } finally {
    loading.value = false
  }
}

onMounted(load)

function fileIssues(file: File | null, field: string, required: boolean) {
  const result: ValidationIssue[] = []
  if (!file && required) result.push({field, level: 'error', message: 'Sélectionnez une image.'})
  if (file && !accepted.includes(file.type)) result.push({
    field,
    level: 'error',
    message: 'Formats acceptés : JPG, PNG, WebP ou GIF.'
  })
  if (file && file.size > 2_000_000) result.push({
    field,
    level: 'error',
    message: 'Le fichier ne doit pas dépasser 2 Mo.'
  })
  if (file && file.size > 1_000_000 && file.size <= 2_000_000) result.push({
    field,
    level: 'warning',
    message: 'Cette image est volumineuse et peut ralentir la page.'
  })
  if (!file && !required) result.push({
    field,
    level: 'info',
    message: 'La version sombre est optionnelle et pourra être ajoutée plus tard.'
  })
  return result
}

function selectFile(file: File | null, variant: 'light' | 'dark') {
  if (props.readonly) return
  if (variant === 'light') lightFile.value = file; else darkFile.value = file
  issues.value = [...fileIssues(lightFile.value, 'media.light', true), ...fileIssues(darkFile.value, 'media.dark', false)]
}

function choose(event: Event, variant: 'light' | 'dark') {
  selectFile((event.target as HTMLInputElement).files?.[0] || null, variant)
}

function dragEnter(variant: 'light' | 'dark') {
  dragDepth[variant] += 1
  dragging[variant] = true
}

function dragLeave(variant: 'light' | 'dark') {
  dragDepth[variant] = Math.max(0, dragDepth[variant] - 1)
  if (dragDepth[variant] === 0) dragging[variant] = false
}

function drop(event: DragEvent, variant: 'light' | 'dark') {
  if (props.readonly) return
  dragDepth[variant] = 0
  dragging[variant] = false
  selectFile(event.dataTransfer?.files?.[0] || null, variant)
}

async function asset(file: File) {
  return await new Promise<ImageAsset>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const content = String(reader.result)
      const probe = new Image()
      probe.onerror = reject
      probe.onload = () => resolve({
        id: 0,
        content,
        mimeType: file.type,
        width: probe.naturalWidth,
        height: probe.naturalHeight,
        naturalWidth: probe.naturalWidth,
        naturalHeight: probe.naturalHeight,
        darkVariant: null
      })
      probe.src = content
    }
    reader.readAsDataURL(file)
  })
}

async function uploadPair() {
  if (props.readonly) return
  issues.value = [...fileIssues(lightFile.value, 'media.light', true), ...fileIssues(darkFile.value, 'media.dark', false)]
  if (hasValidationErrors(issues.value) || !lightFile.value) return
  loading.value = true
  try {
    let created = await $fetch<ImageAsset>('/api/admin/images', {method: 'POST', body: await asset(lightFile.value)})
    if (darkFile.value) created = await $fetch<ImageAsset>(`/api/admin/images/${created.id}/dark`, {
      method: 'PUT',
      body: await asset(darkFile.value)
    })
    library.value.unshift({...created, usageCount: 0})
    lightFile.value = null;
    darkFile.value = null;
    issues.value = []
    if (lightInput.value) lightInput.value.value = ''
    if (darkInput.value) darkInput.value.value = ''
  } catch {
    issues.value = [{field: 'media.light', level: 'error', message: 'L’envoi des images a échoué.'}]
  } finally {
    loading.value = false
  }
}

async function replace(event: Event, image: LibraryImage, variant: 'light' | 'dark') {
  if (props.readonly) return
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  const field = `media.${image.id}.${variant}`
  issues.value = fileIssues(file, field, true)
  if (hasValidationErrors(issues.value) || !file) return
  loading.value = true
  try {
    const updated = await $fetch<ImageAsset>(variant === 'light' ? `/api/admin/images/${image.id}` : `/api/admin/images/${image.id}/dark`, {
      method: 'PUT',
      body: await asset(file)
    })
    const index = library.value.findIndex(item => item.id === image.id)
    if (index >= 0) library.value[index] = {...updated, usageCount: image.usageCount}
    issues.value = [{
      field,
      level: 'info',
      message: `La version ${variant === 'light' ? 'claire' : 'sombre'} a été mise à jour.`
    }]
  } catch {
    issues.value = [{field, level: 'error', message: 'La modification a échoué.'}]
  } finally {
    loading.value = false;
    input.value = ''
  }
}

async function remove(image: LibraryImage) {
  if (props.readonly) return
  const field = `media.${image.id}.light`
  if (image.usageCount > 0) {
    issues.value = [{field, level: 'error', message: `Cette image est encore utilisée ${image.usageCount} fois.`}]
    return
  }
  if (!confirm('Supprimer définitivement cette image et son alternative sombre ?')) return
  loading.value = true
  try {
    await $fetch(`/api/admin/images/${image.id}`, {method: 'DELETE'})
    library.value = library.value.filter(item => item.id !== image.id)
  } catch {
    issues.value = [{field, level: 'error', message: 'La suppression a échoué.'}]
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="$style.overlay" @click.self="emit('close')">
    <section :class="$style.modal" role="dialog" aria-modal="true" aria-labelledby="media-title">
      <header>
        <div><small>ADMINISTRATION DES IMAGES</small>
          <h2 id="media-title">Médiathèque</h2></div>
        <button type="button" aria-label="Fermer" @click="emit('close')">×</button>
      </header>
      <form :class="$style.upload" novalidate @submit.prevent="uploadPair">
        <h3>Ajouter une image et ses alternatives</h3>
        <p v-if="props.readonly" :class="$style.readOnly">Compte de démonstration : médiathèque disponible en consultation
          uniquement.</p>
        <div :class="$style.fileField">
          <div :class="$style.fileHeading"><strong>Version claire</strong><span>Obligatoire</span></div>
          <label :class="[$style.dropzone,lightFile&&$style.selected,dragging.light&&$style.dragging]"
                 @dragenter.prevent="dragEnter('light')" @dragover.prevent @dragleave.prevent="dragLeave('light')"
                 @drop.prevent="drop($event,'light')"><input ref="lightInput" type="file" :disabled="readonly"
                                                             accept="image/jpeg,image/png,image/webp,image/gif"
                                                             @change="choose($event,'light')"><img :src="imageIcon"
                                                                                                   alt=""><b>{{
              dragging.light ? 'Déposez la version claire ici' : lightFileName
            }}</b><small>{{
              lightFile ? `${(lightFile.size / 1024).toFixed(0)} Ko` : 'Cliquez ou glissez une image · JPG, PNG, WebP ou GIF · 2 Mo maximum'
            }}</small></label>
          <FieldValidation :issues="issues" field="media.light"/>
        </div>
        <div :class="$style.fileField">
          <div :class="$style.fileHeading"><strong>Version sombre</strong><span>Optionnelle</span></div>
          <label :class="[$style.dropzone,darkFile&&$style.selected,dragging.dark&&$style.dragging]"
                 @dragenter.prevent="dragEnter('dark')" @dragover.prevent @dragleave.prevent="dragLeave('dark')"
                 @drop.prevent="drop($event,'dark')"><input ref="darkInput" type="file" :disabled="readonly"
                                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                                            @change="choose($event,'dark')"><img :src="imageIcon"
                                                                                                 alt=""><b>{{
              dragging.dark ? 'Déposez l’alternative sombre ici' : darkFileName
            }}</b><small>{{
              darkFile ? `${(darkFile.size / 1024).toFixed(0)} Ko` : 'Cliquez ou glissez une image · utilisée automatiquement en thème sombre'
            }}</small></label>
          <FieldValidation :issues="issues" field="media.dark"/>
        </div>
        <button type="submit" :disabled="loading||readonly">{{
            loading ? 'Envoi…' : 'Ajouter à la médiathèque'
          }}
        </button>
      </form>
      <div :class="$style.grid">
        <article v-for="image in library" :key="image.id">
          <div :class="$style.previews"><img :src="image.content" alt="Version claire"><img v-if="image.darkVariant"
                                                                                            :src="image.darkVariant.content"
                                                                                            alt="Version sombre"><span
              v-else>Pas de version sombre</span></div>
          <small>{{ image.width }} × {{ image.height }} px · {{ image.usageCount }} utilisation(s)</small>
          <div :class="$style.actions">
            <label>Modifier la version claire<input type="file" :disabled="readonly"
                                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                                    @change="replace($event,image,'light')"></label>
            <label>{{ image.darkVariant ? 'Modifier' : 'Ajouter' }} la version sombre<input type="file"
                                                                                            :disabled="readonly"
                                                                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                                                                            @change="replace($event,image,'dark')"></label>
          </div>
          <button type="button" :class="$style.delete" :disabled="readonly" @click="remove(image)">Supprimer l’image
          </button>
          <FieldValidation :issues="issues" :field="`media.${image.id}.light`"/>
          <FieldValidation :issues="issues" :field="`media.${image.id}.dark`"/>
        </article>
      </div>
      <p v-if="loading">Traitement en cours…</p>
      <p v-else-if="!library.length">Aucune image enregistrée.</p>
    </section>
  </div>
</template>

<style module>
.overlay {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #000c
}

.modal {
  width: min(1050px, 100%);
  max-height: 92vh;
  overflow: auto;
  padding: 22px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text)
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: start
}

.modal header h2 {
  margin: 4px 0 18px;
  font-size: 30px
}

.modal header button {
  border: 0;
  background: none;
  color: var(--text);
  font-size: 28px;
  cursor: pointer
}

.upload {
  display: grid;
  grid-template-columns:1fr 1fr;
  gap: 14px;
  margin-bottom: 22px;
  padding: 18px;
  border: 1px solid var(--line);
  background: var(--surface)
}

.upload h3 {
  grid-column: 1/-1;
  margin: 0 0 2px
}

.upload > button {
  grid-column: 1/-1;
  justify-self: end;
  min-height: 42px;
  padding: 11px 18px;
  border: 0;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  cursor: pointer
}

.readOnly {
  grid-column: 1/-1;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 11px
}

.modal :disabled {
  cursor: not-allowed;
  opacity: .5
}

.fileField {
  display: grid;
  align-content: start;
  gap: 7px
}

.fileHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px
}

.fileHeading span {
  padding: 3px 7px;
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 9px;
  text-transform: uppercase
}

.dropzone {
  position: relative;
  min-height: 128px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 7px;
  padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--text) 35%, transparent);
  background: var(--bg);
  cursor: pointer;
  text-align: center;
  transition: border-color .15s, background .15s
}

.dropzone:hover, .dropzone.selected {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, var(--bg))
}

.dropzone.dragging {
  border-style: solid;
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, var(--bg));
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent) 28%, transparent)
}

.dropzone input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0
}

.dropzone img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  opacity: .78;
  pointer-events: none
}

.dropzone b, .dropzone small {
  pointer-events: none
}

.dropzone b {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px
}

.dropzone small {
  color: var(--muted);
  font-size: 9px
}

.selected img {
  filter: none
}

:global(html[data-theme="dark"]) .dropzone img {
  filter: invert(1)
}

.grid {
  display: grid;
  grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px
}

.grid article {
  padding: 10px;
  border: 1px solid var(--line);
  background: var(--surface)
}

.previews {
  display: grid;
  grid-template-columns:1fr 1fr;
  min-height: 120px;
  gap: 4px;
  margin-bottom: 8px
}

.previews img {
  width: 100%;
  height: 120px;
  object-fit: cover
}

.previews span {
  display: grid;
  place-items: center;
  padding: 8px;
  background: var(--bg);
  color: var(--muted);
  font-size: 10px;
  text-align: center
}

.actions {
  display: grid;
  grid-template-columns:1fr 1fr;
  gap: 6px;
  margin-top: 9px
}

.actions label {
  position: relative;
  padding: 8px;
  border: 1px solid var(--line);
  cursor: pointer;
  font-size: 10px;
  text-align: center
}

.actions input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0
}

.delete {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border: 1px solid #c94a3a;
  background: transparent;
  color: #c94a3a;
  cursor: pointer
}

@media (max-width: 700px) {
  .overlay {
    padding: 6px
  }

  .modal {
    padding: 14px
  }

  .upload {
    grid-template-columns:1fr
  }

  .upload h3, .upload > button {
    grid-column: 1
  }

  .upload > button {
    width: 100%
  }

  .grid {
    grid-template-columns:1fr
  }
}
</style>
