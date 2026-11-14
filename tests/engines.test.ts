import { describe, expect, it } from 'vitest'
import { buildSchedule, periodicRatePercent } from '@/services/loan'
import { liquidate, tvaFromHT, htFromTTC, tvaRegime } from '@/services/tva'
import { acquisitionCost, disposal, firstYearMonths, impairmentTest, linearPlan, residualValue, unitsPlan } from '@/services/immo'
import { computePay } from '@/services/paie'

describe('Emprunts — TD n°5', () => {
  it('Ex. 1 : 630 000 € à 5,4 % sur 6 ans, trois modalités', () => {
    const inf = buildSchedule({ capital: 630_000, ratePercent: 5.4, years: 6, method: 'in-fine' })
    expect(inf.rows[0].interest).toBe(34_020)
    expect(inf.totalInterest).toBe(204_120)
    expect(inf.rows[5].payment).toBe(664_020)
    const ac = buildSchedule({ capital: 630_000, ratePercent: 5.4, years: 6, method: 'amortissement-constant' })
    expect(ac.rows.map((r) => r.payment)).toEqual([139_020, 133_350, 127_680, 122_010, 116_340, 110_670])
    expect(ac.totalInterest).toBe(119_070)
    const an = buildSchedule({ capital: 630_000, ratePercent: 5.4, years: 6, method: 'annuite-constante' })
    expect(an.constantPayment).toBe(125_713.27)
    expect(an.rows.map((r) => r.interest)).toEqual([34_020, 29_068.56, 23_849.75, 18_349.12, 12_551.45, 6_440.72])
    expect(an.rows[5].payment).toBe(125_713.25)
    expect(an.totalInterest).toBe(124_279.6)
  })

  it('Ex. 2 : taux équivalents 0,407 % et 1,227 %', () => {
    expect(periodicRatePercent(5, 12, 'td')).toBe(0.407)
    expect(periodicRatePercent(5, 4, 'td')).toBe(1.227)
    expect(periodicRatePercent(5, 4)).toBeCloseTo(1.2272, 4)
  })

  it('Ex. 2 : tableaux trimestriel et mensuel de la première année (taux arrondi comme la correction)', () => {
    const q = buildSchedule({ capital: 80_000, ratePercent: 5, years: 4, method: 'amortissement-constant', periodsPerYear: 4, rateRounding: 'td' })
    expect(q.periods).toBe(16)
    expect(q.rows.slice(0, 4).map((r) => r.interest)).toEqual([981.6, 920.25, 858.9, 797.55])
    expect(q.rows[0].principal).toBe(5000)
    expect(q.rows[3].endBalance).toBe(60_000)
    const m = buildSchedule({ capital: 80_000, ratePercent: 5, years: 4, method: 'amortissement-constant', periodsPerYear: 12, rateRounding: 'td' })
    expect(m.rows[0].interest).toBe(325.6)
    expect(m.rows[0].principal).toBe(1666.67)
    expect(m.rows[0].payment).toBe(1992.27)
    expect(m.rows[11].endBalance).toBe(60_000)
    const firstYear = m.rows.slice(0, 12).reduce((s, r) => s + r.interest, 0)
    expect(Math.round(firstYear * 100) / 100).toBe(3459.5)
    const y = buildSchedule({ capital: 80_000, ratePercent: 5, years: 4, method: 'amortissement-constant' })
    expect(y.rows[0].interest).toBe(4000)
    expect(y.rows[0].payment).toBe(24_000)
  })

  it('Exercices du Titre 4', () => {
    const ac = buildSchedule({ capital: 40_000, ratePercent: 2, years: 4, method: 'amortissement-constant' })
    expect(ac.rows.map((r) => r.payment)).toEqual([10_800, 10_600, 10_400, 10_200])
    const an = buildSchedule({ capital: 10_000, ratePercent: 3, years: 5, method: 'annuite-constante' })
    expect(an.constantPayment).toBe(2183.55)
    expect(an.rows.map((r) => r.interest)).toEqual([300, 243.49, 185.29, 125.34, 63.6])
    expect(an.rows[4].payment).toBe(2183.52)
  })
})

