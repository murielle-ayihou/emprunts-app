import type { Formula } from '@/types'

/**
 * Formules du support de cours (Titre 4 – Les emprunts bancaires).
 * Chaque formule indique la page du PDF dont elle provient.
 */
export const formulas: Formula[] = [
  {
    id: 'f-interets',
    title: 'Intérêts périodiques',
    latex: 'I = \\text{CRD} \\times i',
    variables: [
      { symbol: 'I', meaning: 'Intérêts de la période (en €)' },
      { symbol: '\\text{CRD}', meaning: 'Capital restant dû au début de la période (en €)' },
      { symbol: 'i', meaning: "Taux d'intérêt de la période (4 % → 0,04)" },
    ],
    whenToUse: "À chaque échéance, quelle que soit la modalité de remboursement, pour calculer la part d'intérêts.",
    sourcePage: 121,
  },
  {
    id: 'f-paiement',
    title: 'Paiement périodique',
    latex: '\\text{Paiement} = \\text{Amortissement} + I',
    variables: [
      { symbol: '\\text{Paiement}', meaning: "Somme versée à la banque à l'échéance (l'annuité si l'échéance est annuelle)" },
      { symbol: '\\text{Amortissement}', meaning: 'Part du capital remboursée pendant la période' },
      { symbol: 'I', meaning: 'Intérêts de la période' },
    ],
    whenToUse: "Pour reconstituer une échéance, ou pour retrouver l'amortissement quand on connaît l'annuité : Amortissement = Annuité − Intérêts.",
    sourcePage: 121,
  },
  {
    id: 'f-crd',
    title: 'Capital restant dû en fin de période',
    latex: '\\text{CRD}_{\\text{fin}} = \\text{CRD}_{\\text{début}} - \\text{Amortissement}',
    variables: [
      { symbol: '\\text{CRD}_{\\text{début}}', meaning: 'Capital restant dû au début de la période' },
      { symbol: '\\text{Amortissement}', meaning: 'Capital remboursé pendant la période' },
      { symbol: '\\text{CRD}_{\\text{fin}}', meaning: 'Capital restant dû à la fin de la période = début de la période suivante' },
    ],
    whenToUse: "Pour passer d'une ligne à la suivante dans un tableau d'amortissement (lecture des tableaux p. 123 à 125).",
    sourcePage: 123,
  },
  {
    id: 'f-amort-constant',
    title: 'Amortissement constant',
    latex: '\\text{Amortissement} = \\dfrac{C}{n}',
    variables: [
      { symbol: 'C', meaning: 'Capital emprunté (en €)' },
      { symbol: 'n', meaning: "Nombre d'échéances" },
    ],
    whenToUse: 'Uniquement pour un remboursement par amortissement constant : la même part de capital est remboursée à chaque échéance.',
    sourcePage: 122,
  },
  {
    id: 'f-annuite-constante',
    title: 'Annuité constante',
    latex: 'a = C \\times \\dfrac{i}{1 - (1 + i)^{-n}}',
    variables: [
      { symbol: 'a', meaning: 'Annuité constante (paiement identique à chaque échéance)' },
      { symbol: 'C', meaning: 'Capital emprunté (en €)' },
      { symbol: 'i', meaning: "Taux d'intérêt par période, en décimal (4 % → 0,04)" },
      { symbol: 'n', meaning: "Nombre d'échéances" },
    ],
    whenToUse: "Uniquement pour un remboursement par annuités constantes : c'est le paiement qui est identique à chaque échéance, pas l'amortissement.",
    sourcePage: 122,
  },
]

export function getFormula(id: string): Formula | undefined {
  return formulas.find((f) => f.id === id)
}
