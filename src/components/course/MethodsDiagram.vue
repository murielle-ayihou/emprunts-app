<script setup lang="ts">
import { buildSchedule, METHOD_LABELS, type LoanMethod } from '@/services/loan'
import { formatAmount, yearLabel } from '@/utils/format'

/** Trois mini-tableaux en barres : l'annuité de chaque année, découpée en capital et intérêts. */
const methods: { id: LoanMethod; text: string }[] = [
  { id: 'in-fine', text: 'Le capital est amorti en une seule fois au terme.' },
  { id: 'amortissement-constant', text: 'Le capital est amorti périodiquement, parts égales.' },
  { id: 'annuite-constante', text: 'Les paiements périodiques sont constants.' },
]
const schedules = methods.map((m) => ({ ...m, s: buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: m.id }) }))
const max = Math.max(...schedules.flatMap((x) => x.s.rows.map((r) => r.payment)))
// échelle compressée pour garder lisible la grande dernière annuité in fine
const h = (v: number) => Math.max(2, Math.sqrt(v / max) * 100)
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Les trois modalités de remboursement comparées">
    <div class="grid gap-6 sm:grid-cols-3">
      <div v-for="m in schedules" :key="m.id">
        <p class="font-display text-lg font-semibold">{{ METHOD_LABELS[m.id] }}</p>
        <p class="mt-0.5 min-h-[2.75rem] text-sm text-ink-soft">{{ m.text }}</p>
        <div class="mt-3 flex h-36 items-end gap-1.5 border-b border-line" role="img" :aria-label="`Annuités ${METHOD_LABELS[m.id]} : ${m.s.rows.map((r) => formatAmount(r.payment)).join(', ')} euros`">
          <div v-for="r in m.s.rows" :key="r.period" class="flex flex-1 flex-col justify-end overflow-hidden rounded-t-md" :style="{ height: h(r.payment) + '%' }" :title="`${yearLabel(r.period)} : ${formatAmount(r.payment)} €`">
            <div class="bg-interest" :style="{ height: (r.interest / r.payment) * 100 + '%' }" />
            <div class="bg-capital" :style="{ height: (r.principal / r.payment) * 100 + '%' }" />
          </div>
        </div>
        <div class="mt-1 flex gap-1.5 text-center text-[0.65rem] text-muted">
          <span v-for="r in m.s.rows" :key="r.period" class="flex-1">{{ yearLabel(r.period) }}</span>
        </div>
      </div>
    </div>
    <figcaption class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-capital" />Amortissement du capital</span>
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-interest" />Intérêts</span>
      <span>Emprunt du cours : 60 000 €, 4 %, 6 ans (hauteurs compressées pour la lisibilité).</span>
    </figcaption>
  </figure>
</template>
