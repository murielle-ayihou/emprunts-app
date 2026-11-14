import type { Lesson } from '@/types'

/**
 * Leçons du cours. Tout le contenu provient du support « Titre 4 – Les emprunts bancaires ».
 * Les explications reformulent le support avec des mots simples ; les calculs supplémentaires
 * (lignes de tableau, écritures des années suivantes, totaux) sont des applications directes
 * des règles et des tableaux du support.
 *
 * Syntaxe des textes : **gras** et $formule$ (KaTeX en ligne).
 */
export const lessons: Lesson[] = [
  // ─── Chapitre 1 ─────────────────────────────────────────────────────
  {
    id: 'l-financements',
    chapterId: 'ch1',
    title: 'Les sources de financement',
    summary: "Où se situe l'emprunt parmi les façons de financer une entreprise.",
    minutes: 4,
    sourcePage: 'p. 120',
    blocks: [
      {
        type: 'text',
        text: "Pour financer ses projets, une entreprise a plusieurs possibilités. Le cours les présente sous forme d'un schéma : on part de **l'autofinancement**, puis on trouve les **financements externes**.",
      },
      { type: 'diagram', kind: 'financing' },
      { type: 'heading', text: 'Lire le schéma' },
      {
        type: 'definition',
        term: 'Autofinancement',
        text: "L'entreprise se finance avec ses propres ressources. Dans le schéma, il est placé à part, en dehors des financements externes.",
      },
      {
        type: 'text',
        text: 'Les **financements externes** viennent de l’extérieur de l’entreprise. Le cours en distingue trois, chacun associé à sa source :',
      },
      {
        type: 'table',
        table: {
          headers: ['Financement externe', 'Qui apporte les fonds ?'],
          rows: [
            ['Capitaux propres', 'Les actionnaires'],
            ['Subventions et aides publiques', 'Les organisations publiques'],
            ['Financements bancaires', 'Les banques'],
          ],
        },
      },
      {
        type: 'text',
        text: 'Les **financements bancaires** se divisent eux-mêmes en deux : le **crédit-bail** et les **emprunts**. Ce titre du cours porte uniquement sur les **emprunts**.',
      },
      {
        type: 'note',
        title: 'Ce que le support ne détaille pas',
        text: "Le support cite l'autofinancement, les capitaux propres, les subventions et le crédit-bail dans le schéma, sans les expliquer davantage. L'application reste donc au niveau du schéma pour ces notions.",
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Dans le schéma du cours, à quelle catégorie appartient l’emprunt ?',
          options: ['Aux capitaux propres', 'Aux financements bancaires', "À l'autofinancement", 'Aux subventions et aides publiques'],
          answer: 1,
          explanation: 'Les financements bancaires (apportés par les banques) se divisent en crédit-bail et emprunts.',
        },
      },
      {
        type: 'summary',
        items: [
          "L'autofinancement est placé à part des financements externes.",
          'Trois financements externes : capitaux propres (actionnaires), subventions et aides publiques (organisations publiques), financements bancaires (banques).',
          'Financements bancaires = crédit-bail + emprunts.',
        ],
      },
    ],
  },

  // ─── Chapitre 2 ─────────────────────────────────────────────────────
  {
    id: 'l-definition',
    chapterId: 'ch2',
    title: "Qu'est-ce qu'un emprunt ?",
    summary: 'La définition, les acteurs et la durée.',
    minutes: 4,
    sourcePage: 'p. 121',
    blocks: [
      {
        type: 'definition',
        term: 'Emprunt',
        text: "Somme d'argent (le **capital**) mise à la disposition d'un **emprunteur** par un établissement financier (le **prêteur**). L'emprunteur s'engage à rembourser cette somme, **avec intérêts**, sur une durée pouvant aller **d'un an à plus de vingt ans**.",
      },
      { type: 'heading', text: 'Les mots à connaître' },
      {
        type: 'table',
        table: {
          headers: ['Terme', 'Ce que ça veut dire'],
          rows: [
            ['Capital', "La somme d'argent prêtée (ex. 60 000 €)"],
            ['Prêteur', "L'établissement financier qui met l'argent à disposition"],
            ['Emprunteur', "Celui qui reçoit l'argent et s'engage à le rembourser (ex. une société)"],
            ['Intérêts', "Ce que l'emprunteur paie en plus du capital, en contrepartie du prêt"],
            ['Taux d’intérêt', 'Pourcentage qui sert à calculer les intérêts (ex. 4 %)'],
            ['Durée', "Temps prévu pour rembourser : d'un an à plus de vingt ans"],
          ],
        },
      },
      {
        type: 'text',
        text: "Retiens l'idée principale : l'emprunteur rend **le capital** et paie **des intérêts** en plus. Toute la suite du cours explique comment calculer ces intérêts et à quel rythme le capital est rendu.",
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Une société reçoit 60 000 € de sa banque. Qui est le prêteur ?',
          options: ['La société', 'La banque', 'Les actionnaires', "L'État"],
          answer: 1,
          explanation: "Le prêteur est l'établissement financier qui met le capital à disposition : ici, la banque. La société est l'emprunteur.",
        },
      },
      {
        type: 'summary',
        items: [
          "Emprunt = capital mis à disposition par un prêteur (établissement financier) à un emprunteur.",
          "L'emprunteur rembourse le capital avec intérêts.",
          "Durée : d'un an à plus de vingt ans.",
        ],
      },
    ],
  },
  {
    id: 'l-interets',
    chapterId: 'ch2',
    title: 'Les intérêts périodiques',
    summary: 'La formule de base : capital restant dû × taux.',
    minutes: 6,
    sourcePage: 'p. 121',
    blocks: [
      {
        type: 'text',
        text: "À chaque échéance, l'emprunteur paie des intérêts. Le cours donne une seule règle pour les calculer :",
      },
      { type: 'formula', formulaId: 'f-interets' },
      {
        type: 'definition',
        term: 'Capital restant dû',
        text: "La partie du capital qui n'a **pas encore été remboursée** à un moment donné. Au début de l'emprunt, il est égal au capital emprunté. Il diminue à chaque fois qu'on rembourse une part du capital.",
      },
      {
        type: 'text',
        text: 'Le cours précise que le **taux d’intérêt** peut être **fixe** (il ne change pas pendant toute la durée) ou **variable** (il peut changer). Tous les exemples du cours utilisent un **taux fixe**.',
      },
      {
        type: 'steps',
        title: 'Exemple : intérêts de la première année',
        items: [
          'Capital emprunté : 60 000 €. Au début de la première année, le capital restant dû est donc **60 000 €**.',
          'Taux fixe : 4 %, soit **0,04** en décimal.',
          'Intérêts = 60 000 × 0,04 = **2 400 €**.',
        ],
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: "Calculer les intérêts sur le **capital de départ** à chaque année. Les intérêts se calculent sur le **capital restant dû au début de la période**. Exemple du cours (amortissement constant) : en N+1, il reste 50 000 € à rembourser, donc les intérêts sont 50 000 × 4 % = **2 000 €**, et non 2 400 €.",
      },
      {
        type: 'tip',
        title: 'Astuce',
        text: 'Pour passer un pourcentage en décimal, divise par 100 : 4 % → 0,04 ; 3,5 % → 0,035.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Le capital restant dû au début de l’année est de 40 000 € et le taux est de 4 %. Combien valent les intérêts de l’année ?',
          options: ['2 400 €', '1 600 €', '160 €', '16 000 €'],
          answer: 1,
          explanation: '40 000 × 0,04 = 1 600 €. C’est la ligne N+2 du tableau en amortissement constant.',
        },
      },
      {
        type: 'summary',
        items: [
          'Intérêts périodiques = Capital restant dû × Taux d’intérêt.',
          'Le capital restant dû est pris au début de la période.',
          'Le taux peut être fixe ou variable ; le cours travaille à taux fixe.',
        ],
      },
    ],
  },
  {
    id: 'l-paiement',
    chapterId: 'ch2',
    title: 'Le paiement périodique',
    summary: 'Chaque paiement = amortissement du capital + intérêts.',
    minutes: 6,
    sourcePage: 'p. 121',
    blocks: [
      {
        type: 'text',
        text: "À chaque échéance, l'emprunteur fait un **paiement** à la banque. Ce paiement contient deux morceaux :",
      },
      { type: 'formula', formulaId: 'f-paiement' },
      { type: 'diagram', kind: 'payment-split' },
      {
        type: 'definition',
        term: 'Amortissement du capital',
        text: 'La part du paiement qui **rembourse le capital**. Le cours écrit « Amortissement du capital (remboursement) ». C’est uniquement cette part qui fait baisser le capital restant dû.',
      },
      {
        type: 'definition',
        term: 'Annuité',
        text: 'Quand les échéances sont **annuelles**, le paiement périodique s’appelle l’**annuité**. C’est le nom de la colonne dans les tableaux du cours.',
      },
      { type: 'formula', formulaId: 'f-crd' },
      {
        type: 'steps',
        title: 'Exemple : première année, amortissement constant (tableau p. 124)',
        items: [
          'Amortissement de l’année : **10 000 €**.',
          'Intérêts de l’année : 60 000 × 4 % = **2 400 €**.',
          'Paiement (annuité) = 10 000 + 2 400 = **12 400 €**.',
          'Capital restant dû en fin d’année = 60 000 − 10 000 = **50 000 €**.',
        ],
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: "Confondre **annuité** et **amortissement**. L'annuité est tout ce que l'on paie ; l'amortissement n'est que la part de capital. Les intérêts ne font **pas** baisser le capital restant dû.",
      },
      {
        type: 'tip',
        title: 'Pour retenir',
        text: '**A**nnuité = **A**mortissement + intérêts. Le capital restant dû baisse seulement de l’amortissement.',
      },
      {
        type: 'quickcheck',
        check: {
          question: "Une annuité vaut 11 445,71 € et les intérêts de l'année 2 400 €. Quel est l'amortissement du capital ?",
          options: ['13 845,71 €', '9 045,71 €', '11 445,71 €', '2 400 €'],
          answer: 1,
          explanation: 'Amortissement = Annuité − Intérêts = 11 445,71 − 2 400 = 9 045,71 € (ligne N du tableau p. 125).',
        },
      },
      {
        type: 'summary',
        items: [
          'Paiement périodique = Amortissement du capital + Intérêts périodiques.',
          'Échéances annuelles → le paiement s’appelle l’annuité.',
          'Capital restant dû fin = Capital restant dû début − Amortissement.',
        ],
      },
    ],
  },

  // ─── Chapitre 3 ─────────────────────────────────────────────────────
  {
    id: 'l-modalites',
    chapterId: 'ch3',
    title: 'Les trois modalités de remboursement',
    summary: 'Vue d’ensemble : in fine, amortissement constant, annuité constante.',
    minutes: 5,
    sourcePage: 'p. 122',
    blocks: [
      {
        type: 'text',
        text: 'Le cours présente **trois façons** de rembourser le capital. La différence porte sur **le rythme** auquel le capital est remboursé.',
      },
      { type: 'diagram', kind: 'methods' },
      {
        type: 'table',
        table: {
          headers: ['Modalité', 'Ce qui se passe', 'Ce qui est constant'],
          rows: [
            ['In fine', 'Le capital est amorti en une seule fois, au terme de la durée de l’emprunt. Les intérêts peuvent être payés périodiquement ou capitalisés.', 'Les intérêts (si payés périodiquement)'],
            ['Amortissement constant', 'Le capital est amorti périodiquement, par parts égales.', 'L’amortissement'],
            ['Annuité constante', 'Le capital est amorti périodiquement, mais pas par parts égales.', 'Le paiement (l’annuité)'],
          ],
        },
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Confondre **amortissement constant** et **annuité constante**. Dans le premier, c’est la part de capital qui est fixe ; dans le second, c’est le paiement total.',
      },
      {
        type: 'tip',
        title: 'Pour retenir',
        text: 'Lis le nom de la modalité : il dit **ce qui est constant**. « Amortissement constant » → l’amortissement ne bouge pas. « Annuité constante » → l’annuité ne bouge pas.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Dans quelle modalité le capital est-il remboursé en une seule fois, à la fin ?',
          options: ['Amortissement constant', 'Annuité constante', 'In fine'],
          answer: 2,
          explanation: 'In fine : le capital est amorti en une seule fois au terme de la durée de l’emprunt.',
        },
      },
      {
        type: 'summary',
        items: [
          'In fine : tout le capital à la fin.',
          'Amortissement constant : même part de capital à chaque échéance.',
          'Annuité constante : même paiement à chaque échéance.',
        ],
      },
    ],
  },
  {
    id: 'l-in-fine',
    chapterId: 'ch3',
    title: 'Le remboursement in fine',
    summary: 'Tout le capital est remboursé à la dernière échéance.',
    minutes: 6,
    sourcePage: 'p. 122 et 123',
    blocks: [
      {
        type: 'definition',
        term: 'Remboursement in fine',
        text: 'Le capital est amorti **en une seule fois au terme** de la durée de l’emprunt. Les intérêts peuvent être **payés périodiquement** ou **capitalisés**.',
      },
      {
        type: 'text',
        text: "Dans l'exemple du cours, les intérêts sont **payés chaque année**. Comme aucun capital n'est remboursé avant la fin, le capital restant dû reste à 60 000 € : les intérêts sont donc **les mêmes chaque année**.",
      },
      { type: 'example', exampleId: 'ex-in-fine' },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Oublier le capital dans la **dernière annuité**. En N+5, on paie les intérêts de l’année **et** tout le capital : 2 400 + 60 000 = **62 400 €**.',
      },
      {
        type: 'note',
        title: 'Ce que le support ne détaille pas',
        text: "Le support indique que les intérêts peuvent être capitalisés, mais ne donne ni méthode ni exemple de calcul pour ce cas. L'application ne traite donc que les intérêts payés périodiquement.",
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Emprunt in fine de 60 000 € à 4 % sur 6 ans. Combien vaut le capital restant dû au début de N+3 ?',
          options: ['30 000 €', '60 000 €', '40 000 €', '0 €'],
          answer: 1,
          explanation: 'En in fine, aucun capital n’est remboursé avant la dernière année : le capital restant dû reste à 60 000 € jusqu’en N+5.',
        },
      },
      {
        type: 'summary',
        items: [
          'Amortissement = 0 chaque année, sauf la dernière où il vaut tout le capital.',
          'Intérêts identiques chaque année (capital restant dû inchangé).',
          'Dernière annuité = intérêts + capital.',
        ],
      },
    ],
  },
  {
    id: 'l-amort-constant',
    chapterId: 'ch3',
    title: 'L’amortissement constant',
    summary: 'La même part de capital est remboursée à chaque échéance.',
    minutes: 7,
    sourcePage: 'p. 122 et 124',
    blocks: [
      {
        type: 'definition',
        term: 'Amortissement constant',
        text: 'Le capital est amorti **périodiquement, par parts égales**.',
      },
      { type: 'formula', formulaId: 'f-amort-constant' },
      { type: 'example', exampleId: 'ex-amort-constant' },
      { type: 'heading', text: 'Ce qu’on observe dans le tableau' },
      {
        type: 'text',
        text: "Le capital restant dû baisse de 10 000 € chaque année. Comme les intérêts se calculent sur ce capital restant dû, **ils baissent eux aussi** : de 400 € par an (10 000 × 4 %). L'amortissement étant fixe, **l'annuité baisse** d'année en année : 12 400, 12 000, 11 600… jusqu'à 10 400 €.",
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Garder 2 400 € d’intérêts toutes les années. Ce n’est vrai qu’en in fine. Ici, il faut recalculer les intérêts sur le nouveau capital restant dû à chaque ligne.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Emprunt de 90 000 € remboursé par amortissement constant en 6 annuités. Quel est l’amortissement annuel ?',
          options: ['9 000 €', '15 000 €', '18 000 €', '3 600 €'],
          answer: 1,
          explanation: 'Amortissement = Capital / nombre d’échéances = 90 000 / 6 = 15 000 €.',
        },
      },
      {
        type: 'summary',
        items: [
          'Amortissement = Capital emprunté / Nombre d’échéances.',
          'Les intérêts et les annuités diminuent chaque année.',
          'Le capital restant dû baisse du même montant chaque année.',
        ],
      },
    ],
  },
  {
    id: 'l-annuite-constante',
    chapterId: 'ch3',
    title: 'L’annuité constante',
    summary: 'Le paiement est identique à chaque échéance.',
    minutes: 10,
    sourcePage: 'p. 122 et 125',
    blocks: [
      {
        type: 'definition',
        term: 'Annuité constante',
        text: 'Le capital est amorti **périodiquement mais pas par parts égales**. Ce sont les **paiements périodiques qui sont constants**.',
      },
      { type: 'formula', formulaId: 'f-annuite-constante' },
      {
        type: 'text',
        text: "Une fois l'annuité connue, on remplit le tableau ligne par ligne : on calcule les **intérêts** sur le capital restant dû, puis on en déduit **l'amortissement** = annuité − intérêts.",
      },
      { type: 'example', exampleId: 'ex-annuite-constante' },
      { type: 'heading', text: 'Ce qu’on observe dans le tableau' },
      {
        type: 'text',
        text: "L'annuité reste à 11 445,71 €. Les intérêts baissent (car le capital restant dû baisse), donc la part d'amortissement **augmente** chaque année : 9 045,71 € en N, 11 005,52 € en N+5.",
      },
      {
        type: 'note',
        title: 'Coquille dans le support (p. 125)',
        text: "Sous le tableau, le calcul est écrit « 60 000 × 4 % / (1+4 %)^−6 ». Il manque « 1 − » au dénominateur. Le bon calcul est $60\\,000 \\times 0{,}04 / (1 - 1{,}04^{-6})$, qui donne bien **11 445,71 €**, conformément à la formule p. 122.",
      },
      {
        type: 'note',
        title: 'Écart d’arrondi sur la dernière ligne',
        text: "En N+5, 440,22 + 11 005,52 = **11 445,74 €**, et non 11 445,71 €. Les montants étant arrondis au centime chaque année, un petit écart s'accumule. Il est corrigé sur la dernière échéance pour que le capital restant dû tombe exactement à 0. Le simulateur applique la même règle.",
      },
      {
        type: 'warning',
        title: 'Erreurs fréquentes',
        text: "Oublier le **signe moins** de l'exposant : c'est $(1+i)^{-n}$, pas $(1+i)^{n}$. Oublier de convertir le taux en décimal (4 et non 0,04). Diviser le capital par n : ça, c'est l'amortissement constant.",
      },
      {
        type: 'tip',
        title: 'À la calculatrice',
        text: 'Calcule d’abord le dénominateur : 1,04 puissance (−6) = 0,790315 ; puis 1 − 0,790315 = 0,209685. Ensuite seulement : 2 400 ÷ 0,209685.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'En annuité constante, comment évolue l’amortissement du capital au fil des années ?',
          options: ['Il reste identique', 'Il augmente', 'Il diminue', 'Il est nul sauf à la fin'],
          answer: 1,
          explanation: "L'annuité est fixe et les intérêts baissent ; donc l'amortissement (annuité − intérêts) augmente.",
        },
      },
      {
        type: 'summary',
        items: [
          'Annuité = $C \\times i \\,/\\, (1 - (1+i)^{-n})$.',
          'Intérêts = capital restant dû × taux ; Amortissement = Annuité − Intérêts.',
          'Les intérêts baissent, l’amortissement augmente, l’annuité reste fixe.',
        ],
      },
    ],
  },
  {
    id: 'l-comparaison',
    chapterId: 'ch3',
    title: 'Comparer les trois modalités',
    summary: 'Même emprunt, trois rythmes de remboursement, trois coûts.',
    minutes: 6,
    sourcePage: 'p. 123 à 125',
    blocks: [
      {
        type: 'text',
        text: 'Les trois tableaux du cours portent sur **le même emprunt** : 60 000 € à 4 % sur 6 ans. On peut donc les comparer. Les totaux ci-dessous sont obtenus en additionnant les colonnes des tableaux du cours.',
      },
      {
        type: 'table',
        table: {
          headers: ['Modalité', 'Annuité N', 'Annuité N+5', 'Total des intérêts', 'Total remboursé'],
          numericCols: [1, 2, 3, 4],
          rows: [
            ['In fine', '2 400', '62 400', '14 400', '74 400'],
            ['Amortissement constant', '12 400', '10 400', '8 400', '68 400'],
            ['Annuité constante', '11 445,71', '11 445,74 *', '8 674,29', '68 674,29'],
          ],
          caption: "* Annuité réelle de N+5 après correction de l'écart d'arrondi (le tableau du cours affiche 11 445,71).",
        },
      },
      { type: 'diagram', kind: 'methods-chart' },
      { type: 'heading', text: 'Pourquoi les coûts sont différents ?' },
      {
        type: 'text',
        text: "Les intérêts se calculent toujours sur le **capital restant dû**. Plus le capital est remboursé **tôt**, plus le capital restant dû baisse vite, et **moins on paie d'intérêts**.",
      },
      {
        type: 'steps',
        title: 'Lecture des trois cas',
        items: [
          '**In fine** : le capital reste dû en totalité pendant 6 ans → intérêts les plus élevés (14 400 €), mais petites annuités jusqu’à la dernière.',
          '**Amortissement constant** : on rembourse le plus de capital dès le début → intérêts les plus faibles (8 400 €), mais premières annuités les plus lourdes.',
          '**Annuité constante** : situation intermédiaire (8 674,29 €), avec un paiement identique chaque année.',
        ],
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Pour le même emprunt, quelle modalité coûte le plus d’intérêts ?',
          options: ['Amortissement constant', 'Annuité constante', 'In fine'],
          answer: 2,
          explanation: 'En in fine, le capital restant dû reste au maximum pendant toute la durée, donc les intérêts sont les plus élevés : 14 400 € contre 8 400 € et 8 674,29 €.',
        },
      },
      {
        type: 'summary',
        items: [
          'Coût total : in fine 14 400 € > annuité constante 8 674,29 € > amortissement constant 8 400 €.',
          'Rembourser le capital plus tôt réduit les intérêts.',
          'Le simulateur permet de refaire cette comparaison avec d’autres montants.',
        ],
      },
    ],
  },

  // ─── Chapitre 4 ─────────────────────────────────────────────────────
  {
    id: 'l-souscription',
    chapterId: 'ch4',
    title: 'La souscription de l’emprunt',
    summary: 'Enregistrer l’argent reçu et la dette.',
    minutes: 5,
    sourcePage: 'p. 126',
    blocks: [
      {
        type: 'text',
        text: 'Quand l’emprunt est souscrit, la banque verse le capital à l’entreprise. Le cours donne la règle :',
      },
      {
        type: 'definition',
        term: 'Règle de la souscription',
        text: 'Le capital est une **dette**. Il est enregistré au **crédit** du compte **164 – Emprunts auprès des établissements de crédit**, par le **débit** du compte **512 – Banque**.',
      },
      {
        type: 'table',
        table: {
          headers: ['Compte', 'Sens', 'Pourquoi'],
          rows: [
            ['512 – Banque', 'Débit', "L'argent arrive sur le compte bancaire"],
            ['164 – Emprunts auprès des établissements de crédit', 'Crédit', 'La dette envers la banque apparaît'],
          ],
        },
      },
      { type: 'example', exampleId: 'ex-souscription' },
      {
        type: 'warning',
        title: 'Attention : pas de TVA !',
        text: 'Il s’agit d’une **opération financière** : on ne calcule et on n’enregistre **aucune TVA** sur l’emprunt.',
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Inverser les sens. Retiens : la banque **reçoit** l’argent (débit du 512), la dette **naît** (crédit du 164).',
      },
      {
        type: 'quickcheck',
        check: {
          question: "À la souscription d'un emprunt de 60 000 €, quel compte est crédité ?",
          options: ['512 – Banque', '164 – Emprunts auprès des établissements de crédit', '661 – Charges d’intérêts', '445 – TVA'],
          answer: 1,
          explanation: 'Le 164 est crédité (la dette apparaît) par le débit du 512 (l’argent arrive).',
        },
      },
      {
        type: 'summary',
        items: ['Débit 512 Banque / Crédit 164 Emprunts, pour le montant du capital.', 'Opération financière : pas de TVA.'],
      },
    ],
  },
  {
    id: 'l-ecriture-paiement',
    chapterId: 'ch4',
    title: 'Le paiement périodique',
    summary: 'Enregistrer l’amortissement et les intérêts payés.',
    minutes: 6,
    sourcePage: 'p. 127',
    blocks: [
      {
        type: 'definition',
        term: 'Règle du paiement périodique',
        text: 'L’**amortissement de l’emprunt** et la **charge d’intérêt** périodique sont enregistrés au **débit** des comptes **164 – Emprunts auprès des établissements de crédit** et **661 – Charges d’intérêts**, par le **crédit** du compte **512 – Banque**.',
      },
      {
        type: 'table',
        table: {
          headers: ['Compte', 'Sens', 'Montant', 'Pourquoi'],
          rows: [
            ['164 – Emprunts', 'Débit', 'Amortissement', 'La dette diminue'],
            ['661 – Charges d’intérêts', 'Débit', 'Intérêts', "Les intérêts sont une charge pour l'entreprise"],
            ['512 – Banque', 'Crédit', 'Annuité', "L'argent sort du compte bancaire"],
          ],
        },
      },
      { type: 'example', exampleId: 'ex-paiement' },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Mettre toute l’annuité (12 400 €) au compte 661. Seuls les **intérêts** sont une charge. La part de capital (10 000 €) **rembourse la dette** : elle va au débit du 164.',
      },
      {
        type: 'tip',
        title: 'Vérification rapide',
        text: 'Total des débits (164 + 661) = crédit du 512 = annuité. Si l’égalité ne tombe pas juste, il y a une erreur.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Pour une annuité de 12 400 € (amortissement 10 000 €, intérêts 2 400 €), quel montant est porté au débit du 661 ?',
          options: ['12 400 €', '10 000 €', '2 400 €', '0 €'],
          answer: 2,
          explanation: 'Le 661 enregistre uniquement la charge d’intérêts : 2 400 €.',
        },
      },
      {
        type: 'summary',
        items: [
          'Débit 164 (amortissement) + Débit 661 (intérêts) / Crédit 512 (annuité).',
          'Les montants se lisent sur la ligne du tableau d’amortissement.',
        ],
      },
    ],
  },
  {
    id: 'l-application-compta',
    chapterId: 'ch4',
    title: 'Du tableau aux écritures',
    summary: 'Passer les écritures de n’importe quelle année.',
    minutes: 7,
    sourcePage: 'p. 123 à 127',
    blocks: [
      {
        type: 'text',
        text: "La règle de la page 127 s'applique à **chaque échéance**. Il suffit de lire la bonne ligne du tableau d'amortissement : la colonne **Amortissement** va au débit du 164, la colonne **Intérêts** au débit du 661, la colonne **Annuité** au crédit du 512.",
      },
      {
        type: 'steps',
        title: 'Méthode en 3 étapes',
        items: [
          "Repérer la ligne de l'année dans le tableau d'amortissement.",
          'Débiter le 164 de l’amortissement et le 661 des intérêts.',
          'Créditer le 512 de l’annuité, puis vérifier : débits = crédit.',
        ],
      },
      { type: 'heading', text: 'Application 1 : amortissement constant, année N+1' },
      {
        type: 'text',
        text: 'Ligne N+1 du tableau p. 124 : amortissement **10 000**, intérêts **2 000**, annuité **12 000**.',
      },
      {
        type: 'journal',
        entry: {
          date: 'Date de paiement',
          description: 'Paiement de la deuxième annuité',
          lines: [
            { debitAccount: '164', label: 'Emprunts auprès des étab. de crédit', debit: 10_000 },
            { debitAccount: '661', label: 'Charges d’intérêts', debit: 2000 },
            { creditAccount: '512', label: 'Banque', credit: 12_000 },
          ],
        },
      },
      { type: 'heading', text: 'Application 2 : annuité constante, année N' },
      {
        type: 'text',
        text: 'Ligne N du tableau p. 125 : amortissement **9 045,71**, intérêts **2 400**, annuité **11 445,71**.',
      },
      {
        type: 'journal',
        entry: {
          date: 'Date de paiement',
          description: 'Paiement de la première annuité',
          lines: [
            { debitAccount: '164', label: 'Emprunts auprès des étab. de crédit', debit: 9045.71 },
            { debitAccount: '661', label: 'Charges d’intérêts', debit: 2400 },
            { creditAccount: '512', label: 'Banque', credit: 11_445.71 },
          ],
        },
      },
      { type: 'heading', text: 'Application 3 : in fine, année N puis année N+5' },
      {
        type: 'text',
        text: "Ligne N du tableau p. 123 : amortissement **0**, intérêts **2 400**. Il n'y a pas de capital remboursé : seul le 661 est débité.",
      },
      {
        type: 'journal',
        entry: {
          date: 'Date de paiement',
          description: 'Paiement de la première annuité',
          lines: [
            { debitAccount: '661', label: 'Charges d’intérêts', debit: 2400 },
            { creditAccount: '512', label: 'Banque', credit: 2400 },
          ],
        },
      },
      {
        type: 'text',
        text: 'Ligne N+5 : amortissement **60 000**, intérêts **2 400**, annuité **62 400**.',
      },
      {
        type: 'journal',
        entry: {
          date: 'Date de paiement',
          description: 'Paiement de la dernière annuité',
          lines: [
            { debitAccount: '164', label: 'Emprunts auprès des étab. de crédit', debit: 60_000 },
            { debitAccount: '661', label: 'Charges d’intérêts', debit: 2400 },
            { creditAccount: '512', label: 'Banque', credit: 62_400 },
          ],
        },
      },
      {
        type: 'tip',
        title: 'Contrôle final',
        text: 'Sur toute la durée, le total des débits du 164 est égal au capital emprunté : la dette créée à la souscription est entièrement soldée.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Amortissement constant, année N+4 (tableau p. 124). Quel montant est crédité au 512 ?',
          options: ['10 000 €', '800 €', '10 800 €', '20 000 €'],
          answer: 2,
          explanation: 'Ligne N+4 : amortissement 10 000 + intérêts 800 = annuité 10 800 €, créditée au 512.',
        },
      },
      {
        type: 'summary',
        items: [
          'Une ligne du tableau = une écriture de paiement.',
          'Amortissement → débit 164 ; Intérêts → débit 661 ; Annuité → crédit 512.',
          'En in fine, avant la dernière année, seul le 661 est débité.',
        ],
      },
    ],
  },
  {
    id: 'l-periodicite',
    chapterId: 'ch3',
    title: 'Échéances mensuelles ou trimestrielles',
    summary: 'Le taux équivalent et le choix de la périodicité (TD n°5).',
    minutes: 9,
    sourcePage: 'TD n°5, exercice 2',
    blocks: [
      {
        type: 'text',
        text: "Le cours présente des échéances **annuelles**. Le TD n°5 va plus loin : la société Dali emprunte **80 000 €** le 1er avril N à **5 %** sur **4 ans**, par amortissement constant, et peut rembourser **chaque mois**, **chaque trimestre** ou **chaque année**.",
      },
      { type: 'formula', formulaId: 'f-taux-equivalent' },
      {
        type: 'steps',
        title: 'Les taux équivalents du TD',
        items: [
          'Trimestriel : $(1{,}05)^{1/4} - 1 \\approx 1{,}227\\,\\%$',
          'Mensuel : $(1{,}05)^{1/12} - 1 \\approx 0{,}407\\,\\%$',
          'La correction arrondit ces taux à 3 décimales avant de calculer les intérêts.',
        ],
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Diviser le taux annuel par 4 ou par 12 (5 % / 4 = 1,25 %). Le TD utilise le **taux équivalent**, qui donne la même valeur acquise sur l’année : 1,227 % et non 1,25 %.',
      },
      { type: 'diagram', kind: 'periodicite-chart' },
      {
        type: 'table',
        table: {
          caption: 'Première année (jusqu’au 31 mars N+1), d’après la correction',
          headers: ['Périodicité', 'Amortissement par échéance', 'Première échéance', 'Intérêts de la 1re année'],
          numericCols: [1, 2, 3],
          rows: [
            ['Annuelle', '20 000', '24 000', '4 000,00'],
            ['Trimestrielle', '5 000', '5 981,60', '3 558,30'],
            ['Mensuelle', '1 666,67', '1 992,27', '3 459,50'],
          ],
        },
      },
      {
        type: 'note',
        title: 'Coquille dans la correction du TD n°5',
        text: 'Dans le tableau trimestriel, la colonne « Trimestrialité » affiche 5 809,60 ; 5 759,00 ; 5 708,40 et 5 657,80. Or trimestrialité = amortissement + intérêts : **5 981,60 ; 5 920,25 ; 5 858,90 ; 5 797,55**. Les intérêts (981,60 ; 920,25…) et leur total (3 558,30) sont justes.',
      },
      {
        type: 'text',
        text: "**Pourquoi payer plus souvent coûte moins cher ?** Les remboursements interviennent en cours d'année : le capital restant dû baisse plus tôt, donc les intérêts aussi.",
      },
      {
        type: 'table',
        table: {
          caption: 'Le conseil de la correction',
          headers: ['Si la priorité est…', 'Alors choisir…'],
          rows: [
            ['Le coût de l’emprunt', 'Une échéance mensuelle'],
            ['La disponibilité de la trésorerie, ou un placement qui rapporte plus de 5 %', 'Une échéance annuelle'],
          ],
        },
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Capital restant dû 80 000 €, taux trimestriel 1,227 %. Intérêts du premier trimestre ?',
          options: ['1 000,00 €', '981,60 €', '1 227,00 €'],
          answer: 1,
          explanation: '80 000 × 1,227 % = 981,60 €.',
        },
      },
      {
        type: 'summary',
        items: [
          'Taux équivalent : (1 + i)^(1/k) − 1.',
          'Nombre d’échéances = durée × k ; amortissement constant = capital / nombre d’échéances.',
          'Plus les échéances sont fréquentes, moins on paie d’intérêts.',
        ],
      },
    ],
  },
  {
    id: 'l-frais-emprunt',
    chapterId: 'ch4',
    title: 'Les frais bancaires à la souscription',
    summary: 'Frais, TVA et montant réellement reçu (TD n°5 et exercices du Titre 4).',
    minutes: 6,
    sourcePage: 'TD n°5, exercice 1 et correction des exercices',
    blocks: [
      {
        type: 'text',
        text: "Souvent, la banque prélève des **frais** au moment où elle verse l'emprunt. La dette (164) reste égale au **capital emprunté**, mais la banque (512) ne reçoit que le capital **moins les frais TTC**.",
      },
      {
        type: 'steps',
        title: 'TD n°5 : 630 000 € et 2 500 € HT de frais',
        items: [
          'Frais : 2 500 € HT au débit du **627 – Frais bancaires**',
          'TVA sur les frais : 2 500 × 20 % = **500 €** au débit du **445 66**',
          'Banque : 630 000 − 2 500 × 1,2 = **627 000 €**',
          'Dette : **630 000 €** au crédit du 164',
        ],
      },
      {
        type: 'journal',
        title: 'Souscription avec frais (01/06/N)',
        entry: {
          date: '01/06/N',
          description: 'Souscription emprunt',
          lines: [
            { debitAccount: '512', label: 'Banque', debit: 627_000 },
            { debitAccount: '627', label: 'Frais bancaires', debit: 2500 },
            { debitAccount: '445 66', label: 'État - TVA déductible sur B&S', debit: 500 },
            { creditAccount: '164', label: 'Emprunts auprès des étab. de crédit', credit: 630_000 },
          ],
        },
      },
      {
        type: 'text',
        text: "Même logique dans l'exercice DENGUE (10 000 € et 60 € HT de frais) : banque 10 000 − 60 × 1,20 = **9 928 €** ; 627 : 60 € ; 445 66 : 12 € ; 164 : 10 000 €.",
      },
      {
        type: 'note',
        title: 'Coquilles dans les corrections',
        text: "Dans la correction des exercices du Titre 4 (DENGUE), les écritures sont datées du 30/09 alors que l'énoncé parle du **20/09/N** et du **20/09/N+1**. L'en-tête du TD n°5 est intitulé « TD n°4 – Les emprunts ».",
      },
      {
        type: 'warning',
        title: 'Erreur fréquente',
        text: 'Inscrire au 164 le montant reçu (627 000 €). La dette envers la banque est le **capital emprunté** (630 000 €) : c’est lui qu’on remboursera.',
      },
      {
        type: 'quickcheck',
        check: {
          question: 'Emprunt de 10 000 € avec 60 € HT de frais (TVA 20 %). Montant au débit du 512 ?',
          options: ['10 000 €', '9 940 €', '9 928 €'],
          answer: 2,
          explanation: '10 000 − 60 × 1,2 = 9 928 €.',
        },
      },
      {
        type: 'summary',
        items: ['D 512 (net reçu) + D 627 (frais HT) + D 445 66 (TVA) / C 164 (capital).', 'La dette reste égale au capital emprunté.'],
      },
    ],
  },
]
