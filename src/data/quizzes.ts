import type { QuizQuestion, QuizSeries } from '@/types'

const VF = ['Vrai', 'Faux']

/**
 * Banque de questions de quiz. Toutes portent sur le contenu du support de cours.
 * Les réponses numériques sont vérifiées par tests/content.test.ts.
 */
export const quizQuestions: QuizQuestion[] = [
  // Chapitre 1
  { id: 'q01', chapterId: 'ch1', lessonId: 'l-financements', level: 'debutant', type: 'vrai-faux', prompt: 'Dans le schéma du cours, l’autofinancement fait partie des financements externes.', options: VF, answer: 1, explanation: 'L’autofinancement est placé à part ; les financements externes sont les capitaux propres, les subventions et aides publiques, et les financements bancaires.' },
  { id: 'q02', chapterId: 'ch1', lessonId: 'l-financements', level: 'debutant', type: 'qcm', prompt: 'Qui est à l’origine des subventions et aides publiques ?', options: ['Les actionnaires', 'Les banques', 'Les organisations publiques', 'Les fournisseurs'], answer: 2, explanation: 'Le schéma associe les subventions et aides publiques aux organisations publiques.' },
  { id: 'q03', chapterId: 'ch1', lessonId: 'l-financements', level: 'debutant', type: 'qcm', prompt: 'Les financements bancaires se divisent en…', options: ['Capitaux propres et emprunts', 'Crédit-bail et emprunts', 'Subventions et crédit-bail', 'Autofinancement et emprunts'], answer: 1, explanation: 'Financements bancaires = crédit-bail + emprunts.' },
  { id: 'q04', chapterId: 'ch1', lessonId: 'l-financements', level: 'debutant', type: 'vrai-faux', prompt: 'Les financements bancaires sont apportés par les banques.', options: VF, answer: 0, explanation: 'C’est la source indiquée sous « Financements bancaires » dans le schéma.' },

  // Chapitre 2
  { id: 'q05', chapterId: 'ch2', lessonId: 'l-definition', level: 'debutant', type: 'qcm', prompt: 'Un emprunt est une somme d’argent mise à la disposition d’un emprunteur par…', options: ['Un actionnaire', 'Un établissement financier', 'Un client', 'Une organisation publique'], answer: 1, explanation: 'Le prêteur est un établissement financier.' },
  { id: 'q06', chapterId: 'ch2', lessonId: 'l-definition', level: 'debutant', type: 'vrai-faux', prompt: 'L’emprunteur s’engage à rembourser le capital avec intérêts.', options: VF, answer: 0, explanation: 'C’est la définition du cours.' },
  { id: 'q07', chapterId: 'ch2', lessonId: 'l-interets', level: 'debutant', type: 'qcm', prompt: 'Comment calcule-t-on les intérêts périodiques ?', options: ['Capital emprunté / nombre d’échéances', 'Capital restant dû × taux d’intérêt', 'Annuité − amortissement du capital initial', 'Capital emprunté × durée'], answer: 1, explanation: 'Intérêts périodiques = Capital restant dû × Taux d’intérêt.' },
  { id: 'q08', chapterId: 'ch2', lessonId: 'l-interets', level: 'debutant', type: 'numerique', prompt: 'Capital restant dû : 25 000 €. Taux : 4 %. Combien valent les intérêts de la période ?', answer: 1000, unit: '€', explanation: '25 000 × 0,04 = 1 000 €.' },
  { id: 'q09', chapterId: 'ch2', lessonId: 'l-interets', level: 'avance', type: 'numerique', prompt: 'Capital restant dû : 11 005,52 €. Taux : 4 %. Intérêts de la période, au centime ?', answer: 440.22, unit: '€', explanation: '11 005,52 × 0,04 = 440,2208 → 440,22 € (ligne N+5 du tableau p. 125).' },
  { id: 'q10', chapterId: 'ch2', lessonId: 'l-paiement', level: 'debutant', type: 'qcm', prompt: 'Un paiement périodique est égal à…', options: ['Intérêts − amortissement', 'Amortissement du capital + intérêts périodiques', 'Capital restant dû × taux', 'Capital emprunté / durée'], answer: 1, explanation: 'Paiement périodique = Amortissement du capital + Intérêt périodique.' },
  { id: 'q11', chapterId: 'ch2', lessonId: 'l-paiement', level: 'intermediaire', type: 'vrai-faux', prompt: 'Quand les échéances sont annuelles, le paiement périodique s’appelle l’annuité.', options: VF, answer: 0, explanation: 'Dans les tableaux du cours, la colonne du paiement s’appelle « Annuité ».' },
  { id: 'q12', chapterId: 'ch2', lessonId: 'l-paiement', level: 'intermediaire', type: 'numerique', prompt: 'Annuité : 12 000 €. Intérêts de l’année : 2 000 €. Quel est l’amortissement du capital ?', answer: 10_000, unit: '€', explanation: 'Amortissement = Annuité − Intérêts = 12 000 − 2 000 = 10 000 €.' },
  { id: 'q13', chapterId: 'ch2', lessonId: 'l-interets', level: 'debutant', type: 'qcm', prompt: 'Selon le cours, le taux d’intérêt d’un emprunt peut être…', options: ['Uniquement fixe', 'Uniquement variable', 'Fixe ou variable', 'Toujours nul'], answer: 2, explanation: 'Le cours précise que le taux peut être fixe ou variable.' },
  { id: 'q14', chapterId: 'ch2', lessonId: 'l-paiement', level: 'avance', type: 'numerique', prompt: 'Capital restant dû début : 41 546,75 €. Taux : 4 %. Annuité constante : 11 445,71 €. Quel est le capital restant dû en fin de période ?', answer: 31_762.91, unit: '€', explanation: 'Intérêts = 1 661,87 ; amortissement = 11 445,71 − 1 661,87 = 9 783,84 ; CRD fin = 41 546,75 − 9 783,84 = 31 762,91 €.' },

  // Chapitre 3
  { id: 'q15', chapterId: 'ch3', lessonId: 'l-modalites', level: 'debutant', type: 'qcm', prompt: 'Le capital est amorti en une seule fois au terme de la durée de l’emprunt. C’est…', options: ['L’annuité constante', 'L’amortissement constant', 'Le remboursement in fine'], answer: 2, explanation: 'Définition du remboursement in fine.' },
  { id: 'q16', chapterId: 'ch3', lessonId: 'l-amort-constant', level: 'debutant', type: 'vrai-faux', prompt: 'En amortissement constant, l’annuité est identique chaque année.', options: VF, answer: 1, explanation: 'C’est l’amortissement qui est constant ; les intérêts baissent, donc l’annuité baisse.' },
  { id: 'q17', chapterId: 'ch3', lessonId: 'l-modalites', level: 'debutant', type: 'qcm', prompt: 'En annuité constante, qu’est-ce qui est constant ?', options: ['L’amortissement du capital', 'Les intérêts', 'Les paiements périodiques', 'Le capital restant dû'], answer: 2, explanation: 'Ce sont les paiements périodiques qui sont constants.' },
  { id: 'q18', chapterId: 'ch3', lessonId: 'l-amort-constant', level: 'debutant', type: 'numerique', prompt: 'Emprunt de 120 000 € remboursé par amortissement constant en 10 échéances. Amortissement par échéance ?', answer: 12_000, unit: '€', explanation: '120 000 / 10 = 12 000 €.' },
  { id: 'q19', chapterId: 'ch3', lessonId: 'l-in-fine', level: 'intermediaire', type: 'numerique', prompt: 'Emprunt in fine de 80 000 € à 3 % sur 4 ans (intérêts payés chaque année). Montant de la dernière annuité ?', answer: 82_400, unit: '€', explanation: 'Intérêts = 80 000 × 0,03 = 2 400 ; dernière annuité = 2 400 + 80 000 = 82 400 €.' },
  { id: 'q20', chapterId: 'ch3', lessonId: 'l-in-fine', level: 'intermediaire', type: 'vrai-faux', prompt: 'En in fine, les intérêts peuvent être payés périodiquement ou capitalisés.', options: VF, answer: 0, explanation: 'C’est ce qu’indique le cours (p. 122).' },
  { id: 'q21', chapterId: 'ch3', lessonId: 'l-amort-constant', level: 'intermediaire', type: 'numerique', prompt: 'Emprunt du cours (60 000 €, 4 %, 6 ans) en amortissement constant. Montant de l’annuité N+3 ?', answer: 11_200, unit: '€', explanation: 'CRD début N+3 = 30 000 ; intérêts = 1 200 ; annuité = 10 000 + 1 200 = 11 200 €.' },
  { id: 'q22', chapterId: 'ch3', lessonId: 'l-in-fine', level: 'intermediaire', type: 'qcm', prompt: 'En in fine, comment évolue le capital restant dû avant la dernière échéance ?', options: ['Il baisse chaque année du même montant', 'Il reste égal au capital emprunté', 'Il augmente', 'Il baisse de plus en plus vite'], answer: 1, explanation: 'Aucun capital n’est remboursé avant la fin : il reste égal au capital emprunté.' },
  { id: 'q23', chapterId: 'ch3', lessonId: 'l-annuite-constante', level: 'avance', type: 'numerique', prompt: 'Emprunt de 60 000 € à 4 % sur 6 ans, annuités constantes. Montant de l’annuité ?', answer: 11_445.71, tolerance: 0.05, unit: '€', explanation: '60 000 × 0,04 / (1 − 1,04^−6) = 2 400 / 0,209685 ≈ 11 445,71 €.' },
  { id: 'q24', chapterId: 'ch3', lessonId: 'l-annuite-constante', level: 'avance', type: 'numerique', prompt: 'Emprunt de 50 000 € à 2 % sur 4 ans, annuités constantes. Montant de l’annuité ?', answer: 13_131.19, tolerance: 0.05, unit: '€', explanation: '50 000 × 0,02 / (1 − 1,02^−4) = 1 000 / 0,076155 ≈ 13 131,19 €.' },
  { id: 'q25', chapterId: 'ch3', lessonId: 'l-annuite-constante', level: 'avance', type: 'qcm', prompt: 'Quelle est la bonne formule de l’annuité constante ?', options: ['C × i / (1 − (1 + i)^n)', 'C × i / (1 − (1 + i)^−n)', 'C / n', 'C × (1 + i)^−n'], answer: 1, explanation: 'Annuité = Capital × i / (1 − (1 + i)^−n). Attention au signe moins de l’exposant.' },
  { id: 'q26', chapterId: 'ch3', lessonId: 'l-annuite-constante', level: 'intermediaire', type: 'qcm', prompt: 'En annuité constante, l’amortissement du capital…', options: ['Augmente chaque année', 'Diminue chaque année', 'Reste identique', 'Est nul jusqu’à la fin'], answer: 0, explanation: 'L’annuité est fixe et les intérêts baissent, donc l’amortissement augmente (9 045,71 → 11 005,52 dans le cours).' },
  { id: 'q27', chapterId: 'ch3', lessonId: 'l-amort-constant', level: 'avance', type: 'numerique', prompt: 'Emprunt de 30 000 € à 6 % sur 3 ans, amortissement constant. Total des intérêts ?', answer: 3600, unit: '€', explanation: 'Intérêts : 30 000 × 6 % = 1 800 ; 20 000 × 6 % = 1 200 ; 10 000 × 6 % = 600 → 3 600 €.' },
  { id: 'q28', chapterId: 'ch3', lessonId: 'l-comparaison', level: 'intermediaire', type: 'qcm', prompt: 'Pour l’emprunt du cours, quel est le classement du coût total (du plus cher au moins cher) ?', options: ['Amortissement constant > annuité constante > in fine', 'In fine > annuité constante > amortissement constant', 'Annuité constante > in fine > amortissement constant', 'Les trois coûtent la même chose'], answer: 1, explanation: 'In fine 14 400 € > annuité constante 8 674,29 € > amortissement constant 8 400 €.' },
  { id: 'q29', chapterId: 'ch3', lessonId: 'l-annuite-constante', level: 'avance', type: 'vrai-faux', prompt: 'Dans le tableau en annuité constante du cours, 440,22 + 11 005,52 donne exactement 11 445,71.', options: VF, answer: 1, explanation: 'La somme fait 11 445,74 €. L’écart de 0,03 € vient des arrondis au centime ; il est absorbé par la dernière échéance.' },
  { id: 'q30', chapterId: 'ch3', lessonId: 'l-comparaison', level: 'avance', type: 'numerique', prompt: 'Emprunt du cours en annuité constante : total des intérêts payés sur 6 ans ?', answer: 8674.29, unit: '€', explanation: '2 400 + 2 038,17 + 1 661,87 + 1 270,52 + 863,51 + 440,22 = 8 674,29 €.' },
  { id: 'q31', chapterId: 'ch3', lessonId: 'l-comparaison', level: 'intermediaire', type: 'qcm', prompt: 'Pour l’emprunt du cours, quelle modalité a la première annuité la plus élevée ?', options: ['In fine', 'Amortissement constant', 'Annuité constante'], answer: 1, explanation: 'Amortissement constant : 12 400 € ; annuité constante : 11 445,71 € ; in fine : 2 400 €.' },
  { id: 'q32', chapterId: 'ch3', lessonId: 'l-comparaison', level: 'intermediaire', type: 'numerique', prompt: 'Emprunt du cours en amortissement constant : total remboursé (capital + intérêts) ?', answer: 68_400, unit: '€', explanation: '60 000 + 8 400 = 68 400 €.' },

  // Chapitre 4
  { id: 'q33', chapterId: 'ch4', lessonId: 'l-souscription', level: 'debutant', type: 'qcm', prompt: 'À la souscription, le capital emprunté est enregistré…', options: ['Au débit du 164', 'Au crédit du 164', 'Au débit du 661', 'Au crédit du 512'], answer: 1, explanation: 'Crédit du 164 (la dette) par le débit du 512 (la banque).' },
  { id: 'q34', chapterId: 'ch4', lessonId: 'l-souscription', level: 'debutant', type: 'vrai-faux', prompt: 'La souscription d’un emprunt est une opération financière : il n’y a pas de TVA.', options: VF, answer: 0, explanation: 'Le cours le souligne : pas de TVA.' },
  { id: 'q35', chapterId: 'ch4', lessonId: 'l-ecriture-paiement', level: 'debutant', type: 'qcm', prompt: 'Lors du paiement d’une annuité, quel compte est crédité ?', options: ['164', '661', '512'], answer: 2, explanation: 'L’argent sort de la banque : crédit du 512.' },
  { id: 'q36', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'intermediaire', type: 'qcm', prompt: 'Emprunt in fine, paiement de la première annuité. Quels comptes sont mouvementés ?', options: ['164 et 512', '661 et 512', '164, 661 et 512', '164 et 661'], answer: 1, explanation: 'L’amortissement est nul : seuls les intérêts sont payés (débit 661 / crédit 512).' },
  { id: 'q37', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'intermediaire', type: 'numerique', prompt: 'Emprunt du cours en amortissement constant. Montant porté au débit du 661 pour l’annuité N+2 ?', answer: 1600, unit: '€', explanation: 'Ligne N+2 : intérêts = 40 000 × 4 % = 1 600 €.' },
  { id: 'q38', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'intermediaire', type: 'numerique', prompt: 'Emprunt du cours en annuité constante. Montant porté au débit du 164 pour l’annuité N+4 ?', answer: 10_582.2, unit: '€', explanation: 'Ligne N+4 du tableau p. 125 : amortissement = 10 582,20 €.' },
  { id: 'q39', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'avance', type: 'qcm', prompt: 'Emprunt in fine du cours (60 000 €, 4 %). Quelle est l’écriture de la dernière annuité ?', options: ['Débit 661 : 62 400 / Crédit 512 : 62 400', 'Débit 164 : 60 000 ; Débit 661 : 2 400 / Crédit 512 : 62 400', 'Débit 512 : 62 400 / Crédit 164 : 62 400', 'Débit 164 : 62 400 / Crédit 512 : 62 400'], answer: 1, explanation: 'Amortissement 60 000 au débit du 164, intérêts 2 400 au débit du 661, annuité 62 400 au crédit du 512.' },
  { id: 'q40', chapterId: 'ch4', lessonId: 'l-souscription', level: 'intermediaire', type: 'vrai-faux', prompt: 'À la souscription, le compte 512 – Banque est crédité.', options: VF, answer: 1, explanation: 'Le 512 est débité : l’argent arrive sur le compte.' },
  { id: 'q41', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'avance', type: 'numerique', prompt: 'Emprunt in fine du cours : total des montants débités au 661 sur les 6 ans ?', answer: 14_400, unit: '€', explanation: '6 × 2 400 = 14 400 € de charges d’intérêts.' },
  { id: 'q42', chapterId: 'ch4', lessonId: 'l-souscription', level: 'intermediaire', type: 'qcm', prompt: 'Quel est l’intitulé du compte 164 ?', options: ['Charges d’intérêts', 'Emprunts auprès des établissements de crédit', 'Banque', 'Capital'], answer: 1, explanation: '164 – Emprunts auprès des établissements de crédit.' },
  { id: 'q43', chapterId: 'ch4', lessonId: 'l-souscription', level: 'debutant', type: 'numerique', prompt: 'Une société emprunte 75 000 €. Quel montant est porté au crédit du 164 à la souscription ?', answer: 75_000, unit: '€', explanation: 'Le capital emprunté : 75 000 €.' },
  { id: 'q44', chapterId: 'ch4', lessonId: 'l-application-compta', level: 'avance', type: 'qcm', prompt: 'Emprunt du cours en annuité constante. Quelle est l’écriture de la première annuité ?', options: ['Débit 164 : 11 445,71 / Crédit 512 : 11 445,71', 'Débit 164 : 9 045,71 ; Débit 661 : 2 400 / Crédit 512 : 11 445,71', 'Débit 164 : 10 000 ; Débit 661 : 2 400 / Crédit 512 : 12 400', 'Débit 661 : 11 445,71 / Crédit 512 : 11 445,71'], answer: 1, explanation: 'Ligne N : amortissement 9 045,71 (164), intérêts 2 400 (661), annuité 11 445,71 (512).' },
]

