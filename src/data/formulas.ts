import type { Formula } from '@/types'
import { formulas as t1 } from './compta/t1/content'
import { formulas as t2 } from './compta/t2/content'
import { formulas as t3 } from './compta/t3/content'
import { formulas as t4 } from './compta/t4/formulas'

export const formulas: Formula[] = [...t1, ...t2, ...t3, ...t4]

export function getFormula(id: string): Formula | undefined {
  return formulas.find((x) => x.id === id)
}
