import type { Chapter, Example, Exercise, Formula, GlossaryEntry, Lesson, QuizQuestion, QuizSeries } from '@/types'

/**
 * Titre 3 – Les immobilisations (PPT CM, diapositives 93 à 118) et TD n°4 avec sa correction.
 */

export const chapters: Chapter[] = [
  {
    id: 't3-ch1',
    partId: 't3',
    number: 1,
    title: 'Définition et typologie',
    subtitle: 'Qu’est-ce qu’une immobilisation ?',
    objectives: ['Reconnaître un actif', 'Distinguer immobilisation et charge', 'Classer une immobilisation'],
    lessonIds: ['t3-definition'],
    sourcePages: 'diapositives 93 à 95',
  },
  {
    id: 't3-ch2',
    partId: 't3',
    number: 2,
    title: 'L’acquisition',
    subtitle: 'Coût d’acquisition et comptabilisation',
    objectives: ['Calculer un coût d’acquisition', 'Appliquer ou non la méthode de référence', 'Enregistrer l’acquisition'],
    lessonIds: ['t3-cout', 't3-acquisition'],
    sourcePages: 'diapositives 96 à 102',
  },
  {
    id: 't3-ch3',
    partId: 't3',
    number: 3,
    title: 'L’amortissement',
    subtitle: 'Linéaire, prorata temporis et unités d’œuvre',
    objectives: ['Calculer une base amortissable', 'Établir un plan linéaire avec prorata', 'Amortir par unités d’œuvre', 'Enregistrer la dotation'],
    lessonIds: ['t3-amort-lineaire', 't3-amort-uo', 't3-amort-compta'],
    sourcePages: 'diapositives 103 à 109',
  },
  {
    id: 't3-ch4',
    partId: 't3',
    number: 4,
    title: 'La dépréciation',
    subtitle: 'Valeur actuelle, dépréciation et reprise',
    objectives: ['Calculer une valeur actuelle', 'Comptabiliser une dépréciation ou une reprise', 'Corriger le plan d’amortissement'],
    lessonIds: ['t3-depreciation', 't3-depreciation-amortissable'],
    sourcePages: 'diapositives 110 à 116',
  },
  {
    id: 't3-ch5',
    partId: 't3',
    number: 5,
    title: 'La sortie',
    subtitle: 'Céder une immobilisation',
    objectives: ['Enregistrer le prix de cession', 'Sortir l’immobilisation et ses amortissements'],
    lessonIds: ['t3-sortie'],
    sourcePages: 'diapositives 117 et 118',
  },
]

export const formulas: Formula[] = [
  {
    id: 'f-t3-cout',
    title: 'Coût d’acquisition',
    latex: '\\text{Coût d’acquisition} = \\text{Prix d’achat} + \\text{Coûts directement attribuables}',
    variables: [
      { symbol: '\\text{Prix d’achat}', meaning: 'Après réductions commerciales et financières, avec droits de douane et taxes non récupérables' },
      { symbol: '\\text{Coûts directement attribuables}', meaning: 'Coûts engagés pour mettre l’actif en état de fonctionner (transport, installation, essais…)' },
    ],
    whenToUse: 'À l’entrée de l’immobilisation. Exclus : frais administratifs, TVA déductible, formation du personnel.',
    sourcePage: 96,
  },
  {
    id: 'f-t3-base',
    title: 'Base amortissable',
    latex: '\\text{Base amortissable} = \\text{Coût d’acquisition} - \\text{Valeur résiduelle}',
    variables: [{ symbol: '\\text{Valeur résiduelle}', meaning: 'Montant net des coûts de sortie qu’on obtiendrait en vendant le bien à la fin de son utilisation' }],
    whenToUse: 'Avant tout plan d’amortissement.',
    sourcePage: 103,
  },
  {
    id: 'f-t3-lineaire',
    title: 'Dotation linéaire',
    latex: '\\text{Dotation} = \\dfrac{\\text{Base amortissable}}{\\text{Durée d’utilité}} \\times \\text{Prorata temporis}',
    variables: [{ symbol: '\\text{Prorata temporis}', meaning: 'Fraction de l’année d’utilisation (ex. 8,5/12 pour une mise en service le 15 avril)' }],
    whenToUse: 'Mode par défaut. L’amortissement démarre à la date de mise en service.',
    sourcePage: 104,
  },
  {
    id: 'f-t3-uo',
    title: 'Dotation par unités d’œuvre',
    latex: '\\text{Dotation} = \\text{Base amortissable} \\times \\dfrac{\\text{UO de la période}}{\\text{UO totales}}',
    variables: [{ symbol: '\\text{UO}', meaning: 'Unités d’œuvre : km parcourus, heures de travail, pièces produites…' }],
    whenToUse: 'Quand l’utilisation du bien n’est pas régulière dans le temps.',
    sourcePage: 106,
  },
  {
    id: 'f-t3-vnc',
    title: 'Valeur nette comptable',
    latex: '\\text{VNC} = \\text{Coût d’acquisition} - \\text{Amortissements cumulés} - \\text{Dépréciations}',
    variables: [],
    whenToUse: 'À chaque inventaire, pour le test de dépréciation et lors de la sortie.',
    sourcePage: 110,
  },
  {
    id: 'f-t3-va',
    title: 'Valeur actuelle',
    latex: '\\text{Valeur actuelle} = \\max(\\text{Valeur vénale} ;\\ \\text{Valeur d’usage})',
    variables: [
      { symbol: '\\text{Valeur vénale}', meaning: 'Prix de vente possible à la clôture, net des coûts de sortie' },
      { symbol: '\\text{Valeur d’usage}', meaning: 'Valeur des avantages économiques futurs attendus de l’utilisation' },
    ],
    whenToUse: 'Si valeur actuelle < VNC : dépréciation de la différence.',
    sourcePage: 110,
  },
]

