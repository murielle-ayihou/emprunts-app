<script setup lang="ts">
import { ref } from 'vue'
const mode = ref<'comptant' | 'credit1' | 'credit2'>('comptant')
const data = {
  comptant: { top: 'Flux monétaire : 1 000 €', bottom: 'Flux réel : marchandises (valeur 1 000 €)', client: ['Décaissement de 1 000 €', 'Marchandises de 1 000 €'], fourn: ['Marchandises de 1 000 €', 'Encaissement de 1 000 €'] },
  credit1: { top: 'Crédit de 1 000 €', bottom: 'Flux réel : marchandises (valeur 1 000 €)', client: ['Naissance de la dette de 1 000 €', 'Marchandises de 1 000 €'], fourn: ['Marchandises de 1 000 €', 'Naissance de la créance de 1 000 €'] },
  credit2: { top: 'Paiement de 1 000 €', bottom: 'Crédit de 1 000 €', client: ['Décaissement de 1 000 €', 'Extinction de la dette de 1 000 €'], fourn: ['Extinction de la créance de 1 000 €', 'Encaissement de 1 000 €'] },
}
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Approche par les flux">
    <div class="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Situation">
      <button v-for="[k, l] in [['comptant', 'Achat au comptant'], ['credit1', 'À crédit : achat'], ['credit2', 'À crédit : paiement']]" :key="k" role="radio" :aria-checked="mode === k" class="rounded-full px-3.5 py-1.5 text-sm font-semibold transition" :class="mode === k ? 'bg-deep text-on-deep' : 'border border-line bg-surface text-ink-soft'" @click="mode = k as typeof mode">{{ l }}</button>
    </div>
    <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div class="rounded-2xl bg-deep px-3 py-4 text-center font-semibold text-on-deep">Client<br /><span class="text-xs font-normal opacity-75">acheteur</span></div>
      <div class="flex min-w-[8rem] flex-col gap-3 text-center text-xs sm:min-w-[14rem] sm:text-sm">
        <div class="flow flow-right text-capital"><span>{{ data[mode].top }}</span></div>
        <div class="flow flow-left text-interest"><span>{{ data[mode].bottom }}</span></div>
      </div>
      <div class="rounded-2xl bg-deep px-3 py-4 text-center font-semibold text-on-deep">Fournisseur<br /><span class="text-xs font-normal opacity-75">vendeur</span></div>
    </div>
    <div class="mt-5 overflow-x-auto">
      <table class="w-full min-w-[30rem] text-sm">
        <thead><tr class="text-left text-muted"><th class="py-1.5" /><th class="py-1.5 font-semibold">Entreprise cliente</th><th class="py-1.5 font-semibold">Entreprise fournisseur</th></tr></thead>
        <tbody>
          <tr class="border-t border-line"><th class="py-2 pr-3 text-left font-semibold">Ressource</th><td class="py-2">{{ data[mode].client[0] }}</td><td class="py-2">{{ data[mode].fourn[0] }}</td></tr>
          <tr class="border-t border-line"><th class="py-2 pr-3 text-left font-semibold">Emploi</th><td class="py-2">{{ data[mode].client[1] }}</td><td class="py-2">{{ data[mode].fourn[1] }}</td></tr>
        </tbody>
      </table>
    </div>
    <figcaption class="mt-3 text-xs text-muted">Diapositives 13 à 15 : deux flux de même valeur et de sens contraire.</figcaption>
  </figure>
</template>

<style scoped>
.flow { position: relative; padding: 0.3rem 0; border-bottom: 2px solid currentColor; }
.flow span { color: var(--ink); }
.flow::after { content: ''; position: absolute; bottom: -6px; width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
.flow-right::after { right: -2px; border-left: 8px solid currentColor; }
.flow-left::after { left: -2px; border-right: 8px solid currentColor; }
.flow { background-image: linear-gradient(90deg, transparent 0 40%, color-mix(in oklab, currentColor 18%, transparent) 50%, transparent 60% 100%); background-size: 200% 100%; animation: travel 2.4s linear infinite; }
.flow-left { animation-direction: reverse; }
@keyframes travel { from { background-position: 100% 0; } to { background-position: -100% 0; } }
</style>
