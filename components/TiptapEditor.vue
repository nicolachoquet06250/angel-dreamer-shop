<script setup lang="ts">
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'

const props = defineProps<{ modelValue: string; placeholder?: string, isDemo?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder || 'Rédigez votre contenu ici…' }),
  ],
  editable: !props.isDemo,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    // @ts-ignore
    editor.value.commands.setContent(value, false)
  }
})

function setLink() {
  const url = window.prompt('URL du lien :')
  if (url) editor.value?.chain().focus().setLink({ href: url }).run()
  else editor.value?.chain().focus().unsetLink().run()
}
</script>

<template>
  <div class="tiptap-wrapper" :class="{ [$style.demoMode]: isDemo }">
    <div v-if="editor" class="tiptap-toolbar">
      <button type="button" :class="{ active: editor.isActive('bold') }" title="Gras" @click="editor.chain().focus().toggleBold().run()"><b>B</b></button>
      <button type="button" :class="{ active: editor.isActive('italic') }" title="Italique" @click="editor.chain().focus().toggleItalic().run()"><i>I</i></button>
      <button type="button" :class="{ active: editor.isActive('underline') }" title="Souligné" @click="editor.chain().focus().toggleUnderline().run()"><u>U</u></button>
      <span class="sep"></span>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 1 }) }" title="Titre 1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 2 }) }" title="Titre 2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 3 }) }" title="Titre 3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 4 }) }" title="Titre 4" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">H4</button>
      <span class="sep"></span>
      <button type="button" :class="{ active: editor.isActive('bulletList') }" title="Liste à puces" @click="editor.chain().focus().toggleBulletList().run()">• —</button>
      <button type="button" :class="{ active: editor.isActive('orderedList') }" title="Liste numérotée" @click="editor.chain().focus().toggleOrderedList().run()">1.</button>
      <button type="button" :class="{ active: editor.isActive('blockquote') }" title="Citation" @click="editor.chain().focus().toggleBlockquote().run()">"</button>
      <button type="button" title="Séparateur horizontal" @click="editor.chain().focus().setHorizontalRule().run()">—</button>
      <span class="sep"></span>
      <button type="button" :class="{ active: editor.isActive('link') }" title="Lien" @click="setLink">🔗</button>
      <span class="sep"></span>
      <button type="button" title="Annuler" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()">↩</button>
      <button type="button" title="Rétablir" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()">↪</button>
    </div>
    <EditorContent :editor="editor" class="tiptap-content" />
  </div>
</template>

<style scoped>
.tiptap-wrapper {
  border: 1px solid var(--line);
  background: var(--surface);
  margin: 12px 0;
}
.tiptap-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}
.tiptap-toolbar button {
  padding: 5px 9px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  border-radius: 3px;
  transition: background .12s, border-color .12s, color .12s;
  min-width: 30px;
}
.tiptap-toolbar button:hover:not(:disabled) {
  border-color: var(--line);
  background: var(--surface);
}
.tiptap-toolbar button.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, var(--surface));
  color: var(--accent);
}
.tiptap-toolbar button:disabled {
  opacity: 0.4;
  cursor: default;
}
.tiptap-toolbar .sep {
  width: 1px;
  height: 20px;
  background: var(--line);
  margin: 0 4px;
}
.tiptap-content {
  min-height: 400px;
  padding: 16px 20px;
  color: var(--text);
  font-size: 15px;
  line-height: 1.7;
  outline: none;
}
.tiptap-content :deep(.ProseMirror) {
  min-height: 400px;
  outline: none;
}
.tiptap-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--muted);
  pointer-events: none;
  float: left;
  height: 0;
}
.tiptap-content :deep(h1) { font-size: 1.8em; font-weight: 800; margin: 0.8em 0 0.4em; }
.tiptap-content :deep(h2) { font-size: 1.4em; font-weight: 700; margin: 0.8em 0 0.4em; }
.tiptap-content :deep(h3) { font-size: 1.15em; font-weight: 700; margin: 0.6em 0 0.3em; }
.tiptap-content :deep(p) { margin: 0.5em 0; }
.tiptap-content :deep(ul), .tiptap-content :deep(ol) { padding-left: 1.5em; margin: 0.5em 0; }
.tiptap-content :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 1em; color: var(--muted); margin: 0.8em 0; }
.tiptap-content :deep(hr) { border: none; border-top: 1px solid var(--line); margin: 1.2em 0; }
.tiptap-content :deep(a) { color: var(--accent); text-decoration: underline; }
.tiptap-content :deep(strong) { font-weight: 700; }
.tiptap-content :deep(em) { font-style: italic; }
</style>

<style module>
.demoMode {
  cursor: default;
}
</style>