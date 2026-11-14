/**
 * Moteur de calcul des emprunts — fidèle au support de cours (Titre 4, p. 121 à 125).
 *
 * Règles du cours :
 *  - Intérêts périodiques = Capital restant dû × Taux d'intérêt
 *  - Paiement périodique  = Amortissement du capital + Intérêts périodiques
 *  - In fine              : le capital est amorti en une seule fois au terme de l'emprunt
 *  - Amortissement constant : Amortissement = Capital emprunté / nombre d'échéances
 *  - Annuité constante    : Annuité = Capital × i / (1 − (1 + i)^−n)
 *
 * Périodicité (TD n°5, exercice 2) : pour des échéances mensuelles, trimestrielles ou semestrielles,
 * on utilise le taux équivalent i_k = (1 + i)^(1/k) − 1, et n = durée × k échéances.
 * La correction du TD arrondit ce taux à 3 décimales en % (0,407 % ; 1,227 %) : option « td ».
 *
 * Arrondis : tous les montants sont arrondis au centime à chaque ligne (comme dans le cours).
 * La dernière ligne rembourse exactement le capital restant dû ; l'écart d'arrondi accumulé
 * apparaît donc sur la dernière échéance (ex. 11 445,74 au lieu de 11 445,71 dans le cours).
 */

export type LoanMethod = 'in-fine' | 'amortissement-constant' | 'annuite-constante'

export interface LoanParams {
  /** Capital emprunté en euros */
  capital: number
  /** Taux d'intérêt annuel en pourcentage (4 pour 4 %) */
  ratePercent: number
  /** Durée en années (= nombre d'échéances annuelles) */
  years: number
  method: LoanMethod
  /** Nombre d'échéances par an : 1 (annuelle, par défaut), 2, 4 ou 12 */
  periodsPerYear?: PeriodsPerYear
  /** « exact » (par défaut) ou « td » : taux périodique arrondi à 3 décimales en %, comme la correction du TD n°5 */
  rateRounding?: 'exact' | 'td'
}

export type PeriodsPerYear = 1 | 2 | 4 | 12

export const PERIOD_LABELS: Record<PeriodsPerYear, { adj: string; payment: string }> = {
  1: { adj: 'Annuelle', payment: 'Annuité' },
  2: { adj: 'Semestrielle', payment: 'Semestrialité' },
  4: { adj: 'Trimestrielle', payment: 'Trimestrialité' },
  12: { adj: 'Mensuelle', payment: 'Mensualité' },
}

/** Taux périodique équivalent, en % : (1 + i)^(1/k) − 1. */
export function periodicRatePercent(annualPercent: number, k: PeriodsPerYear, rounding: 'exact' | 'td' = 'exact'): number {
  if (k === 1) return annualPercent
  const r = (Math.pow(1 + annualPercent / 100, 1 / k) - 1) * 100
  return rounding === 'td' ? Math.round(r * 1000) / 1000 : r
}

export interface LoanRow {
  /** Numéro de l'échéance (1 = année N) */
  period: number
  startBalance: number
  interest: number
  principal: number
  payment: number
  endBalance: number
}

export interface LoanSchedule {
  params: LoanParams
  rows: LoanRow[]
  totalInterest: number
  totalPrincipal: number
  totalPaid: number
  /** Annuité théorique (constante) pour la méthode annuité constante, sinon null */
  constantPayment: number | null
  /** Écart d'arrondi reporté sur la dernière échéance (en euros, peut être 0) */
  lastPaymentAdjustment: number
  /** Taux appliqué à chaque échéance, en % */
  periodRatePercent: number
  /** Nombre total d'échéances */
  periods: number
}

export const METHOD_LABELS: Record<LoanMethod, string> = {
  'in-fine': 'In fine',
  'amortissement-constant': 'Amortissement constant',
  'annuite-constante': 'Annuité constante',
}

export const LIMITS = {
  capitalMin: 1,
  capitalMax: 1_000_000_000,
  rateMin: 0,
  rateMax: 30,
  yearsMin: 1,
  yearsMax: 40,
} as const

/** Arrondi monétaire au centime, robuste aux erreurs de virgule flottante. */
export function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function toCents(value: number): number {
  return Math.round(value * 100)
}

function fromCents(cents: number): number {
  return cents / 100
}

/** Intérêts d'une période = capital restant dû × taux. */
export function periodicInterest(balance: number, ratePercent: number): number {
  return roundCents((balance * ratePercent) / 100)
}

