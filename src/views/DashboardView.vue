<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { chapters, getChapter, getPart, parts } from '@/data/chapters'
import { getLesson, lessons } from '@/data/lessons'
import { exercises } from '@/data/exercises'
import { quizSeries } from '@/data/quizzes'
import { badges } from '@/data/badges'
import ProgressRing from '@/components/common/ProgressRing.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import BadgeGrid from '@/components/gamification/BadgeGrid.vue'
import KineticTitle from '@/components/common/KineticTitle.vue'
import AuroraBg from '@/components/common/AuroraBg.vue'
import { vReveal } from '@/composables/reveal'
import MasteryChart from '@/components/dashboard/MasteryChart.vue'
import QuizTrendChart from '@/components/dashboard/QuizTrendChart.vue'
import { formatRelative } from '@/utils/format'
const Hero3D = defineAsyncComponent(() => import('@/components/three/Hero3D.vue'))
const Walker3D = defineAsyncComponent(() => import('@/components/three/Walker3D.vue'))
import { ArrowRight, BookOpen, PencilLine, ListChecks, Award, TrendingUp, Calculator, Flame, Target, Play, CheckCircle2, Circle, Layers } from 'lucide-vue-next'

const progress = useProgressStore()
const s = computed(() => progress.state)
const isNew = computed(() => s.value.xp === 0 && s.value.lessonsVisited.length === 0)
const headline = computed(() => {
  if (isNew.value) return 'Révise la comptabilité, autrement.'
  if (progress.courseProgress === 1) return 'Cours bouclé. Place à l’entraînement.'
  return `Tu as parcouru ${Math.round(progress.courseProgress * 100)} % du cours.`
})
/** Jalons du parcours : début de chaque Titre, en proportion du nombre de leçons. */
const milestones = computed(() => {
  let acc = 0
  const total = lessons.length
  return parts.map((p) => {
    const at = acc / total
    acc += chapters.filter((c) => c.partId === p.id).reduce((n, c) => n + c.lessonIds.length, 0)
    return { at, label: `Titre ${p.number}` }
  })
})

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 6 ? 'Bonsoir' : h < 18 ? 'Bonjour' : 'Bonsoir'
})

/** Où reprendre : dernière position enregistrée, sinon prochaine leçon. */
const resume = computed(() => {
  const pos = s.value.lastPosition
  if (pos) {
    const l = getLesson(pos.lessonId)
    if (l && !progress.isLessonCompleted(l.id)) {
      return { lesson: l, to: pos.blockIndex > 0 ? `/cours/${l.id}#bloc-${pos.blockIndex}` : `/cours/${l.id}`, part: Math.min(1, (pos.blockIndex + 1) / l.blocks.length), label: 'Reprendre là où tu t’es arrêté' }
    }
  }
  const n = progress.nextLesson
  if (n) return { lesson: n, to: `/cours/${n.id}`, part: 0, label: isNew.value ? 'Commencer le cours' : 'Leçon suivante' }
  return null
})

/** Recommandation fondée sur l'activité réelle. */
const recommendation = computed(() => {
  if (s.value.lessonsCompleted.length === 0) {
    return { icon: BookOpen, title: 'Commence par la première leçon', text: `Le cours est progressif : ${lessons.length} leçons d’environ 6 minutes, réparties en ${parts.length} Titres.`, to: `/cours/${lessons[0].id}`, cta: 'Ouvrir la leçon' }
  }
  const weak = chapters
    .map((c) => ({ c, m: progress.chapterMastery(c.id) }))
    .filter((x) => x.m !== null && x.m < 0.7)
    .sort((a, b) => (a.m ?? 0) - (b.m ?? 0))[0]
  if (weak) {
    return { icon: Target, title: `Consolide « ${weak.c.title} »`, text: `Titre ${getPart(weak.c.partId)?.number}, chapitre ${weak.c.number} : ta réussite est de ${Math.round((weak.m ?? 0) * 100)} %. Refais les exercices de ce chapitre pour la remonter.`, to: { path: '/exercices', query: { chapitre: weak.c.id } }, cta: 'Voir les exercices' }
  }
  const lessonDoneNoExercise = lessons.find((l) => progress.isLessonCompleted(l.id) && exercises.some((e) => e.lessonId === l.id && !s.value.exerciseResults[e.id]))
  if (lessonDoneNoExercise) {
    return { icon: PencilLine, title: 'Mets en pratique', text: `Tu as terminé « ${lessonDoneNoExercise.title} » : entraîne-toi sur les exercices associés.`, to: { path: '/exercices', query: { lecon: lessonDoneNoExercise.id } }, cta: 'S’entraîner' }
  }
  if (progress.nextLesson) {
    return { icon: BookOpen, title: 'Continue le cours', text: `Prochaine leçon : « ${progress.nextLesson.title} ».`, to: `/cours/${progress.nextLesson.id}`, cta: 'Continuer' }
  }
  const untried = quizSeries.find((q) => progress.bestScore(q.id) === null)
  if (untried) return { icon: ListChecks, title: `Teste-toi : ${untried.title}`, text: untried.description, to: `/quiz/${untried.id}`, cta: 'Lancer le quiz' }
  const defi = progress.bestScore('qs-defi') ?? 0
  if (defi < 0.9) return { icon: Award, title: 'Vise le badge Expert', text: `Ton meilleur score au Défi final est de ${Math.round(defi * 100)} %. Il faut 90 %.`, to: '/quiz/qs-defi', cta: 'Relever le défi' }
  return { icon: Layers, title: 'Entretiens ta mémoire', text: 'Passe le paquet de fiches de révision : vocabulaire et formules de tous les Titres.', to: '/revision', cta: 'Réviser les fiches' }
})

