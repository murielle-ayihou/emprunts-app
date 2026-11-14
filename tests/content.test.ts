import { describe, expect, it } from 'vitest'
import { chapters } from '@/data/chapters'
import { lessons } from '@/data/lessons'
import { exercises } from '@/data/exercises'
import { quizQuestions, quizSeries } from '@/data/quizzes'
import { formulas } from '@/data/formulas'
import { examples } from '@/data/examples'
import { glossary } from '@/data/glossary'
import { badges } from '@/data/badges'
import { buildSchedule, constantAnnuity, roundCents } from '@/services/loan'
import { isNumberCorrect, isTextCorrect, normalizeText, parseNumber, shuffle } from '@/utils/answers'

const unique = (arr: string[]) => new Set(arr).size === arr.length

describe('Intégrité du contenu', () => {
  it('identifiants uniques', () => {
    expect(unique(chapters.map((c) => c.id))).toBe(true)
    expect(unique(lessons.map((l) => l.id))).toBe(true)
    expect(unique(exercises.map((e) => e.id))).toBe(true)
    expect(unique(quizQuestions.map((q) => q.id))).toBe(true)
    expect(unique(quizSeries.map((q) => q.id))).toBe(true)
    expect(unique(badges.map((b) => b.id))).toBe(true)
  })

  it('chaque chapitre référence des leçons existantes, dans le bon chapitre', () => {
    for (const c of chapters) {
      for (const id of c.lessonIds) {
        const l = lessons.find((x) => x.id === id)
        expect(l, id).toBeDefined()
        expect(l!.chapterId).toBe(c.id)
      }
    }
    expect(chapters.flatMap((c) => c.lessonIds).length).toBe(lessons.length)
  })

  it('les blocs de leçon référencent des formules et exemples existants', () => {
    for (const l of lessons) {
      for (const b of l.blocks) {
        if (b.type === 'formula') expect(formulas.some((f) => f.id === b.formulaId), b.formulaId).toBe(true)
        if (b.type === 'example') expect(examples.some((e) => e.id === b.exampleId), b.exampleId).toBe(true)
        if (b.type === 'quickcheck') expect(b.check.answer).toBeLessThan(b.check.options.length)
      }
    }
  })

  it('exercices : liés à un chapitre/leçon valides et réponses cohérentes', () => {
    for (const e of exercises) {
      const l = lessons.find((x) => x.id === e.lessonId)
      expect(l, e.id).toBeDefined()
      expect(l!.chapterId).toBe(e.chapterId)
      expect(e.inputs.length).toBeGreaterThan(0)
      for (const inp of e.inputs) {
        if (inp.type === 'choice') expect(inp.answer).toBeLessThan(inp.options.length)
        if (inp.type === 'text') expect(inp.answers.length).toBeGreaterThan(0)
      }
    }
    // chaque chapitre a des exercices, et les trois niveaux sont représentés
    for (const c of chapters) expect(exercises.some((e) => e.chapterId === c.id)).toBe(true)
    for (const lvl of ['debutant', 'intermediaire', 'avance']) expect(exercises.some((e) => e.level === lvl)).toBe(true)
  })

  it('quiz : séries valides et questions existantes', () => {
    for (const s of quizSeries) {
      expect(s.questionIds.length).toBeGreaterThanOrEqual(10)
      for (const id of s.questionIds) expect(quizQuestions.some((q) => q.id === id), id).toBe(true)
    }
    for (const q of quizQuestions) {
      expect(lessons.find((l) => l.id === q.lessonId)?.chapterId).toBe(q.chapterId)
      if (q.type !== 'numerique') expect(q.answer).toBeLessThan(q.options.length)
    }
  })

  it('glossaire relié à des leçons existantes', () => {
    for (const g of glossary) expect(lessons.some((l) => l.id === g.lessonId)).toBe(true)
  })
})

