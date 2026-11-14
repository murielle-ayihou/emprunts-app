<script setup lang="ts">
import type { TAccountData } from '@/types'
import { formatAmount } from '@/utils/format'
const props = defineProps<{ account: TAccountData }>()
const td = props.account.debits.reduce((s, x) => s + x.amount, 0)
const tc = props.account.credits.reduce((s, x) => s + x.amount, 0)
const rows = Math.max(props.account.debits.length, props.account.credits.length)
</script>

<template>
  <figure class="mx-auto max-w-lg rounded-[20px] border border-line bg-surface p-5" :aria-label="`Compte ${account.title}`">
    <p class="text-center font-display text-lg font-semibold">{{ account.title }}</p>
    <div class="mt-2 grid grid-cols-2 border-t-2 border-ink">
      <div class="border-r-2 border-ink pr-3 pt-1">
        <p class="text-xs text-muted">Débit</p>
        <p v-for="i in rows" :key="'d' + i" class="num flex justify-between py-0.5 text-sm"><span class="text-muted">{{ account.debits[i - 1]?.label }}</span><span>{{ account.debits[i - 1] ? formatAmount(account.debits[i - 1].amount) : '' }}</span></p>
        <p class="num mt-1 flex justify-between border-t border-line pt-1 text-sm font-semibold"><span>Total</span><span>{{ td ? formatAmount(td) : '–' }}</span></p>
      </div>
      <div class="pl-3 pt-1">
        <p class="text-right text-xs text-muted">Crédit</p>
        <p v-for="i in rows" :key="'c' + i" class="num flex justify-between py-0.5 text-sm"><span>{{ account.credits[i - 1] ? formatAmount(account.credits[i - 1].amount) : '' }}</span><span class="text-muted">{{ account.credits[i - 1]?.label }}</span></p>
        <p class="num mt-1 flex justify-between border-t border-line pt-1 text-sm font-semibold"><span>{{ tc ? formatAmount(tc) : '–' }}</span><span>Total</span></p>
      </div>
    </div>
    <figcaption v-if="account.caption" class="mt-3 text-center text-sm font-semibold text-capital">{{ account.caption }}</figcaption>
  </figure>
</template>
