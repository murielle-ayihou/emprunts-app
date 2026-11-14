<script setup lang="ts">
import { badges } from '@/data/badges'
import { useProgressStore } from '@/stores/progress'
import AppIcon from '@/components/common/AppIcon.vue'
import { Lock } from 'lucide-vue-next'
import { formatDate } from '@/utils/format'

withDefaults(defineProps<{ limit?: number }>(), {})
const progress = useProgressStore()
const toneCls: Record<string, string> = {
  amber: 'bg-brass-soft text-brass',
  teal: 'bg-capital-soft text-capital',
  indigo: 'bg-[#e1e7f7] text-[#2d4a9a] dark:bg-[#1f2c4f] dark:text-[#9db6ff]',
  rose: 'bg-interest-soft text-interest',
  violet: 'bg-[#ece3f8] text-[#6b3fa6] dark:bg-[#2c2246] dark:text-[#c9a8f5]',
}
</script>

<template>
  <ul class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
    <li v-for="b in limit ? badges.slice(0, limit) : badges" :key="b.id" class="group flex flex-col items-center text-center" :title="b.description">
      <div
        class="relative grid h-16 w-16 place-items-center rounded-[22px] transition group-hover:-translate-y-0.5"
        :class="progress.state.badges[b.id] ? toneCls[b.tone] : 'bg-surface-2 text-muted/60'"
      >
        <AppIcon :name="b.icon" :size="28" :stroke-width="1.8" />
        <span v-if="!progress.state.badges[b.id]" class="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-surface bg-surface-2 text-muted"><Lock :size="12" /></span>
      </div>
      <p class="mt-2 text-sm font-semibold leading-tight" :class="progress.state.badges[b.id] ? 'text-ink' : 'text-muted'">{{ b.title }}</p>
      <p class="text-xs leading-snug text-muted">{{ progress.state.badges[b.id] ? `Obtenu le ${formatDate(progress.state.badges[b.id])}` : b.description }}</p>
    </li>
  </ul>
</template>
