<script setup lang="ts">
import type { TableData } from '@/types'
defineProps<{ table: TableData }>()
</script>

<template>
  <figure>
    <div class="overflow-x-auto rounded-2xl border border-line bg-surface" tabindex="0" role="region" :aria-label="table.caption ?? 'Tableau'">
      <table class="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr class="bg-surface-2/70">
            <th v-for="(h, i) in table.headers" :key="i" scope="col" class="px-3 py-3 text-left align-bottom font-semibold leading-snug text-ink" :class="{ 'text-right': table.numericCols?.includes(i) }">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in table.rows" :key="r" class="border-t border-line" :class="r === table.highlightRow ? 'bg-brass-soft/60' : ''">
            <td
              v-for="(cell, c) in row"
              :key="c"
              class="px-3 py-2.5"
              :class="[table.numericCols?.includes(c) ? 'num whitespace-nowrap text-right text-ink' : 'text-ink-soft', c === 0 ? 'font-semibold text-ink' : '']"
            >{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <figcaption v-if="table.caption" class="mt-2 text-sm text-muted">{{ table.caption }}</figcaption>
  </figure>
</template>
