/**
 * Mécanisme de TVA — Titre 2, partie 1 (diapositives 39 à 51) et TD n°1.
 *
 *   TVA collectée − TVA déductible = TVA à décaisser
 *
 * Liquidation (dernier jour du mois) : débit 445 71, crédit 445 62 / 445 66 et 445 51.
 * Le montant de TVA à décaisser est un nombre entier : l'écart d'arrondi est porté
 * au compte 658 (charge, si on arrondit au-dessus) ou 758 (produit, si on arrondit au-dessous).
 * Si la TVA déductible dépasse la TVA collectée : crédit de TVA, compte 445 67 débité.
 */
import type { JournalEntry, JournalLine } from '@/types'

export const TVA_RATES = [
  { rate: 20, label: 'Taux normal', scope: 'Tous les produits et services pour lesquels un autre taux n’est pas prévu' },
  { rate: 10, label: 'Taux intermédiaire', scope: 'Restauration, transport de voyageurs, certaines activités culturelles (musées, monuments, zoo)…' },
  { rate: 5.5, label: 'Taux réduit', scope: 'Alimentation, hygiène et produits de première nécessité, livres, cinéma, spectacle vivant…' },
  { rate: 2.1, label: 'Taux particulier', scope: 'Médicaments remboursables par la sécurité sociale, publications de presse…' },
] as const

const cents = (v: number) => Math.round(v * 100)
const eur = (c: number) => c / 100

export function tvaFromHT(ht: number, ratePercent: number): number {
  return eur(Math.round(cents(ht) * ratePercent / 100))
}

export function htFromTTC(ttc: number, ratePercent: number): number {
  return eur(Math.round(cents(ttc) / (1 + ratePercent / 100)))
}

export interface LiquidationInput {
  collectee: number
  deductibleImmo: number
  deductibleBS: number
  /** Crédit de TVA du mois précédent imputé sur ce mois (445 67), facultatif */
  creditAnterieur?: number
}

export interface LiquidationResult {
  /** Solde exact : collectée − déductibles − crédit antérieur */
  solde: number
  /** TVA à décaisser arrondie à l'euro (0 en cas de crédit) */
  aDecaisser: number
  /** Crédit de TVA à reporter (0 sinon) */
  credit: number
  /** Écart d'arrondi : compte 658 (charge) ou 758 (produit) */
  ajustement: { account: '658' | '758'; amount: number } | null
  entry: JournalEntry
}

export function liquidate(input: LiquidationInput, label = 'du mois'): LiquidationResult {
  const c = cents(input.collectee)
  const di = cents(input.deductibleImmo)
  const db = cents(input.deductibleBS)
  const ca = cents(input.creditAnterieur ?? 0)
  const soldeC = c - di - db - ca
  const lines: JournalLine[] = []
  if (c > 0) lines.push({ debitAccount: '445 71', label: 'État - TVA collectée', debit: eur(c) })

  let aDecaisser = 0
  let credit = 0
  let ajustement: LiquidationResult['ajustement'] = null

  if (soldeC >= 0) {
    const rounded = Math.round(soldeC / 100) * 100
    const diff = rounded - soldeC
    aDecaisser = eur(rounded)
    if (diff > 0) {
      ajustement = { account: '658', amount: eur(diff) }
      lines.push({ debitAccount: '658', label: 'Pénalités et autres charges', debit: eur(diff) })
    }
    if (di > 0) lines.push({ creditAccount: '445 62', label: 'État - TVA déductible sur immobilisations', credit: eur(di) })
    if (db > 0) lines.push({ creditAccount: '445 66', label: 'État - TVA déductible sur autres B&S', credit: eur(db) })
    if (ca > 0) lines.push({ creditAccount: '445 67', label: 'État - Crédit de TVA à reporter', credit: eur(ca) })
    if (diff < 0) {
      ajustement = { account: '758', amount: eur(-diff) }
      lines.push({ creditAccount: '758', label: 'Indemnités et autres produits', credit: eur(-diff) })
    }
    if (rounded > 0) lines.push({ creditAccount: '445 51', label: 'État - TVA à décaisser', credit: aDecaisser })
  } else {
    credit = eur(-soldeC)
    lines.push({ debitAccount: '445 67', label: 'État - Crédit de TVA à reporter', debit: credit })
    if (di > 0) lines.push({ creditAccount: '445 62', label: 'État - TVA déductible sur immobilisations', credit: eur(di) })
    if (db > 0) lines.push({ creditAccount: '445 66', label: 'État - TVA déductible sur autres B&S', credit: eur(db) })
    if (ca > 0) lines.push({ creditAccount: '445 67', label: 'État - Crédit de TVA antérieur imputé', credit: eur(ca) })
  }

  return {
    solde: eur(soldeC),
    aDecaisser,
    credit,
    ajustement,
    entry: { date: 'Dernier jour du mois', description: `Liquidation de la TVA ${label}`, lines },
  }
}

export function paymentEntry(amount: number, label = 'du mois'): JournalEntry {
  return {
    date: 'Date du paiement (mois suivant)',
    description: `Paiement de la TVA à décaisser ${label}`,
    lines: [
      { debitAccount: '445 51', label: 'État - TVA à décaisser', debit: amount },
      { creditAccount: '512', label: 'Banque', credit: amount },
    ],
  }
}

export type TvaRegime = 'franchise' | 'reel-simplifie' | 'reel-normal'

/** Régime de TVA selon le chiffre d'affaires annuel (diapositive 47). */
export function tvaRegime(caAnnuel: number, activite: 'biens' | 'services'): TvaRegime {
  const [low, high] = activite === 'biens' ? [91_900, 840_000] : [36_800, 254_000]
  if (caAnnuel < low) return 'franchise'
  if (caAnnuel < high) return 'reel-simplifie'
  return 'reel-normal'
}
