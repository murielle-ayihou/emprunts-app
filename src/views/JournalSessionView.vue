<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { drillSeries, getDrillSeries } from '@/data/journal/series'
import { accountLabel } from '@/data/journal/accounts'
import type { DrillSeries } from '@/data/journal/types'
import {
  correctAccounts, gradeCase, loadDrillStore, prepareCase, recordDrillAttempt,
  type CaseAnswer, type CaseGrade, type PreparedCase,
} from '@/services/journalDrill'
import { useProgressStore } from '@/stores/progress'
import { playSound } from '@/services/sound'
import { shuffle } from '@/utils/answers'
import { formatAmount } from '@/utils/format'
import ProgressBar from '@/components/common/ProgressBar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import JournalEntry from '@/components/course/JournalEntry.vue'
import { ArrowRight, Check, Lightbulb, RotateCcw, X, Flag } from 'lucide-vue-next'

const props = defineProps<{ seriesId: string }>()
const route = useRoute()
const progress = useProgressStore()

const mode = computed<'train' | 'exam'>(() => (route.query.mode === 'exam' ? 'exam' : 'train'))
const isMix = computed(() => props.seriesId === 'mix')
const series = computed<DrillSeries | undefined>(() => (isMix.value ? undefined : getDrillSeries(props.seriesId)))
const title = computed(() => (isMix.value ? 'Série au hasard' : series.value?.title ?? ''))
const showLabels = loadDrillStore().showLabels

const cases = ref<PreparedCase[]>([])
const answers = reactive<Record<string, CaseAnswer>>({})
const grades = reactive<Record<string, CaseGrade>>({})
const current = ref(0)
const finished = ref(false)
const confirmOpen = ref(false)
const hint = ref(false)
const error = ref('')
const gainedXp = ref(0)

function start() {
  let list: PreparedCase[]
  if (isMix.value) {
    const all = drillSeries.flatMap((s) => s.cases.map((c) => ({ s, c })))
    list = shuffle(all).slice(0, 10).map(({ s, c }) => prepareCase(s, c))
  } else if (series.value) {
    list = series.value.cases.map((c) => prepareCase(series.value as DrillSeries, c))
  } else list = []
  cases.value = list
  for (const k of Object.keys(answers)) delete answers[k]
  for (const k of Object.keys(grades)) delete grades[k]
  for (const p of list) answers[p.key] = { debit: [], credit: [], amounts: p.amountQs.map(() => null) }
  current.value = 0
  finished.value = false
  hint.value = false
  error.value = ''
  window.scrollTo({ top: 0 })
}
onMounted(start)

const cur = computed(() => cases.value[current.value])
const curAns = computed(() => (cur.value ? answers[cur.value.key] : undefined))
const curGrade = computed(() => (cur.value ? grades[cur.value.key] : undefined))
const locked = computed(() => mode.value === 'train' && !!curGrade.value)
const doneCount = computed(() => cases.value.filter((p) => isAnswered(p)).length)

function isAnswered(p: PreparedCase) {
  return mode.value === 'train' ? !!grades[p.key] : isComplete(p)
}
function isComplete(p: PreparedCase) {
  const a = answers[p.key]
  return !!a && a.debit.length > 0 && a.credit.length > 0 && a.amounts.every((x) => x !== null)
}

function toggle(side: 'debit' | 'credit', acc: string) {
  if (!curAns.value || locked.value) return
  const list = curAns.value[side]
  const i = list.indexOf(acc)
  if (i >= 0) list.splice(i, 1)
  else list.push(acc)
  error.value = ''
}
function pickAmount(qi: number, v: number) {
  if (!curAns.value || locked.value) return
  curAns.value.amounts[qi] = v
  error.value = ''
}

function validate() {
  const p = cur.value
  if (!p) return
  if (!isComplete(p)) {
    error.value = 'Choisis au moins un compte au débit, un au crédit, et un montant pour chaque question.'
    return
  }
  if (mode.value === 'train') {
    const g = gradeCase(p, answers[p.key])
    grades[p.key] = g
    playSound(g.points === g.total ? 'correct' : 'wrong')
    hint.value = false
  } else next()
}

