<script setup lang="ts">
import { computed } from 'vue'
import {
  Footprints, Compass, Calculator, Swords, Crown, Target, Flame, BookOpenCheck, ChartLine, CalendarCheck,
  GraduationCap, TrendingUp, Award, Sparkles, BookOpen, CircleHelp,
} from 'lucide-vue-next'

/** Icônes référencées par nom dans les données (badges, célébrations). */
const registry = {
  Footprints, Compass, Calculator, Swords, Crown, Target, Flame, BookOpenCheck, ChartLine, CalendarCheck,
  GraduationCap, TrendingUp, Award, Sparkles, BookOpen,
} as const

const props = withDefaults(defineProps<{ name: string; size?: number; strokeWidth?: number }>(), { size: 20, strokeWidth: 2 })
const comp = computed(() => (registry as Record<string, unknown>)[props.name] ?? CircleHelp)
</script>

<template>
  <component :is="comp" :size="size" :stroke-width="strokeWidth" aria-hidden="true" />
</template>
