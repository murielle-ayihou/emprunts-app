<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getQuizQuestion, getQuizSeries } from '@/data/quizzes'
import type { QuizAnswerRecord, QuizAttempt, QuizQuestion } from '@/types'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import { isNumberCorrect, parseNumber, shuffle } from '@/utils/answers'
import { playSound } from '@/services/sound'
import { formatDuration, formatNumber } from '@/utils/format'
import ProgressBar from '@/components/common/ProgressBar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import LevelBadge from '@/components/common/LevelBadge.vue'
import { ArrowLeft, ArrowRight, Check, Timer, X, Flag } from 'lucide-vue-next'

const props = defineProps<{ quizId: string }>()
const router = useRouter()
const progress = useProgressStore()
const settings = useSettingsStore()

const series = computed(() => getQuizSeries(props.quizId))

interface PlayQuestion {
  q: QuizQuestion
  /** Ordre d'affichage des options : indices de l'énoncé d'origine */
  order: number[]
}

const questions = ref<PlayQuestion[]>([])
const current = ref(0)
/** Réponse en cours : index d'origine (choix) ou texte (numérique) */
const drafts = reactive<Record<string, number | string | null>>({})
const validated = reactive<Record<string, boolean>>({})
const correctness = reactive<Record<string, boolean>>({})
const timed = settings.quizTimer
const elapsed = ref(0)
const finishing = ref(false)
const confirmOpen = ref(false)
const numError = ref('')
let timer: number | undefined
let startedAt = 0

onMounted(() => {
  const s = series.value
  if (!s) return
  questions.value = shuffle(s.questionIds)
    .map((id) => getQuizQuestion(id))
    .filter((q): q is QuizQuestion => !!q)
    .map((q) => ({
      q,
      order: q.type === 'qcm' ? shuffle(q.options.map((_, i) => i)) : q.type === 'vrai-faux' ? [0, 1] : [],
    }))
  for (const p of questions.value) drafts[p.q.id] = null
  startedAt = Date.now()
  timer = window.setInterval(() => {
    elapsed.value = Math.floor((Date.now() - startedAt) / 1000)
    if (timed && s && elapsed.value >= s.timeLimitSec) finish()
  }, 500)
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.clearInterval(timer)
  window.removeEventListener('keydown', onKey)
})

const cur = computed(() => questions.value[current.value])
const remaining = computed(() => (series.value ? Math.max(0, series.value.timeLimitSec - elapsed.value) : 0))
const answeredCount = computed(() => Object.values(validated).filter(Boolean).length)
const allValidated = computed(() => questions.value.length > 0 && answeredCount.value === questions.value.length)

function choose(idx: number) {
  if (!cur.value || validated[cur.value.q.id]) return
  drafts[cur.value.q.id] = idx
}

function validateCurrent() {
  const p = cur.value
  if (!p) return
  numError.value = ''
  const d = drafts[p.q.id]
  if (d === null || d === '') return
  let ok: boolean
  if (p.q.type === 'numerique') {
    if (parseNumber(String(d)) === null) {
      numError.value = 'Écris un nombre, par exemple 1 270,52.'
      return
    }
    ok = isNumberCorrect(String(d), p.q.answer, p.q.tolerance)
  } else ok = d === p.q.answer
  validated[p.q.id] = true
  correctness[p.q.id] = ok
  playSound(ok ? 'correct' : 'wrong')
}

function go(i: number) {
  numError.value = ''
  current.value = Math.max(0, Math.min(questions.value.length - 1, i))
}

function nextOrFinish() {
  if (current.value < questions.value.length - 1) go(current.value + 1)
  else requestFinish()
}

function requestFinish() {
  if (allValidated.value) finish()
  else confirmOpen.value = true
}

