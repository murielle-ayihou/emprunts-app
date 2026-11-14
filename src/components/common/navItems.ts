import { LayoutDashboard, BookOpen, PencilLine, ListChecks, FlaskConical, Layers, Sigma, Settings } from 'lucide-vue-next'

export const navItems = [
  { to: '/', label: 'Tableau de bord', short: 'Accueil', icon: LayoutDashboard, match: (p: string) => p === '/', mobile: true },
  { to: '/cours', label: 'Cours', short: 'Cours', icon: BookOpen, match: (p: string) => p.startsWith('/cours'), mobile: true },
  { to: '/exercices', label: 'Exercices', short: 'Exercices', icon: PencilLine, match: (p: string) => p.startsWith('/exercices'), mobile: true },
  { to: '/quiz', label: 'Quiz', short: 'Quiz', icon: ListChecks, match: (p: string) => p.startsWith('/quiz'), mobile: true },
  { to: '/simulateur', label: 'Le labo', short: 'Labo', icon: FlaskConical, match: (p: string) => p.startsWith('/simulateur'), mobile: true },
  { to: '/revision', label: 'Révision flash', short: 'Fiches', icon: Layers, match: (p: string) => p.startsWith('/revision'), mobile: false },
  { to: '/memo', label: 'Mémo formules', short: 'Mémo', icon: Sigma, match: (p: string) => p.startsWith('/memo'), mobile: false },
  { to: '/reglages', label: 'Réglages', short: 'Réglages', icon: Settings, match: (p: string) => p.startsWith('/reglages'), mobile: false },
]