export const examples: Example[] = [
  {
    id: 'ex-t3-machine',
    title: 'Coût d’acquisition d’une machine-outil (diapositive 98)',
    statement: 'Prix d’achat 10 000 € ; remise 5 % ; transport 500 € ; installation 300 € ; tests 100 € ; formation du personnel 1 500 € ; honoraires de l’ingénieur 1 000 €.',
    steps: [
      'Prix d’achat net : 10 000 × (1 − 5 %) = 9 500 €',
      'Coûts directement attribuables : 500 + 300 + 100 = 900 €',
      'La formation du personnel (1 500 €) est **exclue**',
      'Méthode de référence (honoraires intégrés) : 9 500 + 900 + 1 000 = **11 400 €**',
      'Sans la méthode de référence : 9 500 + 900 = **10 400 €**, les 1 000 € d’honoraires vont en charges',
    ],
    sourcePage: 98,
  },
  {
    id: 'ex-t3-installation',
    title: 'Plan linéaire avec prorata (diapositive 105)',
    statement: 'Installation technique achetée **100 000 €** le **15 avril N**, amortie en linéaire sur **5 ans** (taux 1/5 = 20 %). Montants arrondis à l’euro, comme dans le cours.',
    steps: [
      'Du 15 avril au 31 décembre : 8,5 mois → dotation N = 100 000 / 5 × 8,5/12 = **14 167 €**',
      'De N+1 à N+4 : 100 000 / 5 = **20 000 €** par an',
      'N+5 : le reste de la 5ᵉ année, 3,5 mois → 100 000 / 5 × 3,5/12 = **5 833 €**',
      'La VNC tombe à 0 au 31/12/N+5',
    ],
    table: {
      headers: ['Date', 'Base', 'Dotation', 'Cumul', 'VNC'],
      numericCols: [1, 2, 3, 4],
      rows: [
        ['31/12/N', '100 000', '14 167', '14 167', '85 833'],
        ['31/12/N+1', '100 000', '20 000', '34 167', '65 833'],
        ['31/12/N+2', '100 000', '20 000', '54 167', '45 833'],
        ['31/12/N+3', '100 000', '20 000', '74 167', '25 833'],
        ['31/12/N+4', '100 000', '20 000', '94 167', '5 833'],
        ['31/12/N+5', '100 000', '5 833', '100 000', '0'],
      ],
    },
    sourcePage: 105,
  },
  {
    id: 'ex-t3-uo',
    title: 'Amortissement par unités d’œuvre (diapositive 107)',
    statement: 'Outillage acquis le 01/01/N pour **50 000 €** ; contrat de 7 ans ; production totale attendue **100 000 unités**.',
    steps: ['Taux d’unité d’œuvre de N = 5 000 / 100 000 = 5 %', 'Dotation N = 50 000 × 5/100 = **2 500 €**', 'Dotation N+2 = 50 000 × 20 000/100 000 = **10 000 €**'],
    table: {
      headers: ['Date', 'Unités', 'Dotation', 'Cumul', 'VNC'],
      numericCols: [1, 2, 3, 4],
      rows: [
        ['31/12/N', '5 000', '2 500', '2 500', '47 500'],
        ['31/12/N+1', '15 000', '7 500', '10 000', '40 000'],
        ['31/12/N+2', '20 000', '10 000', '20 000', '30 000'],
        ['31/12/N+3', '20 000', '10 000', '30 000', '20 000'],
        ['31/12/N+4', '20 000', '10 000', '40 000', '10 000'],
        ['31/12/N+5', '15 000', '7 500', '47 500', '2 500'],
        ['31/12/N+6', '5 000', '2 500', '50 000', '0'],
      ],
    },
    sourcePage: 107,
  },
  {
    id: 'ex-t3-terrain',
    title: 'Dépréciation d’un terrain (diapositives 111 et 112)',
    statement: 'Terrain acquis **180 000 €**, jamais déprécié (un terrain ne s’amortit pas). Au 31/12/N : valeur vénale **155 000 €**, valeur d’usage **161 909 €**.',
    steps: ['Valeur actuelle = la plus élevée = **161 909 €**', 'VNC = 180 000 € > valeur actuelle → dépréciation', 'Dépréciation = 180 000 − 161 909 = **18 091 €**'],
    journal: {
      date: '31/12/N',
      description: 'Dépréciation du terrain',
      lines: [
        { debitAccount: '681 62', label: 'Dotations aux dépré. des immo. corporelles', debit: 18_091 },
        { creditAccount: '291 1', label: 'Dépréciation des terrains', credit: 18_091 },
      ],
    },
    sourcePage: 112,
  },
  {
    id: 'ex-t3-cession',
    title: 'Cession d’un véhicule utilitaire (diapositive 118)',
    statement: 'Véhicule acquis le 01/01/N pour **25 000 €**, durée d’utilité 5 ans. Cédé le **01/07/N+3** pour **6 000 € HT** (TVA 20 %), paiement différé.',
    steps: [
      'Amortissement annuel = 25 000 / 5 = 5 000 € ; cumul au 01/01/N+3 = 15 000 €',
      'Dotation complémentaire du 01/01 au 01/07/N+3 = 5 000 × 6/12 = **2 500 €**',
      'Amortissements cumulés = 17 500 € ; VNC = 25 000 − 17 500 = **7 500 €**',
      'Prix de cession 6 000 € − VNC 7 500 € = moins-value de 1 500 € (757 − 657)',
    ],
    journal: {
      date: '01/07/N+3',
      description: 'Sortie de l’actif du véhicule',
      lines: [
        { debitAccount: '657', label: 'Valeur comptable des immobilisations cédées', debit: 7500 },
        { debitAccount: '281 82', label: 'Amortissements des matériels de transport', debit: 17_500 },
        { creditAccount: '218 2', label: 'Matériels de transport', credit: 25_000 },
      ],
    },
    sourcePage: 118,
  },
]

