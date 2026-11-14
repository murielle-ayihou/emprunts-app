<script setup lang="ts">
import { Moon, Sun, Volume2, VolumeX } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      class="grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-surface-2 hover:text-ink"
      :aria-label="settings.isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
      :title="settings.isDark ? 'Thème clair' : 'Thème sombre'"
      @click="settings.toggleTheme()"
    >
      <Transition name="pop" mode="out-in">
        <Sun v-if="settings.isDark" :size="19" key="sun" />
        <Moon v-else :size="19" key="moon" />
      </Transition>
    </button>
    <button
      class="grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-surface-2 hover:text-ink"
      :aria-label="settings.sound ? 'Couper les sons' : 'Activer les sons'"
      :aria-pressed="settings.sound"
      :title="settings.sound ? 'Sons activés' : 'Sons coupés'"
      @click="settings.sound = !settings.sound"
    >
      <Volume2 v-if="settings.sound" :size="19" />
      <VolumeX v-else :size="19" />
    </button>
  </div>
</template>