function finish() {
  if (finishing.value || !series.value) return
  finishing.value = true
  window.clearInterval(timer)
  confirmOpen.value = false
  const answers: QuizAnswerRecord[] = questions.value.map((p) => ({
    questionId: p.q.id,
    given: validated[p.q.id] ? drafts[p.q.id] : null,
    correct: !!correctness[p.q.id],
  }))
  const attempt: QuizAttempt = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    quizId: series.value.id,
    date: new Date().toISOString(),
    questionOrder: questions.value.map((p) => p.q.id),
    answers,
    score: answers.filter((a) => a.correct).length,
    total: answers.length,
    durationSec: Math.floor((Date.now() - startedAt) / 1000),
    timed,
  }
  progress.recordQuizAttempt(attempt, series.value.title)
  router.replace(`/quiz/${series.value.id}/resultats/${attempt.id}`)
}

function expectedText(p: PlayQuestion): string {
  if (p.q.type === 'numerique') return `${formatNumber(p.q.answer, 4)}${p.q.unit ? ' ' + p.q.unit : ''}`
  return p.q.options[p.q.answer]
}

function onKey(e: KeyboardEvent) {
  const p = cur.value
  if (!p || confirmOpen.value || p.q.type === 'numerique' || (e.target as HTMLElement)?.tagName === 'INPUT') return
  const n = Number(e.key)
  if (n >= 1 && n <= p.order.length) choose(p.order[n - 1])
}
</script>

