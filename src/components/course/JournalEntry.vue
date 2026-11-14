<script setup lang="ts">
import type { JournalEntry } from '@/types'
import { formatAmount } from '@/utils/format'

/** Écriture au journal, présentée comme dans le cours : comptes débit / crédit, libellés, montants. */
const props = defineProps<{ entry: JournalEntry; title?: string }>()
const totalDebit = props.entry.lines.reduce((s, l) => s + (l.debit ?? 0), 0)
const totalCredit = props.entry.lines.reduce((s, l) => s + (l.credit ?? 0), 0)
</script>

<template>
  <figure class="overflow-hidden rounded-2xl border border-line bg-surface">
    <figcaption v-if="title" class="border-b border-line px-4 py-2.5 text-sm font-semibold">{{ title }}</figcaption>
    <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Écriture au journal">
      <table class="w-full min-w-[540px] border-collapse text-sm">
        <thead>
          <tr class="text-left text-xs text-muted">
            <th scope="col" class="w-[4.5rem] px-3 pb-1 pt-3 font-semibold">Débit</th>
            <th scope="col" class="w-[4.5rem] px-3 pb-1 pt-3 font-semibold">Crédit</th>
            <th scope="col" class="px-3 pb-1 pt-3 font-semibold">Libellé</th>
            <th scope="col" class="w-28 px-3 pb-1 pt-3 text-right font-semibold">Débit (€)</th>
            <th scope="col" class="w-28 px-3 pb-1 pt-3 text-right font-semibold">Crédit (€)</th>
          </tr>
        </thead>
        <tbody class="journal">
          <tr>
            <td colspan="5" class="px-3 pb-1 pt-2 text-center text-xs text-muted">{{ entry.date }}</td>
          </tr>
          <tr v-for="(l, i) in entry.lines" :key="i">
            <td class="num whitespace-nowrap px-3 py-1.5 font-bold text-ink">{{ l.debitAccount }}</td>
            <td class="num whitespace-nowrap px-3 py-1.5 font-bold text-ink">{{ l.creditAccount }}</td>
            <td class="px-3 py-1.5" :class="l.creditAccount ? 'pl-12 text-ink-soft' : 'text-ink'">{{ l.label }}</td>
            <td class="num whitespace-nowrap px-3 py-1.5 text-right" :class="l.debitAccount === '661' ? 'text-interest font-semibold' : l.debitAccount === '164' ? 'text-capital font-semibold' : 'text-ink'">{{ l.debit !== undefined ? formatAmount(l.debit) : '' }}</td>
            <td class="num whitespace-nowrap px-3 py-1.5 text-right text-ink">{{ l.credit !== undefined ? formatAmount(l.credit) : '' }}</td>
          </tr>
          <tr>
            <td colspan="5" class="px-3 pb-3 pt-1 text-sm italic text-muted">{{ entry.description }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t border-dashed border-line text-xs text-muted">
            <td colspan="3" class="px-3 py-2">Équilibre de l'écriture</td>
            <td class="num px-3 py-2 text-right font-semibold">{{ formatAmount(totalDebit) }}</td>
            <td class="num px-3 py-2 text-right font-semibold">{{ formatAmount(totalCredit) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </figure>
</template>

<style scoped>
/* Lignes de journal : réglure discrète comme sur un registre */
.journal tr:not(:first-child):not(:last-child) td {
  background-image: linear-gradient(to bottom, transparent calc(100% - 1px), color-mix(in oklab, var(--line) 60%, transparent) calc(100% - 1px));
}
</style>
