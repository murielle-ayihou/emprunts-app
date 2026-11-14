import type { Chapter, Example, Exercise, Formula, GlossaryEntry, Lesson, QuizQuestion, QuizSeries } from '@/types'

/**
 * Titre 2 – Les opérations courantes d'exploitation.
 * Sources : PPT CM Titre 2 – TVA (diapositives 38 à 51), PPT CM Titre 2 – Personnel (diapositives 84 à 91),
 * TD n°1 et sa correction, Titre 2 – Correction exercice 6.
 * Les diapositives 52 à 83 (achats/ventes de B&S, crédits et règlements) ne sont pas fournies.
 */

export const chapters: Chapter[] = [
  {
    id: 't2-ch1',
    partId: 't2',
    number: 1,
    title: 'Le mécanisme de TVA',
    subtitle: 'Collecter, déduire, liquider et payer',
    objectives: ['Expliquer qui supporte la TVA', 'Calculer la TVA à décaisser', 'Enregistrer la liquidation et le paiement', 'Traiter un crédit de TVA'],
    lessonIds: ['t2-tva-mecanisme', 't2-tva-comptes', 't2-tva-liquidation'],
    sourcePages: 'diapositives 38 à 51',
  },
  {
    id: 't2-ch2',
    partId: 't2',
    number: 2,
    title: 'Achats, ventes et règlements',
    subtitle: 'Factures, avoirs, acomptes et règlements (d’après le TD n°1)',
    objectives: ['Enregistrer une facture chez le client et chez le fournisseur', 'Enregistrer un avoir', 'Enregistrer un acompte et un règlement'],
    lessonIds: ['t2-factures', 't2-reglements'],
    sourcePages: 'TD n°1 et sa correction',
  },
  {
    id: 't2-ch3',
    partId: 't2',
    number: 3,
    title: 'Le personnel et les organismes sociaux',
    subtitle: 'Paie, cotisations, prélèvement à la source',
    objectives: ['Décomposer un bulletin de paie', 'Enregistrer le coût du travail', 'Enregistrer le paiement des dettes sociales'],
    lessonIds: ['t2-paie-elements', 't2-paie-ecritures'],
    sourcePages: 'diapositives 84 à 91',
  },
]

export const formulas: Formula[] = [
  {
    id: 'f-t2-tva',
    title: 'TVA à décaisser',
    latex: '\\text{TVA à décaisser} = \\text{TVA collectée} - \\text{TVA déductible}',
    variables: [
      { symbol: '\\text{TVA collectée}', meaning: 'TVA facturée aux clients sur les ventes (445 71)' },
      { symbol: '\\text{TVA déductible}', meaning: 'TVA payée sur les achats : immobilisations (445 62) et autres biens et services (445 66)' },
    ],
    whenToUse: 'À la fin de chaque mois (régime réel normal). Si le résultat est négatif, c’est un crédit de TVA (445 67).',
    sourcePage: 39,
  },
  {
    id: 'f-t2-ttc',
    title: 'Du HT au TTC',
    latex: '\\text{TVA} = \\text{HT} \\times t \\qquad \\text{TTC} = \\text{HT} \\times (1 + t)',
    variables: [
      { symbol: 't', meaning: 'Taux de TVA (20 % → 0,20)' },
      { symbol: '\\text{HT}', meaning: 'Montant hors taxes' },
    ],
    whenToUse: 'Pour passer d’un montant TTC au HT, on divise : HT = TTC / (1 + t). Exemple : 54 508,56 / 1,2 = 45 423,80 €.',
    sourcePage: 45,
  },
  {
    id: 'f-t2-paie',
    title: 'Du brut au net payé',
    latex: '\\text{Net payé} = \\text{Brut} - \\text{Cotisations salariales} - \\text{PAS}',
    variables: [
      { symbol: '\\text{Brut}', meaning: 'Salaire contractuel, heures sup., primes, avantages en nature' },
      { symbol: '\\text{PAS}', meaning: 'Prélèvement à la source de l’impôt sur le revenu' },
    ],
    whenToUse: 'Pour analyser un bulletin : cotisations salariales = brut − net à payer avant IR.',
    sourcePage: 87,
  },
  {
    id: 'f-t2-cout',
    title: 'Coût total pour l’employeur',
    latex: '\\text{Coût total} = \\text{Brut} + \\text{Cotisations patronales}',
    variables: [{ symbol: '\\text{Cotisations patronales}', meaning: 'Part des cotisations à la charge de l’employeur (compte 645)' }],
    whenToUse: 'Le coût du travail enregistré en charges : 641 1 (brut) + 645 (patronales).',
    sourcePage: 84,
  },
]

