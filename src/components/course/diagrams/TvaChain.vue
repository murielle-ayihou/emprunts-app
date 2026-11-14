<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatAmount } from '@/utils/format'
const ht = ref(1000)
const rate = ref(20)
const tva = computed(() => Math.round(ht.value * rate.value) / 100)
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Mécanisme général de la TVA (diapositive 40)">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div class="rounded-2xl bg-deep p-4 text-center text-on-deep"><p class="font-semibold">Magasin de vélos</p><p class="num text-sm opacity-80">Gain : {{ formatAmount(ht) }} €</p></div>
      <div class="flex min-w-[9rem] flex-col items-center gap-2 text-center text-xs sm:text-sm">
        <span class="w-full border-b-2 border-capital pb-1">Vente : {{ formatAmount(ht) }} € HT + {{ rate }} % → <strong class="num">{{ formatAmount(ht + tva) }} € TTC</strong></span>
        <span class="w-full border-b-2 border-interest pb-1">Paiement de {{ formatAmount(ht + tva) }} €</span>
      </div>
      <div class="rounded-2xl border-2 border-deep bg-surface p-4 text-center font-semibold">Consommateur</div>
    </div>
    <div class="mx-auto mt-3 w-[45%] min-w-[9rem] border-l-2 border-dashed border-brass pl-3 text-sm text-brass">TVA reversée : <strong class="num">{{ formatAmount(tva) }} €</strong></div>
    <div class="mt-2 rounded-xl bg-surface px-4 py-2.5 text-center text-sm font-semibold">Trésor Public</div>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <label class="text-sm"><span class="font-semibold">Prix HT</span><input v-model.number="ht" type="range" min="100" max="3000" step="50" class="mt-1 w-full accent-[var(--capital)]" /></label>
      <label class="text-sm"><span class="font-semibold">Taux</span>
        <select v-model.number="rate" class="field mt-1 !py-1.5"><option :value="20">20 %</option><option :value="10">10 %</option><option :value="5.5">5,5 %</option><option :value="2.1">2,1 %</option></select>
      </label>
    </div>
    <figcaption class="mt-3 text-xs text-muted">Exemple du cours (sans tenir compte de l’approvisionnement) : 1 000 € HT, 20 %, le consommateur paie 1 200 €, le magasin garde 1 000 € et reverse 200 €.</figcaption>
  </figure>
</template>
