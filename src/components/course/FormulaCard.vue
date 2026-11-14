<script setup lang="ts">
import { computed } from 'vue'
import { getFormula } from '@/data/formulas'
import MathTex from '@/components/common/MathTex.vue'

const props = defineProps<{ formulaId: string; compact?: boolean }>()
const f = computed(() => getFormula(props.formulaId))
</script>

<template>
  <section v-if="f" class="rounded-[20px] border-2 border-ink/80 bg-surface p-5 sm:p-6" :aria-label="`Formule : ${f.title}`">
    <div class="flex items-baseline justify-between gap-3">
      <h3 class="text-lg font-semibold">{{ f.title }}</h3>
      <span class="shrink-0 text-xs text-muted">{{ typeof f.sourcePage === 'number' ? `Diapositive ${f.sourcePage}` : f.sourcePage }}</span>
    </div>
    <div class="my-4 rounded-xl bg-surface-2/70 px-4 py-4 text-center text-[1.15rem] text-ink sm:text-[1.3rem]">
      <MathTex :tex="f.latex" display />
    </div>
    <dl v-if="!compact" class="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
      <template v-for="v in f.variables" :key="v.symbol">
        <dt class="font-semibold text-ink"><MathTex :tex="v.symbol" /></dt>
        <dd class="text-ink-soft">{{ v.meaning }}</dd>
      </template>
    </dl>
    <p v-if="!compact" class="mt-4 border-t border-line pt-3 text-sm text-ink-soft"><strong class="text-ink">Quand l'utiliser ?</strong> {{ f.whenToUse }}</p>
  </section>
</template>
