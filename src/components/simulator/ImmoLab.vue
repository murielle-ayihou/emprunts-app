<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { acquisitionCost, disposal, dotationEntry, firstYearMonths, impairmentEntry, impairmentTest, linearPlan, unitsPlan, type PlanRow, type Rounding } from '@/services/immo'
import { formatAmount, formatNumber } from '@/utils/format'
import JournalEntry from '@/components/course/JournalEntry.vue'
import { RotateCcw } from 'lucide-vue-next'

/** Laboratoire Immobilisations : coût d'acquisition, plan, dépréciation et cession (Titre 3). */

// 1. Coût d'acquisition
const acq = ref({ prixAchat: 10_000, remisePct: 5, fraisDirects: 900, fraisAcquisition: 1000, methodeReference: true })
const cost = computed(() => acquisitionCost(acq.value))

// 2. Plan d'amortissement
const mode = ref<'lineaire' | 'uo'>('lineaire')
const cout = ref(100_000)
const vr = ref(0)
const duree = ref(5)
const mois = ref(4)
const milieu = ref(true)
const rounding = ref<Rounding>('euro')
const unitsText = ref('5000, 15000, 20000, 20000, 20000, 15000, 5000')
const units = computed(() => unitsText.value.split(/[;,\s]+/).map((x) => Number(x.replace(',', '.'))).filter((x) => Number.isFinite(x) && x > 0))
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

const valid = computed(() => cout.value > 0 && vr.value >= 0 && vr.value < cout.value && duree.value > 0 && duree.value <= 50)
const plan = computed<PlanRow[]>(() => {
  if (!valid.value) return []
  return mode.value === 'lineaire'
    ? linearPlan({ cout: cout.value, valeurResiduelle: vr.value, dureeAnnees: duree.value, moisMiseEnService: mois.value, milieuDeMois: milieu.value, rounding: rounding.value })
    : units.value.length ? unitsPlan(cout.value, vr.value, units.value, rounding.value) : []
})
const yearLabel = (i: number) => (i === 0 ? 'N' : `N+${i}`)
const maxDot = computed(() => Math.max(1, ...plan.value.map((r) => r.dotation)))

interface PlanSetup { mode: 'lineaire' | 'uo'; cout: number; vr: number; duree?: number; mois?: number; milieu?: boolean; rounding: Rounding }
function setPlan(o: PlanSetup) {
  mode.value = o.mode
  cout.value = o.cout
  vr.value = o.vr
  if (o.duree !== undefined) duree.value = o.duree
  if (o.mois !== undefined) mois.value = o.mois
  if (o.milieu !== undefined) milieu.value = o.milieu
  rounding.value = o.rounding
}
function loadExample(which: 'diap105' | 'td4ex2' | 'td4ex3' | 'diap107') {
  if (which === 'diap105') setPlan({ mode: 'lineaire', cout: 100_000, vr: 0, duree: 5, mois: 4, milieu: true, rounding: 'euro' })
  if (which === 'td4ex2') setPlan({ mode: 'lineaire', cout: 4500, vr: 0, duree: 5, mois: 6, milieu: true, rounding: 'cent' })
  if (which === 'td4ex3') setPlan({ mode: 'lineaire', cout: 32_000, vr: 6080, duree: 3, mois: 7, milieu: false, rounding: 'cent' })
  if (which === 'diap107') {
    setPlan({ mode: 'uo', cout: 50_000, vr: 0, rounding: 'cent' })
    unitsText.value = '5000, 15000, 20000, 20000, 20000, 15000, 5000'
  }
}

