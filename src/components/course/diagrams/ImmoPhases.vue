<script setup lang="ts">
const phases = [
  { t: 'Phase préliminaire', k: 'Charges' },
  { t: 'Phase d’acquisition', k: 'Coût d’acquisition' },
  { t: 'Phase de démarrage', k: 'Charges' },
  { t: 'Fonctionnement à plein régime', k: 'Charges' },
]
</script>
<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Période au cours de laquelle les coûts sont engagés (diapositive 99)">
    <ol class="grid gap-2 sm:grid-cols-4">
      <li v-for="(p, i) in phases" :key="p.t" class="flex flex-col gap-2">
        <span class="rounded-xl bg-deep px-3 py-3 text-center text-sm font-semibold text-on-deep">{{ p.t }}</span>
        <span class="rounded-full px-3 py-1.5 text-center text-xs font-bold" :class="p.k === 'Coût d’acquisition' ? 'bg-capital text-white' : 'bg-interest-soft text-interest'">{{ p.k }}</span>
        <span v-if="i === 0" class="text-xs text-muted">Jusqu’à la décision de la direction d’acquérir</span>
        <span v-if="i === 1" class="text-xs text-muted">Jusqu’au niveau d’utilisation prévu initialement</span>
      </li>
    </ol>
    <figcaption class="mt-3 text-xs text-muted">Seuls les coûts engagés entre la décision d’acquérir et l’atteinte du niveau d’utilisation prévu entrent dans le coût d’acquisition.</figcaption>
  </figure>
</template>
