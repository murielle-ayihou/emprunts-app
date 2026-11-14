<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { getQuizQuestion, getQuizSeries } from '@/data/quizzes'
import { getLesson } from '@/data/lessons'
import { quizXp } from '@/services/gamification'
import { formatDuration, formatNumber } from '@/utils/format'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { Check, X, RotateCcw, LayoutDashboard, BookOpen, Minus } from 'lucide-vue-next'
import type { QuizQuestion } from '@/types'

const props = defineProps<{ quizId: string; attemptId: string }>()
const progress = useProgressStore()
const attempt = computed(() => progress.getAttempt(props.attemptId))
const series = computed(() => getQuizSeries(props.quizId))
const ratio = computed(() => (attempt.value && attempt.value.total ? attempt.value.score / attempt.value.total : 0))
const pct = computed(() => Math.round(ratio.value * 100))

const appreciation = computed(() => {
  const r = ratio.value
  if (r === 1) return { title: 'Sans faute !', text: 'Toutes les réponses sont justes. Tu maîtrises cette partie du cours.' }
  if (r >= 0.8) return { title: 'Très bon résultat', text: 'Quelques détails à revoir, mais l’essentiel est acquis.' }
  if (r >= 0.6) return { title: 'Bonne base', text: 'Les notions principales sont là. Revois les leçons indiquées ci-dessous, puis retente le quiz.' }
  if (r >= 0.4) return { title: 'À consolider', text: 'Reprends les leçons à retravailler et refais les exercices associés avant de recommencer.' }
  return { title: 'On reprend les bases', text: 'Relis les leçons concernées pas à pas : les exemples du cours t’aideront. Tu progresseras vite.' }
})

const rows = computed(() =>
  (attempt.value?.answers ?? []).map((a) => ({ a, q: getQuizQuestion(a.questionId) })).filter((x): x is { a: (typeof x)['a']; q: QuizQuestion } => !!x.q),
)

const toReview = computed(() => {
  const ids = new Set(rows.value.filter((r) => !r.a.correct).map((r) => r.q.lessonId))
  return [...ids].map((id) => getLesson(id)).filter((l) => !!l)
})

function display(q: QuizQuestion, given: number | string | null): string {
  if (given === null || given === '') return 'Pas de réponse'
  if (q.type === 'numerique') return `${given}${q.unit && !String(given).includes(q.unit) ? ' ' + q.unit : ''}`
  return q.options[Number(given)] ?? '—'
}
function expected(q: QuizQuestion): string {
  return q.type === 'numerique' ? `${formatNumber(q.answer, 4)}${q.unit ? ' ' + q.unit : ''}` : q.options[q.answer]
}
</script>

<template>
  <div v-if="attempt && series" class="mx-auto max-w-3xl">
    <section class="panel relative overflow-hidden p-6 text-center sm:p-10">
      <p class="font-semibold text-ink-soft">{{ series.title }}</p>
      <div class="mt-5 flex justify-center">
        <ProgressRing :value="ratio" :size="150" :stroke="12" :color="ratio >= 0.6 ? 'var(--capital)' : 'var(--interest)'" :label="`Score : ${pct} %`">
          <span class="num font-display text-4xl font-bold">{{ pct }}<span class="text-xl">%</span></span>
        </ProgressRing>
      </div>
      <h1 class="mt-5 text-3xl font-bold">{{ appreciation.title }}</h1>
      <p class="mx-auto mt-2 max-w-md text-ink-soft">{{ appreciation.text }}</p>

      <dl class="mx-auto mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-2xl bg-surface-2/70 p-3"><dt class="text-xs text-muted">Score</dt><dd class="num font-display text-xl font-bold">{{ attempt.score }}/{{ attempt.total }}</dd></div>
        <div class="rounded-2xl bg-ok-soft/70 p-3"><dt class="text-xs text-muted">Bonnes réponses</dt><dd class="num font-display text-xl font-bold text-ok">{{ attempt.score }}</dd></div>
        <div class="rounded-2xl bg-ko-soft/60 p-3"><dt class="text-xs text-muted">Erreurs</dt><dd class="num font-display text-xl font-bold text-ko">{{ attempt.total - attempt.score }}</dd></div>
        <div class="rounded-2xl bg-surface-2/70 p-3"><dt class="text-xs text-muted">{{ attempt.timed ? 'Temps (chrono)' : 'Temps' }}</dt><dd class="num font-display text-xl font-bold">{{ formatDuration(attempt.durationSec) }}</dd></div>
      </dl>
      <p class="mt-4 text-sm font-semibold text-brass">+{{ quizXp(attempt.score, attempt.total) }} XP</p>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <RouterLink :to="`/quiz/${series.id}`" class="btn-primary"><RotateCcw :size="16" />Recommencer le quiz</RouterLink>
        <RouterLink to="/" class="btn-ghost"><LayoutDashboard :size="16" />Retour au tableau de bord</RouterLink>
      </div>
    </section>

    <section v-if="toReview.length" class="mt-8 rounded-[20px] bg-brass-soft/60 p-6">
      <h2 class="text-xl font-semibold">Notions à retravailler</h2>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li v-for="l in toReview" :key="l!.id">
          <RouterLink :to="`/cours/${l!.id}`" class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold hover:border-ink/40"><BookOpen :size="15" />{{ l!.title }}</RouterLink>
        </li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="text-2xl font-semibold">Corrections détaillées</h2>
      <ol class="mt-4 space-y-3">
        <li v-for="(r, i) in rows" :key="r.q.id" class="panel p-5">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" :class="r.a.correct ? 'bg-ok' : r.a.given === null ? 'bg-muted' : 'bg-ko'">
              <Check v-if="r.a.correct" :size="16" /><Minus v-else-if="r.a.given === null" :size="16" /><X v-else :size="16" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="font-semibold"><span class="num text-muted">{{ i + 1 }}.</span> {{ r.q.prompt }}</p>
              <dl class="mt-2 grid gap-x-3 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                <dt class="text-muted">Ta réponse</dt>
                <dd class="num" :class="r.a.correct ? 'text-ok font-semibold' : 'text-ko font-semibold'">{{ display(r.q, r.a.given) }}</dd>
                <template v-if="!r.a.correct">
                  <dt class="text-muted">Bonne réponse</dt>
                  <dd class="num font-semibold text-ink">{{ expected(r.q) }}</dd>
                </template>
              </dl>
              <p class="mt-2 text-sm text-ink-soft">{{ r.q.explanation }}</p>
            </div>
          </div>
        </li>
      </ol>
    </section>
  </div>

  <div v-else class="mx-auto max-w-md py-20 text-center">
    <h1 class="text-3xl font-bold">Résultat introuvable</h1>
    <p class="mt-2 text-ink-soft">Cette tentative n'existe plus sur cet appareil.</p>
    <RouterLink to="/quiz" class="btn-primary mt-6">Voir les quiz</RouterLink>
  </div>
</template>