// 3. Test de dépréciation
const testYear = ref(0)
const venale = ref(0)
const usage = ref(0)
watch(plan, (p) => {
  if (testYear.value >= p.length) testYear.value = 0
})
const testRow = computed(() => plan.value[testYear.value])
const impairment = computed(() => (testRow.value ? impairmentTest({ vnc: testRow.value.vnc, valeurVenale: venale.value || 0, valeurUsage: usage.value || 0, depreciationsAnterieures: 0 }) : null))
const remainingMonths = computed(() => {
  if (mode.value !== 'lineaire') return 0
  const used = plan.value.slice(0, testYear.value + 1).reduce((s, r) => s + r.months, 0)
  return duree.value * 12 - used
})
const revisedPlan = computed(() => {
  if (!impairment.value || impairment.value.kind !== 'depreciation' || remainingMonths.value <= 0) return []
  return linearPlan({ cout: impairment.value.valeurActuelle, valeurResiduelle: Math.min(vr.value, impairment.value.valeurActuelle), dureeAnnees: remainingMonths.value / 12, moisMiseEnService: 1, milieuDeMois: false, rounding: rounding.value })
})
watch(testRow, (r) => {
  if (r) {
    venale.value = Math.round(r.vnc * 0.8)
    usage.value = Math.round(r.vnc * 0.75)
  }
}, { immediate: true })

// 4. Cession
const cessYear = ref(3)
const cessMonth = ref(7)
const prixCession = ref(6000)
const cession = computed(() => {
  if (mode.value !== 'lineaire' || !plan.value.length) return null
  const idx = Math.min(cessYear.value, plan.value.length - 1)
  const prev = idx > 0 ? plan.value[idx - 1].cumul : 0
  const annual = (cout.value - vr.value) / duree.value
  const startMonth = idx === 0 ? 12 - firstYearMonths(mois.value, milieu.value) : 0
  const monthsUsed = Math.max(0, cessMonth.value - 1 - startMonth)
  const dot = Math.min(plan.value[idx].dotation, Math.round(((annual * monthsUsed) / 12) * 100) / 100)
  return {
    idx,
    monthsUsed,
    res: disposal({
      valeurBrute: cout.value, amortCumulDebut: prev, dotationComplementaire: dot, prixCessionHT: prixCession.value || 0, tauxTVA: 20, paiementDiffere: true,
      compteImmo: '21…', libelleImmo: 'Immobilisation corporelle', compteAmort: '281…', libelleAmort: 'Amortissements de l’immobilisation',
    }),
  }
})
function loadCessionExample() {
  setPlan({ mode: 'lineaire', cout: 25_000, vr: 0, duree: 5, mois: 1, milieu: false, rounding: 'cent' })
  cessYear.value = 3
  cessMonth.value = 7
  prixCession.value = 6000
}
</script>

