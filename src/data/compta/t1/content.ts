import type { Chapter, Example, Exercise, Formula, GlossaryEntry, Lesson, QuizQuestion, QuizSeries } from '@/types'

/**
 * Titre 1 – Introduction à la comptabilité (PPT CM, diapositives 4 à 36)
 * et « Titre 1 – Correction exercices » (extraits de Siegwart et al., Comptabilité, Nathan, 2024).
 */

export const chapters: Chapter[] = [
  {
    id: 't1-ch1',
    partId: 't1',
    number: 1,
    title: 'Définition et rôles de la comptabilité',
    subtitle: 'Ce qu’est la comptabilité financière et à quoi elle sert',
    objectives: ['Définir la comptabilité financière (PCG, art. 121-1)', 'Distinguer les différentes comptabilités', 'Citer les quatre fonctions de la comptabilité'],
    lessonIds: ['t1-definition', 't1-fonctions'],
    sourcePages: 'diapositives 4 à 7',
  },
  {
    id: 't1-ch2',
    partId: 't1',
    number: 2,
    title: 'La réglementation comptable',
    subtitle: 'Normes, hiérarchie du droit comptable et plan de comptes',
    objectives: ['Distinguer normes IFRS et normes françaises', 'Ordonner la hiérarchie du droit comptable', 'Retrouver la classe d’un compte'],
    lessonIds: ['t1-normes', 't1-nomenclature'],
    sourcePages: 'diapositives 8 à 11',
  },
  {
    id: 't1-ch3',
    partId: 't1',
    number: 3,
    title: 'La partie double',
    subtitle: 'Emplois, ressources et patrimoine',
    objectives: ['Identifier l’emploi et la ressource d’une opération', 'Calculer une situation nette', 'Expliquer une variation de situation nette'],
    lessonIds: ['t1-flux', 't1-patrimoine'],
    sourcePages: 'diapositives 12 à 19',
  },
  {
    id: 't1-ch4',
    partId: 't1',
    number: 4,
    title: 'Des écritures comptables aux documents de synthèse',
    subtitle: 'Journal, comptes, balance, bilan, compte de résultat et annexe',
    objectives: ['Lire une écriture au journal', 'Tenir un compte et calculer son solde', 'Construire un bilan équilibré', 'Relier résultat et situation nette'],
    lessonIds: ['t1-journal', 't1-comptes', 't1-bilan', 't1-resultat'],
    sourcePages: 'diapositives 20 à 36',
  },
]

export const formulas: Formula[] = [
  {
    id: 'f-t1-sn',
    title: 'Situation nette',
    latex: '\\text{SN} = \\text{Actif} - \\text{Dettes}',
    variables: [
      { symbol: '\\text{SN}', meaning: 'Situation nette (= capitaux propres)' },
      { symbol: '\\text{Actif}', meaning: 'Ce que possède l’entreprise' },
      { symbol: '\\text{Dettes}', meaning: 'Ce qu’elle doit' },
    ],
    whenToUse: 'Pour mesurer le patrimoine. Au bilan, on retire aussi les provisions pour risques et charges : SN = Actif − (PRC + Dettes).',
    sourcePage: 16,
  },
  {
    id: 'f-t1-equilibre',
    title: 'Équilibre du bilan',
    latex: '\\text{Actif} = \\text{Passif}',
    variables: [
      { symbol: '\\text{Passif}', meaning: 'Situation nette + Provisions pour risques et charges + Dettes' },
    ],
    whenToUse: 'Pour vérifier un bilan ou retrouver un montant manquant (par exemple le résultat de l’exercice).',
    sourcePage: 28,
  },
  {
    id: 'f-t1-sn-resultat',
    title: 'Situation nette et résultat',
    latex: '\\text{SN}_{n+1} = \\text{SN}_{n} + \\text{Résultat}_{n+1}',
    variables: [
      { symbol: '\\text{SN}_{n}', meaning: 'Situation nette au début de la période' },
      { symbol: '\\text{Résultat}_{n+1}', meaning: 'Augmentation (bénéfice) ou baisse (déficit) du patrimoine sur la période' },
    ],
    whenToUse: 'Pour passer d’un bilan au suivant : le résultat explique la variation de la situation nette.',
    sourcePage: 28,
  },
  {
    id: 'f-t1-resultat',
    title: 'Résultat',
    latex: '\\text{Résultat} = \\text{Produits} - \\text{Charges}',
    variables: [
      { symbol: '\\text{Produits}', meaning: 'Flux qui génèrent de la richesse (classe 7)' },
      { symbol: '\\text{Charges}', meaning: 'Flux qui en détruisent (classe 6)' },
    ],
    whenToUse: 'Résultat > 0 : bénéfice. Résultat < 0 : déficit.',
    sourcePage: 32,
  },
]

export const examples: Example[] = [
  {
    id: 'ex-t1-journal',
    title: 'Vente puis encaissement (diapositive 21)',
    statement: 'Le 15/08/2024, vente de marchandises pour **1 250 € HT** (TVA 250 €), facture n°2024786. Le 15/09/2024, encaissement du chèque n°237649.',
    steps: [
      'Le client doit 1 500 € : le compte **411 – Créances clients** est débité (emploi).',
      'La vente (1 250 €) est un produit : **707** crédité. La TVA collectée (250 €) est une dette envers l’État : **445 71** crédité.',
      'À l’encaissement, l’argent arrive en banque : **512** débité ; la créance client s’éteint : **411** crédité.',
    ],
    journal: {
      date: '15/08/2024',
      description: 'Vente de marchandises - Facture n°2024786',
      lines: [
        { debitAccount: '411', label: 'Créances clients', debit: 1500 },
        { creditAccount: '707', label: 'Ventes de marchandises', credit: 1250 },
        { creditAccount: '445 71', label: 'État - TVA collectée', credit: 250 },
      ],
    },
    sourcePage: 21,
  },
]

