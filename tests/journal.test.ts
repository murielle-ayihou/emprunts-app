import { describe, expect, it } from 'vitest'
import { drillSeries } from '@/data/journal/series'
import { ACCOUNTS } from '@/data/journal/accounts'
import { correctAccounts, defaultAmountQuestions, gradeCase, prepareCase } from '@/services/journalDrill'

const all = drillSeries.flatMap((s) => s.cases.map((c) => ({ s, c })))

describe('entraînement au journal', () => {
  it('a beaucoup de cas aux identifiants uniques', () => {
    expect(all.length).toBeGreaterThanOrEqual(60)
    expect(new Set(all.map(({ s, c }) => `${s.id}:${c.id}`)).size).toBe(all.length)
  })

  it.each(all.map(({ s, c }) => [`${s.id}:${c.id}`, s, c] as const))('%s : écriture équilibrée et questions cohérentes', (_k, s, c) => {
    const d = c.lines.filter((l) => l[0] === 'D').reduce((x, l) => x + l[2], 0)
    const cr = c.lines.filter((l) => l[0] === 'C').reduce((x, l) => x + l[2], 0)
    expect(Math.round(d * 100)).toBe(Math.round(cr * 100))
    for (const l of c.lines) expect(ACCOUNTS[l[1]], l[1]).toBeTruthy()
    for (let run = 0; run < 5; run++) {
      const p = prepareCase(s, c)
      for (const a of correctAccounts(c, 'D')) expect(p.debitOptions).toContain(a)
      for (const a of correctAccounts(c, 'C')) expect(p.creditOptions).toContain(a)
      for (const a of p.debitOptions) expect(ACCOUNTS[a], a).toBeTruthy()
      expect(p.amountQs.length).toBeGreaterThanOrEqual(1)
      for (const q of p.amountQs) {
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size).toBe(q.options.length)
        expect(q.options.length).toBeGreaterThanOrEqual(4)
      }
      const perfect = gradeCase(p, { debit: correctAccounts(c, 'D'), credit: correctAccounts(c, 'C'), amounts: p.amountQs.map((q) => q.answer) })
      expect(perfect.points).toBe(perfect.total)
    }
  })

  it('pose les mêmes questions que l’épreuve pour un règlement', () => {
    const c = drillSeries[0].cases.find((x) => x.id === 'm-2009')!
    expect(defaultAmountQuestions(c).map((q) => q.answer)).toEqual([7800, 7800])
  })

  it('un compte en trop rend la réponse fausse', () => {
    const s = drillSeries[0]
    const p = prepareCase(s, s.cases[0])
    const g = gradeCase(p, { debit: ['411', '44566'], credit: correctAccounts(s.cases[0], 'C'), amounts: [120000, 20000] })
    expect(g.debit).toBe(false)
    expect(g.points).toBe(3)
  })
})
