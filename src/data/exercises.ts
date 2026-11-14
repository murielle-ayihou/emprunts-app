import type { Exercise } from '@/types'
import { exercises as t1 } from './compta/t1/content'
import { exercises as t2 } from './compta/t2/content'
import { exercises as t3 } from './compta/t3/content'
import { exercises as t4 } from './compta/t4/exercises'

export const exercises: Exercise[] = [...t1, ...t2, ...t3, ...t4]

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((x) => x.id === id)
}