export const lessons: Lesson[] = [
  {
    id: 't1-definition',
    chapterId: 't1-ch1',
    title: 'Qu’est-ce que la comptabilité ?',
    summary: 'Un peu d’histoire, la définition du PCG et les différentes comptabilités.',
    minutes: 5,
    sourcePage: 'diapositives 4 à 6',
    blocks: [
      { type: 'text', text: 'La comptabilité est très ancienne. Le cours en retient trois grandes étapes :' },
      {
        type: 'table',
        table: {
          headers: ['Période', 'Ce qui apparaît'],
          rows: [
            ['Antiquité', 'L’inventaire et la preuve de transaction (tablette économique)'],
            ['Empire romain', 'Les notions de recettes et de dépenses ; l’enregistrement sous forme de journal (codex)'],
            ['Renaissance', 'La partie double et la comptabilité « moderne » (Luca Pacioli, 1495)'],
          ],
        },
      },
      {
        type: 'definition',
        term: 'Comptabilité (PCG, art. 121-1)',
        text: '« La comptabilité est un système d’organisation de l’information financière permettant de **saisir, classer, enregistrer** des données de base chiffrées et présenter des états reflétant une **image fidèle** du patrimoine, de la situation financière et du résultat de l’entité à la date de clôture. »',
      },
      { type: 'diagram', kind: 'compta-process' },
      {
        type: 'text',
        text: 'Il existe plusieurs comptabilités. La **comptabilité financière** (L3 MIAGE, S5) est celle de ce cours. Le cours cite aussi la comptabilité **budgétaire et de gestion** (L3 S6 et M1 MIAGE), la comptabilité **sociale** (ex. bilan social) et la comptabilité **environnementale** (ex. bilan carbone).',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Selon le PCG, que doivent refléter les états présentés par la comptabilité ?',
          options: ['Le chiffre d’affaires prévisionnel', 'Une image fidèle du patrimoine, de la situation financière et du résultat', 'La valeur boursière de l’entreprise'],
          answer: 1,
          explanation: 'C’est la fin de la définition de l’article 121-1 du PCG.',
        },
      },
      { type: 'summary', items: ['La comptabilité saisit, classe et enregistre des données chiffrées.', 'Elle produit des états de synthèse qui donnent une image fidèle.', 'La comptabilité financière n’est qu’une des comptabilités possibles.'] },
    ],
  },
  {
    id: 't1-fonctions',
    chapterId: 't1-ch1',
    title: 'Les quatre fonctions de la comptabilité',
    summary: 'Preuve, impôts, information et gestion.',
    minutes: 3,
    sourcePage: 'diapositive 7',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Fonction', 'Rôle'],
          rows: [
            ['Juridique', 'Moyen de preuve'],
            ['Fiscale', 'Base de calcul des impôts et taxes'],
            ['Économique et sociale', 'Source d’informations'],
            ['De gestion', 'Outil de gestion et de contrôle, aide à la décision'],
          ],
        },
      },
      { type: 'tip', title: 'Pour retenir', text: 'Pense aux personnes qui utilisent la comptabilité : le **juge** (preuve), le **fisc** (impôts), le **public** (information) et le **dirigeant** (gestion).' },
      {
        type: 'quickcheck',
        check: {
          question: 'Une entreprise utilise ses comptes pour décider d’ouvrir un nouveau magasin. Quelle fonction est mobilisée ?',
          options: ['Juridique', 'Fiscale', 'De gestion', 'Économique et sociale'],
          answer: 2,
          explanation: 'La fonction de gestion est un outil de contrôle et d’aide à la décision.',
        },
      },
      { type: 'summary', items: ['Juridique : preuve.', 'Fiscale : base des impôts.', 'Économique et sociale : information.', 'Gestion : contrôle et décision.'] },
    ],
  },
  {
    id: 't1-normes',
    chapterId: 't1-ch2',
    title: 'Normes et hiérarchie du droit comptable',
    summary: 'IFRS ou normes françaises, et qui fixe les règles.',
    minutes: 5,
    sourcePage: 'diapositives 8 à 10',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['', 'Comptabilité internationale', 'Comptabilité française'],
          rows: [
            ['Normalisateur', 'International Accounting Standards Board (IASB)', 'Autorité des normes comptables (ANC), sous l’autorité du ministre de l’Économie et des Finances'],
            ['Nom des normes', 'International Financial Reporting Standards (IFRS)', 'Normes comptables françaises (French GAAP)'],
            ['Périmètre', 'Groupes cotés sur des marchés financiers réglementés (ex. LVMH)', 'Toutes les autres entreprises situées en France'],
          ],
        },
      },
      { type: 'heading', text: 'La hiérarchie du droit comptable français' },
      {
        type: 'steps',
        title: 'Du niveau le plus haut au plus bas',
        items: ['Directive européenne 2013/34/UE du 26 juin 2013', 'Code de commerce', 'Règlements de l’Autorité des normes comptables', 'Doctrine comptable de l’OEC et de la CNCC'],
      },
      { type: 'text', text: 'Les **principes comptables** français ont un seul but : donner une **image fidèle du patrimoine et de la situation financière**.' },
      {
        type: 'note',
        title: 'Ce que le support ne détaille pas',
        text: 'La diapositive 10 montre les principes comptables sous forme de schéma, sans les nommer un par un. L’application ne les liste donc pas.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Une PME non cotée située à Rennes applique…',
          options: ['Les normes IFRS', 'Les normes comptables françaises (French GAAP)', 'Le choix entre les deux, librement'],
          answer: 1,
          explanation: 'Les IFRS concernent les groupes cotés ; toutes les autres entreprises situées en France appliquent les normes françaises.',
        },
      },
      { type: 'summary', items: ['IFRS (IASB) : groupes cotés.', 'French GAAP (ANC) : toutes les autres entreprises en France.', 'Hiérarchie : directive européenne > Code de commerce > règlements ANC > doctrine.'] },
    ],
  },
  {
    id: 't1-nomenclature',
    chapterId: 't1-ch2',
    title: 'Le plan de comptes',
    summary: 'Les sept classes et la logique des numéros de comptes.',
    minutes: 5,
    sourcePage: 'diapositive 11',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Classe', 'Contenu', 'Famille'],
          rows: [
            ['1', 'Comptes de capitaux', 'Comptes de bilan'],
            ['2', 'Comptes d’immobilisations', 'Comptes de bilan'],
            ['3', 'Comptes de stocks et d’en-cours', 'Comptes de bilan'],
            ['4', 'Comptes de tiers', 'Comptes de bilan'],
            ['5', 'Comptes financiers', 'Comptes de bilan'],
            ['6', 'Comptes de charges', 'Comptes de gestion (résultat)'],
            ['7', 'Comptes de produits', 'Comptes de gestion (résultat)'],
          ],
        },
      },
      {
        type: 'text',
        text: 'Le premier chiffre donne la classe. Plus le numéro est long, plus il est précis. Exemples du cours : **40** – Fournisseurs et comptes rattachés → **401** – Fournisseurs ; **51** – Banque et établissements financiers → **512** – Banque.',
      },
      { type: 'tip', title: 'Astuce', text: 'Classes **1 à 5** = bilan (ce que l’entreprise possède et doit). Classes **6 et 7** = résultat (ce qu’elle consomme et produit).' },
      {
        type: 'quickcheck',
        check: {
          question: 'Le compte 607 – Achats de marchandises appartient à…',
          options: ['La classe 4, comptes de tiers', 'La classe 6, comptes de charges', 'La classe 7, comptes de produits'],
          answer: 1,
          explanation: 'Il commence par 6 : c’est un compte de charges, donc un compte de gestion.',
        },
      },
      { type: 'summary', items: ['7 classes : 1 à 5 au bilan, 6 et 7 au résultat.', 'Le premier chiffre = la classe.', 'Sous-comptes : on ajoute des chiffres pour préciser.'] },
    ],
  },
  {
    id: 't1-flux',
    chapterId: 't1-ch3',
    title: 'La partie double : emplois et ressources',
    summary: 'Chaque échange crée deux flux de même valeur et de sens contraire.',
    minutes: 6,
    sourcePage: 'diapositives 12 à 15',
    blocks: [
      {
        type: 'definition',
        term: 'Partie double',
        text: 'Une relation d’échange entre deux agents économiques donne toujours naissance à **deux flux de sens contraire et de même valeur**. Ces flux peuvent être **réels** ou **monétaires**.',
      },
      { type: 'diagram', kind: 'flux-echange' },
      {
        type: 'table',
        table: {
          headers: ['Notion', 'Question à se poser'],
          rows: [
            ['Ressource', 'D’où viennent les moyens nécessaires pour réaliser l’opération ?'],
            ['Emploi', 'Qu’obtient-on après avoir mobilisé ces moyens (destination de la ressource) ?'],
          ],
        },
      },
      { type: 'heading', text: 'Achat au comptant de 1 000 € de marchandises' },
      {
        type: 'table',
        table: {
          headers: ['', 'Entreprise cliente', 'Entreprise fournisseur'],
          rows: [
            ['Ressource', 'Décaissement de 1 000 €', 'Marchandises de 1 000 €'],
            ['Emploi', 'Marchandises de 1 000 €', 'Encaissement de 1 000 €'],
          ],
        },
      },
      { type: 'heading', text: 'Achat à crédit : deux phases' },
      {
        type: 'table',
        table: {
          caption: 'Phase 1 : l’achat',
          headers: ['', 'Entreprise cliente', 'Entreprise fournisseur'],
          rows: [
            ['Ressource', 'Naissance de la dette de 1 000 €', 'Marchandises de 1 000 €'],
            ['Emploi', 'Marchandises de 1 000 €', 'Naissance de la créance de 1 000 €'],
          ],
        },
      },
      {
        type: 'table',
        table: {
          caption: 'Phase 2 : le paiement',
          headers: ['', 'Entreprise cliente', 'Entreprise fournisseur'],
          rows: [
            ['Ressource', 'Décaissement de 1 000 €', 'Extinction de la créance de 1 000 €'],
            ['Emploi', 'Extinction de la dette de 1 000 €', 'Encaissement de 1 000 €'],
          ],
        },
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Penser qu’un emploi est toujours « une dépense ». Un emploi est simplement **ce que l’on obtient** : de la marchandise, de l’argent en banque, ou l’extinction d’une dette.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Dépôt d’espèces à la banque (3 000 €). Quel est l’emploi ?',
          options: ['Les espèces (caisse)', 'La banque', 'Une dette'],
          answer: 1,
          explanation: 'On obtient de l’argent en banque (emploi) grâce aux espèces (ressource). C’est l’exercice 1 de la correction.',
        },
      },
      { type: 'summary', items: ['Toute opération = deux flux de même valeur.', 'Ressource : d’où vient le moyen. Emploi : ce qu’on obtient.', 'Un achat à crédit se fait en deux phases : achat puis paiement.'] },
    ],
  },
  {
    id: 't1-patrimoine',
    chapterId: 't1-ch3',
    title: 'La partie double : le patrimoine',
    summary: 'Situation nette = Actif − Dettes, et comment elle évolue.',
    minutes: 5,
    sourcePage: 'diapositives 16 à 19',
    blocks: [
      { type: 'formula', formulaId: 'f-t1-sn' },
      {
        type: 'steps',
        title: 'Exemple du cours',
        items: ['Un appartement vaut **150 000 €** (actif).', 'Il a été financé par un emprunt de **120 000 €** (dette).', 'Situation nette = 150 000 − 120 000 = **30 000 €**.'],
      },
      {
        type: 'text',
        text: 'La partie double conserve cette égalité. Si la valeur de l’actif augmente, il n’y a que **trois explications** : une augmentation équivalente des dettes, une augmentation équivalente de la situation nette, ou un mélange des deux.',
      },
      {
        type: 'steps',
        title: 'Cinq ans plus tard',
        items: [
          'L’appartement vaut 165 000 € (+15 000 €) et il reste 80 000 € d’emprunt (−40 000 €).',
          'Situation nette = 165 000 − 80 000 = **85 000 €**.',
          'Hausse de 55 000 € = 15 000 € de hausse de l’actif + 40 000 € de baisse de la dette.',
        ],
      },
      { type: 'tip', title: 'Une citation à connaître', text: '« La comptabilité : algèbre du droit et méthode d’observation des phénomènes économiques », Pierre Garnier (1947).' },
      {
        type: 'quickcheck',
        check: {
          question: 'Actif : 200 000 €. Dettes : 140 000 €. Quelle est la situation nette ?',
          options: ['340 000 €', '60 000 €', '140 000 €'],
          answer: 1,
          explanation: 'Situation nette = Actif − Dettes = 200 000 − 140 000 = 60 000 €.',
        },
      },
      { type: 'summary', items: ['Situation nette = Actif − Dettes.', 'Elle augmente si l’actif monte ou si les dettes baissent.'] },
    ],
  },
  {
    id: 't1-journal',
    chapterId: 't1-ch4',
    title: 'Le processus comptable et le journal',
    summary: 'De la pièce comptable à l’écriture au journal.',
    minutes: 6,
    sourcePage: 'diapositives 20 à 22',
    blocks: [
      { type: 'diagram', kind: 'compta-process' },
      {
        type: 'text',
        text: 'Le comptable reçoit l’information sous forme de **pièces comptables** : factures, pièces de caisse, talons de chèques, relevés bancaires… Il les enregistre au **journal**, dans l’ordre chronologique.',
      },
      {
        type: 'definition',
        term: 'Lire une écriture',
        text: 'Le compte **débité** est l’**emploi** ; le compte **crédité** est la **ressource**. Une écriture comporte la date, les numéros et intitulés des comptes, les montants au débit et au crédit, et un libellé.',
      },
      { type: 'example', exampleId: 'ex-t1-journal' },
      {
        type: 'journal',
        title: 'Encaissement (15/09/2024)',
        entry: {
          date: '15/09/2024',
          description: 'Encaissement chèque n°237649',
          lines: [
            { debitAccount: '512', label: 'Banque', debit: 1500 },
            { creditAccount: '411', label: 'Créances clients', credit: 1500 },
          ],
        },
      },
      {
        type: 'text',
        text: 'Une écriture qui utilise des **comptes de gestion** (classes 6 et 7) **modifie la valeur** du patrimoine. Une écriture qui n’utilise que des **comptes de bilan** (classes 1 à 5) ne modifie que sa **structure**.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'L’encaissement du 15/09 (512 / 411) modifie-t-il la valeur du patrimoine ?',
          options: ['Oui, il crée un produit', 'Non, il ne change que sa structure', 'Oui, il crée une charge'],
          answer: 1,
          explanation: '512 et 411 sont deux comptes de bilan : la créance se transforme en argent, la valeur totale ne change pas.',
        },
      },
      { type: 'summary', items: ['Pièces → journal → comptes → balance → états de synthèse.', 'Débit = emploi ; crédit = ressource.', 'Classes 6 et 7 : la valeur du patrimoine change.'] },
    ],
  },
  {
    id: 't1-comptes',
    chapterId: 't1-ch4',
    title: 'Les comptes et la balance',
    summary: 'Tenir un compte, calculer son solde et dresser la balance.',
    minutes: 7,
    sourcePage: 'diapositives 23 à 25',
    blocks: [
      { type: 'definition', term: 'Compte', text: 'La **plus petite unité** retenue pour le classement et l’enregistrement des mouvements comptables. On le présente souvent « en T » : débits à gauche, crédits à droite.' },
      {
        type: 'taccount',
        account: { title: '512 - Banque', debits: [{ label: '15/09/2024', amount: 1500 }], credits: [], caption: 'Solde débiteur de 1 500 €' },
      },
      {
        type: 'text',
        text: 'À la fin de la période : si **débits > crédits**, le solde est **débiteur** (emploi net) ; si **débits < crédits**, il est **créditeur** (ressource nette). Exemples du cours : 411 – Clients a un solde nul, 707 – Ventes un solde créditeur de 1 250 €.',
      },
      {
        type: 'table',
        table: {
          caption: 'Sens des mouvements (diapositive 24)',
          headers: ['Comptes', 'Débit', 'Crédit'],
          rows: [
            ['Actif : classes 2, 3, 4 et 5', 'Augmentation', 'Diminution'],
            ['Passif : classes 1 et 4', 'Diminution', 'Augmentation'],
            ['Charges : classe 6', 'Augmentation', 'Diminution'],
            ['Produits : classe 7', 'Diminution', 'Augmentation'],
          ],
        },
      },
      { type: 'definition', term: 'Balance', text: 'Document qui récapitule **tous les comptes**, leurs intitulés et leurs **soldes** (débiteurs ou créditeurs). Elle sert à établir les états de synthèse.' },
      {
        type: 'table',
        table: {
          headers: ['N° compte', 'Intitulé', 'Solde débiteur', 'Solde créditeur'],
          numericCols: [2, 3],
          rows: [
            ['411', 'Créances clients', '–', ''],
            ['445 71', 'État - TVA collectée', '', '250'],
            ['512', 'Banque', '1 500', ''],
            ['707', 'Ventes de marchandises', '', '1 250'],
          ],
        },
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Croire qu’un « crédit » est toujours une bonne nouvelle. En comptabilité, débit et crédit indiquent seulement **le côté** du compte. Une banque au crédit veut dire que l’argent **sort**.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Le compte 512 – Banque a 8 226 € au débit et 2 100 € au crédit. Quel est son solde ?',
          options: ['Créditeur de 6 126 €', 'Débiteur de 6 126 €', 'Débiteur de 10 326 €'],
          answer: 1,
          explanation: 'Débits > crédits : solde débiteur de 8 226 − 2 100 = 6 126 € (exercice 2 de la correction).',
        },
      },
      { type: 'summary', items: ['Solde = différence entre total débit et total crédit.', 'Actif et charges augmentent au débit ; passif et produits au crédit.', 'La balance liste tous les soldes.'] },
    ],
  },
  {
    id: 't1-bilan',
    chapterId: 't1-ch4',
    title: 'Le bilan',
    summary: 'La « photographie » du patrimoine et ses égalités.',
    minutes: 8,
    sourcePage: 'diapositives 26 à 31',
    blocks: [
      { type: 'text', text: 'Les états de synthèse renseignent sur le patrimoine, la situation financière et le résultat. En normes françaises, ils comprennent obligatoirement : le **bilan**, le **compte de résultat** et l’**annexe**.' },
      { type: 'diagram', kind: 'bilan-schema' },
      { type: 'formula', formulaId: 'f-t1-equilibre' },
      {
        type: 'steps',
        title: 'Les égalités du bilan (diapositive 28)',
        items: [
          'Situation nette = Actif − (Provisions pour risques et charges + Dettes)',
          'donc Actif − (PRC + Dettes) − Situation nette = 0',
          'donc **Actif − Passif = 0**, soit **Actif = Passif**',
        ],
      },
      { type: 'formula', formulaId: 'f-t1-sn-resultat' },
      {
        type: 'table',
        table: {
          caption: 'Les trois logiques du bilan (diapositive 29)',
          headers: ['Logique', 'Haut du bilan', 'Bas du bilan'],
          rows: [
            ['Juridique', 'Droits de propriété / dettes envers les actionnaires', 'Droits de créance / dettes envers les tiers'],
            ['Économique', 'Emplois stables / ressources durables', 'Emplois circulants / ressources circulantes'],
            ['Financière', 'Actif : liquidité croissante vers le bas', 'Passif : exigibilité croissante vers le bas'],
          ],
        },
      },
      { type: 'note', title: 'Exemple réel', text: 'Les diapositives 30 et 31 montrent le bilan de Capgemini SE au 31/12/23 (actif immobilisé, actif circulant, situation nette, PRC, dettes). Les chiffres sont en image dans le support et ne sont pas repris ici.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Total actif : 609 500 €. Capital 250 000 €, dettes 342 400 €, pas de provisions. Quel est le résultat de l’exercice ?',
          options: ['17 100 €', '267 100 €', '359 500 €'],
          answer: 0,
          explanation: 'Actif = Passif : 609 500 = 250 000 + 342 400 + Résultat, donc Résultat = 17 100 € (exercice 6 de la correction).',
        },
      },
      { type: 'summary', items: ['Actif = Passif.', 'Passif = situation nette + provisions pour risques et charges + dettes.', 'SN fin = SN début + résultat.'] },
    ],
  },
  {
    id: 't1-resultat',
    chapterId: 't1-ch4',
    title: 'Le compte de résultat et l’annexe',
    summary: 'Produits, charges, résultat et informations complémentaires.',
    minutes: 5,
    sourcePage: 'diapositives 32 à 36',
    blocks: [
      {
        type: 'definition',
        term: 'Compte de résultat',
        text: 'Il recense tous les flux qui modifient le patrimoine **pendant une période** : les **produits**, qui génèrent de la richesse, et les **charges**, qui en détruisent.',
      },
      { type: 'formula', formulaId: 'f-t1-resultat' },
      {
        type: 'text',
        text: 'Le résultat se décompose en **résultat d’exploitation**, **résultat financier** et **résultat exceptionnel**. Après l’**impôt sur les sociétés (IS)**, on obtient le **résultat net comptable (RNC)**. Celui-ci peut être **mis en réserve** ou **distribué** sous forme de dividendes.',
      },
      {
        type: 'definition',
        term: 'Annexe',
        text: 'Elle apporte les **informations complémentaires** au bilan et au compte de résultat, sous forme de commentaires et de tableaux. Seuls les éléments d’importance significative y figurent. Son contenu dépend de la catégorie, de la taille et du régime d’imposition de l’entreprise.',
      },
      { type: 'warning', title: 'Erreur fréquente', text: 'Mélanger bilan et compte de résultat. Le bilan est une **photo à une date** ; le compte de résultat décrit les **flux d’une période**.' },
      {
        type: 'quickcheck',
        check: {
          question: 'Produits : 53 800 €. Charges : 12 300 €. Quel est le résultat ?',
          options: ['Bénéfice de 41 500 €', 'Déficit de 41 500 €', 'Bénéfice de 66 100 €'],
          answer: 0,
          explanation: 'Produits > charges : bénéfice de 53 800 − 12 300 = 41 500 € (TD n°1, exercice 3).',
        },
      },
      { type: 'summary', items: ['Résultat = produits − charges.', 'Exploitation + financier + exceptionnel − IS = RNC.', 'L’annexe complète les deux autres états.'] },
    ],
  },
]

