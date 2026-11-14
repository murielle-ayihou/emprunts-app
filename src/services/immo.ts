/**
 * Immobilisations corporelles — Titre 3 (diapositives 93 à 118) et TD n°4.
 *
 *  Coût d'acquisition = Prix d'achat + Coûts directement attribuables
 *  Base amortissable  = Coût d'acquisition − Valeur résiduelle
 *  Linéaire           : Dotation = Base amortissable / Durée d'utilité × Prorata temporis
 *  Unités d'œuvre     : Dotation = Base amortissable × (UO de la période / UO totales)
 *  Valeur actuelle    = max(valeur vénale, valeur d'usage)
 *  Dépréciation si valeur actuelle < VNC ; reprise si valeur actuelle > VNC (dans la limite des dépréciations passées)
 *
 * Prorata temporis : le support compte en mois, avec un demi-mois pour une mise en service le 15
 * (15 avril → 8,5/12 ; 15 juin → 6,5/12 ; 1er avril → 9/12 ; 1er juillet → 6/12).
 */
import type { JournalEntry } from '@/types'

export type Rounding = 'cent' | 'euro'

const r2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100
function roundTo(v: number, mode: Rounding) {
  return mode === 'euro' ? Math.round(v) : r2(v)
}

export interface AcquisitionInput {
  prixAchat: number
  /** Remise en % sur le prix */
  remisePct: number
  /** Coûts directement attribuables (transport, installation, essais…) */
  fraisDirects: number
  /** Droits de mutation, frais d'actes, honoraires et commissions */
  fraisAcquisition: number
  /** Méthode de référence : ces frais sont intégrés au coût */
  methodeReference: boolean
}

export function acquisitionCost(i: AcquisitionInput): { cout: number; chargesFraisAcquisition: number } {
  const prixNet = r2(i.prixAchat * (1 - i.remisePct / 100))
  const cout = r2(prixNet + i.fraisDirects + (i.methodeReference ? i.fraisAcquisition : 0))
  return { cout, chargesFraisAcquisition: i.methodeReference ? 0 : i.fraisAcquisition }
}

/** Valeur résiduelle = prix de cession estimé − coûts de sortie. */
export function residualValue(prixCessionEstime: number, coutsSortiePct = 0): number {
  return r2(prixCessionEstime * (1 - coutsSortiePct / 100))
}

/** Mois d'utilisation la première année : mise en service le 1er (début) ou le 15 (milieu) du mois. */
export function firstYearMonths(month: number, midMonth: boolean): number {
  return 12 - (month - 1) - (midMonth ? 0.5 : 0)
}

export interface PlanRow {
  /** 0 = première année (N) */
  index: number
  base: number
  /** Fraction d'année appliquée (ex. 8,5/12) */
  months: number
  dotation: number
  cumul: number
  vnc: number
  /** Nombre d'unités d'œuvre (mode unités d'œuvre) */
  units?: number
}

export interface LinearPlanInput {
  cout: number
  valeurResiduelle: number
  dureeAnnees: number
  moisMiseEnService: number
  milieuDeMois: boolean
  rounding: Rounding
  /** Amortissements (et dépréciations) déjà cumulés avant ce plan : pour un plan révisé */
  cumulInitial?: number
}

export function linearPlan(i: LinearPlanInput): PlanRow[] {
  const base = r2(i.cout - i.valeurResiduelle - (i.cumulInitial ?? 0))
  const firstMonths = firstYearMonths(i.moisMiseEnService, i.milieuDeMois)
  const totalMonths = i.dureeAnnees * 12
  const rows: PlanRow[] = []
  let used = 0
  let cumul = i.cumulInitial ?? 0
  let done = 0
  let idx = 0
  while (used < totalMonths - 1e-9) {
    const months = Math.min(idx === 0 ? firstMonths : 12, totalMonths - used)
    used += months
    const isLast = used >= totalMonths - 1e-9
    const dotation = isLast ? r2(base - done) : roundTo((base / i.dureeAnnees) * (months / 12), i.rounding)
    done = r2(done + dotation)
    cumul = r2(cumul + dotation)
    rows.push({ index: idx, base, months, dotation, cumul, vnc: r2(i.cout - cumul) })
    idx++
  }
  return rows
}

export function unitsPlan(cout: number, valeurResiduelle: number, units: number[], rounding: Rounding): PlanRow[] {
  const base = r2(cout - valeurResiduelle)
  const total = units.reduce((s, u) => s + u, 0)
  let cumul = 0
  return units.map((u, idx) => {
    const isLast = idx === units.length - 1
    const dotation = isLast ? r2(base - cumul) : roundTo((base * u) / total, rounding)
    cumul = r2(cumul + dotation)
    return { index: idx, base, months: 12, dotation, cumul, vnc: r2(cout - cumul), units: u }
  })
}

