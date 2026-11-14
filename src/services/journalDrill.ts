import { ACCOUNTS, CONFUSERS, FILLER, accountLabel, formatAccount } from '@/data/journal/accounts'
import type { DrillAmountQuestion, DrillCase, DrillSeries } from '@/data/journal/types'
import type { JournalEntry } from '@/types'
import { shuffle } from '@/utils/answers'

export interface PreparedAmountQ {
  label: string
  answer: number
  options: number[]
}

export interface PreparedCase {
  key: string
  seriesId: string
  company: string
  case: DrillCase
  debitOptions: string[]
  creditOptions: string[]
  amountQs: PreparedAmountQ[]
  entry: JournalEntry
}

export interface CaseAnswer {
  debit: string[]
  credit: string[]
  amounts: (number | null)[]
}

export interface CaseGrade {
  debit: boolean
  credit: boolean
  amounts: boolean[]
  points: number
  total: number
}

const round2 = (x: number) => Math.round(x * 100) / 100
const TIERS = ['401', '411']
const TVA_ACCOUNTS = ['44566', '44571']

export function correctAccounts(c: DrillCase, side: 'D' | 'C'): string[] {
  return [...new Set(c.lines.filter((l) => l[0] === side).map((l) => l[1]))]
}

/** Questions de montant par défaut, comme dans l'épreuve : compte de tiers, compte de TVA, total au crédit. */
export function defaultAmountQuestions(c: DrillCase): DrillAmountQuestion[] {
  const qs: DrillAmountQuestion[] = []
  const tiers = c.lines.find((l) => TIERS.includes(l[1]))
  if (tiers) qs.push({ label: 'Montant comptabilisé dans le compte de tiers (clients ou fournisseurs)', answer: tiers[2] })
  const tvaLines = c.lines.filter((l) => TVA_ACCOUNTS.includes(l[1]))
  if (tvaLines.length === 1) qs.push({ label: 'Montant comptabilisé dans le compte de TVA', answer: tvaLines[0][2] })
  if (qs.length < 2) {
    const credit = round2(c.lines.filter((l) => l[0] === 'C').reduce((s, l) => s + l[2], 0))
    qs.push({ label: 'Somme des montants comptabilisés au crédit de l’écriture', answer: credit })
  }
  return qs.slice(0, 2)
}

/** Fabrique 6 montants proposés : la bonne réponse, les pièges, les autres montants de l'écriture, puis des confusions HT/TVA/TTC. */
export function amountOptions(q: DrillAmountQuestion, c: DrillCase, rand: () => number = Math.random): number[] {
  if (q.options) return shuffle(q.options, rand)
  const v = q.answer
  const seen = new Set<number>([v])
  const picks: number[] = []
  const push = (x: number) => {
    const r = round2(x)
    if (r > 0 && !seen.has(r) && picks.length < 5) {
      seen.add(r)
      picks.push(r)
    }
  }
  for (const t of [...(q.traps ?? []), ...(c.traps ?? [])]) push(t)
  for (const l of c.lines) push(l[2])
  for (const x of [v * 1.2, v / 1.2, v * 0.2, v / 6, v * 0.8, v + 100, v - 100, v * 2]) push(x)
  return shuffle([v, ...picks], rand)
}

/** Comptes proposés : les comptes de l'écriture, leurs « faux amis », puis des comptes courants (9 au total). */
export function accountOptions(c: DrillCase, rand: () => number = Math.random): string[] {
  if (c.accountOptions) return [...c.accountOptions]
  const used = [...new Set(c.lines.map((l) => l[1]))]
  const set = new Set(used)
  const target = used.length <= 2 && used.every((a) => ['401', '411', '512', '5112', '627', '44551'].includes(a)) ? 5 : 9
  for (const a of shuffle(used.flatMap((u) => CONFUSERS[u] ?? []), rand)) if (set.size < target && ACCOUNTS[a]) set.add(a)
  for (const a of shuffle(FILLER, rand)) if (set.size < target) set.add(a)
  return [...set]
}

export function toJournalEntry(c: DrillCase): JournalEntry {
  const lines = [...c.lines]
    .sort((a, b) => (a[0] === b[0] ? 0 : a[0] === 'D' ? -1 : 1))
    .map(([side, acc, amt]) =>
      side === 'D'
        ? { debitAccount: formatAccount(acc), label: accountLabel(acc), debit: amt }
        : { creditAccount: formatAccount(acc), label: accountLabel(acc), credit: amt },
    )
  return { date: c.date, lines, description: c.label }
}

export function prepareCase(series: DrillSeries, c: DrillCase, rand: () => number = Math.random): PreparedCase {
  const opts = accountOptions(c, rand)
  const qs = c.amountQs ?? defaultAmountQuestions(c)
  return {
    key: `${series.id}:${c.id}`,
    seriesId: series.id,
    company: series.company,
    case: c,
    debitOptions: shuffle(opts, rand),
    creditOptions: shuffle(opts, rand),
    amountQs: qs.map((q) => ({ label: q.label, answer: q.answer, options: amountOptions(q, c, rand) })),
    entry: toJournalEntry(c),
  }
}

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && a.every((x) => b.includes(x))
}

export function gradeCase(p: PreparedCase, a: CaseAnswer): CaseGrade {
  const debit = sameSet(a.debit, correctAccounts(p.case, 'D'))
  const credit = sameSet(a.credit, correctAccounts(p.case, 'C'))
  const amounts = p.amountQs.map((q, i) => a.amounts[i] !== null && a.amounts[i] !== undefined && round2(a.amounts[i] as number) === round2(q.answer))
  const points = [debit, credit, ...amounts].filter(Boolean).length
  return { debit, credit, amounts, points, total: 2 + amounts.length }
}

/* ─── Sauvegarde locale (séparée de la progression générale) ─── */
const KEY = 'cursus:journal'

export interface DrillAttempt {
  seriesId: string
  title: string
  mode: 'train' | 'exam'
  date: string
  points: number
  total: number
}

export interface DrillStore {
  best: Record<string, number>
  history: DrillAttempt[]
  showLabels: boolean
}

export function loadDrillStore(): DrillStore {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s && typeof s === 'object') return { best: s.best ?? {}, history: Array.isArray(s.history) ? s.history : [], showLabels: s.showLabels ?? true }
    }
  } catch {
    /* stockage indisponible */
  }
  return { best: {}, history: [], showLabels: true }
}

export function saveDrillStore(s: DrillStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* stockage indisponible */
  }
}

export function recordDrillAttempt(at: DrillAttempt): DrillStore {
  const s = loadDrillStore()
  const ratio = at.total ? at.points / at.total : 0
  if (s.best[at.seriesId] === undefined || ratio > s.best[at.seriesId]) s.best[at.seriesId] = ratio
  s.history.unshift(at)
  s.history = s.history.slice(0, 30)
  saveDrillStore(s)
  return s
}