export const examples: Example[] = [
  {
    id: 'ex-t2-janvier',
    title: 'TVA du mois de janvier (diapositives 45 et 46)',
    statement: 'En janvier : achat d’un bureau (immobilisation) **1 000 € HT** ; achat de matières premières **18 250 € HT** ; ventes de produits finis **45 000 € HT**. Taux : 20 %.',
    steps: [
      'TVA déductible sur immobilisations = 1 000 × 20 % = **200 €** (445 62)',
      'TVA déductible sur autres biens et services = 18 250 × 20 % = **3 650 €** (445 66)',
      'TVA collectée = 45 000 × 20 % = **9 000 €** (445 71)',
      'TVA à décaisser = 9 000 − (200 + 3 650) = **5 150 €**',
    ],
    sourcePage: 46,
  },
  {
    id: 'ex-t2-juin',
    title: 'Liquidation et paiement de la TVA de juin (diapositive 49)',
    statement: 'Une entreprise a collecté **40 000,00 €** de TVA en juin et bénéficie de **35 493,45 €** de TVA déductible sur biens et services.',
    steps: [
      'Solde = 40 000,00 − 35 493,45 = 4 506,55 €',
      'La TVA à décaisser doit être un nombre entier : **4 507,00 €**',
      'On paie 0,45 € de plus : écart porté au débit du **658 – Pénalités et autres charges**',
      'Le 20/07/N, paiement : débit 445 51, crédit 512 pour 4 507,00 €',
    ],
    journal: {
      date: '30/06/N',
      description: 'Liquidation de la TVA de juin N',
      lines: [
        { debitAccount: '445 71', label: 'État - TVA collectée', debit: 40_000 },
        { debitAccount: '658', label: 'Pénalités et autres charges', debit: 0.45 },
        { creditAccount: '445 66', label: 'État - TVA déductible sur autres B&S', credit: 35_493.45 },
        { creditAccount: '445 51', label: 'État - TVA à décaisser', credit: 4507 },
      ],
    },
    sourcePage: 49,
  },
  {
    id: 'ex-t2-facture',
    title: 'Une facture chez le client et chez le fournisseur (TD n°1, exercice 1)',
    statement: 'La menuiserie « Les trois clés » envoie au magasin de meubles Faye une facture de **5 300 € HT** (n°35 du 05/06/N), TVA 20 %, payée comptant par carte bancaire.',
    steps: [
      'TVA = 5 300 × 20 % = **1 060 €** ; TTC = **6 360 €**',
      'Chez Faye (client) : débit 607 Achats 5 300 et 445 66 TVA déductible 1 060 ; crédit 401 Fournisseurs 6 360. Puis paiement : débit 401, crédit 512.',
      'Chez Les trois clés (fournisseur) : débit 411 Clients 6 360 ; crédit 701 Ventes de produits finis 5 300 et 445 71 TVA collectée 1 060. Puis encaissement : débit 512, crédit 411.',
    ],
    journal: {
      date: '05/06/N',
      description: 'Chez Faye : achat - Facture n°35',
      lines: [
        { debitAccount: '607', label: 'Achats de marchandises', debit: 5300 },
        { debitAccount: '445 66', label: 'TVA sur autres biens et services', debit: 1060 },
        { creditAccount: '401', label: 'Fournisseurs', credit: 6360 },
      ],
    },
    sourcePage: undefined,
  },
  {
    id: 'ex-t2-bulletin',
    title: 'Analyse du bulletin de paie (diapositive 87)',
    statement: 'Bulletin d’octobre N : salaire brut **4 500,00 €**, net à payer avant impôt **3 500,76 €**, prélèvement à la source **257,79 €**, cotisations patronales **1 836,40 €**.',
    steps: [
      'Cotisations salariales = 4 500,00 − 3 500,76 = **999,24 €**',
      'Net payé = 3 500,76 − 257,79 = **3 242,97 €**',
      'Coût total pour l’employeur = 4 500,00 + 1 836,40 = **6 336,40 €**',
      'Dette envers les organismes sociaux = 999,24 + 1 836,40 = **2 835,64 €**',
    ],
    journal: {
      date: '30/10/N',
      description: 'Salaire brut d’octobre N',
      lines: [
        { debitAccount: '641 1', label: 'Rémunération du personnel', debit: 4500 },
        { creditAccount: '421', label: 'Personnel - Rémunérations dues', credit: 3242.97 },
        { creditAccount: '43', label: 'Sécurité sociale et organismes sociaux', credit: 999.24 },
        { creditAccount: '442 1', label: 'Prélèvement à la source', credit: 257.79 },
      ],
    },
    sourcePage: 90,
  },
]

