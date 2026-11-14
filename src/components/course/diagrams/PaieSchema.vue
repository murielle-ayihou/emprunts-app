<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatAmount } from '@/utils/format'
const brut = 4500, sal = 999.24, pas = 257.79, pat = 1836.4
const net = brut - sal - pas
const hover = ref<string | null>(null)
const parts = computed(() => [
  { k: 'pat', label: 'Cotisations patronales', v: pat, to: 'Organismes sociaux', cls: 'bg-interest/70 text-white' },
  { k: 'sal', label: 'Cotisations salariales', v: sal, to: 'Organismes sociaux', cls: 'bg-interest/45 text-ink' },
  { k: 'pas', label: 'Prélèvement à la source', v: pas, to: 'État', cls: 'bg-brass-bright/70 text-[#2b1a00]' },
  { k: 'net', label: 'Salaire net à payer', v: net, to: 'Personnel', cls: 'bg-capital/80 text-white' },
])
const total = brut + pat
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Éléments constitutifs de la paie (diapositive 84)">
    <p class="text-sm text-muted">Coût total pour l’employeur : <strong class="num text-ink">{{ formatAmount(total) }} €</strong> (bulletin de la diapositive 87)</p>
    <div class="mt-3 flex h-14 overflow-hidden rounded-xl" role="img" aria-label="Répartition du coût total employeur">
      <div v-for="p in parts" :key="p.k" class="grid place-items-center px-1 text-center text-[0.7rem] font-semibold transition-all sm:text-xs" :class="[p.cls, hover && hover !== p.k ? 'opacity-40' : '']" :style="{ width: (p.v / total) * 100 + '%' }" @mouseenter="hover = p.k" @mouseleave="hover = null">
        <span class="num truncate">{{ formatAmount(p.v) }}</span>
      </div>
    </div>
    <div class="mt-1 flex text-[0.7rem] text-muted"><span :style="{ width: (pat / total) * 100 + '%' }" /><span class="flex-1 border-t-2 border-ink/30 pt-1 text-center">Salaire brut : {{ formatAmount(brut) }} €</span></div>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li v-for="p in parts" :key="p.k" class="flex items-center gap-2.5 rounded-xl bg-surface p-2.5 text-sm transition" :class="hover === p.k ? 'ring-2 ring-ink/30' : ''" @mouseenter="hover = p.k" @mouseleave="hover = null">
        <span class="h-3 w-3 shrink-0 rounded" :class="p.cls" />
        <span class="flex-1">{{ p.label }} → <strong>{{ p.to }}</strong></span>
        <span class="num font-semibold">{{ formatAmount(p.v) }}</span>
      </li>
    </ul>
  </figure>
</template>