const currentPart = computed(() => {
  const n = progress.nextLesson
  const pid = n ? getChapter(n.chapterId)?.partId : parts[parts.length - 1].id
  return getPart(pid ?? 't1')!
})
const currentPartChapters = computed(() => chapters.filter((c) => c.partId === currentPart.value.id))

const activityIcons = { lesson: BookOpen, chapter: CheckCircle2, exercise: PencilLine, quiz: ListChecks, badge: Award, level: TrendingUp, simulator: Calculator }
const badgeCount = computed(() => Object.keys(s.value.badges).length)
const avgQuiz = computed(() => (progress.averageQuizScore === null ? null : Math.round(progress.averageQuizScore * 100)))
const goalPct = computed(() => Math.min(1, progress.todayXp / progress.dailyGoal))
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <!-- En-tête : accueil + scène 3D + reprise -->
    <section class="relative isolate grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
      <AuroraBg />
      <div class="flex flex-col justify-center">
        <p class="font-semibold text-capital">{{ greeting }} !</p>
        <KineticTitle class="mt-2" :text="headline" />
        <p class="mt-4 max-w-xl text-lg text-ink-soft">
          {{ parts.length }} Titres, de l’introduction aux emprunts, avec tes TD corrigés, un labo de simulateurs et des fiches de révision. Ta progression reste dans ce navigateur.
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <RouterLink to="/simulateur" class="btn-ghost"><Calculator :size="16" />Ouvrir le labo</RouterLink>
          <RouterLink to="/revision" class="btn-ghost"><Layers :size="16" />Révision flash</RouterLink>
        </div>
      </div>

      <div class="relative">
        <div class="hero3d -mx-2 h-64 sm:h-72 lg:-mt-6 lg:h-80">
          <Hero3D />
        </div>
        <RouterLink v-if="resume" :to="resume.to" class="group relative z-10 -mt-10 flex flex-col rounded-[24px] bg-deep p-6 text-on-deep shadow-[0_24px_50px_-24px_rgba(20,40,75,.65)] transition hover:-translate-y-0.5 sm:p-7">
          <span class="flex items-center gap-2 text-sm opacity-80"><Play :size="15" />{{ resume.label }}</span>
          <span class="mt-3 text-sm opacity-70">Titre {{ getPart(getChapter(resume.lesson.chapterId)?.partId ?? '')?.number }}, {{ getChapter(resume.lesson.chapterId)?.title }}</span>
          <span class="font-display text-2xl font-bold leading-tight">{{ resume.lesson.title }}</span>
          <ProgressBar v-if="resume.part > 0" class="mt-5 !bg-white/15" :value="resume.part" color="var(--brass-bright)" :height="6" label="Avancement dans la leçon" />
          <span class="mt-auto flex items-center justify-between pt-5 font-semibold">
            {{ resume.lesson.minutes }} min de lecture
            <span class="grid h-11 w-11 place-items-center rounded-full bg-brass-bright text-[#2b1a00] transition group-hover:translate-x-1"><ArrowRight :size="20" /></span>
          </span>
        </RouterLink>
        <RouterLink v-else to="/quiz" class="relative z-10 -mt-10 flex flex-col justify-center rounded-[24px] bg-deep p-7 text-on-deep">
          <span class="font-display text-2xl font-bold">Toutes les leçons sont terminées</span>
          <span class="mt-2 opacity-80">Passe les quiz de chaque Titre pour valider tes acquis.</span>
        </RouterLink>
      </div>
    </section>

    <!-- Parcours -->
    <section v-reveal class="panel mt-10 overflow-hidden p-6 sm:p-8" aria-labelledby="parcours-title">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="parcours-title" class="text-2xl font-bold">Ton parcours</h2>
        <p class="text-sm text-muted"><span class="num">{{ progress.completedLessonCount }} / {{ progress.totalLessons }}</span> leçons. Touche le bonhomme pour qu’il salue, fais-le glisser pour le faire tourner.</p>
      </div>
      <Walker3D class="mt-4" mode="progress" :progress="progress.courseProgress" :milestones="milestones" :height="120" :label="`Bonhomme en 3D à ${Math.round(progress.courseProgress * 100)} % du parcours`" />
    </section>

    <!-- Chiffres clés -->
    <section class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-5" aria-label="Statistiques">
      <div class="col-span-2 flex items-center gap-4 bg-surface p-5 md:col-span-1">
        <ProgressRing :value="progress.courseProgress" :size="64" :label="`Cours : ${Math.round(progress.courseProgress * 100)} %`">
          <span class="num text-sm font-bold">{{ Math.round(progress.courseProgress * 100) }}%</span>
        </ProgressRing>
        <div><p class="text-sm text-muted">Avancement</p><p class="font-semibold">du cours</p></div>
      </div>
      <div class="bg-surface p-5"><p class="text-sm text-muted">Chapitres terminés</p><p class="num mt-1 font-display text-3xl font-bold">{{ s.chaptersCompleted.length }}<span class="text-lg text-muted">/{{ chapters.length }}</span></p></div>
      <div class="bg-surface p-5"><p class="text-sm text-muted">Exercices faits</p><p class="num mt-1 font-display text-3xl font-bold">{{ progress.exercisesDone }}<span class="text-lg text-muted">/{{ exercises.length }}</span></p><p class="text-xs text-muted">{{ progress.exercisesCorrect }} réussis</p></div>
      <div class="bg-surface p-5"><p class="text-sm text-muted">Score moyen aux quiz</p><p class="num mt-1 font-display text-3xl font-bold">{{ avgQuiz === null ? '–' : avgQuiz + ' %' }}</p><p class="text-xs text-muted">{{ s.quizAttempts.length }} tentative{{ s.quizAttempts.length > 1 ? 's' : '' }}</p></div>
      <div class="bg-surface p-5">
        <p class="text-sm text-muted">Niveau {{ progress.level.level }}, {{ progress.level.name }}</p>
        <p class="num mt-1 font-display text-3xl font-bold text-brass">{{ s.xp }} <span class="text-lg">XP</span></p>
        <ProgressBar class="mt-2" :value="progress.level.progress" color="var(--brass-bright)" :height="5" label="Vers le niveau suivant" />
        <p v-if="progress.level.nextLevelXp" class="num mt-1 text-xs text-muted">{{ progress.level.nextLevelXp - s.xp }} XP avant le niveau {{ progress.level.level + 1 }}</p>
      </div>
    </section>

    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <!-- Colonne principale -->
      <div class="space-y-6 lg:col-span-2">
        <section v-reveal class="rounded-[20px] bg-brass-soft/60 p-6">
          <div class="flex items-start gap-4">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface text-brass"><component :is="recommendation.icon" :size="22" /></span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-brass">Recommandé pour toi</p>
              <h2 class="mt-0.5 text-xl font-semibold">{{ recommendation.title }}</h2>
              <p class="mt-1 text-ink-soft">{{ recommendation.text }}</p>
              <RouterLink :to="recommendation.to" class="btn-primary mt-4">{{ recommendation.cta }}<ArrowRight :size="16" /></RouterLink>
            </div>
          </div>
        </section>

        <section v-reveal class="panel p-6">
          <h2 class="text-xl font-semibold">Progression par Titre</h2>
          <p class="text-sm text-muted">Leçons terminées et taux de réussite (exercices au premier essai et quiz).</p>
          <MasteryChart class="mt-4" />
        </section>

        <section v-reveal class="panel p-6">
          <h2 class="text-xl font-semibold">Scores aux quiz</h2>
          <QuizTrendChart v-if="s.quizAttempts.length" class="mt-4" />
          <div v-else class="mt-4 rounded-2xl border border-dashed border-line p-6 text-center">
            <p class="text-ink-soft">Ton premier quiz apparaîtra ici.</p>
            <RouterLink to="/quiz" class="btn-ghost mt-3">Choisir un quiz</RouterLink>
          </div>
        </section>

        <section v-reveal class="panel p-6">
          <div class="flex items-baseline justify-between">
            <h2 class="text-xl font-semibold">Badges</h2>
            <span class="num text-sm text-muted">{{ badgeCount }} / {{ badges.length }}</span>
          </div>
          <BadgeGrid class="mt-5" />
        </section>
      </div>

      <!-- Colonne latérale -->
      <div class="space-y-6">
        <section class="panel p-6">
          <div class="flex items-center gap-4">
            <ProgressRing :value="goalPct" :size="72" :stroke="8" color="var(--brass-bright)" :label="`Objectif du jour : ${progress.todayXp} XP sur ${progress.dailyGoal}`">
              <Flame :size="24" :class="goalPct >= 1 ? 'text-brass' : 'text-muted'" />
            </ProgressRing>
            <div>
              <h2 class="text-lg font-semibold">Objectif du jour</h2>
              <p class="num text-ink-soft">{{ progress.todayXp }} / {{ progress.dailyGoal }} XP</p>
              <p class="text-sm text-muted">{{ goalPct >= 1 ? 'Objectif atteint, bravo !' : 'Une leçon et deux exercices suffisent.' }}</p>
            </div>
          </div>
          <dl class="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
            <div><dt class="text-muted">Jours d'affilée</dt><dd class="num font-display text-2xl font-bold">{{ progress.dayStreak }}</dd></div>
            <div><dt class="text-muted">Meilleure série</dt><dd class="num font-display text-2xl font-bold">{{ s.answerStreak.best }}<span class="text-sm font-normal text-muted"> bonnes réponses</span></dd></div>
          </dl>
        </section>

        <section class="panel p-6">
          <h2 class="text-lg font-semibold">Objectifs d'apprentissage</h2>
          <p class="text-sm text-muted">Titre {{ currentPart.number }} : {{ currentPart.title }}</p>
          <ul class="mt-3 space-y-4">
            <li v-for="c in currentPartChapters" :key="c.id">
              <RouterLink :to="`/cours/${c.lessonIds[0]}`" class="group block">
                <p class="flex items-center justify-between gap-2 text-sm font-semibold group-hover:underline">
                  {{ c.number }}. {{ c.title }}
                  <span class="num shrink-0 text-xs font-normal text-muted">{{ Math.round(progress.chapterProgress(c.id) * 100) }} %</span>
                </p>
                <ul class="mt-1.5 space-y-1">
                  <li v-for="(o, i) in c.objectives" :key="o" class="flex gap-2 text-sm text-ink-soft">
                    <CheckCircle2 v-if="progress.chapterProgress(c.id) >= (i + 1) / c.objectives.length" :size="15" class="mt-0.5 shrink-0 text-capital" />
                    <Circle v-else :size="15" class="mt-0.5 shrink-0 text-line" />
                    {{ o }}
                  </li>
                </ul>
              </RouterLink>
            </li>
          </ul>
          <div class="mt-5 grid grid-cols-4 gap-2 border-t border-line pt-4">
            <div v-for="p in parts" :key="p.id" class="text-center">
              <ProgressBar :value="progress.partProgress(p.id)" :height="5" :label="`Titre ${p.number}`" />
              <span class="mt-1 block text-xs text-muted">T{{ p.number }}</span>
            </div>
          </div>
        </section>

        <section class="panel p-6">
          <h2 class="text-lg font-semibold">Dernières activités</h2>
          <p v-if="!s.activities.length" class="mt-2 text-sm text-ink-soft">Rien pour l'instant. Tes leçons, exercices et quiz s'afficheront ici.</p>
          <ol v-else class="mt-3 space-y-3">
            <li v-for="(a, i) in s.activities.slice(0, 7)" :key="i" class="flex gap-3">
              <span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-soft"><component :is="activityIcons[a.type]" :size="16" /></span>
              <div class="min-w-0 flex-1">
                <p class="text-sm leading-snug text-ink">{{ a.label }}</p>
                <p class="text-xs text-muted">{{ formatRelative(a.date) }}<span v-if="a.xp" class="font-semibold text-brass">, +{{ a.xp }} XP</span></p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </div>
</template>
