<script setup lang="ts">
import { ref, watch } from 'vue'
import KineticTitle from '@/components/common/KineticTitle.vue'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { drillSeries, totalDrillCases } from '@/data/journal/series'
import { loadDrillStore, saveDrillStore } from '@/services/journalDrill'
import { formatDate } from '@/utils/format'
import { Play, Shuffle, GraduationCap, ClipboardCheck } from 'lucide-vue-next'

const store = ref(loadDrillStore())
const mode = ref<'train' | 'exam'>('train')
const showLabels = ref(store.value.showLabels)
watch(showLabels, (v) => {
  const s = loadDrillStore()
  s.showLabels = v
  saveDrillStore(s)
})

function best(id: string) {
  return store.value.best[id] ?? null
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <header>
      <KineticTitle text="Entraînement journal" />
      <p class="mt-3 max-w-2xl text-lg text-ink-soft">
        Une opération, et tu choisis les comptes au débit, les comptes au crédit, puis les montants, comme à l'épreuve.
        {{ totalDrillCases }} cas, rangés par série.
      </p>
    </header>

    <!-- Choix du mode -->
    <section class="mt-8 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Mode de la séance">
      <button
        role="radio"
        :aria-checked="mode === 'train'"
        class="panel flex items-start gap-4 border-2 p-5 text-left transition"
        :class="mode === 'train' ? 'border-ink' : 'border-transparent hover:border-line'"
        @click="mode = 'train'"
      >
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-capital-soft text-capital"><GraduationCap :size="22" /></span>
        <span>
          <span class="block text-lg font-semibold">Entraînement</span>
          <span class="mt-1 block text-ink-soft">La correction s'affiche après chaque cas, avec l'écriture complète et l'explication.</span>
        </span>
      </button>
      <button
        role="radio"
        :aria-checked="mode === 'exam'"
        class="panel flex items-start gap-4 border-2 p-5 text-left transition"
        :class="mode === 'exam' ? 'border-ink' : 'border-transparent hover:border-line'"
        @click="mode = 'exam'"
      >
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-interest-soft text-interest"><ClipboardCheck :size="22" /></span>
        <span>
          <span class="block text-lg font-semibold">Contrôle</span>
          <span class="mt-1 block text-ink-soft">Tu réponds à tout sans aide. La note et la correction arrivent à la fin.</span>
        </span>
      </button>
    </section>

    <label class="mt-4 flex w-fit cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
      <input v-model="showLabels" type="checkbox" class="peer sr-only" role="switch" />
      <span class="relative h-6 w-11 rounded-full bg-surface-2 transition peer-checked:bg-capital peer-focus-visible:outline-2 peer-focus-visible:outline-focus after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden="true" />
      <span class="text-sm font-semibold">Afficher le nom des comptes</span>
      <span class="text-sm text-muted">(à l'épreuve, seuls les numéros sont donnés)</span>
    </label>

    <!-- Séries -->
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      <article class="panel flex flex-col border-2 border-dashed border-line p-6">
        <div class="flex items-start justify-between gap-4">
          <h2 class="text-2xl font-semibold">Série au hasard</h2>
          <ProgressRing :value="best('mix') ?? 0" :size="56" :stroke="6" color="var(--brass-bright)" :label="best('mix') === null ? 'Pas encore tenté' : `Meilleur score ${Math.round((best('mix') ?? 0) * 100)} %`">
            <span class="num text-xs font-bold">{{ best('mix') === null ? '–' : Math.round((best('mix') ?? 0) * 100) + '%' }}</span>
          </ProgressRing>
        </div>
        <p class="mt-2 text-ink-soft">10 cas tirés dans toutes les séries. Chaque séance est différente.</p>
        <RouterLink :to="{ path: '/journal/mix', query: { mode } }" class="btn-primary mt-5 self-start"><Shuffle :size="16" />Lancer 10 cas</RouterLink>
      </article>

      <article v-for="s in drillSeries" :key="s.id" class="panel flex flex-col p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-muted">{{ s.source }}</p>
            <h2 class="mt-1 text-2xl font-semibold leading-tight">{{ s.title }}</h2>
          </div>
          <ProgressRing :value="best(s.id) ?? 0" :size="56" :stroke="6" color="var(--brass-bright)" :label="best(s.id) === null ? 'Pas encore tenté' : `Meilleur score ${Math.round((best(s.id) ?? 0) * 100)} %`">
            <span class="num text-xs font-bold">{{ best(s.id) === null ? '–' : Math.round((best(s.id) ?? 0) * 100) + '%' }}</span>
          </ProgressRing>
        </div>
        <p class="mt-2 text-ink-soft">{{ s.description }}</p>
        <p class="mt-3 text-sm text-muted">{{ s.cases.length }} cas · {{ s.company }}</p>
        <RouterLink :to="{ path: `/journal/${s.id}`, query: { mode } }" class="btn-primary mt-5 self-start"><Play :size="16" />{{ mode === 'train' ? 'S’entraîner' : 'Passer le contrôle' }}</RouterLink>
      </article>
    </div>

    <section v-if="store.history.length" class="mt-12">
      <h2 class="text-2xl font-semibold">Dernières séances</h2>
      <div class="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table class="w-full min-w-[520px] text-sm">
          <thead class="bg-surface-2/70 text-left">
            <tr><th class="px-4 py-3 font-semibold">Date</th><th class="px-4 py-3 font-semibold">Série</th><th class="px-4 py-3 font-semibold">Mode</th><th class="px-4 py-3 text-right font-semibold">Points</th></tr>
          </thead>
          <tbody>
            <tr v-for="(h, i) in store.history.slice(0, 10)" :key="i" class="border-t border-line">
              <td class="px-4 py-2.5 text-muted">{{ formatDate(h.date) }}</td>
              <td class="px-4 py-2.5 font-semibold">{{ h.title }}</td>
              <td class="px-4 py-2.5">{{ h.mode === 'exam' ? 'Contrôle' : 'Entraînement' }}</td>
              <td class="num px-4 py-2.5 text-right">{{ h.points }}/{{ h.total }} <span class="text-muted">({{ Math.round((h.points / h.total) * 100) }} %)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