export const quizSeries: QuizSeries[] = [
  {
    id: 'qs-bases',
    title: 'Les bases de l’emprunt',
    description: 'Sources de financement, définition, intérêts et paiement périodique.',
    level: 'debutant',
    chapterIds: ['ch1', 'ch2'],
    questionIds: ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08', 'q10', 'q11', 'q13'],
    timeLimitSec: 6 * 60,
  },
  {
    id: 'qs-modalites',
    title: 'Les modalités de remboursement',
    description: 'In fine, amortissement constant, annuité constante et comparaison.',
    level: 'intermediaire',
    chapterIds: ['ch3'],
    questionIds: ['q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q26', 'q28', 'q31', 'q32'],
    timeLimitSec: 10 * 60,
  },
  {
    id: 'qs-compta',
    title: 'La comptabilisation',
    description: 'Souscription, paiement périodique et écritures à partir du tableau.',
    level: 'intermediaire',
    chapterIds: ['ch4'],
    questionIds: ['q33', 'q34', 'q35', 'q36', 'q37', 'q38', 'q39', 'q40', 'q41', 'q42', 'q43', 'q44'],
    timeLimitSec: 8 * 60,
  },
  {
    id: 'qs-defi',
    title: 'Défi final',
    description: 'Les questions les plus exigeantes de tout le cours, calculs à l’appui.',
    level: 'avance',
    chapterIds: ['ch2', 'ch3', 'ch4'],
    questionIds: ['q09', 'q12', 'q14', 'q23', 'q24', 'q25', 'q27', 'q29', 'q30', 'q38', 'q39', 'q41', 'q44'],
    timeLimitSec: 15 * 60,
  },
]

export function getQuizSeries(id: string): QuizSeries | undefined {
  return quizSeries.find((q) => q.id === id)
}

export function getQuizQuestion(id: string): QuizQuestion | undefined {
  return quizQuestions.find((q) => q.id === id)
}