<template>
  <div v-if="series" class="mx-auto max-w-2xl">
    <div class="flex items-center gap-3">
      <RouterLink to="/quiz" class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:text-ink" aria-label="Quitter le quiz"><X :size="18" /></RouterLink>
      <ProgressBar class="flex-1" :value="answeredCount / Math.max(1, questions.length)" :height="10" color="var(--capital)" label="Questions validées" />
      <span v-if="timed" class="num flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-semibold" :class="remaining < 60 ? 'bg-ko-soft text-ko' : 'bg-surface-2 text-ink'" role="timer" :aria-label="`Temps restant ${formatDuration(remaining)}`"><Timer :size="15" />{{ formatDuration(remaining) }}</span>
      <span v-else class="num shrink-0 text-sm text-muted">{{ formatDuration(elapsed) }}</span>
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
      <p class="font-semibold text-ink-soft">{{ series.title }}</p>
      <p class="num text-sm text-muted">Question {{ current + 1 }} sur {{ questions.length }}</p>
    </div>

    <!-- Pastilles de navigation -->
    <nav class="mt-3 flex flex-wrap gap-1.5" aria-label="Aller à une question">
      <button
        v-for="(p, i) in questions"
        :key="p.q.id"
        class="num h-8 w-8 rounded-lg text-xs font-bold transition"
        :class="[
          i === current ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : '',
          validated[p.q.id] ? (correctness[p.q.id] ? 'bg-ok text-white' : 'bg-ko text-white') : 'bg-surface-2 text-ink-soft hover:bg-line',
        ]"
        :aria-label="`Question ${i + 1}${validated[p.q.id] ? (correctness[p.q.id] ? ', juste' : ', fausse') : ''}`"
        :aria-current="i === current ? 'step' : undefined"
        @click="go(i)"
      >{{ i + 1 }}</button>
    </nav>

    <Transition name="slide" mode="out-in">
      <section v-if="cur" :key="cur.q.id" class="panel mt-5 p-6 sm:p-8" aria-live="polite">
        <LevelBadge :level="cur.q.level" />
        <h1 class="mt-3 text-2xl font-semibold leading-snug sm:text-[1.65rem]">{{ cur.q.prompt }}</h1>

        <div v-if="cur.q.type !== 'numerique'" class="mt-6 grid gap-2.5" role="radiogroup" :aria-label="cur.q.prompt">
          <button
            v-for="(origIdx, pos) in cur.order"
            :key="origIdx"
            role="radio"
            :aria-checked="drafts[cur.q.id] === origIdx"
            class="flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition"
            :class="[
              !validated[cur.q.id] && drafts[cur.q.id] === origIdx ? 'border-ink bg-surface-2' : '',
              !validated[cur.q.id] && drafts[cur.q.id] !== origIdx ? 'border-line hover:border-ink/40' : '',
              validated[cur.q.id] && origIdx === cur.q.answer ? 'border-ok bg-ok-soft' : '',
              validated[cur.q.id] && drafts[cur.q.id] === origIdx && origIdx !== cur.q.answer ? 'border-ko bg-ko-soft' : '',
              validated[cur.q.id] && drafts[cur.q.id] !== origIdx && origIdx !== cur.q.answer ? 'border-line opacity-55' : '',
            ]"
            :disabled="validated[cur.q.id]"
            @click="choose(origIdx)"
          >
            <span class="num grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-surface text-xs font-bold text-muted">{{ pos + 1 }}</span>
            <span class="flex-1">{{ cur.q.options[origIdx] }}</span>
            <Check v-if="validated[cur.q.id] && origIdx === cur.q.answer" :size="20" class="text-ok" />
            <X v-else-if="validated[cur.q.id] && drafts[cur.q.id] === origIdx" :size="20" class="text-ko" />
          </button>
        </div>

        <form v-else class="mt-6" @submit.prevent="validateCurrent">
          <label :for="`num-${cur.q.id}`" class="mb-1.5 block font-semibold">Ta réponse</label>
          <div class="relative max-w-xs">
            <input
              :id="`num-${cur.q.id}`"
              v-model="drafts[cur.q.id]"
              inputmode="decimal"
              autocomplete="off"
              class="field num pr-10 text-lg"
              :class="validated[cur.q.id] ? (correctness[cur.q.id] ? '!border-ok !bg-ok-soft' : '!border-ko !bg-ko-soft') : ''"
              :disabled="validated[cur.q.id]"
              placeholder="ex. 1 234,56"
            />
            <span v-if="cur.q.unit" class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">{{ cur.q.unit }}</span>
          </div>
          <p v-if="numError" class="mt-2 text-sm font-semibold text-ko" role="alert">{{ numError }}</p>
        </form>

        <Transition name="page">
          <div v-if="validated[cur.q.id]" class="mt-6 rounded-2xl p-4" :class="correctness[cur.q.id] ? 'bg-ok-soft/70' : 'bg-ko-soft/60'" role="status">
            <p class="font-semibold" :class="correctness[cur.q.id] ? 'text-ok' : 'text-ko'">{{ correctness[cur.q.id] ? 'Bonne réponse' : `Réponse attendue : ${expectedText(cur)}` }}</p>
            <p class="mt-1 text-sm text-ink-soft">{{ cur.q.explanation }}</p>
          </div>
        </Transition>

        <div class="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button class="btn-quiet" :disabled="current === 0" @click="go(current - 1)"><ArrowLeft :size="16" />Précédente</button>
          <div class="flex gap-2">
            <button v-if="!validated[cur.q.id]" class="btn-primary" :disabled="drafts[cur.q.id] === null || drafts[cur.q.id] === ''" @click="validateCurrent">Valider</button>
            <button v-else class="btn-primary" @click="nextOrFinish">
              <template v-if="current < questions.length - 1">Suivante<ArrowRight :size="16" /></template>
              <template v-else><Flag :size="16" />Voir mes résultats</template>
            </button>
          </div>
        </div>
      </section>
    </Transition>

    <div class="mt-5 flex justify-center">
      <button class="btn-quiet text-sm" @click="requestFinish"><Flag :size="15" />Terminer le quiz maintenant</button>
    </div>

    <ConfirmDialog
      :open="confirmOpen"
      title="Terminer le quiz ?"
      :message="`Tu as validé ${answeredCount} question${answeredCount > 1 ? 's' : ''} sur ${questions.length}. Les questions non validées compteront comme fausses.`"
      confirm-label="Terminer et voir le score"
      cancel-label="Continuer le quiz"
      @confirm="finish"
      @cancel="confirmOpen = false"
    />
  </div>

  <div v-else class="mx-auto max-w-md py-20 text-center">
    <h1 class="text-3xl font-bold">Quiz introuvable</h1>
    <RouterLink to="/quiz" class="btn-primary mt-6">Voir les quiz</RouterLink>
  </div>
</template>
