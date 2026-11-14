<script setup lang="ts">
import { computed, ref } from 'vue'
import { buildSchedule } from '@/services/loan'
import { formatAmount, yearLabel } from '@/utils/format'
import SplitBar from '@/components/common/SplitBar.vue'

/** Exploration interactive d'une annuité du tableau du cours (amortissement constant, p. 124). */
const sched = buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: 'amortissement-constant' })
const year = ref(1)
const row = computed(() => sched.rows[year.value - 1])
const max = Math.max(...sched.rows.map((r) => r.payment))
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Décomposition d'une annuité">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm text-muted">Annuité de l'année {{ yearLabel(row.period) }}</p>
        <p class="num font-display text-3xl font-bold">{{ formatAmount(row.payment) }} €</p>
      </div>
      <div class="flex gap-1" role="radiogroup" aria-label="Choisir l'année">
        <button
          v-for="r in sched.rows"
          :key="r.period"
          role="radio"
          :aria-checked="year === r.period"
          class="h-9 min-w-11 rounded-lg px-2 text-sm font-semibold transition"
          :class="year === r.period ? 'bg-deep text-on-deep' : 'bg-surface text-ink-soft hover:bg-surface-2 border border-line'"
          @click="year = r.period"
        >{{ yearLabel(r.period) }}</button>
      </div>
    </div>
    <SplitBar class="mt-4" :principal="row.principal" :interest="row.interest" :max="max" :height="22" />
    <p class="mt-4 text-sm text-ink-soft">
      Capital restant dû au début : <strong class="num text-ink">{{ formatAmount(row.startBalance) }} €</strong> → intérêts = {{ formatAmount(row.startBalance) }} × 4 % = <strong class="num text-interest">{{ formatAmount(row.interest) }} €</strong>.
      Après paiement, il reste <strong class="num text-ink">{{ formatAmount(row.endBalance) }} €</strong> à rembourser.
    </p>
    <figcaption class="mt-3 text-xs text-muted">Données : tableau en amortissement constant du cours (60 000 €, 4 %, 6 ans). Clique sur une année.</figcaption>
  </figure>
</template>
