import type { ProgressState } from '@/types'
import { chapters, parts } from '@/data/chapters'
import { lessons } from '@/data/lessons'
import { exercises } from '@/data/exercises'

export const XP = {
  lessonCompleted: 20,
  chapterCompleted: 50,
  exerciseFirstTry: 15,
  exerciseRetry: 5,
  quizPerCorrect: 3,
  quizBonusGood: 20, // ≥ 80 %
  quizBonusPerfect: 30, // 100 %
  simulatorCompare: 10,
} as const

export const DAILY_GOAL_XP = 50

/** Seuils d'XP cumulés pour atteindre chaque niveau (niveau 1 = 0 XP). */
export const LEVEL_THRESHOLDS = [0, 60, 150, 280, 450, 660, 920, 1240, 1620, 2060]
export const LEVEL_NAMES = [
  'Curieux',
  'Apprenti',
  'Initié',
  'Calculateur',
  'Analyste',
  'Confirmé',
  'Spécialiste',
  'Expert',
  'Maître',
  'Virtuose',
]

export interface LevelInfo {
  level: number
  name: string
  currentXp: number
  levelStartXp: number
  nextLevelXp: number | null
  progress: number
}

export function levelFromXp(xp: number): LevelInfo {
  let idx = 0
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (xp >= LEVEL_THRESHOLDS[i]) idx = i
  const start = LEVEL_THRESHOLDS[idx]
  const next = LEVEL_THRESHOLDS[idx + 1] ?? null
  return {
    level: idx + 1,
    name: LEVEL_NAMES[idx],
    currentXp: xp,
    levelStartXp: start,
    nextLevelXp: next,
    progress: next === null ? 1 : (xp - start) / (next - start),
  }
}

export function quizXp(score: number, total: number): number {
  if (total === 0) return 0
  const ratio = score / total
  let xp = score * XP.quizPerCorrect
  if (ratio === 1) xp += XP.quizBonusPerfect
  else if (ratio >= 0.8) xp += XP.quizBonusGood
  return xp
}

/** Date locale au format AAAA-MM-JJ. */
export function dayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Nombre de jours consécutifs d'étude se terminant aujourd'hui (ou hier). */
export function studyDayStreak(days: string[], today = new Date()): number {
  const set = new Set(days)
  const cursor = new Date(today)
  if (!set.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!set.has(dayKey(cursor))) return 0
  }
  let streak = 0
  while (set.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function correctExerciseCount(state: ProgressState): number {
  return Object.values(state.exerciseResults).filter((r) => r.correct).length
}

/** Renvoie les identifiants de badges dont la condition est remplie. */
export function earnedBadges(state: ProgressState): string[] {
  const out: string[] = []
  if (state.lessonsCompleted.length >= 1) out.push('premier-pas')
  if (state.chaptersCompleted.length >= 1) out.push('explorateur')
  if (correctExerciseCount(state) >= 10) out.push('calculateur')
  if (state.quizAttempts.length >= 1) out.push('challenger')
  if (state.quizAttempts.some((a) => a.quizId === 'qs-defi' && a.total > 0 && a.score / a.total >= 0.9)) out.push('expert')
  if (state.quizAttempts.some((a) => a.total > 0 && a.score === a.total)) out.push('sans-faute')
  if (state.answerStreak.best >= 5) out.push('serie-5')
  const ch4 = exercises.filter((e) => e.chapterId === 'ch4')
  if (ch4.length > 0 && ch4.every((e) => state.exerciseResults[e.id]?.correct)) out.push('comptable')
  if (state.simulatorComparisons >= 1) out.push('simulateur')
  if (studyDayStreak(state.studyDays) >= 3) out.push('assidu')
  if (lessons.every((l) => state.lessonsCompleted.includes(l.id))) out.push('diplome')
  const partLessons = (pid: string) => chapters.filter((c) => c.partId === pid).flatMap((c) => c.lessonIds)
  if (parts.some((p) => partLessons(p.id).every((id) => state.lessonsCompleted.includes(id)))) out.push('titre-boucle')
  const chapterPart = new Map(chapters.map((c) => [c.id, c.partId]))
  const partsWithSuccess = new Set(exercises.filter((e) => state.exerciseResults[e.id]?.correct).map((e) => chapterPart.get(e.chapterId)))
  if (parts.every((p) => partsWithSuccess.has(p.id))) out.push('polyvalent')
  return out
}

/** Chapitres dont toutes les leçons sont terminées. */
export function completedChapterIds(lessonsCompleted: string[]): string[] {
  return chapters.filter((c) => c.lessonIds.every((id) => lessonsCompleted.includes(id))).map((c) => c.id)
}