export const lessons: Lesson[] = [
  {
    id: 't2-tva-mecanisme',
    chapterId: 't2-ch1',
    title: 'Comment fonctionne la TVA',
    summary: 'Un impôt payé par le consommateur final, collecté par l’entreprise.',
    minutes: 6,
    sourcePage: 'diapositives 38 à 42',
    blocks: [
      { type: 'text', text: 'La TVA a été inventée en **1954** en France par **Maurice Lauré**, directeur adjoint de la DGI.' },
      { type: 'definition', term: 'TVA', text: 'Impôt sur la **consommation**, dû par l’**utilisateur final**. L’entreprise le **facture et le collecte** auprès du consommateur, puis le **reverse au Trésor Public**.' },
      { type: 'text', text: 'Quand elle émet une facture, l’entreprise ne sait pas si son client est l’utilisateur final. Elle facture donc **systématiquement** la TVA.' },
      { type: 'formula', formulaId: 'f-t2-tva' },
      { type: 'diagram', kind: 'tva-chain' },
      { type: 'heading', text: 'Exigibilité' },
      {
        type: 'definition',
        term: 'Exigibilité',
        text: 'Date à laquelle la TVA est effectivement due au Trésor Public par le vendeur : **livraison** pour une vente de biens, **achèvement** pour une prestation de services. En pratique, la **date de facturation** en tient généralement lieu.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Un magasin vend un vélo 1 000 € HT (TVA 20 %) à un consommateur. Combien le magasin gagne-t-il réellement sur cette vente ?',
          options: ['1 200 €', '1 000 €', '200 €'],
          answer: 1,
          explanation: 'Il encaisse 1 200 €, mais reverse 200 € de TVA au Trésor : son gain est de 1 000 € (diapositive 40).',
        },
      },
      { type: 'summary', items: ['La TVA est supportée par le consommateur final.', 'L’entreprise collecte puis reverse.', 'TVA à décaisser = collectée − déductible.'] },
    ],
  },
  {
    id: 't2-tva-comptes',
    chapterId: 't2-ch1',
    title: 'Taux, comptes et régimes de TVA',
    summary: 'Les quatre taux, les comptes 445 et les régimes selon le chiffre d’affaires.',
    minutes: 7,
    sourcePage: 'diapositives 43 à 47',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Taux', 'Pour quoi ?'],
          rows: [
            ['Normal : 20 %', 'Tous les produits et services pour lesquels un autre taux n’est pas prévu'],
            ['Intermédiaire : 10 %', 'Restauration, transport de voyageurs, certaines activités culturelles (musées, monuments, zoo)…'],
            ['Réduit : 5,5 %', 'Alimentation, hygiène et produits de première nécessité, livres, cinéma, spectacle vivant…'],
            ['Particulier : 2,1 %', 'Médicaments remboursables par la sécurité sociale, publications de presse…'],
          ],
        },
      },
      {
        type: 'table',
        table: {
          caption: 'Ce sont des comptes de tiers : une créance (déductible) ou une dette (collectée) envers l’État.',
          headers: ['Comptes débités : TVA déductible (achats)', 'Comptes crédités : TVA exigible (ventes)'],
          rows: [
            ['445 62 – TVA déductible sur immobilisations', '445 71 – TVA collectée'],
            ['445 66 – TVA déductible sur autres biens et services', ''],
          ],
        },
      },
      { type: 'formula', formulaId: 'f-t2-ttc' },
      { type: 'example', exampleId: 'ex-t2-janvier' },
      {
        type: 'table',
        table: {
          caption: 'Régimes de TVA (diapositive 47). Paiement entre le 15 et le 25 du mois suivant au réel normal.',
          headers: ['Régime', 'Ventes de biens et logements', 'Prestations de services', 'Déclaration', 'Paiement'],
          rows: [
            ['Franchise', 'CA < 91 900 €', 'CA < 36 800 €', '–', '–'],
            ['Réel simplifié', 'de 91 900 € à 840 000 €', 'de 36 800 € à 254 000 €', 'Annuelle (CA12)', 'Acomptes semestriels'],
            ['Réel normal', 'CA > 840 000 €', 'CA > 254 000 €', 'Mensuelle (CA3)', 'Mensuel'],
          ],
        },
      },
      { type: 'note', title: 'Seuils', text: 'Ces seuils sont ceux du support de cours. Ils peuvent évoluer : vérifie-les auprès de ton enseignant avant l’examen.' },
      {
        type: 'quickcheck',
        check: {
          question: 'TVA sur l’achat d’une machine (immobilisation) : quel compte ?',
          options: ['445 66', '445 62', '445 71'],
          answer: 1,
          explanation: '445 62 – TVA déductible sur immobilisations.',
        },
      },
      { type: 'summary', items: ['4 taux : 20 ; 10 ; 5,5 ; 2,1 %.', '445 62 et 445 66 au débit (déductible), 445 71 au crédit (collectée).', 'Le régime dépend du chiffre d’affaires.'] },
    ],
  },
  {
    id: 't2-tva-liquidation',
    chapterId: 't2-ch1',
    title: 'Liquider et payer la TVA',
    summary: 'L’écriture de fin de mois, l’arrondi à l’euro et le crédit de TVA.',
    minutes: 8,
    sourcePage: 'diapositives 48 à 51',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Étape', 'Date', 'Débit', 'Crédit'],
          rows: [
            ['Liquidation', 'Dernier jour du mois', '445 71 – TVA collectée', '445 62 et 445 66 – TVA déductible ; 445 51 – TVA à décaisser'],
            ['Paiement', 'Date du paiement (M+1)', '445 51 – TVA à décaisser', '512 – Banque'],
          ],
        },
      },
      {
        type: 'definition',
        term: 'Arrondi de la TVA à décaisser',
        text: 'Le montant de TVA à décaisser est un **nombre entier**, alors que les soldes des comptes 445 ne le sont pas. On équilibre avec le compte **658** (charge) si l’on paie un peu plus, ou **758** (produit) si l’on paie un peu moins.',
      },
      { type: 'example', exampleId: 'ex-t2-juin' },
      {
        type: 'taccount',
        account: { title: '445 51 - État, TVA à décaisser', debits: [{ label: '20/07/N', amount: 4507 }], credits: [{ label: '30/06/N', amount: 4507 }], caption: 'Solde créditeur de 4 507 € fin juin, nul fin juillet' },
      },
      { type: 'heading', text: 'Le crédit de TVA' },
      {
        type: 'text',
        text: 'Parfois, la TVA déductible dépasse la TVA collectée : c’est un **crédit de TVA**. L’entreprise peut l’**imputer** sur la TVA à décaisser du mois suivant ou, sous conditions, en demander le **remboursement**. À la liquidation, on débite alors le compte **445 67 – Crédit de TVA à reporter** au lieu de 445 51.',
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Inverser 658 et 758. Si tu arrondis **vers le haut**, tu paies plus : c’est une **charge** (658). Si tu arrondis **vers le bas**, tu paies moins : c’est un **produit** (758). Exemple du TD n°1 : 9 879,09 → 9 879 €, 0,09 € au 758.' },
      {
        type: 'quickcheck',
        check: {
          question: 'TVA collectée 14 829,09 €, déductible 4 950 €. Quel montant au crédit du 445 51 ?',
          options: ['9 879,09 €', '9 879,00 €', '9 880,00 €'],
          answer: 1,
          explanation: '9 879,09 arrondi à l’euro = 9 879 € ; les 0,09 € vont au crédit du 758 (TD n°1, exercice 2).',
        },
      },
      { type: 'summary', items: ['Liquidation : D 445 71 / C 445 62, 445 66, 445 51.', 'Paiement : D 445 51 / C 512.', 'Écart d’arrondi : 658 (charge) ou 758 (produit).', 'Crédit de TVA : D 445 67.'] },
    ],
  },
  {
    id: 't2-factures',
    chapterId: 't2-ch2',
    title: 'Enregistrer factures et avoirs',
    summary: 'Les comptes d’achats et de ventes, chez le client et chez le fournisseur.',
    minutes: 8,
    sourcePage: 'TD n°1 et sa correction',
    blocks: [
      {
        type: 'note',
        title: 'Source de cette leçon',
        text: 'Les diapositives du cours sur les achats et ventes (52 à 83) ne sont pas fournies. Cette leçon reprend **uniquement** ce que montre la correction du TD n°1.',
      },
      { type: 'example', exampleId: 'ex-t2-facture' },
      {
        type: 'table',
        table: {
          caption: 'Comptes utilisés dans la correction du TD n°1',
          headers: ['Compte', 'Intitulé', 'Quand ?'],
          rows: [
            ['601', 'Achats de matières premières', 'Achat de cuir, de matières (avec le port facturé par le fournisseur)'],
            ['602 6', 'Emballages', 'Sacs destinés à contenir les achats des clients, non revendus'],
            ['607', 'Achats de marchandises', 'Achat de biens revendus en l’état'],
            ['701', 'Ventes de produits finis', 'Vente de ce que l’entreprise fabrique'],
            ['707', 'Ventes de marchandises', 'Vente de biens achetés pour être revendus'],
            ['708 5', 'Ports et frais accessoires facturés', 'Frais de port facturés au client'],
            ['401 / 411', 'Fournisseurs / Clients', 'Dette envers le fournisseur / créance sur le client (TTC)'],
          ],
        },
      },
      { type: 'heading', text: 'Les avoirs' },
      {
        type: 'text',
        text: 'Un **avoir** annule tout ou partie d’une facture (réduction, retour de marchandises). On **inverse** l’écriture de la facture d’origine, pour le montant de l’avoir. Exemple : retour de 25 unités à 100 € HT → débit 707 : 2 500 ; débit 445 71 : 500 ; crédit 411 : 3 000.',
      },
      {
        type: 'journal',
        title: 'Avoir sur ventes (TD n°1, exercice 2, 05/06/N)',
        entry: {
          date: '05/06/N',
          description: 'Avoir sur ventes de m/ses (10 % sur une facture)',
          lines: [
            { debitAccount: '707', label: 'Ventes de marchandises', debit: 18_778.33 },
            { debitAccount: '445 71', label: 'TVA collectée', debit: 3755.67 },
            { creditAccount: '411', label: 'Clients', credit: 22_534 },
          ],
        },
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Calculer la TVA d’un montant TTC en faisant TTC × 20 %. Il faut d’abord retrouver le HT : 22 534 / 1,2 = 18 778,33 € HT, puis TVA = 22 534 − 18 778,33 = 3 755,67 €.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Un client retourne des marchandises. Quel compte est débité pour le montant HT ?',
          options: ['411 – Clients', '707 – Ventes de marchandises', '607 – Achats de marchandises'],
          answer: 1,
          explanation: 'L’avoir inverse la vente : 707 au débit, 445 71 au débit, 411 au crédit.',
        },
      },
      { type: 'summary', items: ['Chez le client : achats (6) + TVA déductible / fournisseur (401).', 'Chez le fournisseur : client (411) / ventes (7) + TVA collectée.', 'Avoir = écriture inversée.'] },
    ],
  },
  {
    id: 't2-reglements',
    chapterId: 't2-ch2',
    title: 'Règlements et acomptes',
    summary: 'Banque, chèque à l’encaissement et acompte versé.',
    minutes: 7,
    sourcePage: 'TD n°1 et sa correction',
    blocks: [
      { type: 'note', title: 'Source de cette leçon', text: 'Comme la précédente, cette leçon s’appuie uniquement sur la correction du TD n°1.' },
      {
        type: 'table',
        table: {
          headers: ['Situation', 'Débit', 'Crédit'],
          rows: [
            ['Paiement d’un fournisseur', '401 – Fournisseurs', '512 – Banque'],
            ['Encaissement d’un client (virement, carte)', '512 – Banque', '411 – Clients'],
            ['Réception d’un chèque client', '511 2 – Chèques à l’encaissement', '411 – Clients'],
          ],
        },
      },
      { type: 'heading', text: 'L’acompte versé à un fournisseur' },
      {
        type: 'text',
        text: 'Le 1er décembre, l’entreprise HENRI verse **200 €** d’acompte au fournisseur POCHON. La correction l’enregistre au compte **409 1 – Fournisseurs, avances et acomptes versés**, avec la TVA comprise dans l’acompte (200 / 1,2 × 20 % = 33,33 €) passée par le compte d’attente **445 85 – TVA déductible lors du paiement**.',
      },
      {
        type: 'journal',
        title: 'Acompte (01/12/N)',
        entry: {
          date: '01/12/N',
          description: 'Acompte versé au fournisseur POCHON',
          lines: [
            { debitAccount: '409 1', label: 'Fournisseurs - Avances et acomptes versés', debit: 200 },
            { debitAccount: '445 66', label: 'TVA sur autres biens et services', debit: 33.33 },
            { creditAccount: '512', label: 'Banque', credit: 200 },
            { creditAccount: '445 85', label: 'TVA déductible lors du paiement', credit: 33.33 },
          ],
        },
      },
      {
        type: 'text',
        text: 'À réception de la facture (500 sacs à 3 € HT = 1 500 € HT, TVA 300 €, TTC 1 800 €), on **solde l’acompte** : crédit 409 1 pour 200 €, et on reprend le compte 445 85 au débit. Le fournisseur n’est crédité que du reste : 1 800 − 200 = **1 600 €**.',
      },
      {
        type: 'journal',
        title: 'Facture après acompte (05/12/N)',
        entry: {
          date: '05/12/N',
          description: 'Achats d’emballages - Facture n°2030',
          lines: [
            { debitAccount: '602 6', label: 'Emballages', debit: 1500 },
            { debitAccount: '445 66', label: 'TVA sur autres biens et services', debit: 266.67 },
            { debitAccount: '445 85', label: 'TVA déductible lors du paiement', debit: 33.33 },
            { creditAccount: '401', label: 'Fournisseurs', credit: 1600 },
            { creditAccount: '409 1', label: 'Fournisseurs - Avances et acomptes versés', credit: 200 },
          ],
        },
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Facture de 1 800 € TTC après un acompte de 200 €. Combien reste-t-il à devoir au fournisseur (401) ?',
          options: ['1 800 €', '1 600 €', '2 000 €'],
          answer: 1,
          explanation: '1 800 − 200 = 1 600 € au crédit du 401 ; les 200 € soldent le 409 1.',
        },
      },
      { type: 'summary', items: ['Payer : D 401 / C 512. Encaisser : D 512 / C 411.', 'Chèque reçu : 511 2.', 'Acompte versé : 409 1, soldé à la facture.'] },
    ],
  },
  {
    id: 't2-paie-elements',
    chapterId: 't2-ch3',
    title: 'Les éléments de la paie',
    summary: 'Salaire brut, cotisations, prélèvement à la source et net payé.',
    minutes: 7,
    sourcePage: 'diapositives 84 à 87',
    blocks: [
      { type: 'diagram', kind: 'paie-schema' },
      {
        type: 'table',
        table: {
          headers: ['Élément', 'Ce qu’il comprend'],
          rows: [
            ['Salaire brut', 'Salaire contractuel ; heures complémentaires ou supplémentaires et majorations ; primes et indemnités ; avantages en nature (voiture, logement de fonction…)'],
            ['Cotisations sociales', 'Prélèvements obligatoires qui ouvrent droit à des prestations. Une part est **salariale**, l’autre **patronale**. L’employeur collecte et verse le tout aux organismes sociaux (Sécurité sociale, Pôle Emploi, AGIRC-ARRCO, mutuelles…).'],
            ['Prélèvement à la source (PAS)', 'Depuis le 1er janvier 2019, l’impôt sur le revenu est prélevé par l’employeur selon un taux transmis par l’administration fiscale, puis reversé au Trésor Public le mois suivant.'],
          ],
        },
      },
      { type: 'formula', formulaId: 'f-t2-paie' },
      { type: 'formula', formulaId: 'f-t2-cout' },
      { type: 'example', exampleId: 'ex-t2-bulletin' },
      { type: 'warning', title: 'Erreur fréquente', text: 'Oublier que les cotisations **patronales** ne sont pas retenues sur le salaire : elles s’ajoutent au brut et sont une charge en plus pour l’employeur.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Brut 4 500 €, net à payer avant IR 3 500,76 €. Combien de cotisations salariales ?',
          options: ['999,24 €', '1 836,40 €', '257,79 €'],
          answer: 0,
          explanation: '4 500 − 3 500,76 = 999,24 €.',
        },
      },
      { type: 'summary', items: ['Brut − cotisations salariales = net avant IR.', 'Net avant IR − PAS = net payé.', 'Coût total = brut + cotisations patronales.'] },
    ],
  },
  {
    id: 't2-paie-ecritures',
    chapterId: 't2-ch3',
    title: 'Comptabiliser la paie',
    summary: 'Le calendrier, le schéma et les écritures du mois M et M+1.',
    minutes: 8,
    sourcePage: 'diapositives 88 à 91',
    blocks: [
      { type: 'diagram', kind: 'paie-calendrier' },
      {
        type: 'steps',
        title: 'Étape 1 : constater le coût du travail et les dettes (fin du mois M)',
        items: [
          'Débit **641 1** Rémunération du personnel : salaire brut',
          'Crédit **421** Personnel - Rémunérations dues : net payé',
          'Crédit **43** Sécurité sociale et organismes sociaux : cotisations salariales',
          'Crédit **442 1** Prélèvement à la source : PAS',
          'Puis débit **645** Charges de sécurité sociale / crédit **43** : cotisations patronales',
        ],
      },
      { type: 'example', exampleId: 'ex-t2-bulletin' },
      {
        type: 'journal',
        title: 'Cotisations patronales (30/10/N)',
        entry: {
          date: '30/10/N',
          description: 'Cotisations sociales patronales d’octobre N',
          lines: [
            { debitAccount: '645', label: 'Charges de sécurité sociale et de prévoyance', debit: 1836.4 },
            { creditAccount: '43', label: 'Sécurité sociale et organismes sociaux', credit: 1836.4 },
          ],
        },
      },
      {
        type: 'steps',
        title: 'Étape 2 : payer les dettes',
        items: [
          'Salaire net : débit 421 / crédit 512 (3 242,97 € le 30/10/N)',
          'Cotisations : débit 43 / crédit 512 (999,24 + 1 836,40 = 2 835,64 € le 15/11/N)',
          'PAS : débit 442 1 / crédit 512 (257,79 € le 18/11/N)',
        ],
      },
      { type: 'tip', title: 'Vérification', text: 'Après tous les paiements, les comptes 421, 43 et 442 1 sont soldés : toutes les dettes sont payées.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Quel compte enregistre les cotisations patronales en charge ?',
          options: ['641 1', '645', '43'],
          answer: 1,
          explanation: '645 – Charges de sécurité sociale et de prévoyance, par le crédit du 43.',
        },
      },
      { type: 'summary', items: ['M : D 641 1 / C 421, 43, 442 1 et D 645 / C 43.', 'M+1 : on solde 421, 43 et 442 1 par la banque.'] },
    ],
  },
]

