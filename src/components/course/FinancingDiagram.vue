<script setup lang="ts">
const external = [
  { title: 'Capitaux propres', source: 'Actionnaires' },
  { title: 'Subventions et aides publiques', source: 'Organisations publiques' },
  { title: 'Financements bancaires', source: 'Banques', bank: true },
]
</script>

<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Schéma des sources de financement (cours p. 120)">
    <div class="grid gap-4 md:grid-cols-[1fr_3fr]">
      <div class="flex flex-col">
        <p class="mb-2 text-sm text-muted">Ressources de l'entreprise</p>
        <div class="flex flex-1 items-center rounded-2xl bg-deep px-4 py-4 font-semibold text-on-deep">Autofinancement</div>
      </div>
      <div>
        <p class="mb-2 text-sm text-muted">Financements externes</p>
        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="e in external" :key="e.title" class="flex flex-col">
            <div class="rounded-2xl bg-deep px-4 py-4 font-semibold text-on-deep">{{ e.title }}</div>
            <p class="mt-1.5 px-1 text-sm text-ink-soft">Source : {{ e.source }}</p>
            <div v-if="e.bank" class="mt-3 grid grid-cols-2 gap-2 border-t-2 border-dotted border-ink/25 pt-3">
              <div class="rounded-xl border border-line bg-surface px-3 py-2.5 text-center text-sm font-semibold">Crédit-bail</div>
              <div class="rounded-xl bg-brass-soft px-3 py-2.5 text-center text-sm font-bold text-brass ring-2 ring-brass">Emprunts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <figcaption class="mt-4 text-sm text-muted">Schéma du cours (p. 120). L'emprunt, encadré, est le sujet de ce titre.</figcaption>
  </figure>
</template>
