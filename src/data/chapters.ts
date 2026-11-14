import type { Chapter } from '@/types'

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Financer une entreprise',
    subtitle: "Situer l'emprunt parmi les sources de financement",
    objectives: [
      "Distinguer l'autofinancement des financements externes",
      'Associer chaque financement externe à sa source',
      "Situer l'emprunt parmi les financements bancaires",
    ],
    lessonIds: ['l-financements'],
    sourcePages: 'p. 120',
  },
  {
    id: 'ch2',
    number: 2,
    title: "Comprendre l'emprunt",
    subtitle: 'Définition, intérêts et paiement périodique',
    objectives: [
      'Définir un emprunt et ses acteurs',
      'Calculer les intérêts périodiques',
      'Décomposer un paiement en amortissement et intérêts',
    ],
    lessonIds: ['l-definition', 'l-interets', 'l-paiement'],
    sourcePages: 'p. 121',
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Les modalités de remboursement',
    subtitle: 'In fine, amortissement constant et annuité constante',
    objectives: [
      'Reconnaître les trois modalités de remboursement',
      "Construire un tableau d'amortissement pour chaque modalité",
      'Calculer une annuité constante avec la formule',
      'Comparer le coût des trois modalités',
    ],
    lessonIds: ['l-modalites', 'l-in-fine', 'l-amort-constant', 'l-annuite-constante', 'l-comparaison'],
    sourcePages: 'p. 122 à 125',
  },
  {
    id: 'ch4',
    number: 4,
    title: "La comptabilisation de l'emprunt",
    subtitle: 'Souscription et paiement périodique',
    objectives: [
      "Enregistrer la souscription d'un emprunt",
      "Enregistrer le paiement d'une échéance",
      "Passer les écritures à partir d'un tableau d'amortissement",
    ],
    lessonIds: ['l-souscription', 'l-ecriture-paiement', 'l-application-compta'],
    sourcePages: 'p. 126 et 127',
  },
]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}
