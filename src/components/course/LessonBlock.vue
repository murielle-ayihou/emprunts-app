<script setup lang="ts">
import type { LessonBlock } from '@/types'
import RichText from '@/components/common/RichText.vue'
import FormulaCard from './FormulaCard.vue'
import ExampleCard from './ExampleCard.vue'
import DataTable from './DataTable.vue'
import JournalEntry from './JournalEntry.vue'
import QuickCheck from './QuickCheck.vue'
import FinancingDiagram from './FinancingDiagram.vue'
import PaymentSplitDiagram from './PaymentSplitDiagram.vue'
import MethodsDiagram from './MethodsDiagram.vue'
import MethodsChart from './MethodsChart.vue'
import TAccount from './TAccount.vue'
import ComptaProcess from './diagrams/ComptaProcess.vue'
import FluxEchange from './diagrams/FluxEchange.vue'
import BilanSchema from './diagrams/BilanSchema.vue'
import TvaChain from './diagrams/TvaChain.vue'
import PaieSchema from './diagrams/PaieSchema.vue'
import PaieCalendrier from './diagrams/PaieCalendrier.vue'
import ImmoPhases from './diagrams/ImmoPhases.vue'
import PeriodiciteChart from './diagrams/PeriodiciteChart.vue'
import { AlertTriangle, Lightbulb, FileWarning } from 'lucide-vue-next'

defineProps<{ block: LessonBlock }>()
</script>

<template>
  <RichText v-if="block.type === 'text'" :text="block.text" class="prose-lesson" />

  <h2 v-else-if="block.type === 'heading'" class="pt-4 text-2xl font-semibold">{{ block.text }}</h2>

  <section v-else-if="block.type === 'definition'" class="rounded-[20px] border-l-[6px] border-capital bg-capital-soft/60 p-5 sm:p-6">
    <p class="text-sm font-semibold text-capital">Définition</p>
    <h3 class="mt-0.5 text-xl font-semibold">{{ block.term }}</h3>
    <RichText :text="block.text" class="prose-lesson mt-2" />
  </section>

  <FormulaCard v-else-if="block.type === 'formula'" :formula-id="block.formulaId" />
  <ExampleCard v-else-if="block.type === 'example'" :example-id="block.exampleId" />
  <DataTable v-else-if="block.type === 'table'" :table="block.table" />

  <section v-else-if="block.type === 'steps'" class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6">
    <h3 class="text-lg font-semibold">{{ block.title }}</h3>
    <ol class="mt-3 space-y-2.5 border-l-2 border-capital/40 pl-5">
      <li v-for="(s, i) in block.items" :key="i" class="relative text-[0.97rem] text-ink-soft">
        <span class="absolute -left-[29px] top-0.5 grid h-[18px] w-[18px] place-items-center rounded-full bg-capital text-[0.65rem] font-bold text-white">{{ i + 1 }}</span>
        <RichText :text="s" tag="span" />
      </li>
    </ol>
  </section>

  <aside v-else-if="block.type === 'warning'" class="flex gap-3 rounded-[20px] bg-ko-soft/70 p-5" role="note">
    <AlertTriangle :size="22" class="mt-0.5 shrink-0 text-ko" />
    <div>
      <p class="font-semibold text-ink">{{ block.title }}</p>
      <RichText :text="block.text" class="mt-1 text-ink-soft" />
    </div>
  </aside>

  <aside v-else-if="block.type === 'tip'" class="flex gap-3 rounded-[20px] bg-brass-soft/70 p-5" role="note">
    <Lightbulb :size="22" class="mt-0.5 shrink-0 text-brass" />
    <div>
      <p class="font-semibold text-ink">{{ block.title }}</p>
      <RichText :text="block.text" class="mt-1 text-ink-soft" />
    </div>
  </aside>

  <aside v-else-if="block.type === 'note'" class="flex gap-3 rounded-[20px] border border-dashed border-line p-5" role="note">
    <FileWarning :size="22" class="mt-0.5 shrink-0 text-muted" />
    <div>
      <p class="font-semibold text-ink">{{ block.title }}</p>
      <RichText :text="block.text" class="mt-1 text-sm text-ink-soft" />
    </div>
  </aside>

  <section v-else-if="block.type === 'summary'" class="rounded-[20px] bg-deep p-5 text-on-deep sm:p-6">
    <h3 class="text-lg font-semibold !text-on-deep">À retenir</h3>
    <ul class="mt-3 space-y-2">
      <li v-for="(s, i) in block.items" :key="i" class="flex gap-2.5 text-[0.97rem] opacity-90">
        <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-bright" />
        <RichText :text="s" tag="span" />
      </li>
    </ul>
  </section>

  <JournalEntry v-else-if="block.type === 'journal'" :entry="block.entry" :title="block.title" />
  <TAccount v-else-if="block.type === 'taccount'" :account="block.account" />
  <ul v-else-if="block.type === 'list'" class="prose-lesson list-disc space-y-1 pl-6">
    <li v-for="(it, i) in block.items" :key="i"><RichText :text="it" tag="span" /></li>
  </ul>
  <QuickCheck v-else-if="block.type === 'quickcheck'" :check="block.check" />

  <template v-else-if="block.type === 'diagram'">
    <FinancingDiagram v-if="block.kind === 'financing'" />
    <PaymentSplitDiagram v-else-if="block.kind === 'payment-split'" />
    <MethodsDiagram v-else-if="block.kind === 'methods'" />
    <MethodsChart v-else-if="block.kind === 'methods-chart'" />
    <ComptaProcess v-else-if="block.kind === 'compta-process'" />
    <FluxEchange v-else-if="block.kind === 'flux-echange'" />
    <BilanSchema v-else-if="block.kind === 'bilan-schema'" />
    <TvaChain v-else-if="block.kind === 'tva-chain'" />
    <PaieSchema v-else-if="block.kind === 'paie-schema'" />
    <PaieCalendrier v-else-if="block.kind === 'paie-calendrier'" />
    <ImmoPhases v-else-if="block.kind === 'immo-phases'" />
    <PeriodiciteChart v-else-if="block.kind === 'periodicite-chart'" />
  </template>
</template>
