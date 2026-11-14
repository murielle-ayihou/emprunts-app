import { METHOD_LABELS, type LoanSchedule } from './loan'
import { formatEuro, formatPercent } from '@/utils/format'

export interface ScenarioInput {
  name: string
  schedule: LoanSchedule
}

/**
 * Produit des explications en français des différences entre un scénario de référence
 * et les autres. Les explications s'appuient uniquement sur les règles du cours :
 * intérêts = capital restant dû × taux, et paiement = amortissement + intérêts.
 */
export function explainComparison(scenarios: ScenarioInput[]): string[] {
  if (scenarios.length < 2) return []
  const [ref, ...others] = scenarios
  const out: string[] = []

  for (const sc of others) {
    const a = ref.schedule
    const b = sc.schedule
    const pa = a.params
    const pb = b.params
    const diff = b.totalInterest - a.totalInterest
    const changes: string[] = []
    if (pa.capital !== pb.capital) changes.push('le capital')
    if (pa.ratePercent !== pb.ratePercent) changes.push('le taux')
    if (pa.years !== pb.years) changes.push('la durée')
    if (pa.method !== pb.method) changes.push('la modalité de remboursement')

    if (changes.length === 0) {
      out.push(`${sc.name} a exactement les mêmes paramètres que ${ref.name} : les résultats sont identiques.`)
      continue
    }

    const sens = diff > 0 ? 'plus' : 'moins'
    const pct = a.totalInterest > 0 ? ` (${diff > 0 ? '+' : '−'}${formatPercent(Math.abs(diff) / a.totalInterest * 100, 1)})` : ''
    out.push(
      diff === 0
        ? `${sc.name} coûte le même montant d'intérêts que ${ref.name} (${formatEuro(a.totalInterest)}).`
        : `${sc.name} coûte ${formatEuro(Math.abs(diff))} d'intérêts en ${sens} que ${ref.name}${pct}. Paramètre(s) modifié(s) : ${changes.join(', ')}.`,
    )

    if (pa.ratePercent !== pb.ratePercent && changes.length === 1) {
      out.push(
        `Seul le taux change (${formatPercent(pa.ratePercent)} → ${formatPercent(pb.ratePercent)}). Chaque année, les intérêts = capital restant dû × taux : un taux ${pb.ratePercent > pa.ratePercent ? 'plus élevé augmente' : 'plus faible diminue'} donc les intérêts de chaque échéance.`,
      )
    }
    if (pa.years !== pb.years && changes.length === 1) {
      const longer = pb.years > pa.years
      out.push(
        `Seule la durée change (${pa.years} → ${pb.years} ans). ${longer ? 'Le capital est remboursé plus lentement : il reste dû plus longtemps et produit des intérêts plus longtemps.' : 'Le capital est remboursé plus vite : il produit des intérêts moins longtemps.'} ${pa.method !== 'in-fine' ? `En contrepartie, la première échéance passe de ${formatEuro(a.rows[0].payment)} à ${formatEuro(b.rows[0].payment)}.` : ''}`.trim(),
      )
    }
    if (pa.capital !== pb.capital && changes.length === 1) {
      out.push(
        `Seul le capital change (${formatEuro(pa.capital)} → ${formatEuro(pb.capital)}). Avec le même taux et la même durée, les intérêts varient dans la même proportion que le capital emprunté.`,
      )
    }
    if (pa.method !== pb.method && changes.length === 1) {
      out.push(
        `Seule la modalité change (${METHOD_LABELS[pa.method]} → ${METHOD_LABELS[pb.method]}). Plus le capital est remboursé tôt, plus le capital restant dû baisse vite, et moins les intérêts sont élevés. En in fine, le capital reste dû en totalité jusqu'à la fin : c'est la modalité la plus coûteuse en intérêts.`,
      )
    }
  }
  return out
}