export const lessons: Lesson[] = [
  {
    id: 't3-definition',
    chapterId: 't3-ch1',
    title: 'Qu’est-ce qu’une immobilisation ?',
    summary: 'Un actif destiné à servir durablement, au-delà d’un an.',
    minutes: 6,
    sourcePage: 'diapositives 93 à 95',
    blocks: [
      {
        type: 'table',
        table: {
          caption: 'Un actif réunit trois caractéristiques',
          headers: ['Caractéristique', 'Ce que ça veut dire'],
          rows: [
            ['Élément identifiable', 'Acquis séparément, individualisé (par exemple par un numéro de série)'],
            ['Porteur d’avantages économiques futurs', 'Flux de trésorerie au bénéfice de l’entité, ou capacité à réduire des décaissements (directement ou indirectement)'],
            ['Ressource contrôlée par l’entité', 'Les avantages futurs doivent être contrôlés par l’entité (contre-exemple du cours : la formation du personnel)'],
          ],
        },
      },
      { type: 'text', text: 'En plus, son coût ou sa valeur doit pouvoir être **évalué avec une fiabilité suffisante**.' },
      { type: 'definition', term: 'Immobilisation', text: 'Un actif destiné à servir **de façon durable** (plus d’un an) l’activité de l’entreprise. La notion est proche de celle d’**investissement** en finance.' },
      {
        type: 'table',
        table: {
          headers: ['Incorporelles', 'Corporelles', 'Financières'],
          rows: [['Actif non monétaire sans substance physique', 'Actif avec substance physique qui sert à la production de biens et services, à dégager des revenus ou au fonctionnement de l’entreprise', 'Actif monétaire']],
        },
      },
      { type: 'note', title: 'Périmètre du cours', text: 'La suite du Titre 3 porte sur les **immobilisations corporelles**.' },
      {
        type: 'definition',
        term: 'Seuil de 500 € HT',
        text: 'Par simplification, une dépense qui répond à la définition d’une immobilisation peut être traitée en **charge** si elle est non significative : moins de **500 € HT par unité**.',
      },
      { type: 'tip', title: 'Exemple du cours', text: 'Un restaurant achète 10 chaises pour 1 200 € HT, soit **120 € HT l’unité** : en charges. C’est le prix **unitaire** qui compte, pas le total.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Une imprimante de 600 € HT, utilisée plusieurs années : immobilisation ou charge ?',
          options: ['Immobilisation', 'Charge'],
          answer: 0,
          explanation: 'Elle sert durablement et dépasse le seuil de 500 € HT (TD n°4, exercice 1).',
        },
      },
      { type: 'summary', items: ['Actif = identifiable, avantages futurs, contrôlé, évaluable.', 'Immobilisation = actif durable (> 1 an).', 'Moins de 500 € HT l’unité : charge possible.'] },
    ],
  },
  {
    id: 't3-cout',
    chapterId: 't3-ch2',
    title: 'Le coût d’acquisition',
    summary: 'Ce que l’on inclut, ce que l’on exclut, et la méthode de référence.',
    minutes: 7,
    sourcePage: 'diapositives 96 à 99',
    blocks: [
      { type: 'formula', formulaId: 'f-t3-cout' },
      {
        type: 'table',
        table: {
          headers: ['Inclus dans le prix d’achat', 'Exclus (charges)'],
          rows: [
            ['Après réductions commerciales (rabais, remises) et financières (escomptes)', 'Frais administratifs et frais généraux'],
            ['Droits de douane et taxes non récupérables', 'TVA déductible'],
            ['Coûts pour mettre l’actif en état de fonctionner', 'Frais de formation du personnel'],
          ],
        },
      },
      {
        type: 'definition',
        term: 'Exception : les frais d’acquisition',
        text: 'Droits de mutation, frais d’actes, honoraires et commissions sont a priori directement attribuables. Mais, pour des raisons fiscales, l’entreprise peut **choisir** : les intégrer au coût (**méthode de référence**) ou les comptabiliser en **charges**.',
      },
      { type: 'example', exampleId: 'ex-t3-machine' },
      { type: 'diagram', kind: 'immo-phases' },
      { type: 'warning', title: 'Erreur fréquente', text: 'Inclure la formation du personnel ou la TVA déductible dans le coût. Ce sont des **charges** (ou une créance pour la TVA).' },
      {
        type: 'quickcheck',
        check: {
          question: 'Prix 10 000 €, remise 5 %, transport 500 €. Coût d’acquisition ?',
          options: ['10 500 €', '10 000 €', '9 500 €'],
          answer: 1,
          explanation: 'Prix net = 10 000 × 0,95 = 9 500 € ; on ajoute le transport : 9 500 + 500 = 10 000 €.',
        },
      },
      { type: 'summary', items: ['Coût = prix net + coûts directement attribuables.', 'Formation, frais généraux et TVA déductible : exclus.', 'Frais d’acquisition : choix entre coût (méthode de référence) et charges.'] },
    ],
  },
  {
    id: 't3-acquisition',
    chapterId: 't3-ch2',
    title: 'Comptabiliser l’acquisition',
    summary: 'Compte 21, TVA 445 62 et fournisseur d’immobilisations 404.',
    minutes: 6,
    sourcePage: 'diapositives 100 à 102',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Débit', 'Crédit'],
          rows: [['Le coût d’acquisition au compte de l’immobilisation (21… Immobilisations corporelles) ; la TVA déductible au 445 62 – TVA sur immobilisations', 'Le montant à payer TTC au 404 – Fournisseurs d’immobilisations']],
        },
      },
      {
        type: 'journal',
        title: 'Machine-outil, méthode de référence (diapositive 101)',
        entry: {
          date: 'Date d’acquisition',
          description: 'Acquisition de la machine outil. Immo n°xxx.',
          lines: [
            { debitAccount: '215 4', label: 'Matériels industriels', debit: 11_400 },
            { debitAccount: '445 62', label: 'TVA sur immobilisations', debit: 2280 },
            { creditAccount: '404', label: 'Fournisseurs d’immobilisations', credit: 13_680 },
          ],
        },
      },
      {
        type: 'journal',
        title: 'La formation du personnel, en charges',
        entry: {
          date: 'Date d’acquisition',
          description: 'Facture n°xxx.',
          lines: [
            { debitAccount: '618', label: 'Divers services extérieurs', debit: 1500 },
            { debitAccount: '445 66', label: 'TVA déductible sur biens et services', debit: 300 },
            { creditAccount: '401', label: 'Fournisseurs', credit: 1800 },
          ],
        },
      },
      {
        type: 'text',
        text: 'Sans la méthode de référence (diapositive 102), la machine est enregistrée pour **10 400 €** (TVA 2 080 €, 404 : 12 480 €), et les honoraires vont au **622 6 – Honoraires** pour 1 000 € (TVA 200 €, 401 : 1 200 €).',
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Utiliser 401 et 445 66 pour une immobilisation. Pour l’actif lui-même : **404** et **445 62**.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Quel compte crédite-t-on pour une machine achetée à crédit ?',
          options: ['401 – Fournisseurs', '404 – Fournisseurs d’immobilisations', '512 – Banque'],
          answer: 1,
          explanation: '404 – Fournisseurs d’immobilisations, pour le TTC.',
        },
      },
      { type: 'summary', items: ['D 21… (coût) + D 445 62 (TVA) / C 404 (TTC).', 'Charges liées (formation, honoraires hors méthode de référence) : comptes 6 et 401.'] },
    ],
  },
  {
    id: 't3-amort-lineaire',
    chapterId: 't3-ch3',
    title: 'L’amortissement linéaire',
    summary: 'Durée d’utilité, base amortissable et prorata temporis.',
    minutes: 9,
    sourcePage: 'diapositives 103 à 105',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Notion', 'Ce qu’il faut savoir'],
          rows: [
            ['Durée d’utilité', 'Durée d’utilisation limitée (usure physique). Base du calcul des amortissements. Exception : les terrains ne s’amortissent pas.'],
            ['Base amortissable', 'Coût d’acquisition − valeur résiduelle'],
            ['Mode d’amortissement', 'Répartition systématique du montant amortissable selon un plan préétabli : en unités de temps (linéaire, par défaut) ou en unités d’œuvre.'],
          ],
        },
      },
      { type: 'formula', formulaId: 'f-t3-base' },
      { type: 'formula', formulaId: 'f-t3-lineaire' },
      {
        type: 'definition',
        term: 'Prorata temporis',
        text: 'L’amortissement démarre à la **date de mise en service**. La première année, on ne compte que les mois d’utilisation. Le cours compte un demi-mois pour une mise en service le 15 : **15 avril → 8,5/12**, **1er juillet → 6/12**.',
      },
      { type: 'example', exampleId: 'ex-t3-installation' },
      { type: 'tip', title: 'Pour ne pas se perdre', text: 'Le prorata « manquant » de la première année se retrouve sur une **année supplémentaire** à la fin : 8,5 mois en N + 3,5 mois en N+5 = 12 mois.' },
      { type: 'warning', title: 'Erreur fréquente', text: 'Amortir le **TTC**. On amortit le coût d’acquisition **hors TVA déductible** : 5 400 € TTC → 4 500 € HT (TD n°4, exercice 2).' },
      {
        type: 'quickcheck',
        check: {
          question: 'Mobilier de 4 500 € HT mis en service le 15 juin N, amorti sur 5 ans. Dotation N ?',
          options: ['900,00 €', '487,50 €', '450,00 €'],
          answer: 1,
          explanation: '4 500 / 5 × 6,5/12 = 487,50 € (TD n°4, exercice 2).',
        },
      },
      { type: 'summary', items: ['Base = coût − valeur résiduelle.', 'Dotation = base / durée × prorata.', 'Départ à la mise en service ; les terrains ne s’amortissent pas.'] },
    ],
  },
  {
    id: 't3-amort-uo',
    chapterId: 't3-ch3',
    title: 'L’amortissement par unités d’œuvre',
    summary: 'Amortir selon l’utilisation réelle du bien.',
    minutes: 5,
    sourcePage: 'diapositives 106 et 107',
    blocks: [
      { type: 'formula', formulaId: 'f-t3-uo' },
      { type: 'text', text: 'Cette approche est adaptée quand l’utilisation n’est **pas régulière** : kilomètres parcourus, heures de travail, nombre de pièces produites…' },
      { type: 'example', exampleId: 'ex-t3-uo' },
      {
        type: 'quickcheck',
        check: {
          question: 'Base 50 000 €, 15 000 pièces produites sur 100 000 attendues. Dotation ?',
          options: ['7 500 €', '15 000 €', '5 000 €'],
          answer: 0,
          explanation: '50 000 × 15 000 / 100 000 = 7 500 €.',
        },
      },
      { type: 'summary', items: ['Dotation = base × UO de la période / UO totales.', 'Le total des UO correspond à toute la durée d’utilisation.'] },
    ],
  },
  {
    id: 't3-amort-compta',
    chapterId: 't3-ch3',
    title: 'Comptabiliser les amortissements',
    summary: 'Le compte 681 12 et les comptes 28.',
    minutes: 6,
    sourcePage: 'diapositives 108 et 109',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Débit', 'Crédit'],
          rows: [['681 12 – Dotations aux amortissements des immobilisations corporelles', 'Compte d’amortissement : le numéro de l’immobilisation avec un **8 en deuxième position** (213 1 Bâtiment → 281 31 Amortissement des bâtiments)']],
        },
      },
      { type: 'definition', term: 'Charge calculée', text: 'La dotation est une charge **calculée** : contrairement aux charges décaissables, elle ne provoque **aucun flux de trésorerie**.' },
      {
        type: 'table',
        table: {
          caption: 'Début du plan d’un véhicule (diapositive 109) : valeur brute 20 000 €, base 12 500 €, mise en service le 1er avril',
          headers: ['Année', 'Base', 'Dotation', 'Cumul', 'VNC'],
          numericCols: [1, 2, 3, 4],
          rows: [
            ['N', '12 500', '2 344', '2 344', '17 656'],
            ['N+1', '12 500', '3 125', '5 469', '14 531'],
          ],
        },
      },
      {
        type: 'journal',
        title: 'Dotation de N',
        entry: {
          date: '31/12/N',
          description: 'Dotation aux amortissements du véhicule',
          lines: [
            { debitAccount: '681 12', label: 'Dotations aux amort. des immobilisations corp.', debit: 2344 },
            { creditAccount: '281 82', label: 'Amortissement des véhicules', credit: 2344 },
          ],
        },
      },
      { type: 'tip', title: 'Pour retenir', text: 'On ne touche **jamais** au compte 21… pour amortir : la valeur brute reste, et le compte 28… mémorise le cumul. VNC = 21… − 28….' },
      {
        type: 'quickcheck',
        check: {
          question: 'Compte d’amortissement des matériels de transport (218 2) ?',
          options: ['281 82', '682 18', '218 28'],
          answer: 0,
          explanation: 'On insère un 8 en deuxième position : 218 2 → 281 82.',
        },
      },
      { type: 'summary', items: ['D 681 12 / C 28….', '28… = numéro de l’immobilisation avec un 8 en 2ᵉ position.', 'Charge calculée, sans décaissement.'] },
    ],
  },
  {
    id: 't3-depreciation',
    chapterId: 't3-ch4',
    title: 'La dépréciation',
    summary: 'Quand la valeur actuelle passe sous la VNC.',
    minutes: 7,
    sourcePage: 'diapositives 110 à 113',
    blocks: [
      { type: 'definition', term: 'Dépréciation', text: 'Constat que la **valeur actuelle** d’un actif est devenue **inférieure à sa valeur nette comptable**.' },
      { type: 'formula', formulaId: 'f-t3-vnc' },
      { type: 'formula', formulaId: 'f-t3-va' },
      { type: 'example', exampleId: 'ex-t3-terrain' },
      {
        type: 'table',
        table: {
          caption: 'Dépréciation et amortissement : les différences (diapositive 113)',
          headers: ['Dépréciation', 'Amortissement'],
          rows: [
            ['Contingente : dépend du résultat du test', 'Systématique : suit un plan'],
            ['Réversible : on peut la reprendre', 'Irréversible'],
            ['Peut toucher tous les actifs, y compris circulants et non amortissables', 'Seulement les immobilisations amortissables'],
          ],
        },
      },
      { type: 'heading', text: 'La reprise de dépréciation' },
      {
        type: 'text',
        text: 'Si, à un inventaire suivant, la valeur actuelle **remonte** au-dessus de la VNC, on **reprend** tout ou partie de la dépréciation : débit **291…**, crédit **781 62 – Reprises sur dépréciations des immobilisations corporelles** (TD n°4, exercice 4).',
      },
      {
        type: 'journal',
        title: 'Reprise sur le terrain FLEURON (TD n°4, exercice 4)',
        entry: {
          date: '31/12/N+1',
          description: 'Reprise de dépréciation du terrain',
          lines: [
            { debitAccount: '291 1', label: 'Dépréciation des terrains', debit: 15_000 },
            { creditAccount: '781 62', label: 'Reprises dépré. immo. corp.', credit: 15_000 },
          ],
        },
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Prendre la valeur vénale par réflexe. La valeur actuelle est la **plus élevée** des deux : vénale ou d’usage.' },
      {
        type: 'quickcheck',
        check: {
          question: 'VNC 200 000 € ; valeur vénale 180 000 € ; valeur d’usage 150 000 €. Dépréciation ?',
          options: ['50 000 €', '20 000 €', 'Aucune'],
          answer: 1,
          explanation: 'Valeur actuelle = 180 000 € (la plus élevée) ; 200 000 − 180 000 = 20 000 €.',
        },
      },
      { type: 'summary', items: ['Valeur actuelle = max(vénale, usage).', 'Si VA < VNC : D 681 62 / C 29….', 'Si VA remonte : reprise D 29… / C 781 62.'] },
    ],
  },
  {
    id: 't3-depreciation-amortissable',
    chapterId: 't3-ch4',
    title: 'Dépréciation d’une immobilisation amortissable',
    summary: 'Le test, puis un nouveau plan d’amortissement.',
    minutes: 8,
    sourcePage: 'diapositives 114 à 116',
    blocks: [
      {
        type: 'text',
        text: 'À chaque clôture, l’entité vérifie s’il existe un **indice de perte de valeur** (interne ou externe). Si oui, elle doit faire un **test de dépréciation**. Une dépréciation modifie **pour l’avenir** la base amortissable.',
      },
      {
        type: 'steps',
        title: 'Exemple du cours : véhicule accidenté',
        items: [
          'Acquis le 01/01/N-1 pour 20 000 € HT, durée 5 ans, revente estimée 6 000 € → dotation 2 800 €/an.',
          'Au 31/12/N : VNC = 20 000 − 2 × 2 800 = **14 400 €** ; valeur actuelle **12 000 €** → dépréciation de **2 400 €**.',
          'Nouveau plan : il reste 3 ans et la revente est estimée 5 000 € → nouvelle base = 12 000 − 5 000 = **7 000 €**.',
          'Dotations : 2 333, 2 333, 2 334 € ; VNC : 9 667, 7 334, 5 000 €.',
        ],
      },
      {
        type: 'table',
        table: {
          caption: 'Nouveau plan (diapositive 116)',
          headers: ['Année', 'Base', 'Taux', 'Dotation', 'VNC', 'Amort. et dépré. cumulés'],
          numericCols: [1, 3, 4, 5],
          rows: [
            ['N+1', '7 000', '33,33 %', '2 333', '9 667', '10 333'],
            ['N+2', '7 000', '33,33 %', '2 333', '7 334', '12 666'],
            ['N+3', '7 000', '33,33 %', '2 334', '5 000', '15 000'],
          ],
        },
      },
      {
        type: 'steps',
        title: 'TD n°4, exercice 5 : le matériel REBOOK',
        items: [
          '60 000 € HT, mis en service le 01/07/N, 4 ans, valeur résiduelle nulle → dotation N = 7 500 €, VNC = 52 500 €.',
          'Fin N : valeur actuelle 42 000 € → dépréciation **10 500 €** (D 681 62 / C 291 54).',
          'Plan corrigé : 42 000 € sur les 3,5 ans restants → **12 000 €** par an, puis 6 000 € la dernière demi-année.',
          'Fin N+1 : VNC = 30 000 € ; valeur actuelle 37 000 € → **reprise de 7 000 €** (D 291 54 / C 781 62).',
          'Nouveau plan : 37 000 € sur 2,5 ans → **14 800 €** par an, puis 7 400 €.',
        ],
      },
      {
        type: 'note',
        title: 'Coquilles dans la correction du TD n°4',
        text: 'Dans le plan corrigé au 01/01/N+2, la colonne « Base amortissable » indique 42 000 € pour N+3 et N+4 : il faut lire **37 000 €**. Plusieurs libellés d’écritures de dotation aux amortissements sont écrits « Dépréciation du matériel industriel ».',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Après une dépréciation, la base du nouveau plan est…',
          options: ['Le coût d’acquisition d’origine', 'La valeur actuelle − la valeur résiduelle', 'La dépréciation constatée'],
          answer: 1,
          explanation: 'On repart de la valeur actuelle (nouvelle VNC) moins la valeur résiduelle, sur la durée restante.',
        },
      },
      { type: 'summary', items: ['Indice de perte de valeur → test obligatoire.', 'Dépréciation → nouveau plan sur la durée restante.', 'Une reprise est possible si la valeur remonte.'] },
    ],
  },
  {
    id: 't3-sortie',
    chapterId: 't3-ch5',
    title: 'La sortie d’une immobilisation',
    summary: 'Prix de cession, dotation complémentaire et sortie de l’actif.',
    minutes: 7,
    sourcePage: 'diapositives 117 et 118',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Étape', 'Débit', 'Crédit'],
          rows: [
            ['1. Prix de cession', '462 – Créances sur cessions d’immobilisations (paiement différé) ou 512 – Banque (paiement immédiat)', '757 – Produits de cession (HT) et 445 71 – TVA collectée'],
            ['2. Dotation complémentaire éventuelle', '681 1 – Dotations aux amortissements', '281… – Amortissements'],
            ['3. Sortie de l’actif', '657 – Valeur comptable des immobilisations cédées (VNC) et 281… (amortissements cumulés)', '21… – Immobilisation (valeur brute)'],
          ],
        },
      },
      { type: 'example', exampleId: 'ex-t3-cession' },
      {
        type: 'journal',
        title: 'Prix de cession (01/07/N+3)',
        entry: {
          date: '01/07/N+3',
          description: 'Vente du véhicule. Facture n°xxx.',
          lines: [
            { debitAccount: '462', label: 'Créances sur cessions d’immobilisations', debit: 7200 },
            { creditAccount: '757', label: 'Produits de cession des immobilisations', credit: 6000 },
            { creditAccount: '445 71', label: 'État - TVA collectée', credit: 1200 },
          ],
        },
      },
      {
        type: 'note',
        title: 'Coquille dans le support (diapositive 118)',
        text: 'L’écriture de la dotation complémentaire est intitulée « Dotations aux dépré. des immo. corporelles » avec le compte 681 12 : il s’agit bien d’une dotation aux **amortissements** (681 12 / 281 82, 2 500 €).',
      },
      { type: 'tip', title: 'Lire le résultat de cession', text: 'Produit de cession (757) − valeur comptable sortie (657) = plus-value si positif, moins-value si négatif. Ici : 6 000 − 7 500 = **−1 500 €**.' },
      {
        type: 'quickcheck',
        check: {
          question: 'À la sortie, quel montant porte-t-on au crédit du compte d’immobilisation (21…) ?',
          options: ['La VNC', 'La valeur brute', 'Le prix de cession'],
          answer: 1,
          explanation: 'On sort la valeur brute (25 000 €) ; la VNC va au débit du 657.',
        },
      },
      { type: 'summary', items: ['Prix : D 462 ou 512 / C 757 + 445 71.', 'Dotation jusqu’à la date de cession.', 'Sortie : D 657 + D 281… / C 21….'] },
    ],
  },
]

