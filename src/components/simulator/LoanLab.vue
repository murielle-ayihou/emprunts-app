<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { buildSchedule, validateParams, METHOD_LABELS, PERIOD_LABELS, type LoanParams, type LoanSchedule } from '@/services/loan'
import { explainComparison } from '@/services/loanCompare'
import { formatAmount, formatEuro, formatPercent, yearLabel } from '@/utils/format'
import { readJson, writeJson } from '@/services/storage'
import { useChart, cssVar, tooltipStyle } from '@/composables/useChart'
import { useProgressStore } from '@/stores/progress'
import LoanForm from '@/components/simulator/LoanForm.vue'
import AmortTable from '@/components/simulator/AmortTable.vue'
import LoanCharts from '@/components/simulator/LoanCharts.vue'
import SplitBar from '@/components/common/SplitBar.vue'
import JournalEntry from '@/components/course/JournalEntry.vue'
import { Plus, Trash2, RotateCcw, Info, Download, Box, BarChart3 } from 'lucide-vue-next'
import { defineAsyncComponent } from 'vue'
const Schedule3D = defineAsyncComponent(() => import('@/components/three/Schedule3D.vue'))
const view3d = ref(true)

const progress = useProgressStore()
const COURSE_DEFAULT: LoanParams = { capital: 60_000, ratePercent: 4, years: 6, method: 'annuite-constante', periodsPerYear: 1, rateRounding: 'exact' }
const SIM_KEY = 'cursus:simulator'

const tab = ref<'simuler' | 'comparer'>('simuler')
const params = ref<LoanParams>({ ...COURSE_DEFAULT, ...(readJson<LoanParams>(SIM_KEY) ?? {}) })
watch(params, (p) => writeJson(SIM_KEY, p), { deep: true })

const errors = computed(() => validateParams(params.value))
const lastGood = ref<LoanSchedule>(buildSchedule(errors.value.length ? COURSE_DEFAULT : params.value))
watch(params, (p) => {
  if (!validateParams(p).length) lastGood.value = buildSchedule(p)
}, { deep: true })
const schedule = computed(() => lastGood.value)

const selected = ref(1)
watch(schedule, (s) => { if (selected.value > s.rows.length) selected.value = 1 })
const row = computed(() => schedule.value.rows[selected.value - 1])
const k = computed(() => schedule.value.params.periodsPerYear ?? 1)
const payLabel = computed(() => PERIOD_LABELS[k.value].payment)
function periodLabel(p: number) {
  return k.value === 1 ? yearLabel(p) : `n°${p}`
}

const isCourseExample = computed(() => {
  const p = params.value
  return p.capital === 60_000 && p.ratePercent === 4 && p.years === 6 && (p.periodsPerYear ?? 1) === 1
})

function resetToCourse() {
  params.value = { ...COURSE_DEFAULT, method: params.value.method }
}

function loadTd5() {
  params.value = { capital: 80_000, ratePercent: 5, years: 4, method: 'amortissement-constant', periodsPerYear: 4, rateRounding: 'td' }
}

