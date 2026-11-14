import type { Chapter, Part, Subject } from '@/types'
import { chapters as t1 } from './compta/t1/content'
import { chapters as t2 } from './compta/t2/content'
import { chapters as t3 } from './compta/t3/content'
import { chapters as t4 } from './compta/t4/chapters'

/**
 * Catalogue : matières → Titres (parties) → chapitres → leçons.
 * Pour ajouter une matière : créer src/data/<matiere>/…, puis l'ajouter à `subjects` et `parts`.
 */
export const subjects: Subject[] = [
  { id: 'compta-fi', title: 'Comptabilité financière', short: 'Compta. fi.', level: 'L3 MIAGE · Université de Rennes', partIds: ['t1', 't2', 't3', 't4'] },
]

export const parts: Part[] = [
  {
    id: 't1',
    subjectId: 'compta-fi',
    number: 1,
    title: 'Introduction à la comptabilité',
    subtitle: 'Rôles, règles, partie double et documents de synthèse',
    chapterIds: t1.map((c) => c.id),
    sources: ['PPT CM Titre 1 (diapositives 4 à 36)', 'Titre 1 – Correction exercices'],
    sourceNote: 'Les énoncés des exercices du Titre 1 ne sont pas fournis : ils sont reconstitués à partir de la correction.',
  },
  {
    id: 't2',
    subjectId: 'compta-fi',
    number: 2,
    title: 'Les opérations courantes d’exploitation',
    subtitle: 'TVA, achats et ventes, règlements, personnel',
    chapterIds: t2.map((c) => c.id),
    sources: ['PPT CM Titre 2 – TVA (diapositives 38 à 51)', 'PPT CM Titre 2 – Opérations relatives au personnel (diapositives 84 à 91)', 'TD n°1 et sa correction', 'Titre 2 – Correction exercice 6'],
    sourceNote: 'Les diapositives 52 à 83 (achats et ventes de biens et services, crédits et règlements) ne sont pas fournies : le chapitre « Achats, ventes et règlements » s’appuie uniquement sur le TD n°1 et sa correction.',
  },
  {
    id: 't3',
    subjectId: 'compta-fi',
    number: 3,
    title: 'Les immobilisations',
    subtitle: 'Acquisition, amortissement, dépréciation et sortie',
    chapterIds: t3.map((c) => c.id),
    sources: ['PPT CM Titre 3 (diapositives 93 à 118)', 'TD n°4 et sa correction'],
  },
  {
    id: 't4',
    subjectId: 'compta-fi',
    number: 4,
    title: 'Les emprunts bancaires',
    subtitle: 'Intérêts, modalités de remboursement et comptabilisation',
    chapterIds: t4.map((c) => c.id),
    sources: ['PPT CM Titre 4 (diapositives 120 à 127)', 'Titre 4 – Correction exercices', 'TD n°5 et sa correction'],
  },
]

export const chapters: Chapter[] = [...t1, ...t2, ...t3, ...t4]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getPart(id: string): Part | undefined {
  return parts.find((p) => p.id === id)
}

export function partOfChapter(chapterId: string): Part | undefined {
  const ch = getChapter(chapterId)
  return ch ? getPart(ch.partId) : undefined
}

/** « Titre 4, chapitre 2 » */
export function chapterLabel(chapterId: string): string {
  const ch = getChapter(chapterId)
  const part = ch ? getPart(ch.partId) : undefined
  return ch && part ? `Titre ${part.number}, chapitre ${ch.number}` : ''
}