describe('TVA — Titre 2 et TD n°1', () => {
  it('calculs HT / TVA / TTC', () => {
    expect(tvaFromHT(5300, 20)).toBe(1060)
    expect(htFromTTC(54_508.56, 20)).toBe(45_423.8)
    expect(htFromTTC(22_534, 20)).toBe(18_778.33)
  })
  it('exemple de janvier (diapositive 46) : 5 150 € à décaisser', () => {
    const r = liquidate({ collectee: 9000, deductibleImmo: 200, deductibleBS: 3650 })
    expect(r.aDecaisser).toBe(5150)
    expect(r.ajustement).toBeNull()
  })
  it('exemple de juin (diapositive 49) : 4 507 € et 0,45 € au compte 658', () => {
    const r = liquidate({ collectee: 40_000, deductibleImmo: 0, deductibleBS: 35_493.45 })
    expect(r.aDecaisser).toBe(4507)
    expect(r.ajustement).toEqual({ account: '658', amount: 0.45 })
    const d = r.entry.lines.reduce((s, l) => s + (l.debit ?? 0), 0)
    const c = r.entry.lines.reduce((s, l) => s + (l.credit ?? 0), 0)
    expect(Math.round(d * 100)).toBe(Math.round(c * 100))
  })
  it('TD n°1, ex. 2 : 9 879 € et 0,09 € au compte 758', () => {
    const collectee = 9084.76 - 3755.67 + 10_000 - 500
    const r = liquidate({ collectee, deductibleImmo: 0, deductibleBS: 4950 })
    expect(r.solde).toBe(9879.09)
    expect(r.aDecaisser).toBe(9879)
    expect(r.ajustement).toEqual({ account: '758', amount: 0.09 })
  })
  it('crédit de TVA : compte 445 67', () => {
    const r = liquidate({ collectee: 1000, deductibleImmo: 0, deductibleBS: 1500 })
    expect(r.credit).toBe(500)
    expect(r.aDecaisser).toBe(0)
    expect(r.entry.lines.find((l) => l.debitAccount === '445 67')?.debit).toBe(500)
  })
  it('régimes (diapositive 47)', () => {
    expect(tvaRegime(50_000, 'biens')).toBe('franchise')
    expect(tvaRegime(50_000, 'services')).toBe('reel-simplifie')
    expect(tvaRegime(900_000, 'biens')).toBe('reel-normal')
  })
})

