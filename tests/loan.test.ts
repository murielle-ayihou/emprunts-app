import { describe, expect, it } from 'vitest'
import { buildSchedule, constantAnnuity, periodicInterest, roundCents, validateParams } from '@/services/loan'
import { explainComparison } from '@/services/loanCompare'
import { examples } from '@/data/examples'

/** Convertit une ligne de tableau du cours (« 9 045,71 ») en nombre. */
function n(v: string | number): number {
  return typeof v === 'number' ? v : Number(String(v).replace(/\s| /g, '').replace(',', '.'))
}

const base = { capital: 60_000, ratePercent: 4, years: 6 }

describe('Formules de base (p. 121)', () => {
  it('intérêts = capital restant dû × taux', () => {
    expect(periodicInterest(60_000, 4)).toBe(2400)
    expect(periodicInterest(50_954.29, 4)).toBe(2038.17)
  })
  it('annuité constante = C × i / (1 − (1+i)^−n) → 11 445,71 € (p. 125)', () => {
    expect(roundCents(constantAnnuity(60_000, 4, 6))).toBe(11_445.71)
  })
  it('taux nul : annuité = C / n (limite de la formule)', () => {
    expect(constantAnnuity(60_000, 0, 6)).toBe(10_000)
  })
})

describe('Tableaux d’amortissement du cours (60 000 €, 4 %, 6 ans)', () => {
  const cases = [
    { method: 'in-fine' as const, exampleId: 'ex-in-fine' },
    { method: 'amortissement-constant' as const, exampleId: 'ex-amort-constant' },
    { method: 'annuite-constante' as const, exampleId: 'ex-annuite-constante' },
  ]
  for (const c of cases) {
    it(`${c.method} reproduit exactement le tableau du PDF`, () => {
      const sched = buildSchedule({ ...base, method: c.method })
      const table = examples.find((e) => e.id === c.exampleId)!.table!
      expect(sched.rows).toHaveLength(table.rows.length)
      table.rows.forEach((row, idx) => {
        const r = sched.rows[idx]
        expect(r.startBalance).toBe(n(row[1]))
        expect(r.interest).toBe(n(row[2]))
        expect(r.principal).toBe(n(row[3]))
        // Le cours affiche 11 445,71 en N+5 : notre moteur montre l'échéance réelle (11 445,74)
        if (!(c.method === 'annuite-constante' && idx === 5)) expect(r.payment).toBe(n(row[4]))
        expect(r.endBalance).toBe(n(row[5]))
      })
    })
  }

  it('in fine : coût total 14 400 €, dernière annuité 62 400 €', () => {
    const s = buildSchedule({ ...base, method: 'in-fine' })
    expect(s.totalInterest).toBe(14_400)
    expect(s.rows[5].payment).toBe(62_400)
    expect(s.totalPaid).toBe(74_400)
  })
  it('amortissement constant : coût total 8 400 €', () => {
    const s = buildSchedule({ ...base, method: 'amortissement-constant' })
    expect(s.totalInterest).toBe(8400)
    expect(s.rows.map((r) => r.payment)).toEqual([12_400, 12_000, 11_600, 11_200, 10_800, 10_400])
  })
  it('annuité constante : coût total 8 674,29 € et écart d’arrondi de 0,03 € sur la dernière échéance', () => {
    const s = buildSchedule({ ...base, method: 'annuite-constante' })
    expect(s.totalInterest).toBe(8674.29)
    expect(s.constantPayment).toBe(11_445.71)
    expect(s.rows[5].payment).toBe(11_445.74)
    expect(s.lastPaymentAdjustment).toBe(0.03)
    expect(s.totalPrincipal).toBe(60_000)
  })
})

describe('Cas limites', () => {
  const methods = ['in-fine', 'amortissement-constant', 'annuite-constante'] as const

  it('taux nul : aucun intérêt, capital intégralement remboursé', () => {
    for (const method of methods) {
      const s = buildSchedule({ capital: 10_000, ratePercent: 0, years: 4, method })
      expect(s.totalInterest).toBe(0)
      expect(s.totalPrincipal).toBe(10_000)
      expect(s.rows.at(-1)!.endBalance).toBe(0)
    }
  })

  it('durée de 1 an : une seule échéance = capital + intérêts', () => {
    for (const method of methods) {
      const s = buildSchedule({ capital: 5000, ratePercent: 3, years: 1, method })
      expect(s.rows).toHaveLength(1)
      expect(s.rows[0].payment).toBe(5150)
    }
  })

  it('montants faibles et élevés : capital restant dû final = 0 et somme des amortissements = capital', () => {
    const configs = [
      { capital: 100, ratePercent: 7.5, years: 3 },
      { capital: 1234.56, ratePercent: 2.35, years: 7 },
      { capital: 250_000_000, ratePercent: 5.1, years: 25 },
      { capital: 1, ratePercent: 1, years: 3 },
    ]
    for (const cfg of configs) {
      for (const method of methods) {
        const s = buildSchedule({ ...cfg, method })
        expect(s.rows.at(-1)!.endBalance).toBe(0)
        expect(s.totalPrincipal).toBeCloseTo(cfg.capital, 2)
        for (const r of s.rows) {
          expect(roundCents(r.principal + r.interest)).toBe(r.payment)
          expect(roundCents(r.startBalance - r.principal)).toBe(r.endBalance)
          expect(r.principal).toBeGreaterThanOrEqual(0)
        }
        // Continuité : capital fin de période = capital début de la période suivante
        for (let k = 1; k < s.rows.length; k++) expect(s.rows[k].startBalance).toBe(s.rows[k - 1].endBalance)
      }
    }
  })

  it('amortissement constant non divisible : centimes répartis pour que le cumul suive C × p / n', () => {
    const s = buildSchedule({ capital: 10_000, ratePercent: 5, years: 3, method: 'amortissement-constant' })
    expect(s.rows.map((r) => r.principal)).toEqual([3333.33, 3333.34, 3333.33])
    expect(s.rows.map((r) => r.endBalance)).toEqual([6666.67, 3333.33, 0])
  })

  it('annuité constante : écart de la dernière échéance limité à 1 centime par échéance au maximum', () => {
    for (let years = 2; years <= 40; years++) {
      const s = buildSchedule({ capital: 87_650, ratePercent: 3.7, years, method: 'annuite-constante' })
      expect(Math.abs(s.lastPaymentAdjustment)).toBeLessThanOrEqual(years * 0.01)
    }
  })

  it('refuse les paramètres invalides', () => {
    expect(validateParams({ capital: 0, ratePercent: 4, years: 6, method: 'in-fine' })).not.toHaveLength(0)
    expect(validateParams({ capital: 1000, ratePercent: -1, years: 6, method: 'in-fine' })).not.toHaveLength(0)
    expect(validateParams({ capital: 1000, ratePercent: 4, years: 2.5, method: 'in-fine' })).not.toHaveLength(0)
    expect(() => buildSchedule({ capital: NaN, ratePercent: 4, years: 6, method: 'in-fine' })).toThrow()
  })
})

describe('Comparaison de scénarios', () => {
  it('explique qu’un taux plus élevé augmente les intérêts', () => {
    const a = buildSchedule({ ...base, method: 'annuite-constante' })
    const b = buildSchedule({ ...base, ratePercent: 5, method: 'annuite-constante' })
    const lines = explainComparison([
      { name: 'Scénario A', schedule: a },
      { name: 'Scénario B', schedule: b },
    ])
    expect(lines[0]).toContain('en plus')
    expect(lines.join(' ')).toContain('Seul le taux change')
  })
})
