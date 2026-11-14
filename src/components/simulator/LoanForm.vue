<script setup lang="ts">
import { computed } from 'vue'
import { LIMITS, METHOD_LABELS, type LoanMethod, type LoanParams, type PeriodsPerYear } from '@/services/loan'
import { Info } from 'lucide-vue-next'

const model = defineModel<LoanParams>({ required: true })
const props = withDefaults(defineProps<{ idPrefix: string; compact?: boolean }>(), { compact: false })
const methods: LoanMethod[] = ['in-fine', 'amortissement-constant', 'annuite-constante']

function update<K extends keyof LoanParams>(k: K, v: LoanParams[K]) {
  model.value = { ...model.value, [k]: v }
}
function num(e: Event): number {
  const raw = (e.target as HTMLInputElement).value.replace(/\s/g, '').replace(',', '.')
  return raw === '' ? NaN : Number(raw)
}
const capitalErr = computed(() => !(model.value.capital >= LIMITS.capitalMin && model.value.capital <= LIMITS.capitalMax))
const rateErr = computed(() => !(model.value.ratePercent >= LIMITS.rateMin && model.value.ratePercent <= LIMITS.rateMax))
const yearsErr = computed(() => !(Number.isInteger(model.value.years) && model.value.years >= LIMITS.yearsMin && model.value.years <= LIMITS.yearsMax))
const id = (s: string) => `${props.idPrefix}-${s}`
</script>

<template>
  <div class="space-y-5">
    <div>
      <div class="flex items-baseline justify-between">
        <label :for="id('capital')" class="font-semibold">Capital emprunté</label>
        <span class="text-xs text-muted">en €</span>
      </div>
      <input :id="id('capital')" class="field num mt-1.5 text-lg" inputmode="decimal" :value="Number.isFinite(model.capital) ? model.capital : ''" :aria-invalid="capitalErr" @input="update('capital', num($event))" />
      <input v-if="!compact" type="range" class="mt-3 w-full accent-[var(--capital)]" min="1000" max="500000" step="1000" :value="Math.min(500000, model.capital || 0)" :aria-label="'Capital (curseur)'" @input="update('capital', num($event))" />
      <p v-if="capitalErr" class="mt-1 text-sm text-ko">Entre {{ LIMITS.capitalMin }} € et {{ LIMITS.capitalMax.toLocaleString('fr-FR') }} €.</p>
    </div>

    <div class="grid gap-5" :class="compact ? '' : 'sm:grid-cols-2'">
      <div>
        <div class="flex items-baseline justify-between">
          <label :for="id('rate')" class="font-semibold">Taux annuel fixe</label>
          <span class="text-xs text-muted">en %</span>
        </div>
        <input :id="id('rate')" class="field num mt-1.5 text-lg" inputmode="decimal" :value="Number.isFinite(model.ratePercent) ? model.ratePercent : ''" :aria-invalid="rateErr" @input="update('ratePercent', num($event))" />
        <input v-if="!compact" type="range" class="mt-3 w-full accent-[var(--interest)]" min="0" max="15" step="0.05" :value="model.ratePercent || 0" aria-label="Taux (curseur)" @input="update('ratePercent', num($event))" />
        <p v-if="rateErr" class="mt-1 text-sm text-ko">Entre {{ LIMITS.rateMin }} % et {{ LIMITS.rateMax }} %.</p>
      </div>
      <div>
        <div class="flex items-baseline justify-between">
          <label :for="id('years')" class="font-semibold">Durée</label>
          <span class="text-xs text-muted">en années</span>
        </div>
        <input :id="id('years')" class="field num mt-1.5 text-lg" inputmode="numeric" :value="Number.isFinite(model.years) ? model.years : ''" :aria-invalid="yearsErr" @input="update('years', num($event))" />
        <input v-if="!compact" type="range" class="mt-3 w-full accent-[var(--ink)]" min="1" max="30" step="1" :value="model.years || 1" aria-label="Durée (curseur)" @input="update('years', num($event))" />
        <p v-if="yearsErr" class="mt-1 text-sm text-ko">Nombre entier entre {{ LIMITS.yearsMin }} et {{ LIMITS.yearsMax }}.</p>
      </div>
    </div>

    <fieldset>
      <legend class="font-semibold">Modalité de remboursement</legend>
      <div class="mt-2 grid gap-2" :class="compact ? '' : 'sm:grid-cols-3'">
        <label
          v-for="m in methods"
          :key="m"
          class="cursor-pointer rounded-xl border-2 px-3.5 py-2.5 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus"
          :class="model.method === m ? 'border-ink bg-deep text-on-deep' : 'border-line bg-surface hover:border-ink/40'"
        >
          <input type="radio" class="sr-only" :name="id('method')" :value="m" :checked="model.method === m" @change="update('method', m)" />
          {{ METHOD_LABELS[m] }}
        </label>
      </div>
    </fieldset>

    <div class="grid gap-3" :class="compact ? '' : 'sm:grid-cols-2'">
      <div>
        <label :for="id('period')" class="font-semibold">Périodicité des échéances</label>
        <select :id="id('period')" class="field mt-1.5" :value="model.periodsPerYear ?? 1" @change="update('periodsPerYear', Number(($event.target as HTMLSelectElement).value) as PeriodsPerYear)">
          <option :value="1">Annuelle</option>
          <option :value="2">Semestrielle</option>
          <option :value="4">Trimestrielle</option>
          <option :value="12">Mensuelle</option>
        </select>
      </div>
      <label v-if="(model.periodsPerYear ?? 1) > 1" class="flex cursor-pointer items-start gap-2.5 self-end rounded-xl bg-surface-2/70 p-3 text-sm">
        <input type="checkbox" class="mt-0.5 h-4 w-4 accent-[var(--capital)]" :checked="model.rateRounding === 'td'" @change="update('rateRounding', ($event.target as HTMLInputElement).checked ? 'td' : 'exact')" />
        <span>Arrondir le taux périodique à 3 décimales, comme la correction du TD n°5</span>
      </label>
    </div>
    <p v-if="!compact && (model.periodsPerYear ?? 1) > 1" class="flex gap-1.5 text-xs text-muted"><Info :size="14" class="mt-px shrink-0" />Taux équivalent : (1 + i)^(1/k) − 1, comme dans le TD n°5. Le cours magistral ne présente que des échéances annuelles.</p>
    <p v-if="!compact" class="flex gap-1.5 text-xs text-muted"><Info :size="14" class="mt-px shrink-0" />Taux fixe uniquement. Les intérêts « capitalisés » (in fine) et le taux variable ne sont pas détaillés dans le support.</p>
  </div>
</template>
