<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { exercises } from '@/data/exercises'
import { chapters } from '@/data/chapters'
import { getLesson } from '@/data/lessons'
import { useProgressStore } from '@/stores/progress'
import type { Level } from '@/types'
import ExerciseCard from '@/components/exercises/ExerciseCard.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { Flame, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()

type StatusFilter = 'tous' | 'a-faire' | 'a-retravailler' | 'reussis'

const chapter = ref<string>((route.query.chapitre as string) ?? 'tous')
const level = ref<Level | 'tous'>((route.query.niveau as Level) ?? 'tous')
const status = ref<StatusFilter>((route.query.statut as StatusFilter) ?? 'tous')
const lesson = ref<string | null>((route.query.lecon as string) ?? null)

watch([chapter, level, status, lesson], () => {
  const q: Record<string, string> = {}
  if (chapter.value !== 'tous') q.chapitre = chapter.value
  if (level.value !== 'tous') q.niveau = level.value
  if (status.value !== 'tous') q.statut = status.value
  if (lesson.value) q.lecon = lesson.value
  router.replace({ query: q })
})

const filtered = computed(() =>
  exercises.filter((e) => {
    if (lesson.value && e.lessonId !== lesson.value) return false
    if (chapter.value !== 'tous' && e.chapterId !== chapter.value) return false
    if (level.value !== 'tous' && e.level !== level.value) return false
    const r = progress.state.exerciseResults[e.id]
    if (status.value === 'a-faire' && r) return false
    if (status.value === 'reussis' && !r?.correct) return false
    if (status.value === 'a-retravailler' && !(r && (!r.correct || !r.firstTryCorrect))) return false
    return true
  }),
)

const toReview = computed(() => exercises.filter((e) => {
  const r = progress.state.exerciseResults[e.id]
  return r && (!r.correct || !r.firstTryCorrect)
}).length)

function startChallenge() {
  lesson.value = null
  chapter.value = 'tous'
  level.value = 'tous'
  status.value = 'a-retravailler'
}

const levels: { id: Level | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous niveaux' },
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'avance', label: 'Avancé' },
]
const statuses: { id: StatusFilter; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'a-faire', label: 'À faire' },
  { id: 'a-retravailler', label: 'À retravailler' },
  { id: 'reussis', label: 'Réussis' },
]
</script>

<template>
  <div class="mx-auto max-w-[46rem]">
    <header>
      <h1 class="text-4xl font-bold sm:text-5xl">Exercices</h1>
      <p class="mt-3 text-lg text-ink-soft">{{ exercises.length }} exercices liés aux leçons, du plus simple au plus exigeant. Chaque correction détaille le calcul.</p>
      <div class="mt-5 flex items-center gap-4">
        <ProgressBar class="max-w-xs" :value="progress.exercisesCorrect / exercises.length" label="Exercices réussis" />
        <span class="num shrink-0 text-sm text-muted">{{ progress.exercisesCorrect }} / {{ exercises.length }} réussis</span>
      </div>
    </header>

    <section v-if="toReview > 0 && status !== 'a-retravailler'" class="mt-6 flex flex-wrap items-center gap-4 rounded-[20px] bg-interest-soft/70 p-5">
      <Flame :size="26" class="text-interest" />
      <div class="min-w-0 flex-1">
        <p class="font-semibold">Défi de révision</p>
        <p class="text-sm text-ink-soft">{{ toReview }} exercice{{ toReview > 1 ? 's' : '' }} raté{{ toReview > 1 ? 's' : '' }} au premier essai. Refais-les pour consolider.</p>
      </div>
      <button class="btn-primary" @click="startChallenge">Relever le défi</button>
    </section>

    <div class="mt-6 space-y-3">
      <div v-if="lesson" class="flex flex-wrap items-center gap-2 text-sm">
        <span class="text-muted">Leçon :</span>
        <span class="chip bg-deep text-on-deep !py-1">{{ getLesson(lesson)?.title }}<button class="ml-1" aria-label="Retirer le filtre de leçon" @click="lesson = null"><X :size="14" /></button></span>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer par chapitre">
        <button class="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition" :class="chapter === 'tous' ? 'border-ink bg-deep text-on-deep' : 'border-line bg-surface text-ink-soft hover:border-ink/40'" :aria-pressed="chapter === 'tous'" @click="chapter = 'tous'">Tous les chapitres</button>
        <button v-for="c in chapters" :key="c.id" class="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition" :class="chapter === c.id ? 'border-ink bg-deep text-on-deep' : 'border-line bg-surface text-ink-soft hover:border-ink/40'" :aria-pressed="chapter === c.id" @click="chapter = c.id">{{ c.number }}. {{ c.title }}</button>
      </div>
      <div class="flex flex-wrap gap-3">
        <label class="sr-only" for="f-level">Niveau</label>
        <select id="f-level" v-model="level" class="field !w-auto !py-2 text-sm">
          <option v-for="l in levels" :key="l.id" :value="l.id">{{ l.label }}</option>
        </select>
        <label class="sr-only" for="f-status">Statut</label>
        <select id="f-status" v-model="status" class="field !w-auto !py-2 text-sm">
          <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
        <span class="self-center text-sm text-muted">{{ filtered.length }} exercice{{ filtered.length > 1 ? 's' : '' }}</span>
      </div>
    </div>

    <TransitionGroup tag="div" name="page" class="mt-6 space-y-5">
      <ExerciseCard v-for="e in filtered" :key="e.id" :exercise="e" />
    </TransitionGroup>

    <div v-if="!filtered.length" class="mt-10 rounded-[20px] border border-dashed border-line p-8 text-center">
      <p class="font-semibold">Aucun exercice ne correspond à ces filtres.</p>
      <p class="mt-1 text-ink-soft">{{ status === 'a-retravailler' ? 'Tout est réussi du premier coup. Bravo !' : 'Élargis la sélection pour en voir plus.' }}</p>
      <button class="btn-ghost mt-4" @click="startChallenge(); status = 'tous'">Afficher tous les exercices</button>
    </div>
  </div>
</template>
