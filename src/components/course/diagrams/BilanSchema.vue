<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatAmount } from '@/utils/format'
// Bilan de l'entreprise Gisèle (Titre 1, correction de l'exercice 6)
const actif = ref({ immobilise: 495_900, circulant: 113_600 })
const passif = ref({ capital: 250_000, dettes: 342_400 })
const totalActif = computed(() => actif.value.immobilise + actif.value.circulant)
const resultat = computed(() => totalActif.value - passif.value.capital - passif.value.dettes)
const sn = computed(() => passif.value.capital + resultat.value)
const h = (v: number) => `${Math.max(6, (v / totalActif.value) * 100)}%`
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Schéma du bilan">
    <div class="grid grid-cols-2 gap-2 text-center text-sm font-semibold">
      <div class="rounded-t-xl bg-deep py-2 text-on-deep">ACTIF</div>
      <div class="rounded-t-xl bg-deep py-2 text-on-deep">PASSIF</div>
    </div>
    <div class="grid h-72 grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <div class="grid place-items-center rounded-lg bg-capital/80 p-2 text-center text-sm font-semibold text-white transition-all duration-500" :style="{ height: h(actif.immobilise) }">Actif immobilisé<br /><span class="num">{{ formatAmount(actif.immobilise) }}</span></div>
        <div class="grid flex-1 place-items-center rounded-lg bg-capital/45 p-2 text-center text-sm font-semibold text-ink">Actif circulant<br /><span class="num">{{ formatAmount(actif.circulant) }}</span></div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="grid place-items-center rounded-lg bg-brass-bright/80 p-2 text-center text-sm font-semibold text-[#2b1a00] transition-all duration-500" :style="{ height: h(Math.max(sn, 0)) }">Situation nette<br /><span class="num">{{ formatAmount(sn) }}</span></div>
        <div class="grid h-6 place-items-center rounded-lg bg-surface text-xs text-muted">Provisions (PRC) : 0</div>
        <div class="grid flex-1 place-items-center rounded-lg bg-interest/70 p-2 text-center text-sm font-semibold text-white">Dettes<br /><span class="num">{{ formatAmount(passif.dettes) }}</span></div>
      </div>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <label class="text-sm"><span class="font-semibold">Actif immobilisé</span>
        <input v-model.number="actif.immobilise" type="range" min="300000" max="700000" step="5000" class="mt-1 w-full accent-[var(--capital)]" />
      </label>
      <label class="text-sm"><span class="font-semibold">Dettes</span>
        <input v-model.number="passif.dettes" type="range" min="200000" max="500000" step="5000" class="mt-1 w-full accent-[var(--interest)]" />
      </label>
    </div>
    <p class="mt-3 text-sm text-ink-soft" aria-live="polite">
      Total actif <strong class="num text-ink">{{ formatAmount(totalActif) }} €</strong> = total passif. Capital 250 000 € + résultat <strong class="num" :class="resultat >= 0 ? 'text-ok' : 'text-ko'">{{ formatAmount(resultat) }} €</strong> = situation nette <strong class="num text-ink">{{ formatAmount(sn) }} €</strong>.
    </p>
    <figcaption class="mt-2 text-xs text-muted">Bilan de l’entreprise Gisèle (correction de l’exercice 6, Titre 1). Bouge les curseurs : le résultat s’ajuste pour que Actif = Passif.</figcaption>
  </figure>
</template>
