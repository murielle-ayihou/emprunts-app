<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-vue-next'
const ui = useUiStore()
const icons = { success: CheckCircle2, info: Info, error: AlertCircle }
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:pr-6" aria-live="polite">
    <TransitionGroup name="pop">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm shadow-lg"
        :role="t.tone === 'error' ? 'alert' : 'status'"
      >
        <component :is="icons[t.tone]" :size="18" class="mt-0.5 shrink-0" :class="{ 'text-ok': t.tone === 'success', 'text-ko': t.tone === 'error', 'text-focus': t.tone === 'info' }" />
        <span class="flex-1">{{ t.message }}</span>
        <button class="text-muted hover:text-ink" aria-label="Fermer la notification" @click="ui.dismissToast(t.id)"><X :size="16" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>
