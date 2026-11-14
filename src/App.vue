<script setup lang="ts">
import { onMounted, watch } from 'vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import MobileNav from '@/components/common/MobileNav.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import CelebrationHost from '@/components/common/CelebrationHost.vue'
import PwaPrompt from '@/components/common/PwaPrompt.vue'
import { useSettingsStore } from '@/stores/settings'
import { setSoundEnabled } from '@/services/sound'

const settings = useSettingsStore()
watch(() => settings.sound, (v) => setSoundEnabled(v), { immediate: true })
onMounted(() => settings.applyTheme())
</script>

<template>
  <a href="#contenu" class="sr-only z-[80] rounded-lg bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Aller au contenu</a>
  <div class="flex min-h-dvh">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <MobileNav />
      <main id="contenu" class="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10" tabindex="-1">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.name === 'lesson' ? route.fullPath.split('#')[0] : route.name" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
  <ToastHost />
  <CelebrationHost />
  <PwaPrompt />
</template>
