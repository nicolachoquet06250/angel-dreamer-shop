<script setup lang="ts">
import type {ImageAsset} from '~/types/shop';

const styles = useCssModule();
type LibraryImage = ImageAsset & { usageCount: number }
const props = withDefaults(defineProps<{
  modelValue: ImageAsset | null;
  label?: string;
  required?: boolean
}>(), {label: 'Image', required: false});
const emit = defineEmits<{ (event: 'update:modelValue', value: ImageAsset | null): void }>();
const imageFor = useThemedImage();
const error = ref('');
const inputId = useId();
const open = ref(false);
const loading = ref(false);
const library = ref<LibraryImage[]>([])
const previewStyle = computed(() => {
  const image = imageFor(props.modelValue);
  if (!image) return {};
  const scale = Math.max(.15, Math.min(2, image.width / Math.max(1, image.naturalWidth)));
  return {width: `${110 * scale}px`, height: `${76 * scale}px`}
})
watch(() => props.modelValue, image => {
  if (!image || image.naturalWidth > 1 || image.naturalHeight > 1) return;
  const probe = new Image();
  probe.onload = () => {
    if (probe.naturalWidth > 1 || probe.naturalHeight > 1) emit('update:modelValue', {
      ...image,
      width: probe.naturalWidth,
      height: probe.naturalHeight,
      naturalWidth: probe.naturalWidth,
      naturalHeight: probe.naturalHeight
    })
  };
  probe.src = image.content
}, {immediate: true})

async function showLibrary() {
  open.value = true;
  loading.value = true;
  error.value = '';
  try {
    library.value = (await $fetch<LibraryImage[]>('/api/admin/images')).filter(Boolean)
  } catch {
    error.value = 'Impossible de charger la bibliothèque'
  } finally {
    loading.value = false
  }
}

function select(image: ImageAsset) {
  emit('update:modelValue', {...image});
  open.value = false
}

async function removeImage(image: LibraryImage) {
  if (image.usageCount > 0) {
    error.value = `Cette image est utilisée ${image.usageCount} fois. Retirez-la d’abord des contenus concernés.`;
    return
  }
  if (!confirm('Supprimer définitivement cette image de la bibliothèque ?')) return;
  loading.value = true;
  error.value = '';
  try {
    await $fetch(`/api/admin/images/${image.id}`, {method: 'DELETE'});
    library.value = library.value.filter(item => item.id !== image.id);
    if (props.modelValue?.id === image.id) emit('update:modelValue', null)
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Suppression impossible'
  } finally {
    loading.value = false
  }
}

async function uploadDark(event: Event, image: LibraryImage) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  error.value = '';
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    error.value = 'Format sombre accepté : JPG, PNG, WebP ou GIF';
    return
  }
  if (file.size > 2_000_000) {
    error.value = 'L’alternative sombre ne doit pas dépasser 2 Mo';
    return
  }
  loading.value = true;
  try {
    const asset = await new Promise<ImageAsset>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const content = String(reader.result);
        const probe = new Image();
        probe.onerror = reject;
        probe.onload = () => resolve({
          id: 0,
          content,
          mimeType: file.type,
          width: probe.naturalWidth,
          height: probe.naturalHeight,
          naturalWidth: probe.naturalWidth,
          naturalHeight: probe.naturalHeight,
          darkVariant: null
        });
        probe.src = content
      };
      reader.readAsDataURL(file)
    });
    const updated = await $fetch<ImageAsset>(`/api/admin/images/${image.id}/dark`, {method: 'PUT', body: asset});
    const index = library.value.findIndex(item => item.id === image.id);
    if (index >= 0) library.value[index] = {...updated, usageCount: image.usageCount};
    if (props.modelValue?.id === image.id) emit('update:modelValue', {...updated})
  } catch {
    error.value = 'L’envoi de l’alternative sombre a échoué'
  } finally {
    loading.value = false;
    input.value = ''
  }
}

