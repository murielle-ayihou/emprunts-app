import { describe, expect, it } from 'vitest'
import { buildExport, defaultSettings, emptyProgress, parseImport, validateProgress } from '@/services/storage'
import { earnedBadges, levelFromXp, quizXp, studyDayStreak, dayKey } from '@/services/gamification'
import { lessons } from '@/data/lessons'

describe('Export / import', () => {
  it('un export se réimporte à l’identique', () => {
    const p = emptyProgress()
    p.xp = 120
    p.lessonsCompleted = ['l-definition']
    const file = buildExport(p, defaultSettings())
    const res = parseImport(JSON.stringify(file))
    expect(res.ok).toBe(true)
    expect(res.value!.progress.xp).toBe(120)
  })
  it('refuse un JSON invalide', () => {
    expect(parseImport('{pas du json').ok).toBe(false)
  })
  it('refuse un fichier d’une autre application', () => {
    expect(parseImport(JSON.stringify({ app: 'autre', version: 1 })).ok).toBe(false)
  })
  it('refuse une progression corrompue', () => {
    const file = buildExport(emptyProgress(), defaultSettings()) as unknown as Record<string, unknown>
    ;(file.progress as Record<string, unknown>).xp = -5
    ;(file.progress as Record<string, unknown>).lessonsCompleted = 'oops'
    const res = parseImport(JSON.stringify(file))
    expect(res.ok).toBe(false)
    expect(res.errors.length).toBeGreaterThanOrEqual(2)
  })
  it('valide une progression vide', () => {
    expect(validateProgress(emptyProgress()).ok).toBe(true)
  })
})

describe('Gamification', () => {
  it('niveaux', () => {
    expect(levelFromXp(0).level).toBe(1)
    expect(levelFromXp(59).level).toBe(1)
    expect(levelFromXp(60).level).toBe(2)
    expect(levelFromXp(99999).nextLevelXp).toBeNull()
  })
  it('XP de quiz', () => {
    expect(quizXp(0, 10)).toBe(0)
    expect(quizXp(8, 10)).toBe(8 * 3 + 20)
    expect(quizXp(10, 10)).toBe(30 + 30)
  })
  it('série de jours', () => {
    const today = new Date(2026, 10, 13)
    const d = (offset: number) => {
      const x = new Date(today)
      x.setDate(x.getDate() - offset)
      return dayKey(x)
    }
    expect(studyDayStreak([d(0), d(1), d(2)], today)).toBe(3)
    expect(studyDayStreak([d(1), d(2)], today)).toBe(2)
    expect(studyDayStreak([d(0), d(2)], today)).toBe(1)
    expect(studyDayStreak([], today)).toBe(0)
  })
  it('badges débloqués seulement sur conditions réelles', () => {
    const p = emptyProgress()
    expect(earnedBadges(p)).toEqual([])
    p.lessonsCompleted = ['l-definition']
    expect(earnedBadges(p)).toContain('premier-pas')
    p.lessonsCompleted = lessons.map((l) => l.id)
    p.chaptersCompleted = ['ch1']
    expect(earnedBadges(p)).toEqual(expect.arrayContaining(['explorateur', 'diplome']))
    p.quizAttempts = [{ id: 'a', quizId: 'qs-defi', date: '', questionOrder: [], answers: [], score: 9, total: 10, durationSec: 0, timed: false }]
    expect(earnedBadges(p)).toEqual(expect.arrayContaining(['challenger', 'expert']))
    expect(earnedBadges(p)).not.toContain('sans-faute')
  })
})
