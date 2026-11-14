<script setup lang="ts">
import { PERIOD_LABELS, type LoanSchedule } from '@/services/loan'
import { formatAmount, yearLabel } from '@/utils/format'

const props = defineProps<{ schedule: LoanSchedule; selected?: number }>()
const k = props.schedule.params.periodsPerYear ?? 1
function label(p: number) {
  return k === 1 ? yearLabel(p) : `an ${Math.ceil(p / k)}`
}
const emit = defineEmits<{ select: [period: number] }>()
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-line bg-surface" tabindex="0" role="region" aria-label="Tableau d'amortissement">
    <table class="w-full min-w-[640px] border-collapse text-sm">
      <thead class="sticky top-0 bg-surface-2">
        <tr class="text-left">
          <th scope="col" class="px-3 py-3 font-semibold">Échéance</th>
          <th scope="col" class="px-3 py-3 text-right font-semibold">Capital restant dû (début)</th>
          <th scope="col" class="px-3 py-3 text-right font-semibold text-interest">Intérêts</th>
          <th scope="col" class="px-3 py-3 text-right font-semibold text-capital">Amortissement</th>
          <th scope="col" class="px-3 py-3 text-right font-semibold">{{ PERIOD_LABELS[schedule.params.periodsPerYear ?? 1].payment }}</th>
          <th scope="col" class="px-3 py-3 text-right font-semibold">Capital restant dû (fin)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in schedule.rows"
          :key="r.period"
          class="num cursor-pointer border-t border-line transition hover:bg-surface-2/60"
          :class="selected === r.period ? '!bg-brass-soft/70' : ''"
          tabindex="0"
          :aria-selected="selected === r.period"
          @click="emit('select', r.period)"
          @keydown.enter.space.prevent="emit('select', r.period)"
        >
          <td class="px-3 py-2.5 font-semibold">{{ r.period }} <span class="font-normal text-muted">({{ label(r.period) }})</span></td>
          <td class="px-3 py-2.5 text-right">{{ formatAmount(r.startBalance) }}</td>
          <td class="px-3 py-2.5 text-right text-interest">{{ formatAmount(r.interest) }}</td>
          <td class="px-3 py-2.5 text-right text-capital">{{ formatAmount(r.principal) }}</td>
          <td class="px-3 py-2.5 text-right font-semibold">{{ formatAmount(r.payment) }}</td>
          <td class="px-3 py-2.5 text-right">{{ formatAmount(r.endBalance) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="num border-t-2 border-ink/30 bg-surface-2/50 font-semibold">
          <td class="px-3 py-3">Total</td>
          <td class="px-3 py-3" />
          <td class="px-3 py-3 text-right text-interest">{{ formatAmount(schedule.totalInterest) }}</td>
          <td class="px-3 py-3 text-right text-capital">{{ formatAmount(schedule.totalPrincipal) }}</td>
          <td class="px-3 py-3 text-right">{{ formatAmount(schedule.totalPaid) }}</td>
          <td class="px-3 py-3" />
        </tr>
      </tfoot>
    </table>
  </div>
</template>
