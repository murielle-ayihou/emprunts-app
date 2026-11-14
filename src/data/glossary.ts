import type { GlossaryEntry } from '@/types'
import { glossary as t1 } from './compta/t1/content'
import { glossary as t2 } from './compta/t2/content'
import { glossary as t3 } from './compta/t3/content'
import { glossary as t4 } from './compta/t4/glossary'

export const glossary: GlossaryEntry[] = [...t1, ...t2, ...t3, ...t4]