async function choose(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  error.value = '';
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    error.value = 'Format accepté : JPG, PNG, WebP ou GIF';
    return
  }
  if (file.size > 2_000_000) {
    error.value = 'L’image ne doit pas dépasser 2 Mo';
    return
  }
  loading.value = true;
  const reader = new FileReader();
  reader.onload = () => {
    const content = String(reader.result);
    const probe = new Image();
    probe.onload = async () => {
      try {
        const image = await $fetch<ImageAsset>('/api/admin/images', {
          method: 'POST',
          body: {
            id: 0,
            content,
            mimeType: file.type,
            width: probe.naturalWidth,
            height: probe.naturalHeight,
            naturalWidth: probe.naturalWidth,
            naturalHeight: probe.naturalHeight
          }
        });
        library.value.unshift({...image, usageCount: 0});
        select(image)
      } catch {
        error.value = 'L’envoi de l’image a échoué'
      } finally {
        loading.value = false
      }
    };
    probe.onerror = () => {
      error.value = 'Dimensions de l’image illisibles';
      loading.value = false
    };
    probe.src = content
  };
  reader.onerror = () => {
    error.value = 'Lecture du fichier impossible';
    loading.value = false
  };
  reader.readAsDataURL(file);
  (event.target as HTMLInputElement).value = ''
}

function setWidth(event: Event) {
  if (!props.modelValue) return;
  const width = Math.max(1, Math.round(Number((event.target as HTMLInputElement).value) || 1));
  const ratio = props.modelValue.naturalHeight / props.modelValue.naturalWidth;
  emit('update:modelValue', {...props.modelValue, width, height: Math.max(1, Math.round(width * ratio))})
}

function setHeight(event: Event) {
  if (!props.modelValue) return;
  const height = Math.max(1, Math.round(Number((event.target as HTMLInputElement).value) || 1));
  const ratio = props.modelValue.naturalWidth / props.modelValue.naturalHeight;
  emit('update:modelValue', {...props.modelValue, height, width: Math.max(1, Math.round(height * ratio))})
}
</script>
<style module>
.field {
  display: grid;
  gap: 8px;
  font-size: 12px
}

.field > span {
  font-weight: 600
}

.box {
  display: grid;
  grid-template-columns:110px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--line);
  background: var(--bg)
}

.previewBox {
  width: 110px;
  height: 76px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--surface)
}

.previewBox img {
  object-fit: cover;
  transition: width .15s, height .15s
}

.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--muted);
  font-size: 10px
}

.box > button {
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  text-align: center
}

.dimensions {
  display: grid;
  grid-template-columns:1fr auto 1fr;
  align-items: end;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--line);
  border-top: 0;
  background: var(--surface)
}

.dimensions label {
  display: grid;
  gap: 4px;
  color: var(--muted);
  font-size: 9px
}

.dimensions label span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text)
}

.dimensions input {
  min-width: 0;
  width: 100%;
  padding: 7px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text)
}

.dimensions b {
  padding-bottom: 8px;
  color: var(--accent);
  font-size: 8px;
  white-space: nowrap
}

.field small {
  color: var(--muted);
  font-size: 9px
}

.field em, .library em {
  color: var(--accent);
  font-style: normal
}

.overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #000b
}

.library {
  width: min(900px, 100%);
  max-height: 85vh;
  overflow: auto;
  padding: 20px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line);
  box-shadow: 0 20px 80px #0008
}

.library header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 18px
}

.library header h2 {
  margin: 3px 0;
  font-size: 26px
}

.library header > button {
  border: 0;
  background: transparent;
  color: var(--text);
  font-size: 28px;
  cursor: pointer
}

.grid {
  display: grid;
  grid-template-columns:repeat(auto-fill, minmax(155px, 1fr));
  gap: 12px
}

.grid > article, .add {
  position: relative;
  min-height: 155px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 7px;
  padding: 8px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text)
}

.add {
  min-height: 135px;
  cursor: pointer
}

.grid > article.selected {
  border: 2px solid var(--accent)
}

.pick {
  width: 100%;
  display: grid;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  cursor: pointer
}

.pair {
  display: grid !important;
  grid-template-columns:1fr 1fr;
  gap: 3px
}

.pair img {
  width: 100%;
  height: 100px;
  object-fit: cover
}

.pair img:only-child {
  grid-column: 1/-1
}

.pick > span:last-child, .add span {
  font-size: 9px
}

.darkUpload {
  width: 100%;
  padding: 7px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  font-size: 8px;
  text-align: center;
  cursor: pointer
}

