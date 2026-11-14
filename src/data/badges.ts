import type { BadgeDef } from '@/types'

/** Les conditions de déblocage sont évaluées dans src/services/gamification.ts. */
export const badges: BadgeDef[] = [
  { id: 'premier-pas', title: 'Premier pas', description: 'Terminer ta première leçon.', icon: 'Footprints', tone: 'teal' },
  { id: 'explorateur', title: 'Explorateur', description: 'Terminer ton premier chapitre.', icon: 'Compass', tone: 'indigo' },
  { id: 'calculateur', title: 'Calculateur', description: 'Réussir 10 exercices.', icon: 'Calculator', tone: 'amber' },
  { id: 'challenger', title: 'Challenger', description: 'Terminer ton premier quiz.', icon: 'Swords', tone: 'rose' },
  { id: 'expert', title: 'Expert', description: 'Obtenir au moins 90 % au quiz avancé « Défi final : les emprunts ».', icon: 'Crown', tone: 'amber' },
  { id: 'sans-faute', title: 'Sans faute', description: 'Obtenir 100 % à un quiz.', icon: 'Target', tone: 'violet' },
  { id: 'serie-5', title: 'En série', description: 'Enchaîner 5 bonnes réponses d’affilée.', icon: 'Flame', tone: 'rose' },
  { id: 'comptable', title: 'Comptable', description: 'Réussir tous les exercices de comptabilisation des emprunts (Titre 4).', icon: 'BookOpenCheck', tone: 'teal' },
  { id: 'titre-boucle', title: 'Titre bouclé', description: 'Terminer toutes les leçons d’un Titre.', icon: 'Award', tone: 'indigo' },
  { id: 'polyvalent', title: 'Polyvalent', description: 'Réussir au moins un exercice dans chacun des quatre Titres.', icon: 'Sparkles', tone: 'violet' },
  { id: 'simulateur', title: 'Analyste', description: 'Comparer des scénarios d’emprunt dans le labo.', icon: 'ChartLine', tone: 'indigo' },
  { id: 'assidu', title: 'Assidu', description: 'Étudier 3 jours d’affilée.', icon: 'CalendarCheck', tone: 'violet' },
  { id: 'diplome', title: 'Cours bouclé', description: 'Terminer toutes les leçons du cours.', icon: 'GraduationCap', tone: 'amber' },
]
