<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

/**
 * Affiche un texte du contenu pédagogique avec une syntaxe légère :
 *   **gras**  et  $formule$ (KaTeX en ligne).
 * Le texte est d'abord échappé : aucun HTML du contenu n'est interprété.
 */
const props = withDefaults(defineProps<{ text: string; tag?: string }>(), { tag: 'p' })

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const html = computed(() => {
  const parts = props.text.split(/(\$[^$]+\$)/g)
  return parts
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        try {
          return katex.renderToString(part.slice(1, -1), { throwOnError: false, strict: false })
        } catch {
          return escape(part)
        }
      }
      return escape(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    })
    .join('')
})
</script>

<template>
  <component :is="tag" v-html="html" />
</template>
