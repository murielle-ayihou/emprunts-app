import type { Lesson } from '@/types'
import { lessons as t1 } from './compta/t1/content'
import { lessons as t2 } from './compta/t2/content'
import { lessons as t3 } from './compta/t3/content'
import { lessons as t4 } from './compta/t4/lessons'

export const lessons: Lesson[] = [...t1, ...t2, ...t3, ...t4]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function lessonsOfChapter(chapterId: string): Lesson[] {
  return lessons.filter((l) => l.chapterId === chapterId)
}
