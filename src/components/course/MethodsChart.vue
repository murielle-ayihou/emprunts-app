<script setup lang="ts">
import { ref } from 'vue'
import { buildSchedule, METHOD_LABELS, type LoanMethod } from '@/services/loan'
import { useChart, cssVar, tooltipStyle } from '@/composables/useChart'
import { formatEuro, yearLabel } from '@/utils/format'

const canvas = ref<HTMLCanvasElement | null>(null)
const methods: LoanMethod[] = ['in-fine', 'annuite-constante', 'amortissement-constant']
const data = methods.map((m) => buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: m }))

useChart(
  canvas,
  () => {
    const colors = [cssVar('--interest'), cssVar('--brass-bright'), cssVar('--capital')]
    return {
      type: 'line',
      data: {
        labels: ['Début', ...data[0].rows.map((r) => `Fin ${yearLabel(r.period)}`)],
        datasets: data.map((s, i) => ({
          label: METHOD_LABELS[methods[i]],
          data: [60_000, ...s.rows.map((r) => r.endBalance)],
          borderColor: colors[i],
          backgroundColor: colors[i],
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 3,
        })),
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: { ...tooltipStyle(), callbacks: { label: (c) => `${c.dataset.label} : ${formatEuro(c.parsed.y ?? 0)}` } },
        },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${Number(v) / 1000} k€` } }, x: { grid: { display: false } } },
      },
    }
  },
  () => null,
)
</script>

<template>
  <figure class="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
    <p class="font-semibold">Capital restant dû en fin d'année</p>
    <p class="text-sm text-muted">Plus la courbe reste haute longtemps, plus les intérêts payés sont élevés.</p>
    <div class="mt-4 h-64"><canvas ref="canvas" role="img" aria-label="Évolution du capital restant dû pour les trois modalités" /></div>
  </figure>
</template>
