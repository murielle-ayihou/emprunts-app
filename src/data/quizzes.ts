import type { QuizQuestion, QuizSeries } from '@/types'
import { quizQuestions as q1, quizSeries as s1 } from './compta/t1/content'
import { quizQuestions as q2, quizSeries as s2 } from './compta/t2/content'
import { quizQuestions as q3, quizSeries as s3 } from './compta/t3/content'
import { quizQuestions as q4, quizSeries as s4 } from './compta/t4/quizzes'

export const quizQuestions: QuizQuestion[] = [...q1, ...q2, ...q3, ...q4]
export const quizSeries: QuizSeries[] = [...s1, ...s2, ...s3, ...s4]

export function getQuizSeries(id: string): QuizSeries | undefined {
  return quizSeries.find((q) => q.id === id)
}

export function getQuizQuestion(id: string): QuizQuestion | undefined {
  return quizQuestions.find((q) => q.id === id)
}
