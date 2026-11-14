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

import { liquidate, tvaFromHT, htFromTTC } from '@/services/tva'
import { linearPlan, residualValue, impairmentTest, disposal, acquisitionCost } from '@/services/immo'
import { computePay } from '@/services/paie'

describe('Réponses des Titres 1 à 3 vérifiées par les moteurs', () => {
  const ans = (id: string, input = 'a') => {
    const inp = exercises.find((e) => e.id === id)!.inputs.find((i) => i.id === input)!
    return inp.type === 'number' ? inp.answer : NaN
  }
  it('Titre 1', () => {
    expect(ans('ex-t1-06', 'b')).toBe(4226 + 4000 - 2100)
    expect(ans('ex-t1-07')).toBe(826 + 1000 + 1829 - (65 + 94 + 124 + 1500))
    expect(ans('ex-t1-08', 'c')).toBe(2660 + 84_000 + 50_400 + 67_200 - (68_530 + 14_000 + 60_865))
    const actif = 82_000 + 320_000 + 87_500 + 6400 + 11_000 + 9800 + 53_000 + 38_000 + 1800
    expect(ans('ex-t1-10', 'a')).toBe(actif)
    expect(ans('ex-t1-10', 'b')).toBe(actif - (250_000 + 80_000 + 109_400 + 153_000))
  })
  it('Titre 2', () => {
    expect(ans('ex-t2-01', 'a')).toBe(tvaFromHT(5300, 20))
    expect(ans('ex-t2-02', 'a')).toBe(htFromTTC(54_508.56, 20))
    const r = liquidate({ collectee: ans('ex-t2-04', 'a'), deductibleImmo: 0, deductibleBS: 4950 })
    expect(ans('ex-t2-04', 'b')).toBe(r.solde)
    expect(ans('ex-t2-04', 'c')).toBe(r.aDecaisser)
    expect(ans('ex-t2-06')).toBe(liquidate({ collectee: 40_000, deductibleImmo: 0, deductibleBS: 35_493.45 }).aDecaisser)
    expect(ans('ex-t2-10', 'b')).toBe(tvaFromHT(13_400, 20))
    const p = computePay({ brut: 4500, cotisationsSalariales: 999.24, pas: 257.79, cotisationsPatronales: 1836.4 })
    expect(ans('ex-t2-13', 'b')).toBe(p.netPaye)
    expect(ans('ex-t2-13', 'c')).toBe(p.coutTotal)
    expect(ans('ex-t2-14', 'a')).toBe(15_000 - 2500 - 1300)
  })
  it('Titre 3', () => {
    const p = linearPlan({ cout: 4500, valeurResiduelle: 0, dureeAnnees: 5, moisMiseEnService: 6, milieuDeMois: true, rounding: 'cent' })
    expect([ans('ex-t3-02', 'b'), ans('ex-t3-02', 'c'), ans('ex-t3-02', 'd')]).toEqual([p[0].dotation, p[1].dotation, p[5].dotation])
    const vr = residualValue(6400, 5)
    expect(ans('ex-t3-04', 'a')).toBe(vr)
    expect(ans('ex-t3-04', 'c')).toBe(linearPlan({ cout: 32_000, valeurResiduelle: vr, dureeAnnees: 3, moisMiseEnService: 7, milieuDeMois: false, rounding: 'cent' })[0].dotation)
    expect(ans('ex-t3-05', 'b')).toBe(impairmentTest({ vnc: 180_000, valeurVenale: 195_000, valeurUsage: 0, depreciationsAnterieures: 20_000 }).amount)
    expect(ans('ex-t3-07', 'a')).toBe(acquisitionCost({ prixAchat: 10_000, remisePct: 5, fraisDirects: 900, fraisAcquisition: 1000, methodeReference: true }).cout)
    const d = disposal({ valeurBrute: 25_000, amortCumulDebut: 15_000, dotationComplementaire: 2500, prixCessionHT: 6000, tauxTVA: 20, paiementDiffere: true, compteImmo: '218 2', libelleImmo: '', compteAmort: '281 82', libelleAmort: '' })
    expect(ans('ex-t3-09', 'b')).toBe(d.vnc)
    expect(ans('ex-t3-09', 'd')).toBe(d.resultat)
  })
})