function exportCsv() {
  const s = schedule.value
  const lines = [
    ['Échéance', 'Capital restant dû (début)', 'Intérêts', 'Amortissement', payLabel.value, 'Capital restant dû (fin)'].join(';'),
    ...s.rows.map((r) => [periodLabel(r.period), r.startBalance, r.interest, r.principal, r.payment, r.endBalance].map((v) => String(v).replace('.', ',')).join(';')),
  ]
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `tableau-amortissement-${s.params.method}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

// ─── Comparaison ──────────────────────────────────────────────────────
interface Scenario { name: string; params: LoanParams }
const scenarios = ref<Scenario[]>([])
const NAMES = ['Scénario A', 'Scénario B', 'Scénario C']
const compareCounted = ref(false)

function openCompare() {
  tab.value = 'comparer'
  if (!scenarios.value.length) {
    const base = errors.value.length ? { ...COURSE_DEFAULT } : { ...params.value }
    scenarios.value = [
      { name: NAMES[0], params: { ...base } },
      { name: NAMES[1], params: { ...base, ratePercent: Math.min(30, Math.round((base.ratePercent + 1) * 100) / 100) } },
    ]
  }
}
function addScenario() {
  if (scenarios.value.length >= 3) return
  const last = scenarios.value[scenarios.value.length - 1].params
  scenarios.value.push({ name: NAMES[scenarios.value.length], params: { ...last, years: Math.min(40, last.years + 2) } })
}
function removeScenario(i: number) {
  scenarios.value.splice(i, 1)
  scenarios.value.forEach((s, k) => (s.name = NAMES[k]))
}

const compared = computed(() =>
  scenarios.value.map((s) => ({ ...s, errors: validateParams(s.params), schedule: validateParams(s.params).length ? null : buildSchedule(s.params) })),
)
const validCompared = computed(() => compared.value.filter((c) => c.schedule) as { name: string; params: LoanParams; schedule: LoanSchedule }[])
const explanations = computed(() => (validCompared.value.length === compared.value.length ? explainComparison(validCompared.value.map((c) => ({ name: c.name, schedule: c.schedule }))) : []))

watch(() => [tab.value, validCompared.value.length] as const, ([t, n]) => {
  if (t === 'comparer' && n >= 2 && !compareCounted.value) {
    compareCounted.value = true
    progress.recordSimulatorComparison()
  }
})

const cmpCanvas = ref<HTMLCanvasElement | null>(null)
useChart(cmpCanvas, () => {
  const colors = [cssVar('--ink'), cssVar('--interest'), cssVar('--brass-bright')]
  const maxYears = Math.max(1, ...validCompared.value.map((c) => c.schedule.rows.length))
  return {
    type: 'line',
    data: {
      labels: ['Début', ...Array.from({ length: maxYears }, (_, i) => `n°${i + 1}`)],
      datasets: validCompared.value.map((c, i) => ({
        label: c.name,
        data: [c.params.capital, ...c.schedule.rows.map((r) => r.endBalance)],
        borderColor: colors[i],
        backgroundColor: colors[i],
        borderWidth: 2.5,
        tension: 0.12,
        pointRadius: maxYears > 20 ? 0 : 3,
      })),
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { ...tooltipStyle(), callbacks: { label: (c) => `${c.dataset.label} : ${formatEuro(c.parsed.y ?? 0)}` } } },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${(Number(v) / 1000).toLocaleString('fr-FR')} k€` } }, x: { grid: { display: false } } },
    },
  }
}, () => validCompared.value.map((c) => c.params))

