import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView, meta: { title: 'Tableau de bord' } },
    { path: '/cours', name: 'course', component: () => import('@/views/CourseView.vue'), meta: { title: 'Cours' } },
    { path: '/cours/:lessonId', name: 'lesson', component: () => import('@/views/LessonView.vue'), props: true, meta: { title: 'Leçon' } },
    { path: '/exercices', name: 'exercises', component: () => import('@/views/ExercisesView.vue'), meta: { title: 'Exercices' } },
    { path: '/quiz', name: 'quizzes', component: () => import('@/views/QuizListView.vue'), meta: { title: 'Quiz' } },
    { path: '/quiz/:quizId', name: 'quiz', component: () => import('@/views/QuizView.vue'), props: true, meta: { title: 'Quiz' } },
    { path: '/quiz/:quizId/resultats/:attemptId', name: 'results', component: () => import('@/views/ResultsView.vue'), props: true, meta: { title: 'Résultats' } },
    { path: '/simulateur', name: 'simulator', component: () => import('@/views/SimulatorView.vue'), meta: { title: 'Simulateurs' } },
    { path: '/revision', name: 'flashcards', component: () => import('@/views/FlashcardsView.vue'), meta: { title: 'Révision flash' } },
    { path: '/memo', name: 'memo', component: () => import('@/views/MemoView.vue'), meta: { title: 'Mémo' } },
    { path: '/reglages', name: 'settings', component: () => import('@/views/SettingsView.vue'), meta: { title: 'Réglages' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Page introuvable' } },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 90, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t ? `${t} | Cursus` : 'Cursus'
})
