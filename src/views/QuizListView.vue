<script setup lang="ts">
import { computed } from 'vue'
import { quizSeries } from '@/data/quizzes'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import LevelBadge from '@/components/common/LevelBadge.vue'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { Timer, Play } from 'lucide-vue-next'
import { formatDate, formatDuration } from '@/utils/format'
import { getQuizSeries } from '@/data/quizzes'

const progress = useProgressStore()
const settings = useSettingsStore()
const history = computed(() => progress.state.quizAttempts.slice(0, 12))
function attemptsOf(id: string) {
  return progress.state.quizAttempts.filter((a) => a.quizId === id).length
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold sm:text-5xl">Quiz</h1>
        <p class="mt-3 max-w-xl text-lg text-ink-soft">Questions mélangées, une à la fois, avec correction à chaque réponse et un bilan détaillé à la fin.</p>
      </div>
      <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
        <Timer :size="18" class="text-ink-soft" />
        <span class="text-sm font-semibold">Chronomètre</span>
        <input v-model="settings.quizTimer" type="checkbox" class="peer sr-only" role="switch" />
        <span class="relative h-6 w-11 rounded-full bg-surface-2 transition peer-checked:bg-capital peer-focus-visible:outline-2 peer-focus-visible:outline-focus after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden="true" />
      </label>
    </header>

    <div class="mt-8 grid gap-5 md:grid-cols-2">
      <article v-for="q in quizSeries" :key="q.id" class="panel flex flex-col p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <LevelBadge :level="q.level" />
            <h2 class="mt-3 text-2xl font-semibold">{{ q.title }}</h2>
          </div>
          <ProgressRing :value="progress.bestScore(q.id) ?? 0" :size="56" :stroke="6" color="var(--brass-bright)" :label="progress.bestScore(q.id) === null ? 'Pas encore tenté' : `Meilleur score ${Math.round((progress.bestScore(q.id) ?? 0) * 100)} %`">
            <span class="num text-xs font-bold">{{ progress.bestScore(q.id) === null ? '–' : Math.round((progress.bestScore(q.id) ?? 0) * 100) + '%' }}</span>
          </ProgressRing>
        </div>
        <p class="mt-2 text-ink-soft">{{ q.description }}</p>
        <p class="mt-3 text-sm text-muted">
          {{ q.questionIds.length }} questions<span v-if="settings.quizTimer">, {{ Math.round(q.timeLimitSec / 60) }} min</span>
          <span v-if="attemptsOf(q.id)">, {{ attemptsOf(q.id) }} tentative{{ attemptsOf(q.id) > 1 ? 's' : '' }}</span>
        </p>
        <RouterLink :to="`/quiz/${q.id}`" class="btn-primary mt-5 self-start"><Play :size="16" />{{ attemptsOf(q.id) ? 'Recommencer' : 'Commencer' }}</RouterLink>
      </article>
    </div>

    <section class="mt-12">
      <h2 class="text-2xl font-semibold">Historique des tentatives</h2>
      <p v-if="!history.length" class="mt-3 text-ink-soft">Aucune tentative pour l'instant. Commence par « Les bases de l'emprunt ».</p>
      <div v-else class="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table class="w-full min-w-[560px] text-sm">
          <thead class="bg-surface-2/70 text-left">
            <tr><th class="px-4 py-3 font-semibold">Date</th><th class="px-4 py-3 font-semibold">Quiz</th><th class="px-4 py-3 text-right font-semibold">Score</th><th class="px-4 py-3 text-right font-semibold">Temps</th><th class="px-4 py-3"><span class="sr-only">Détail</span></th></tr>
          </thead>
          <tbody>
            <tr v-for="a in history" :key="a.id" class="border-t border-line">
              <td class="px-4 py-2.5 text-muted">{{ formatDate(a.date) }}</td>
              <td class="px-4 py-2.5 font-semibold">{{ getQuizSeries(a.quizId)?.title }}</td>
              <td class="num px-4 py-2.5 text-right">{{ a.score }}/{{ a.total }} <span class="text-muted">({{ Math.round((a.score / a.total) * 100) }} %)</span></td>
              <td class="num px-4 py-2.5 text-right text-muted">{{ formatDuration(a.durationSec) }}</td>
              <td class="px-4 py-2.5 text-right"><RouterLink :to="`/quiz/${a.quizId}/resultats/${a.id}`" class="font-semibold text-capital hover:underline">Voir</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
