<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLesson, lessons } from '@/data/lessons'
import { getChapter } from '@/data/chapters'
import { exercises } from '@/data/exercises'
import { useProgressStore } from '@/stores/progress'
import LessonBlock from '@/components/course/LessonBlock.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, PencilLine, Undo2 } from 'lucide-vue-next'

const props = defineProps<{ lessonId: string }>()
const router = useRouter()
const progress = useProgressStore()

const lesson = computed(() => getLesson(props.lessonId))
const chapter = computed(() => (lesson.value ? getChapter(lesson.value.chapterId) : undefined))
const index = computed(() => lessons.findIndex((l) => l.id === props.lessonId))
const prev = computed(() => (index.value > 0 ? lessons[index.value - 1] : null))
const next = computed(() => (index.value >= 0 && index.value < lessons.length - 1 ? lessons[index.value + 1] : null))
const done = computed(() => progress.isLessonCompleted(props.lessonId))
const relatedExercises = computed(() => exercises.filter((e) => e.lessonId === props.lessonId).length)
const posInChapter = computed(() => (chapter.value ? chapter.value.lessonIds.indexOf(props.lessonId) + 1 : 0))

const reading = ref(0)
const blockEls = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  reading.value = max > 0 ? Math.min(1, h.scrollTop / max) : 1
}

onMounted(async () => {
  if (!lesson.value) return
  const resumeAt = progress.state.lastPosition?.lessonId === props.lessonId ? progress.state.lastPosition.blockIndex : 0
  progress.visitLesson(props.lessonId)
  await nextTick()
  // Reprise exacte : on revient au dernier bloc consulté
  if (resumeAt > 0 && !location.hash) document.getElementById(`bloc-${resumeAt}`)?.scrollIntoView({ block: 'start' })
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const idx = Number((e.target as HTMLElement).dataset.index)
          if (!Number.isNaN(idx)) progress.setPosition(props.lessonId, idx)
        }
      }
    },
    { rootMargin: '-35% 0px -60% 0px' },
  )
  blockEls.value.forEach((el) => observer?.observe(el))
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})

function complete() {
  progress.completeLesson(props.lessonId)
}
function completeAndNext() {
  complete()
  if (next.value) router.push(`/cours/${next.value.id}`)
  else router.push('/cours')
}
</script>

<template>
  <div v-if="lesson && chapter" class="mx-auto max-w-[52rem]">
    <div class="sticky top-[57px] z-30 -mx-4 mb-4 bg-paper/85 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <ProgressBar :value="reading" :height="3" color="var(--brass-bright)" label="Progression de lecture" />
    </div>

    <RouterLink to="/cours" class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"><ArrowLeft :size="16" />Tous les chapitres</RouterLink>

    <header class="mt-5">
      <p class="text-sm font-semibold text-capital">Chapitre {{ chapter.number }}, leçon {{ posInChapter }} sur {{ chapter.lessonIds.length }}</p>
      <h1 class="mt-2 text-4xl font-bold sm:text-[2.75rem]">{{ lesson.title }}</h1>
      <p class="mt-3 text-lg text-ink-soft">{{ lesson.summary }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span class="flex items-center gap-1.5"><Clock :size="15" />{{ lesson.minutes }} min</span>
        <span class="flex items-center gap-1.5"><FileText :size="15" />Support {{ lesson.sourcePage }}</span>
        <span v-if="done" class="flex items-center gap-1.5 font-semibold text-capital"><CheckCircle2 :size="15" />Terminée</span>
      </div>
    </header>

    <article class="mt-8 space-y-6">
      <div v-for="(b, i) in lesson.blocks" :id="`bloc-${i}`" :key="i" ref="blockEls" :data-index="i" class="scroll-mt-24">
        <LessonBlock :block="b" />
      </div>
    </article>

    <section class="mt-10 rounded-[24px] border border-line bg-surface p-6 text-center">
      <template v-if="!done">
        <p class="font-display text-xl font-semibold">Tu as tout compris ?</p>
        <p class="mt-1 text-ink-soft">Marque la leçon comme terminée pour gagner 20 XP et suivre ta progression.</p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <button class="btn-primary" @click="completeAndNext"><CheckCircle2 :size="18" />Terminer{{ next ? ' et continuer' : ' la leçon' }}</button>
          <button v-if="next" class="btn-ghost" @click="complete">Terminer seulement</button>
        </div>
      </template>
      <template v-else>
        <p class="flex items-center justify-center gap-2 font-display text-xl font-semibold text-capital"><CheckCircle2 :size="22" />Leçon terminée</p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <RouterLink v-if="relatedExercises" :to="{ path: '/exercices', query: { lecon: lesson.id } }" class="btn-brass"><PencilLine :size="17" />S'entraîner ({{ relatedExercises }} exercice{{ relatedExercises > 1 ? 's' : '' }})</RouterLink>
          <button class="btn-quiet" @click="progress.uncompleteLesson(lesson.id)"><Undo2 :size="16" />Marquer comme non terminée</button>
        </div>
      </template>
    </section>

    <nav class="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Leçons précédente et suivante">
      <RouterLink v-if="prev" :to="`/cours/${prev.id}`" class="panel flex items-center gap-3 p-4 transition hover:border-ink/30">
        <ArrowLeft :size="18" class="shrink-0 text-muted" />
        <span class="min-w-0"><span class="block text-xs text-muted">Précédente</span><span class="block truncate font-semibold">{{ prev.title }}</span></span>
      </RouterLink>
      <span v-else />
      <RouterLink v-if="next" :to="`/cours/${next.id}`" class="panel flex items-center justify-end gap-3 p-4 text-right transition hover:border-ink/30">
        <span class="min-w-0"><span class="block text-xs text-muted">Suivante</span><span class="block truncate font-semibold">{{ next.title }}</span></span>
        <ArrowRight :size="18" class="shrink-0 text-muted" />
      </RouterLink>
    </nav>
  </div>

  <div v-else class="mx-auto max-w-md py-20 text-center">
    <h1 class="text-3xl font-bold">Leçon introuvable</h1>
    <p class="mt-2 text-ink-soft">Cette leçon n'existe pas ou a changé d'adresse.</p>
    <RouterLink to="/cours" class="btn-primary mt-6">Voir tout le cours</RouterLink>
  </div>
</template>
