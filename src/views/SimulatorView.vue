<script setup lang="ts">
import KineticTitle from '@/components/common/KineticTitle.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Landmark, Percent, Factory, Users } from 'lucide-vue-next'
import LoanLab from '@/components/simulator/LoanLab.vue'
import TvaLab from '@/components/simulator/TvaLab.vue'
import ImmoLab from '@/components/simulator/ImmoLab.vue'
import PaieLab from '@/components/simulator/PaieLab.vue'

const route = useRoute()
const router = useRouter()
const labs = [
  { id: 'emprunt', label: 'Emprunt', titre: 'Titre 4', icon: Landmark },
  { id: 'tva', label: 'TVA', titre: 'Titre 2', icon: Percent },
  { id: 'immobilisation', label: 'Immobilisation', titre: 'Titre 3', icon: Factory },
  { id: 'paie', label: 'Paie', titre: 'Titre 2', icon: Users },
] as const
type LabId = (typeof labs)[number]['id']
const current = computed<LabId>(() => (labs.some((l) => l.id === route.query.labo) ? (route.query.labo as LabId) : 'emprunt'))
function open(id: LabId) {
  router.replace({ query: id === 'emprunt' ? {} : { labo: id } })
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header>
      <KineticTitle text="Le labo" />
      <p class="mt-3 max-w-2xl text-lg text-ink-soft">Quatre simulateurs pour manipuler les règles du cours : chaque chiffre est recalculé en direct, avec les écritures comptables qui vont avec.</p>
    </header>
    <nav class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Simulateurs">
      <button
        v-for="l in labs"
        :key="l.id"
        role="tab"
        :aria-selected="current === l.id"
        class="group flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition"
        :class="current === l.id ? 'border-deep bg-deep text-on-deep' : 'border-line bg-surface hover:border-ink/40'"
        @click="open(l.id)"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition group-hover:scale-105" :class="current === l.id ? 'bg-brass-bright text-[#2b1a00]' : 'bg-surface-2 text-ink'"><component :is="l.icon" :size="20" /></span>
        <span><span class="block font-semibold">{{ l.label }}</span><span class="block text-xs opacity-70">{{ l.titre }}</span></span>
      </button>
    </nav>
    <div class="mt-8">
      <Transition name="page" mode="out-in">
        <LoanLab v-if="current === 'emprunt'" key="emprunt" />
        <TvaLab v-else-if="current === 'tva'" key="tva" />
        <ImmoLab v-else-if="current === 'immobilisation'" key="immo" />
        <PaieLab v-else key="paie" />
      </Transition>
    </div>
  </div>
</template>