export interface ImpairmentInput {
  /** VNC avant test (coût − amortissements − dépréciations antérieures) */
  vnc: number
  valeurVenale: number
  valeurUsage: number
  /** Dépréciations déjà constatées et non reprises */
  depreciationsAnterieures: number
}

export interface ImpairmentResult {
  valeurActuelle: number
  kind: 'depreciation' | 'reprise' | 'aucune'
  amount: number
}

export function impairmentTest(i: ImpairmentInput): ImpairmentResult {
  const va = Math.max(i.valeurVenale, i.valeurUsage)
  if (va < i.vnc) return { valeurActuelle: va, kind: 'depreciation', amount: r2(i.vnc - va) }
  if (va > i.vnc && i.depreciationsAnterieures > 0) {
    return { valeurActuelle: va, kind: 'reprise', amount: r2(Math.min(va - i.vnc, i.depreciationsAnterieures)) }
  }
  return { valeurActuelle: va, kind: 'aucune', amount: 0 }
}

/** Écritures d'inventaire d'une dépréciation ou d'une reprise. */
export function impairmentEntry(res: ImpairmentResult, compteDep: string, libelleDep: string, date = '31/12'): JournalEntry | null {
  if (res.kind === 'depreciation') {
    return {
      date,
      description: 'Dépréciation de l’immobilisation',
      lines: [
        { debitAccount: '681 62', label: 'Dotations aux dépré. des immobilisations corp.', debit: res.amount },
        { creditAccount: compteDep, label: libelleDep, credit: res.amount },
      ],
    }
  }
  if (res.kind === 'reprise') {
    return {
      date,
      description: 'Reprise de dépréciation',
      lines: [
        { debitAccount: compteDep, label: libelleDep, debit: res.amount },
        { creditAccount: '781 62', label: 'Reprises dépré. immo. corp.', credit: res.amount },
      ],
    }
  }
  return null
}

export function dotationEntry(amount: number, compteAmort: string, libelleAmort: string, date = '31/12'): JournalEntry {
  return {
    date,
    description: 'Dotation aux amortissements',
    lines: [
      { debitAccount: '681 12', label: 'Dotations aux amort. des immobilisations corp.', debit: amount },
      { creditAccount: compteAmort, label: libelleAmort, credit: amount },
    ],
  }
}

export interface DisposalInput {
  valeurBrute: number
  /** Amortissements cumulés au début de l'exercice de cession */
  amortCumulDebut: number
  /** Dotation complémentaire de l'exercice de cession (jusqu'à la date de cession) */
  dotationComplementaire: number
  prixCessionHT: number
  tauxTVA: number
  paiementDiffere: boolean
  compteImmo: string
  libelleImmo: string
  compteAmort: string
  libelleAmort: string
}

export interface DisposalResult {
  amortCumul: number
  vnc: number
  /** Prix de cession − VNC : plus-value (> 0) ou moins-value (< 0) */
  resultat: number
  entries: JournalEntry[]
}

/** Sortie d'une immobilisation (diapositives 117 et 118). */
export function disposal(i: DisposalInput): DisposalResult {
  const tva = r2((i.prixCessionHT * i.tauxTVA) / 100)
  const amortCumul = r2(i.amortCumulDebut + i.dotationComplementaire)
  const vnc = r2(i.valeurBrute - amortCumul)
  const entries: JournalEntry[] = [
    {
      date: 'Date de cession',
      description: 'Enregistrement du prix de cession',
      lines: [
        i.paiementDiffere
          ? { debitAccount: '462', label: 'Créances sur cessions d’immobilisations', debit: r2(i.prixCessionHT + tva) }
          : { debitAccount: '512', label: 'Banque', debit: r2(i.prixCessionHT + tva) },
        { creditAccount: '757', label: 'Produits de cession des immobilisations', credit: i.prixCessionHT },
        ...(tva > 0 ? [{ creditAccount: '445 71', label: 'État - TVA collectée', credit: tva }] : []),
      ],
    },
  ]
  if (i.dotationComplementaire > 0) entries.push(dotationEntry(i.dotationComplementaire, i.compteAmort, i.libelleAmort, 'Date de cession'))
  entries.push({
    date: 'Date de cession',
    description: 'Sortie de l’actif',
    lines: [
      { debitAccount: '657', label: 'Valeur comptable des immobilisations cédées', debit: vnc },
      ...(amortCumul > 0 ? [{ debitAccount: i.compteAmort, label: i.libelleAmort, debit: amortCumul }] : []),
      { creditAccount: i.compteImmo, label: i.libelleImmo, credit: i.valeurBrute },
    ],
  })
  return { amortCumul, vnc, resultat: r2(i.prixCessionHT - vnc), entries }
}
