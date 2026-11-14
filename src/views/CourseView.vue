<script setup lang="ts">
import { chapters } from '@/data/chapters'
import { getLesson } from '@/data/lessons'
import { exercises } from '@/data/exercises'
import { useProgressStore } from '@/stores/progress'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { CheckCircle2, Circle, CircleDot, Clock } from 'lucide-vue-next'

const progress = useProgressStore()
function status(id: string) {
  if (progress.isLessonCompleted(id)) return 'done'
  if (progress.state.lessonsVisited.includes(id)) return 'started'
  return 'todo'
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <header>
      <h1 class="text-4xl font-bold sm:text-5xl">Les emprunts bancaires</h1>
      <p class="mt-3 max-w-2xl text-lg text-ink-soft">Le cours complet en 4 chapitres et {{ progress.totalLessons }} leçons, fidèle au support « Titre 4 ». Avance dans l'ordre : chaque leçon s'appuie sur la précédente.</p>
      <p class="mt-2 text-sm text-muted">{{ progress.completedLessonCount }} leçon{{ progress.completedLessonCount > 1 ? 's' : '' }} terminée{{ progress.completedLessonCount > 1 ? 's' : '' }} sur {{ progress.totalLessons }}</p>
    </header>

    <ol class="mt-10 space-y-6">
      <li v-for="ch in chapters" :key="ch.id" class="panel overflow-hidden">
        <div class="flex items-start gap-4 p-5 sm:p-6">
          <ProgressRing :value="progress.chapterProgress(ch.id)" :size="58" :label="`Chapitre ${ch.number} : ${Math.round(progress.chapterProgress(ch.id) * 100)} % terminé`">
            <span class="font-display text-xl font-bold">{{ ch.number }}</span>
          </ProgressRing>
          <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-semibold">{{ ch.title }}</h2>
            <p class="text-ink-soft">{{ ch.subtitle }}</p>
            <p class="mt-1 text-xs text-muted">Support {{ ch.sourcePages }}, {{ exercises.filter((e) => e.chapterId === ch.id).length }} exercices</p>
          </div>
        </div>
        <details class="group border-t border-line px-5 py-3 sm:px-6">
          <summary class="cursor-pointer text-sm font-semibold text-ink-soft hover:text-ink">Objectifs du chapitre</summary>
          <ul class="mt-2 space-y-1 pb-1 text-sm text-ink-soft">
            <li v-for="o in ch.objectives" :key="o" class="flex gap-2"><span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-capital" />{{ o }}</li>
          </ul>
        </details>
        <ul class="border-t border-line">
          <li v-for="lid in ch.lessonIds" :key="lid" class="border-b border-line last:border-b-0">
            <RouterLink :to="`/cours/${lid}`" class="flex items-center gap-3 px-5 py-3.5 transition hover:bg-surface-2/70 sm:px-6">
              <CheckCircle2 v-if="status(lid) === 'done'" :size="20" class="shrink-0 text-capital" aria-label="Terminée" />
              <CircleDot v-else-if="status(lid) === 'started'" :size="20" class="shrink-0 text-brass" aria-label="Commencée" />
              <Circle v-else :size="20" class="shrink-0 text-line" aria-label="À faire" />
              <span class="min-w-0 flex-1">
                <span class="block font-semibold text-ink">{{ getLesson(lid)?.title }}</span>
                <span class="block truncate text-sm text-muted">{{ getLesson(lid)?.summary }}</span>
              </span>
              <span class="hidden shrink-0 items-center gap-1 text-xs text-muted sm:flex"><Clock :size="13" />{{ getLesson(lid)?.minutes }} min</span>
            </RouterLink>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</template>
