<script setup lang="ts">
import { computed } from 'vue'
import { formatAmount } from '@/utils/format'

/** Barre « annuité » : la part de capital (sarcelle) et la part d'intérêts (corail). */
const props = withDefaults(defineProps<{ principal: number; interest: number; showLabels?: boolean; height?: number; max?: number }>(), {
  showLabels: true,
  height: 14,
})
const total = computed(() => props.principal + props.interest)
const scale = computed(() => (props.max ? total.value / props.max : 1))
const pPct = computed(() => (total.value ? (props.principal / total.value) * 100 : 0))
</script>

<template>
  <div>
    <div
      class="flex overflow-hidden rounded-full bg-surface-2"
      :style="{ height: height + 'px', width: scale * 100 + '%', transition: 'width 500ms ease' }"
      role="img"
      :aria-label="`Paiement de ${formatAmount(total)} € : ${formatAmount(principal)} € de capital et ${formatAmount(interest)} € d'intérêts`"
    >
      <div class="h-full bg-capital" :style="{ width: pPct + '%', transition: 'width 500ms ease' }" />
      <div class="h-full bg-interest" :style="{ width: 100 - pPct + '%', transition: 'width 500ms ease' }" />
    </div>
    <div v-if="showLabels" class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-capital" />Amortissement <strong class="num text-ink">{{ formatAmount(principal) }} €</strong></span>
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-interest" />Intérêts <strong class="num text-ink">{{ formatAmount(interest) }} €</strong></span>
    </div>
  </div>
</template>
