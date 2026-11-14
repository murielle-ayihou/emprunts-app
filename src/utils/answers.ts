/**
 * Lecture tolérante des réponses saisies par l'étudiant.
 *
 * Formats acceptés pour un nombre :
 *   « 11445,71 » « 11 445,71 » « 11445.71 » « 11,445.71 » « 11 445,71 € » « 4 % » « -2,5 »
 */
export function parseNumber(raw: string): number | null {
  if (raw == null) return null
  let s = String(raw).trim()
  if (!s) return null
  // Retire unités et symboles courants
  s = s.replace(/€|eur(os?)?|%/gi, '').trim()
  // Uniformise le signe moins
  s = s.replace(/[−–]/g, '-')
  // Retire tous les types d'espaces (séparateurs de milliers)
  s = s.replace(/[\s  ']/g, '')
  if (!s) return null

  const hasComma = s.includes(',')
  const hasDot = s.includes('.')
  if (hasComma && hasDot) {
    // Le dernier séparateur rencontré est le séparateur décimal
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(/,/g, '')
    }
  } else if (hasComma) {
    const parts = s.split(',')
    if (parts.length > 2) {
      // « 1,000,000 » : virgules = milliers
      s = parts.join('')
    } else {
      s = s.replace(',', '.')
    }
  } else if (hasDot) {
    const parts = s.split('.')
    if (parts.length > 2) s = parts.join('')
    // « 60.000 » : un point suivi d'exactement 3 chiffres = séparateur de milliers (usage courant pour les montants)
    else if (/^-?[1-9]\d{0,2}\.\d{3}$/.test(s)) s = parts.join('')
  }

  if (!/^-?\d+(\.\d+)?$/.test(s)) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Tolérance par défaut : 1 centime (les montants du cours sont arrondis au centime). */
export const DEFAULT_TOLERANCE = 0.011

export function isNumberCorrect(raw: string, expected: number, tolerance = DEFAULT_TOLERANCE): boolean {
  const n = parseNumber(raw)
  if (n === null) return false
  return Math.abs(n - expected) <= tolerance
}

/** Normalise un texte : minuscules, sans accents, sans ponctuation superflue, espaces réduits. */
export function normalizeText(raw: string): string {
  return String(raw ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[«»"'’.,;:!?()–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isTextCorrect(raw: string, accepted: string[]): boolean {
  const n = normalizeText(raw)
  if (!n) return false
  return accepted.some((a) => normalizeText(a) === n)
}

/** Mélange de Fisher–Yates (non destructif). */
export function shuffle<T>(arr: readonly T[], rand: () => number = Math.random): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