const VF = ['Vrai', 'Faux']
const ER = ['Emploi', 'Ressource']

export const exercises: Exercise[] = [
  {
    id: 'ex-t1-01', chapterId: 't1-ch1', lessonId: 't1-fonctions', notion: 'Fonctions de la comptabilité', level: 'debutant', kind: 'qcm',
    title: 'La fonction fiscale', statement: 'La comptabilité sert de **base de calcul des impôts et taxes**. De quelle fonction s’agit-il ?',
    inputs: [{ id: 'a', type: 'choice', options: ['Juridique', 'Fiscale', 'De gestion', 'Économique et sociale'], answer: 1 }],
    explanation: 'Fonction fiscale : base de calcul d’impôts et taxes. La fonction juridique est un moyen de preuve.',
  },
  {
    id: 'ex-t1-02', chapterId: 't1-ch2', lessonId: 't1-normes', notion: 'Normes comptables', level: 'debutant', kind: 'vrai-faux',
    title: 'Qui fixe les normes françaises ?', statement: 'Vrai ou faux : les normes comptables françaises sont fixées par l’IASB.',
    inputs: [{ id: 'a', type: 'choice', options: VF, answer: 1 }],
    explanation: 'L’IASB fixe les normes IFRS. En France, c’est l’Autorité des normes comptables (ANC).',
  },
  {
    id: 'ex-t1-03', chapterId: 't1-ch2', lessonId: 't1-nomenclature', notion: 'Plan de comptes', level: 'debutant', kind: 'qcm',
    title: 'Retrouver la classe', statement: 'À quelle classe appartient le compte **512 – Banque** ?',
    inputs: [{ id: 'a', type: 'choice', options: ['Classe 1 – Capitaux', 'Classe 4 – Tiers', 'Classe 5 – Financiers', 'Classe 7 – Produits'], answer: 2 }],
    explanation: 'Le premier chiffre est 5 : comptes financiers. 51 = Banque et établissements financiers, 512 = Banque.',
  },
  {
    id: 'ex-t1-04', source: 'Titre 1 – Correction, exercice 1', chapterId: 't1-ch3', lessonId: 't1-flux', notion: 'Emplois et ressources', level: 'debutant', kind: 'comprehension',
    title: 'Emploi ou ressource ? (1)', statement: 'Achat **à crédit** de marchandises au fournisseur Adèle : 2 800 €. Indique le rôle de chaque élément.',
    inputs: [
      { id: 'a', type: 'choice', prompt: 'Les marchandises', options: ER, answer: 0 },
      { id: 'b', type: 'choice', prompt: 'La dette fournisseur', options: ER, answer: 1 },
    ],
    explanation: 'On obtient des marchandises (emploi) grâce à une dette envers le fournisseur (ressource).',
  },
  {
    id: 'ex-t1-05', source: 'Titre 1 – Correction, exercices 1 et 2', chapterId: 't1-ch3', lessonId: 't1-flux', notion: 'Emplois et ressources', level: 'intermediaire', kind: 'comprehension',
    title: 'Emploi ou ressource ? (2)', statement: 'Pour chaque opération, choisis **l’emploi** réalisé.',
    inputs: [
      { id: 'a', type: 'choice', prompt: 'Règlement par chèque bancaire au fournisseur Adèle (2 800 €)', options: ['Banque', 'Dette fournisseur'], answer: 1 },
      { id: 'b', type: 'choice', prompt: 'Remise en banque d’un chèque de 1 200 € reçu du client Zita', options: ['Banque', 'Chèque'], answer: 0 },
      { id: 'c', type: 'choice', prompt: 'Facture de réparation adressée au client Robert (2 450 €)', options: ['Créance client', 'Prestation de réparation'], answer: 0 },
      { id: 'd', type: 'choice', prompt: 'Paiement en espèces de fournitures de bureau (10 €)', options: ['Fournitures de bureau', 'Caisse'], answer: 0 },
    ],
    explanation: 'L’emploi est ce que l’on obtient : l’extinction de la dette, de l’argent en banque, une créance sur le client, des fournitures.',
  },
  {
    id: 'ex-t1-06', source: 'Titre 1 – Correction, exercice 2', chapterId: 't1-ch4', lessonId: 't1-comptes', notion: 'Solde d’un compte', level: 'intermediaire', kind: 'calcul',
    title: 'Le compte Banque au 31 octobre', statement: 'Solde débiteur au 1er octobre : **4 226 €**. Le 04/10, encaissement de **4 000 €** par chèque. Le 28/10, règlement de **2 100 €** par chèque au fournisseur Zoé. Calcule le solde du compte 512 au 31 octobre.',
    inputs: [
      { id: 'a', type: 'number', label: 'Total des débits', answer: 8226, unit: '€' },
      { id: 'b', type: 'number', label: 'Solde (débiteur)', answer: 6126, unit: '€' },
    ],
    explanation: 'Débits : 4 226 + 4 000 = 8 226 €. Crédits : 2 100 €. Débits > crédits : solde débiteur.',
    steps: ['Total débit = 4 226 + 4 000 = **8 226 €**', 'Total crédit = **2 100 €**', 'Solde débiteur = 8 226 − 2 100 = **6 126 €**'],
  },
  {
    id: 'ex-t1-07', source: 'Titre 1 – Correction, exercice 3', chapterId: 't1-ch4', lessonId: 't1-comptes', notion: 'Solde d’un compte', level: 'intermediaire', kind: 'calcul',
    title: 'Le compte Caisse au 30 septembre', statement: 'Compte 531 – Caisse. Solde débiteur initial : **826 €**. Entrées : 1 000 € (16/09) et 1 829 € (30/09). Sorties : 65 € (02/09), 94 € (08/09), 124 € (25/09) et 1 500 € (30/09). Quel est le solde au 30 septembre ?',
    inputs: [{ id: 'a', type: 'number', label: 'Solde débiteur', answer: 1872, unit: '€' }],
    explanation: 'Un solde débiteur de caisse signifie que l’entreprise dispose de cet argent en caisse.',
    steps: ['Débits = 826 + 1 000 + 1 829 = 3 655 €', 'Crédits = 65 + 94 + 124 + 1 500 = 1 783 €', 'Solde débiteur = 3 655 − 1 783 = **1 872 €**'],
  },
  {
    id: 'ex-t1-08', source: 'Titre 1 – Correction, exercice 4', chapterId: 't1-ch4', lessonId: 't1-comptes', notion: 'Solde d’un compte', level: 'avance', kind: 'probleme',
    title: 'Le compte client au 31 octobre', statement: 'Compte 411 – Client Prudence chez l’entreprise Judith. Solde débiteur initial : **2 660 €**. Débits : 84 000 € (05/10), 50 400 € (09/10), 67 200 € (26/10). Crédits : 68 530 € (16/10), 14 000 € (18/10), 60 865 € (31/10).',
    inputs: [
      { id: 'a', type: 'number', label: 'Total des débits', answer: 204_260, unit: '€' },
      { id: 'b', type: 'number', label: 'Total des crédits', answer: 143_395, unit: '€' },
      { id: 'c', type: 'number', label: 'Solde débiteur', answer: 60_865, unit: '€' },
    ],
    explanation: 'Le solde débiteur d’un compte client est ce que le client doit encore : Prudence doit 60 865 € à Judith au 31 octobre.',
    steps: ['Débits = 2 660 + 84 000 + 50 400 + 67 200 = **204 260 €**', 'Crédits = 68 530 + 14 000 + 60 865 = **143 395 €**', 'Solde = 204 260 − 143 395 = **60 865 €** (débiteur)'],
  },
  {
    id: 'ex-t1-09', source: 'Titre 1 – Correction, exercice 5', chapterId: 't1-ch4', lessonId: 't1-comptes', notion: 'Nature des comptes', level: 'intermediaire', kind: 'comprehension',
    title: 'Actif, passif, charge ou produit ?', statement: 'Classe chaque compte.',
    inputs: [
      { id: 'a', type: 'choice', prompt: 'Prêt accordé au personnel', options: ['Actif', 'Passif', 'Charge', 'Produit'], answer: 0 },
      { id: 'b', type: 'choice', prompt: 'Fournisseurs d’immobilisations', options: ['Actif', 'Passif', 'Charge', 'Produit'], answer: 1 },
      { id: 'c', type: 'choice', prompt: 'Sous-traitance générale', options: ['Actif', 'Passif', 'Charge', 'Produit'], answer: 2 },
      { id: 'd', type: 'choice', prompt: 'Ventes d’emballages', options: ['Actif', 'Passif', 'Charge', 'Produit'], answer: 3 },
      { id: 'e', type: 'choice', prompt: 'Emprunt auprès des établissements de crédit', options: ['Actif', 'Passif', 'Charge', 'Produit'], answer: 1 },
    ],
    explanation: 'Un prêt accordé est une créance (actif). Une dette envers un fournisseur ou une banque est au passif. La sous-traitance est une charge, une vente un produit.',
  },
  {
    id: 'ex-t1-10', source: 'Titre 1 – Correction, exercice 6', chapterId: 't1-ch4', lessonId: 't1-bilan', notion: 'Bilan et situation nette', level: 'avance', kind: 'probleme',
    title: 'Le bilan de l’entreprise Gisèle', statement: 'Actif : terrains 82 000 ; constructions 320 000 ; matériel industriel 87 500 ; titres immobilisés 6 400 ; stocks de matières 11 000 ; stocks de produits finis 9 800 ; créances clients 53 000 ; créances diverses 38 000 ; trésorerie 1 800. Passif : capital 250 000 ; emprunt 80 000 ; dettes fournisseurs 109 400 ; dettes fiscales et sociales 153 000 ; résultat à déterminer.',
    inputs: [
      { id: 'a', type: 'number', label: 'Total actif', answer: 609_500, unit: '€' },
      { id: 'b', type: 'number', label: 'Résultat de l’exercice', answer: 17_100, unit: '€' },
      { id: 'c', type: 'number', label: 'Situation nette', answer: 267_100, unit: '€' },
    ],
    explanation: 'Actif = Passif permet de trouver le résultat ; la situation nette = capital + résultat (ou actif − dettes).',
    steps: [
      'Total actif = 495 900 (immobilisé) + 113 600 (circulant) = **609 500 €**',
      'Passif sans le résultat = 250 000 + 153 000 + 109 400 + 80 000 = 592 400 €',
      'Résultat = 609 500 − 592 400 = **17 100 €**',
      'Situation nette = 250 000 + 17 100 = **267 100 €** (ou 609 500 − 342 400)',
    ],
  },
  {
    id: 'ex-t1-11', source: 'Exemple du cours, diapositives 16 à 18', chapterId: 't1-ch3', lessonId: 't1-patrimoine', notion: 'Situation nette', level: 'debutant', kind: 'numerique',
    title: 'L’appartement, cinq ans plus tard', statement: 'Un appartement vaut aujourd’hui **165 000 €** et il reste **80 000 €** d’emprunt. Quelle est la situation nette ?',
    inputs: [{ id: 'a', type: 'number', label: 'Situation nette', answer: 85_000, unit: '€' }],
    explanation: 'Situation nette = Actif − Dettes.',
    steps: ['165 000 − 80 000 = **85 000 €**'],
  },
  {
    id: 'ex-t1-12', chapterId: 't1-ch4', lessonId: 't1-comptes', notion: 'Sens des mouvements', level: 'intermediaire', kind: 'qcm',
    title: 'Une charge augmente', statement: 'Une charge (classe 6) augmente. Où l’enregistre-t-on ?',
    inputs: [{ id: 'a', type: 'choice', options: ['Au débit', 'Au crédit'], answer: 0 }],
    explanation: 'Charges : augmentation au débit, diminution au crédit (diapositive 24).',
  },
]