describe('Immobilisations — Titre 3 et TD n°4', () => {
  it('coût d’acquisition de la machine-outil (diapositive 98)', () => {
    const base = { prixAchat: 10_000, remisePct: 5, fraisDirects: 900, fraisAcquisition: 1000 }
    expect(acquisitionCost({ ...base, methodeReference: true }).cout).toBe(11_400)
    expect(acquisitionCost({ ...base, methodeReference: false }).cout).toBe(10_400)
  })
  it('prorata temporis en mois', () => {
    expect(firstYearMonths(4, true)).toBe(8.5)
    expect(firstYearMonths(6, true)).toBe(6.5)
    expect(firstYearMonths(7, false)).toBe(6)
    expect(firstYearMonths(4, false)).toBe(9)
  })
  it('plan linéaire de l’installation technique (diapositive 105, arrondi à l’euro)', () => {
    const p = linearPlan({ cout: 100_000, valeurResiduelle: 0, dureeAnnees: 5, moisMiseEnService: 4, milieuDeMois: true, rounding: 'euro' })
    expect(p.map((r) => r.dotation)).toEqual([14_167, 20_000, 20_000, 20_000, 20_000, 5833])
    expect(p.map((r) => r.vnc)).toEqual([85_833, 65_833, 45_833, 25_833, 5833, 0])
  })
  it('TD n°4, ex. 2 : mobilier 5 400 € TTC le 15 juin, 5 ans', () => {
    const p = linearPlan({ cout: 4500, valeurResiduelle: 0, dureeAnnees: 5, moisMiseEnService: 6, milieuDeMois: true, rounding: 'cent' })
    expect(p.map((r) => r.dotation)).toEqual([487.5, 900, 900, 900, 900, 412.5])
    expect(p[0].vnc).toBe(4012.5)
  })
  it('TD n°4, ex. 3 : fourgon, valeur résiduelle et plan', () => {
    const vr = residualValue(32_000 * 0.2, 5)
    expect(vr).toBe(6080)
    const p = linearPlan({ cout: 32_000, valeurResiduelle: vr, dureeAnnees: 3, moisMiseEnService: 7, milieuDeMois: false, rounding: 'cent' })
    expect(p.map((r) => r.dotation)).toEqual([4320, 8640, 8640, 4320])
    expect(p.map((r) => r.vnc)).toEqual([27_680, 19_040, 10_400, 6080])
  })
  it('véhicule de la diapositive 109 (base 12 500, 9/12)', () => {
    const p = linearPlan({ cout: 20_000, valeurResiduelle: 7500, dureeAnnees: 4, moisMiseEnService: 4, milieuDeMois: false, rounding: 'euro' })
    expect(p[0].dotation).toBe(2344)
    expect(p[0].vnc).toBe(17_656)
    expect(p[1].dotation).toBe(3125)
  })
  it('unités d’œuvre (diapositive 107)', () => {
    const p = unitsPlan(50_000, 0, [5000, 15_000, 20_000, 20_000, 20_000, 15_000, 5000], 'cent')
    expect(p.map((r) => r.dotation)).toEqual([2500, 7500, 10_000, 10_000, 10_000, 7500, 2500])
    expect(p[6].vnc).toBe(0)
  })
  it('dépréciations : terrain (diapositive 111) et TD n°4 ex. 4 et 5', () => {
    expect(impairmentTest({ vnc: 180_000, valeurVenale: 155_000, valeurUsage: 161_909, depreciationsAnterieures: 0 })).toEqual({ valeurActuelle: 161_909, kind: 'depreciation', amount: 18_091 })
    expect(impairmentTest({ vnc: 200_000, valeurVenale: 180_000, valeurUsage: 150_000, depreciationsAnterieures: 0 }).amount).toBe(20_000)
    expect(impairmentTest({ vnc: 180_000, valeurVenale: 195_000, valeurUsage: 0, depreciationsAnterieures: 20_000 })).toEqual({ valeurActuelle: 195_000, kind: 'reprise', amount: 15_000 })
    expect(impairmentTest({ vnc: 52_500, valeurVenale: 42_000, valeurUsage: 0, depreciationsAnterieures: 0 }).amount).toBe(10_500)
    expect(impairmentTest({ vnc: 30_000, valeurVenale: 37_000, valeurUsage: 0, depreciationsAnterieures: 10_500 }).amount).toBe(7000)
  })
  it('TD n°4, ex. 5 : plans corrigés après dépréciation', () => {
    const p1 = linearPlan({ cout: 42_000, valeurResiduelle: 0, dureeAnnees: 3.5, moisMiseEnService: 1, milieuDeMois: false, rounding: 'cent' })
    expect(p1.map((r) => r.dotation)).toEqual([12_000, 12_000, 12_000, 6000])
    const p2 = linearPlan({ cout: 37_000, valeurResiduelle: 0, dureeAnnees: 2.5, moisMiseEnService: 1, milieuDeMois: false, rounding: 'cent' })
    expect(p2.map((r) => r.dotation)).toEqual([14_800, 14_800, 7400])
  })
  it('plan révisé du véhicule accidenté (diapositive 116)', () => {
    const p = linearPlan({ cout: 12_000, valeurResiduelle: 5000, dureeAnnees: 3, moisMiseEnService: 1, milieuDeMois: false, rounding: 'euro' })
    expect(p.map((r) => r.dotation)).toEqual([2333, 2333, 2334])
    expect(p.map((r) => r.vnc)).toEqual([9667, 7334, 5000])
  })
  it('sortie du véhicule utilitaire (diapositive 118)', () => {
    const d = disposal({
      valeurBrute: 25_000, amortCumulDebut: 15_000, dotationComplementaire: 2500, prixCessionHT: 6000, tauxTVA: 20, paiementDiffere: true,
      compteImmo: '218 2', libelleImmo: 'Matériels de transport', compteAmort: '281 82', libelleAmort: 'Amortissements des matériels de transport',
    })
    expect(d.amortCumul).toBe(17_500)
    expect(d.vnc).toBe(7500)
    expect(d.resultat).toBe(-1500)
    expect(d.entries[0].lines[0]).toMatchObject({ debitAccount: '462', debit: 7200 })
  })
})

describe('Paie — Titre 2, partie 4', () => {
  it('bulletin de la diapositive 87', () => {
    const p = computePay({ brut: 4500, cotisationsSalariales: 999.24, pas: 257.79, cotisationsPatronales: 1836.4 })
    expect(p.netAvantIR).toBe(3500.76)
    expect(p.netPaye).toBe(3242.97)
    expect(p.detteOrganismes).toBe(2835.64)
    for (const e of p.entries) {
      const d = e.lines.reduce((s, l) => s + (l.debit ?? 0), 0)
      const c = e.lines.reduce((s, l) => s + (l.credit ?? 0), 0)
      expect(Math.round(d * 100)).toBe(Math.round(c * 100))
    }
  })
})