const VF = ['Vrai', 'Faux']

export const exercises: Exercise[] = [
  {
    id: 'ex-t2-01', source: 'TD n°1, exercice 1', chapterId: 't2-ch2', lessonId: 't2-factures', notion: 'Facture chez le client et le fournisseur', level: 'debutant', kind: 'calcul',
    title: 'La facture n°35', statement: 'Facture de **5 300 € HT**, TVA 20 %, payée comptant par carte bancaire.',
    inputs: [
      { id: 'a', type: 'number', label: 'TVA', answer: 1060, unit: '€' },
      { id: 'b', type: 'number', label: 'Montant TTC', answer: 6360, unit: '€' },
      { id: 'c', type: 'text', label: 'Compte de TVA chez le client (Faye)', answers: ['445 66', '44566'] },
      { id: 'd', type: 'text', label: 'Compte de TVA chez le fournisseur', answers: ['445 71', '44571'] },
    ],
    explanation: 'Le client déduit la TVA (445 66), le fournisseur la collecte (445 71).',
    steps: ['TVA = 5 300 × 20 % = **1 060 €**', 'TTC = 5 300 + 1 060 = **6 360 €**'],
  },
  {
    id: 'ex-t2-02', source: 'TD n°1, exercice 2', chapterId: 't2-ch2', lessonId: 't2-factures', notion: 'Du TTC au HT', level: 'intermediaire', kind: 'calcul',
    title: 'Vente au comptant de 54 508,56 € TTC', statement: 'Le 03/06/N, l’entreprise Hoche vend des marchandises au comptant pour **54 508,56 € TTC** (TVA 20 %). Retrouve le HT et la TVA.',
    inputs: [
      { id: 'a', type: 'number', label: 'Montant HT (707)', answer: 45_423.8, unit: '€' },
      { id: 'b', type: 'number', label: 'TVA collectée (445 71)', answer: 9084.76, unit: '€' },
    ],
    explanation: 'On divise le TTC par 1,2 pour obtenir le HT.',
    steps: ['HT = 54 508,56 / 1,2 = **45 423,80 €**', 'TVA = 54 508,56 − 45 423,80 = **9 084,76 €**'],
  },
  {
    id: 'ex-t2-03', source: 'TD n°1, exercice 2', chapterId: 't2-ch2', lessonId: 't2-factures', notion: 'Avoir', level: 'intermediaire', kind: 'calcul',
    title: 'Le retour de l’entreprise FRANÇOIS', statement: 'Vente de 500 unités à 100 € HT le 10/06/N, puis retour de **25 unités** le 18/06/N (avoir immédiat). Calcule l’avoir.',
    inputs: [
      { id: 'a', type: 'number', label: 'HT de l’avoir (débit 707)', answer: 2500, unit: '€' },
      { id: 'b', type: 'number', label: 'TVA (débit 445 71)', answer: 500, unit: '€' },
      { id: 'c', type: 'number', label: 'TTC (crédit 411)', answer: 3000, unit: '€' },
    ],
    explanation: 'L’avoir inverse la vente, pour les 25 unités retournées.',
    steps: ['25 × 100 = **2 500 € HT**', 'TVA = 2 500 × 20 % = **500 €**', 'TTC = **3 000 €**'],
  },
  {
    id: 'ex-t2-04', source: 'TD n°1, exercice 2', chapterId: 't2-ch1', lessonId: 't2-tva-liquidation', notion: 'Liquidation de TVA', level: 'avance', kind: 'probleme',
    title: 'La TVA de juin chez Hoche', statement: 'TVA collectée en juin : 9 084,76 − 3 755,67 (avoir) + 10 000 − 500 (avoir). TVA déductible : 4 950 €. Calcule la TVA due et prépare la liquidation.',
    inputs: [
      { id: 'a', type: 'number', label: 'TVA collectée nette', answer: 14_829.09, unit: '€' },
      { id: 'b', type: 'number', label: 'TVA due (exacte)', answer: 9879.09, unit: '€' },
      { id: 'c', type: 'number', label: 'Montant au crédit du 445 51', answer: 9879, unit: '€' },
      { id: 'd', type: 'choice', prompt: 'Compte qui reçoit l’écart de 0,09 €', options: ['658 – Charge', '758 – Produit'], answer: 1 },
    ],
    explanation: 'On paie 0,09 € de moins que le montant exact : c’est un produit (758).',
    steps: ['Collectée = 9 084,76 − 3 755,67 + 10 000 − 500 = **14 829,09 €**', 'Due = 14 829,09 − 4 950 = **9 879,09 €**', 'Arrondi à l’euro : **9 879 €** au 445 51 ; 0,09 € au crédit du **758**'],
  },
  {
    id: 'ex-t2-05', source: 'Exemple du cours, diapositive 46', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', notion: 'TVA à décaisser', level: 'debutant', kind: 'numerique',
    title: 'La TVA de janvier', statement: 'TVA collectée 9 000 € ; TVA déductible sur immobilisations 200 € ; sur autres biens et services 3 650 €. Quelle est la TVA à décaisser ?',
    inputs: [{ id: 'a', type: 'number', label: 'TVA à décaisser', answer: 5150, unit: '€' }],
    explanation: 'Collectée − toutes les TVA déductibles.',
    steps: ['9 000 − (200 + 3 650) = **5 150 €**'],
  },
  {
    id: 'ex-t2-06', source: 'Exemple du cours, diapositive 49', chapterId: 't2-ch1', lessonId: 't2-tva-liquidation', notion: 'Arrondi de la TVA', level: 'intermediaire', kind: 'calcul',
    title: 'L’arrondi de juin', statement: 'TVA collectée 40 000,00 € ; TVA déductible 35 493,45 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'TVA à décaisser (arrondie)', answer: 4507, unit: '€' },
      { id: 'b', type: 'number', label: 'Écart d’arrondi', answer: 0.45, unit: '€' },
      { id: 'c', type: 'text', label: 'Compte de l’écart', answers: ['658'] },
    ],
    explanation: '4 506,55 arrondi au-dessus : on paie 0,45 € de plus, c’est une charge (658).',
    steps: ['40 000 − 35 493,45 = 4 506,55 €', 'Arrondi : **4 507 €**', 'Écart **0,45 €** au débit du **658**'],
  },
  {
    id: 'ex-t2-07', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', notion: 'Taux de TVA', level: 'debutant', kind: 'qcm',
    title: 'Un repas au restaurant', statement: 'Quel taux de TVA s’applique à la restauration, selon le cours ?',
    inputs: [{ id: 'a', type: 'choice', options: ['20 %', '10 %', '5,5 %', '2,1 %'], answer: 1 }],
    explanation: 'Taux intermédiaire de 10 % : restauration, transport de voyageurs, certaines activités culturelles.',
  },
  {
    id: 'ex-t2-08', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', notion: 'Régimes de TVA', level: 'intermediaire', kind: 'qcm',
    title: 'Quel régime ?', statement: 'Un prestataire de services réalise **300 000 €** de chiffre d’affaires annuel. Selon le tableau du cours, quel est son régime ?',
    inputs: [{ id: 'a', type: 'choice', options: ['Franchise', 'Réel simplifié', 'Réel normal'], answer: 2 }],
    explanation: 'Prestations de services : réel normal au-delà de 254 000 €. Déclaration mensuelle (CA3).',
  },
  {
    id: 'ex-t2-09', chapterId: 't2-ch1', lessonId: 't2-tva-liquidation', notion: 'Crédit de TVA', level: 'intermediaire', kind: 'vrai-faux',
    title: 'Crédit de TVA', statement: 'Vrai ou faux : en cas de crédit de TVA, on débite le compte 445 67 au lieu du compte 445 51.',
    inputs: [{ id: 'a', type: 'choice', options: VF, answer: 0 }],
    explanation: '445 67 – Crédit de TVA à reporter est débité à la place de 445 51 (diapositive 51).',
  },
  {
    id: 'ex-t2-10', source: 'TD n°1, exercice 3', chapterId: 't2-ch2', lessonId: 't2-factures', notion: 'Facture avec frais de port', level: 'intermediaire', kind: 'calcul',
    title: 'La vente au magasin En Marche', statement: '80 paires à 120 € HT et 24 paires de bottes à 150 € HT ; frais de port facturés 200 € HT ; TVA 20 %.',
    inputs: [
      { id: 'a', type: 'number', label: 'Ventes de produits finis (701)', answer: 13_200, unit: '€' },
      { id: 'b', type: 'number', label: 'TVA collectée', answer: 2680, unit: '€' },
      { id: 'c', type: 'number', label: 'Montant TTC (411)', answer: 16_080, unit: '€' },
      { id: 'd', type: 'text', label: 'Compte des frais de port facturés', answers: ['708 5', '7085'] },
    ],
    explanation: 'Les frais de port facturés vont au 708 5 et supportent aussi la TVA.',
    steps: ['80 × 120 + 24 × 150 = 9 600 + 3 600 = **13 200 €**', 'TVA = (13 200 + 200) × 20 % = **2 680 €**', 'TTC = 13 400 + 2 680 = **16 080 €**'],
  },
  {
    id: 'ex-t2-11', source: 'TD n°1, exercice 3', chapterId: 't2-ch2', lessonId: 't2-reglements', notion: 'Acompte', level: 'avance', kind: 'probleme',
    title: 'Les sacs du fournisseur POCHON', statement: 'Acompte de 200 € versé le 01/12. Facture du 05/12 : 500 sacs à 3 € HT, TVA 20 %.',
    inputs: [
      { id: 'a', type: 'number', label: 'Emballages HT (602 6)', answer: 1500, unit: '€' },
      { id: 'b', type: 'number', label: 'Montant TTC de la facture', answer: 1800, unit: '€' },
      { id: 'c', type: 'number', label: 'Crédit du 401 (après acompte)', answer: 1600, unit: '€' },
      { id: 'd', type: 'text', label: 'Compte de l’acompte soldé', answers: ['409 1', '4091', '409'] },
    ],
    explanation: 'La facture totale est de 1 800 € TTC ; l’acompte de 200 € (409 1) est soldé, il reste 1 600 € dus au fournisseur.',
    steps: ['500 × 3 = **1 500 € HT**', 'TTC = 1 500 × 1,2 = **1 800 €**', 'Reste dû = 1 800 − 200 = **1 600 €**'],
  },
  {
    id: 'ex-t2-12', source: 'TD n°1, exercice 3', chapterId: 't2-ch2', lessonId: 't2-reglements', notion: 'Bilan et compte de résultat', level: 'avance', kind: 'probleme',
    title: 'Le résultat de HENRI au 10 décembre', statement: 'Produits : ventes de produits finis 53 200 € et ports facturés 600 €. Charges : matières 11 000 €, emballages 1 200 €, transports sur achats 100 €. Bilan d’ouverture : 15 000 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Total des charges', answer: 12_300, unit: '€' },
      { id: 'b', type: 'number', label: 'Résultat', answer: 41_500, unit: '€' },
      { id: 'c', type: 'number', label: 'Total du bilan d’ouverture', answer: 15_000, unit: '€' },
    ],
    explanation: 'Résultat = produits − charges = 53 800 − 12 300. Le bilan d’ouverture : immobilisations 13 000 + banque 2 000 = capital 10 000 + dettes 5 000.',
    steps: ['Produits = 53 200 + 600 = 53 800 €', 'Charges = 11 000 + 1 200 + 100 = **12 300 €**', 'Résultat = **41 500 €** (bénéfice)'],
  },
  {
    id: 'ex-t2-13', source: 'Exemple du cours, diapositive 87', chapterId: 't2-ch3', lessonId: 't2-paie-elements', notion: 'Bulletin de paie', level: 'intermediaire', kind: 'calcul',
    title: 'Le bulletin d’octobre', statement: 'Salaire brut 4 500 € ; net à payer avant impôt 3 500,76 € ; prélèvement à la source 257,79 € ; cotisations patronales 1 836,40 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Cotisations salariales', answer: 999.24, unit: '€' },
      { id: 'b', type: 'number', label: 'Net payé', answer: 3242.97, unit: '€' },
      { id: 'c', type: 'number', label: 'Coût total employeur', answer: 6336.4, unit: '€' },
    ],
    explanation: 'Cotisations salariales = brut − net avant IR ; net payé = net avant IR − PAS ; coût total = brut + patronales.',
    steps: ['4 500 − 3 500,76 = **999,24 €**', '3 500,76 − 257,79 = **3 242,97 €**', '4 500 + 1 836,40 = **6 336,40 €**'],
  },
  {
    id: 'ex-t2-14', source: 'Titre 2 – Correction, exercice 6', chapterId: 't2-ch3', lessonId: 't2-paie-ecritures', notion: 'Écritures de paie', level: 'avance', kind: 'probleme',
    title: 'La paie de février', statement: 'Deux salariés. Salaire brut total 15 000 € ; nets à payer : N. Beaufort 4 800 €, M. Coulommiers 6 400 € ; cotisations salariales 2 500 € ; prélèvement à la source 1 300 € ; cotisations patronales 5 200 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Total crédité au 421 (nets)', answer: 11_200, unit: '€' },
      { id: 'b', type: 'number', label: 'Versement aux organismes sociaux (43) le 12/03', answer: 7700, unit: '€' },
      { id: 'c', type: 'text', label: 'Compte débité pour les cotisations patronales', answers: ['645'] },
    ],
    explanation: 'Le compte 43 reçoit les cotisations salariales et patronales : il est soldé par un seul versement.',
    steps: ['421 : 4 800 + 6 400 = **11 200 €** (vérif. : 15 000 − 2 500 − 1 300)', '43 : 2 500 + 5 200 = **7 700 €**', 'Patronales : débit **645**, crédit 43'],
  },
  {
    id: 'ex-t2-15', chapterId: 't2-ch3', lessonId: 't2-paie-ecritures', notion: 'Calendrier de la paie', level: 'debutant', kind: 'qcm',
    title: 'Quand payer le prélèvement à la source ?', statement: 'D’après le calendrier du cours, quand le prélèvement à la source est-il versé au Trésor Public ?',
    inputs: [{ id: 'a', type: 'choice', options: ['À la fin du mois M', 'Entre le 5 et le 15 de M+1', 'Entre le 8 et le 18 de M+1'], answer: 2 }],
    explanation: 'Cotisations : entre le 5 et le 15 de M+1. PAS : entre le 8 et le 18 de M+1.',
  },
]