export const quizQuestions: QuizQuestion[] = [
  { id: 'q-t1-01', chapterId: 't1-ch1', lessonId: 't1-definition', level: 'debutant', type: 'qcm', prompt: 'Quel article du PCG définit la comptabilité ?', options: ['Art. 121-1', 'Art. 211-1', 'Art. 512'], answer: 0, explanation: 'Art. 121-1 du PCG.' },
  { id: 'q-t1-02', chapterId: 't1-ch1', lessonId: 't1-definition', level: 'debutant', type: 'qcm', prompt: 'Qui a formalisé la partie double à la Renaissance (1495) ?', options: ['Maurice Lauré', 'Luca Pacioli', 'Pierre Garnier'], answer: 1, explanation: 'Luca Pacioli, 1495. Maurice Lauré a inventé la TVA ; Pierre Garnier est l’auteur de la citation sur l’« algèbre du droit ».' },
  { id: 'q-t1-03', chapterId: 't1-ch1', lessonId: 't1-fonctions', level: 'debutant', type: 'qcm', prompt: 'La comptabilité comme « moyen de preuve » relève de la fonction…', options: ['Fiscale', 'Juridique', 'De gestion'], answer: 1, explanation: 'Fonction juridique.' },
  { id: 'q-t1-04', chapterId: 't1-ch2', lessonId: 't1-normes', level: 'debutant', type: 'vrai-faux', prompt: 'LVMH, groupe coté, établit ses comptes consolidés en normes IFRS.', options: VF, answer: 0, explanation: 'C’est l’exemple donné par le cours pour les groupes cotés.' },
  { id: 'q-t1-05', chapterId: 't1-ch2', lessonId: 't1-normes', level: 'intermediaire', type: 'qcm', prompt: 'Quel texte est au sommet de la hiérarchie du droit comptable français ?', options: ['Le Code de commerce', 'La directive européenne 2013/34/UE', 'Les règlements de l’ANC'], answer: 1, explanation: 'Directive européenne > Code de commerce > règlements ANC > doctrine.' },
  { id: 'q-t1-06', chapterId: 't1-ch2', lessonId: 't1-nomenclature', level: 'debutant', type: 'qcm', prompt: 'Les comptes de classe 7 sont des comptes de…', options: ['Charges', 'Produits', 'Tiers'], answer: 1, explanation: 'Classe 7 : produits.' },
  { id: 'q-t1-07', chapterId: 't1-ch2', lessonId: 't1-nomenclature', level: 'intermediaire', type: 'qcm', prompt: 'Lequel n’est PAS un compte de bilan ?', options: ['401 – Fournisseurs', '512 – Banque', '607 – Achats de marchandises', '411 – Clients'], answer: 2, explanation: '607 commence par 6 : compte de gestion (charge).' },
  { id: 'q-t1-08', chapterId: 't1-ch3', lessonId: 't1-flux', level: 'debutant', type: 'vrai-faux', prompt: 'Selon la partie double, un échange crée deux flux de même valeur et de sens contraire.', options: VF, answer: 0, explanation: 'C’est la définition de la partie double.' },
  { id: 'q-t1-09', chapterId: 't1-ch3', lessonId: 't1-flux', level: 'intermediaire', type: 'qcm', prompt: 'Achat à crédit, phase 1 : quelle est la ressource pour le client ?', options: ['Les marchandises', 'La naissance de la dette', 'Le décaissement'], answer: 1, explanation: 'Le client obtient les marchandises (emploi) grâce à une dette (ressource).' },
  { id: 'q-t1-10', chapterId: 't1-ch3', lessonId: 't1-patrimoine', level: 'intermediaire', type: 'numerique', prompt: 'Actif : 150 000 €. Dettes : 120 000 €. Situation nette ?', answer: 30_000, unit: '€', explanation: '150 000 − 120 000 = 30 000 €.' },
  { id: 'q-t1-11', chapterId: 't1-ch4', lessonId: 't1-journal', level: 'intermediaire', type: 'vrai-faux', prompt: 'Une écriture qui n’utilise que des comptes des classes 1 à 5 modifie la valeur du patrimoine.', options: VF, answer: 1, explanation: 'Elle ne modifie que sa structure.' },
  { id: 'q-t1-12', chapterId: 't1-ch4', lessonId: 't1-comptes', level: 'intermediaire', type: 'qcm', prompt: 'Un compte de passif diminue. On l’enregistre…', options: ['Au débit', 'Au crédit'], answer: 0, explanation: 'Passif : diminution au débit, augmentation au crédit.' },
  { id: 'q-t1-13', chapterId: 't1-ch4', lessonId: 't1-comptes', level: 'avance', type: 'numerique', prompt: 'Caisse : débits 3 655 €, crédits 1 783 €. Solde débiteur ?', answer: 1872, unit: '€', explanation: '3 655 − 1 783 = 1 872 €.' },
  { id: 'q-t1-14', chapterId: 't1-ch4', lessonId: 't1-bilan', level: 'intermediaire', type: 'qcm', prompt: 'Quels sont les trois états de synthèse obligatoires en normes françaises ?', options: ['Bilan, compte de résultat, annexe', 'Journal, grand livre, balance', 'Bilan, balance, budget'], answer: 0, explanation: 'Bilan, compte de résultat et annexe.' },
  { id: 'q-t1-15', chapterId: 't1-ch4', lessonId: 't1-bilan', level: 'avance', type: 'numerique', prompt: 'SN au début : 30 000 €. Résultat de la période : 55 000 €. SN à la fin ?', answer: 85_000, unit: '€', explanation: 'SN(n+1) = SN(n) + Résultat(n+1) = 30 000 + 55 000 = 85 000 €.' },
  { id: 'q-t1-16', chapterId: 't1-ch4', lessonId: 't1-resultat', level: 'intermediaire', type: 'qcm', prompt: 'Que devient le résultat net comptable ?', options: ['Il est mis en réserve ou distribué en dividendes', 'Il est toujours versé à l’État', 'Il est inscrit à l’actif'], answer: 0, explanation: 'Mise en réserve ou distribution de dividendes (diapositive 34).' },
]

