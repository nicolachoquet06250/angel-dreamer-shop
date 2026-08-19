<script setup lang="ts">
const props = defineProps<{ trackClass?: string; label: string; role?: string }>()
const track = ref<HTMLElement | null>(null);
const overflow = ref(false);
const index = ref(0);
const canPrev = computed(() => overflow.value && index.value > 0);
const canNext = computed(() => overflow.value && index.value < (track.value?.children.length || 0) - 1);
const compact = computed(() => props.label.includes('onglets'));
let observer: ResizeObserver | undefined

function updateOverflow() {
  const el = track.value;
  if (!el) return;
  overflow.value = el.scrollWidth > el.clientWidth + 2;
  if (!overflow.value) index.value = 0
}

function updateIndex() {
  const el = track.value;
  if (!el || !el.children.length) return;
  if (el.scrollLeft <= 2) {
    index.value = 0;
    return
  }
  if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
    index.value = el.children.length - 1;
    return
  }
  const reference = compact.value ? el.scrollLeft : el.scrollLeft + el.clientWidth / 2;
  let closest = 0;
  let distance = Infinity;
  Array.from(el.children).forEach((child, i) => {
    const item = child as HTMLElement;
    const point = compact.value ? item.offsetLeft : item.offsetLeft + item.offsetWidth / 2;
    const next = Math.abs(point - reference);
    if (next < distance) {
      distance = next;
      closest = i
    }
  });
  index.value = closest
}

function move(direction: -1 | 1) {
  const el = track.value;
  if (!el) return;
  const next = Math.max(0, Math.min(el.children.length - 1, index.value + direction));
  const item = el.children[next] as HTMLElement;
  index.value = next;
  const centered = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
  el.scrollTo({left: compact.value ? item.offsetLeft : centered, behavior: 'smooth'})
}

onMounted(() => {
  observer = new ResizeObserver(updateOverflow);
  if (track.value) observer.observe(track.value);
  nextTick(updateOverflow)
});
onUpdated(() => nextTick(updateOverflow));
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div :class="$style.root">
    <button v-show="canPrev" type="button" :class="[$style.arrow,$style.previous]"
            :aria-label="`Faire défiler ${label} vers la gauche`" @click="move(-1)"><
    </button>
    <div ref="track" :class="[$style.track,compact&&$style.compact,trackClass]"
         :role="role||(compact?'tablist':undefined)" @scrollend="updateIndex">
      <slot/>
    </div>
    <button v-show="canNext" type="button" :class="[$style.arrow,$style.next]"
            :aria-label="`Faire défiler ${label} vers la droite`" @click="move(1)">>
    </button>
  </div>
</template>
<style module>
.root {
  position: relative;
  min-width: 0
}

.track {
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-x;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch
}

.track::-webkit-scrollbar {
  display: none
}

.arrow {
  position: absolute;
  z-index: 4;
  top: 50%;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  transform: translateY(-50%);
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 3px 14px #0003;
  cursor: pointer;
  font-size: 20px
}

.previous {
  left: 6px
}

.next {
  right: 6px
}

@media (max-width: 1000px) {
  .track {
    display: flex !important;
    gap: 1rem;
    overflow-x: auto !important;
    padding-inline: 1rem;
    margin-inline: -1rem;
    scroll-snap-type: x proximity;
    scroll-padding-inline: 1rem
  }

  .track > * {
    flex: 0 0 250px;
    min-width: 250px;
    scroll-snap-align: center
  }

  .track.compact > * {
    flex-basis: auto;
    min-width: max-content
  }
}

@media (min-width: 1001px) {
  .arrow {
    display: none !important
  }
}
</style>
