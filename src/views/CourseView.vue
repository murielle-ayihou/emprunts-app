<script setup lang="ts">
import { computed } from 'vue'
import { chapters, parts, subjects } from '@/data/chapters'
import { getLesson } from '@/data/lessons'
import { exercises } from '@/data/exercises'
import { useProgressStore } from '@/stores/progress'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { vTilt } from '@/composables/tilt'
import { defineAsyncComponent } from 'vue'
const Walker3D = defineAsyncComponent(() => import('@/components/three/Walker3D.vue'))
import KineticTitle from '@/components/common/KineticTitle.vue'
import { vReveal } from '@/composables/reveal'
import { CheckCircle2, Circle, CircleDot, Clock, FileText, Info } from 'lucide-vue-next'

const progress = useProgressStore()
const subject = subjects[0]
const currentPartId = computed(() => (progress.nextLesson ? chapters.find((c) => c.id === progress.nextLesson!.chapterId)?.partId : null))
const chaptersOf = (pid: string) => chapters.filter((c) => c.partId === pid)
const exCount = (cid: string) => exercises.filter((e) => e.chapterId === cid).length
const lessonCount = (pid: string) => chaptersOf(pid).reduce((s, c) => s + c.lessonIds.length, 0)

function status(id: string) {
  if (progress.isLessonCompleted(id)) return 'done'
  if (progress.state.lessonsVisited.includes(id)) return 'started'
  return 'todo'
}
function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el instanceof HTMLDetailsElement) el.open = true
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <header>
      <p class="font-semibold text-capital">{{ subject.level }}</p>
      <KineticTitle class="mt-1" :text="subject.title" />
      <p class="mt-3 max-w-2xl text-lg text-ink-soft">{{ parts.length }} Titres, {{ chapters.length }} chapitres et {{ progress.totalLessons }} leçons, fidèles à tes supports de cours et à tes TD. Avance dans l’ordre : chaque leçon s’appuie sur la précédente.</p>
    </header>

    <div class="sticky top-[57px] z-30 -mx-4 mt-6 border-b border-line/60 bg-paper/85 px-4 pt-1 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <Walker3D mode="scroll" :height="58" label="Bonhomme en 3D : il avance quand tu fais défiler le programme" />
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(p, pi) in parts"
        :key="p.id"
        v-tilt
        v-reveal="pi * 90"
        role="link"
        tabindex="0"
        :aria-label="`Titre ${p.number} : ${p.title}, ${Math.round(progress.partProgress(p.id) * 100)} % terminé. Aller à la liste des chapitres.`"
        @keydown.enter="scrollTo(`titre-${p.number}`)"
        class="part-card group relative flex min-h-[17rem] cursor-pointer select-none flex-col overflow-hidden rounded-[22px] border p-5 text-left"
        :class="p.id === currentPartId ? 'border-deep bg-deep text-on-deep' : 'border-line bg-surface'"
        @click="scrollTo(`titre-${p.number}`)"
      >
        <span class="font-display text-[3.5rem] font-bold leading-none opacity-90" :class="p.id === currentPartId ? 'text-brass-bright' : 'text-ink/15'">{{ p.number }}</span>
        <span class="mt-3 font-display text-lg font-semibold leading-snug">{{ p.title }}</span>
        <span class="mt-1 text-sm opacity-75">{{ lessonCount(p.id) }} leçons</span>
        <span class="num absolute right-5 top-5 text-sm font-semibold opacity-70">{{ Math.round(progress.partProgress(p.id) * 100) }} %</span>
        <span v-if="p.id === currentPartId" class="mt-2 text-xs font-semibold text-brass-bright">Tu en es là</span>
        <span class="mt-auto block pt-4" @click.stop>
          <Walker3D mode="progress" :progress="progress.partProgress(p.id)" :height="72" :tone="p.id === currentPartId ? 'dark' : 'light'" :label="`Titre ${p.number} : ${Math.round(progress.partProgress(p.id) * 100)} % des leçons terminées`" />
        </span>
      </div>
    </div>

    <div class="mt-12 space-y-10">
      <details v-for="p in parts" :id="`titre-${p.number}`" :key="p.id" class="group/part scroll-mt-24" :open="p.id === currentPartId || !currentPartId">
        <summary class="flex cursor-pointer list-none items-end justify-between gap-4 border-b-2 border-ink/80 pb-3">
          <span>
            <span class="text-sm font-semibold text-capital">Titre {{ p.number }}</span>
            <span class="block font-display text-3xl font-bold tracking-tight">{{ p.title }}</span>
            <span class="block text-ink-soft">{{ p.subtitle }}</span>
          </span>
          <span class="shrink-0 text-sm text-muted group-open/part:hidden">Afficher</span>
          <span class="hidden shrink-0 text-sm text-muted group-open/part:inline">Masquer</span>
        </summary>

        <div class="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          <span v-for="src in p.sources" :key="src" class="chip bg-surface-2 text-ink-soft"><FileText :size="12" />{{ src }}</span>
        </div>
        <p v-if="p.sourceNote" class="mt-3 flex gap-2 rounded-xl border border-dashed border-line p-3 text-sm text-ink-soft"><Info :size="16" class="mt-0.5 shrink-0" />{{ p.sourceNote }}</p>

        <ol class="mt-5 space-y-5">
          <li v-for="ch in chaptersOf(p.id)" :key="ch.id" v-reveal class="panel overflow-hidden">
            <div class="flex items-start gap-4 p-5 sm:p-6">
              <ProgressRing :value="progress.chapterProgress(ch.id)" :size="54" :label="`Chapitre ${ch.number} : ${Math.round(progress.chapterProgress(ch.id) * 100)} % terminé`">
                <span class="font-display text-lg font-bold">{{ ch.number }}</span>
              </ProgressRing>
              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-semibold">{{ ch.title }}</h2>
                <p class="text-ink-soft">{{ ch.subtitle }}</p>
                <p class="mt-1 text-xs text-muted">Source : {{ ch.sourcePages }}, {{ exCount(ch.id) }} exercice{{ exCount(ch.id) > 1 ? 's' : '' }}</p>
              </div>
            </div>
            <details class="border-t border-line px-5 py-3 sm:px-6">
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
      </details>
    </div>
  </div>
</template>

<style scoped>
.part-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(240px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.14), transparent 60%);
  opacity: 0;
  transition: opacity 200ms ease;
}
.part-card:hover::after {
  opacity: 1;
}
summary::-webkit-details-marker {
  display: none;
}
</style>