const VF = ['Vrai', 'Faux']
const IC = ['Immobilisation', 'Charge']

export const exercises: Exercise[] = [
  {
    id: 'ex-t3-01', source: 'TD n°4, exercice 1', chapterId: 't3-ch1', lessonId: 't3-definition', notion: 'Immobilisation ou charge', level: 'debutant', kind: 'comprehension',
    title: 'Immobilisation ou charge ?', statement: 'Pour chaque dépense, choisis le bon traitement d’après le cours.',
    inputs: [
      { id: 'a', type: 'choice', prompt: 'Outil d’une valeur de 400 € HT', options: IC, answer: 1 },
      { id: 'b', type: 'choice', prompt: 'Imprimante d’une valeur de 600 € HT', options: IC, answer: 0 },
      { id: 'c', type: 'choice', prompt: 'Contrat d’entretien annuel des chaudières : 820 € HT', options: IC, answer: 1 },
      { id: 'd', type: 'choice', prompt: 'Honoraires du notaire pour l’achat d’un terrain : 1 600 € HT (méthode de référence)', options: IC, answer: 0 },
    ],
    explanation: 'Outil < 500 € HT : charge (seuil). Imprimante > 500 € et durable : immobilisation. Un contrat d’entretien annuel ne crée pas d’actif durable : charge. Honoraires d’acquisition : intégrés au coût du terrain avec la méthode de référence (en charges sinon).',
  },
  {
    id: 'ex-t3-02', source: 'TD n°4, exercice 2', chapterId: 't3-ch3', lessonId: 't3-amort-lineaire', notion: 'Plan linéaire', level: 'intermediaire', kind: 'calcul',
    title: 'Le mobilier de bureau LDS', statement: 'Mobilier acquis le **15 juin N** pour **5 400 € TTC** (TVA 20 %). Amortissement linéaire sur **5 ans**.',
    inputs: [
      { id: 'a', type: 'number', label: 'Base amortissable (HT)', answer: 4500, unit: '€' },
      { id: 'b', type: 'number', label: 'Dotation N', answer: 487.5, unit: '€' },
      { id: 'c', type: 'number', label: 'Dotation N+1', answer: 900, unit: '€' },
      { id: 'd', type: 'number', label: 'Dotation N+5 (dernière)', answer: 412.5, unit: '€' },
    ],
    explanation: 'Du 15 juin au 31 décembre : 6,5 mois. La dernière année récupère les 5,5 mois restants.',
    steps: ['Base = 5 400 / 1,2 = **4 500 €**', 'N : 4 500 / 5 × 6,5/12 = **487,50 €**', 'N+1 à N+4 : 4 500 / 5 = **900 €**', 'N+5 : 4 500 / 5 × 5,5/12 = **412,50 €**'],
  },
  {
    id: 'ex-t3-03', source: 'TD n°4, exercice 2', chapterId: 't3-ch3', lessonId: 't3-amort-compta', notion: 'Écriture de dotation', level: 'debutant', kind: 'completer',
    title: 'La première dotation du mobilier', statement: 'Complète l’écriture de la dotation de 487,50 € au 31/12/N.',
    inputs: [
      { id: 'a', type: 'text', label: 'Compte débité', answers: ['681 12', '68112', '681'] },
      { id: 'b', type: 'text', label: 'Compte crédité', answers: ['281 84', '28184'] },
    ],
    explanation: 'Mobilier = 218 4 → amortissement 281 84 (un 8 en 2ᵉ position).',
  },
  {
    id: 'ex-t3-04', source: 'TD n°4, exercice 3', chapterId: 't3-ch3', lessonId: 't3-amort-lineaire', notion: 'Base amortissable', level: 'intermediaire', kind: 'calcul',
    title: 'Le fourgon', statement: 'Coût d’acquisition **32 000 € HT**, mis en circulation le **1er juillet N**. Cédé à **20 %** de son coût après **3 ans** ; coûts de sortie **5 %** du prix de cession.',
    inputs: [
      { id: 'a', type: 'number', label: 'Valeur résiduelle', answer: 6080, unit: '€' },
      { id: 'b', type: 'number', label: 'Base amortissable', answer: 25_920, unit: '€' },
      { id: 'c', type: 'number', label: 'Dotation N', answer: 4320, unit: '€' },
      { id: 'd', type: 'number', label: 'VNC au 31/12/N+3', answer: 6080, unit: '€' },
    ],
    explanation: 'La VNC finale est égale à la valeur résiduelle : on n’amortit que la base.',
    steps: ['VR = 32 000 × 20 % × (1 − 5 %) = **6 080 €**', 'Base = 32 000 − 6 080 = **25 920 €**', 'N = 25 920 / 3 × 6/12 = **4 320 €**', 'Fin N+3 : VNC = **6 080 €**'],
  },
  {
    id: 'ex-t3-05', source: 'TD n°4, exercice 4', chapterId: 't3-ch4', lessonId: 't3-depreciation', notion: 'Dépréciation et reprise', level: 'intermediaire', kind: 'probleme',
    title: 'Le terrain FLEURON', statement: 'Terrain acquis 200 000 € HT. Fin N : valeur vénale 180 000 €, valeur d’usage 150 000 €. Fin N+1 : valeur actuelle 195 000 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Dépréciation au 31/12/N', answer: 20_000, unit: '€' },
      { id: 'b', type: 'number', label: 'Reprise au 31/12/N+1', answer: 15_000, unit: '€' },
      { id: 'c', type: 'text', label: 'Compte crédité lors de la reprise', answers: ['781 62', '78162', '781'] },
    ],
    explanation: 'Un terrain ne s’amortit pas : VNC = coût − dépréciations.',
    steps: ['N : VA = 180 000 € ; 200 000 − 180 000 = **20 000 €** (D 681 62 / C 291 1)', 'N+1 : VNC = 180 000 € ; VA = 195 000 € → reprise **15 000 €** (D 291 1 / C 781 62)'],
  },
  {
    id: 'ex-t3-06', source: 'TD n°4, exercice 5', chapterId: 't3-ch4', lessonId: 't3-depreciation-amortissable', notion: 'Plan corrigé', level: 'avance', kind: 'probleme',
    title: 'Le matériel REBOOK', statement: 'Matériel 60 000 € HT mis en service le 01/07/N, 4 ans, valeur résiduelle nulle, linéaire. Fin N : valeur actuelle 42 000 €. Fin N+1 : valeur actuelle 37 000 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Dépréciation au 31/12/N', answer: 10_500, unit: '€' },
      { id: 'b', type: 'number', label: 'Dotation N+1 (plan corrigé)', answer: 12_000, unit: '€' },
      { id: 'c', type: 'number', label: 'Reprise au 31/12/N+1', answer: 7000, unit: '€' },
      { id: 'd', type: 'number', label: 'Dotation N+2 (nouveau plan)', answer: 14_800, unit: '€' },
    ],
    explanation: 'Chaque dépréciation ou reprise change la base du plan, répartie sur la durée restante.',
    steps: [
      'VNC fin N = 60 000 − 7 500 = 52 500 € ; dépréciation = 52 500 − 42 000 = **10 500 €**',
      'Plan corrigé : 42 000 / 3,5 = **12 000 €**',
      'VNC fin N+1 = 42 000 − 12 000 = 30 000 € ; reprise = 37 000 − 30 000 = **7 000 €**',
      'Nouveau plan : 37 000 / 2,5 = **14 800 €**',
    ],
  },
  {
    id: 'ex-t3-07', source: 'Exemple du cours, diapositive 98', chapterId: 't3-ch2', lessonId: 't3-cout', notion: 'Coût d’acquisition', level: 'intermediaire', kind: 'calcul',
    title: 'La machine-outil', statement: 'Prix 10 000 € ; remise 5 % ; transport 500 € ; installation 300 € ; tests 100 € ; formation 1 500 € ; honoraires de l’ingénieur 1 000 €.',
    inputs: [
      { id: 'a', type: 'number', label: 'Coût avec la méthode de référence', answer: 11_400, unit: '€' },
      { id: 'b', type: 'number', label: 'Coût sans la méthode de référence', answer: 10_400, unit: '€' },
    ],
    explanation: 'La formation est toujours exclue ; les honoraires sont intégrés seulement avec la méthode de référence.',
    steps: ['9 500 + 500 + 300 + 100 = 10 400 €', '+ 1 000 € d’honoraires = **11 400 €**'],
  },
  {
    id: 'ex-t3-08', source: 'Exemple du cours, diapositive 107', chapterId: 't3-ch3', lessonId: 't3-amort-uo', notion: 'Unités d’œuvre', level: 'intermediaire', kind: 'numerique',
    title: 'L’outillage de sous-traitance', statement: 'Outillage 50 000 €, production totale attendue 100 000 unités. En N+4, 20 000 unités sont produites. Dotation N+4 ?',
    inputs: [{ id: 'a', type: 'number', label: 'Dotation N+4', answer: 10_000, unit: '€' }],
    explanation: 'Dotation = base × UO de la période / UO totales.',
    steps: ['50 000 × 20 000 / 100 000 = **10 000 €**'],
  },
  {
    id: 'ex-t3-09', source: 'Exemple du cours, diapositive 118', chapterId: 't3-ch5', lessonId: 't3-sortie', notion: 'Cession', level: 'avance', kind: 'probleme',
    title: 'La vente du véhicule', statement: 'Véhicule 25 000 € acquis le 01/01/N, 5 ans. Cédé le 01/07/N+3 pour 6 000 € HT, TVA 20 %, paiement différé.',
    inputs: [
      { id: 'a', type: 'number', label: 'Dotation complémentaire N+3', answer: 2500, unit: '€' },
      { id: 'b', type: 'number', label: 'VNC sortie (débit 657)', answer: 7500, unit: '€' },
      { id: 'c', type: 'number', label: 'Montant au débit du 462', answer: 7200, unit: '€' },
      { id: 'd', type: 'number', label: 'Résultat de cession (plus ou moins-value)', answer: -1500, unit: '€' },
    ],
    explanation: 'Résultat = 757 − 657 = 6 000 − 7 500. Une valeur négative est une moins-value.',
    steps: ['Dotation = 5 000 × 6/12 = **2 500 €**', 'Cumul = 15 000 + 2 500 = 17 500 € ; VNC = **7 500 €**', '462 = 6 000 × 1,2 = **7 200 €**', 'Résultat = 6 000 − 7 500 = **−1 500 €**'],
  },
  {
    id: 'ex-t3-10', chapterId: 't3-ch4', lessonId: 't3-depreciation', notion: 'Dépréciation', level: 'debutant', kind: 'vrai-faux',
    title: 'Dépréciation réversible ?', statement: 'Vrai ou faux : contrairement à l’amortissement, une dépréciation peut être reprise.',
    inputs: [{ id: 'a', type: 'choice', options: VF, answer: 0 }],
    explanation: 'La perte de valeur est réversible : mécanisme de reprise des dépréciations.',
  },
]