export const quizSeries: QuizSeries[] = [
  {
    id: 'qs-t1',
    title: 'Titre 1 : les bases de la comptabilité',
    description: 'Définition, normes, plan de comptes, partie double, comptes et états de synthèse.',
    level: 'debutant',
    chapterIds: ['t1-ch1', 't1-ch2', 't1-ch3', 't1-ch4'],
    questionIds: quizQuestions.map((q) => q.id),
    timeLimitSec: 8 * 60,
  },
]

export const glossary: GlossaryEntry[] = [
  { term: 'Actif', definition: 'Ce que possède l’entreprise : actif immobilisé (emplois stables) et actif circulant.', lessonId: 't1-bilan' },
  { term: 'Annexe', definition: 'État de synthèse qui complète le bilan et le compte de résultat par des commentaires et des tableaux.', lessonId: 't1-resultat' },
  { term: 'Balance', definition: 'Document qui récapitule tous les comptes, leurs intitulés et leurs soldes.', lessonId: 't1-comptes' },
  { term: 'Bilan', definition: '« Photographie » du patrimoine à une date : Actif = Passif.', lessonId: 't1-bilan' },
  { term: 'Compte', definition: 'Plus petite unité de classement et d’enregistrement des mouvements comptables.', lessonId: 't1-comptes' },
  { term: 'Compte de résultat', definition: 'État qui recense les produits et les charges d’une période ; leur différence est le résultat.', lessonId: 't1-resultat' },
  { term: 'Emploi', definition: 'Ce que l’on obtient après avoir mobilisé des moyens. Le compte débité est l’emploi.', lessonId: 't1-flux' },
  { term: 'IFRS', definition: 'Normes internationales (IASB) appliquées par les groupes cotés.', lessonId: 't1-normes' },
  { term: 'Journal', definition: 'Registre où les opérations sont enregistrées chronologiquement à partir des pièces comptables.', lessonId: 't1-journal' },
  { term: 'Partie double', definition: 'Tout échange crée deux flux de même valeur et de sens contraire.', lessonId: 't1-flux' },
  { term: 'Passif', definition: 'Situation nette + provisions pour risques et charges + dettes.', lessonId: 't1-bilan' },
  { term: 'Ressource', definition: 'D’où viennent les moyens nécessaires à l’opération. Le compte crédité est la ressource.', lessonId: 't1-flux' },
  { term: 'Situation nette', definition: 'Actif − Dettes (et provisions). Aussi appelée capitaux propres.', lessonId: 't1-patrimoine' },
  { term: 'Solde', definition: 'Différence entre les débits et les crédits d’un compte : débiteur ou créditeur.', lessonId: 't1-comptes' },
]
