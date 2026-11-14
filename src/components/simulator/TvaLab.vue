<script setup lang="ts">
import { computed, ref } from 'vue'
import { liquidate, paymentEntry, tvaFromHT, tvaRegime, TVA_RATES } from '@/services/tva'
import { formatAmount } from '@/utils/format'
import JournalEntry from '@/components/course/JournalEntry.vue'
import { Plus, Trash2, RotateCcw } from 'lucide-vue-next'

/** Laboratoire TVA : on saisit les opérations du mois, l'application calcule la TVA et la liquidation. */
type Kind = 'vente' | 'achat-bs' | 'achat-immo'
interface Op { kind: Kind; label: string; ht: number; rate: number }

const KIND_LABELS: Record<Kind, string> = { vente: 'Vente', 'achat-bs': 'Achat B&S', 'achat-immo': 'Achat immobilisation' }

const EXAMPLE: Op[] = [
  { kind: 'achat-immo', label: 'Bureau du chef comptable', ht: 1000, rate: 20 },
  { kind: 'achat-bs', label: 'Matières premières', ht: 18_250, rate: 20 },
  { kind: 'vente', label: 'Ventes de produits finis', ht: 45_000, rate: 20 },
]
const ops = ref<Op[]>(EXAMPLE.map((o) => ({ ...o })))
const credit = ref(0)

const totals = computed(() => {
  let collectee = 0, immo = 0, bs = 0
  for (const o of ops.value) {
    const t = Number.isFinite(o.ht) ? tvaFromHT(o.ht, o.rate) : 0
    if (o.kind === 'vente') collectee += t
    else if (o.kind === 'achat-immo') immo += t
    else bs += t
  }
  const r2 = (v: number) => Math.round(v * 100) / 100
  return { collectee: r2(collectee), immo: r2(immo), bs: r2(bs) }
})
const result = computed(() => liquidate({ collectee: totals.value.collectee, deductibleImmo: totals.value.immo, deductibleBS: totals.value.bs, creditAnterieur: credit.value || 0 }))

function add() {
  ops.value.push({ kind: 'vente', label: 'Nouvelle opération', ht: 1000, rate: 20 })
}
function loadJune() {
  // Exemple de la diapositive 49 : on retrouve 40 000 € collectés et 35 493,45 € déductibles
  ops.value = [
    { kind: 'vente', label: 'Ventes de juin', ht: 200_000, rate: 20 },
    { kind: 'achat-bs', label: 'Achats de juin', ht: 177_467.25, rate: 20 },
  ]
  credit.value = 0
}

const ca = ref(500_000)
const activite = ref<'biens' | 'services'>('biens')
const regime = computed(() => ({ franchise: 'Franchise de TVA', 'reel-simplifie': 'Réel simplifié : déclaration annuelle (CA12), acomptes semestriels', 'reel-normal': 'Réel normal : déclaration mensuelle (CA3), paiement entre le 15 et le 25 du mois suivant' })[tvaRegime(ca.value, activite.value)])
</script>

