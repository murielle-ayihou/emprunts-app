<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useUiStore } from '@/stores/ui'
import AppIcon from './AppIcon.vue'

const ui = useUiStore()
const current = computed(() => ui.celebrations[0] ?? null)
const btn = ref<HTMLButtonElement | null>(null)

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const colors = ['var(--brass-bright)', 'var(--capital)', 'var(--interest)', '#7aa7ff']
const pieces = computed(() =>
  reduced
    ? []
    : Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        dur: 1.6 + Math.random() * 1.2,
        dx: (Math.random() - 0.5) * 160 + 'px',
        rot: (Math.random() * 720 - 360) + 'deg',
        color: colors[i % colors.length],
        w: 6 + Math.random() * 6,
        key: `${current.value?.id}-${i}`,
      })),
)

const kindLabel = computed(() => {
  if (!current.value) return ''
  return { badge: 'Nouveau badge', level: 'Niveau supérieur', chapter: 'Chapitre terminé' }[current.value.kind]
})

watch(current, async (c) => {
  if (c) {
    await nextTick()
    btn.value?.focus()
  }
})
</script>

<template>
  <Transition name="pop">
    <div v-if="current" class="fixed inset-0 z-[70] grid place-items-center bg-[#0d1729]/45 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" :aria-label="kindLabel" @click.self="ui.dismissCelebration()" @keydown.esc="ui.dismissCelebration()">
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <span
          v-for="p in pieces"
          :key="p.key"
          class="absolute top-0 block rounded-[2px]"
          :style="{ left: p.left + '%', width: p.w + 'px', height: p.w * 0.45 + 'px', background: p.color, '--dx': p.dx, '--rot': p.rot, animation: `confetti-fall ${p.dur}s ${p.delay}s cubic-bezier(.3,.6,.4,1) forwards` }"
        />
      </div>
      <div class="relative w-[min(92vw,380px)] rounded-[24px] border border-line bg-surface p-7 text-center shadow-2xl">
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brass-soft text-brass ring-8 ring-brass-soft/40">
          <AppIcon :name="current.icon" :size="38" :stroke-width="1.8" />
        </div>
        <p class="mt-5 text-sm font-semibold text-brass">{{ kindLabel }}</p>
        <h2 class="mt-1 text-2xl font-bold">{{ current.title }}</h2>
        <p class="mt-2 text-ink-soft">{{ current.message }}</p>
        <button ref="btn" class="btn-primary mt-6 w-full" @click="ui.dismissCelebration()">
          {{ ui.celebrations.length > 1 ? 'Suivant' : 'Continuer' }}
        </button>
      </div>
    </div>
  </Transition>
</template>