function next() {
  error.value = ''
  hint.value = false
  if (current.value < cases.value.length - 1) {
    current.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else requestFinish()
}
function go(i: number) {
  error.value = ''
  hint.value = false
  current.value = i
}

function requestFinish() {
  if (cases.value.every((p) => isAnswered(p))) finish()
  else confirmOpen.value = true
}

function finish() {
  confirmOpen.value = false
  for (const p of cases.value) if (!grades[p.key]) grades[p.key] = gradeCase(p, answers[p.key])
  const points = cases.value.reduce((s, p) => s + grades[p.key].points, 0)
  const total = cases.value.reduce((s, p) => s + grades[p.key].total, 0)
  recordDrillAttempt({ seriesId: props.seriesId, title: title.value, mode: mode.value, date: new Date().toISOString(), points, total })
  gainedXp.value = progress.recordJournalSession(title.value, points, total)
  finished.value = true
  window.scrollTo({ top: 0 })
}

const totalPoints = computed(() => cases.value.reduce((s, p) => s + (grades[p.key]?.points ?? 0), 0))
const maxPoints = computed(() => cases.value.reduce((s, p) => s + (grades[p.key]?.total ?? 2 + p.amountQs.length), 0))
const note20 = computed(() => (maxPoints.value ? Math.round((totalPoints.value / maxPoints.value) * 200) / 10 : 0))

/* ─── Apparence des choix ─── */
function accClass(p: PreparedCase, side: 'debit' | 'credit', acc: string) {
  const a = answers[p.key]
  const chosen = a[side].includes(acc)
  if (!(mode.value === 'train' && grades[p.key])) return chosen ? 'border-ink bg-surface-2 ring-1 ring-ink' : 'border-line hover:border-ink/40'
  const good = correctAccounts(p.case, side === 'debit' ? 'D' : 'C').includes(acc)
  if (good && chosen) return 'border-ok bg-ok-soft'
  if (good) return 'border-ok border-dashed'
  if (chosen) return 'border-ko bg-ko-soft'
  return 'border-line opacity-50'
}
function amtClass(p: PreparedCase, qi: number, v: number) {
  const chosen = answers[p.key].amounts[qi] === v
  if (!(mode.value === 'train' && grades[p.key])) return chosen ? 'border-ink bg-surface-2 ring-1 ring-ink' : 'border-line hover:border-ink/40'
  const good = Math.abs(p.amountQs[qi].answer - v) < 0.005
  if (good && chosen) return 'border-ok bg-ok-soft'
  if (good) return 'border-ok border-dashed'
  if (chosen) return 'border-ko bg-ko-soft'
  return 'border-line opacity-50'
}
function dotClass(p: PreparedCase, i: number) {
  const ring = i === current.value && !finished.value ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''
  const g = grades[p.key]
  if (mode.value === 'train' && g) return [ring, g.points === g.total ? 'bg-ok text-white' : g.points === 0 ? 'bg-ko text-white' : 'bg-brass text-white']
  if (mode.value === 'exam' && isComplete(p)) return [ring, 'bg-deep text-on-deep']
  return [ring, 'bg-surface-2 text-ink-soft hover:bg-line']
}
function list(accs: string[]) {
  return accs.length ? accs.join(', ') : 'rien'
}
</script>

<template>
  <div v-if="cases.length" class="mx-auto max-w-3xl">
    <!-- Barre du haut -->
    <div class="flex items-center gap-3">
      <RouterLink to="/journal" class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:text-ink" aria-label="Quitter la séance"><X :size="18" /></RouterLink>
      <ProgressBar class="flex-1" :value="(finished ? cases.length : doneCount) / cases.length" :height="10" color="var(--capital)" label="Cas traités" />
      <span class="chip shrink-0" :class="mode === 'exam' ? 'bg-interest-soft text-interest' : 'bg-capital-soft text-capital'">{{ mode === 'exam' ? 'Contrôle' : 'Entraînement' }}</span>
    </div>

    <div class="mt-6 flex flex-wrap items-baseline justify-between gap-2">
      <p class="font-semibold text-ink-soft">{{ title }}</p>
      <p v-if="!finished" class="num text-sm text-muted">Cas {{ current + 1 }} sur {{ cases.length }}</p>
    </div>
    <p v-if="series && !finished" class="mt-1 text-sm text-muted">{{ series.context }}</p>

    <nav v-if="!finished" class="mt-3 flex flex-wrap gap-1.5" aria-label="Aller à un cas">
      <button v-for="(p, i) in cases" :key="p.key" class="num h-8 w-8 rounded-lg text-xs font-bold transition" :class="dotClass(p, i)" :aria-current="i === current ? 'step' : undefined" :aria-label="`Cas ${i + 1}`" @click="go(i)">{{ i + 1 }}</button>
    </nav>

    <!-- ─────────── Un cas ─────────── -->
    <Transition name="slide" mode="out-in">
      <section v-if="!finished && cur && curAns" :key="cur.key" class="panel mt-5 p-5 sm:p-7">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="chip bg-surface-2 text-ink-soft">{{ cur.company }}</span>
          <span class="num font-semibold text-muted">{{ cur.case.date }}</span>
        </div>
        <h1 class="mt-3 text-xl font-semibold leading-snug sm:text-[1.4rem]">{{ cur.case.text }}</h1>

        <button v-if="mode === 'train' && !curGrade" class="btn-quiet mt-3 text-sm" @click="hint = !hint"><Lightbulb :size="15" />{{ hint ? 'Masquer l’indice' : 'Indice : qui suis-je ?' }}</button>
        <p v-if="hint" class="mt-2 rounded-xl bg-brass-soft px-3 py-2 text-sm">Point de vue : <b>{{ cur.case.who }}</b>. Ensuite : quels comptes bougent, augmentent-ils ou diminuent-ils, et quel montant (HT, TVA ou TTC) ?</p>

        <!-- 1 et 2 : comptes -->
        <div v-for="side in (['debit', 'credit'] as const)" :key="side" class="mt-6">
          <h2 class="flex items-center gap-2 font-semibold">
            <span class="num grid h-6 w-6 place-items-center rounded-md text-xs text-white" :class="side === 'debit' ? 'bg-capital' : 'bg-interest'">{{ side === 'debit' ? 1 : 2 }}</span>
            Comptes au {{ side === 'debit' ? 'débit' : 'crédit' }}
            <span class="text-sm font-normal text-muted">(plusieurs réponses possibles)</span>
          </h2>
          <div class="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              v-for="acc in (side === 'debit' ? cur.debitOptions : cur.creditOptions)"
              :key="acc"
              role="checkbox"
              :aria-checked="curAns[side].includes(acc)"
              :disabled="locked"
              class="flex min-h-[3rem] flex-col items-start justify-center rounded-xl border-2 px-3 py-2 text-left transition"
              :class="accClass(cur, side, acc)"
              @click="toggle(side, acc)"
            >
              <span class="num font-bold">{{ acc }}</span>
              <span v-if="showLabels || locked" class="text-xs leading-tight text-muted">{{ accountLabel(acc) }}</span>
            </button>
          </div>
        </div>

        <!-- 3 et 4 : montants -->
        <div v-for="(q, qi) in cur.amountQs" :key="qi" class="mt-6">
          <h2 class="flex items-start gap-2 font-semibold">
            <span class="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-deep text-xs text-on-deep">{{ qi + 3 }}</span>
            {{ q.label }}
          </h2>
          <div class="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" :aria-label="q.label">
            <button
              v-for="v in q.options"
              :key="v"
              role="radio"
              :aria-checked="curAns.amounts[qi] === v"
              :disabled="locked"
              class="num rounded-xl border-2 px-3 py-2.5 text-left font-semibold transition"
              :class="amtClass(cur, qi, v)"
              @click="pickAmount(qi, v)"
            >{{ formatAmount(v) }} €</button>
          </div>
        </div>

        <p v-if="error" class="mt-4 text-sm font-semibold text-ko" role="alert">{{ error }}</p>

        <!-- Correction immédiate (entraînement) -->
        <div v-if="curGrade" class="mt-7 space-y-4" aria-live="polite">
          <div class="flex items-center gap-3 rounded-2xl px-4 py-3" :class="curGrade.points === curGrade.total ? 'bg-ok-soft' : 'bg-ko-soft'">
            <component :is="curGrade.points === curGrade.total ? Check : X" :size="20" :class="curGrade.points === curGrade.total ? 'text-ok' : 'text-ko'" />
            <p class="font-semibold">{{ curGrade.points === curGrade.total ? 'Tout juste !' : `${curGrade.points} réponse${curGrade.points > 1 ? 's' : ''} juste${curGrade.points > 1 ? 's' : ''} sur ${curGrade.total}` }}</p>
          </div>
          <p class="text-sm text-muted">Bordure verte pleine : bonne réponse choisie. Pointillés verts : bonne réponse oubliée. Rouge : erreur.</p>
          <JournalEntry :entry="cur.entry" title="L’écriture corrigée" />
          <div class="rounded-2xl border border-line bg-surface-2/60 p-4">
            <p class="font-semibold">Comment raisonner</p>
            <p class="mt-1 leading-relaxed text-ink-soft">{{ cur.case.why }}</p>
          </div>
        </div>

        <div class="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button v-if="mode === 'exam' && current > 0" class="btn-ghost" @click="go(current - 1)">Cas précédent</button>
          <span v-else />
          <button v-if="mode === 'train' && !curGrade" class="btn-primary" @click="validate"><Check :size="16" />Valider</button>
          <button v-else-if="mode === 'train'" class="btn-primary" @click="next">{{ current < cases.length - 1 ? 'Cas suivant' : 'Voir le bilan' }}<ArrowRight :size="16" /></button>
          <button v-else-if="current < cases.length - 1" class="btn-primary" @click="validate">Enregistrer et continuer<ArrowRight :size="16" /></button>
          <button v-else class="btn-primary" @click="requestFinish"><Flag :size="16" />Terminer le contrôle</button>
        </div>
      </section>
    </Transition>

    <!-- ─────────── Bilan ─────────── -->
    <section v-if="finished" class="mt-6">
      <div class="panel p-6 text-center sm:p-8">
        <p class="text-sm font-semibold text-muted">{{ mode === 'exam' ? 'Note du contrôle' : 'Bilan de l’entraînement' }}</p>
        <p class="num mt-2 text-5xl font-bold">{{ String(note20).replace('.', ',') }}<span class="text-2xl text-muted"> / 20</span></p>
        <p class="mt-2 text-ink-soft">{{ totalPoints }} réponses justes sur {{ maxPoints }}<span v-if="gainedXp">, +{{ gainedXp }} XP</span></p>
        <div class="mt-5 flex flex-wrap justify-center gap-3">
          <button class="btn-primary" @click="start"><RotateCcw :size="16" />Recommencer</button>
          <RouterLink to="/journal" class="btn-ghost">Autres séries</RouterLink>
        </div>
      </div>

      <h2 class="mt-10 text-2xl font-semibold">Correction cas par cas</h2>
      <div class="mt-4 space-y-4">
        <details v-for="(p, i) in cases" :key="p.key" class="panel group p-5" :open="grades[p.key] && grades[p.key].points < grades[p.key].total">
          <summary class="flex cursor-pointer list-none items-start gap-3">
            <span class="num grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white" :class="grades[p.key]?.points === grades[p.key]?.total ? 'bg-ok' : grades[p.key]?.points === 0 ? 'bg-ko' : 'bg-brass'">{{ i + 1 }}</span>
            <span class="flex-1">
              <span class="block text-sm text-muted">{{ p.company }} · {{ p.case.date }} · {{ grades[p.key]?.points }}/{{ grades[p.key]?.total }}</span>
              <span class="block font-semibold leading-snug">{{ p.case.text }}</span>
            </span>
          </summary>
          <div class="mt-4 space-y-3 text-sm">
            <ul class="space-y-1">
              <li :class="grades[p.key]?.debit ? 'text-ok' : 'text-ko'"><b>Débit :</b> tu as choisi {{ list(answers[p.key].debit) }}<span v-if="!grades[p.key]?.debit"> ; attendu {{ list(correctAccounts(p.case, 'D')) }}</span></li>
              <li :class="grades[p.key]?.credit ? 'text-ok' : 'text-ko'"><b>Crédit :</b> tu as choisi {{ list(answers[p.key].credit) }}<span v-if="!grades[p.key]?.credit"> ; attendu {{ list(correctAccounts(p.case, 'C')) }}</span></li>
              <li v-for="(q, qi) in p.amountQs" :key="qi" :class="grades[p.key]?.amounts[qi] ? 'text-ok' : 'text-ko'">
                <b>{{ q.label }} :</b> {{ answers[p.key].amounts[qi] === null ? 'pas de réponse' : formatAmount(answers[p.key].amounts[qi] as number) + ' €' }}<span v-if="!grades[p.key]?.amounts[qi]"> ; attendu {{ formatAmount(q.answer) }} €</span>
              </li>
            </ul>
            <JournalEntry :entry="p.entry" />
            <p class="leading-relaxed text-ink-soft">{{ p.case.why }}</p>
          </div>
        </details>
      </div>
    </section>

    <ConfirmDialog
      :open="confirmOpen"
      title="Terminer maintenant ?"
      message="Certains cas ne sont pas complets. Ils compteront comme faux."
      confirm-label="Terminer"
      cancel-label="Continuer"
      @confirm="finish"
      @cancel="confirmOpen = false"
    />
  </div>
  <div v-else class="mx-auto max-w-xl py-16 text-center">
    <p class="text-lg">Cette série n’existe pas.</p>
    <RouterLink to="/journal" class="btn-primary mt-5 inline-flex">Revenir à l’entraînement</RouterLink>
  </div>
</template>
