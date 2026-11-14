/** Une ligne d'écriture : côté, compte, montant. */
export type DrillLine = ['D' | 'C', string, number]

export interface DrillAmountQuestion {
  label: string
  answer: number
  /** Choix imposés (ex. ceux de l'épreuve). Sinon ils sont fabriqués. */
  options?: number[]
  /** Montants pièges à proposer en priorité. */
  traps?: number[]
}

export interface DrillCase {
  id: string
  date: string
  text: string
  /** Point de vue : « Acheteur », « Vendeur », « Je paie »… sert d'indice. */
  who: string
  lines: DrillLine[]
  /** Explication pas à pas, affichée à la correction. */
  why: string
  /** Comptes proposés (ex. ceux de l'épreuve). Sinon fabriqués. */
  accountOptions?: string[]
  /** Questions de montant imposées. Sinon : tiers, TVA, total crédit. */
  amountQs?: DrillAmountQuestion[]
  /** Pièges de montant ajoutés aux questions fabriquées. */
  traps?: number[]
  /** Libellé de l'écriture dans le journal corrigé. */
  label: string
}

export interface DrillSeries {
  id: string
  title: string
  company: string
  context: string
  description: string
  source: string
  cases: DrillCase[]
}
