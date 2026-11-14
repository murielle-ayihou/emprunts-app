<script setup lang="ts">
import { computed, ref } from 'vue'
import { computePay } from '@/services/paie'
import { formatAmount } from '@/utils/format'
import JournalEntry from '@/components/course/JournalEntry.vue'
import { RotateCcw } from 'lucide-vue-next'

/** Laboratoire Paie : du bulletin aux écritures (Titre 2, partie 4). */
const EXAMPLE = { brut: 4500, netAvantIR: 3500.76, pas: 257.79, cotisationsPatronales: 1836.4 }
const brut = ref(EXAMPLE.brut)
const netAvantIR = ref(EXAMPLE.netAvantIR)
const pas = ref(EXAMPLE.pas)
const pat = ref(EXAMPLE.cotisationsPatronales)
const valid = computed(() => brut.value > 0 && netAvantIR.value > 0 && netAvantIR.value <= brut.value && pas.value >= 0 && pas.value <= netAvantIR.value && pat.value >= 0)
const pay = computed(() => computePay({ brut: brut.value, cotisationsSalariales: Math.round((brut.value - netAvantIR.value) * 100) / 100, pas: pas.value, cotisationsPatronales: pat.value }, 'du mois'))
function reset() {
  brut.value = EXAMPLE.brut
  netAvantIR.value = EXAMPLE.netAvantIR
  pas.value = EXAMPLE.pas
  pat.value = EXAMPLE.cotisationsPatronales
}
const bars = computed(() => {
  const p = pay.value
  const total = p.coutTotal || 1
  return [
    { label: 'Net payé au salarié (421)', v: p.netPaye, cls: 'bg-capital' },
    { label: 'Prélèvement à la source (442 1)', v: p.pas, cls: 'bg-brass-bright' },
    { label: 'Cotisations salariales (43)', v: p.cotisationsSalariales, cls: 'bg-interest/60' },
    { label: 'Cotisations patronales (43)', v: p.cotisationsPatronales, cls: 'bg-interest' },
  ].map((b) => ({ ...b, pct: (b.v / total) * 100 }))
})
</script>

<template>
  <div class="space-y-6">
    <p class="max-w-2xl text-ink-soft">Lis un bulletin de paie et transforme-le en écritures : cotisations salariales, net payé, coût total pour l’employeur, puis paiement des dettes en M+1.</p>
    <div class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section class="panel p-5 sm:p-6" aria-label="Bulletin de paie">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Bulletin</h2>
          <button class="btn-quiet !px-2.5 !py-1.5 text-xs" @click="reset"><RotateCcw :size="14" />Diapositive 87</button>
        </div>
        <div class="space-y-3">
          <label class="block text-sm font-semibold">Salaire brut (€)<input v-model.number="brut" type="number" min="0" step="0.01" class="field num mt-1" /></label>
          <label class="block text-sm font-semibold">Net à payer avant impôt sur le revenu (€)<input v-model.number="netAvantIR" type="number" min="0" step="0.01" class="field num mt-1" /></label>
          <label class="block text-sm font-semibold">Prélèvement à la source (€)<input v-model.number="pas" type="number" min="0" step="0.01" class="field num mt-1" /></label>
          <label class="block text-sm font-semibold">Cotisations patronales (€)<input v-model.number="pat" type="number" min="0" step="0.01" class="field num mt-1" /></label>
        </div>
        <p v-if="!valid" class="mt-3 rounded-xl bg-ko-soft/70 p-3 text-sm" role="alert">Le net avant impôt doit être inférieur au brut, et le prélèvement inférieur au net.</p>
      </section>

      <section v-if="valid" class="space-y-4" aria-label="Analyse">
        <div class="rounded-[24px] bg-deep p-6 text-on-deep">
          <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><dt class="text-sm opacity-75">Cotisations salariales</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(pay.cotisationsSalariales) }}</dd></div>
            <div><dt class="text-sm opacity-75">Net payé</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(pay.netPaye) }}</dd></div>
            <div><dt class="text-sm opacity-75">Dû aux organismes</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(pay.detteOrganismes) }}</dd></div>
            <div><dt class="text-sm opacity-75">Coût total employeur</dt><dd class="num font-display text-xl font-bold text-brass-bright">{{ formatAmount(pay.coutTotal) }}</dd></div>
          </dl>
          <div class="mt-5 flex h-4 overflow-hidden rounded-full" role="img" aria-label="Répartition du coût total employeur">
            <div v-for="b in bars" :key="b.label" :class="b.cls" class="h-full transition-all duration-500" :style="{ width: b.pct + '%' }" />
          </div>
          <ul class="mt-3 grid gap-1 text-xs opacity-90 sm:grid-cols-2">
            <li v-for="b in bars" :key="b.label" class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-sm" :class="b.cls" />{{ b.label }} : <span class="num">{{ formatAmount(b.v) }} €</span></li>
          </ul>
        </div>
      </section>
    </div>
    <section v-if="valid" aria-label="Écritures">
      <h2 class="text-2xl font-semibold">Les écritures</h2>
      <div class="mt-3 grid gap-4 lg:grid-cols-2">
        <JournalEntry v-for="(e, i) in pay.entries" :key="i" :entry="e" />
      </div>
    </section>
  </div>
</template>
