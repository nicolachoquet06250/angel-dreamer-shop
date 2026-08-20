<script setup lang="ts">
import type {ValidationIssue} from '~/utils/admin-validation'

const props = defineProps<{ issues?: ValidationIssue[]; field: string }>()
const messages = computed(() => (props.issues || []).filter(issue => issue.field === props.field))
</script>

<template>
  <ul v-if="messages.length" :class="$style.messages" aria-live="polite">
    <li v-for="(message,index) in messages" :key="`${message.level}-${index}`" :class="$style[message.level]">
      <strong>{{ message.level === 'error' ? 'Erreur' : message.level === 'warning' ? 'Attention' : 'Info' }}</strong>
      {{ message.message }}
    </li>
  </ul>
</template>

<style module>
.messages {
  display: grid;
  gap: 4px;
  margin: 5px 0 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
  line-height: 1.35
}

.messages li {
  padding: 7px 9px;
  border-left: 3px solid;
  background: color-mix(in srgb, currentColor 7%, transparent)
}

.messages strong {
  margin-right: 4px
}

.error {
  color: #d73d2a
}

.warning {
  color: #bc7514
}

.info {
  color: #3478b8
}
</style>
