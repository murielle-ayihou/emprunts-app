<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Exercise } from '@/types'
import { useProgressStore } from '@/stores/progress'
import { isNumberCorrect, isTextCorrect, parseNumber } from '@/utils/answers'
import { formatNumber } from '@/utils/format'
import RichText from '@/components/common/RichText.vue'
import LevelBadge from '@/components/common/LevelBadge.vue'
import { Check, X, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-vue-next'
import { getLesson } from '@/data/lessons'

const props = defineProps<{ exercise: Exercise }>()
const progress = useProgressStore()

const KIND_LABELS: Record<Exercise['kind'], string> = {
  qcm: 'QCM',
  'vrai-faux': 'Vrai / faux',
  numerique: 'Réponse numérique',
  calcul: 'Calcul',
  completer: 'À compléter',
  probleme: 'Problème',
  comprehension: 'Compréhension',
}

const answers = reactive<Record<string, string>>({})
const checked = ref(false)
const perInput = ref<Record<string, boolean>>({})
const shake = ref(false)
const gained = ref(0)
const formError = ref('')

const result = computed(() => progress.state.exerciseResults[props.exercise.id])
const allCorrect = computed(() => checked.value && Object.values(perInput.value).every(Boolean))

function inputId(id: string) {
  return `${props.exercise.id}-${id}`
}

function validate() {
  formError.value = ''
  const missing = props.exercise.inputs.filter((i) => !String(answers[i.id] ?? '').trim())
  if (missing.length) {
    formError.value = props.exercise.inputs.length > 1 ? 'Réponds à toutes les questions avant de valider.' : 'Saisis ou choisis une réponse avant de valider.'
    return
  }
  const bad = props.exercise.inputs.filter((i) => i.type === 'number' && parseNumber(answers[i.id]) === null)
  if (bad.length) {
    formError.value = 'Un montant n’est pas lisible. Écris seulement des chiffres, par exemple 11 445,71.'
    return
  }
  const res: Record<string, boolean> = {}
  for (const inp of props.exercise.inputs) {
    const v = answers[inp.id] ?? ''
    if (inp.type === 'choice') res[inp.id] = Number(v) === inp.answer
    else if (inp.type === 'number') res[inp.id] = isNumberCorrect(v, inp.answer, inp.tolerance)
    else res[inp.id] = isTextCorrect(v, inp.answers)
  }
  perInput.value = res
  checked.value = true
  const ok = Object.values(res).every(Boolean)
  gained.value = progress.recordExercise(props.exercise.id, ok, { ...answers })
  if (!ok) {
    shake.value = true
    setTimeout(() => (shake.value = false), 400)
  }
}

function retry() {
  for (const k of Object.keys(answers)) delete answers[k]
  checked.value = false
  perInput.value = {}
  gained.value = 0
  progress.resetExercise(props.exercise.id)
}

function expected(inp: Exercise['inputs'][number]): string {
  if (inp.type === 'choice') return inp.options[inp.answer]
  if (inp.type === 'number') return `${formatNumber(inp.answer, 4)}${inp.unit ? ' ' + inp.unit : ''}`
  return inp.answers[0]
}
</script>

<template>
  <article class="panel p-5 sm:p-6" :aria-labelledby="`${exercise.id}-title`">
    <div class="flex flex-wrap items-center gap-2">
      <LevelBadge :level="exercise.level" />
      <span class="chip bg-surface-2 text-ink-soft">{{ KIND_LABELS[exercise.kind] }}</span>
      <span class="chip bg-surface-2 text-ink-soft">{{ exercise.notion }}</span>
      <span v-if="exercise.source" class="chip border border-line text-muted">{{ exercise.source }}</span>
      <span v-if="result?.correct" class="chip ml-auto bg-ok-soft text-ok"><CheckCircle2 :size="13" />Réussi</span>
      <span v-else-if="result" class="chip ml-auto bg-ko-soft text-ko">À retravailler</span>
    </div>
    <h3 :id="`${exercise.id}-title`" class="mt-3 text-xl font-semibold">{{ exercise.title }}</h3>
    <RichText :text="exercise.statement" class="mt-2 text-[1.02rem] text-ink-soft" />

    <form class="mt-5 space-y-4" :class="{ 'anim-shake': shake }" novalidate @submit.prevent="validate">
      <div v-for="inp in exercise.inputs" :key="inp.id">
        <!-- Choix -->
        <fieldset v-if="inp.type === 'choice'">
          <legend v-if="inp.prompt" class="mb-2 font-semibold">{{ inp.prompt }}</legend>
          <legend v-else class="sr-only">Choisis une réponse</legend>
          <div class="grid gap-2" :class="inp.options.length <= 2 ? 'grid-cols-2' : 'sm:grid-cols-2'">
            <label
              v-for="(o, i) in inp.options"
              :key="i"
              class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus"
              :class="[
                !checked && answers[inp.id] === String(i) ? 'border-ink bg-surface-2' : '',
                !checked && answers[inp.id] !== String(i) ? 'border-line hover:border-ink/40 hover:bg-surface-2/60' : '',
                checked && i === inp.answer ? 'border-ok bg-ok-soft' : '',
                checked && answers[inp.id] === String(i) && i !== inp.answer ? 'border-ko bg-ko-soft' : '',
                checked && answers[inp.id] !== String(i) && i !== inp.answer ? 'border-line opacity-60' : '',
                checked ? 'cursor-default' : '',
              ]"
            >
              <input v-model="answers[inp.id]" type="radio" class="sr-only" :name="inputId(inp.id)" :value="String(i)" :disabled="checked" />
              <span class="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2" :class="answers[inp.id] === String(i) ? 'border-ink' : 'border-line'">
                <span v-if="answers[inp.id] === String(i)" class="h-2.5 w-2.5 rounded-full bg-ink" />
              </span>
              <span class="flex-1">{{ o }}</span>
              <Check v-if="checked && i === inp.answer" :size="18" class="text-ok" />
              <X v-else-if="checked && answers[inp.id] === String(i)" :size="18" class="text-ko" />
            </label>
          </div>
        </fieldset>

        <!-- Nombre ou texte -->
        <div v-else>
          <label :for="inputId(inp.id)" class="mb-1.5 block font-semibold">{{ inp.label }}</label>
          <div class="flex items-center gap-2">
            <div class="relative w-full max-w-xs">
              <input
                :id="inputId(inp.id)"
                v-model="answers[inp.id]"
                :inputmode="inp.type === 'number' ? 'decimal' : 'text'"
                autocomplete="off"
                class="field num pr-10"
                :class="checked ? (perInput[inp.id] ? '!border-ok !bg-ok-soft' : '!border-ko !bg-ko-soft') : ''"
                :disabled="checked"
                :placeholder="inp.type === 'number' ? 'ex. 1 234,56' : 'Ta réponse'"
                :aria-invalid="checked && !perInput[inp.id]"
              />
              <span v-if="inp.type === 'number' && inp.unit" class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">{{ inp.unit }}</span>
            </div>
            <Check v-if="checked && perInput[inp.id]" :size="20" class="text-ok" aria-label="Correct" />
            <X v-else-if="checked" :size="20" class="text-ko" aria-label="Incorrect" />
          </div>
          <p v-if="checked && !perInput[inp.id]" class="mt-1.5 text-sm text-ink-soft">Réponse attendue : <strong class="num text-ink">{{ expected(inp) }}</strong></p>
        </div>
      </div>

      <p v-if="formError" class="text-sm font-semibold text-ko" role="alert">{{ formError }}</p>

      <div v-if="!checked" class="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" class="btn-primary">Valider ma réponse</button>
        <span v-if="exercise.inputs.some((i) => i.type === 'number')" class="text-xs text-muted">Virgule ou point acceptés. Arrondis au centime.</span>
      </div>
    </form>

    <Transition name="page">
      <div v-if="checked" class="mt-5 rounded-2xl p-5" :class="allCorrect ? 'bg-ok-soft/70' : 'bg-ko-soft/60'" role="status" aria-live="polite">
        <p class="flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
          <Check v-if="allCorrect" :size="22" class="text-ok" />
          <X v-else :size="22" class="text-ko" />
          {{ allCorrect ? 'Bonne réponse' : 'Ce n’est pas encore ça' }}
          <span v-if="gained" class="chip bg-brass-soft text-brass">+{{ gained }} XP</span>
        </p>
        <p class="mt-2 text-ink-soft"><RichText :text="exercise.explanation" tag="span" /></p>
        <div v-if="exercise.steps?.length" class="mt-4">
          <p class="text-sm font-semibold">Le calcul étape par étape</p>
          <ol class="mt-2 space-y-1.5 border-l-2 border-ink/20 pl-4 text-[0.95rem] text-ink-soft">
            <li v-for="(s, i) in exercise.steps" :key="i"><RichText :text="s" tag="span" /></li>
          </ol>
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
          <button class="btn-ghost" @click="retry"><RotateCcw :size="16" />Recommencer</button>
          <RouterLink :to="`/cours/${exercise.lessonId}`" class="btn-quiet"><BookOpen :size="16" />Revoir la leçon « {{ getLesson(exercise.lessonId)?.title }} »</RouterLink>
        </div>
      </div>
    </Transition>
  </article>
</template>
