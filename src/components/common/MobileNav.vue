<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navItems } from './navItems'
import AppLogo from './AppLogo.vue'
import QuickToggles from './QuickToggles.vue'
import { Sigma, Settings, Layers } from 'lucide-vue-next'

const route = useRoute()
const items = navItems.filter((i) => i.mobile)
</script>

<template>
  <header class="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper/85 px-4 py-2.5 backdrop-blur lg:hidden" style="padding-top: max(0.625rem, env(safe-area-inset-top))">
    <RouterLink to="/" aria-label="Cursus, retour au tableau de bord"><AppLogo /></RouterLink>
    <div class="flex items-center">
      <QuickToggles class="max-[380px]:hidden" />
      <RouterLink to="/revision" class="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-surface-2" :class="{ 'text-ink bg-surface-2': route.path.startsWith('/revision') }" aria-label="Révision flash"><Layers :size="19" /></RouterLink>
      <RouterLink to="/memo" class="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-surface-2" :class="{ 'text-ink bg-surface-2': route.path.startsWith('/memo') }" aria-label="Mémo des formules"><Sigma :size="19" /></RouterLink>
      <RouterLink to="/reglages" class="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-surface-2" :class="{ 'text-ink bg-surface-2': route.path.startsWith('/reglages') }" aria-label="Réglages"><Settings :size="19" /></RouterLink>
    </div>
  </header>

  <nav
    class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Navigation principale"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="relative flex flex-col items-center gap-0.5 py-2 text-[0.7rem] font-semibold transition"
      :class="item.match(route.path) ? 'text-ink' : 'text-muted'"
      :aria-current="item.match(route.path) ? 'page' : undefined"
    >
      <span class="grid h-8 w-12 place-items-center rounded-full transition" :class="item.match(route.path) ? 'bg-brass-soft text-brass' : ''">
        <component :is="item.icon" :size="20" />
      </span>
      {{ item.short }}
    </RouterLink>
  </nav>
</template>
