<script setup lang="ts">
const props = defineProps<{ level: 'debutant' | 'intermediaire' | 'avance' }>()
const map = {
  debutant: { label: 'Débutant', cls: 'bg-capital-soft text-capital', dots: 1 },
  intermediaire: { label: 'Intermédiaire', cls: 'bg-brass-soft text-brass', dots: 2 },
  avance: { label: 'Avancé', cls: 'bg-interest-soft text-interest', dots: 3 },
}
const info = map[props.level]
</script>

<template>
  <span class="chip" :class="info.cls">
    <span class="flex gap-0.5" aria-hidden="true">
      <span v-for="i in 3" :key="i" class="h-1.5 w-1.5 rounded-full" :class="i <= info.dots ? 'bg-current' : 'bg-current opacity-25'" />
    </span>
    {{ info.label }}
  </span>
</template>
