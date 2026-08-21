<script setup lang="ts">
type AdminSubTab = Readonly<{ id: string; label: string }>

defineProps<{
  tabs: readonly AdminSubTab[]
  active: string
  label: string
  idPrefix: string
  panelPrefix: string
}>()

defineEmits<{ (event: 'select', id: string): void }>()
</script>

<template>
  <HorizontalCarousel :track-class="$style.subTabs" :label="label">
    <button v-for="tab in tabs" :id="`${idPrefix}-${tab.id}`" :key="tab.id" type="button" role="tab"
            data-demo-interactive :aria-selected="active===tab.id" :aria-controls="`${panelPrefix}-${tab.id}`"
            :tabindex="active===tab.id?0:-1" @click="$emit('select', tab.id)">{{ tab.label }}
    </button>
  </HorizontalCarousel>
</template>

<style module>
.subTabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 7px;
  margin: 14px 0 20px;
  overflow-x: auto;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line)
}

.subTabs button {
  flex: 0 0 auto;
  padding: 9px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer
}

.subTabs button[aria-selected=true] {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff
}
</style>