export const quizQuestions: QuizQuestion[] = [
  { id: 'q-t3-01', chapterId: 't3-ch1', lessonId: 't3-definition', level: 'debutant', type: 'qcm', prompt: 'Une immobilisation sert l’activité de l’entreprise…', options: ['Moins d’un an', 'Plus d’un an', 'Uniquement à la clôture'], answer: 1, explanation: 'De façon durable : plus d’un an.' },
  { id: 'q-t3-02', chapterId: 't3-ch1', lessonId: 't3-definition', level: 'debutant', type: 'qcm', prompt: 'Seuil sous lequel une immobilisation peut aller en charges :', options: ['500 € HT par unité', '500 € TTC au total', '1 000 € HT'], answer: 0, explanation: '500 € unitaire HT.' },
  { id: 'q-t3-03', chapterId: 't3-ch1', lessonId: 't3-definition', level: 'intermediaire', type: 'qcm', prompt: 'Un actif monétaire est une immobilisation…', options: ['Incorporelle', 'Corporelle', 'Financière'], answer: 2, explanation: 'Immobilisations financières : actifs monétaires.' },
  { id: 'q-t3-04', chapterId: 't3-ch2', lessonId: 't3-cout', level: 'intermediaire', type: 'qcm', prompt: 'Lequel est inclus dans le coût d’acquisition ?', options: ['La formation du personnel', 'Les frais d’installation', 'La TVA déductible'], answer: 1, explanation: 'L’installation sert à mettre l’actif en état de fonctionner.' },
  { id: 'q-t3-05', chapterId: 't3-ch2', lessonId: 't3-cout', level: 'avance', type: 'numerique', prompt: 'Machine : 9 500 € après remise, 900 € de frais directs, 1 000 € d’honoraires, méthode de référence. Coût ?', answer: 11_400, unit: '€', explanation: '9 500 + 900 + 1 000 = 11 400 €.' },
  { id: 'q-t3-06', chapterId: 't3-ch2', lessonId: 't3-acquisition', level: 'intermediaire', type: 'qcm', prompt: 'TVA sur l’achat d’une machine :', options: ['445 62', '445 66', '445 71'], answer: 0, explanation: '445 62 – TVA sur immobilisations.' },
  { id: 'q-t3-07', chapterId: 't3-ch3', lessonId: 't3-amort-lineaire', level: 'debutant', type: 'vrai-faux', prompt: 'Les terrains s’amortissent.', options: VF, answer: 1, explanation: 'Exception : les terrains ne s’amortissent pas.' },
  { id: 'q-t3-08', chapterId: 't3-ch3', lessonId: 't3-amort-lineaire', level: 'intermediaire', type: 'qcm', prompt: 'Mise en service le 15 avril : prorata de la 1re année ?', options: ['9/12', '8,5/12', '8/12'], answer: 1, explanation: 'Du 15 avril au 31 décembre : 8,5 mois.' },
  { id: 'q-t3-09', chapterId: 't3-ch3', lessonId: 't3-amort-lineaire', level: 'avance', type: 'numerique', prompt: 'Base 100 000 €, 5 ans, mise en service le 15 avril. Dotation N (arrondie à l’euro) ?', answer: 14_167, tolerance: 1, unit: '€', explanation: '100 000 / 5 × 8,5/12 = 14 166,67 ≈ 14 167 €.' },
  { id: 'q-t3-10', chapterId: 't3-ch3', lessonId: 't3-amort-compta', level: 'intermediaire', type: 'vrai-faux', prompt: 'La dotation aux amortissements provoque un décaissement.', options: VF, answer: 1, explanation: 'C’est une charge calculée, sans flux de trésorerie.' },
  { id: 'q-t3-11', chapterId: 't3-ch3', lessonId: 't3-amort-compta', level: 'intermediaire', type: 'qcm', prompt: 'Amortissement des bâtiments (213 1) :', options: ['281 31', '213 18', '681 31'], answer: 0, explanation: 'Exemple du cours : 213 1 → 281 31.' },
  { id: 'q-t3-12', chapterId: 't3-ch4', lessonId: 't3-depreciation', level: 'intermediaire', type: 'numerique', prompt: 'VNC 180 000 € ; vénale 155 000 € ; usage 161 909 €. Dépréciation ?', answer: 18_091, unit: '€', explanation: 'VA = 161 909 € ; 180 000 − 161 909 = 18 091 €.' },
  { id: 'q-t3-13', chapterId: 't3-ch4', lessonId: 't3-depreciation', level: 'intermediaire', type: 'qcm', prompt: 'La valeur actuelle est…', options: ['La plus faible des valeurs vénale et d’usage', 'La plus élevée des valeurs vénale et d’usage', 'Toujours la valeur vénale'], answer: 1, explanation: 'max(vénale ; usage).' },
  { id: 'q-t3-14', chapterId: 't3-ch4', lessonId: 't3-depreciation-amortissable', level: 'avance', type: 'numerique', prompt: 'Valeur actuelle 42 000 €, 3,5 ans restants, valeur résiduelle nulle. Nouvelle dotation annuelle ?', answer: 12_000, unit: '€', explanation: '42 000 / 3,5 = 12 000 €.' },
  { id: 'q-t3-15', chapterId: 't3-ch5', lessonId: 't3-sortie', level: 'intermediaire', type: 'qcm', prompt: 'Le prix de cession HT est crédité au…', options: ['657', '757', '462'], answer: 1, explanation: '757 – Produits de cession des immobilisations.' },
  { id: 'q-t3-16', chapterId: 't3-ch5', lessonId: 't3-sortie', level: 'avance', type: 'numerique', prompt: 'Valeur brute 25 000 € ; amortissements cumulés 17 500 €. Montant au débit du 657 ?', answer: 7500, unit: '€', explanation: 'VNC = 25 000 − 17 500 = 7 500 €.' },
]