<template>
  <div class="space-y-6">
    <p class="max-w-2xl text-ink-soft">Saisis les opérations d’un mois : l’application calcule la TVA collectée et déductible, puis prépare la liquidation et le paiement, avec l’arrondi à l’euro (658 ou 758) du Titre 2.</p>
    <div class="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <section class="panel p-5 sm:p-6" aria-label="Opérations du mois">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-xl font-semibold">Opérations du mois</h2>
          <div class="flex gap-1">
            <button class="btn-quiet !px-2.5 !py-1.5 text-xs" @click="ops = EXAMPLE.map((o) => ({ ...o })); credit = 0"><RotateCcw :size="14" />Janvier (diap. 45)</button>
            <button class="btn-quiet !px-2.5 !py-1.5 text-xs" @click="loadJune">Juin (diap. 49)</button>
          </div>
        </div>
        <ul class="space-y-3">
          <li v-for="(o, i) in ops" :key="i" class="grid gap-2 rounded-2xl bg-surface-2/60 p-3 sm:grid-cols-[1.3fr_1fr_0.8fr_auto] sm:items-end">
            <label class="text-xs font-semibold text-muted">Nature
              <select v-model="o.kind" class="field mt-1 !py-2 text-sm text-ink"><option v-for="(l, k) in KIND_LABELS" :key="k" :value="k">{{ l }}</option></select>
            </label>
            <label class="text-xs font-semibold text-muted">Montant HT (€)
              <input v-model.number="o.ht" type="number" min="0" step="0.01" class="field num mt-1 !py-2 text-sm text-ink" />
            </label>
            <label class="text-xs font-semibold text-muted">Taux
              <select v-model.number="o.rate" class="field mt-1 !py-2 text-sm text-ink"><option v-for="r in TVA_RATES" :key="r.rate" :value="r.rate">{{ String(r.rate).replace('.', ',') }} %</option></select>
            </label>
            <div class="flex items-center justify-between gap-2 sm:justify-end">
              <span class="num text-sm"><span class="text-muted">TVA</span> {{ formatAmount(tvaFromHT(o.ht || 0, o.rate)) }}</span>
              <button class="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ko" :aria-label="`Supprimer l’opération ${i + 1}`" @click="ops.splice(i, 1)"><Trash2 :size="16" /></button>
            </div>
          </li>
        </ul>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <button class="btn-ghost !py-2 text-sm" @click="add"><Plus :size="16" />Ajouter une opération</button>
          <label class="flex items-center gap-2 text-sm">Crédit de TVA du mois précédent
            <input v-model.number="credit" type="number" min="0" step="0.01" class="field num !w-32 !py-2 text-sm" />
          </label>
        </div>
      </section>

      <section class="space-y-4" aria-label="Résultat de la liquidation">
        <div class="rounded-[24px] bg-deep p-6 text-on-deep">
          <dl class="grid grid-cols-3 gap-3 text-sm">
            <div><dt class="opacity-75">Collectée</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(totals.collectee) }}</dd></div>
            <div><dt class="opacity-75">Déd. immo.</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(totals.immo) }}</dd></div>
            <div><dt class="opacity-75">Déd. B&amp;S</dt><dd class="num font-display text-xl font-bold">{{ formatAmount(totals.bs) }}</dd></div>
          </dl>
          <div class="mt-5 border-t border-white/15 pt-4">
            <p class="text-sm opacity-75">{{ result.credit > 0 ? 'Crédit de TVA à reporter (445 67)' : 'TVA à décaisser (445 51)' }}</p>
            <p class="num font-display text-4xl font-bold text-brass-bright">{{ formatAmount(result.credit > 0 ? result.credit : result.aDecaisser) }}&nbsp;€</p>
            <p v-if="result.ajustement" class="mt-1 text-sm opacity-80">Solde exact {{ formatAmount(result.solde) }} € → écart de {{ formatAmount(result.ajustement.amount) }} € au {{ result.ajustement.account === '658' ? 'débit du 658 (charge)' : 'crédit du 758 (produit)' }}</p>
          </div>
        </div>
        <p class="text-sm text-ink-soft">Comptes : 445 71 TVA collectée (vente), 445 66 TVA déductible sur biens et services, 445 62 TVA déductible sur immobilisations.</p>
        <p v-if="result.credit > 0" class="rounded-xl border border-dashed border-line p-3 text-sm text-ink-soft">Le support ne précise pas d’arrondi en cas de crédit de TVA : le montant exact est reporté au 445 67, imputable sur le mois suivant ou remboursable sous conditions.</p>
      </section>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <JournalEntry :entry="result.entry" title="Liquidation" />
      <JournalEntry v-if="result.aDecaisser > 0" :entry="paymentEntry(result.aDecaisser)" title="Paiement le mois suivant" />
    </div>

    <section class="panel p-5 sm:p-6">
      <h2 class="text-xl font-semibold">Quel régime de TVA ?</h2>
      <div class="mt-3 flex flex-wrap items-end gap-4">
        <label class="text-sm font-semibold">Chiffre d’affaires annuel (€)
          <input v-model.number="ca" type="number" min="0" step="1000" class="field num mt-1 !w-48" />
        </label>
        <div class="flex rounded-xl border border-line p-1 text-sm" role="radiogroup" aria-label="Activité">
          <button role="radio" :aria-checked="activite === 'biens'" class="rounded-lg px-3 py-1.5 font-semibold" :class="activite === 'biens' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="activite = 'biens'">Ventes de biens</button>
          <button role="radio" :aria-checked="activite === 'services'" class="rounded-lg px-3 py-1.5 font-semibold" :class="activite === 'services' ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="activite = 'services'">Prestations de services</button>
        </div>
      </div>
      <p class="mt-3 font-semibold text-capital" aria-live="polite">{{ regime }}</p>
      <p class="mt-1 text-xs text-muted">Seuils du support de cours (diapositive 47). Ils peuvent évoluer : vérifie-les avant l’examen.</p>
    </section>
  </div>
</template>
