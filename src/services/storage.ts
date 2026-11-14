import type { ProgressState, SettingsState } from '@/types'

/**
 * Accès au stockage local du navigateur.
 * Les données restent sur cet appareil et ne sont pas synchronisées.
 * Toutes les lectures/écritures sont protégées : si le stockage est indisponible
 * (navigation privée stricte, quota plein…), l'application continue de fonctionner en mémoire.
 */

export const STORAGE_KEYS = {
  progress: 'echeance:progress',
  settings: 'echeance:settings',
} as const

export const EXPORT_APP_ID = 'echeance'
export const EXPORT_VERSION = 1

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* stockage indisponible */
  }
}

export function emptyProgress(): ProgressState {
  return {
    version: 1,
    lessonsVisited: [],
    lessonsCompleted: [],
    chaptersCompleted: [],
    exerciseResults: {},
    quizAttempts: [],
    xp: 0,
    badges: {},
    activities: [],
    answerStreak: { current: 0, best: 0 },
    studyDays: [],
    lastPosition: null,
    simulatorComparisons: 0,
  }
}

export function defaultSettings(): SettingsState {
  return { theme: 'system', sound: true, quizTimer: false }
}

// ─── Validation ────────────────────────────────────────────────────────

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

export interface ValidationResult<T> {
  ok: boolean
  value?: T
  errors: string[]
}

export function validateProgress(input: unknown): ValidationResult<ProgressState> {
  const errors: string[] = []
  if (!isObj(input)) return { ok: false, errors: ['La progression doit être un objet.'] }
  const p = input
  if (p.version !== 1) errors.push('Version de progression inconnue.')
  for (const k of ['lessonsVisited', 'lessonsCompleted', 'chaptersCompleted', 'studyDays'] as const) {
    if (!isStrArr(p[k])) errors.push(`Le champ « ${k} » doit être une liste de textes.`)
  }
  if (!isObj(p.exerciseResults)) errors.push('Le champ « exerciseResults » est invalide.')
  else {
    for (const [id, r] of Object.entries(p.exerciseResults)) {
      if (!isObj(r) || !isNum(r.attempts) || typeof r.correct !== 'boolean' || typeof r.firstTryCorrect !== 'boolean' || !isObj(r.lastAnswers)) {
        errors.push(`Résultat d'exercice invalide : ${id}.`)
        break
      }
    }
  }
  if (!Array.isArray(p.quizAttempts)) errors.push('Le champ « quizAttempts » doit être une liste.')
  else if (!p.quizAttempts.every((a) => isObj(a) && typeof a.id === 'string' && typeof a.quizId === 'string' && isNum(a.score) && isNum(a.total) && Array.isArray(a.answers) && isStrArr(a.questionOrder))) {
    errors.push('Une tentative de quiz est invalide.')
  }
  if (!isNum(p.xp) || p.xp < 0) errors.push('Le total d’XP est invalide.')
  if (!isObj(p.badges)) errors.push('Le champ « badges » est invalide.')
  if (!Array.isArray(p.activities)) errors.push('Le champ « activities » doit être une liste.')
  if (!isObj(p.answerStreak) || !isNum(p.answerStreak.current) || !isNum(p.answerStreak.best)) errors.push('La série de bonnes réponses est invalide.')
  if (p.lastPosition !== null && !(isObj(p.lastPosition) && typeof p.lastPosition.lessonId === 'string' && isNum(p.lastPosition.blockIndex))) {
    errors.push('La dernière position est invalide.')
  }
  if (!isNum(p.simulatorComparisons)) errors.push('Le compteur du simulateur est invalide.')
  return errors.length ? { ok: false, errors } : { ok: true, value: p as unknown as ProgressState, errors }
}

export function validateSettings(input: unknown): ValidationResult<SettingsState> {
  if (!isObj(input)) return { ok: false, errors: ['Les préférences doivent être un objet.'] }
  const errors: string[] = []
  if (!['light', 'dark', 'system'].includes(input.theme as string)) errors.push('Thème invalide.')
  if (typeof input.sound !== 'boolean') errors.push('Préférence sonore invalide.')
  if (typeof input.quizTimer !== 'boolean') errors.push('Préférence du chronomètre invalide.')
  return errors.length ? { ok: false, errors } : { ok: true, value: input as unknown as SettingsState, errors }
}

export interface ExportFile {
  app: typeof EXPORT_APP_ID
  version: number
  exportedAt: string
  progress: ProgressState
  settings: SettingsState
}

export function buildExport(progress: ProgressState, settings: SettingsState, now = new Date()): ExportFile {
  return { app: EXPORT_APP_ID, version: EXPORT_VERSION, exportedAt: now.toISOString(), progress, settings }
}

/** Analyse et valide un fichier de sauvegarde avant toute modification des données. */
export function parseImport(text: string): ValidationResult<ExportFile> {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, errors: ["Le fichier n'est pas un JSON valide."] }
  }
  if (!isObj(data)) return { ok: false, errors: ['Format de sauvegarde non reconnu.'] }
  if (data.app !== EXPORT_APP_ID) return { ok: false, errors: ["Ce fichier ne provient pas de l'application Échéance."] }
  if (data.version !== EXPORT_VERSION) return { ok: false, errors: [`Version de sauvegarde non prise en charge (${String(data.version)}).`] }
  const pr = validateProgress(data.progress)
  const st = validateSettings(data.settings)
  const errors = [...pr.errors, ...st.errors]
  if (errors.length) return { ok: false, errors }
  return { ok: true, value: data as unknown as ExportFile, errors: [] }
}
