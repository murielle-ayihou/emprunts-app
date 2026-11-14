import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Activity, ActivityType, ExerciseResult, ProgressState, QuizAttempt } from '@/types'
import { STORAGE_KEYS, emptyProgress, readJson, removeKey, validateProgress, writeJson } from '@/services/storage'
import { XP, completedChapterIds, dayKey, earnedBadges, levelFromXp, quizXp, studyDayStreak, DAILY_GOAL_XP } from '@/services/gamification'
import { badges as badgeDefs } from '@/data/badges'
import { chapters, getChapter, getPart, parts } from '@/data/chapters'
import { getLesson, lessons } from '@/data/lessons'
import { exercises } from '@/data/exercises'
import { quizQuestions } from '@/data/quizzes'
import { playSound } from '@/services/sound'
import { useUiStore } from './ui'

const MAX_ACTIVITIES = 40

function load(): ProgressState {
  const saved = readJson<ProgressState>(STORAGE_KEYS.progress)
  if (saved && validateProgress(saved).ok) return saved
  return emptyProgress()
}

export const useProgressStore = defineStore('progress', () => {
  const state = ref<ProgressState>(load())
  const ui = useUiStore()

  watch(state, (s) => writeJson(STORAGE_KEYS.progress, s), { deep: true })

  // ─── Lectures dérivées ───────────────────────────────────────────────
  const level = computed(() => levelFromXp(state.value.xp))
  const totalLessons = lessons.length
  const completedLessonCount = computed(() => state.value.lessonsCompleted.length)
  const courseProgress = computed(() => completedLessonCount.value / totalLessons)
  const exercisesDone = computed(() => Object.keys(state.value.exerciseResults).length)
  const exercisesCorrect = computed(() => Object.values(state.value.exerciseResults).filter((r) => r.correct).length)
  const averageQuizScore = computed(() => {
    const a = state.value.quizAttempts
    if (!a.length) return null
    return a.reduce((s, x) => s + (x.total ? x.score / x.total : 0), 0) / a.length
  })
  const dayStreak = computed(() => studyDayStreak(state.value.studyDays))
  const todayXp = computed(() => {
    const today = dayKey()
    return state.value.activities.filter((a) => dayKey(new Date(a.date)) === today).reduce((s, a) => s + a.xp, 0)
  })
  const dailyGoal = DAILY_GOAL_XP

  function chapterProgress(chapterId: string) {
    const ch = getChapter(chapterId)
    if (!ch) return 0
    return ch.lessonIds.filter((id) => state.value.lessonsCompleted.includes(id)).length / ch.lessonIds.length
  }

  function partProgress(partId: string) {
    const part = getPart(partId)
    if (!part) return 0
    const ids = chapters.filter((c) => c.partId === partId).flatMap((c) => c.lessonIds)
    return ids.length ? ids.filter((id) => state.value.lessonsCompleted.includes(id)).length / ids.length : 0
  }

  function partMastery(partId: string): number | null {
    const vals = chapters.filter((c) => c.partId === partId).map((c) => chapterMastery(c.id)).filter((m): m is number => m !== null)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  const partsList = parts

  function isLessonCompleted(id: string) {
    return state.value.lessonsCompleted.includes(id)
  }

  /** Maîtrise d'un chapitre : part de bonnes réponses aux exercices et questions de quiz du chapitre. */
  function chapterMastery(chapterId: string): number | null {
    let ok = 0
    let total = 0
    for (const e of exercises.filter((x) => x.chapterId === chapterId)) {
      const r = state.value.exerciseResults[e.id]
      if (r) {
        total++
        if (r.firstTryCorrect) ok++
      }
    }
    const qIds = new Set(quizQuestions.filter((q) => q.chapterId === chapterId).map((q) => q.id))
    for (const att of state.value.quizAttempts) {
      for (const ans of att.answers) {
        if (qIds.has(ans.questionId)) {
          total++
          if (ans.correct) ok++
        }
      }
    }
    return total ? ok / total : null
  }

  // ─── Mutations internes ──────────────────────────────────────────────
  function markStudyDay() {
    const today = dayKey()
    if (!state.value.studyDays.includes(today)) {
      state.value.studyDays.push(today)
      if (state.value.studyDays.length > 400) state.value.studyDays.splice(0, state.value.studyDays.length - 400)
    }
  }

  function logActivity(type: ActivityType, label: string, xp: number) {
    const a: Activity = { type, label, xp, date: new Date().toISOString() }
    state.value.activities.unshift(a)
    if (state.value.activities.length > MAX_ACTIVITIES) state.value.activities.length = MAX_ACTIVITIES
  }

  function addXp(amount: number, type: ActivityType, label: string) {
    const before = level.value.level
    state.value.xp += amount
    markStudyDay()
    logActivity(type, label, amount)
    const after = levelFromXp(state.value.xp)
    if (after.level > before) {
      logActivity('level', `Niveau ${after.level} atteint : ${after.name}`, 0)
      ui.celebrate({ kind: 'level', title: `Niveau ${after.level}`, message: `Tu passes « ${after.name} ». Continue comme ça !`, icon: 'TrendingUp' })
    }
  }

  function checkBadges() {
    const earned = earnedBadges(state.value)
    let unlocked = false
    for (const id of earned) {
      if (!state.value.badges[id]) {
        state.value.badges[id] = new Date().toISOString()
        const def = badgeDefs.find((b) => b.id === id)
        if (def) {
          logActivity('badge', `Badge débloqué : ${def.title}`, 0)
          ui.celebrate({ kind: 'badge', title: def.title, message: def.description, icon: def.icon })
          unlocked = true
        }
      }
    }
    if (unlocked) playSound('badge')
  }

  function updateAnswerStreak(correct: boolean) {
    const s = state.value.answerStreak
    s.current = correct ? s.current + 1 : 0
    if (s.current > s.best) s.best = s.current
  }

  // ─── Actions publiques ───────────────────────────────────────────────
  function visitLesson(id: string) {
    if (!state.value.lessonsVisited.includes(id)) state.value.lessonsVisited.push(id)
    setPosition(id, state.value.lastPosition?.lessonId === id ? state.value.lastPosition.blockIndex : 0)
    markStudyDay()
  }

  function setPosition(lessonId: string, blockIndex: number) {
    state.value.lastPosition = { lessonId, blockIndex, date: new Date().toISOString() }
  }

  function completeLesson(id: string) {
    if (state.value.lessonsCompleted.includes(id)) return
    const lesson = getLesson(id)
    if (!lesson) return
    state.value.lessonsCompleted.push(id)
    addXp(XP.lessonCompleted, 'lesson', `Leçon terminée : ${lesson.title}`)

    const nowComplete = completedChapterIds(state.value.lessonsCompleted)
    const newChapters = nowComplete.filter((c) => !state.value.chaptersCompleted.includes(c))
    if (newChapters.length) {
      for (const cid of newChapters) {
        state.value.chaptersCompleted.push(cid)
        const ch = getChapter(cid)!
        addXp(XP.chapterCompleted, 'chapter', `Chapitre ${ch.number} terminé : ${ch.title}`)
        ui.celebrate({ kind: 'chapter', title: `Chapitre ${ch.number} terminé`, message: ch.title, icon: 'BookOpenCheck' })
      }
      playSound('chapter')
    } else {
      playSound('progress')
    }
    checkBadges()
  }

  function uncompleteLesson(id: string) {
    state.value.lessonsCompleted = state.value.lessonsCompleted.filter((x) => x !== id)
    state.value.chaptersCompleted = completedChapterIds(state.value.lessonsCompleted).filter((c) => state.value.chaptersCompleted.includes(c))
  }

  /** Enregistre une tentative d'exercice et renvoie l'XP gagnée. */
  function recordExercise(id: string, correct: boolean, answers: Record<string, string>): number {
    const prev = state.value.exerciseResults[id]
    const ex = exercises.find((e) => e.id === id)
    const result: ExerciseResult = {
      attempts: (prev?.attempts ?? 0) + 1,
      correct: correct || prev?.correct === true,
      firstTryCorrect: prev ? prev.firstTryCorrect : correct,
      lastAnswers: answers,
      updatedAt: new Date().toISOString(),
    }
    state.value.exerciseResults[id] = result
    updateAnswerStreak(correct)
    playSound(correct ? 'correct' : 'wrong')

    let gained = 0
    if (correct && !prev?.correct) {
      gained = prev ? XP.exerciseRetry : XP.exerciseFirstTry
      addXp(gained, 'exercise', `Exercice réussi : ${ex?.title ?? id}`)
    } else {
      markStudyDay()
    }
    checkBadges()
    return gained
  }

  function resetExercise(id: string) {
    // On garde l'historique (réussite, nombre d'essais) mais on efface les réponses affichées
    const r = state.value.exerciseResults[id]
    if (r) r.lastAnswers = {}
  }

  /** Enregistre une tentative de quiz et renvoie l'XP gagnée. */
  function recordQuizAttempt(attempt: QuizAttempt, title: string): number {
    state.value.quizAttempts.unshift(attempt)
    if (state.value.quizAttempts.length > 100) state.value.quizAttempts.length = 100
    for (const a of attempt.answers) updateAnswerStreak(a.correct)
    const gained = quizXp(attempt.score, attempt.total)
    addXp(gained, 'quiz', `Quiz « ${title} » : ${attempt.score}/${attempt.total}`)
    playSound('quiz')
    checkBadges()
    return gained
  }

  /** Séance d'entraînement au journal : XP selon les points obtenus, comme un quiz. */
  function recordJournalSession(title: string, points: number, total: number): number {
    const gained = quizXp(points, total)
    if (gained > 0) addXp(gained, 'quiz', `Entraînement journal : ${title} (${points}/${total})`)
    else markStudyDay()
    updateAnswerStreak(total > 0 && points === total)
    checkBadges()
    return gained
  }

  function recordSimulatorComparison() {
    const first = state.value.simulatorComparisons === 0
    state.value.simulatorComparisons++
    if (first) addXp(XP.simulatorCompare, 'simulator', 'Première comparaison de scénarios')
    else markStudyDay()
    checkBadges()
  }

  function bestScore(quizId: string): number | null {
    const a = state.value.quizAttempts.filter((x) => x.quizId === quizId && x.total > 0)
    if (!a.length) return null
    return Math.max(...a.map((x) => x.score / x.total))
  }

  function getAttempt(id: string) {
    return state.value.quizAttempts.find((a) => a.id === id)
  }

  /** Prochaine leçon non terminée, dans l'ordre du cours. */
  const nextLesson = computed(() => {
    for (const ch of chapters) {
      for (const id of ch.lessonIds) if (!state.value.lessonsCompleted.includes(id)) return getLesson(id) ?? null
    }
    return null
  })

  function reset() {
    state.value = emptyProgress()
    removeKey(STORAGE_KEYS.progress)
  }

  function replace(p: ProgressState) {
    state.value = p
  }

  return {
    state,
    level,
    totalLessons,
    completedLessonCount,
    courseProgress,
    exercisesDone,
    exercisesCorrect,
    averageQuizScore,
    dayStreak,
    todayXp,
    dailyGoal,
    nextLesson,
    chapterProgress,
    chapterMastery,
    partProgress,
    partMastery,
    partsList,
    isLessonCompleted,
    visitLesson,
    setPosition,
    completeLesson,
    uncompleteLesson,
    recordExercise,
    resetExercise,
    recordQuizAttempt,
    recordSimulatorComparison,
    recordJournalSession,
    bestScore,
    getAttempt,
    reset,
    replace,
  }
})