const minInterest = computed(() => Math.min(...validCompared.value.map((c) => c.schedule.totalInterest)))
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="max-w-2xl text-ink-soft">Change le capital, le taux, la durée, la modalité ou la périodicité : le tableau se recalcule ligne par ligne, avec les règles du Titre 4 et du TD n°5.</p>
      <div class="flex rounded-2xl border border-line bg-surface p-1" role="tablist" aria-label="Mode du simulateur d’emprunt">
        <button role="tab" :aria-selected="tab === 'simuler'" class="rounded-xl px-4 py-2 text-sm font-semibold transition" :class="tab === 'simuler' ? 'bg-deep text-on-deep' : 'text-ink-soft hover:text-ink'" @click="tab = 'simuler'">Simuler</button>
        <button role="tab" :aria-selected="tab === 'comparer'" class="rounded-xl px-4 py-2 text-sm font-semibold transition" :class="tab === 'comparer' ? 'bg-deep text-on-deep' : 'text-ink-soft hover:text-ink'" @click="openCompare">Comparer des scénarios</button>
      </div>
    </div>

    <!-- ─── SIMULER ─────────────────────────────────────────── -->
    <div v-if="tab === 'simuler'" class="mt-8 space-y-6">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section class="panel p-5 sm:p-6" aria-label="Paramètres de l'emprunt">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl font-semibold">Paramètres</h2>
            <div class="flex gap-1">
              <button class="btn-quiet !px-2.5 !py-1.5 text-xs" :disabled="isCourseExample" @click="resetToCourse"><RotateCcw :size="14" />Exemple du cours</button>
              <button class="btn-quiet !px-2.5 !py-1.5 text-xs" @click="loadTd5">TD n°5</button>
            </div>
          </div>
          <LoanForm v-model="params" id-prefix="sim" />
          <p v-if="errors.length" class="mt-4 rounded-xl bg-ko-soft/70 p-3 text-sm text-ink" role="alert">Corrige les paramètres en rouge : les résultats affichés correspondent aux derniers paramètres valides.</p>
        </section>

        <section class="space-y-5" aria-label="Résultats">
          <div class="rounded-[24px] bg-deep p-6 text-on-deep sm:p-7">
            <p class="text-sm opacity-75">{{ METHOD_LABELS[schedule.params.method] }}, {{ formatAmount(schedule.params.capital) }} € à {{ formatPercent(schedule.params.ratePercent) }} sur {{ schedule.params.years }} an{{ schedule.params.years > 1 ? 's' : '' }}<template v-if="k > 1">, {{ schedule.periods }} échéances à {{ formatPercent(schedule.periodRatePercent, 4) }}</template></p>
            <div class="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p class="text-sm opacity-75">{{ schedule.params.method === 'annuite-constante' ? `${payLabel} constante` : `Première ${payLabel.toLowerCase()}` }}</p>
                <p class="num font-display text-4xl font-bold">{{ formatAmount(schedule.constantPayment ?? schedule.rows[0].payment) }}&nbsp;€</p>
                <p v-if="schedule.params.method !== 'annuite-constante' && schedule.rows.length > 1" class="num mt-1 text-sm opacity-75">Dernière {{ payLabel.toLowerCase() }} : {{ formatAmount(schedule.rows[schedule.rows.length - 1].payment) }} €</p>
              </div>
              <div>
                <p class="text-sm opacity-75">Coût total du crédit (intérêts)</p>
                <p class="num font-display text-4xl font-bold text-brass-bright">{{ formatAmount(schedule.totalInterest) }}&nbsp;€</p>
                <p class="num mt-1 text-sm opacity-75">Total remboursé : {{ formatAmount(schedule.totalPaid) }} €</p>
              </div>
            </div>
          </div>

          <div v-if="schedule.lastPaymentAdjustment !== 0" class="flex gap-2.5 rounded-2xl border border-dashed border-line p-4 text-sm text-ink-soft" role="note">
            <Info :size="18" class="mt-0.5 shrink-0 text-muted" />
            <p>
              Écart d'arrondi : les montants sont arrondis au centime à chaque ligne. La dernière échéance est ajustée de
              <strong class="num text-ink">{{ schedule.lastPaymentAdjustment > 0 ? '+' : '' }}{{ formatAmount(schedule.lastPaymentAdjustment) }} €</strong>
              {{ schedule.params.method === 'annuite-constante' ? `(annuité réelle ${formatAmount(schedule.rows[schedule.rows.length - 1].payment)} €)` : '(amortissement)' }}
              pour que le capital restant dû tombe exactement à 0. C'est le même phénomène que dans le tableau du cours (11 445,74 € en N+5) et dans le TD n°5 (125 713,25 €).
            </p>
          </div>

          <div v-if="row" class="panel p-5 sm:p-6">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h2 class="text-lg font-semibold">Échéance {{ row.period }} ({{ periodLabel(row.period) }})</h2>
              <p class="text-sm text-muted">Clique sur une ligne du tableau pour changer</p>
            </div>
            <SplitBar class="mt-4" :principal="row.principal" :interest="row.interest" :height="18" />
            <p class="mt-3 text-sm text-ink-soft">
              Intérêts = {{ formatAmount(row.startBalance) }} × {{ formatPercent(schedule.periodRatePercent, 4) }} = <strong class="num text-interest">{{ formatAmount(row.interest) }} €</strong>.
              <template v-if="schedule.params.method === 'annuite-constante' && row.period < schedule.rows.length">Amortissement = {{ formatAmount(schedule.constantPayment ?? 0) }} − {{ formatAmount(row.interest) }} = <strong class="num text-capital">{{ formatAmount(row.principal) }} €</strong>.</template>
              <template v-else-if="schedule.params.method === 'amortissement-constant' && row.period < schedule.rows.length">Amortissement = {{ formatAmount(schedule.params.capital) }} / {{ schedule.periods }} ≈ <strong class="num text-capital">{{ formatAmount(row.principal) }} €</strong>.</template>
              <template v-else-if="row.period === schedule.rows.length">Dernière échéance : on rembourse tout le capital restant dû, <strong class="num text-capital">{{ formatAmount(row.principal) }} €</strong>.</template>
              <template v-else>In fine : aucun capital remboursé avant la dernière échéance.</template>
            </p>
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-semibold text-ink-soft hover:text-ink">Voir l'écriture comptable de cette échéance</summary>
              <JournalEntry
                class="mt-3"
                :entry="{
                  date: 'Date de paiement',
                  description: `Paiement de l'échéance ${row.period}`,
                  lines: [
                    ...(row.principal > 0 ? [{ debitAccount: '164', label: 'Emprunts auprès des étab. de crédit', debit: row.principal }] : []),
                    ...(row.interest > 0 ? [{ debitAccount: '661', label: 'Charges d’intérêts', debit: row.interest }] : []),
                    { creditAccount: '512', label: 'Banque', credit: row.payment },
                  ],
                }"
              />
            </details>
          </div>
        </section>
      </div>

      <section>
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-2xl font-semibold">Tableau d'amortissement</h2>
          <button class="btn-ghost !py-2 text-sm" @click="exportCsv"><Download :size="16" />Télécharger (CSV)</button>
        </div>
        <div class="max-h-[32rem] overflow-y-auto rounded-2xl">
          <AmortTable :schedule="schedule" :selected="selected" @select="selected = $event" />
        </div>
      </section>

      <section>
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-2xl font-semibold">Visualiser</h2>
          <div class="flex rounded-xl border border-line bg-surface p-1 text-sm" role="tablist" aria-label="Type de visualisation">
            <button role="tab" :aria-selected="view3d" class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold" :class="view3d ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="view3d = true"><Box :size="15" />Vue 3D</button>
            <button role="tab" :aria-selected="!view3d" class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold" :class="!view3d ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="view3d = false"><BarChart3 :size="15" />Graphiques</button>
          </div>
        </div>
        <div v-if="view3d" class="panel p-4 sm:p-5">
          <Schedule3D :schedule="schedule" :label="periodLabel" />
        </div>
        <LoanCharts v-else :schedule="schedule" />
      </section>
    </div>

    <!-- ─── COMPARER ────────────────────────────────────────── -->
    <div v-else class="mt-8 space-y-6">
      <div class="grid gap-5" :class="scenarios.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'">
        <section v-for="(s, i) in scenarios" :key="i" class="panel p-5" :aria-label="s.name">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-lg font-semibold">
              <span class="h-3 w-3 rounded-full" :style="{ background: ['var(--ink)', 'var(--interest)', 'var(--brass-bright)'][i] }" />{{ s.name }}<span v-if="i === 0" class="text-sm font-normal text-muted">(référence)</span>
            </h2>
            <button v-if="scenarios.length > 2" class="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ko" :aria-label="`Supprimer ${s.name}`" @click="removeScenario(i)"><Trash2 :size="16" /></button>
          </div>
          <LoanForm v-model="s.params" :id-prefix="`cmp${i}`" compact />
        </section>
      </div>
      <button v-if="scenarios.length < 3" class="btn-ghost" @click="addScenario"><Plus :size="16" />Ajouter un scénario</button>

      <section v-if="validCompared.length >= 2" class="space-y-5">
        <div class="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table class="w-full min-w-[560px] text-sm">
            <thead class="bg-surface-2/70 text-left">
              <tr>
                <th scope="col" class="px-4 py-3 font-semibold">Résultat</th>
                <th v-for="c in validCompared" :key="c.name" scope="col" class="px-4 py-3 text-right font-semibold">{{ c.name }}</th>
              </tr>
            </thead>
            <tbody class="num">
              <tr class="border-t border-line"><th scope="row" class="px-4 py-2.5 text-left font-normal text-ink-soft">Paramètres</th><td v-for="c in validCompared" :key="c.name" class="px-4 py-2.5 text-right text-ink-soft">{{ formatAmount(c.params.capital) }} €, {{ formatPercent(c.params.ratePercent) }}, {{ c.params.years }} ans<br /><span class="text-xs">{{ METHOD_LABELS[c.params.method] }}</span></td></tr>
              <tr class="border-t border-line"><th scope="row" class="px-4 py-2.5 text-left font-normal text-ink-soft">Première annuité</th><td v-for="c in validCompared" :key="c.name" class="px-4 py-2.5 text-right font-semibold">{{ formatAmount(c.schedule.rows[0].payment) }} €</td></tr>
              <tr class="border-t border-line"><th scope="row" class="px-4 py-2.5 text-left font-normal text-ink-soft">Dernière annuité</th><td v-for="c in validCompared" :key="c.name" class="px-4 py-2.5 text-right">{{ formatAmount(c.schedule.rows[c.schedule.rows.length - 1].payment) }} €</td></tr>
              <tr class="border-t border-line"><th scope="row" class="px-4 py-2.5 text-left font-normal text-ink-soft">Coût total du crédit</th><td v-for="c in validCompared" :key="c.name" class="px-4 py-2.5 text-right font-semibold" :class="c.schedule.totalInterest === minInterest ? 'text-capital' : 'text-interest'">{{ formatAmount(c.schedule.totalInterest) }} €</td></tr>
              <tr class="border-t border-line"><th scope="row" class="px-4 py-2.5 text-left font-normal text-ink-soft">Total remboursé</th><td v-for="c in validCompared" :key="c.name" class="px-4 py-2.5 text-right">{{ formatAmount(c.schedule.totalPaid) }} €</td></tr>
            </tbody>
          </table>
        </div>

        <div class="grid gap-5 lg:grid-cols-5">
          <figure class="panel p-5 lg:col-span-3">
            <figcaption class="font-semibold">Capital restant dû comparé</figcaption>
            <div class="mt-4 h-64"><canvas ref="cmpCanvas" role="img" aria-label="Évolution comparée du capital restant dû" /></div>
          </figure>
          <section class="rounded-[20px] bg-surface-2/70 p-5 lg:col-span-2" aria-label="Explication des différences">
            <h2 class="text-lg font-semibold">Ce qui explique les écarts</h2>
            <ul class="mt-3 space-y-3 text-[0.95rem] text-ink-soft">
              <li v-for="(e, i) in explanations" :key="i" class="flex gap-2.5"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />{{ e }}</li>
            </ul>
            <p class="mt-4 text-xs text-muted">Pour isoler l'effet d'un paramètre, change-en un seul à la fois.</p>
          </section>
        </div>
      </section>
      <p v-else class="rounded-xl bg-ko-soft/70 p-4 text-sm" role="alert">Corrige les paramètres invalides pour afficher la comparaison.</p>
    </div>
  </div>
</template>
