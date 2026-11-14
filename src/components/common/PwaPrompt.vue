<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { WifiOff, RefreshCw, X } from 'lucide-vue-next'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true })
function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <Transition name="pop">
    <div v-if="offlineReady || needRefresh" class="fixed bottom-20 left-4 right-4 z-[55] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-lg lg:bottom-6 lg:left-auto lg:right-6" role="status">
      <component :is="needRefresh ? RefreshCw : WifiOff" :size="20" class="shrink-0 text-capital" />
      <p class="flex-1 text-sm">
        {{ needRefresh ? 'Une nouvelle version est disponible.' : "L'application est prête à fonctionner hors connexion." }}
      </p>
      <button v-if="needRefresh" class="btn-primary !py-1.5" @click="updateServiceWorker(true)">Mettre à jour</button>
      <button class="text-muted hover:text-ink" aria-label="Fermer" @click="close"><X :size="18" /></button>
    </div>
  </Transition>
</template>
