<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navItems } from './navItems'
import AppLogo from './AppLogo.vue'
import QuickToggles from './QuickToggles.vue'
import ProgressBar from './ProgressBar.vue'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const progress = useProgressStore()
</script>

<template>
  <aside class="sidebar sticky top-0 hidden h-dvh w-[260px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-line bg-surface/60 px-4 py-5 backdrop-blur lg:flex">
    <RouterLink to="/" class="rounded-xl px-2 py-1" aria-label="Cursus, retour au tableau de bord"><AppLogo /></RouterLink>

    <p class="mt-6 px-3 text-xs text-muted">Matière : <span class="font-semibold text-ink-soft">Comptabilité financière</span></p>
    <nav class="mt-3 flex flex-col gap-1" aria-label="Navigation principale">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition"
        :class="item.match(route.path) ? 'bg-deep text-on-deep' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'"
        :aria-current="item.match(route.path) ? 'page' : undefined"
      >
        <component :is="item.icon" :size="19" :stroke-width="item.match(route.path) ? 2.3 : 2" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="mt-auto space-y-3 pt-6">
      <RouterLink to="/" class="block rounded-2xl border border-line bg-surface p-4 transition hover:border-brass/60">
        <div class="flex items-baseline justify-between">
          <span class="font-display text-lg font-semibold">Niveau {{ progress.level.level }}</span>
          <span class="num text-sm font-semibold text-brass">{{ progress.state.xp }} XP</span>
        </div>
        <p class="text-sm text-muted">{{ progress.level.name }}</p>
        <ProgressBar class="mt-3" :value="progress.level.progress" color="var(--brass-bright)" :height="6" label="Progression vers le niveau suivant" />
      </RouterLink>
      <div class="flex items-center justify-between px-1">
        <span class="text-xs text-muted">Données gardées sur cet appareil</span>
        <QuickToggles />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar { scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
</style>
