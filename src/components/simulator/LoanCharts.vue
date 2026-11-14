<script setup lang="ts">
import { ref } from 'vue'
import type { LoanSchedule } from '@/services/loan'
import { useChart, cssVar, tooltipStyle, alpha } from '@/composables/useChart'
import { formatEuro, yearLabel } from '@/utils/format'

const props = defineProps<{ schedule: LoanSchedule }>()
const crdCanvas = ref<HTMLCanvasElement | null>(null)
const payCanvas = ref<HTMLCanvasElement | null>(null)
const pieCanvas = ref<HTMLCanvasElement | null>(null)
const labels = () => props.schedule.rows.map((r) => ((props.schedule.params.periodsPerYear ?? 1) === 1 ? yearLabel(r.period) : `n°${r.period}`))
const euroTick = (v: string | number) => {
  const n = Number(v)
  return Math.abs(n) >= 1000 ? `${(n / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} k€` : `${n} €`
}

useChart(crdCanvas, () => ({
  type: 'line',
  data: {
    labels: ['Début', ...labels()],
    datasets: [{
      label: 'Capital restant dû',
      data: [props.schedule.params.capital, ...props.schedule.rows.map((r) => r.endBalance)],
      borderColor: cssVar('--ink'),
      backgroundColor: alpha(cssVar('--capital'), 0.16),
      fill: true, tension: 0.12, borderWidth: 2.5, pointRadius: props.schedule.rows.length > 20 ? 0 : 3,
    }],
  },
  options: {
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: { ...tooltipStyle(), callbacks: { label: (c) => `Capital restant dû : ${formatEuro(c.parsed.y ?? 0)}` } } },
    scales: { y: { beginAtZero: true, ticks: { callback: euroTick } }, x: { grid: { display: false } } },
  },
}), () => props.schedule)

useChart(payCanvas, () => ({
  type: 'bar',
  data: {
    labels: labels(),
    datasets: [
      { label: 'Amortissement', data: props.schedule.rows.map((r) => r.principal), backgroundColor: cssVar('--capital'), borderRadius: 4, stack: 'a' },
      { label: 'Intérêts', data: props.schedule.rows.map((r) => r.interest), backgroundColor: cssVar('--interest'), borderRadius: 4, stack: 'a' },
    ],
  },
  options: {
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: { ...tooltipStyle(), callbacks: { label: (c) => `${c.dataset.label} : ${formatEuro(c.parsed.y ?? 0)}`, footer: (items) => `Annuité : ${formatEuro(items.reduce((s, i) => s + (i.parsed.y ?? 0), 0))}` } },
    },
    scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { callback: euroTick } } },
  },
}), () => props.schedule)

useChart(pieCanvas, () => ({
  type: 'doughnut',
  data: {
    labels: ['Capital remboursé', 'Intérêts (coût du crédit)'],
    datasets: [{ data: [props.schedule.totalPrincipal, props.schedule.totalInterest], backgroundColor: [cssVar('--capital'), cssVar('--interest')], borderColor: cssVar('--surface'), borderWidth: 3 }],
  },
  options: {
    cutout: '68%',
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { ...tooltipStyle(), callbacks: { label: (c) => `${c.label} : ${formatEuro(Number(c.parsed))}` } } },
  },
}), () => props.schedule)
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-5">
    <figure class="panel p-5 lg:col-span-3">
      <figcaption class="font-semibold">Évolution des remboursements</figcaption>
      <p class="text-sm text-muted">Chaque barre est une échéance : capital remboursé et intérêts.</p>
      <div class="mt-4 h-64"><canvas ref="payCanvas" role="img" aria-label="Annuités par année, découpées en amortissement et intérêts" /></div>
    </figure>
    <figure class="panel p-5 lg:col-span-2">
      <figcaption class="font-semibold">Répartition du total remboursé</figcaption>
      <p class="text-sm text-muted">Capital et coût du crédit.</p>
      <div class="mt-4 h-64"><canvas ref="pieCanvas" role="img" aria-label="Répartition entre capital et intérêts" /></div>
    </figure>
    <figure class="panel p-5 lg:col-span-5">
      <figcaption class="font-semibold">Évolution du capital restant dû</figcaption>
      <div class="mt-4 h-60"><canvas ref="crdCanvas" role="img" aria-label="Capital restant dû en fin de chaque année" /></div>
    </figure>
  </div>
</template>
