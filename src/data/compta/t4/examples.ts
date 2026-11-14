import type { Example } from '@/types'

const AMORT_HEADERS = [
  'Années',
  'Capital restant dû (début)',
  'Intérêts',
  "Amortissement de l'emprunt",
  'Annuité',
  'Capital restant dû (fin)',
]
const NUM_COLS = [1, 2, 3, 4, 5]

const STATEMENT =
  "Une société emprunte **60 000 €** auprès d'un établissement financier au taux d'intérêt fixe de **4 %** et sur une durée de **6 ans**. La périodicité des échéances est **annuelle**."

/**
 * Exemples du support de cours. Les tableaux sont recopiés à l'identique du PDF (p. 123 à 127)
 * et vérifiés automatiquement par les tests (tests/loan.test.ts).
 */
export const examples: Example[] = [
  {
    id: 'ex-in-fine',
    title: 'Tableau d’amortissement — remboursement in fine',
    statement: STATEMENT,
    steps: [
      'Intérêts = Capital restant dû × Taux = 60 000 × 4 % = **2 400 €** (chaque année, car le capital restant dû ne change pas).',
      "Amortissement de N à N+4 = **0 €** : aucun capital n'est remboursé avant le terme.",
      'Annuité de N à N+4 = Intérêts + Amortissement = 2 400 + 0 = **2 400 €**.',
      'En N+5 (dernière année) : Amortissement = **60 000 €**, donc Annuité = 2 400 + 60 000 = **62 400 €**.',
    ],
    table: {
      headers: AMORT_HEADERS,
      numericCols: NUM_COLS,
      highlightRow: 5,
      rows: [
        ['N', '60 000', '2 400', '0', '2 400', '60 000'],
        ['N+1', '60 000', '2 400', '0', '2 400', '60 000'],
        ['N+2', '60 000', '2 400', '0', '2 400', '60 000'],
        ['N+3', '60 000', '2 400', '0', '2 400', '60 000'],
        ['N+4', '60 000', '2 400', '0', '2 400', '60 000'],
        ['N+5', '60 000', '2 400', '60 000', '62 400', '0'],
      ],
    },
    sourcePage: 123,
  },
  {
    id: 'ex-amort-constant',
    title: 'Tableau d’amortissement — amortissement constant',
    statement: STATEMENT,
    steps: [
      'Amortissement constant = Capital emprunté / Nombre d’échéances = 60 000 / 6 = **10 000 €**.',
      'Intérêts de N = Capital restant dû × Taux = 60 000 × 4 % = **2 400 €**.',
      'Annuité de N = 10 000 + 2 400 = **12 400 €**.',
      'Capital restant dû fin N = 60 000 − 10 000 = **50 000 €**, qui devient le capital restant dû au début de N+1.',
      'Intérêts de N+1 = 50 000 × 4 % = **2 000 €**, annuité = 10 000 + 2 000 = **12 000 €**. Et ainsi de suite.',
    ],
    table: {
      headers: AMORT_HEADERS,
      numericCols: NUM_COLS,
      rows: [
        ['N', '60 000', '2 400', '10 000', '12 400', '50 000'],
        ['N+1', '50 000', '2 000', '10 000', '12 000', '40 000'],
        ['N+2', '40 000', '1 600', '10 000', '11 600', '30 000'],
        ['N+3', '30 000', '1 200', '10 000', '11 200', '20 000'],
        ['N+4', '20 000', '800', '10 000', '10 800', '10 000'],
        ['N+5', '10 000', '400', '10 000', '10 400', '0'],
      ],
    },
    sourcePage: 124,
  },
  {
    id: 'ex-annuite-constante',
    title: 'Tableau d’amortissement — annuité constante',
    statement: STATEMENT,
    steps: [
      'On convertit le taux en décimal : i = 4 % = **0,04**, et n = **6**.',
      '$(1+i)^{-n} = 1{,}04^{-6} \\approx 0{,}790315$',
      '$1-(1+i)^{-n} \\approx 1 - 0{,}790315 = 0{,}209685$',
      'C × i = 60 000 × 0,04 = **2 400**.',
      'Annuité = 2 400 / 0,209685 ≈ **11 445,71 €**.',
      'Intérêts de N = 60 000 × 4 % = **2 400 €**.',
      'Amortissement de N = Annuité − Intérêts = 11 445,71 − 2 400 = **9 045,71 €**.',
      'Capital restant dû fin N = 60 000 − 9 045,71 = **50 954,29 €**. On recommence avec ce montant pour N+1.',
    ],
    table: {
      headers: AMORT_HEADERS,
      numericCols: NUM_COLS,
      rows: [
        ['N', '60 000', '2 400', '9 045,71', '11 445,71', '50 954,29'],
        ['N+1', '50 954,29', '2 038,17', '9 407,54', '11 445,71', '41 546,75'],
        ['N+2', '41 546,75', '1 661,87', '9 783,84', '11 445,71', '31 762,91'],
        ['N+3', '31 762,91', '1 270,52', '10 175,19', '11 445,71', '21 587,72'],
        ['N+4', '21 587,72', '863,51', '10 582,20', '11 445,71', '11 005,52'],
        ['N+5', '11 005,52', '440,22', '11 005,52', '11 445,71', '0'],
      ],
    },
    sourcePage: 125,
  },
  {
    id: 'ex-souscription',
    title: 'Écriture de souscription de l’emprunt',
    statement:
      "Une société emprunte **60 000 €** au taux d'intérêt fixe de **4 %** et sur une durée de **6 ans**. Le remboursement de l'emprunt se fera annuellement par amortissement constant.",
    steps: [
      'La banque verse 60 000 € sur le compte de la société : le compte **512 – Banque** augmente → **débit**.',
      'La société a une dette envers la banque : le compte **164 – Emprunts auprès des établissements de crédit** augmente → **crédit**.',
      "C'est une opération financière : **pas de TVA**.",
    ],
    journal: {
      date: 'Date de souscription',
      description: 'Souscription emprunt xxx',
      lines: [
        { debitAccount: '512', label: 'Banque', debit: 60_000 },
        { creditAccount: '164', label: 'Emprunts auprès des étab. de crédit', credit: 60_000 },
      ],
    },
    sourcePage: 126,
  },
  {
    id: 'ex-paiement',
    title: 'Écriture de paiement de la première annuité',
    statement:
      "Même emprunt : 60 000 € à 4 % sur 6 ans, remboursé annuellement par amortissement constant. On enregistre le paiement de la première annuité.",
    steps: [
      'On lit la ligne N du tableau : amortissement = **10 000 €**, intérêts = **2 400 €**, annuité = **12 400 €**.',
      "L'amortissement réduit la dette : **débit du 164** pour 10 000 €.",
      'Les intérêts sont une charge : **débit du 661 – Charges d’intérêts** pour 2 400 €.',
      'La banque paie le total : **crédit du 512 – Banque** pour 12 400 €.',
    ],
    journal: {
      date: 'Date de paiement',
      description: 'Paiement de la première annuité',
      lines: [
        { debitAccount: '164', label: 'Emprunts auprès des étab. de crédit', debit: 10_000 },
        { debitAccount: '661', label: 'Charges d’intérêts', debit: 2400 },
        { creditAccount: '512', label: 'Banque', credit: 12_400 },
      ],
    },
    sourcePage: 127,
  },
]