.darkUpload input, .add input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0
}

.deleteImage {
  width: 100%;
  padding: 7px;
  border: 1px solid #c94a3a;
  background: transparent;
  color: #c94a3a;
  font-size: 9px;
  cursor: pointer
}

.deleteImage:hover {
  background: #c94a3a;
  color: #fff
}

.add b {
  font-size: 38px;
  color: var(--accent)
}

@media (max-width: 600px) {
  .box {
    grid-template-columns:80px 1fr
  }

  .previewBox {
    width: 80px;
    height: 65px
  }

  .box > button:last-child {
    grid-column: 2
  }

  .dimensions {
    grid-template-columns:1fr 1fr
  }

  .dimensions b {
    grid-column: 1/-1;
    grid-row: 2;
    text-align: center
  }

  .overlay {
    padding: 8px
  }

  .library {
    padding: 14px
  }

  .grid {
    grid-template-columns:repeat(2, 1fr)
  }
}
</style>
<template>
  <div :class="styles.field"><span>{{ label }}</span>
    <div :class="styles.box">
      <div :class="styles.previewBox">
        <img v-if="modelValue"
             :src="modelValue.content"
             :style="previewStyle"
             alt="Aperçu de l’image">
        <div v-else :class="styles.placeholder">Aucune image</div>
      </div>
      <button type="button" @click="showLibrary">
        {{ modelValue ? 'Changer dans la bibliothèque' : 'Choisir dans la bibliothèque' }}
      </button>
      <button v-if="modelValue" type="button" @click="$emit('update:modelValue',null)">Retirer</button>
    </div>
    <div v-if="modelValue" :class="styles.dimensions"><label>Largeur affichée <span><input :value="modelValue.width"
                                                                                           type="number" min="1"
                                                                                           @input="setWidth"> px</span></label><b
        aria-label="Ratio verrouillé">🔒 Ratio {{ modelValue.naturalWidth }}:{{ modelValue.naturalHeight }}</b><label>Hauteur
      affichée <span><input :value="modelValue.height" type="number" min="1" @input="setHeight"> px</span></label></div>
    <small>Image réutilisable depuis la bibliothèque · dimensions synchronisées avec l’aperçu</small><em
        v-if="error">{{ error }}</em>
    <Teleport to="body">
      <div v-if="open" :class="styles.overlay" @click.self="open=false">
        <section :class="styles.library" role="dialog" aria-modal="true" :aria-label="`Bibliothèque — ${label}`">
          <header>
            <div><small>MÉDIATHÈQUE</small>
              <h2>Choisir une image</h2></div>
            <button type="button" aria-label="Fermer" @click="open=false">×</button>
          </header>
          <div :class="styles.grid"><label :class="styles.add"
                                           :for="inputId"><b>+</b><span>Ajouter une image</span><input :id="inputId"
                                                                                                       type="file"
                                                                                                       accept="image/jpeg,image/png,image/webp,image/gif"
                                                                                                       @change="choose"></label>
            <article v-for="image in library" :key="image.id" :class="modelValue?.id===image.id?styles.selected:''">
              <button type="button" :class="styles.pick" @click="select(image)"><span :class="styles.pair"><img
                  :src="image.content" alt="Version claire">
                <img v-if="image.darkVariant"
                     :src="image.darkVariant.content"
                     alt="Version sombre">
              </span><span>{{ image.width }} × {{ image.height }} px</span>
              </button>
              <label
                  :class="styles.darkUpload">{{ image.darkVariant ? 'Remplacer la version sombre' : '＋ Ajouter une version sombre' }}<input
                  type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  @change="uploadDark($event,image)"></label>
              <button type="button" :class="styles.deleteImage"
                      :title="image.usageCount?`Image utilisée ${image.usageCount} fois`:'Supprimer cette image'"
                      :aria-label="`Supprimer l’image ${image.id}`" @click="removeImage(image)">Supprimer
              </button>
            </article>
          </div>
          <p v-if="loading">Chargement…</p>
          <p v-else-if="library.length===0">Aucune image enregistrée pour le moment.</p><em
            v-if="error">{{ error }}</em></section>
      </div>
    </Teleport>
  </div>
</template>
