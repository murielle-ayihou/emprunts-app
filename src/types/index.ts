// ─── Contenu pédagogique ────────────────────────────────────────────────

export type Level = 'debutant' | 'intermediaire' | 'avance'

export interface Subject {
  id: string
  title: string
  short: string
  level: string
  partIds: string[]
}

/** Un « Titre » du cours (grande partie) */
export interface Part {
  id: string
  subjectId: string
  number: number
  title: string
  subtitle: string
  chapterIds: string[]
  /** Fichiers sources utilisés */
  sources: string[]
  /** Remarque sur les sources (parties manquantes…) */
  sourceNote?: string
}

export interface Chapter {
  id: string
  partId: string
  number: number
  title: string
  subtitle: string
  /** Objectifs d'apprentissage du chapitre */
  objectives: string[]
  lessonIds: string[]
  /** Pages du support PDF couvertes */
  sourcePages: string
}

export interface FormulaVariable {
  symbol: string
  meaning: string
}

export interface Formula {
  id: string
  title: string
  latex: string
  variables: FormulaVariable[]
  whenToUse: string
  /** Numéro de diapositive, ou texte (« TD n°5 ») */
  sourcePage: number | string
}

export interface TableData {
  caption?: string
  headers: string[]
  rows: (string | number)[][]
  /** Index des colonnes à aligner à droite (montants) */
  numericCols?: number[]
  /** Index de ligne à mettre en évidence */
  highlightRow?: number
}

export interface JournalLine {
  debitAccount?: string
  creditAccount?: string
  label: string
  debit?: number
  credit?: number
}

export interface JournalEntry {
  date: string
  lines: JournalLine[]
  description: string
}

export interface Example {
  id: string
  title: string
  statement: string
  steps: string[]
  table?: TableData
  journal?: JournalEntry
  sourcePage?: number
}

export type DiagramKind =
  | 'financing'
  | 'payment-split'
  | 'methods'
  | 'methods-chart'
  | 'compta-process'
  | 'flux-echange'
  | 'bilan-schema'
  | 'tva-chain'
  | 'paie-schema'
  | 'paie-calendrier'
  | 'immo-phases'
  | 'periodicite-chart'

export interface QuickCheck {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type LessonBlock =
  | { type: 'text'; text: string }
  | { type: 'definition'; term: string; text: string }
  | { type: 'formula'; formulaId: string }
  | { type: 'example'; exampleId: string }
  | { type: 'table'; table: TableData }
  | { type: 'steps'; title: string; items: string[] }
  | { type: 'warning'; title: string; text: string }
  | { type: 'tip'; title: string; text: string }
  | { type: 'note'; title: string; text: string }
  | { type: 'summary'; items: string[] }
  | { type: 'diagram'; kind: DiagramKind }
  | { type: 'journal'; title?: string; entry: JournalEntry }
  | { type: 'quickcheck'; check: QuickCheck }
  | { type: 'heading'; text: string }
  | { type: 'taccount'; account: TAccountData }
  | { type: 'list'; items: string[] }

export interface TAccountData {
  title: string
  debits: { label: string; amount: number }[]
  credits: { label: string; amount: number }[]
  /** Solde initial débiteur (s'affiche en premier côté débit) */
  caption?: string
}

export interface Lesson {
  id: string
  chapterId: string
  title: string
  summary: string
  minutes: number
  sourcePage: string
  blocks: LessonBlock[]
}

// ─── Exercices ──────────────────────────────────────────────────────────

export type ExerciseKind =
  | 'qcm'
  | 'vrai-faux'
  | 'numerique'
  | 'calcul'
  | 'completer'
  | 'probleme'
  | 'comprehension'

export type ExerciseInput =
  | { id: string; type: 'choice'; prompt?: string; options: string[]; answer: number }
  | { id: string; type: 'number'; label: string; answer: number; tolerance?: number; unit?: string }
  | { id: string; type: 'text'; label: string; answers: string[] }

export interface Exercise {
  /** Origine : « TD n°1, exercice 2 », « Exemple du cours, diapositive 98 »… */
  source?: string
  id: string
  chapterId: string
  lessonId: string
  notion: string
  level: Level
  kind: ExerciseKind
  title: string
  statement: string
  inputs: ExerciseInput[]
  explanation: string
  steps?: string[]
}

// ─── Quiz ───────────────────────────────────────────────────────────────

export type QuizQuestion =
  | {
      id: string
      chapterId: string
      lessonId: string
      level: Level
      type: 'qcm' | 'vrai-faux'
      prompt: string
      options: string[]
      answer: number
      explanation: string
    }
  | {
      id: string
      chapterId: string
      lessonId: string
      level: Level
      type: 'numerique'
      prompt: string
      answer: number
      tolerance?: number
      unit?: string
      explanation: string
    }

export interface QuizSeries {
  id: string
  title: string
  description: string
  level: Level
  chapterIds: string[]
  questionIds: string[]
  /** Durée conseillée en secondes si le chronomètre est activé */
  timeLimitSec: number
}

// ─── Glossaire & badges ─────────────────────────────────────────────────

export interface GlossaryEntry {
  term: string
  definition: string
  lessonId: string
}

export interface BadgeDef {
  id: string
  title: string
  description: string
  icon: string
  tone: 'amber' | 'teal' | 'indigo' | 'rose' | 'violet'
}

// ─── Progression (sauvegarde locale) ────────────────────────────────────

export interface ExerciseResult {
  attempts: number
  correct: boolean
  firstTryCorrect: boolean
  lastAnswers: Record<string, string>
  updatedAt: string
}

export interface QuizAnswerRecord {
  questionId: string
  /** Réponse donnée : index (qcm/vrai-faux) ou texte (numérique), null si non répondue */
  given: number | string | null
  correct: boolean
}

export interface QuizAttempt {
  id: string
  quizId: string
  date: string
  questionOrder: string[]
  answers: QuizAnswerRecord[]
  score: number
  total: number
  durationSec: number
  timed: boolean
}

export type ActivityType = 'lesson' | 'chapter' | 'exercise' | 'quiz' | 'badge' | 'level' | 'simulator'

export interface Activity {
  type: ActivityType
  label: string
  date: string
  xp: number
}

export interface LastPosition {
  lessonId: string
  blockIndex: number
  date: string
}

export interface ProgressState {
  version: 1
  lessonsVisited: string[]
  lessonsCompleted: string[]
  chaptersCompleted: string[]
  exerciseResults: Record<string, ExerciseResult>
  quizAttempts: QuizAttempt[]
  xp: number
  badges: Record<string, string>
  activities: Activity[]
  answerStreak: { current: number; best: number }
  studyDays: string[]
  lastPosition: LastPosition | null
  simulatorComparisons: number
}

export type ThemePref = 'light' | 'dark' | 'system'

export interface SettingsState {
  theme: ThemePref
  sound: boolean
  quizTimer: boolean
}
