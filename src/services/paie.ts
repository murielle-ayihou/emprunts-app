/**
 * Opérations relatives au personnel — Titre 2, partie 4 (diapositives 84 à 91).
 *
 *  Cotisations salariales = Salaire brut − Net à payer avant impôt sur le revenu
 *  Net payé              = Net à payer avant IR − Prélèvement à la source (PAS)
 *  Coût total employeur  = Salaire brut + Cotisations patronales
 */
import type { JournalEntry } from '@/types'

export interface PayInput {
  brut: number
  cotisationsSalariales: number
  pas: number
  cotisationsPatronales: number
}

export interface PayResult extends PayInput {
  netAvantIR: number
  netPaye: number
  coutTotal: number
  /** Dette envers les organismes sociaux (cotisations salariales + patronales) */
  detteOrganismes: number
  entries: JournalEntry[]
}

const r2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100

export function computePay(i: PayInput, mois = 'du mois'): PayResult {
  const netAvantIR = r2(i.brut - i.cotisationsSalariales)
  const netPaye = r2(netAvantIR - i.pas)
  const coutTotal = r2(i.brut + i.cotisationsPatronales)
  const detteOrganismes = r2(i.cotisationsSalariales + i.cotisationsPatronales)
  const entries: JournalEntry[] = [
    {
      date: 'Fin du mois M',
      description: `Salaire brut ${mois}`,
      lines: [
        { debitAccount: '641 1', label: 'Rémunération du personnel', debit: i.brut },
        { creditAccount: '421', label: 'Personnel - Rémunérations dues', credit: netPaye },
        { creditAccount: '43', label: 'Sécurité sociale et organismes sociaux', credit: i.cotisationsSalariales },
        ...(i.pas > 0 ? [{ creditAccount: '442 1', label: 'Prélèvement à la source', credit: i.pas }] : []),
      ],
    },
    {
      date: 'Fin du mois M',
      description: `Cotisations sociales patronales ${mois}`,
      lines: [
        { debitAccount: '645', label: 'Charges de sécurité sociale et de prévoyance', debit: i.cotisationsPatronales },
        { creditAccount: '43', label: 'Sécurité sociale et organismes sociaux', credit: i.cotisationsPatronales },
      ],
    },
    {
      date: 'Date de paiement du salaire',
      description: 'Versement du salaire net à payer',
      lines: [
        { debitAccount: '421', label: 'Personnel - Rémunérations dues', debit: netPaye },
        { creditAccount: '512', label: 'Banque', credit: netPaye },
      ],
    },
    {
      date: 'Entre le 5 et le 15 de M+1',
      description: 'Versement des cotisations sociales',
      lines: [
        { debitAccount: '43', label: 'Sécurité sociale et organismes sociaux', debit: detteOrganismes },
        { creditAccount: '512', label: 'Banque', credit: detteOrganismes },
      ],
    },
  ]
  if (i.pas > 0) {
    entries.push({
      date: 'Entre le 8 et le 18 de M+1',
      description: 'Versement du prélèvement à la source',
      lines: [
        { debitAccount: '442 1', label: 'Prélèvement à la source', debit: i.pas },
        { creditAccount: '512', label: 'Banque', credit: i.pas },
      ],
    })
  }
  return { ...i, netAvantIR, netPaye, coutTotal, detteOrganismes, entries }
}