export const quizQuestions: QuizQuestion[] = [
  { id: 'q-t2-01', chapterId: 't2-ch1', lessonId: 't2-tva-mecanisme', level: 'debutant', type: 'qcm', prompt: 'Qui supporte finalement la TVA ?', options: ['L’entreprise qui vend', 'Le consommateur final', 'Le fournisseur'], answer: 1, explanation: 'Impôt sur la consommation dû par l’utilisateur final.' },
  { id: 'q-t2-02', chapterId: 't2-ch1', lessonId: 't2-tva-mecanisme', level: 'debutant', type: 'qcm', prompt: 'Qui a inventé la TVA en 1954 ?', options: ['Luca Pacioli', 'Maurice Lauré', 'Pierre Garnier'], answer: 1, explanation: 'Maurice Lauré, directeur adjoint de la DGI.' },
  { id: 'q-t2-03', chapterId: 't2-ch1', lessonId: 't2-tva-mecanisme', level: 'intermediaire', type: 'qcm', prompt: 'Exigibilité d’une prestation de services :', options: ['Date de livraison', 'Date d’achèvement de la prestation', 'Date du paiement'], answer: 1, explanation: 'Biens : livraison. Services : achèvement.' },
  { id: 'q-t2-04', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', level: 'debutant', type: 'qcm', prompt: 'Taux de TVA d’un médicament remboursable :', options: ['20 %', '10 %', '5,5 %', '2,1 %'], answer: 3, explanation: 'Taux particulier de 2,1 %.' },
  { id: 'q-t2-05', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', level: 'intermediaire', type: 'numerique', prompt: 'Collectée 9 000 € ; déductible 200 € (immo.) et 3 650 € (B&S). TVA à décaisser ?', answer: 5150, unit: '€', explanation: '9 000 − 3 850 = 5 150 €.' },
  { id: 'q-t2-06', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', level: 'intermediaire', type: 'qcm', prompt: 'Le compte 445 71 est…', options: ['TVA déductible sur immobilisations', 'TVA collectée', 'TVA à décaisser'], answer: 1, explanation: '445 71 – TVA collectée.' },
  { id: 'q-t2-07', chapterId: 't2-ch1', lessonId: 't2-tva-liquidation', level: 'avance', type: 'qcm', prompt: 'TVA due exacte : 4 506,55 €. Quelle écriture pour l’écart ?', options: ['Débit 658 : 0,45 €', 'Crédit 758 : 0,55 €', 'Aucune'], answer: 0, explanation: 'Arrondi à 4 507 € : on paie 0,45 € de plus, charge au 658.' },
  { id: 'q-t2-08', chapterId: 't2-ch1', lessonId: 't2-tva-liquidation', level: 'intermediaire', type: 'qcm', prompt: 'Paiement de la TVA : quelle écriture ?', options: ['D 445 51 / C 512', 'D 512 / C 445 51', 'D 445 71 / C 512'], answer: 0, explanation: 'On solde la dette envers l’État par la banque.' },
  { id: 'q-t2-09', chapterId: 't2-ch1', lessonId: 't2-tva-comptes', level: 'avance', type: 'qcm', prompt: 'Vente de biens, CA annuel de 500 000 € : régime ?', options: ['Franchise', 'Réel simplifié', 'Réel normal'], answer: 1, explanation: 'Entre 91 900 € et 840 000 € : réel simplifié (déclaration annuelle CA12, acomptes semestriels).' },
  { id: 'q-t2-10', chapterId: 't2-ch2', lessonId: 't2-factures', level: 'intermediaire', type: 'numerique', prompt: 'Avoir de 22 534 € TTC (TVA 20 %). Montant HT ?', answer: 18_778.33, unit: '€', explanation: '22 534 / 1,2 = 18 778,33 €.' },
  { id: 'q-t2-11', chapterId: 't2-ch2', lessonId: 't2-factures', level: 'debutant', type: 'qcm', prompt: 'Chez le fournisseur, la vente de ses produits finis va au compte…', options: ['607', '701', '411'], answer: 1, explanation: '701 – Ventes de produits finis (707 pour des marchandises).' },
  { id: 'q-t2-12', chapterId: 't2-ch2', lessonId: 't2-reglements', level: 'intermediaire', type: 'qcm', prompt: 'Un chèque client reçu mais pas encore déposé va au compte…', options: ['512', '511 2', '531'], answer: 1, explanation: '511 2 – Chèques à l’encaissement (TD n°1, exercice 2).' },
  { id: 'q-t2-13', chapterId: 't2-ch2', lessonId: 't2-reglements', level: 'avance', type: 'qcm', prompt: 'Acompte versé à un fournisseur : quel compte ?', options: ['401', '409 1', '419'], answer: 1, explanation: '409 1 – Fournisseurs, avances et acomptes versés.' },
  { id: 'q-t2-14', chapterId: 't2-ch3', lessonId: 't2-paie-elements', level: 'debutant', type: 'vrai-faux', prompt: 'Les cotisations patronales sont retenues sur le salaire brut du salarié.', options: VF, answer: 1, explanation: 'Elles s’ajoutent au brut : c’est une charge de l’employeur (645).' },
  { id: 'q-t2-15', chapterId: 't2-ch3', lessonId: 't2-paie-elements', level: 'intermediaire', type: 'numerique', prompt: 'Net avant IR 3 500,76 € ; PAS 257,79 €. Net payé ?', answer: 3242.97, unit: '€', explanation: '3 500,76 − 257,79 = 3 242,97 €.' },
  { id: 'q-t2-16', chapterId: 't2-ch3', lessonId: 't2-paie-ecritures', level: 'intermediaire', type: 'qcm', prompt: 'Le salaire brut est enregistré au débit du…', options: ['421', '641 1', '645'], answer: 1, explanation: '641 1 – Rémunération du personnel.' },
  { id: 'q-t2-17', chapterId: 't2-ch3', lessonId: 't2-paie-ecritures', level: 'avance', type: 'numerique', prompt: 'Cotisations salariales 999,24 € et patronales 1 836,40 €. Versement aux organismes sociaux ?', answer: 2835.64, unit: '€', explanation: '999,24 + 1 836,40 = 2 835,64 €.' },
  { id: 'q-t2-18', chapterId: 't2-ch3', lessonId: 't2-paie-ecritures', level: 'intermediaire', type: 'qcm', prompt: 'Le prélèvement à la source est une dette envers…', options: ['Les organismes sociaux (43)', 'L’État (442 1)', 'Le salarié (421)'], answer: 1, explanation: '442 1 – Prélèvement à la source, reversé au Trésor Public.' },
]

export const quizSeries: QuizSeries[] = [
  {
    id: 'qs-t2',
    title: 'Titre 2 : TVA, achats, ventes et paie',
    description: 'Mécanisme et liquidation de la TVA, factures, avoirs, acomptes et écritures de paie.',
    level: 'intermediaire',
    chapterIds: ['t2-ch1', 't2-ch2', 't2-ch3'],
    questionIds: quizQuestions.map((q) => q.id),
    timeLimitSec: 10 * 60,
  },
]

export const glossary: GlossaryEntry[] = [
  { term: 'Acompte', definition: 'Somme versée avant la facture. Chez le client : 409 1 – Fournisseurs, avances et acomptes versés.', lessonId: 't2-reglements' },
  { term: 'Avoir', definition: 'Document qui annule tout ou partie d’une facture ; on inverse l’écriture d’origine.', lessonId: 't2-factures' },
  { term: 'Cotisations sociales', definition: 'Prélèvements obligatoires, salariaux et patronaux, versés par l’employeur aux organismes sociaux (43).', lessonId: 't2-paie-elements' },
  { term: 'Crédit de TVA', definition: 'Excédent de TVA déductible sur la TVA collectée ; compte 445 67, imputé ou remboursé.', lessonId: 't2-tva-liquidation' },
  { term: 'Exigibilité', definition: 'Date à laquelle la TVA est due : livraison (biens) ou achèvement (services).', lessonId: 't2-tva-mecanisme' },
  { term: 'Liquidation de la TVA', definition: 'Écriture de fin de mois qui solde 445 71, 445 62 et 445 66 et constate la TVA à décaisser (445 51).', lessonId: 't2-tva-liquidation' },
  { term: 'Prélèvement à la source (PAS)', definition: 'Impôt sur le revenu retenu par l’employeur et reversé au Trésor Public (442 1).', lessonId: 't2-paie-elements' },
  { term: 'Salaire brut', definition: 'Salaire contractuel, heures sup., primes et avantages en nature (641 1).', lessonId: 't2-paie-elements' },
  { term: 'TVA collectée', definition: 'TVA facturée sur les ventes : dette envers l’État (445 71).', lessonId: 't2-tva-comptes' },
  { term: 'TVA déductible', definition: 'TVA payée sur les achats : créance sur l’État (445 62 immobilisations, 445 66 autres B&S).', lessonId: 't2-tva-comptes' },
]
