<script setup lang="ts">
import { ref } from 'vue'
import { buildSchedule, type PeriodsPerYear } from '@/services/loan'
import { formatAmount } from '@/utils/format'
const ks: { k: PeriodsPerYear; label: string }[] = [
  { k: 1, label: 'Annuelle' },
  { k: 4, label: 'Trimestrielle' },
  { k: 12, label: 'Mensuelle' },
]
const rows = ks.map((x) => {
  const s = buildSchedule({ capital: 80_000, ratePercent: 5, years: 4, method: 'amortissement-constant', periodsPerYear: x.k, rateRounding: 'td' })
  const firstYear = s.rows.slice(0, x.k).reduce((a, r) => a + r.interest, 0)
  return { ...x, firstYear: Math.round(firstYear * 100) / 100, total: s.totalInterest }
})
const max = Math.max(...rows.map((r) => r.total))
const show = ref<'firstYear' | 'total'>('firstYear')
</script>

<template>
  <figure class="rounded-[20px] border border-line bg-surface p-5 sm:p-6" aria-label="Intérêts selon la périodicité">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="font-semibold">Intérêts payés, emprunt Dali (80 000 €, 5 %, 4 ans)</p>
      <div class="flex rounded-xl border border-line p-0.5 text-xs">
        <button class="rounded-lg px-2.5 py-1 font-semibold" :class="show === 'firstYear' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="show = 'firstYear'">1re année</button>
        <button class="rounded-lg px-2.5 py-1 font-semibold" :class="show === 'total' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="show = 'total'">4 ans</button>
      </div>
    </div>
    <div class="mt-4 space-y-3">
      <div v-for="r in rows" :key="r.k" class="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-sm">
        <span class="font-semibold">{{ r.label }}</span>
        <div class="h-5 rounded-full bg-surface-2"><div class="h-full rounded-full bg-interest transition-all duration-500" :style="{ width: (r[show] / (show === 'total' ? max : rows[0].firstYear)) * 100 + '%' }" /></div>
        <span class="num w-24 text-right font-semibold">{{ formatAmount(r[show]) }} €</span>
      </div>
    </div>
    <figcaption class="mt-3 text-xs text-muted">Calculé avec les taux arrondis de la correction (1,227 % et 0,407 %). Sur 4 ans, les totaux sont des calculs de l’application ; le TD ne présente que la première année.</figcaption>
  </figure>
</template>