<template>
  <div class="space-y-6">
    <p class="max-w-2xl text-ink-soft">Du coût d’acquisition à la cession : calcule le coût, construis le plan d’amortissement (linéaire avec prorata, ou unités d’œuvre), teste une dépréciation et prépare les écritures, avec les règles du Titre 3.</p>

    <!-- 1. Coût d'acquisition -->
    <section class="panel p-5 sm:p-6" aria-labelledby="immo-cout">
      <h2 id="immo-cout" class="text-xl font-semibold">1. Coût d’acquisition</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="text-sm font-semibold">Prix d’achat (€)<input v-model.number="acq.prixAchat" type="number" min="0" class="field num mt-1" /></label>
        <label class="text-sm font-semibold">Remise (%)<input v-model.number="acq.remisePct" type="number" min="0" max="100" class="field num mt-1" /></label>
        <label class="text-sm font-semibold">Coûts directement attribuables (€)<input v-model.number="acq.fraisDirects" type="number" min="0" class="field num mt-1" /></label>
        <label class="text-sm font-semibold">Droits, actes, honoraires (€)<input v-model.number="acq.fraisAcquisition" type="number" min="0" class="field num mt-1" /></label>
      </div>
      <label class="mt-3 flex cursor-pointer items-center gap-2.5 text-sm"><input v-model="acq.methodeReference" type="checkbox" class="h-4 w-4 accent-[var(--capital)]" />Méthode de référence (frais d’acquisition intégrés au coût)</label>
      <div class="mt-4 flex flex-wrap items-center gap-4 rounded-2xl bg-surface-2/60 p-4">
        <p>Coût d’acquisition : <strong class="num font-display text-2xl">{{ formatAmount(cost.cout) }} €</strong></p>
        <p v-if="cost.chargesFraisAcquisition" class="text-sm text-ink-soft">{{ formatAmount(cost.chargesFraisAcquisition) }} € de frais en charges</p>
        <button class="btn-ghost ml-auto !py-2 text-sm" @click="cout = cost.cout; mode = 'lineaire'">Amortir ce coût</button>
      </div>
      <p class="mt-2 text-xs text-muted">Exclus toujours : frais administratifs, TVA déductible, formation du personnel. Exemple chargé : la machine-outil de la diapositive 98.</p>
    </section>

    <!-- 2. Plan -->
    <section class="panel p-5 sm:p-6" aria-labelledby="immo-plan">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 id="immo-plan" class="text-xl font-semibold">2. Plan d’amortissement</h2>
        <div class="flex flex-wrap gap-1 text-xs">
          <button class="btn-quiet !px-2 !py-1" @click="loadExample('diap105')"><RotateCcw :size="13" />Diap. 105</button>
          <button class="btn-quiet !px-2 !py-1" @click="loadExample('td4ex2')">TD 4 ex. 2</button>
          <button class="btn-quiet !px-2 !py-1" @click="loadExample('td4ex3')">TD 4 ex. 3</button>
          <button class="btn-quiet !px-2 !py-1" @click="loadExample('diap107')">Unités d’œuvre</button>
        </div>
      </div>
      <div class="mt-4 flex rounded-xl border border-line p-1 text-sm sm:w-max" role="radiogroup" aria-label="Mode d’amortissement">
        <button role="radio" :aria-checked="mode === 'lineaire'" class="flex-1 rounded-lg px-3 py-1.5 font-semibold" :class="mode === 'lineaire' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="mode = 'lineaire'">Linéaire</button>
        <button role="radio" :aria-checked="mode === 'uo'" class="flex-1 rounded-lg px-3 py-1.5 font-semibold" :class="mode === 'uo' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="mode = 'uo'">Unités d’œuvre</button>
      </div>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="text-sm font-semibold">Coût d’acquisition HT (€)<input v-model.number="cout" type="number" min="1" class="field num mt-1" /></label>
        <label class="text-sm font-semibold">Valeur résiduelle (€)<input v-model.number="vr" type="number" min="0" class="field num mt-1" /></label>
        <template v-if="mode === 'lineaire'">
          <label class="text-sm font-semibold">Durée d’utilité (années)<input v-model.number="duree" type="number" min="0.5" max="50" step="0.5" class="field num mt-1" /></label>
          <div class="text-sm font-semibold">Mise en service
            <div class="mt-1 flex gap-2">
              <select v-model.number="milieu" class="field !w-24"><option :value="false">le 1er</option><option :value="true">le 15</option></select>
              <select v-model.number="mois" class="field"><option v-for="(m, i) in MONTHS" :key="m" :value="i + 1">{{ m }}</option></select>
            </div>
          </div>
        </template>
        <label v-else class="text-sm font-semibold sm:col-span-2">Unités d’œuvre par année (séparées par des virgules)<input v-model="unitsText" class="field num mt-1" /></label>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span class="text-muted">Arrondi :</span>
        <label class="flex items-center gap-1.5"><input v-model="rounding" type="radio" value="cent" class="accent-[var(--capital)]" />au centime (TD)</label>
        <label class="flex items-center gap-1.5"><input v-model="rounding" type="radio" value="euro" class="accent-[var(--capital)]" />à l’euro (diapositives)</label>
        <span v-if="mode === 'lineaire'" class="text-muted">Prorata de N : {{ formatNumber(firstYearMonths(mois, milieu)) }}/12</span>
      </div>
      <p v-if="!valid" class="mt-3 rounded-xl bg-ko-soft/70 p-3 text-sm" role="alert">Vérifie les montants : le coût doit être positif et la valeur résiduelle inférieure au coût.</p>

      <div v-if="plan.length" class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div class="overflow-x-auto rounded-2xl border border-line">
          <table class="w-full min-w-[520px] text-sm">
            <thead class="bg-surface-2/70 text-left"><tr><th class="px-3 py-2.5 font-semibold">Année</th><th class="px-3 py-2.5 text-right font-semibold">Base</th><th class="px-3 py-2.5 text-right font-semibold">{{ mode === 'uo' ? 'Unités' : 'Prorata' }}</th><th class="px-3 py-2.5 text-right font-semibold">Dotation</th><th class="px-3 py-2.5 text-right font-semibold">Cumul</th><th class="px-3 py-2.5 text-right font-semibold">VNC</th></tr></thead>
            <tbody class="num">
              <tr v-for="r in plan" :key="r.index" class="border-t border-line">
                <td class="px-3 py-2 font-semibold">31/12/{{ yearLabel(r.index) }}</td>
                <td class="px-3 py-2 text-right">{{ formatAmount(r.base) }}</td>
                <td class="px-3 py-2 text-right text-muted">{{ mode === 'uo' ? formatAmount(r.units ?? 0) : `${formatNumber(r.months)}/12` }}</td>
                <td class="px-3 py-2 text-right font-semibold text-capital">{{ formatAmount(r.dotation) }}</td>
                <td class="px-3 py-2 text-right">{{ formatAmount(r.cumul) }}</td>
                <td class="px-3 py-2 text-right">{{ formatAmount(r.vnc) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="flex h-48 items-end gap-1.5 border-b border-line" role="img" aria-label="Dotations annuelles">
            <div v-for="r in plan" :key="r.index" class="group relative flex-1 rounded-t-md bg-capital transition-all duration-500" :style="{ height: (r.dotation / maxDot) * 100 + '%' }" :title="`${yearLabel(r.index)} : ${formatAmount(r.dotation)} €`" />
          </div>
          <div class="mt-1 flex gap-1.5 text-center text-[0.65rem] text-muted"><span v-for="r in plan" :key="r.index" class="flex-1">{{ yearLabel(r.index) }}</span></div>
        </div>
      </div>
      <JournalEntry v-if="plan.length" class="mt-5" :entry="dotationEntry(plan[0].dotation, '28…', 'Amortissements de l’immobilisation', '31/12/N')" title="Première dotation (D 681 12 / C 28…)" />
    </section>

    <!-- 3. Dépréciation -->
    <section v-if="plan.length" class="panel p-5 sm:p-6" aria-labelledby="immo-dep">
      <h2 id="immo-dep" class="text-xl font-semibold">3. Test de dépréciation</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <label class="text-sm font-semibold">À la clôture de
          <select v-model.number="testYear" class="field mt-1"><option v-for="r in plan" :key="r.index" :value="r.index">31/12/{{ yearLabel(r.index) }} (VNC {{ formatAmount(r.vnc) }} €)</option></select>
        </label>
        <label class="text-sm font-semibold">Valeur vénale (€)<input v-model.number="venale" type="number" min="0" class="field num mt-1" /></label>
        <label class="text-sm font-semibold">Valeur d’usage (€)<input v-model.number="usage" type="number" min="0" class="field num mt-1" /></label>
      </div>
      <div v-if="impairment && testRow" class="mt-4 space-y-4">
        <div class="rounded-2xl bg-surface-2/60 p-4 text-sm">
          <p>Valeur actuelle = max({{ formatAmount(venale || 0) }} ; {{ formatAmount(usage || 0) }}) = <strong class="num">{{ formatAmount(impairment.valeurActuelle) }} €</strong></p>
          <p class="mt-1">VNC avant test : <strong class="num">{{ formatAmount(testRow.vnc) }} €</strong></p>
          <p class="mt-2 font-display text-lg font-semibold" :class="impairment.kind === 'depreciation' ? 'text-interest' : 'text-ok'">
            {{ impairment.kind === 'depreciation' ? `Dépréciation de ${formatAmount(impairment.amount)} €` : 'Aucune dépréciation : la valeur actuelle couvre la VNC' }}
          </p>
          <div v-if="revisedPlan.length" class="mt-3">
            <p class="font-semibold">Nouveau plan sur les {{ formatNumber(remainingMonths) }} mois restants</p>
            <p class="num text-ink-soft">Base = {{ formatAmount(impairment.valeurActuelle) }} − {{ formatAmount(Math.min(vr, impairment.valeurActuelle)) }} ; dotations : {{ revisedPlan.map((r) => formatAmount(r.dotation)).join(' ; ') }} €</p>
          </div>
        </div>
        <JournalEntry v-if="impairmentEntry(impairment, '29…', 'Dépréciation de l’immobilisation')" :entry="impairmentEntry(impairment, '29…', 'Dépréciation de l’immobilisation', `31/12/${yearLabel(testYear)}`)!" title="Écriture d’inventaire" />
      </div>
      <p class="mt-3 text-xs text-muted">Si la valeur remonte lors d’un test suivant, on constate une reprise (D 29… / C 781 62), dans la limite des dépréciations passées (TD n°4, exercices 4 et 5).</p>
    </section>

    <!-- 4. Cession -->
    <section v-if="mode === 'lineaire' && plan.length && cession" class="panel p-5 sm:p-6" aria-labelledby="immo-cession">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 id="immo-cession" class="text-xl font-semibold">4. Cession</h2>
        <button class="btn-quiet !px-2 !py-1 text-xs" @click="loadCessionExample"><RotateCcw :size="13" />Exemple diap. 118</button>
      </div>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <label class="text-sm font-semibold">Année de cession
          <select v-model.number="cessYear" class="field mt-1"><option v-for="r in plan" :key="r.index" :value="r.index">{{ yearLabel(r.index) }}</option></select>
        </label>
        <label class="text-sm font-semibold">Le 1er
          <select v-model.number="cessMonth" class="field mt-1"><option v-for="(m, i) in MONTHS" :key="m" :value="i + 1">{{ m }}</option></select>
        </label>
        <label class="text-sm font-semibold">Prix de cession HT (€)<input v-model.number="prixCession" type="number" min="0" class="field num mt-1" /></label>
      </div>
      <div class="mt-4 space-y-4">
        <dl class="grid grid-cols-2 gap-3 rounded-2xl sm:grid-cols-4 bg-surface-2/60 p-4 text-sm">
          <div><dt class="text-muted">Dotation complémentaire</dt><dd class="num font-semibold">{{ formatAmount(cession.res.amortCumul - (cession.idx > 0 ? plan[cession.idx - 1].cumul : 0)) }} € ({{ cession.monthsUsed }} mois)</dd></div>
          <div><dt class="text-muted">Amortissements cumulés</dt><dd class="num font-semibold">{{ formatAmount(cession.res.amortCumul) }} €</dd></div>
          <div><dt class="text-muted">VNC sortie (657)</dt><dd class="num font-semibold">{{ formatAmount(cession.res.vnc) }} €</dd></div>
          <div><dt class="text-muted">Résultat de cession</dt><dd class="num font-display text-lg font-bold" :class="cession.res.resultat >= 0 ? 'text-ok' : 'text-ko'">{{ cession.res.resultat >= 0 ? '+' : '' }}{{ formatAmount(cession.res.resultat) }} €</dd></div>
        </dl>
        <div class="grid gap-3 lg:grid-cols-2">
          <JournalEntry v-for="(e, i) in cession.res.entries" :key="i" :entry="e" />
        </div>
      </div>
    </section>
  </div>
</template>
