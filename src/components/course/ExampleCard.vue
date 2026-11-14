<script setup lang="ts">
import { computed, ref } from 'vue'
import { getExample } from '@/data/examples'
import RichText from '@/components/common/RichText.vue'
import DataTable from './DataTable.vue'
import JournalEntry from './JournalEntry.vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps<{ exampleId: string }>()
const ex = computed(() => getExample(props.exampleId))
const showSteps = ref(true)
</script>

<template>
  <section v-if="ex" class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" :aria-label="ex.title">
    <div class="flex items-baseline justify-between gap-3">
      <h3 class="text-lg font-semibold">{{ ex.sourcePage ? 'Exemple du cours' : 'Exemple du TD' }}</h3>
      <span v-if="ex.sourcePage" class="shrink-0 text-xs text-muted">Diapositive {{ ex.sourcePage }}</span>
    </div>
    <RichText :text="ex.statement" class="mt-2 text-ink-soft" />

    <button class="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink" :aria-expanded="showSteps" @click="showSteps = !showSteps">
      <ChevronDown :size="16" class="transition" :class="{ '-rotate-90': !showSteps }" />
      Calcul pas à pas
    </button>
    <Transition name="page">
      <ol v-if="showSteps" class="mt-3 space-y-2.5 border-l-2 border-capital/40 pl-5">
        <li v-for="(s, i) in ex.steps" :key="i" class="relative text-[0.97rem] text-ink-soft">
          <span class="absolute -left-[29px] top-0.5 grid h-[18px] w-[18px] place-items-center rounded-full bg-capital text-[0.65rem] font-bold text-white">{{ i + 1 }}</span>
          <RichText :text="s" tag="span" />
        </li>
      </ol>
    </Transition>

    <div v-if="ex.table" class="mt-5">
      <p class="mb-2 text-sm font-semibold">{{ ex.title }}</p>
      <DataTable :table="ex.table" />
    </div>
    <div v-if="ex.journal" class="mt-5">
      <JournalEntry :entry="ex.journal" :title="ex.title" />
    </div>
  </section>
</template>
