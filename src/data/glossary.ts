import type { GlossaryEntry } from '@/types'

/** Vocabulaire du support de cours, par ordre alphabétique. */
export const glossary: GlossaryEntry[] = [
  { term: 'Amortissement constant', definition: 'Modalité de remboursement où le capital est amorti périodiquement, par parts égales : Capital emprunté / nombre d’échéances.', lessonId: 'l-amort-constant' },
  { term: 'Amortissement du capital', definition: 'Part d’un paiement qui rembourse le capital (le cours écrit « amortissement du capital (remboursement) »). Elle seule fait baisser le capital restant dû.', lessonId: 'l-paiement' },
  { term: 'Annuité', definition: 'Paiement périodique lorsque les échéances sont annuelles. Annuité = Amortissement + Intérêts.', lessonId: 'l-paiement' },
  { term: 'Annuité constante', definition: 'Modalité de remboursement où les paiements périodiques sont constants ; le capital est amorti périodiquement mais pas à parts égales.', lessonId: 'l-annuite-constante' },
  { term: 'Autofinancement', definition: 'Financement de l’entreprise par ses propres ressources, placé à part des financements externes dans le schéma du cours.', lessonId: 'l-financements' },
  { term: 'Capital', definition: 'Somme d’argent mise à la disposition de l’emprunteur.', lessonId: 'l-definition' },
  { term: 'Capital restant dû', definition: 'Partie du capital qui n’a pas encore été remboursée. Les intérêts se calculent dessus.', lessonId: 'l-interets' },
  { term: 'Capitaux propres', definition: 'Financement externe apporté par les actionnaires.', lessonId: 'l-financements' },
  { term: 'Compte 164', definition: 'Emprunts auprès des établissements de crédit. Crédité à la souscription, débité de l’amortissement à chaque paiement.', lessonId: 'l-souscription' },
  { term: 'Compte 512', definition: 'Banque. Débité à la souscription (l’argent arrive), crédité de l’annuité à chaque paiement.', lessonId: 'l-souscription' },
  { term: 'Compte 661', definition: 'Charges d’intérêts. Débité du montant des intérêts à chaque paiement.', lessonId: 'l-ecriture-paiement' },
  { term: 'Crédit-bail', definition: 'Forme de financement bancaire citée dans le schéma du cours, à côté des emprunts.', lessonId: 'l-financements' },
  { term: 'Emprunt', definition: 'Somme d’argent (capital) mise à la disposition d’un emprunteur par un établissement financier (prêteur). L’emprunteur la rembourse avec intérêts, sur une durée d’un an à plus de vingt ans.', lessonId: 'l-definition' },
  { term: 'Emprunteur', definition: 'Celui qui reçoit le capital et s’engage à le rembourser avec intérêts.', lessonId: 'l-definition' },
  { term: 'Financements bancaires', definition: 'Financements externes apportés par les banques : crédit-bail et emprunts.', lessonId: 'l-financements' },
  { term: 'In fine', definition: 'Modalité de remboursement où le capital est amorti en une seule fois au terme de la durée. Les intérêts peuvent être payés périodiquement ou capitalisés.', lessonId: 'l-in-fine' },
  { term: 'Intérêts périodiques', definition: 'Capital restant dû × Taux d’intérêt.', lessonId: 'l-interets' },
  { term: 'Prêteur', definition: 'Établissement financier qui met le capital à disposition de l’emprunteur.', lessonId: 'l-definition' },
  { term: 'Subventions et aides publiques', definition: 'Financement externe apporté par les organisations publiques.', lessonId: 'l-financements' },
  { term: 'Tableau d’amortissement', definition: 'Tableau qui détaille, pour chaque échéance : capital restant dû début, intérêts, amortissement, annuité, capital restant dû fin.', lessonId: 'l-in-fine' },
  { term: 'Taux fixe / variable', definition: 'Le taux d’intérêt peut rester identique (fixe) ou évoluer (variable) pendant la durée de l’emprunt.', lessonId: 'l-interets' },
]