export const quizSeries: QuizSeries[] = [
  {
    id: 'qs-t3',
    title: 'Titre 3 : les immobilisations',
    description: 'Définition, coût d’acquisition, amortissements, dépréciations et cession.',
    level: 'intermediaire',
    chapterIds: ['t3-ch1', 't3-ch2', 't3-ch3', 't3-ch4', 't3-ch5'],
    questionIds: quizQuestions.map((q) => q.id),
    timeLimitSec: 10 * 60,
  },
]

export const glossary: GlossaryEntry[] = [
  { term: 'Base amortissable', definition: 'Coût d’acquisition − valeur résiduelle.', lessonId: 't3-amort-lineaire' },
  { term: 'Coût d’acquisition', definition: 'Prix d’achat net + coûts directement attribuables.', lessonId: 't3-cout' },
  { term: 'Dépréciation', definition: 'Perte de valeur constatée quand la valeur actuelle est inférieure à la VNC (681 62 / 29…). Réversible.', lessonId: 't3-depreciation' },
  { term: 'Dotation aux amortissements', definition: 'Charge calculée qui répartit la base amortissable (681 12 / 28…).', lessonId: 't3-amort-compta' },
  { term: 'Durée d’utilité', definition: 'Durée d’utilisation prévue du bien, base du plan d’amortissement.', lessonId: 't3-amort-lineaire' },
  { term: 'Immobilisation', definition: 'Actif destiné à servir durablement (plus d’un an) l’activité de l’entreprise.', lessonId: 't3-definition' },
  { term: 'Méthode de référence', definition: 'Intégrer les frais d’acquisition (droits, actes, honoraires) au coût de l’immobilisation.', lessonId: 't3-cout' },
  { term: 'Prorata temporis', definition: 'Fraction d’année d’utilisation appliquée à la première (et dernière) dotation.', lessonId: 't3-amort-lineaire' },
  { term: 'Unités d’œuvre', definition: 'Mode d’amortissement selon l’utilisation réelle (km, heures, pièces).', lessonId: 't3-amort-uo' },
  { term: 'Valeur actuelle', definition: 'La plus élevée de la valeur vénale et de la valeur d’usage.', lessonId: 't3-depreciation' },
  { term: 'Valeur nette comptable (VNC)', definition: 'Coût d’acquisition − amortissements cumulés − dépréciations.', lessonId: 't3-depreciation' },
  { term: 'Valeur résiduelle', definition: 'Ce qu’on obtiendrait de la vente du bien à la fin de son utilisation, net des coûts de sortie.', lessonId: 't3-amort-lineaire' },
]