describe('Réponses numériques vérifiées par le moteur', () => {
  const ex = (id: string, input = 'a') => {
    const inp = exercises.find((e) => e.id === id)!.inputs.find((i) => i.id === input)!
    return inp.type === 'number' ? inp.answer : NaN
  }
  const qz = (id: string) => {
    const q = quizQuestions.find((x) => x.id === id)!
    return q.type === 'numerique' ? q.answer : NaN
  }

  it('in fine 50 000 € / 6 % / 5 ans', () => {
    const s = buildSchedule({ capital: 50_000, ratePercent: 6, years: 5, method: 'in-fine' })
    expect(ex('ex-3-03')).toBe(s.rows[0].payment)
    expect(ex('ex-3-04')).toBe(s.rows[4].payment)
    expect(ex('ex-3-05')).toBe(s.totalInterest)
    expect(ex('ex-4-08', 'b')).toBe(s.rows[1].interest)
    expect(ex('ex-4-08', 'a')).toBe(s.rows[1].principal)
  })
  it('amortissement constant 48 000 € / 5 % / 8 ans', () => {
    const s = buildSchedule({ capital: 48_000, ratePercent: 5, years: 8, method: 'amortissement-constant' })
    expect(ex('ex-3-06')).toBe(s.rows[0].principal)
    expect(ex('ex-3-07', 'a')).toBe(s.rows[0].interest)
    expect(ex('ex-3-07', 'b')).toBe(s.rows[0].payment)
    expect(ex('ex-3-07', 'c')).toBe(s.rows[0].endBalance)
    expect(ex('ex-3-08', 'a')).toBe(s.rows[2].interest)
    expect(ex('ex-3-08', 'b')).toBe(s.rows[2].payment)
    expect(ex('ex-3-09')).toBe(s.totalInterest)
    expect(ex('ex-4-05', 'c')).toBe(s.rows[0].payment)
  })
  it('annuités constantes', () => {
    const s = buildSchedule({ capital: 20_000, ratePercent: 5, years: 5, method: 'annuite-constante' })
    expect(ex('ex-3-12')).toBe(s.constantPayment)
    expect(ex('ex-3-13', 'b')).toBe(s.rows[0].principal)
    expect(ex('ex-3-13', 'c')).toBe(s.rows[0].endBalance)
    expect(ex('ex-3-14')).toBe(roundCents(constantAnnuity(100_000, 3, 10)))
    expect(Math.abs(ex('ex-3-11') - (1 - Math.pow(1.05, -5)))).toBeLessThan(0.0001)
    expect(qz('q24')).toBe(roundCents(constantAnnuity(50_000, 2, 4)))
  })
  it('emprunt du cours', () => {
    const ann = buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: 'annuite-constante' })
    const ac = buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: 'amortissement-constant' })
    const inf = buildSchedule({ capital: 60_000, ratePercent: 4, years: 6, method: 'in-fine' })
    expect(ex('ex-3-17', 'a')).toBe(ann.rows[1].interest)
    expect(ex('ex-3-17', 'b')).toBe(ann.rows[1].principal)
    expect(ex('ex-3-17', 'c')).toBe(ann.rows[1].endBalance)
    expect(ex('ex-3-19')).toBe(inf.totalInterest - ac.totalInterest)
    expect(ex('ex-4-07', 'a')).toBe(ann.rows[2].principal)
    expect(ex('ex-4-07', 'b')).toBe(ann.rows[2].interest)
    expect(qz('q09')).toBe(ann.rows[5].interest)
    expect(qz('q14')).toBe(ann.rows[2].endBalance)
    expect(qz('q21')).toBe(ac.rows[3].payment)
    expect(qz('q23')).toBe(ann.constantPayment)
    expect(qz('q30')).toBe(ann.totalInterest)
    expect(qz('q32')).toBe(ac.totalPaid)
    expect(qz('q37')).toBe(ac.rows[2].interest)
    expect(qz('q38')).toBe(ann.rows[4].principal)
    expect(qz('q41')).toBe(inf.totalInterest)
  })
  it('autres cas', () => {
    expect(ex('ex-3-20', 'a')).toBe(buildSchedule({ capital: 30_000, ratePercent: 5, years: 3, method: 'in-fine' }).totalInterest)
    expect(ex('ex-3-20', 'b')).toBe(buildSchedule({ capital: 30_000, ratePercent: 5, years: 3, method: 'amortissement-constant' }).totalInterest)
    expect(qz('q19')).toBe(buildSchedule({ capital: 80_000, ratePercent: 3, years: 4, method: 'in-fine' }).rows[3].payment)
    expect(qz('q27')).toBe(buildSchedule({ capital: 30_000, ratePercent: 6, years: 3, method: 'amortissement-constant' }).totalInterest)
  })
})

describe('Lecture des réponses', () => {
  it('accepte les différents formats de saisie', () => {
    expect(parseNumber('11445,71')).toBe(11445.71)
    expect(parseNumber('11 445,71')).toBe(11445.71)
    expect(parseNumber('11 445,71 €')).toBe(11445.71)
    expect(parseNumber('11445.71')).toBe(11445.71)
    expect(parseNumber('11,445.71')).toBe(11445.71)
    expect(parseNumber('11.445,71')).toBe(11445.71)
    expect(parseNumber('60.000')).toBe(60000)
    expect(parseNumber('60 000')).toBe(60000)
    expect(parseNumber('4 %')).toBe(4)
    expect(parseNumber('0,2165')).toBe(0.2165)
    expect(parseNumber('−3')).toBe(-3)
    expect(parseNumber('abc')).toBeNull()
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('12,3,4')).toBe(1234)
  })
  it('applique la tolérance', () => {
    expect(isNumberCorrect('11445,71', 11445.71)).toBe(true)
    expect(isNumberCorrect('11445,7', 11445.71)).toBe(true)
    expect(isNumberCorrect('11445,73', 11445.71)).toBe(false)
    expect(isNumberCorrect('11445,74', 11445.71, 0.05)).toBe(true)
    expect(isNumberCorrect('1 270,52', 1270.52)).toBe(true)
  })
  it('compare les textes sans tenir compte des accents ni de la casse', () => {
    expect(normalizeText('  Intérêts  ')).toBe('interets')
    expect(isTextCorrect('INTERETS', ['intérêts'])).toBe(true)
    expect(isTextCorrect('512 - Banque', ['512 banque'])).toBe(true)
    expect(isTextCorrect('', ['x'])).toBe(false)
  })
  it('mélange sans perdre d’éléments', () => {
    const a = [1, 2, 3, 4, 5, 6]
    const s = shuffle(a)
    expect(s.slice().sort()).toEqual(a)
    expect(a).toEqual([1, 2, 3, 4, 5, 6])
  })
})