/**
 * Annuité constante non arrondie : C × i / (1 − (1 + i)^−n).
 * Pour un taux nul, la formule n'est pas définie (division par 0) : on prend la limite C / n.
 */
export function constantAnnuity(capital: number, ratePercent: number, years: number): number {
  const i = ratePercent / 100
  if (i === 0) return capital / years
  return (capital * i) / (1 - Math.pow(1 + i, -years))
}

/** Amortissement constant = capital emprunté / nombre d'échéances. */
export function constantPrincipal(capital: number, years: number): number {
  return capital / years
}

export function validateParams(p: LoanParams): string[] {
  const errors: string[] = []
  if (!Number.isFinite(p.capital) || p.capital < LIMITS.capitalMin || p.capital > LIMITS.capitalMax) {
    errors.push(`Le capital doit être compris entre ${LIMITS.capitalMin} € et ${LIMITS.capitalMax.toLocaleString('fr-FR')} €.`)
  }
  if (!Number.isFinite(p.ratePercent) || p.ratePercent < LIMITS.rateMin || p.ratePercent > LIMITS.rateMax) {
    errors.push(`Le taux doit être compris entre ${LIMITS.rateMin} % et ${LIMITS.rateMax} %.`)
  }
  if (!Number.isInteger(p.years) || p.years < LIMITS.yearsMin || p.years > LIMITS.yearsMax) {
    errors.push(`La durée doit être un nombre entier d'années entre ${LIMITS.yearsMin} et ${LIMITS.yearsMax}.`)
  }
  if (p.periodsPerYear !== undefined && ![1, 2, 4, 12].includes(p.periodsPerYear)) {
    errors.push('La périodicité doit être annuelle, semestrielle, trimestrielle ou mensuelle.')
  }
  return errors
}

export function buildSchedule(params: LoanParams): LoanSchedule {
  const errors = validateParams(params)
  if (errors.length) throw new Error(errors.join(' '))

  const { capital, years, method } = params
  const k = params.periodsPerYear ?? 1
  const ratePercent = periodicRatePercent(params.ratePercent, k, params.rateRounding ?? 'exact')
  const n = years * k
  const rows: LoanRow[] = []
  let balanceCents = toCents(capital)

  const regularAnnuityCents = method === 'annuite-constante' ? toCents(constantAnnuity(capital, ratePercent, n)) : 0
  const regularPrincipalCents = method === 'amortissement-constant' ? toCents(constantPrincipal(capital, n)) : 0

  for (let period = 1; period <= n; period++) {
    const isLast = period === n
    const startCents = balanceCents
    const interestCents = toCents(periodicInterest(fromCents(startCents), ratePercent))

    let principalCents: number
    if (isLast) {
      principalCents = startCents
    } else if (method === 'in-fine') {
      principalCents = 0
    } else if (method === 'amortissement-constant') {
      // Parts égales réparties au centime près : le cumul suit C × p / n (comme la correction du TD n°5)
      principalCents = Math.round((toCents(capital) * period) / n) - Math.round((toCents(capital) * (period - 1)) / n)
    } else {
      principalCents = regularAnnuityCents - interestCents
    }
    // Garde-fou : on ne rembourse jamais plus que le capital restant dû
    principalCents = Math.min(principalCents, startCents)

    const paymentCents = principalCents + interestCents
    balanceCents = startCents - principalCents

    rows.push({
      period,
      startBalance: fromCents(startCents),
      interest: fromCents(interestCents),
      principal: fromCents(principalCents),
      payment: fromCents(paymentCents),
      endBalance: fromCents(balanceCents),
    })
  }

  const totalInterest = fromCents(rows.reduce((s, r) => s + toCents(r.interest), 0))
  const totalPrincipal = fromCents(rows.reduce((s, r) => s + toCents(r.principal), 0))
  const totalPaid = fromCents(rows.reduce((s, r) => s + toCents(r.payment), 0))
  const constantPayment = method === 'annuite-constante' ? fromCents(regularAnnuityCents) : null
  const last = rows[rows.length - 1]

  let lastPaymentAdjustment = 0
  if (method === 'annuite-constante' && n > 1) {
    lastPaymentAdjustment = roundCents(last.payment - fromCents(regularAnnuityCents))
  } else if (method === 'amortissement-constant' && n > 1) {
    lastPaymentAdjustment = roundCents(last.principal - fromCents(regularPrincipalCents))
  }

  return { params, rows, totalInterest, totalPrincipal, totalPaid, constantPayment, lastPaymentAdjustment, periodRatePercent: ratePercent, periods: n }
}
