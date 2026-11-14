<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = withDefaults(defineProps<{ tex: string; display?: boolean }>(), { display: false })

const html = computed(() => {
  try {
    return katex.renderToString(props.tex, { displayMode: props.display, throwOnError: false, strict: false, output: 'html' })
  } catch {
    return props.tex
  }
})
</script>

<template>
  <span :class="display ? 'block' : 'inline'" v-html="html" />
</template>
