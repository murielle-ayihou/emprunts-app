<script setup lang="ts">
import { ref } from 'vue'
import type { QuickCheck } from '@/types'
import { playSound } from '@/services/sound'
import { Check, X, RotateCcw } from 'lucide-vue-next'

const props = defineProps<{ check: QuickCheck }>()
const picked = ref<number | null>(null)
const shake = ref(false)

function pick(i: number) {
  if (picked.value !== null) return
  picked.value = i
  const ok = i === props.check.answer
  playSound(ok ? 'correct' : 'wrong')
  if (!ok) {
    shake.value = true
    setTimeout(() => (shake.value = false), 400)
  }
}
</script>

<template>
  <section class="rounded-[20px] border border-dashed border-ink/30 p-5 sm:p-6" aria-label="Vérifie ta compréhension">
    <p class="text-sm font-semibold text-capital">Vérifie ta compréhension</p>
    <p class="mt-1 text-[1.05rem] font-semibold text-ink">{{ check.question }}</p>
    <div class="mt-4 grid gap-2 sm:grid-cols-2" :class="{ 'anim-shake': shake }">
      <button
        v-for="(o, i) in check.options"
        :key="i"
        class="flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition"
        :class="[
          picked === null ? 'border-line bg-surface hover:border-ink/40 hover:bg-surface-2' : '',
          picked !== null && i === check.answer ? 'border-ok bg-ok-soft text-ink' : '',
          picked !== null && i === picked && i !== check.answer ? 'border-ko bg-ko-soft text-ink' : '',
          picked !== null && i !== picked && i !== check.answer ? 'border-line opacity-60' : '',
        ]"
        :disabled="picked !== null"
        @click="pick(i)"
      >
        <span>{{ o }}</span>
        <Check v-if="picked !== null && i === check.answer" :size="18" class="shrink-0 text-ok" />
        <X v-else-if="picked === i" :size="18" class="shrink-0 text-ko" />
      </button>
    </div>
    <Transition name="page">
      <div v-if="picked !== null" class="mt-4 flex flex-wrap items-start justify-between gap-3" role="status">
        <p class="flex-1 text-sm text-ink-soft">
          <strong :class="picked === check.answer ? 'text-ok' : 'text-ko'">{{ picked === check.answer ? 'Exact.' : 'Pas tout à fait.' }}</strong>
          {{ check.explanation }}
        </p>
        <button class="btn-quiet !px-2 !py-1 text-xs" @click="picked = null"><RotateCcw :size="14" />Réessayer</button>
      </div>
    </Transition>
  </section>
</template>
