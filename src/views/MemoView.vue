<script setup lang="ts">
import { computed, ref } from 'vue'
import { formulas } from '@/data/formulas'
import { glossary } from '@/data/glossary'
import { getLesson } from '@/data/lessons'
import { normalizeText } from '@/utils/answers'
import FormulaCard from '@/components/course/FormulaCard.vue'
import { Search, Printer } from 'lucide-vue-next'

const q = ref('')
function printPage() {
  window.print()
}
const filtered = computed(() => {
  const n = normalizeText(q.value)
  return n ? glossary.filter((g) => normalizeText(g.term + ' ' + g.definition).includes(n)) : glossary
})
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold sm:text-5xl">Mémo</h1>
        <p class="mt-3 max-w-2xl text-lg text-ink-soft">Toutes les formules, les comptes et le vocabulaire du cours sur une seule page, pour réviser vite.</p>
      </div>
      <button class="btn-ghost print:hidden" @click="printPage"><Printer :size="16" />Imprimer</button>
    </header>

    <section class="mt-10">
      <h2 class="text-2xl font-semibold">Formules</h2>
      <div class="mt-4 grid gap-5 md:grid-cols-2">
        <FormulaCard v-for="f in formulas" :key="f.id" :formula-id="f.id" />
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-2xl font-semibold">Les trois modalités en un coup d'œil</h2>
      <div class="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table class="w-full min-w-[640px] text-sm">
          <thead class="bg-surface-2/70 text-left"><tr><th class="px-4 py-3 font-semibold">Modalité</th><th class="px-4 py-3 font-semibold">Amortissement</th><th class="px-4 py-3 font-semibold">Intérêts</th><th class="px-4 py-3 font-semibold">Annuité</th></tr></thead>
          <tbody>
            <tr class="border-t border-line"><th scope="row" class="px-4 py-3 text-left font-semibold">In fine</th><td class="px-4 py-3 text-ink-soft">0, puis tout le capital à la dernière échéance</td><td class="px-4 py-3 text-ink-soft">Identiques chaque année (payés périodiquement)</td><td class="px-4 py-3 text-ink-soft">Intérêts seuls, puis intérêts + capital</td></tr>
            <tr class="border-t border-line"><th scope="row" class="px-4 py-3 text-left font-semibold">Amortissement constant</th><td class="px-4 py-3 text-ink-soft">C / n, identique</td><td class="px-4 py-3 text-ink-soft">Baissent</td><td class="px-4 py-3 text-ink-soft">Baisse</td></tr>
            <tr class="border-t border-line"><th scope="row" class="px-4 py-3 text-left font-semibold">Annuité constante</th><td class="px-4 py-3 text-ink-soft">Annuité − intérêts, augmente</td><td class="px-4 py-3 text-ink-soft">Baissent</td><td class="px-4 py-3 text-ink-soft">C × i / (1 − (1 + i)^−n), identique</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-2xl font-semibold">Comptes et écritures</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div class="panel p-5">
          <h3 class="font-semibold">Souscription</h3>
          <p class="mt-2 text-sm text-ink-soft"><strong class="text-ink">Débit 512</strong> Banque / <strong class="text-ink">Crédit 164</strong> Emprunts auprès des établissements de crédit, pour le capital. Opération financière : pas de TVA.</p>
        </div>
        <div class="panel p-5">
          <h3 class="font-semibold">Paiement d'une échéance</h3>
          <p class="mt-2 text-sm text-ink-soft"><strong class="text-capital">Débit 164</strong> pour l'amortissement, <strong class="text-interest">Débit 661</strong> Charges d'intérêts pour les intérêts, <strong class="text-ink">Crédit 512</strong> Banque pour l'annuité.</p>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Glossaire</h2>
        <label class="relative w-full max-w-xs print:hidden">
          <span class="sr-only">Rechercher dans le glossaire</span>
          <Search :size="16" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input v-model="q" type="search" class="field !pl-10" placeholder="Rechercher un terme" />
        </label>
      </div>
      <dl class="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
        <div v-for="g in filtered" :key="g.term" class="grid gap-1 p-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
          <dt class="font-semibold">{{ g.term }}</dt>
          <dd class="text-ink-soft">
            {{ g.definition }}
            <RouterLink :to="`/cours/${g.lessonId}`" class="ml-1 whitespace-nowrap text-sm font-semibold text-capital hover:underline print:hidden">Voir la leçon « {{ getLesson(g.lessonId)?.title }} »</RouterLink>
          </dd>
        </div>
        <p v-if="!filtered.length" class="p-6 text-center text-ink-soft">Aucun terme ne correspond à « {{ q }} ».</p>
      </dl>
    </section>
  </div>
</template>
