<script setup lang="ts">
import { ref } from 'vue'
const steps = [
  { t: 'Pièces comptables', d: 'Factures, pièces de caisse, talons de chèques, relevés bancaires…' },
  { t: 'Journal', d: 'Chaque opération est enregistrée dans l’ordre chronologique : comptes débités et crédités.' },
  { t: 'Comptes', d: 'Les montants sont reportés compte par compte (débits à gauche, crédits à droite).' },
  { t: 'Balance', d: 'Elle récapitule tous les comptes et leurs soldes.' },
  { t: 'États de synthèse', d: 'Bilan, compte de résultat et annexe.' },
]
const active = ref(0)
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Le processus comptable (diapositive 20)">
    <ol class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <li v-for="(s, i) in steps" :key="s.t" class="flex flex-1 items-center gap-2 sm:flex-col sm:items-stretch">
        <button
          class="w-full rounded-2xl border-2 px-3 py-3 text-left text-sm font-semibold transition sm:text-center"
          :class="active === i ? 'border-deep bg-deep text-on-deep' : 'border-line bg-surface hover:border-ink/40'"
          :aria-pressed="active === i"
          @click="active = i"
          @mouseenter="active = i"
        >
          <span class="num mr-1 opacity-60">{{ i + 1 }}.</span>{{ s.t }}
        </button>
        <span v-if="i < steps.length - 1" class="hidden text-center text-muted sm:block" aria-hidden="true">→</span>
      </li>
    </ol>
    <p class="mt-4 min-h-[3rem] text-ink-soft" aria-live="polite"><strong class="text-ink">{{ steps[active].t }} :</strong> {{ steps[active].d }}</p>
    <figcaption class="text-xs text-muted">Le processus comptable (diapositive 20). Survole ou clique une étape.</figcaption>
  </figure>
</template>
