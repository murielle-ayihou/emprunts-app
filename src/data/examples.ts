import type { Example } from '@/types'
import { examples as t1 } from './compta/t1/content'
import { examples as t2 } from './compta/t2/content'
import { examples as t3 } from './compta/t3/content'
import { examples as t4 } from './compta/t4/examples'

export const examples: Example[] = [...t1, ...t2, ...t3, ...t4]

export function getExample(id: string): Example | undefined {
  return examples.find((x) => x.id === id)
}
